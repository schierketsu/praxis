# 🎓 ПРАКСИС - Платформа для поиска практик

Современная веб-платформа для соединения талантливых студентов с ведущими IT-компаниями. Позволяет студентам находить подходящие практики, а компаниям - привлекать молодых специалистов.

## 🛠 Технологии

### Frontend
- **React 18** - Современная библиотека для UI
- **Ant Design** - Компоненты интерфейса
- **React Router** - Маршрутизация
- **Vite** - Быстрый сборщик
- **CSS3** - Стилизация с градиентами и анимациями

### Backend
- **Python 3.11** - Основной язык
- **Django 4.2** - Веб-фреймворк
- **Django REST Framework** - API
- **SQLite** - База данных
- **Django CORS Headers** - CORS поддержка

### Инструменты
- **Git** - Контроль версий
- **Node.js** - Пакетный менеджер
- **Pillow** - Обработка изображений

## 📁 Структура проекта

```
place/
├── frontend/                 # React приложение
│   ├── src/
│   │   ├── components/       # Компоненты
│   │   │   ├── layout/      # Шапка и макет
│   │   │   ├── CompanyDetail.jsx
│   │   │   ├── InternshipTable.jsx
│   │   │   ├── SearchFilters.jsx
│   │   │   └── MapComponent.jsx
│   │   ├── services/        # API сервисы
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/                  # Django API
│   ├── internships/         # Основное приложение
│   │   ├── models.py        # Модели данных
│   │   ├── views.py         # API endpoints
│   │   ├── serializers.py   # Сериализаторы
│   │   └── management/      # Команды управления
│   ├── internship_platform/ # Настройки Django
│   ├── manage.py
│   └── requirements.txt
└── README.md
```

## 🚀 Быстрый старт

### Предварительные требования
- Python 3.11+
- Node.js 16+
- Git

### Установка

1. **Клонирование репозитория**
```bash
git clone <repository-url>
cd place
```

2. **Настройка Backend (Django)**
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate

pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```

3. **Настройка Frontend (React)**
```bash
cd frontend
npm install
npm run dev
```

4. **Открытие приложения**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

## 📊 Модели данных

### Company (Компания)
- `name` - Название компании
- `description` - Описание
- `website` - Веб-сайт
- `address` - Адрес
- `latitude/longitude` - Координаты
- `logo` - Логотип

### Internship (Практика)
- `company` - Связь с компанией
- `position` - Должность
- `description` - Описание
- `location` - Локация
- `tech_stack` - Стек технологий (JSON)
- `universities` - Связанные университеты

### University (Университет)
- `name` - Название университета

## 🔧 API Endpoints

### Компании
- `GET /api/companies/` - Список компаний
- `GET /api/companies/{id}/` - Детали компании
- `GET /api/companies/locations/` - Список локаций

### Практики
- `GET /api/internships/` - Список практик
- `GET /api/internships/technologies/` - Список технологий

### Университеты
- `GET /api/universities/` - Список университетов

## 🎨 Компоненты

### AppHeader
Главная шапка сайта с логотипом и навигацией.

### SearchFilters
Фильтры для поиска:
- Локация
- Университет
- Стек технологий

### InternshipTable
Карусель карточек компаний с навигацией.

### CompanyDetail
Детальная страница компании:
- Информация о компании
- Карта расположения
- Список практик

### MapComponent
Интерактивная карта с использованием OpenStreetMap.

## 🎯 Функциональность

### Для студентов
- Просмотр доступных практик
- Фильтрация по критериям
- Детальная информация о компаниях
- Интерактивная карта расположения

### Для компаний
- Размещение информации о практиках
- Указание требований и технологий
- Отображение на карте

## 🎨 Дизайн

### Цветовая схема
- **Основной градиент**: `#667eea` → `#764ba2`
- **Фон**: `linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)`
- **Карточки**: Стеклянный эффект с размытием

### Типографика
- **Шрифт**: Small-caps для всего сайта
- **Заголовки**: Градиентные с WebkitBackgroundClip
- **Текст**: Адаптивные размеры

### Анимации
- Плавные переходы (0.3s ease)
- Hover эффекты
- Карусельная анимация

## 📱 Адаптивность

- **Мобильные**: 1 колонка карточек
- **Планшеты**: 2 колонки
- **Десктоп**: 3-4 колонки
- **Карта**: Адаптивная высота

## 🔧 Разработка

### Команды Django
```bash
python manage.py seed_data      # Заполнение тестовыми данными
python manage.py clear_data     # Очистка данных
python manage.py migrate        # Применение миграций
```

### Команды Frontend
```bash
npm run dev          # Разработка
npm run build        # Сборка
npm run preview      # Предварительный просмотр
```
