from django.contrib import admin
from .models import University, Company, Internship, Student


@admin.register(University)
class UniversityAdmin(admin.ModelAdmin):
    list_display = ['name', 'institution_type', 'created_at']
    list_filter = ['institution_type', 'created_at']
    search_fields = ['name']
    ordering = ['name']


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'website', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'description']
    ordering = ['name']


@admin.register(Internship)
class InternshipAdmin(admin.ModelAdmin):
    list_display = ['company', 'position', 'location', 'start_date', 'end_date', 'is_active']
    list_filter = ['is_active', 'start_date', 'end_date', 'company', 'location']
    search_fields = ['position', 'description', 'company__name']
    filter_horizontal = ['universities']
    ordering = ['-created_at']


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['user', 'university', 'course', 'specialization', 'is_active', 'created_at']
    list_filter = ['is_active', 'course', 'university', 'created_at']
    search_fields = ['user__username', 'user__first_name', 'user__last_name', 'specialization']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('user', 'university', 'course', 'specialization', 'is_active')
        }),
        ('Контактная информация', {
            'fields': ('phone', 'bio')
        }),
        ('Дополнительно', {
            'fields': ('skills', 'interests'),
            'classes': ('collapse',)
        }),
        ('Системная информация', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
