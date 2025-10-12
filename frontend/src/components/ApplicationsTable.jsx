import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Typography, Space, Button, message, Spin, Empty, Modal } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { applicationsAPI } from '../services/api';
import ApplicationForm from './ApplicationForm';

const { Title, Text } = Typography;

// Вспомогательная функция для безопасного форматирования даты
const formatDate = (dateString) => {
  if (!dateString) return new Date().toISOString().split('T')[0];
  try {
    return dateString.split('T')[0];
  } catch (error) {
    console.warn('Ошибка форматирования даты:', error);
    return new Date().toISOString().split('T')[0];
  }
};

export default function ApplicationsTable({ preselectedCompany }) {
  const { user, student } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [hasUsedPreselectedCompany, setHasUsedPreselectedCompany] = useState(false);



  useEffect(() => {
    fetchApplications();
  }, []);

  // Автоматически открываем форму, если есть предзаполненная компания
  useEffect(() => {
    if (preselectedCompany && !hasUsedPreselectedCompany) {
      // Небольшая задержка, чтобы компонент успел загрузиться
      const timer = setTimeout(() => {
        setCreateModalVisible(true);
        setHasUsedPreselectedCompany(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [preselectedCompany, hasUsedPreselectedCompany]);

  // Сбрасываем флаг при изменении предзаполненной компании
  useEffect(() => {
    if (preselectedCompany) {
      setHasUsedPreselectedCompany(false);
    }
  }, [preselectedCompany]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await applicationsAPI.getApplications();
      console.log('Загружены заявки:', response);
      
      // Преобразуем данные из API в формат для таблицы
      const formattedApplications = response.results?.map(app => ({
        id: app.id,
        company: app.company_name,
        position: app.position_name,
        status: app.status,
        appliedDate: formatDate(app.applied_date || app.created_at),
        description: app.comment
      })) || [];
      
      setApplications(formattedApplications);
    } catch (error) {
      console.error('Ошибка загрузки заявок:', error);
      message.error('Ошибка при загрузке заявок');
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      pending: { color: 'orange', text: 'На рассмотрении' },
      // approved: { color: 'green', text: 'Одобрена' },
      accepted: { color: 'green', text: 'Одобрена' }, // Добавляем поддержку accepted
      rejected: { color: 'red', text: 'Отклонена' },
      cancelled: { color: 'red', text: 'Отменена' }
    };
    
    const config = statusConfig[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const handleCancelApplication = async (record) => {
    try {
      await applicationsAPI.updateApplication(record.id, { status: 'cancelled' });
      message.success('Заявка отменена');
      fetchApplications(); // Обновляем список
    } catch (error) {
      console.error('Ошибка отмены заявки:', error);
      message.error('Ошибка при отмене заявки');
    }
  };

  const handleCreateApplication = () => {
    setCreateModalVisible(true);
  };

  const handleCreateSave = (newApplication) => {
    console.log('Добавляем новую заявку:', newApplication);
    
    // Проверяем, что данные полные
    if (!newApplication.company || !newApplication.position) {
      console.warn('Неполные данные заявки, обновляем с сервера');
      fetchApplications();
    } else {
      // Добавляем новую заявку в начало списка
      setApplications(prev => [newApplication, ...prev]);
    }
    
    setCreateModalVisible(false);
  };

  const handleCreateCancel = () => {
    setCreateModalVisible(false);
    // Сбрасываем флаг использования предзаполненной компании
    setHasUsedPreselectedCompany(true);
  };

  const columns = [
    {
      title: 'Компания',
      dataIndex: 'company',
      key: 'company',
      width: 250,
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: '16px' }}>
            {text}
          </Text>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            {record.position}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      width: 200,
      render: (status) => getStatusTag(status),
      filters: [
        { text: 'На рассмотрении', value: 'pending' },
        // { text: 'Одобрена', value: 'approved' },
        { text: 'Одобрена', value: 'accepted' }, // Добавляем поддержку accepted
        { text: 'Отклонена', value: 'rejected' },
        { text: 'Отменена', value: 'cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Дата подачи',
      dataIndex: 'appliedDate',
      key: 'appliedDate',
      render: (date) => (
        <Text>{new Date(date).toLocaleDateString('ru-RU')}</Text>
      ),
      sorter: (a, b) => new Date(a.appliedDate) - new Date(b.appliedDate),
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      render: (text) => (
        <Text style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {text}
        </Text>
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        record.status === 'pending' && (
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleCancelApplication(record)}
          >
            Отменить
          </Button>
        )
      ),
    },
  ];

  return (
    <div>
      <Card
        style={{
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          marginBottom: '24px'
        }}
      >
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Title level={2} style={{ margin: 0, color: '#2d3748' }}>
              Мои заявки на практики
            </Title>
            <Text type="secondary" style={{ fontSize: '16px' }}>
              Здесь отображаются все ваши отправленные заявки на практики
            </Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateApplication}
            size="large"
            style={{
              borderRadius: '12px',
              height: '48px',
              fontWeight: '600',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
            }}
          >
            Новая заявка
          </Button>
        </div>

        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={applications}
            rowKey="id"
            pagination={false}
            locale={{
              emptyText: (
                <Empty
                  description="У вас пока нет отправленных заявок"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                  <Button type="primary" size="large">
                    Найти практики
                  </Button>
                </Empty>
              )
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.5)',
              borderRadius: '12px',
            }}
          />
        </Spin>
      </Card>

      {/* Модальное окно для создания заявки */}
      <Modal
        title={null}
        open={createModalVisible}
        closable={false}
        footer={null}
        width={800}
        style={{
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
        }}
        styles={{
          mask: {
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(0, 0, 0, 0.3)'
          }
        }}
      >
        <ApplicationForm
          onSave={handleCreateSave}
          onCancel={handleCreateCancel}
          loading={createLoading}
          preselectedCompany={preselectedCompany}
        />
      </Modal>
    </div>
  );
}
