import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authAPI } from '../services/api';

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
  const [loading, setLoading] = useState(true);

  // Проверяем статус авторизации при загрузке приложения
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await authAPI.checkAuthStatus();
      if (response.authenticated && response.student) {
        setUser(response.student.user);
        setStudent(response.student);
      } else {
        setUser(null);
        setStudent(null);
      }
    } catch (error) {
      console.error('Ошибка проверки авторизации:', error);
      setUser(null);
      setStudent(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      setUser(response.student.user);
      setStudent(response.student);
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  const register = useCallback(async (studentData) => {
    try {
      const response = await authAPI.register(studentData);
      // После регистрации автоматически входим
      await checkAuthStatus();
      return response;
    } catch (error) {
      throw error;
    }
  }, [checkAuthStatus]);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
      setUser(null);
      setStudent(null);
    } catch (error) {
      console.error('Ошибка выхода:', error);
      // Даже если произошла ошибка, очищаем состояние
      setUser(null);
      setStudent(null);
    }
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      setStudent(response.student);
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  // Мемоизируем значение контекста для предотвращения лишних ререндеров
  const value = useMemo(() => ({
    user,
    student,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    checkAuthStatus
  }), [user, student, loading, login, register, logout, updateProfile, checkAuthStatus]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
