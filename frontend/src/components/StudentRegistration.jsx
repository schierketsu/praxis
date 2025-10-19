import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Space, message, Row, Col } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

export default function StudentRegistration({ onSuccess, onCancel, onSwitchToLogin }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { register, login } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Подготавливаем данные для отправки (только основные поля)
      const studentData = {
        username: values.username,
        email: values.email,
        first_name: values.first_name,
        last_name: values.last_name,
        password: values.password,
        password_confirm: values.password_confirm
      };

      const response = await register(studentData);

      // Автоматически авторизуем пользователя после успешной регистрации
      try {
        await login({
          username: values.username,
          password: values.password
        });

        if (onSuccess) {
          onSuccess(response);
        }
      } catch (loginError) {
        console.error('Ошибка автоматической авторизации:', loginError);
        // Регистрация прошла успешно, но авторизация не удалась
        // Показываем сообщение об успешной регистрации
        if (onSuccess) {
          onSuccess(response);
        }
      }
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      if (error.response?.data?.error) {
        message.error(error.response.data.error);
      } else if (error.response?.data) {
        // Обработка ошибок валидации
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
        message.error('Ошибка при регистрации. Попробуйте еще раз.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: isMobile ? '0' : '48px',
        background: isMobile ? '#ffffff' : 'var(--glass-bg)',
        backdropFilter: isMobile ? 'none' : 'blur(20px)',
        borderRadius: isMobile ? '0' : '24px',
        border: isMobile ? 'none' : '1px solid var(--glass-border)',
        boxShadow: isMobile ? 'none' : 'var(--shadow-soft)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ 
        textAlign: 'center', 
        marginBottom: isMobile ? '24px' : '40px',
        padding: isMobile ? '0 16px' : '0'
      }}>
        <Title level={2} style={{
          margin: '0 0 16px 0',
          fontSize: isMobile ? '1.6rem' : '2.5rem',
          fontWeight: '700',
          color: '#1a202c',
          lineHeight: '1.2'
        }}>
          Регистрация студента
        </Title>
        <Text style={{
          fontSize: isMobile ? '14px' : '16px',
          color: 'var(--text-secondary)',
          fontWeight: '500',
          lineHeight: '1.6'
        }}>
          Создайте аккаунт для поиска практик. Дополнительную информацию можно будет заполнить в личном кабинете.
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        size="large"
        style={{
          padding: isMobile ? '0 16px' : '0'
        }}
      >
        <Row gutter={isMobile ? [0, 8] : [16, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="first_name"
              label="Имя"
              rules={[{ required: true, message: 'Введите имя' }]}
              style={{
                marginBottom: isMobile ? '8px' : '24px'
              }}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Имя"
                style={{
                  height: isMobile ? '48px' : '40px',
                  borderRadius: isMobile ? '12px' : '8px',
                  fontSize: isMobile ? '16px' : '14px'
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="last_name"
              label="Фамилия"
              rules={[{ required: true, message: 'Введите фамилию' }]}
              style={{
                marginBottom: isMobile ? '8px' : '24px'
              }}
            >
              <Input 
                placeholder="Фамилия"
                style={{
                  height: isMobile ? '48px' : '40px',
                  borderRadius: isMobile ? '12px' : '8px',
                  fontSize: isMobile ? '16px' : '14px'
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={isMobile ? [0, 8] : [16, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="username"
              label="Имя пользователя"
              rules={[
                { required: true, message: 'Введите имя пользователя' },
                { min: 3, message: 'Минимум 3 символа' }
              ]}
              style={{
                marginBottom: isMobile ? '8px' : '24px'
              }}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="username"
                style={{
                  height: isMobile ? '48px' : '40px',
                  borderRadius: isMobile ? '12px' : '8px',
                  fontSize: isMobile ? '16px' : '14px'
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Введите email' },
                { type: 'email', message: 'Некорректный email' }
              ]}
              style={{
                marginBottom: isMobile ? '8px' : '24px'
              }}
            >
              <Input 
                prefix={<MailOutlined />} 
                placeholder="email@example.com"
                style={{
                  height: isMobile ? '48px' : '40px',
                  borderRadius: isMobile ? '12px' : '8px',
                  fontSize: isMobile ? '16px' : '14px'
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={isMobile ? [0, 8] : [16, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="password"
              label="Пароль"
              rules={[
                { required: true, message: 'Введите пароль' },
                { min: 8, message: 'Минимум 8 символов' }
              ]}
              style={{
                marginBottom: isMobile ? '8px' : '24px'
              }}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Пароль"
                style={{
                  height: isMobile ? '48px' : '40px',
                  borderRadius: isMobile ? '12px' : '8px',
                  fontSize: isMobile ? '16px' : '14px'
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="password_confirm"
              label="Подтверждение пароля"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Подтвердите пароль' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Пароли не совпадают'));
                  },
                }),
              ]}
              style={{
                marginBottom: isMobile ? '8px' : '24px'
              }}
            >
              <Input.Password 
                placeholder="Подтвердите пароль"
                style={{
                  height: isMobile ? '48px' : '40px',
                  borderRadius: isMobile ? '12px' : '8px',
                  fontSize: isMobile ? '16px' : '14px'
                }}
              />
            </Form.Item>
          </Col>
        </Row>


        <Form.Item style={{ 
          marginBottom: isMobile ? '20px' : '24px', 
          textAlign: 'center',
          padding: isMobile ? '0 16px' : '0'
        }}>
          <Space size="middle">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              block={isMobile}
              style={{
                borderRadius: isMobile ? '8px' : '16px',
                height: isMobile ? '44px' : '52px',
                padding: isMobile ? '0 24px' : '0 32px',
                fontSize: isMobile ? '1rem' : '16px',
                fontWeight: '600',
                background: isMobile ? '#2054DE' : 'var(--primary-gradient)',
                border: isMobile ? '2px solid #2054DE' : 'none',
                color: 'white',
                boxShadow: isMobile ? '0 8px 32px rgba(32, 84, 222, 0.3)' : 'var(--shadow-soft)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={isMobile ? (e) => {
                e.currentTarget.style.background = '#1a47c7';
                e.currentTarget.style.borderColor = '#1a47c7';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(32, 84, 222, 0.4)';
              } : undefined}
              onMouseLeave={isMobile ? (e) => {
                e.currentTarget.style.background = '#2054DE';
                e.currentTarget.style.borderColor = '#2054DE';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(32, 84, 222, 0.3)';
              } : undefined}
            >
              Зарегистрироваться
            </Button>
          </Space>
        </Form.Item>
      </Form>

      <div style={{ 
        textAlign: 'center',
        padding: isMobile ? '0 16px' : '0'
      }}>
        <Space direction={isMobile ? 'vertical' : 'horizontal'} size={isMobile ? 'small' : 'middle'}>
          <Text style={{
            color: 'var(--text-secondary)',
            fontSize: isMobile ? '14px' : '14px'
          }}>
            Уже зарегистрированы?
          </Text>
          <Button
            type="link"
            onClick={onSwitchToLogin}
            style={{
              color: 'var(--primary-color)',
              fontWeight: '600',
              padding: '0',
              height: 'auto',
              fontSize: isMobile ? '14px' : '14px',
              minHeight: isMobile ? '44px' : 'auto'
            }}
          >
            Войти
          </Button>
        </Space>
      </div>
    </div>
  );
}
