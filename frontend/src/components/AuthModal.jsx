import React, { useState } from 'react';
import { Modal, message, Tabs, Button, Space } from 'antd';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import UnifiedLogin from './UnifiedLogin';
import StudentRegistration from './StudentRegistration';
import CompanyRegistration from './CompanyRegistration';

export default function AuthModal({ visible, onClose, onSuccess, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login', 'register', 'company-login', 'company-register'
  const [userType, setUserType] = useState('student'); // 'student' или 'company'

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
      width={mode === 'register' || mode === 'company-register' ? 600 : 500}
      centered
      styles={{
        body: {
          padding: '0',
          // background: 'var(--background-gradient)',
          // borderRadius: '24px',
          // overflow: 'hidden',
          // boxShadow: 'var(--shadow-strong)',
          // border: '1px solid var(--glass-border)'
        },
        mask: {
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(0, 0, 0, 0.4)'
        }
      }}
    >
      {/* Переключатель типа пользователя - только для регистрации */}
      {(mode === 'register' || mode === 'company-register') && (
        <div style={{
          padding: '24px 24px 0 24px'
        }}>
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '20px'
          }}>
            <Button
              type={userType === 'student' ? 'primary' : 'text'}
              icon={<UserOutlined />}
              onClick={() => handleUserTypeChange('student')}
              style={{
                flex: 1,
                height: '40px',
                borderRadius: '8px',
                background: userType === 'student' ? 'var(--primary-gradient)' : 'rgba(255, 255, 255, 0.2)',
                border: userType === 'student' ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
                color: userType === 'student' ? '#fff' : '#333',
                fontWeight: '600',
                transition: 'all 0.3s ease'
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
                height: '40px',
                borderRadius: '8px',
                background: userType === 'company' ? 'var(--primary-gradient)' : 'rgba(255, 255, 255, 0.2)',
                border: userType === 'company' ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
                color: userType === 'company' ? '#fff' : '#333',
                fontWeight: '600',
                transition: 'all 0.3s ease'
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

