from rest_framework import viewsets, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as filters_drf
from rest_framework.decorators import action
from django.contrib.auth import login, logout
from django.contrib.auth.models import User
import json
from .models import University, Company, Internship, Student, Application, Review
from .serializers import (
    UniversitySerializer, CompanySerializer, InternshipSerializer,
    StudentSerializer, StudentRegistrationSerializer, LoginSerializer,
    ApplicationSerializer, ApplicationCreateSerializer, ReviewSerializer, ReviewCreateSerializer
)
from .utils import send_application_notification_email


class InternshipFilter(filters_drf.FilterSet):
    """Фильтры для практик"""
    company = filters_drf.NumberFilter(
        field_name='company__id',
        label='ID компании'
    )
    company_name = filters_drf.CharFilter(
        field_name='company__name',
        lookup_expr='icontains',
        label='Компания'
    )
    location = filters_drf.CharFilter(
        field_name='location',
        lookup_expr='icontains',
        label='Локация'
    )
    university = filters_drf.ModelChoiceFilter(
        field_name='universities',
        queryset=University.objects.all(),
        label='Учебное заведение'
    )
    tech_stack = filters_drf.CharFilter(
        method='filter_tech_stack',
        label='Технология'
    )
    
    def filter_tech_stack(self, queryset, name, value):
        if value and value.strip():
            # Разделяем по запятым и ищем каждую технологию
            techs = [tech.strip() for tech in value.split(',') if tech.strip()]
            # Фильтруем практики, у которых tech_stack содержит хотя бы одну из указанных технологий
            filtered_ids = []
            for internship in queryset:
                if internship.tech_stack:
                    # Проверяем, есть ли хотя бы одна из выбранных технологий в tech_stack
                    has_matching_tech = any(
                        any(tech.lower() == str(t).lower() for t in internship.tech_stack) 
                        for tech in techs
                    )
                    if has_matching_tech:
                        filtered_ids.append(internship.id)
            return queryset.filter(id__in=filtered_ids)
        return queryset
    
    class Meta:
        model = Internship
        fields = ['company', 'company_name', 'location', 'university', 'tech_stack']


class UniversityViewSet(viewsets.ReadOnlyModelViewSet):
    """API для университетов"""
    queryset = University.objects.all()
    serializer_class = UniversitySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


class CompanyViewSet(viewsets.ReadOnlyModelViewSet):
    """API для компаний"""
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    
    @action(detail=False, methods=['get'])
    def with_internships(self, request):
        """Получить компании с их практиками"""
        try:
            # Получаем все активные практики
            all_internships = Internship.objects.filter(is_active=True).select_related('company').prefetch_related('universities')
            
            # Применяем фильтры к практикам
            internship_filter = InternshipFilter(request.GET, queryset=all_internships)
            filtered_internships = internship_filter.qs
            
            # Получаем уникальные компании из отфильтрованных практик
            company_ids = filtered_internships.values_list('company_id', flat=True).distinct()
            companies = Company.objects.filter(id__in=company_ids)
            
            # Группируем практики по компаниям
            companies_data = []
            for company in companies:
                # Показываем только отфильтрованные практики для каждой компании
                company_internships = filtered_internships.filter(company=company)
                if company_internships.exists():  # Показываем компанию только если у неё есть отфильтрованные практики
                    company_data = CompanySerializer(company, context={'request': request}).data
                    company_data['internships'] = InternshipSerializer(company_internships, many=True, context={'request': request}).data
                    companies_data.append(company_data)
            
            return Response(companies_data)
        except Exception as e:
            print(f"Error in with_internships: {e}")
            return Response({'error': str(e)}, status=500)


class InternshipViewSet(viewsets.ReadOnlyModelViewSet):
    """API для практик"""
    queryset = Internship.objects.filter(is_active=True).select_related('company').prefetch_related('universities')
    serializer_class = InternshipSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    filterset_class = InternshipFilter
    search_fields = ['position', 'description', 'location', 'company__name']
    ordering_fields = ['start_date', 'end_date', 'created_at']
    ordering = ['-created_at']
    
    @action(detail=False, methods=['get'])
    def available_techs(self, request):
        """Получить доступные технологии для текущих фильтров"""
        # Применяем те же фильтры, что и для основного запроса
        filtered_queryset = self.filter_queryset(self.get_queryset())
        
        # Собираем все уникальные технологии из отфильтрованных практик
        all_techs = set()
        for internship in filtered_queryset:
            if internship.tech_stack:
                all_techs.update(internship.tech_stack)
        
        return Response(sorted(list(all_techs)))


