import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Включаем передачу cookies для аутентификации
});

// Получаем CSRF токен
const getCsrfToken = async () => {
  try {
    const response = await api.get('/auth/csrf/');
    return response.data.csrfToken;
  } catch (error) {
    console.warn('Не удалось получить CSRF токен:', error);
    return null;
  }
};

// Добавляем интерцептор для обработки ошибок аутентификации
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Если получили 401, перенаправляем на главную страницу
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// API для практик
export const internshipsAPI = {
  // Получить список практик с фильтрацией
  getInternships: async (params = {}) => {
    const response = await api.get('/internships/', { params });
    return response.data;
  },

  // Получить практику по ID
  getInternship: async (id) => {
    const response = await api.get(`/internships/${id}/`);
    return response.data;
  },

  // Получить доступные технологии для текущих фильтров
  getAvailableTechs: async (params = {}) => {
    const response = await api.get('/internships/available_techs/', { params });
    return response.data;
  },
};

// API для компаний
export const companiesAPI = {
  getCompanies: async (params = {}) => {
    const response = await api.get('/companies/', { params });
    return response.data;
  },

  // Получить компании с их практиками
  getCompaniesWithInternships: async (params = {}) => {
    const response = await api.get('/companies/with_internships/', { params });
    return response.data;
  },

  // Получить все компании с практиками для студентов
  getCompaniesForStudents: async (params = {}) => {
    const response = await api.get('/companies/for_students/', { params });
    return response.data;
  },
};

// API для университетов
export const universitiesAPI = {
  getUniversities: async (params = {}) => {
    const response = await api.get('/universities/', { params });
    return response.data;
  },
};

// API для авторизации студентов
export const authAPI = {
  // Регистрация студента
  register: async (studentData) => {
    const response = await api.post('/auth/register/', studentData);
    return response.data;
  },

  // Вход студента
  login: async (credentials) => {
    const response = await api.post('/auth/login/', credentials);
    return response.data;
  },

  // Выход студента
  logout: async () => {
    const response = await api.post('/auth/logout/');
    return response.data;
  },

  // Получить профиль студента
  getProfile: async () => {
    const response = await api.get('/auth/profile/');
    return response.data;
  },

  // Обновить профиль студента
  updateProfile: async (profileData) => {
    const config = {
      headers: {
        'Content-Type': profileData instanceof FormData ? 'multipart/form-data' : 'application/json'
      }
    };
    const response = await api.put('/auth/profile/update/', profileData, config);
    return response.data;
  },

  // Проверить статус авторизации
  checkAuthStatus: async () => {
    const response = await api.get('/auth/status/');
    return response.data;
  },
};

// API для заявок студентов
export const applicationsAPI = {
  // Получить заявки студента
  getApplications: async () => {
    const response = await api.get('/applications/');
    return response.data;
  },

  // Создать новую заявку
  createApplication: async (applicationData) => {
    const response = await api.post('/applications/', applicationData);
    return response.data;
  },

  // Обновить заявку (только отмена)
  updateApplication: async (id, data) => {
    const response = await api.patch(`/applications/${id}/`, data);
    return response.data;
  },

  // Удалить заявку
  deleteApplication: async (id) => {
    const response = await api.delete(`/applications/${id}/`);
    return response.data;
  },
};

// API для отзывов студентов
export const reviewsAPI = {
  // Получить отзывы для компании
  getCompanyReviews: async (companyId) => {
    const response = await api.get(`/reviews/?company=${companyId}`);
    return response.data;
  },

  // Получить отзывы студента
  getStudentReviews: async () => {
    const response = await api.get('/reviews/');
    return response.data;
  },

  // Создать отзыв
  createReview: async (reviewData) => {
    const response = await api.post('/reviews/', reviewData);
    return response.data;
  },

  // Обновить отзыв
  updateReview: async (id, reviewData) => {
    const response = await api.patch(`/reviews/${id}/`, reviewData);
    return response.data;
  },

  // Удалить отзыв
  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}/`);
    return response.data;
  },
};

// API для авторизации компаний
export const companyAPI = {
  // Регистрация компании
  register: async (companyData) => {
    const response = await api.post('/company/register/', companyData);
    return response.data;
  },

  // Вход компании
  login: async (credentials) => {
    const response = await api.post('/company/login/', credentials);
    return response.data;
  },

  // Выход компании
  logout: async () => {
    const response = await api.post('/company/logout/');
    return response.data;
  },

  // Получить профиль компании
  getProfile: async () => {
    const response = await api.get('/company/profile/');
    return response.data;
  },

  // Обновить профиль компании
  updateProfile: async (profileData) => {
    const config = {
      headers: {
        'Content-Type': profileData instanceof FormData ? 'multipart/form-data' : 'application/json'
      }
    };
    const response = await api.put('/company/profile/update/', profileData, config);
    return response.data;
  },

  // Проверить статус авторизации
  checkAuthStatus: async () => {
    const response = await api.get('/company/status/');
    return response.data;
  },
};

// API для управления практиками компаний
export const companyInternshipsAPI = {
  // Получить практики компании
  getInternships: async () => {
    const response = await api.get('/company/internships/');
    return response.data;
  },

  // Создать практику
  createInternship: async (internshipData) => {
    const response = await api.post('/company/internships/create/', internshipData);
    return response.data;
  },

  // Обновить практику
  updateInternship: async (id, internshipData) => {
    const response = await api.patch(`/company/internships/${id}/`, internshipData);
    return response.data;
  },

  // Удалить практику
  deleteInternship: async (id) => {
    const response = await api.delete(`/company/internships/${id}/delete/`);
    return response.data;
  },

  // Получить все компании для просмотра
  getAllCompanies: async () => {
    const response = await api.get('/company/view-companies/');
    return response.data;
  },

  // Получить заявки компании
  getApplications: async () => {
    const response = await api.get('/company/applications/');
    return response.data;
  },

  // Получить детали заявки
  getApplicationDetail: async (applicationId) => {
    const response = await api.get(`/company/applications/${applicationId}/`);
    return response.data;
  },

  // Изменить статус заявки
  updateApplicationStatus: async (applicationId, status) => {
    const response = await api.patch(`/company/applications/${applicationId}/status/`, { status });
    return response.data;
  },
};

// API для получения компании по ID
export const companyDetailAPI = {
  // Получить компанию по ID
  getCompanyById: async (companyId) => {
    const response = await api.get(`/company-detail/${companyId}/`);
    return response.data;
  },
};

export default api;
