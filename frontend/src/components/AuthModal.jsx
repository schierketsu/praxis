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
    setMode('login'); // Сбрасываем на режим входа
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
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
        },
        mask: {
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(0, 0, 0, 0.3)'
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