# API endpoints для авторизации
@api_view(['POST'])
@permission_classes([AllowAny])
def student_register(request):
    """Регистрация студента"""
    serializer = StudentRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        try:
            student = serializer.save()
            return Response({
                'message': 'Регистрация успешна',
                'student_id': student.id,
                'username': student.user.username
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'error': f'Ошибка при создании аккаунта: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def student_login(request):
    """Вход студента"""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        login(request, user)
        
        try:
            student = Student.objects.get(user=user)
            student_data = StudentSerializer(student).data
            return Response({
                'message': 'Вход выполнен успешно',
                'student': student_data
            }, status=status.HTTP_200_OK)
        except Student.DoesNotExist:
            return Response({
                'error': 'Профиль студента не найден'
            }, status=status.HTTP_404_NOT_FOUND)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def student_logout(request):
    """Выход студента"""
    logout(request)
    return Response({
        'message': 'Выход выполнен успешно'
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_profile(request):
    """Получить профиль студента"""
    try:
        student = Student.objects.get(user=request.user)
        print(f"Student profile requested for user: {request.user.username}")
        print(f"Student resume field: {student.resume}")
        print(f"Student resume type: {type(student.resume)}")
        if student.resume:
            print(f"Resume file name: {student.resume.name}")
        serializer = StudentSerializer(student, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Student.DoesNotExist:
        return Response({
            'error': 'Профиль студента не найден'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def student_update_profile(request):
    """Обновить профиль студента"""
    try:
        student = Student.objects.get(user=request.user)
        
        # Создаем новый словарь с правильными данными
        data = {}
        
        # Копируем все поля кроме skills и interests
        for key, value in request.data.items():
            if key not in ['skills', 'interests']:
                if isinstance(value, list) and len(value) == 1:
                    data[key] = value[0]
                else:
                    data[key] = value
        
        # Добавляем файлы из request.FILES
        if 'resume' in request.FILES:
            data['resume'] = request.FILES['resume']
        elif 'resume' in request.data and request.data['resume'] == '':
            # Если пользователь удалил резюме, устанавливаем None
            data['resume'] = None
        
        # Обрабатываем skills и interests
        if 'skills' in request.data:
            skills_value = request.data['skills']
            if isinstance(skills_value, str):
                try:
                    data['skills'] = json.loads(skills_value)
                except json.JSONDecodeError:
                    data['skills'] = []
            elif isinstance(skills_value, list):
                # Если это список списков (QueryDict), берем первый элемент
                if len(skills_value) > 0 and isinstance(skills_value[0], list):
                    data['skills'] = skills_value[0]
                # Если пустой список, оставляем пустым
                elif len(skills_value) == 0:
                    data['skills'] = []
            else:
                data['skills'] = []
        else:
            data['skills'] = []
        
        if 'interests' in request.data:
            interests_value = request.data['interests']
            if isinstance(interests_value, str):
                try:
                    data['interests'] = json.loads(interests_value)
                except json.JSONDecodeError:
                    data['interests'] = []
            elif isinstance(interests_value, list):
                # Если это список списков (QueryDict), берем первый элемент
                if len(interests_value) > 0 and isinstance(interests_value[0], list):
                    data['interests'] = interests_value[0]
                # Если пустой список, оставляем пустым
                elif len(interests_value) == 0:
                    data['interests'] = []
            else:
                data['interests'] = []
        else:
            data['interests'] = []
        
        serializer = StudentSerializer(student, data=data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Профиль обновлен успешно',
                'student': serializer.data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Student.DoesNotExist:
        return Response({
            'error': 'Профиль студента не найден'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([AllowAny])
def check_auth_status(request):
    """Проверить статус авторизации"""
    if request.user.is_authenticated:
        try:
            student = Student.objects.get(user=request.user)
            return Response({
                'authenticated': True,
                'student': StudentSerializer(student).data
            })
        except Student.DoesNotExist:
            return Response({
                'authenticated': True,
                'student': None
            })
    return Response({
        'authenticated': False,
        'student': None
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def get_csrf_token(request):
    """Получить CSRF токен"""
    from django.middleware.csrf import get_token
    csrf_token = get_token(request)
    return Response({
        'csrfToken': csrf_token
    })


class ApplicationViewSet(viewsets.ModelViewSet):
    """API для заявок студентов"""
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        """Переопределяем create для лучшей обработки ошибок и отправки email"""
        try:
            # Создаем заявку
            response = super().create(request, *args, **kwargs)
            
            # Если заявка создана успешно, отправляем email уведомление
            if response.status_code == status.HTTP_201_CREATED:
                try:
                    # Получаем созданную заявку по студенту и практике
                    student = Student.objects.get(user=request.user)
                    internship_id = request.data.get('internship')
                    application = Application.objects.filter(
                        student=student,
                        internship_id=internship_id
                    ).first()
                    
                    if application:
                        # Отправляем email уведомление
                        send_application_notification_email(application)
                except Exception as email_error:
                    # Логируем ошибку, но не прерываем выполнение
                    pass
            
            return response
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def get_queryset(self):
        """Возвращаем только заявки текущего студента"""
        try:
            student = Student.objects.get(user=self.request.user)
            return Application.objects.filter(student=student).select_related('internship__company')
        except Student.DoesNotExist:
            return Application.objects.none()
    
    def get_serializer_class(self):
        """Используем разные сериализаторы для создания и просмотра"""
        if self.action == 'create':
            return ApplicationCreateSerializer
        return ApplicationSerializer
    
    
    def update(self, request, *args, **kwargs):
        """Разрешаем только изменение статуса на 'cancelled'"""
        instance = self.get_object()
        if request.data.get('status') == 'cancelled':
            instance.status = 'cancelled'
            instance.save()
            return Response(ApplicationSerializer(instance).data)
        return Response({'error': 'Можно только отменить заявку'}, status=400)


class ReviewViewSet(viewsets.ModelViewSet):
    """API для отзывов студентов о компаниях"""
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Возвращаем отзывы для конкретной компании или все отзывы студента"""
        company_id = self.request.query_params.get('company')
        if company_id:
            return Review.objects.filter(company_id=company_id).select_related('student__user')
        
        # Если студент авторизован, показываем его отзывы
        try:
            student = Student.objects.get(user=self.request.user)
            return Review.objects.filter(student=student).select_related('company')
        except Student.DoesNotExist:
            return Review.objects.none()
    
    def get_serializer_class(self):
        """Используем разные сериализаторы для создания и просмотра"""
        if self.action == 'create':
            return ReviewCreateSerializer
        return ReviewSerializer
    
    def create(self, request, *args, **kwargs):
        """Создание отзыва с проверкой на дубликаты"""
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
