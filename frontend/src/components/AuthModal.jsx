import React, { useState } from 'react';
import { Modal, message } from 'antd';
import StudentLogin from './StudentLogin';
import StudentRegistration from './StudentRegistration';
import CompanyLogin from './CompanyLogin';
import CompanyRegistration from './CompanyRegistration';

export default function AuthModal({ visible, onClose, onSuccess, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login', 'register', 'company-login', 'company-register'

  // Обновляем режим при изменении initialMode
  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleSuccess = (response) => {
    if (mode === 'login' || mode === 'company-login') {
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
    } else if (mode === 'company-login') {
      setMode('company-register');
    } else if (mode === 'company-register') {
      setMode('company-login');
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
          background: 'var(--background-gradient)',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-strong)',
          border: '1px solid var(--glass-border)'
        },
        mask: {
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(0, 0, 0, 0.4)'
        }
      }}
    >
      {mode === 'login' ? (
        <StudentLogin
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          onSwitchToRegister={handleSwitchMode}
        />
      ) : mode === 'register' ? (
        <StudentRegistration
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      ) : mode === 'company-login' ? (
        <CompanyLogin
          onSuccess={handleSuccess}
        />
      ) : mode === 'company-register' ? (
        <CompanyRegistration
          onSuccess={handleSuccess}
        />
      ) : (
        <StudentLogin
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          onSwitchToRegister={handleSwitchMode}
        />
      )}
    </Modal>
  );
}

