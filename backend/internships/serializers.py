from rest_framework import serializers
from .models import University, Company, Internship


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
