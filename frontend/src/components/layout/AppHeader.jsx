import React from 'react';
import { Layout, Button, Space, Typography } from 'antd';
import { UserOutlined, LoginOutlined } from '@ant-design/icons';

const { Title } = Typography;

const headerStyle = {
  width: "100%",
  height: 80,
  padding: "0 40px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  position: 'relative'
};

const titleStyle = {
  color: 'white',
  margin: 0,
  fontSize: '36px',
  fontWeight: '700',
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  letterSpacing: '-0.5px'
};

export default function AppHeader() {
  return (
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
          Праксис
        </Title>
      </div>

      {/* Правая часть - кнопки */}
      <div style={{ width: '200px', display: 'flex', justifyContent: 'flex-end' }}>
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<UserOutlined />} 
            size="large"
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
      </div>
    </Layout.Header>
  );
}