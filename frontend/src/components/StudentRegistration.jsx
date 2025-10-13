import React, { useState } from 'react';
import { Form, Input, Button, Typography, Space, message, Row, Col } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

export default function StudentRegistration({ onSuccess, onCancel }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { register, login } = useAuth();

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
          Регистрация студента
        </Title>
        <Text style={{ 
          fontSize: '16px',
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
      >
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="first_name"
              label="Имя"
              rules={[{ required: true, message: 'Введите имя' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Имя" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="last_name"
              label="Фамилия"
              rules={[{ required: true, message: 'Введите фамилию' }]}
            >
              <Input placeholder="Фамилия" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="username"
              label="Имя пользователя"
              rules={[
                { required: true, message: 'Введите имя пользователя' },
                { min: 3, message: 'Минимум 3 символа' }
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="username" />
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
            >
              <Input prefix={<MailOutlined />} placeholder="email@example.com" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="password"
              label="Пароль"
              rules={[
                { required: true, message: 'Введите пароль' },
                { min: 8, message: 'Минимум 8 символов' }
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
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
            >
              <Input.Password placeholder="Подтвердите пароль" />
            </Form.Item>
          </Col>
        </Row>


        <Form.Item style={{ marginBottom: '24px', textAlign: 'center' }}>
          <Space size="middle">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              style={{
                borderRadius: '16px',
                height: '52px',
                paddingLeft: '32px',
                paddingRight: '32px',
                fontWeight: '600',
                background: 'var(--primary-gradient)',
                border: 'none',
                boxShadow: 'var(--shadow-soft)',
                fontSize: '16px',
                transition: 'var(--transition)'
              }}
            >
              Зарегистрироваться
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}
