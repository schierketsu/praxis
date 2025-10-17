import React, { useState } from 'react';
import { Form, Input, Button, Typography, Space, message, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, GlobalOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { companyAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function CompanyRegistration({ onSuccess }) {
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
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <Title level={2} style={{
                marginBottom: '24px',
                background: 'var(--primary-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '28px',
                fontWeight: '700'
            }}>
                Регистрация компании
            </Title>

            <Form
                name="company-registration"
                onFinish={handleSubmit}
                layout="vertical"
                size="large"
                style={{ maxWidth: '600px', margin: '0 auto' }}
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
                                style={{ borderRadius: '12px', height: '48px' }}
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
                                style={{ borderRadius: '12px', height: '48px' }}
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
                                style={{ borderRadius: '12px', height: '48px' }}
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
                                style={{ borderRadius: '12px', height: '48px' }}
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
                                style={{ borderRadius: '12px', height: '48px' }}
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
                                style={{ borderRadius: '12px', height: '48px' }}
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

                <Form.Item
                    name="description"
                    label="Описание компании"
                >
                    <TextArea
                        rows={3}
                        placeholder="Расскажите о деятельности компании..."
                        style={{ borderRadius: '12px' }}
                    />
                </Form.Item>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="website"
                            label="Веб-сайт"
                        >
                            <Input
                                prefix={<GlobalOutlined />}
                                placeholder="https://example.com"
                                style={{ borderRadius: '12px', height: '48px' }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="address"
                            label="Адрес"
                        >
                            <Input
                                prefix={<EnvironmentOutlined />}
                                placeholder="Адрес компании"
                                style={{ borderRadius: '12px', height: '48px' }}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="latitude"
                            label="Широта (опционально)"
                        >
                            <Input
                                placeholder="56.11427957912669"
                                style={{ borderRadius: '12px', height: '48px' }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="longitude"
                            label="Долгота (опционально)"
                        >
                            <Input
                                placeholder="47.257093448374484"
                                style={{ borderRadius: '12px', height: '48px' }}
                            />
                        </Form.Item>
                    </Col>
                </Row>

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
                        Зарегистрировать компанию
                    </Button>
                </Form.Item>
            </Form>

            <Text style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                Уже есть аккаунт?
                <Button
                    type="link"
                    style={{
                        padding: '0 4px',
                        color: '#667eea',
                        fontWeight: '600'
                    }}
                    onClick={() => {
                        // Переключаем на вход
                        window.dispatchEvent(new CustomEvent('openAuthModal', {
                            detail: { mode: 'company-login' }
                        }));
                    }}
                >
                    Войти
                </Button>
            </Text>
        </div>
    );
}
