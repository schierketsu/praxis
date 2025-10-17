from django.db import models
from django.contrib.auth.models import User


class University(models.Model):
    """Модель университета или колледжа"""
    UNIVERSITY = 'university'
    COLLEGE = 'college'
    
    INSTITUTION_TYPE_CHOICES = [
        (UNIVERSITY, 'Университет'),
        (COLLEGE, 'Колледж'),
    ]
    
    name = models.CharField(max_length=200, verbose_name='Название')
    institution_type = models.CharField(
        max_length=20,
        choices=INSTITUTION_TYPE_CHOICES,
        default=UNIVERSITY,
        verbose_name='Тип учебного заведения'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Университет'
        verbose_name_plural = 'Университеты'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Company(models.Model):
    """Модель компании"""
    name = models.CharField(max_length=200, verbose_name='Название компании')
    short_description = models.CharField(
        max_length=300, 
        blank=True, 
        verbose_name='Краткое описание',
        help_text='Краткое описание компании (до 300 символов)'
    )
    description = models.TextField(blank=True, verbose_name='Описание')
    website = models.URLField(blank=True, verbose_name='Веб-сайт')
    address = models.CharField(max_length=500, blank=True, verbose_name='Адрес')
    latitude = models.DecimalField(
        max_digits=10, 
        decimal_places=8, 
        null=True, 
        blank=True, 
        verbose_name='Широта'
    )
    longitude = models.DecimalField(
        max_digits=11, 
        decimal_places=8, 
        null=True, 
        blank=True, 
        verbose_name='Долгота'
    )
    logo = models.ImageField(
        upload_to='company_logos/',
        null=True,
        blank=True,
        verbose_name='Логотип компании'
    )
    email = models.EmailField(
        blank=True,
        verbose_name='Email компании',
        help_text='Email для получения уведомлений о заявках'
    )
    # Новые поля для системы аутентификации компаний
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        verbose_name='Пользователь компании',
        help_text='Связанный аккаунт пользователя для входа в систему'
    )
    is_verified = models.BooleanField(
        default=False,
        verbose_name='Подтверждена',
        help_text='Компания прошла модерацию и может публиковать практики'
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name='Активна',
        help_text='Компания активна в системе'
    )
    has_blue_checkmark = models.BooleanField(
        default=False,
        verbose_name='Синяя галочка',
        help_text='Компания официально подтверждена и использует сервис для ответа на заявки'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Компания'
        verbose_name_plural = 'Компании'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Internship(models.Model):
    """Модель практики"""
    
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name='internships',
        verbose_name='Компания'
    )
    position = models.CharField(max_length=200, verbose_name='Должность')
    description = models.TextField(verbose_name='Описание')
    location = models.CharField(max_length=100, verbose_name='Локация')
    start_date = models.DateField(null=True, blank=True, verbose_name='Дата начала')
    end_date = models.DateField(null=True, blank=True, verbose_name='Дата окончания')
    requirements = models.TextField(verbose_name='Требования')
    tech_stack = models.JSONField(
        default=list,
        verbose_name='Стек технологий',
        help_text='Список используемых технологий'
    )
    available_positions = models.PositiveIntegerField(
        default=1,
        verbose_name='Количество мест'
    )
    universities = models.ManyToManyField(
        University,
        related_name='internships',
        verbose_name='Подходящие университеты'
    )
    is_active = models.BooleanField(default=True, verbose_name='Активна')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Практика'
        verbose_name_plural = 'Практики'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.company.name} - {self.position}"


class Student(models.Model):
    """Модель студента"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name='Пользователь')
    university = models.ForeignKey(University, on_delete=models.CASCADE, verbose_name='Университет', null=True, blank=True)
    course = models.IntegerField(verbose_name='Курс', help_text='Номер курса (1-6)', null=True, blank=True)
    specialization = models.CharField(max_length=200, verbose_name='Специализация', blank=True)
    phone = models.CharField(max_length=20, verbose_name='Телефон', blank=True)
    bio = models.TextField(verbose_name='О себе', blank=True)
    avatar = models.ImageField(
        upload_to='student_avatars/',
        null=True,
        blank=True,
        verbose_name='Аватар студента'
    )
    resume = models.FileField(upload_to='student_resumes/', verbose_name='Резюме', blank=True, null=True)
    skills = models.JSONField(default=list, verbose_name='Навыки', blank=True)
    interests = models.JSONField(default=list, verbose_name='Интересы', blank=True)
    is_active = models.BooleanField(default=True, verbose_name='Активен')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Студент'
        verbose_name_plural = 'Студенты'
        ordering = ['-created_at']
    
    def __str__(self):
        university_name = self.university.name if self.university else "Без университета"
        return f"{self.user.get_full_name()} ({university_name})"


class Application(models.Model):
    """Модель заявки на практику"""
    STATUS_CHOICES = [
        ('pending', 'На рассмотрении'),
        ('accepted', 'Принята'),
        ('rejected', 'Отклонена'),
        ('cancelled', 'Отменена'),
    ]
    
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name='applications',
        verbose_name='Студент'
    )
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name='applications',
        verbose_name='Компания',
        null=True,
        blank=True
    )
    internship = models.ForeignKey(
        Internship,
        on_delete=models.CASCADE,
        related_name='applications',
        verbose_name='Практика',
        null=True,
        blank=True
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name='Статус'
    )
    comment = models.TextField(
        verbose_name='Комментарий',
        help_text='Комментарий студента к заявке'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Заявка'
        verbose_name_plural = 'Заявки'
        ordering = ['-created_at']
        unique_together = ['student', 'internship']  # Один студент может подать только одну заявку на практику
    
    def __str__(self):
        student_name = self.student.user.get_full_name() if self.student and self.student.user else "Неизвестный студент"
        position_name = self.internship.position if self.internship else "Неизвестная практика"
        return f"{student_name} - {position_name}"


class Review(models.Model):
    """Модель отзыва студента о компании"""
    RATING_CHOICES = [
        (1, '1 звезда'),
        (2, '2 звезды'),
        (3, '3 звезды'),
        (4, '4 звезды'),
        (5, '5 звезд'),
    ]
    
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name='reviews',
        verbose_name='Студент'
    )
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name='reviews',
        verbose_name='Компания'
    )
    rating = models.IntegerField(
        choices=RATING_CHOICES,
        verbose_name='Рейтинг',
        help_text='Оценка от 1 до 5 звезд'
    )
    comment = models.TextField(
        verbose_name='Комментарий',
        help_text='Отзыв о прохождении практики'
    )
    is_anonymous = models.BooleanField(
        default=False,
        verbose_name='Анонимный отзыв'
    )
    is_verified = models.BooleanField(
        default=False,
        verbose_name='Проверенный отзыв',
        help_text='Отзыв от студента, который действительно проходил практику'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Отзыв'
        verbose_name_plural = 'Отзывы'
        ordering = ['-created_at']
        unique_together = ['student', 'company']  # Один студент может оставить только один отзыв о компании
    
    def __str__(self):
        student_name = self.student.user.get_full_name() if self.student and self.student.user else "Неизвестный студент"
        return f"{student_name} - {self.company.name} ({self.rating}/5)"
