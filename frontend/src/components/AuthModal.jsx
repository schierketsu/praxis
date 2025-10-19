import React, { useState, useEffect } from 'react';
import { Modal, message, Tabs, Button, Space } from 'antd';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import UnifiedLogin from './UnifiedLogin';
import StudentRegistration from './StudentRegistration';
import CompanyRegistration from './CompanyRegistration';

export default function AuthModal({ visible, onClose, onSuccess, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login', 'register', 'company-login', 'company-register'
  const [userType, setUserType] = useState('student'); // 'student' или 'company'
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Обновляем режим при изменении initialMode
  React.useEffect(() => {
    setMode(initialMode);
    // Определяем тип пользователя на основе режима
    if (initialMode === 'company-register') {
      setUserType('company');
    } else {
      setUserType('student');
    }
  }, [initialMode]);

  // Обновляем тип пользователя при изменении режима
  React.useEffect(() => {
    if (mode === 'company-register') {
      setUserType('company');
    } else {
      setUserType('student');
    }
  }, [mode]);

  // Обработчик события для установки userType
  React.useEffect(() => {
    const handleSetUserType = (event) => {
      const { userType } = event.detail;
      setUserType(userType);
      if (userType === 'company') {
        setMode('company-register');
      } else if (userType === 'student') {
        setMode('register');
      }
    };

    window.addEventListener('setUserType', handleSetUserType);

    return () => {
      window.removeEventListener('setUserType', handleSetUserType);
    };
  }, []);

  const handleSuccess = (response) => {
    if (mode === 'login') {
      message.success('Вход выполнен успешно!');
    } else if (mode === 'register') {
      message.success('Регистрация и вход выполнены успешно! Рекомендуем заполнить профиль в личном кабинете.');
    } else if (mode === 'company-register') {
      message.success('Регистрация компании успешна! Ожидайте модерации администратором.');
    }
    if (onSuccess) {
      onSuccess(response);
    }
    onClose();
  };

  const handleSwitchMode = () => {
    if (mode === 'login') {
      setMode('register');
    } else if (mode === 'register') {
      setMode('login');
    } else if (mode === 'company-register') {
      setMode('login');
    }
  };

  const handleSwitchToRegister = () => {
    // При переходе к регистрации показываем переключатель типа пользователя
    setMode('register');
    setUserType('student');
  };

  const handleSwitchToLogin = () => {
    // При переходе к входу убираем переключатель типа пользователя
    setMode('login');
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    // При переключении типа пользователя переходим в режим регистрации
    if (type === 'student') {
      setMode('register');
    } else {
      setMode('company-register');
    }
  };

  const handleCancel = () => {
    // Не сбрасываем режим, оставляем текущий
    onClose();
  };

  return (
    <Modal
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={isMobile ? '95%' : (mode === 'register' || mode === 'company-register' ? 600 : 500)}
      centered
      style={{
        top: isMobile ? 10 : undefined
      }}
      styles={{
        body: {
          padding: isMobile ? '20px' : '0',
          maxHeight: isMobile ? '85vh' : 'auto',
          overflow: isMobile ? 'auto' : 'visible',
          background: '#ffffff',
          borderRadius: isMobile ? '20px' : '8px'
        },
        mask: {
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }
      }}
    >
      {/* Переключатель типа пользователя - только для регистрации */}
      {(mode === 'register' || mode === 'company-register') && (
        <div style={{
          padding: isMobile ? '0 0 20px 0' : '24px 24px 0 24px'
        }}>
          <div style={{
            display: 'flex',
            background: isMobile ? '#f8f9fa' : 'rgba(255, 255, 255, 0.1)',
            borderRadius: isMobile ? '16px' : '12px',
            padding: isMobile ? '6px' : '4px',
            marginBottom: isMobile ? '16px' : '20px',
            border: isMobile ? '1px solid #e9ecef' : 'none'
          }}>
            <Button
              type={userType === 'student' ? 'primary' : 'text'}
              icon={<UserOutlined />}
              onClick={() => handleUserTypeChange('student')}
              style={{
                flex: 1,
                height: isMobile ? '48px' : '40px',
                borderRadius: isMobile ? '12px' : '8px',
                background: userType === 'student' ? 'var(--primary-gradient)' : (isMobile ? 'transparent' : 'rgba(255, 255, 255, 0.2)'),
                border: userType === 'student' ? 'none' : (isMobile ? '1px solid #e9ecef' : '1px solid rgba(255, 255, 255, 0.3)'),
                color: userType === 'student' ? '#fff' : (isMobile ? '#495057' : '#333'),
                fontWeight: '600',
                transition: 'all 0.3s ease',
                fontSize: isMobile ? '16px' : '14px'
              }}
            >
              Студент
            </Button>
            <Button
              type={userType === 'company' ? 'primary' : 'text'}
              icon={<TeamOutlined />}
              onClick={() => handleUserTypeChange('company')}
              style={{
                flex: 1,
                height: isMobile ? '48px' : '40px',
                borderRadius: isMobile ? '12px' : '8px',
                background: userType === 'company' ? 'var(--primary-gradient)' : (isMobile ? 'transparent' : 'rgba(255, 255, 255, 0.2)'),
                border: userType === 'company' ? 'none' : (isMobile ? '1px solid #e9ecef' : '1px solid rgba(255, 255, 255, 0.3)'),
                color: userType === 'company' ? '#fff' : (isMobile ? '#495057' : '#333'),
                fontWeight: '600',
                transition: 'all 0.3s ease',
                fontSize: isMobile ? '16px' : '14px'
              }}
            >
              Компания
            </Button>
          </div>
        </div>
      )}

      {/* Содержимое формы */}
      <div>
        {mode === 'login' ? (
          <UnifiedLogin
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            onSwitchToRegister={handleSwitchToRegister}
          />
        ) : mode === 'register' ? (
          <StudentRegistration
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            onSwitchToLogin={handleSwitchToLogin}
          />
        ) : mode === 'company-register' ? (
          <CompanyRegistration
            onSuccess={handleSuccess}
            onSwitchToLogin={handleSwitchToLogin}
          />
        ) : (
          <UnifiedLogin
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            onSwitchToRegister={handleSwitchToRegister}
          />
        )}
      </div>
    </Modal>
  );
}

