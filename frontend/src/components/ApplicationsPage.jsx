import React from 'react';
import { Layout, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import AppHeader from './layout/AppHeader';
import ApplicationsTable from './ApplicationsTable';

const { Content } = Layout;

const contentStyle = {
  minHeight: 'calc(100vh - 80px)',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  padding: '0',
  position: 'relative'
};

export default function ApplicationsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Получаем предзаполненную компанию из состояния навигации
  const preselectedCompany = location.state?.preselectedCompany;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Content style={contentStyle}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 24px' }}>
          {/* Кнопка назад */}
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/')}
            size="large"
            style={{
              marginBottom: '32px',
              borderRadius: '12px',
              height: '48px',
              fontWeight: '600',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#667eea',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            Назад к главной
          </Button>

          <ApplicationsTable preselectedCompany={preselectedCompany} />
        </div>
      </Content>
    </Layout>
  );
}
