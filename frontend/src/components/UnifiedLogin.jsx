import React, { useState } from 'react';
import { Form, Input, Button, message, Space, Typography, Row, Col } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

export default function UnifiedLogin({ onSuccess, onCancel, onSwitchToRegister }) {
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const response = await login(values);
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
                    const firstError = Object.keys(errors)[0];
                    if (firstError && errors[firstError]) {
                        if (Array.isArray(errors[firstError])) {
                            message.error(`${firstError}: ${errors[firstError].join(', ')}`);
                        } else {
                            message.error(`${firstError}: ${errors[firstError]}`);
                        }
                    } else {
                        message.error('Ошибка при входе в систему');
                    }
                } else {
                    message.error('Ошибка при входе в систему');
                }
            } else {
                message.error('Ошибка при входе в систему');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid var(--glass-border)',
            boxShadow: 'var(--shadow-soft)',
            padding: '40px',
            maxWidth: '500px',
            margin: '0 auto',
            overflow: 'hidden'
        }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <Title level={2} style={{
                    margin: '0 0 16px 0',
                    fontSize: '2.5rem',
                    fontWeight: '700',
                    color: '#1a202c',
                    lineHeight: '1.2'
                }}>
                    Вход в систему
                </Title>
                <Text style={{
                    fontSize: '16px',
                    color: 'var(--text-secondary)',
                    fontWeight: '500',
                    lineHeight: '1.6'
                }}>
                    Войдите как студент или компания
                </Text>
            </div>

            <Form
                name="unified-login"
                onFinish={handleSubmit}
                layout="vertical"
                size="large"
            >
                <Form.Item
                    name="username"
                    label="Имя пользователя или email"
                    rules={[
                        { required: true, message: 'Введите имя пользователя или email' }
                    ]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="Имя пользователя или email"
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Пароль"
                    rules={[
                        { required: true, message: 'Введите пароль' }
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Пароль"
                    />
                </Form.Item>

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
                            Войти
                        </Button>
                    </Space>
                </Form.Item>

                <div style={{ textAlign: 'center' }}>
                    <Space>
                        <Text style={{
                            color: 'var(--text-secondary)',
                            fontSize: '14px'
                        }}>
                            Нет аккаунта?
                        </Text>
                        <Button
                            type="link"
                            onClick={onSwitchToRegister}
                            style={{
                                color: 'var(--primary-color)',
                                fontWeight: '600',
                                padding: '0',
                                height: 'auto',
                                fontSize: '14px'
                            }}
                        >
                            Зарегистрироваться
                        </Button>
                    </Space>
                </div>
            </Form>
        </div>
    );
}
