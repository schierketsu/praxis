import React, { useState, useEffect } from 'react';
import { Layout, Button, Space, Typography, Dropdown, Avatar, Modal, Drawer } from 'antd';
import { UserOutlined, LoginOutlined, LogoutOutlined, SettingOutlined, MenuOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../AuthModal';

const { Title } = Typography;

const getHeaderStyle = (isMobile) => ({
  width: "100%",
  height: isMobile ? 60 : 80,
  padding: isMobile ? "0 12px" : "0 40px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: '#d1e3f7',
  boxShadow: 'var(--shadow-soft)',
  backdropFilter: 'blur(20px)',
  borderBottom: '1px solid var(--glass-border)',
  position: 'relative',
  zIndex: 1000,
  minHeight: isMobile ? '60px' : '80px'
});

const getTitleStyle = (isMobile) => ({
  color: 'black',
  margin: 0,
  fontSize: isMobile ? '22px' : '32px',
  fontWeight: '700',
  textShadow: 'none',
  letterSpacing: '-0.3px'
});

export default function AppHeader() {
  const { user, student, company, isAuthenticated, logout } = useAuth();
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' или 'register'
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const navigate = useNavigate();

  // Определяем мобильные устройства
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Добавляем CSS стили для переопределения Ant Design
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .custom-login-btn.ant-btn {
        background: black !important;
        color: white !important;
        border: none !important;
      }
      .custom-login-btn.ant-btn:hover {
        background: #333 !important;
        color: white !important;
      }
      .ant-btn:focus {
        outline: none !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
      }
      .ant-btn:active {
        transform: translateY(1px) !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);


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
      const { mode, userType } = event.detail;
      setAuthModalMode(mode);
      setAuthModalVisible(true);

      // Если передан userType, передаем его в AuthModal
      if (userType) {
        // Создаем дополнительное событие для передачи userType в AuthModal
        const userTypeEvent = new CustomEvent('setUserType', {
          detail: { userType }
        });
        window.dispatchEvent(userTypeEvent);
      }
    };

    window.addEventListener('openAuthModal', handleOpenAuthModal);

    return () => {
      window.removeEventListener('openAuthModal', handleOpenAuthModal);
    };
  }, []);

  const handleProfileClick = () => {
    if (student) {
      navigate('/dashboard');
    } else if (company) {
      navigate('/company-dashboard');
    }
  };

  const handleApplicationsClick = () => {
    navigate('/applications');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: student ? 'Профиль' : 'Панель управления',
      onClick: handleProfileClick
    },
    ...(student ? [{
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Заявки',
      onClick: handleApplicationsClick
    }] : []),
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
      <Layout.Header style={getHeaderStyle(isMobile)}>
        {/* Левая часть - название */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          flex: 1
        }}>
          <Title level={3} style={{
            ...getTitleStyle(isMobile),
            fontSize: isMobile ? 'clamp(16px, 4vw, 22px)' : 'clamp(18px, 4vw, 32px)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textAlign: 'left',
            margin: 0
          }}>
            {isMobile ? 'практикастудентам.рф' : 'практикастудентам.рф'}
          </Title>
        </div>

        {/* Правая часть - кнопки или профиль */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: isMobile ? '8px' : '12px'
        }}>
          {isAuthenticated ? (
            <>
              {isMobile ? (
                <Button
                  type="default"
                  icon={<MenuOutlined />}
                  size="middle"
                  onClick={() => setMobileMenuVisible(true)}
                  style={{
                    borderRadius: '8px',
                    height: '36px',
                    width: '36px',
                    padding: '0',
                    fontWeight: '600',
                    background: 'black',
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                />
              ) : (
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                  trigger={['click']}
                >
                  <Button
                    type="default"
                    icon={<UserOutlined />}
                    size="large"
                    style={{
                      borderRadius: '12px',
                      height: '44px',
                      width: '44px',
                      padding: '0',
                      fontWeight: '600',
                      background: 'black',
                      color: 'white',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  />
                </Dropdown>
              )}
            </>
          ) : (
            <Space size={isMobile ? 'small' : 'middle'}>
              {!isMobile && (
                <Button
                  type="default"
                  icon={<LoginOutlined />}
                  size="large"
                  onClick={handleRegisterClick}
                  style={{
                    borderRadius: '12px',
                    height: '44px',
                    padding: '0 24px',
                    fontWeight: '600',
                    background: 'white',
                    color: 'black',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Регистрация
                </Button>
              )}
              <Button
                type="default"
                icon={<UserOutlined />}
                size={isMobile ? 'middle' : 'large'}
                onClick={handleLoginClick}
                className="custom-login-btn"
                style={{
                  borderRadius: isMobile ? '8px' : '12px',
                  height: isMobile ? '36px' : '44px',
                  padding: isMobile ? '0 16px' : '0 24px',
                  fontWeight: '600',
                  background: 'black',
                  color: 'white',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.3s ease'
                }}
              >
                {isMobile ? 'Войти' : 'Войти'}
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

      {/* Мобильное меню */}
      <Drawer
        title="Меню"
        placement="right"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        width={280}
        styles={{ body: { padding: '24px' } }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {userMenuItems.map((item, index) => (
            <div key={index}>
              {item.type === 'divider' ? (
                <div style={{ 
                  height: '1px', 
                  background: '#f0f0f0', 
                  margin: '16px 0' 
                }} />
              ) : (
                <Button
                  type="text"
                  icon={item.icon}
                  onClick={() => {
                    item.onClick();
                    setMobileMenuVisible(false);
                  }}
                  style={{
                    width: '100%',
                    height: '48px',
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    fontSize: '16px',
                    fontWeight: '500'
                  }}
                >
                  {item.label}
                </Button>
              )}
            </div>
          ))}
        </div>
      </Drawer>
    </>
  );
}