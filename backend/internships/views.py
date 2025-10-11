from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as filters_drf
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import University, Company, Internship
from .serializers import UniversitySerializer, CompanySerializer, InternshipSerializer


class InternshipFilter(filters_drf.FilterSet):
    """Фильтры для практик"""
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
        fields = ['company_name', 'location', 'university', 'tech_stack']


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
