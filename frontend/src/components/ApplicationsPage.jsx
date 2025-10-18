import React from 'react';
import { Layout, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import AppHeader from './layout/AppHeader';
import ApplicationsTable from './ApplicationsTable';

const { Content } = Layout;

const contentStyle = {
  minHeight: 'calc(100vh - 80px)',
  background: '#F5F5F5',
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
              borderRadius: 'var(--border-radius)',
              height: '48px',
              fontWeight: '600',
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(37, 99, 235, 0.2)',
              color: 'var(--text-primary)',
              boxShadow: 'var(--shadow-soft)'
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
