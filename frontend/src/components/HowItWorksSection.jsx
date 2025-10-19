import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card } from 'antd';

const { Title, Paragraph } = Typography;

const HowItWorksSection = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    const cardStyle = {
        background: 'white',
        borderRadius: isMobile ? '12px' : '16px',
        padding: isMobile ? '16px' : '24px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    };

    const stepTitleStyle = {
        fontSize: isMobile ? '0.9rem' : '1.1rem',
        fontWeight: '600',
        color: '#1890ff',
        marginBottom: '8px',
    };

    const mainHeadingStyle = {
        fontSize: isMobile ? '1.4rem' : '1.8rem',
        fontWeight: '700',
        color: 'black',
        marginBottom: '16px',
        lineHeight: '1.2',
    };

    const descriptionStyle = {
        fontSize: isMobile ? '0.9rem' : '1rem',
        color: 'rgba(0, 0, 0, 0.7)',
        lineHeight: '1.5',
        marginBottom: '24px',
    };

    return (
        <div 
            className="how-it-works-section"
            style={{
                background: 'rgb(255, 255, 255)',
                margin: isMobile ? '60px -16px 0 -16px' : '0 -24px',
                padding: '0'
            }}>
            <div style={{
                background: 'rgb(234, 255, 217)',
                padding: isMobile ? '40px 0 60px 0' : '60px 0 80px 0',
                borderRadius: isMobile ? '150px 150px 0 0' : '300px 300px 0 0',
                textAlign: 'center'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: isMobile ? '0 16px' : '0 24px'
                }}>
                    <Title
                        level={2}
                        style={{
                            fontSize: isMobile ? '1.8rem' : '2.5rem',
                            fontWeight: '700',
                            color: '#1a202c',
                            lineHeight: '1.2',
                            marginBottom: isMobile ? '24px' : '40px',
                        }}
                    >
                        Как это работает?
                    </Title>

                    <Row gutter={[isMobile ? 16 : 32, isMobile ? 16 : 32]} justify="center">
                        {/* Карточка 1: Создай список желаний */}
                        <Col xs={24} md={8}>
                            <Card style={cardStyle}>
                                <div style={{
                                    background: '#e6f7ff',
                                    padding: isMobile ? '24px 16px' : '40px 20px',
                                    borderRadius: '12px',
                                    marginBottom: '24px',
                                    minHeight: isMobile ? '120px' : '200px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <div style={{ textAlign: 'center', color: '#1890ff', fontSize: isMobile ? '32px' : '48px' }}>
                                        👤
                                    </div>
                                </div>
                                <div>
                                    <Paragraph style={stepTitleStyle}>ШАГ 1</Paragraph>
                                    <Title level={3} style={mainHeadingStyle}>Регистрация</Title>
                                    <Paragraph style={descriptionStyle}>
                                        Создайте аккаунт студента или компании за несколько минут
                                    </Paragraph>
                                </div>
                            </Card>
                        </Col>

                        {/* Карточка 2: Найдите практику */}
                        <Col xs={24} md={8}>
                            <Card style={cardStyle}>
                                <div style={{
                                    background: '#e6f7ff',
                                    padding: isMobile ? '24px 16px' : '40px 20px',
                                    borderRadius: '12px',
                                    marginBottom: '24px',
                                    minHeight: isMobile ? '120px' : '200px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <div style={{ textAlign: 'center', color: '#1890ff', fontSize: isMobile ? '32px' : '48px' }}>
                                        🔍
                                    </div>
                                </div>
                                <div>
                                    <Paragraph style={stepTitleStyle}>ШАГ 2</Paragraph>
                                    <Title level={3} style={mainHeadingStyle}>Поиск</Title>
                                    <Paragraph style={descriptionStyle}>
                                        Используйте фильтры для поиска подходящих IT-практик
                                    </Paragraph>
                                </div>
                            </Card>
                        </Col>

                        {/* Карточка 3: Подайте заявку */}
                        <Col xs={24} md={8}>
                            <Card style={cardStyle}>
                                <div style={{
                                    background: '#e6f7ff',
                                    padding: isMobile ? '24px 16px' : '40px 20px',
                                    borderRadius: '12px',
                                    marginBottom: '24px',
                                    minHeight: isMobile ? '120px' : '200px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <div style={{ textAlign: 'center', color: '#1890ff', fontSize: isMobile ? '32px' : '48px' }}>
                                        📋
                                    </div>
                                </div>
                                <div>
                                    <Paragraph style={stepTitleStyle}>ШАГ 3</Paragraph>
                                    <Title level={3} style={mainHeadingStyle}>Заявка</Title>
                                    <Paragraph style={descriptionStyle}>
                                        Отправьте заявку напрямую в компанию и получите ответ
                                    </Paragraph>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
};

export default HowItWorksSection;
