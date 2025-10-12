from django.contrib import admin
from django.contrib import messages
from django.utils.html import format_html
from django import forms
from .models import University, Company, Internship, Student, Application


class StudentAdminForm(forms.ModelForm):
    """Кастомная форма для редактирования студента в админке"""
    
    # Создаем кастомные поля, которые не связаны с моделью напрямую
    skills_text = forms.CharField(
        label='Навыки',
        widget=forms.Textarea(attrs={'rows': 3, 'placeholder': 'Введите навыки через запятую'}),
        required=False,
        help_text='Введите навыки через запятую'
    )
    interests_text = forms.CharField(
        label='Интересы',
        widget=forms.Textarea(attrs={'rows': 3, 'placeholder': 'Введите интересы через запятую'}),
        required=False,
        help_text='Введите интересы через запятую'
    )
    
    class Meta:
        model = Student
        fields = '__all__'
        exclude = ['skills', 'interests']  # Исключаем JSON поля из стандартной обработки
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # Преобразуем JSON поля в строки для отображения
        if self.instance and self.instance.pk:
            if self.instance.skills:
                self.initial['skills_text'] = ', '.join(self.instance.skills)
            if self.instance.interests:
                self.initial['interests_text'] = ', '.join(self.instance.interests)
    
    def clean_skills_text(self):
        """Преобразуем строку навыков в JSON список"""
        skills_text = self.cleaned_data.get('skills_text', '')
        if skills_text and skills_text.strip():
            # Разделяем по запятым и очищаем от пробелов
            skills_list = [skill.strip() for skill in skills_text.split(',') if skill.strip()]
            return skills_list
        return []
    
    def clean_interests_text(self):
        """Преобразуем строку интересов в JSON список"""
        interests_text = self.cleaned_data.get('interests_text', '')
        if interests_text and interests_text.strip():
            # Разделяем по запятым и очищаем от пробелов
            interests_list = [interest.strip() for interest in interests_text.split(',') if interest.strip()]
            return interests_list
        return []
    
    def clean(self):
        """Общая валидация формы"""
        cleaned_data = super().clean()
        
        # Преобразуем текстовые поля в JSON списки
        if 'skills_text' in cleaned_data:
            cleaned_data['skills'] = self.clean_skills_text()
        if 'interests_text' in cleaned_data:
            cleaned_data['interests'] = self.clean_interests_text()
        
        return cleaned_data
    
    def save(self, commit=True):
        """Сохраняем данные с правильным преобразованием JSON полей"""
        instance = super().save(commit=False)
        
        # Устанавливаем JSON поля напрямую из текстовых полей
        if hasattr(self, 'cleaned_data') and self.cleaned_data:
            if 'skills' in self.cleaned_data:
                skills_data = self.cleaned_data['skills']
                instance.skills = skills_data
            if 'interests' in self.cleaned_data:
                interests_data = self.cleaned_data['interests']
                instance.interests = interests_data
        
        if commit:
            instance.save()
        return instance


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
    form = StudentAdminForm
    list_display = ['user', 'university', 'course', 'specialization', 'resume_status', 'is_active', 'created_at']
    list_filter = ['is_active', 'course', 'university', 'created_at']
    search_fields = ['user__username', 'user__first_name', 'user__last_name', 'specialization']
    readonly_fields = ['created_at', 'updated_at', 'resume_display']
    exclude = ['resume']
    ordering = ['-created_at']
    actions = ['delete_resume', 'clear_resume']
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('user', 'university', 'course', 'specialization', 'is_active')
        }),
        ('Контактная информация', {
            'fields': ('phone', 'bio')
        }),
        ('Резюме', {
            'fields': ('resume_display',),
            
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
    
    def resume_status(self, obj):
        if obj.resume:
            return format_html(
                '<span style="color: green;">✓ Есть резюме</span><br>'
                '<a href="{}" target="_blank" style="font-size: 12px;">Скачать</a>',
                obj.resume.url
            )
        return format_html('<span style="color: red;">✗ Нет резюме</span>')
    resume_status.short_description = 'Резюме'
    
    def resume_display(self, obj):
        """Отображение резюме в форме редактирования"""
        if obj.resume:
            # Получаем размер файла
            try:
                file_size = obj.resume.size
                size_mb = file_size / (1024 * 1024)
                size_text = f"{size_mb:.2f} MB"
            except:
                size_text = "Неизвестно"
            
            return format_html(
                '<div style="padding: 15px; background: #f0f9ff; border: 1px solid #e6f7ff; border-radius: 6px; margin-bottom: 10px;">'
                '<div style="display: flex; align-items: center; margin-bottom: 10px;">'
                '<span style="font-size: 20px; margin-right: 8px;">📄</span>'
                '<strong style="color: #1890ff;">Текущее резюме</strong>'
                '</div>'
                '<div style="margin-bottom: 10px;">'
                '<strong>Файл:</strong> <span style="color: #1890ff;">{}</span><br>'
                '<strong>Размер:</strong> <span style="color: #666;">{}</span>'
                '</div>'
                '<div style="border-top: 1px solid #e6f7ff; padding-top: 10px;">'
                '<a href="{}" target="_blank" style="color: #1890ff; text-decoration: none; margin-right: 15px;">'
                '🔗 Скачать резюме</a>'
                '<a href="#" class="delete-resume-btn" style="color: #ff4d4f; text-decoration: none;">'
                '🗑️ Удалить резюме</a>'
                '</div>'
                '</div>',
                obj.resume.name,
                size_text,
                obj.resume.url
            )
        return format_html(
            '<div style="padding: 15px; background: #fff2f0; border: 1px solid #ffccc7; border-radius: 6px; margin-bottom: 10px;">'
            '<div style="display: flex; align-items: center;">'
            '<span style="font-size: 20px; margin-right: 8px;">⚠️</span>'
            '<span style="color: #ff4d4f; font-weight: 500;">Резюме не загружено</span>'
            '</div>'
            '</div>'
        )
    resume_display.short_description = 'Информация о резюме'
    
    def delete_resume(self, request, queryset):
        """Удалить резюме у выбранных студентов"""
        updated = 0
        for student in queryset:
            if student.resume:
                # Удаляем файл с диска
                student.resume.delete(save=False)
                # Очищаем поле в базе данных
                student.resume = None
                student.save()
                updated += 1
        
        if updated:
            self.message_user(
                request,
                f'Резюме удалено у {updated} студент(ов).',
                messages.SUCCESS
            )
        else:
            self.message_user(
                request,
                'У выбранных студентов нет резюме для удаления.',
                messages.WARNING
            )
    delete_resume.short_description = 'Удалить резюме у выбранных студентов'
    
    def clear_resume(self, request, queryset):
        """Очистить поле резюме (не удалять файл)"""
        updated = queryset.filter(resume__isnull=False).update(resume=None)
        
        if updated:
            self.message_user(
                request,
                f'Поле резюме очищено у {updated} студент(ов).',
                messages.SUCCESS
            )
        else:
            self.message_user(
                request,
                'У выбранных студентов нет резюме для очистки.',
                messages.WARNING
            )
    clear_resume.short_description = 'Очистить поле резюме (не удалять файл)'
    
    class Media:
        js = ('admin/js/resume_admin.js',)


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ['student', 'internship', 'status', 'created_at']
    list_filter = ['status', 'created_at', 'internship__company']
    search_fields = ['student__user__username', 'student__user__first_name', 'student__user__last_name', 'internship__position']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('student', 'internship', 'status')
        }),
        ('Комментарий', {
            'fields': ('comment',)
        }),
        ('Системная информация', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
