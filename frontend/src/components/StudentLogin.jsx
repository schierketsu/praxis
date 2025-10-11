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
        padding: '40px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={2} style={{ 
          margin: '0 0 16px 0',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '28px',
          fontWeight: '700'
        }}>
          Вход в систему
        </Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
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
                borderRadius: '12px',
                height: '48px',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
              }}
            >
              Войти
            </Button>
            
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary">
                Нет аккаунта?{' '}
                <Link 
                  onClick={onSwitchToRegister}
                  style={{ 
                    color: '#667eea',
                    fontWeight: '600'
                  }}
                >
                  Зарегистрироваться
                </Link>
              </Text>
            </div>
          </Space>
        </Form.Item>
      </Form>

      {onCancel && (
        <div style={{ textAlign: 'center' }}>
          <Button
            size="large"
            onClick={onCancel}
            style={{
              borderRadius: '12px',
              height: '40px',
              paddingLeft: '24px',
              paddingRight: '24px',
              fontWeight: '600'
            }}
          >
            Отмена
          </Button>
        </div>
      )}
    </div>
  );
}
