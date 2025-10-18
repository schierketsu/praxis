import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authAPI, companyAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [student, setStudent] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  // Проверяем статус авторизации при загрузке приложения
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      // Проверяем авторизацию студента
      const studentResponse = await authAPI.checkAuthStatus();
      if (studentResponse.authenticated && studentResponse.student) {
        setUser(studentResponse.student.user);
        setStudent(studentResponse.student);
        setCompany(null);
        return;
      }

      // Проверяем авторизацию компании
      const companyResponse = await companyAPI.checkAuthStatus();
      if (companyResponse.authenticated && companyResponse.company) {
        setUser(companyResponse.company.user);
        setCompany(companyResponse.company);
        setStudent(null);
        return;
      }

      // Если ни студент, ни компания не авторизованы
      setUser(null);
      setStudent(null);
      setCompany(null);
    } catch (error) {
      console.error('Ошибка проверки авторизации:', error);
      setUser(null);
      setStudent(null);
      setCompany(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      // Пытаемся войти как студент
      try {
        const response = await authAPI.login(credentials);
        setUser(response.student.user);
        setStudent(response.student);
        setCompany(null);
        return response;
      } catch (studentError) {
        // Если не получилось как студент, пробуем как компания
        const response = await companyAPI.login(credentials);
        setUser(response.company.user);
        setCompany(response.company);
        setStudent(null);
        return response;
      }
    } catch (error) {
      throw error;
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      // Определяем тип регистрации по наличию поля 'name' (только у компаний)
      if (userData.name) {
        // Регистрация компании
        const response = await companyAPI.register(userData);
        // После регистрации автоматически входим
        await checkAuthStatus();
        return response;
      } else {
        // Регистрация студента
        const response = await authAPI.register(userData);
        // После регистрации автоматически входим
        await checkAuthStatus();
        return response;
      }
    } catch (error) {
      throw error;
    }
  }, [checkAuthStatus]);

  const logout = useCallback(async () => {
    try {
      // Выходим в зависимости от типа авторизованного пользователя
      if (student) {
        // Если авторизован как студент, выходим как студент
        try {
          await authAPI.logout();
        } catch (e) {
          console.warn('Ошибка выхода студента:', e);
        }
      } else if (company) {
        // Если авторизован как компания, выходим как компания
        try {
          await companyAPI.logout();
        } catch (e) {
          console.warn('Ошибка выхода компании:', e);
        }
      }

      setUser(null);
      setStudent(null);
      setCompany(null);
    } catch (error) {
      console.error('Ошибка выхода:', error);
      // Даже если произошла ошибка, очищаем состояние
      setUser(null);
      setStudent(null);
      setCompany(null);
    }
  }, [student, company]);

  const updateProfile = useCallback(async (profileData) => {
    try {
      if (student) {
        const response = await authAPI.updateProfile(profileData);
        setStudent(response.student);
        return response;
      } else if (company) {
        const response = await companyAPI.updateProfile(profileData);
        setCompany(response.company);
        return response;
      }
    } catch (error) {
      throw error;
    }
  }, [student, company]);

  // Мемоизируем значение контекста для предотвращения лишних ререндеров
  const value = useMemo(() => ({
    user,
    student,
    company,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    checkAuthStatus
  }), [user, student, company, loading, login, register, logout, updateProfile, checkAuthStatus]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
