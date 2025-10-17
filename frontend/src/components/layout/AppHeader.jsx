import React, { useState, useEffect } from 'react';
import { Layout, Button, Space, Typography, Dropdown, Avatar, Modal } from 'antd';
import { UserOutlined, LoginOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../AuthModal';

const { Title } = Typography;

const headerStyle = {
  width: "100%",
  height: 80,
  padding: "0 40px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: 'var(--primary-gradient)',
  boxShadow: 'var(--shadow-soft)',
  backdropFilter: 'blur(20px)',
  borderBottom: '1px solid var(--glass-border)',
  position: 'relative',
  zIndex: 1000
};

const titleStyle = {
  color: 'white',
  margin: 0,
  fontSize: '28px',
  fontWeight: '700',
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  letterSpacing: '-0.3px'
};

export default function AppHeader() {
  const { user, student, isAuthenticated, logout } = useAuth();
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' или 'register'
  const navigate = useNavigate();


  const handleAuthSuccess = (response) => {
    setAuthModalVisible(false);
    // Состояние авторизации обновится автоматически через AuthContext
  };

  const handleModalClose = () => {
    setAuthModalVisible(false);
    // Не сбрасываем режим, чтобы при повторном открытии был тот же режим
  };

  const handleLoginClick = () => {
    setAuthModalMode('login');
    setAuthModalVisible(true);
  };

  const handleRegisterClick = () => {
    setAuthModalMode('register');
    setAuthModalVisible(true);
  };

  const handleLogout = async () => {
    await logout();
  };

  // Обработчик события для открытия модального окна
  useEffect(() => {
    const handleOpenAuthModal = (event) => {
      const { mode } = event.detail;
      setAuthModalMode(mode);
      setAuthModalVisible(true);
    };

    window.addEventListener('openAuthModal', handleOpenAuthModal);

    return () => {
      window.removeEventListener('openAuthModal', handleOpenAuthModal);
    };
  }, []);

  const handleProfileClick = () => {
    navigate('/dashboard');
  };

  const handleApplicationsClick = () => {
    navigate('/applications');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Профиль',
      onClick: handleProfileClick
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Заявки',
      onClick: handleApplicationsClick
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Выйти',
      onClick: handleLogout
    }
  ];

  return (
    <>
      <Layout.Header style={headerStyle}>
        {/* Левая часть - пустая для баланса */}
        <div style={{ width: '200px' }}></div>

        {/* Центральная часть - только название */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
          position: 'relative'
        }}>
          <Title level={3} style={titleStyle}>
            практикастудентам.рф
          </Title>
        </div>

        {/* Правая часть - кнопки или профиль */}
        <div style={{ width: '200px', display: 'flex', justifyContent: 'flex-end' }}>
          {isAuthenticated ? (
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Button
                type="text"
                size="large"
                style={{
                  borderRadius: '12px',
                  height: '44px',
                  padding: '0 16px',
                  fontWeight: '600',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.3s ease'
                }}
              >
                <Space>
                  <Avatar
                    size="small"
                    icon={<UserOutlined />}
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                  />
                  {user?.first_name || user?.username}
                </Space>
              </Button>
            </Dropdown>
          ) : (
            <Space size="middle">
              <Button
                type="primary"
                icon={<UserOutlined />}
                size="large"
                onClick={handleLoginClick}
                style={{
                  borderRadius: '12px',
                  height: '44px',
                  padding: '0 24px',
                  fontWeight: '600',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.3s ease'
                }}
              >
                Войти
              </Button>
              <Button
                icon={<LoginOutlined />}
                size="large"
                onClick={handleRegisterClick}
                style={{
                  borderRadius: '12px',
                  height: '44px',
                  padding: '0 24px',
                  fontWeight: '600',
                  background: 'white',
                  color: '#667eea',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.3s ease'
                }}
              >
                Регистрация
              </Button>
            </Space>
          )}
        </div>
      </Layout.Header>

      <AuthModal
        visible={authModalVisible}
        onClose={handleModalClose}
        onSuccess={handleAuthSuccess}
        initialMode={authModalMode}
      />
    </>
  );
}