#!/usr/bin/env python
"""
Тестовый скрипт для проверки создания заявки через API
"""
import os
import sys
import django
import requests
import json

# Добавляем путь к проекту
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Настраиваем Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'internship_platform.settings')
django.setup()

from django.contrib.auth.models import User
from internships.models import Student, Application, Internship

def test_api_application():
    """Тестирует создание заявки через API"""
    print("🧪 Тестирование создания заявки через API...")
    
    # Создаем тестового пользователя
    user, created = User.objects.get_or_create(
        username='api_test_user',
        defaults={
            'first_name': 'API',
            'last_name': 'Тест',
            'email': 'api_test@example.com'
        }
    )
    
    if created:
        print(f"✅ Создан пользователь: {user.username}")
    else:
        print(f"👤 Используем существующего пользователя: {user.username}")
    
    # Создаем профиль студента
    student, created = Student.objects.get_or_create(
        user=user,
        defaults={
            'phone': '+7 (999) 888-77-66',
            'university_id': 1
        }
    )
    
    if created:
        print(f"✅ Создан профиль студента: {student}")
    else:
        print(f"👤 Используем существующий профиль: {student}")
    
    # Получаем доступную практику
    internship = Internship.objects.exclude(
        applications__student=student
    ).first()
    
    if not internship:
        print("❌ Нет доступных практик для тестирования")
        return
    
    print(f"📋 Выбрана практика: {internship.position} ({internship.company.name})")
    
    # URL для создания заявки
    url = 'http://localhost:8000/api/applications/'
    
    # Данные для заявки
    data = {
        'internship': internship.id,
        'comment': 'Тестовая заявка через API для проверки email уведомлений',
        'company': internship.company.id
    }
    
    # Заголовки
    headers = {
        'Content-Type': 'application/json',
        'X-CSRFToken': 'test'  # Для тестирования
    }
    
    try:
        print(f"📤 Отправка POST запроса на {url}")
        print(f"📋 Данные: {json.dumps(data, indent=2)}")
        
        # Отправляем запрос
        response = requests.post(url, json=data, headers=headers)
        
        print(f"📊 Статус ответа: {response.status_code}")
        print(f"📄 Ответ: {response.text}")
        
        if response.status_code == 201:
            print("✅ Заявка создана успешно!")
            print("📧 Проверьте консоль Django сервера для логов отправки email")
            print("📧 Проверьте почтовый ящик crumplemi@yandex.ru")
        else:
            print("❌ Ошибка создания заявки")
            
    except requests.exceptions.ConnectionError:
        print("❌ Ошибка подключения к серверу. Убедитесь, что Django сервер запущен на порту 8000")
    except Exception as e:
        print(f"❌ Ошибка: {e}")

if __name__ == '__main__':
    test_api_application()
