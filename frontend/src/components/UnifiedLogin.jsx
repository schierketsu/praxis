import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Space, Typography, Row, Col } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

export default function UnifiedLogin({ onSuccess, onCancel, onSwitchToRegister }) {
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const { login } = useAuth();

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
            background: isMobile ? '#ffffff' : 'var(--glass-bg)',
            backdropFilter: isMobile ? 'none' : 'blur(20px)',
            borderRadius: isMobile ? '0' : '24px',
            border: isMobile ? 'none' : '1px solid var(--glass-border)',
            boxShadow: isMobile ? 'none' : 'var(--shadow-soft)',
            padding: isMobile ? '0' : '40px',
            maxWidth: isMobile ? '100%' : '500px',
            margin: '0 auto',
            overflow: 'hidden'
        }}>
            <div style={{ 
                textAlign: 'center', 
                marginBottom: isMobile ? '24px' : '40px',
                padding: isMobile ? '0 16px' : '0'
            }}>
                <Title level={2} style={{
                    margin: '0 0 16px 0',
                    fontSize: isMobile ? '1.8rem' : '2.5rem',
                    fontWeight: '700',
                    color: '#1a202c',
                    lineHeight: '1.2'
                }}>
                    Вход в систему
                </Title>
                <Text style={{
                    fontSize: isMobile ? '14px' : '16px',
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
                style={{
                    padding: isMobile ? '0 16px' : '0'
                }}
            >
                <Form.Item
                    name="username"
                    label="Имя пользователя или email"
                    rules={[
                        { required: true, message: 'Введите имя пользователя или email' }
                    ]}
                    style={{
                        marginBottom: isMobile ? '8px' : '24px'
                    }}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="Имя пользователя или email"
                        style={{
                            height: isMobile ? '48px' : '40px',
                            borderRadius: isMobile ? '12px' : '8px',
                            fontSize: isMobile ? '16px' : '14px'
                        }}
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Пароль"
                    rules={[
                        { required: true, message: 'Введите пароль' }
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
                            Войти
                        </Button>
                    </Space>
                </Form.Item>

                <div style={{ 
                    textAlign: 'center',
                    padding: isMobile ? '0 16px' : '0'
                }}>
                    <Space direction={isMobile ? 'vertical' : 'horizontal'} size={isMobile ? 'small' : 'middle'}>
                        <Text style={{
                            color: 'var(--text-secondary)',
                            fontSize: isMobile ? '14px' : '14px'
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
                                fontSize: isMobile ? '14px' : '14px',
                                minHeight: isMobile ? '44px' : 'auto'
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
