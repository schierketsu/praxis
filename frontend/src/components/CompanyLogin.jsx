import React, { useState } from 'react';
import { Form, Input, Button, Typography, Space, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { companyAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

export default function CompanyLogin({ onSuccess }) {
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const response = await login(values); // Используем контекст
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
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <Title level={2} style={{
                marginBottom: '24px',
                background: 'var(--primary-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '28px',
                fontWeight: '700'
            }}>
                Вход для компаний
            </Title>

            <Form
                name="company-login"
                onFinish={handleSubmit}
                layout="vertical"
                size="large"
                style={{ maxWidth: '400px', margin: '0 auto' }}
            >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Введите имя пользователя' }]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="Имя пользователя"
                        style={{ borderRadius: '12px', height: '48px' }}
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Введите пароль' }]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Пароль"
                        style={{ borderRadius: '12px', height: '48px' }}
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        block
                        style={{
                            borderRadius: '12px',
                            height: '48px',
                            fontWeight: '600',
                            background: 'var(--primary-gradient)',
                            border: 'none',
                            boxShadow: 'var(--shadow-soft)',
                            fontSize: '16px'
                        }}
                    >
                        Войти
                    </Button>
                </Form.Item>
            </Form>

            <Text style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                Нет аккаунта?
                <Button
                    type="link"
                    style={{
                        padding: '0 4px',
                        color: '#667eea',
                        fontWeight: '600'
                    }}
                    onClick={() => {
                        // Переключаем на регистрацию
                        window.dispatchEvent(new CustomEvent('openAuthModal', {
                            detail: { mode: 'company-register' }
                        }));
                    }}
                >
                    Зарегистрироваться
                </Button>
            </Text>
        </div>
    );
}
