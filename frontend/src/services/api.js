import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export default api;
