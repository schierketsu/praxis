from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UniversityViewSet, CompanyViewSet, InternshipViewSet

router = DefaultRouter()
router.register(r'universities', UniversityViewSet)
router.register(r'companies', CompanyViewSet)
router.register(r'internships', InternshipViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
