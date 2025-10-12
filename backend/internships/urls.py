from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UniversityViewSet, CompanyViewSet, InternshipViewSet, ApplicationViewSet, ReviewViewSet,
    student_register, student_login, student_logout,
    student_profile, student_update_profile, check_auth_status, get_csrf_token
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
]
