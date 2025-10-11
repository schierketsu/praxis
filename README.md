# Праксис - Платформа поиска производственных практик

Веб-платформа для помощи студентам ИТ-направлений в поиске производственных практик в компаниях.

## 🚀 Технологии

### Backend
- **Django 4.2.7** - веб-фреймворк
- **Django REST Framework** - API
- **Django CORS Headers** - CORS поддержка
- **Django Filter** - фильтрация данных
- **Pillow** - работа с изображениями
- **SQLite** - база данных

### Frontend
- **React 18** - UI библиотека
- **Ant Design** - компоненты интерфейса
- **React Router DOM** - маршрутизация
- **Axios** - HTTP клиент
- **Leaflet** - интерактивные карты
- **Vite** - сборщик

## 📁 Структура проекта

```
place/
├── backend/                    # Django backend
│   ├── internship_platform/   # Основные настройки Django
│   ├── internships/           # Приложение с моделями и API
│   │   ├── models.py         # Модели данных
│   │   ├── views.py          # API views
│   │   ├── serializers.py    # Сериализаторы
│   │   ├── urls.py           # URL маршруты
│   │   ├── admin.py          # Админ панель
│   │   └── management/       # Команды управления
│   ├── manage.py             # Django CLI
│   ├── requirements.txt     # Python зависимости
│   └── db.sqlite3           # База данных
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/       # React компоненты
│   │   ├── services/        # API сервисы
│   │   ├── App.jsx          # Главный компонент
│   │   └── main.jsx         # Точка входа
│   ├── package.json         # Node.js зависимости
│   └── vite.config.js      # Конфигурация Vite
└── README.md                # Документация
```

## 🗄️ Модели данных

### University (Университет)
- `name` - название
- `institution_type` - тип (университет/колледж)

### Company (Компания)
- `name` - название
- `description` - описание
- `website` - веб-сайт
- `address` - адрес
- `logo` - логотип

### Internship (Практика)
- `company` - компания (ForeignKey)
- `position` - должность
- `description` - описание
- `location` - локация
- `start_date` / `end_date` - даты
- `requirements` - требования
- `tech_stack` - стек технологий (JSONField)
- `available_positions` - количество мест
- `universities` - подходящие университеты (ManyToMany)
- `is_active` - активна ли практика

## 🔌 API Endpoints

### Университеты
- `GET /api/universities/` - список университетов

### Компании
- `GET /api/companies/` - список компаний
- `GET /api/companies/with_internships/` - компании с практиками

### Практики
- `GET /api/internships/` - список практик с фильтрацией
- `GET /api/internships/available_techs/` - доступные технологии

## 🎯 Функциональность

### Главная страница
- **Поиск и фильтрация** по локации и технологиям
- **Таблица компаний** с логотипами и практиками
- **Золотое выделение** выбранных технологий
- **Навигация** к детальным страницам

### Детальная страница компании
- **Полная информация** о компании
- **Таблица практик** с кнопками "Откликнуться"
- **Интерактивная карта** с адресом
- **Красивое оформление** с фоновыми изображениями

### Фильтрация
- **По локации** - выбор города
- **По технологиям** - множественный выбор
- **Динамическая загрузка** доступных технологий

## 🚀 Запуск проекта

### Backend (Django)

1. **Установка зависимостей:**
```bash
cd backend
pip install -r requirements.txt
```

2. **Миграции базы данных:**
```bash
python manage.py makemigrations
python manage.py migrate
```

3. **Создание суперпользователя:**
```bash
python manage.py createsuperuser
```

4. **Заполнение тестовыми данными:**
```bash
python manage.py seed_data
```

5. **Запуск сервера:**
```bash
python manage.py runserver
```

Backend будет доступен по адресу: `http://localhost:8000`

### Frontend (React)

1. **Установка зависимостей:**
```bash
cd frontend
npm install
```

2. **Запуск dev сервера:**
```bash
npm run dev
```

Frontend будет доступен по адресу: `http://localhost:5173`

## 🛠️ Команды управления

### Очистка данных
```bash
python manage.py clear_data
```

### Заполнение данными
```bash
python manage.py seed_data
```

## 📊 Тестовые данные

Проект включает команду `seed_data` которая создает:
- **2 университета** (ЧувГУ, ЧПК)
- **4 компании** с логотипами
- **9 практик** с различными технологиями

## 🎨 Особенности дизайна

- **Современный UI** с Ant Design
- **Адаптивная верстка** для всех устройств
- **Интерактивные карты** с Leaflet
- **Красивые анимации** и переходы
- **Золотое выделение** выбранных технологий

## 🔧 Разработка

### Структура компонентов
- `AppLayout` - основной макет
- `AppHeader` - шапка с навигацией
- `AppContent` - главная страница
- `SearchFilters` - фильтры поиска
- `InternshipTable` - таблица компаний
- `CompanyDetail` - детальная страница
- `MapComponent` - интерактивная карта

### API сервисы
- `companiesAPI` - работа с компаниями
- `internshipsAPI` - работа с практиками
- `universitiesAPI` - работа с университетами

## 📝 Лицензия

Проект создан для образовательных целей.


# Backend (с виртуальным окружением)
cd backend

# Активация виртуального окружения
.\venv\Scripts\Activate.ps1
# или для cmd: venv\Scripts\activate.bat

# Установка зависимостей
pip install -r requirements.txt

# Применение миграций
python manage.py migrate

# Заполнение тестовыми данными
python manage.py seed_data

# Запуск сервера
python manage.py runserver

# Frontend  
cd frontend
npm install
npm run dev