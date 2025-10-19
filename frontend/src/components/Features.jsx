import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Space } from 'antd';
import {
  SearchOutlined,
  SafetyOutlined,
  TeamOutlined,
  RocketOutlined,
  StarOutlined,
  GlobalOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Features = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const features = [
    {
      icon: <SearchOutlined style={{ fontSize: '28px', color: 'white' }} />,
      title: 'Умный поиск',
      description: 'Находите практики по технологиям, локации и университету с помощью интеллектуальных фильтров'
    },
    {
      icon: <SafetyOutlined style={{ fontSize: '28px', color: 'white' }} />,
      title: 'Проверенные компании',
      description: 'Все компании проходят тщательную проверку и имеют высокий рейтинг среди студентов'
    },
    {
      icon: <TeamOutlined style={{ fontSize: '28px', color: 'white' }} />,
      title: 'Прямая связь',
      description: 'Подавайте заявки напрямую в IT-компании и получайте быстрые ответы от работодателей'
    },
    {
      icon: <RocketOutlined style={{ fontSize: '28px', color: 'white' }} />,
      title: 'Быстрый старт',
      description: 'Начните карьеру в IT уже сегодня с помощью наших практик'
    },
    {
      icon: <StarOutlined style={{ fontSize: '28px', color: 'white' }} />,
      title: 'Рейтинги и отзывы',
      description: 'Читайте отзывы других студентов и выбирайте лучшие места для практики'
    },
    {
      icon: <GlobalOutlined style={{ fontSize: '28px', color: 'white' }} />,
      title: 'География',
      description: 'Практики доступны по всей России - от Москвы до Владивостока'
    }
  ];

  return (
    <div 
      className="features-section"
      style={{
        padding: isMobile ? '40px 0 80px 0' : '30px 0 80px 0',
        position: 'relative',
        background: 'rgb(255, 255, 255)',
        margin: isMobile ? '0' : '0 -24px',
        marginTop: isMobile ? '0' : 'auto',
        zIndex: isMobile ? 1 : 'auto'
      }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div className="fade-in-up" style={{ textAlign: 'center', marginBottom: '40px', marginTop: '20px' }}>
          <Title
            level={2}
            style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#1a202c',
              lineHeight: '1.2',
              marginBottom: '24px'
            }}
          >
            Почему выбирают нас
          </Title>
          <Paragraph
            style={{
              fontSize: '1.25rem',
              color: 'black',
              lineHeight: '1.5',
              fontWeight: '400',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            Мы создали платформу, которая делает поиск практики простым и эффективным
          </Paragraph>
        </div>

        <Row gutter={[32, 32]}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} lg={8} key={index}>
              <div
                className="fade-in-up"
                style={{
                  background: 'var(--glass-bg)',
                  borderRadius: 'var(--border-radius-lg)',
                  padding: '40px 32px',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--glass-border)',
                  boxShadow: 'var(--shadow-soft)',
                  height: '100%',
                  transition: 'var(--transition)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-medium)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-soft)';
                  }
                }}
              >
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <div style={{
                    textAlign: 'center',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'var(--primary-gradient)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                  }}>
                    {feature.icon}
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <Title level={4} style={{
                      margin: '0 0 16px 0',
                      color: 'var(--text-primary)',
                      fontWeight: '600'
                    }}>
                      {feature.title}
                    </Title>

                    <Paragraph style={{
                      margin: 0,
                      color: 'var(--text-secondary)',
                      lineHeight: '1.6'
                    }}>
                      {feature.description}
                    </Paragraph>
                  </div>
                </Space>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Features;
