# Настройка Email уведомлений

## Конфигурация

В файле `internship_platform/settings.py` настроены следующие параметры email:

```python
# Настройки email для отправки уведомлений
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'localhost'  # Замените на адрес вашего mailcow сервера
EMAIL_PORT = 587  # Порт SMTP для mailcow
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'noreply@studprakt.ru'  # Email отправителя
EMAIL_HOST_PASSWORD = 'your_password_here'  # Пароль от email
DEFAULT_FROM_EMAIL = 'noreply@studprakt.ru'
SERVER_EMAIL = 'noreply@studprakt.ru'
```

## Настройка для mailcow

1. **Замените EMAIL_HOST** на IP-адрес вашего mailcow сервера
2. **Установите правильный пароль** для EMAIL_HOST_PASSWORD
3. **Проверьте порт** - обычно для mailcow используется 587 или 25

## Тестирование

Для тестирования отправки email запустите:

```bash
python test_email.py
```

## Функциональность

При создании заявки студентом:

1. ✅ Создается заявка в базе данных
2. ✅ Автоматически отправляется email на адрес компании
3. ✅ Email содержит:
   - Имя и фамилию студента
   - Контактную информацию
   - Детали практики
   - Комментарий студента

## Email шаблон

Email отправляется в HTML формате с:
- Красивым дизайном
- Информацией о студенте
- Деталями заявки
- Контактными данными

## Логирование

Ошибки отправки email логируются в консоль Django.
