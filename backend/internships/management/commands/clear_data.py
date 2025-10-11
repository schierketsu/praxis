from django.core.management.base import BaseCommand
from internships.models import University, Company, Internship


class Command(BaseCommand):
    help = 'Очищает базу данных от тестовых данных'

    def handle(self, *args, **options):
        self.stdout.write('Очистка тестовых данных...')

        # Удаляем в правильном порядке (сначала дочерние объекты)
        internships_count = Internship.objects.count()
        Internship.objects.all().delete()
        self.stdout.write(f'Удалено практик: {internships_count}')

        companies_count = Company.objects.count()
        Company.objects.all().delete()
        self.stdout.write(f'Удалено компаний: {companies_count}')

        universities_count = University.objects.count()
        University.objects.all().delete()
        self.stdout.write(f'Удалено университетов: {universities_count}')

        self.stdout.write(
            self.style.SUCCESS('База данных успешно очищена от тестовых данных')
        )
