from django.db import models


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
    created_at = models.DateTimeField(auto_now_add=True)
    
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
    start_date = models.DateField(verbose_name='Дата начала')
    end_date = models.DateField(verbose_name='Дата окончания')
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
