#!/usr/bin/env python
import os
import sys
import django

# Настройка Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'internship_platform.settings')
django.setup()

from internships.models import Company, Internship

# Проверяем ВКонтакте
try:
    vk_company = Company.objects.get(name='ВКонтакте')
    print(f"ВКонтакте найдена: ID={vk_company.id}")
    print(f"is_verified: {vk_company.is_verified}")
    print(f"is_active: {vk_company.is_active}")
    print(f"has_blue_checkmark: {vk_company.has_blue_checkmark}")
    
    # Проверяем практики
    internships = Internship.objects.filter(company=vk_company, is_active=True)
    print(f"Активные практики: {internships.count()}")
    
    for internship in internships:
        print(f"  - {internship.position} (ID: {internship.id})")
        
except Company.DoesNotExist:
    print("ВКонтакте не найдена в базе данных")
    print("Доступные компании:")
    for company in Company.objects.all():
        print(f"  - {company.name} (ID: {company.id})")
