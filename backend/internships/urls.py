from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UniversityViewSet, CompanyViewSet, InternshipViewSet, ApplicationViewSet, ReviewViewSet,
    student_register, student_login, student_logout,
    student_profile, student_update_profile, check_auth_status, get_csrf_token,
    company_register, company_login, company_logout,
    company_profile, company_update_profile, check_company_auth_status,
    company_internships, company_create_internship, company_update_internship, company_delete_internship,
    company_view_all_companies, get_company_by_id, company_applications,
    company_application_detail, company_application_status
)

router = DefaultRouter()
router.register(r'universities', UniversityViewSet)
router.register(r'companies', CompanyViewSet)
router.register(r'internships', InternshipViewSet)
router.register(r'applications', ApplicationViewSet)
router.register(r'reviews', ReviewViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # Авторизация студентов
    path('auth/register/', student_register, name='student_register'),
    path('auth/login/', student_login, name='student_login'),
    path('auth/logout/', student_logout, name='student_logout'),
    path('auth/profile/', student_profile, name='student_profile'),
    path('auth/profile/update/', student_update_profile, name='student_update_profile'),
    path('auth/status/', check_auth_status, name='check_auth_status'),
    path('auth/csrf/', get_csrf_token, name='get_csrf_token'),
    # Авторизация компаний
    path('company/register/', company_register, name='company_register'),
    path('company/login/', company_login, name='company_login'),
    path('company/logout/', company_logout, name='company_logout'),
    path('company/profile/', company_profile, name='company_profile'),
    path('company/profile/update/', company_update_profile, name='company_update_profile'),
    path('company/status/', check_company_auth_status, name='check_company_auth_status'),
    # Управление практиками компаний
    path('company/internships/', company_internships, name='company_internships'),
    path('company/internships/create/', company_create_internship, name='company_create_internship'),
    path('company/internships/<int:internship_id>/', company_update_internship, name='company_update_internship'),
    path('company/internships/<int:internship_id>/delete/', company_delete_internship, name='company_delete_internship'),
    # Просмотр всех компаний для компаний
    path('company/view-companies/', company_view_all_companies, name='company_view_all_companies'),
    # Получить компанию по ID
    path('company-detail/<int:company_id>/', get_company_by_id, name='get_company_by_id'),
    # Заявки компании
    path('company/applications/', company_applications, name='company_applications'),
    path('company/applications/<int:application_id>/', company_application_detail, name='company_application_detail'),
    path('company/applications/<int:application_id>/status/', company_application_status, name='company_application_status'),
]
