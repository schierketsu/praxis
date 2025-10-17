from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import University, Company, Internship, Student, Application, Review


class UniversitySerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = ['id', 'name', 'institution_type']


class CompanySerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    total_reviews = serializers.SerializerMethodField()
    
    class Meta:
        model = Company
        fields = ['id', 'name', 'short_description', 'description', 'website', 'address', 'latitude', 'longitude', 'email', 'logo_url', 'average_rating', 'total_reviews', 'has_blue_checkmark']
    
    def get_logo_url(self, obj):
        if obj.logo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.logo.url)
            return obj.logo.url
        return None
    
    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if reviews.exists():
            return round(sum(review.rating for review in reviews) / reviews.count(), 1)
        return 0.0
    
    def get_total_reviews(self, obj):
        return obj.reviews.count()


class CompanyRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    username = serializers.CharField()
    email = serializers.EmailField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    
    class Meta:
        model = Company
        fields = [
            'username', 'email', 'first_name', 'last_name', 'password', 
            'password_confirm', 'name', 'short_description', 'description', 'website', 'address',
            'latitude', 'longitude'
        ]
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Пользователь с таким именем уже существует")
        return value
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Пользователь с таким email уже существует")
        return value
    
    def validate_name(self, value):
        if Company.objects.filter(name=value).exists():
            raise serializers.ValidationError("Компания с таким названием уже существует")
        return value
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Пароли не совпадают")
        return attrs
    
    def create(self, validated_data):
        # Создаем пользователя
        user_data = {
            'username': validated_data['username'],
            'email': validated_data['email'],
            'first_name': validated_data['first_name'],
            'last_name': validated_data['last_name'],
            'password': validated_data['password']
        }
        
        user = User.objects.create_user(
            username=user_data['username'],
            email=user_data['email'],
            first_name=user_data['first_name'],
            last_name=user_data['last_name'],
            password=user_data['password']
        )
        
        # Создаем профиль компании
        company_data = {
            'user': user,
            'name': validated_data.get('name'),
            'description': validated_data.get('description', ''),
            'website': validated_data.get('website', ''),
            'address': validated_data.get('address', ''),
            'latitude': validated_data.get('latitude'),
            'longitude': validated_data.get('longitude'),
            'email': validated_data.get('email'),
            'is_verified': False,  # Требует модерации
            'is_active': True
        }
        
        company = Company.objects.create(**company_data)
        return company


class CompanyProfileSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    
    class Meta:
        model = Company
        fields = [
            'id', 'user', 'name', 'description', 'website', 'address',
            'latitude', 'longitude', 'email', 'logo', 'is_verified', 
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'is_verified', 'user']
    
    def get_user(self, obj):
        if obj.user:
            return {
                'id': obj.user.id,
                'username': obj.user.username,
                'first_name': obj.user.first_name,
                'last_name': obj.user.last_name,
                'email': obj.user.email
            }
        return None


class InternshipSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)
    universities = UniversitySerializer(many=True, read_only=True)
    company_id = serializers.IntegerField(write_only=True)
    university_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Internship
        fields = [
            'id', 'company', 'position', 'description', 'location',
            'start_date', 'end_date', 'requirements', 'tech_stack',
            'available_positions', 'universities', 
            'is_active', 'created_at', 'company_id', 'university_ids'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def create(self, validated_data):
        # Извлекаем university_ids из validated_data
        university_ids = validated_data.pop('university_ids', [])
        
        # Создаем практику
        internship = Internship.objects.create(**validated_data)
        
        # Добавляем связи с университетами
        if university_ids:
            universities = University.objects.filter(id__in=university_ids)
            internship.universities.set(universities)
        
        return internship
    
    def update(self, instance, validated_data):
        # Извлекаем university_ids из validated_data
        university_ids = validated_data.pop('university_ids', None)
        
        # Обновляем практику
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Обновляем связи с университетами, если они переданы
        if university_ids is not None:
            universities = University.objects.filter(id__in=university_ids)
            instance.universities.set(universities)
        
        return instance


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    university_name = serializers.CharField(source='university.name', read_only=True)
    resume = serializers.FileField(required=False, allow_null=True)
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.resume:
            request = self.context.get('request')
            if request:
                data['resume'] = request.build_absolute_uri(instance.resume.url)
            else:
                data['resume'] = instance.resume.url
        return data
    
    def validate(self, attrs):
        return super().validate(attrs)
    
    class Meta:
        model = Student
        fields = [
            'id', 'user', 'university', 'university_name', 'course', 
            'specialization', 'phone', 'bio', 'resume', 'skills', 'interests', 
            'is_active', 'created_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class StudentRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    username = serializers.CharField()
    email = serializers.EmailField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    university = serializers.IntegerField(required=False, allow_null=True)
    course = serializers.IntegerField(required=False, allow_null=True)
    
    class Meta:
        model = Student
        fields = [
            'username', 'email', 'first_name', 'last_name', 'password', 
            'password_confirm', 'university', 'course', 'specialization', 
            'phone', 'bio', 'skills', 'interests'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Пароли не совпадают")
        return attrs
    
    def create(self, validated_data):
        # Создаем пользователя
        user_data = {
            'username': validated_data['username'],
            'email': validated_data['email'],
            'first_name': validated_data['first_name'],
            'last_name': validated_data['last_name'],
            'password': validated_data['password']
        }
        
        user = User.objects.create_user(
            username=user_data['username'],
            email=user_data['email'],
            first_name=user_data['first_name'],
            last_name=user_data['last_name'],
            password=user_data['password']
        )
        
        # Создаем профиль студента
        student_data = {
            'user': user,
            'university_id': validated_data.get('university'),
            'course': validated_data.get('course'),
            'specialization': validated_data.get('specialization', ''),
            'phone': validated_data.get('phone', ''),
            'bio': validated_data.get('bio', ''),
            'skills': validated_data.get('skills', []),
            'interests': validated_data.get('interests', [])
        }
        
        student = Student.objects.create(**student_data)
        return student


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Неверные учетные данные')
            if not user.is_active:
                raise serializers.ValidationError('Аккаунт деактивирован')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Необходимо указать имя пользователя и пароль')
        
        return attrs


class ApplicationSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.user.get_full_name', read_only=True)
    student_university = serializers.CharField(source='student.university.name', read_only=True)
    student_course = serializers.IntegerField(source='student.course', read_only=True)
    student_specialization = serializers.CharField(source='student.specialization', read_only=True)
    student_bio = serializers.CharField(source='student.bio', read_only=True)
    student_skills = serializers.JSONField(source='student.skills', read_only=True)
    student_interests = serializers.JSONField(source='student.interests', read_only=True)
    student_resume_url = serializers.SerializerMethodField()
    company_name = serializers.CharField(source='internship.company.name', read_only=True)
    position_name = serializers.CharField(source='internship.position', read_only=True)
    applied_date = serializers.DateTimeField(source='created_at', read_only=True)
    cover_letter = serializers.CharField(source='comment', read_only=True)
    
    def get_student_resume_url(self, obj):
        """Получить URL резюме студента"""
        if obj.student.resume:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.student.resume.url)
            return obj.student.resume.url
        return None
    
    def to_representation(self, instance):
        """Переопределяем для правильной обработки дат"""
        data = super().to_representation(instance)
        # Убеждаемся, что applied_date всегда есть
        if not data.get('applied_date') and data.get('created_at'):
            data['applied_date'] = data['created_at']
        
        # Добавляем полную информацию о практике
        if instance.internship:
            data['internship'] = {
                'id': instance.internship.id,
                'position': instance.internship.position,
                'company_name': instance.internship.company.name,
                'description': instance.internship.description,
                'location': instance.internship.location,
                'requirements': instance.internship.requirements,
                'tech_stack': instance.internship.tech_stack,
                'available_positions': instance.internship.available_positions,
                'start_date': instance.internship.start_date,
                'end_date': instance.internship.end_date
            }
        
        # Добавляем полную информацию о студенте
        if instance.student:
            data['student'] = {
                'id': instance.student.id,
                'name': instance.student.user.get_full_name(),
                'email': instance.student.user.email,
                'university': instance.student.university.name if instance.student.university else None,
                'course': instance.student.course,
                'specialization': instance.student.specialization,
                'bio': instance.student.bio,
                'skills': instance.student.skills,
                'interests': instance.student.interests,
                'resume_url': data.get('student_resume_url'),
                'phone': instance.student.phone
            }
        
        # Отладочная информация (закомментировано для продакшена)
        # print(f"ApplicationSerializer - instance: {instance}")
        # print(f"ApplicationSerializer - company_name: {data.get('company_name')}")
        # print(f"ApplicationSerializer - position_name: {data.get('position_name')}")
        
        return data
    
    class Meta:
        model = Application
        fields = [
            'id', 'student', 'internship', 'status', 'comment', 
            'student_name', 'student_university', 'student_course', 'student_specialization',
            'student_bio', 'student_skills', 'student_interests', 'student_resume_url',
            'company_name', 'position_name', 'applied_date', 'cover_letter', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class ApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['company', 'internship', 'comment']
    
    def create(self, validated_data):
        # Получаем студента из контекста запроса
        try:
            student = Student.objects.get(user=self.context['request'].user)
            validated_data['student'] = student
            
            # Добавляем company из internship, если он есть
            if 'internship' in validated_data and validated_data['internship']:
                internship = validated_data['internship']
                validated_data['company'] = internship.company
            
            application = super().create(validated_data)
            # Перезагружаем объект с связанными данными
            return Application.objects.select_related('internship__company', 'student__user').get(id=application.id)
        except Student.DoesNotExist:
            raise serializers.ValidationError('Профиль студента не найден')
        except Exception as e:
            print(f"Ошибка создания заявки: {e}")
            raise


class ReviewSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.user.get_full_name', read_only=True)
    student_user_id = serializers.IntegerField(source='student.user.id', read_only=True)
    company_name = serializers.CharField(source='company.name', read_only=True)
    created_date = serializers.DateTimeField(source='created_at', read_only=True)
    
    class Meta:
        model = Review
        fields = [
            'id', 'student', 'student_user_id', 'company', 'rating', 'comment', 'is_anonymous', 
            'is_verified', 'student_name', 'company_name', 'created_date', 'created_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['company', 'rating', 'comment', 'is_anonymous']
    
    def create(self, validated_data):
        # Получаем студента из контекста запроса
        try:
            student = Student.objects.get(user=self.context['request'].user)
            validated_data['student'] = student
            return super().create(validated_data)
        except Student.DoesNotExist:
            raise serializers.ValidationError('Профиль студента не найден')
