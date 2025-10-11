# Работа с виртуальным окружением

## Создание виртуального окружения

Виртуальное окружение уже создано в папке `venv/`. 

## Активация виртуального окружения

### В Windows PowerShell:
```powershell
.\venv\Scripts\Activate.ps1
```

### В Windows Command Prompt (cmd):
```cmd
venv\Scripts\activate.bat
```

### В Git Bash:
```bash
source venv/Scripts/activate
```

## Установка зависимостей

После активации виртуального окружения установите зависимости:
```bash
pip install -r requirements.txt
```

## Запуск проекта

После активации виртуального окружения и установки зависимостей:
```bash
python manage.py runserver
```

## Деактивация виртуального окружения

```bash
deactivate
```

## Важные заметки

1. **Всегда активируйте виртуальное окружение** перед работой с проектом
2. **Не коммитьте папку venv/** в git - она уже добавлена в .gitignore
3. **Если виртуальное окружение не активируется**, попробуйте изменить политику выполнения PowerShell:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

## Структура проекта

```
backend/
├── venv/                 # Виртуальное окружение (не коммитится)
├── internship_platform/  # Настройки Django
├── internships/         # Приложение Django
├── media/               # Медиа файлы
├── requirements.txt     # Зависимости Python
└── manage.py           # Управление Django
```
