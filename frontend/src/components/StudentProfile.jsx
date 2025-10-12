import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Space, Tag, Row, Col, Avatar, Divider, message, Modal } from 'antd';
import { UserOutlined, EditOutlined, LogoutOutlined, MailOutlined, PhoneOutlined, BookOutlined } from '@ant-design/icons';
import { authAPI } from '../services/api';
import StudentProfileEdit from './StudentProfileEdit';

const { Title, Text, Paragraph } = Typography;

export default function StudentProfile({ student, onLogout, onEdit }) {
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(student);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await authAPI.logout();
      message.success('Выход выполнен успешно');
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.error('Ошибка выхода:', error);
      message.error('Ошибка при выходе');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditModalVisible(true);
  };

  const handleEditSave = (response) => {
    setCurrentStudent(response.student);
    setEditModalVisible(false);
    if (onEdit) {
      onEdit(response);
    }
  };

  const handleEditCancel = () => {
    setEditModalVisible(false);
  };

  if (!currentStudent) {
    return null;
  }

  return (
    <Card
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}
      styles={{
        body: {
          padding: '32px'
        }
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Avatar
          size={80}
          icon={<UserOutlined />}
          style={{
            backgroundColor: '#667eea',
            marginBottom: '16px'
          }}
        />
        <Title level={2} style={{ margin: '0 0 8px 0' }}>
          {currentStudent.user?.first_name} {currentStudent.user?.last_name}
        </Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          @{currentStudent.user?.username}
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <div style={{ marginBottom: '16px' }}>
            <Text strong style={{ color: '#667eea' }}>
              <MailOutlined style={{ marginRight: '8px' }} />
              Email:
            </Text>
            <br />
            <Text>{currentStudent.user?.email || 'Не указан'}</Text>
          </div>
        </Col>
        <Col xs={24} sm={12}>
          <div style={{ marginBottom: '16px' }}>
            <Text strong style={{ color: '#667eea' }}>
              <PhoneOutlined style={{ marginRight: '8px' }} />
              Телефон:
            </Text>
            <br />
            <Text>{currentStudent.phone || 'Не указан'}</Text>
          </div>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <div style={{ marginBottom: '16px' }}>
            <Text strong style={{ color: '#667eea' }}>
              <BookOutlined style={{ marginRight: '8px' }} />
              Университет:
            </Text>
            <br />
            <Text>{currentStudent.university_name}</Text>
          </div>
        </Col>
        <Col xs={24} sm={12}>
          <div style={{ marginBottom: '16px' }}>
            <Text strong style={{ color: '#667eea' }}>
              Курс:
            </Text>
            <br />
            <Text>{currentStudent.course} курс</Text>
          </div>
        </Col>
      </Row>

      {currentStudent.specialization && (
        <div style={{ marginBottom: '16px' }}>
          <Text strong style={{ color: '#667eea' }}>
            Специализация:
          </Text>
          <br />
          <Text>{currentStudent.specialization}</Text>
        </div>
      )}

      {currentStudent.bio && (
        <div style={{ marginBottom: '16px' }}>
          <Text strong style={{ color: '#667eea' }}>
            О себе:
          </Text>
          <br />
          <Paragraph style={{ marginTop: '8px' }}>
            {currentStudent.bio}
          </Paragraph>
        </div>
      )}

      {currentStudent.skills && currentStudent.skills.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <Text strong style={{ color: '#667eea' }}>
            Навыки:
          </Text>
          <br />
          <div style={{ marginTop: '8px' }}>
            {currentStudent.skills.map((skill, index) => (
              <Tag key={index} color="blue" style={{ marginBottom: '4px' }}>
                {skill}
              </Tag>
            ))}
          </div>
        </div>
      )}

      {currentStudent.interests && currentStudent.interests.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <Text strong style={{ color: '#667eea' }}>
            Интересы:
          </Text>
          <br />
          <div style={{ marginTop: '8px' }}>
            {currentStudent.interests.map((interest, index) => (
              <Tag key={index} color="green" style={{ marginBottom: '4px' }}>
                {interest}
              </Tag>
            ))}
          </div>
        </div>
      )}

      <Divider />

      <div style={{ textAlign: 'center' }}>
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={handleEdit}
            size="large"
            style={{
              borderRadius: '12px',
              height: '48px',
              paddingLeft: '24px',
              paddingRight: '24px',
              fontWeight: '600',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
            }}
          >
            Редактировать профиль
          </Button>
          <Button
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            loading={loading}
            size="large"
            style={{
              borderRadius: '12px',
              height: '48px',
              paddingLeft: '24px',
              paddingRight: '24px',
              fontWeight: '600'
            }}
          >
            Выйти
          </Button>
        </Space>
      </div>

      <Modal
        open={editModalVisible}
        onCancel={handleEditCancel}
        footer={null}
        width={800}
        centered
        styles={{
          body: {
            padding: '0',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            borderRadius: '20px'
          },
          mask: {
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(0, 0, 0, 0.3)'
          }
        }}
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
        <StudentProfileEdit
          student={currentStudent}
          onSave={handleEditSave}
          onCancel={handleEditCancel}
        />
      </Modal>
    </Card>
  );
}
