import React from 'react';
import { Typography, Row, Col, Card } from 'antd';

const { Title, Paragraph } = Typography;

const HowItWorksSection = () => {
    const cardStyle = {
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    };

    const stepTitleStyle = {
        fontSize: '1.1rem',
        fontWeight: '600',
        color: '#1890ff',
        marginBottom: '8px',
    };

    const mainHeadingStyle = {
        fontSize: '1.8rem',
        fontWeight: '700',
        color: 'black',
        marginBottom: '16px',
        lineHeight: '1.2',
    };

    const descriptionStyle = {
        fontSize: '1rem',
        color: 'rgba(0, 0, 0, 0.7)',
        lineHeight: '1.5',
        marginBottom: '24px',
    };

    return (
        <div style={{
            background: 'rgb(255, 255, 255)',
            margin: '0 -24px',
            padding: '0'
        }}>
            <div style={{
                background: 'rgb(234, 255, 217)',
                padding: '60px 0 80px 0',
                borderRadius: '300px 300px 0 0',
                textAlign: 'center'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                    <Title
                        level={2}
                        style={{
                            fontSize: '2.5rem',
                            fontWeight: '700',
                            color: '#1a202c',
                            lineHeight: '1.2',
                            marginBottom: '40px',
                        }}
                    >
                        Как это работает?
                    </Title>

                    <Row gutter={[32, 32]} justify="center">
                        {/* Карточка 1: Создай список желаний */}
                        <Col xs={24} md={8}>
                            <Card style={cardStyle}>
                                <div style={{
                                    background: '#e6f7ff',
                                    padding: '40px 20px',
                                    borderRadius: '12px',
                                    marginBottom: '24px',
                                    minHeight: '200px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <div style={{ textAlign: 'center', color: '#1890ff', fontSize: '48px' }}>
                                        📝
                                    </div>
                                </div>
                                <div>
                                    <Paragraph style={stepTitleStyle}>ШАГ 1</Paragraph>
                                    <Title level={3} style={mainHeadingStyle}>Текст1</Title>
                                    <Paragraph style={descriptionStyle}>
                                        Описание
                                    </Paragraph>
                                </div>
                            </Card>
                        </Col>

                        {/* Карточка 2: Поделись с друзьями */}
                        <Col xs={24} md={8}>
                            <Card style={cardStyle}>
                                <div style={{
                                    background: '#e6f7ff',
                                    padding: '40px 20px',
                                    borderRadius: '12px',
                                    marginBottom: '24px',
                                    minHeight: '200px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <div style={{ textAlign: 'center', color: '#1890ff', fontSize: '48px' }}>
                                        📝
                                    </div>
                                </div>
                                <div>
                                    <Paragraph style={stepTitleStyle}>ШАГ 2</Paragraph>
                                    <Title level={3} style={mainHeadingStyle}>Текст2</Title>
                                    <Paragraph style={descriptionStyle}>
                                        Описание
                                    </Paragraph>
                                </div>
                            </Card>
                        </Col>

                        {/* Карточка 3: Готово! Наслаждайся! */}
                        <Col xs={24} md={8}>
                            <Card style={cardStyle}>
                                <div style={{
                                    background: '#e6f7ff',
                                    padding: '40px 20px',
                                    borderRadius: '12px',
                                    marginBottom: '24px',
                                    minHeight: '200px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <div style={{ textAlign: 'center', color: '#1890ff', fontSize: '48px' }}>
                                        📝
                                    </div>
                                </div>
                                <div>
                                    <Paragraph style={stepTitleStyle}>ШАГ 3</Paragraph>
                                    <Title level={3} style={mainHeadingStyle}>Текст3</Title>
                                    <Paragraph style={descriptionStyle}>
                                        Описание
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
