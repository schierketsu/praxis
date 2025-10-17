import React, { useState } from 'react';
import { Form, Input, Button, Typography, Space, message, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

export default function CompanyRegistration({ onSuccess, onSwitchToLogin }) {
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const response = await register(values); // Используем контекст
            if (onSuccess) {
                onSuccess(response);
            }
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            if (error.response?.data?.error) {
                message.error(error.response.data.error);
            } else if (error.response?.data) {
                const errors = error.response.data;
                if (typeof errors === 'object') {
                    // Показываем первую ошибку валидации
                    const firstError = Object.keys(errors)[0];
                    if (firstError && errors[firstError]) {
                        if (Array.isArray(errors[firstError])) {
                            message.error(`${firstError}: ${errors[firstError].join(', ')}`);
                        } else {
                            message.error(`${firstError}: ${errors[firstError]}`);
                        }
                    } else {
                        message.error('Ошибка при регистрации. Проверьте данные и попробуйте еще раз.');
                    }
                }
            } else {
                message.error('Ошибка при регистрации. Проверьте данные и попробуйте еще раз.');
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
            maxWidth: '600px',
            margin: '0 auto',
            overflow: 'hidden'
        }}>
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
                    Регистрация компании
                </Title>
                <Text style={{
                    fontSize: '16px',
                    color: 'var(--text-secondary)',
                    fontWeight: '500',
                    lineHeight: '1.6'
                }}>
                    Создайте аккаунт компании для публикации практик. После регистрации ваша компания будет отправлена на модерацию.
                </Text>
            </div>

            <Form
                name="company-registration"
                onFinish={handleSubmit}
                layout="vertical"
                size="large"
            >
                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="first_name"
                            label="Имя контактного лица"
                            rules={[{ required: true, message: 'Введите имя' }]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Имя"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="last_name"
                            label="Фамилия контактного лица"
                            rules={[{ required: true, message: 'Введите фамилию' }]}
                        >
                            <Input
                                placeholder="Фамилия"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="username"
                            label="Имя пользователя"
                            rules={[{ required: true, message: 'Введите имя пользователя' }]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Имя пользователя"
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
                        >
                            <Input
                                prefix={<MailOutlined />}
                                placeholder="email@company.com"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="password"
                            label="Пароль"
                            rules={[
                                { required: true, message: 'Введите пароль' },
                                { min: 8, message: 'Пароль должен содержать минимум 8 символов' }
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Пароль"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="password_confirm"
                            label="Подтверждение пароля"
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
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Подтвердите пароль"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="name"
                    label="Название компании"
                    rules={[{ required: true, message: 'Введите название компании' }]}
                >
                    <Input
                        placeholder="Название компании"
                        style={{ borderRadius: '12px', height: '48px' }}
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
                            Зарегистрироваться
                        </Button>
                    </Space>
                </Form.Item>
            </Form>

            <div style={{ textAlign: 'center' }}>
                <Space>
                    <Text style={{
                        color: 'var(--text-secondary)',
                        fontSize: '14px'
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
                            fontSize: '14px'
                        }}
                    >
                        Войти
                    </Button>
                </Space>
            </div>
        </div>
    );
}
