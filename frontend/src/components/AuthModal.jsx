import React, { useState } from 'react';
import { Modal, message } from 'antd';
import StudentLogin from './StudentLogin';
import StudentRegistration from './StudentRegistration';

export default function AuthModal({ visible, onClose, onSuccess, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' или 'register'

  // Обновляем режим при изменении initialMode
  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleSuccess = (response) => {
    if (mode === 'login') {
      message.success('Вход выполнен успешно!');
    } else {
      message.success('Регистрация и вход выполнены успешно! Рекомендуем заполнить профиль в личном кабинете.');
    }
    if (onSuccess) {
      onSuccess(response);
    }
    onClose();
  };

  const handleSwitchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
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
      width={mode === 'register' ? 600 : 500}
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
      ) : (
        <StudentRegistration
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      )}
    </Modal>
  );
}
