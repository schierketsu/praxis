from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import University, Company, Internship, Student


class UniversitySerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = ['id', 'name', 'institution_type']


class CompanySerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Company
        fields = ['id', 'name', 'description', 'website', 'address', 'latitude', 'longitude', 'logo_url']
    
    def get_logo_url(self, obj):
        if obj.logo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.logo.url)
            return obj.logo.url
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


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    university_name = serializers.CharField(source='university.name', read_only=True)
    
    class Meta:
        model = Student
        fields = [
            'id', 'user', 'university', 'university_name', 'course', 
            'specialization', 'phone', 'bio', 'skills', 'interests', 
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
