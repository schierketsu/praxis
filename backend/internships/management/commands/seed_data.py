from django.core.management.base import BaseCommand
from django.utils import timezone
from django.core.files import File
from datetime import date, timedelta
import os
from internships.models import University, Company, Internship


class Command(BaseCommand):
    help = 'Заполняет базу данных тестовыми данными'

    def handle(self, *args, **options):
        self.stdout.write('Создание тестовых данных...')

        # Создание университетов
        universities = [
            {'name': 'ЧувГУ им. И. Н. Ульянова', 'institution_type': 'university'},
            {'name': 'ЧПК им. Н.В. Никольского', 'institution_type': 'college'},
        ]
        
        created_universities = []
        for uni_data in universities:
            uni, created = University.objects.get_or_create(
                name=uni_data['name'],
                defaults=uni_data
            )
            created_universities.append(uni)
            if created:
                self.stdout.write(f'Создан университет: {uni.name}')

        # Создание компаний (4 для тестирования)
        companies = [
            {
                'name': 'ООО НПП «Экра»', 
                'description': 'Научно-производственное предприятие, специализирующееся на разработке и производстве электронных компонентов и систем автоматизации для промышленности', 
                'website': 'https://ekra.ru',
                'address': 'пр-т. Ивана Яковлева, 3, Чебоксары, Чувашская Респ., 428000',
                'latitude': 56.11427957912669,
                'longitude': 47.257093448374484,
                'logo': 'assets/ekralogo.png'
            },
            {
                'name': 'ООО "Команда Ф5"', 
                'description': 'IT-компания, занимающаяся разработкой веб-приложений, мобильных приложений и систем автоматизации бизнес-процессов', 
                'website': 'https://teamf5.ru',
                'address': 'ул. Карла Маркса, 52, Чебоксары, Чувашская Респ., 428003',
                'latitude': 56.13478674663598,
                'longitude': 47.243809224071576,
                'logo': 'assets/f5logo.jpg'
            },
            {
                'name': 'ООО "Кейсистемс"', 
                'description': 'Компания по разработке программного обеспечения и IT-решений для предприятий, специализируется на системах управления и аналитики', 
                'website': 'https://keysystems.ru',
                'address': 'пр-т Максима Горького, 18Б, Чебоксары, Чувашская Респ., 428000',
                'latitude': 56.14916133691919,
                'longitude': 47.18977735581993,
                'logo': 'assets/keyslogo.png'
            },
            {
                'name': 'Тестовая компания', 
                'description': 'Инновационная IT-компания, занимающаяся разработкой тестового программного обеспечения и автоматизацией тестирования', 
                'website': 'https://testcompany.ru',
                'address': 'ул. Винокурова, 53, Новочебоксарск, Чувашская Респ., 429965',
                'latitude': 56.10792856104269,
                'longitude': 47.48265236377324,
                'logo': 'assets/testlogo.png'
            },
            {
                'name': 'ВКонтакте', 
                'description': 'Крупнейшая социальная сеть России и СНГ, платформа для общения, развлечений и бизнеса с миллионами пользователей', 
                'website': 'https://vk.com',
                'address': 'ул. Льва Толстого, 16, Санкт-Петербург, 197022',
                'latitude': 59.9565,
                'longitude': 30.3245,
                'logo': 'assets/vk.jpg'
            },
            {
                'name': 'Яндекс', 
                'description': 'Российская IT-компания, владеющая одноименной системой поиска в интернете и интернет-порталом. Разработчик множества интернет-сервисов и мобильных приложений', 
                'website': 'https://yandex.ru',
                'address': 'ул. Льва Толстого, 16, Москва, 119021',
                'latitude': 55.7558,
                'longitude': 37.6176,
                'logo': 'assets/yandex.svg.png'
            },
            {
                'name': 'Альфа-Банк', 
                'description': 'Один из крупнейших частных банков России, предоставляющий полный спектр банковских услуг для физических лиц, малого и среднего бизнеса', 
                'website': 'https://alfabank.ru',
                'address': 'ул. Каланчёвская, 27, Москва, 107078',
                'latitude': 55.7694,
                'longitude': 37.6500,
                'logo': 'assets/alfa.jpg'
            },
            {
                'name': 'Сбербанк', 
                'description': 'Крупнейший банк России и один из ведущих финансовых институтов страны, предоставляющий широкий спектр банковских и финансовых услуг', 
                'website': 'https://sberbank.ru',
                'address': 'ул. Вавилова, 19, Москва, 117997',
                'latitude': 55.7104,
                'longitude': 37.5856,
                'logo': 'assets/sber.png'
            },
        ]
        
        created_companies = []
        for comp_data in companies:
            # Удаляем logo из данных для создания объекта
            comp_data_copy = comp_data.copy()
            logo_path = comp_data_copy.pop('logo')
            
            comp, created = Company.objects.get_or_create(
                name=comp_data_copy['name'],
                defaults=comp_data_copy
            )
            
            # Если компания создана и есть логотип, загружаем его
            if created and logo_path:
                # Путь относительно корня проекта backend
                logo_file_path = os.path.join(os.path.dirname(__file__), '..', '..', '..', logo_path)
                self.stdout.write(f'Ищем логотип по пути: {logo_file_path}')
                if os.path.exists(logo_file_path):
                    with open(logo_file_path, 'rb') as f:
                        comp.logo.save(
                            os.path.basename(logo_path),
                            File(f),
                            save=True
                        )
                        self.stdout.write(f'Загружен логотип для: {comp.name}')
                else:
                    self.stdout.write(f'Логотип не найден: {logo_file_path}')
            
            created_companies.append(comp)
            if created:
                self.stdout.write(f'Создана компания: {comp.name}')

        # Создание практик (по 1 для каждой компании с уникальными стеками)
        today = date.today()
        internships_data = [
    {
        'company': created_companies[0],  # ООО НПП «Экра»
        'position': 'Создание умных устройств для промышленности',
        'description': 'Разработай электронные системы для автоматизации производства. Научишься программировать микроконтроллеры, создавать схемы и тестировать готовые устройства.',
        'location': 'Чебоксары',
        'start_date': today + timedelta(days=30),
        'end_date': today + timedelta(days=120),
        'requirements': 'Интерес к электронике и программированию. Опыт не обязателен - всему научим!',
        'tech_stack': ['C', 'C++', 'Arduino', 'STM32', 'Altium Designer'],
        'available_positions': 2,
        'universities': created_universities
    },
    {
        'company': created_companies[1],  # ООО "Команда Ф5"
        'position': 'Создание современных веб-приложений',
        'description': 'Разработай полноценное веб-приложение с нуля! От идеи до запуска. Научишься работать в команде, использовать современные технологии и создавать продукты, которыми пользуются тысячи людей.',
        'location': 'Чебоксары',
        'start_date': today + timedelta(days=35),
        'end_date': today + timedelta(days=125),
        'requirements': 'Желание создавать крутые продукты. Остальному научим!',
        'tech_stack': ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git'],
        'available_positions': 3,
        'universities': created_universities
    },
    {
        'company': created_companies[1],  # ООО "Команда Ф5" - amoCRM
        'position': 'Автоматизация бизнеса через CRM',
        'description': 'Настрой автоматизацию для реальных компаний! Изучишь как работают CRM-системы, создашь автоматические процессы и поможешь бизнесу работать эффективнее.',
        'location': 'Чебоксары',
        'start_date': today + timedelta(days=40),
        'end_date': today + timedelta(days=130),
        'requirements': 'Логическое мышление и желание оптимизировать процессы.',
        'tech_stack': ['amoCRM', 'Автоматизация', 'Бизнес-процессы', 'CRM', 'Интеграции'],
        'available_positions': 2,
        'universities': created_universities
    },
    {
        'company': created_companies[1],  # ООО "Команда Ф5" - Laravel
        'position': 'Разработка корпоративных решений',
        'description': 'Создай полноценное веб-приложение на Laravel! От проектирования базы данных до красивого интерфейса. Научишься работать с серверной частью и создавать надежные системы.',
        'location': 'Чебоксары',
        'start_date': today + timedelta(days=45),
        'end_date': today + timedelta(days=135),
        'requirements': 'Базовые знания программирования. Остальному научим!',
        'tech_stack': ['PHP', 'Laravel', 'MySQL', 'HTML', 'CSS', 'JavaScript'],
        'available_positions': 2,
        'universities': created_universities
    },
    {
        'company': created_companies[1],  # ООО "Команда Ф5" - Мобильная разработка
        'position': 'Создание мобильных приложений',
        'description': 'Разработай мобильное приложение для iOS и Android одновременно! Научишься создавать кроссплатформенные решения и понимать потребности пользователей.',
        'location': 'Чебоксары',
        'start_date': today + timedelta(days=50),
        'end_date': today + timedelta(days=140),
        'requirements': 'Креативность и желание создавать удобные приложения.',
        'tech_stack': ['React Native', 'Flutter', 'JavaScript', 'Dart', 'Mobile Development'],
        'available_positions': 2,
        'universities': created_universities
    },
    {
        'company': created_companies[1],  # ООО "Команда Ф5" - 1С
        'position': 'Интеграция 1С с современными сервисами',
        'description': 'Создай умного Telegram-бота для 1С! Научишься работать с API, автоматизировать рутинные задачи и интегрировать разные системы. Реальные задачи для реального бизнеса.',
        'location': 'Чебоксары',
        'start_date': today + timedelta(days=55),
        'end_date': today + timedelta(days=145),
        'requirements': 'Аналитический склад ума и готовность изучать новые технологии.',
        'tech_stack': ['1С', 'Telegram Bot API', 'Интеграции', 'Базы данных', 'Скрипты'],
        'available_positions': 1,
        'universities': created_universities
    },
    {
        'company': created_companies[1],  # ООО "Команда Ф5" - МойСклад
        'position': 'Цифровизация складских процессов',
        'description': 'Оптимизируй работу склада через современные IT-решения! Изучишь как устроена логистика, научишься работать с большими данными и создавать аналитические отчеты.',
        'location': 'Чебоксары',
        'start_date': today + timedelta(days=60),
        'end_date': today + timedelta(days=150),
        'requirements': 'Внимательность к деталям и интерес к аналитике.',
        'tech_stack': ['МойСклад', 'Складской учет', 'Логистика', 'Финансы', 'Аналитика'],
        'available_positions': 2,
        'universities': created_universities
    },
    {
        'company': created_companies[2],  # ООО Кейсистемс
        'position': 'Разработка корпоративных систем',
        'description': 'Создай масштабируемое ПО для крупных компаний! Научишься работать с Docker, базами данных и создавать надежные системы, которые работают 24/7.',
        'location': 'Чебоксары',
        'start_date': today + timedelta(days=40),
        'end_date': today + timedelta(days=130),
        'requirements': 'Системное мышление и готовность работать с большими проектами.',
        'tech_stack': ['Python', 'Django', 'PostgreSQL', 'Docker', 'Linux'],
        'available_positions': 2,
        'universities': created_universities
    },
    {
        'company': created_companies[3],  # Тестовая компания
        'position': 'Обеспечение качества ПО',
        'description': 'Стань гарантом качества цифровых продуктов! Научишься находить баги, автоматизировать тестирование и создавать надежные приложения. Каждый найденный баг - спасенный пользователь!',
        'location': 'Новочебоксарск',
        'start_date': today + timedelta(days=45),
        'end_date': today + timedelta(days=135),
        'requirements': 'Внимательность и желание создавать качественные продукты.',
        'tech_stack': ['Selenium', 'Python', 'Pytest', 'Postman', 'SQL'],
        'available_positions': 2,
        'universities': created_universities 
    },
    {
        'company': created_companies[4],  # ВКонтакте
        'position': 'Разработка социальных функций',
        'description': 'Создавай функции для миллионов пользователей! Научишься работать с большими данными, оптимизировать производительность и создавать продукты, которыми пользуется вся страна.',
        'location': 'Санкт-Петербург',
        'start_date': today + timedelta(days=30),
        'end_date': today + timedelta(days=120),
        'requirements': 'Страсть к созданию продуктов для людей. Остальному научим!',
        'tech_stack': ['PHP', 'Go', 'React', 'MySQL', 'Redis', 'Kafka'],
        'available_positions': 5,
        'universities': created_universities
    },
    {
        'company': created_companies[5],  # Яндекс
        'position': 'Разработка поисковых алгоритмов',
        'description': 'Создавай умный поиск для миллионов запросов! Изучишь машинное обучение, обработку естественного языка и алгоритмы ранжирования. Поможешь людям находить нужную информацию.',
        'location': 'Москва',
        'start_date': today + timedelta(days=35),
        'end_date': today + timedelta(days=125),
        'requirements': 'Математическое мышление и интерес к алгоритмам.',
        'tech_stack': ['Python', 'C++', 'Machine Learning', 'TensorFlow', 'PostgreSQL'],
        'available_positions': 3,
        'universities': created_universities
    },
    {
        'company': created_companies[6],  # Альфа-Банк
        'position': 'Разработка финтех-решений',
        'description': 'Создавай банковские продукты будущего! Научишься работать с финансовыми данными, создавать безопасные системы и разрабатывать мобильные приложения для банкинга.',
        'location': 'Москва',
        'start_date': today + timedelta(days=40),
        'end_date': today + timedelta(days=130),
        'requirements': 'Внимательность к деталям и интерес к финансам.',
        'tech_stack': ['Java', 'Spring', 'Kotlin', 'PostgreSQL', 'Docker', 'Kubernetes'],
        'available_positions': 4,
        'universities': created_universities
    },
    {
        'company': created_companies[7],  # Сбербанк
        'position': 'Цифровизация банковских услуг',
        'description': 'Превращай традиционный банкинг в цифровой! Научишься работать с большими данными, создавать AI-решения и разрабатывать продукты для миллионов клиентов.',
        'location': 'Москва',
        'start_date': today + timedelta(days=45),
        'end_date': today + timedelta(days=135),
        'requirements': 'Системное мышление и готовность к инновациям.',
        'tech_stack': ['Python', 'Java', 'AI/ML', 'Big Data', 'Microservices', 'React'],
        'available_positions': 6,
        'universities': created_universities
    },
]
        
        for internship_data in internships_data:
            # Удаляем universities из данных для создания объекта
            internship_data_copy = internship_data.copy()
            universities = internship_data_copy.pop('universities')
            
            internship, created = Internship.objects.get_or_create(
                company=internship_data_copy['company'],
                position=internship_data_copy['position'],
                defaults=internship_data_copy
            )
            if created:
                internship.universities.set(universities)
                self.stdout.write(f'Создана практика: {internship}')

        self.stdout.write(
            self.style.SUCCESS(
                f'Успешно создано:\n'
                f'- {len(created_universities)} университетов\n'
                f'- {len(created_companies)} компаний\n'
                f'- {len(internships_data)} практик'
            )
        )
