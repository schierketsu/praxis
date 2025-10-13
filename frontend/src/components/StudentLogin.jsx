import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Space, message, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text, Link } = Typography;

export default function StudentLogin({ onSuccess, onCancel, onSwitchToRegister }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await login({
        username: values.username,
        password: values.password
      });
      
      if (onSuccess) {
        onSuccess(response);
      }
    } catch (error) {
      console.error('Ошибка входа:', error);
      if (error.response?.data?.error) {
        message.error(error.response.data.error);
      } else if (error.response?.data) {
        const errors = error.response.data;
        if (typeof errors === 'object') {
          Object.keys(errors).forEach(key => {
            if (Array.isArray(errors[key])) {
              message.error(`${key}: ${errors[key].join(', ')}`);
            } else {
              message.error(`${key}: ${errors[key]}`);
            }
          });
        }
      } else {
        message.error('Ошибка при входе. Проверьте данные и попробуйте еще раз.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: '48px',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--shadow-soft)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <Title level={2} style={{ 
          margin: '0 0 16px 0',
          background: 'var(--primary-gradient)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '32px',
          fontWeight: '800',
          letterSpacing: '-0.02em'
        }}>
          Вход в систему
        </Title>
        <Text style={{ 
          fontSize: '16px',
          color: 'var(--text-secondary)',
          fontWeight: '500'
        }}>
          Войдите в свой аккаунт
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        size="large"
      >
        <Form.Item
          name="username"
          label="Имя пользователя"
          rules={[{ required: true, message: 'Введите имя пользователя' }]}
        >
          <Input 
            prefix={<UserOutlined />} 
            placeholder="Имя пользователя" 
            autoComplete="username"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Пароль"
          rules={[{ required: true, message: 'Введите пароль' }]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="Пароль"
            autoComplete="current-password"
          />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Запомнить меня</Checkbox>
        </Form.Item>

        <Form.Item style={{ marginBottom: '24px', textAlign: 'center' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              block
              style={{
                borderRadius: '16px',
                height: '52px',
                fontWeight: '600',
                background: 'var(--primary-gradient)',
                border: 'none',
                boxShadow: 'var(--shadow-soft)',
                fontSize: '16px',
                transition: 'var(--transition)'
              }}
            >
              Войти
            </Button>
            
            <div style={{ textAlign: 'center' }}>
              <Text style={{ 
                color: 'var(--text-secondary)',
                fontSize: '15px'
              }}>
                Нет аккаунта?{' '}
                <Link 
                  onClick={onSwitchToRegister}
                  style={{ 
                    color: 'var(--text-primary)',
                    fontWeight: '600',
                    textDecoration: 'none'
                  }}
                >
                  Зарегистрироваться
                </Link>
              </Text>
            </div>
          </Space>
        </Form.Item>
      </Form>

    </div>
  );
}
