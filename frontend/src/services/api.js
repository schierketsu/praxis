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
    const response = await api.put('/auth/profile/update/', profileData);
    return response.data;
  },

  // Проверить статус авторизации
  checkAuthStatus: async () => {
    const response = await api.get('/auth/status/');
    return response.data;
  },
};

export default api;
