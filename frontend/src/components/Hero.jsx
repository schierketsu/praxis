import React from 'react';
import { Typography, Button, Row, Col, Space } from 'antd';
import { RocketOutlined, TeamOutlined, TrophyOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Hero = () => {
  return (
    <div style={{ 
      background: 'var(--background-gradient)',
      padding: '120px 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Декоративные элементы */}
      <div style={{
        position: 'absolute',
        top: '-30%',
        right: '-15%',
        width: '500px',
        height: '500px',
        background: 'var(--primary-gradient)',
        borderRadius: '50%',
        opacity: 0.05,
        filter: 'blur(60px)'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        left: '-10%',
        width: '350px',
        height: '350px',
        background: 'var(--secondary-gradient)',
        borderRadius: '50%',
        opacity: 0.05,
        filter: 'blur(50px)'
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>
        <Row gutter={[48, 48]} align="middle">
          <Col xs={24} lg={12}>
            <div className="fade-in-up">
              <Title 
                level={1} 
                style={{ 
                  fontSize: '4rem',
                  fontWeight: '800',
                  background: 'var(--primary-gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: '1.1',
                  marginBottom: '24px',
                  letterSpacing: '-0.02em'
                }}
              >
                Найди свою практику мечты
              </Title>
              
              <Paragraph 
                style={{ 
                  fontSize: '1.25rem', 
                  color: 'var(--text-secondary)',
                  fontWeight: '500',
                  lineHeight: '1.6',
                  marginBottom: '40px',
                  maxWidth: '500px'
                }}
              >
                Соединяем талантливых студентов с ведущими IT-компаниями. 
                Найди стажировку в топовых технологических компаниях и начни свой путь в IT.
              </Paragraph>

              <Button
                type="primary"
                size="large"
                onClick={() => {
                  const carouselElement = document.getElementById('internship-carousel');
                  if (carouselElement) {
                    carouselElement.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }
                }}
                style={{
                  height: '56px',
                  padding: '0 40px',
                  fontSize: '1.25rem',
                  fontWeight: '800',
                  letterSpacing: '-0.02em',
                  borderRadius: 'var(--border-radius-lg)',
                  background: 'var(--primary-gradient)',
                  border: 'none',
                  color: 'white',
                  boxShadow: 'var(--shadow-strong)',
                  transition: 'var(--transition)',
                  position: 'relative',
                  overflow: 'hidden',
                  zIndex: 2,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textTransform: 'none'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 20px 40px rgba(37, 99, 235, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'var(--shadow-strong)';
                }}
              >
                Начать поиск
              </Button>
            </div>
          </Col>

          <Col xs={24} lg={12}>
            <div className="fade-in" style={{ 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center',
              height: '400px'
            }}>
              <div style={{
                width: '100%',
                maxWidth: '500px',
                background: 'var(--glass-bg)',
                borderRadius: 'var(--border-radius-lg)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--glass-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-soft)',
                padding: '40px 20px'
              }}>
                <Row gutter={[32, 24]} style={{ width: '100%' }}>
                  <Col span={12}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'var(--primary-gradient)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px auto'
                      }}>
                        <img 
                          src="/assets/icons/company.png" 
                          alt="Компании" 
                          style={{ 
                            width: '40px', 
                            height: '40px',
                            objectFit: 'contain'
                          }} 
                        />
                      </div>
                      <Title level={1} style={{ 
                        margin: '0 0 8px 0', 
                        color: 'var(--text-primary)',
                        fontSize: '2rem',
                        fontWeight: '800'
                      }}>
                        50+
                      </Title>
                      <Paragraph style={{ 
                        margin: 0, 
                        color: 'var(--text-secondary)',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        IT-компаний
                      </Paragraph>
                    </div>
                  </Col>

                  <Col span={12}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'var(--secondary-gradient)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px auto'
                      }}>
                        <img 
                          src="/assets/icons/internship.png" 
                          alt="Практики" 
                          style={{ 
                            width: '40px', 
                            height: '40px',
                            objectFit: 'contain'
                          }} 
                        />
                      </div>
                      <Title level={1} style={{ 
                        margin: '0 0 8px 0', 
                        color: 'var(--text-primary)',
                        fontSize: '2rem',
                        fontWeight: '800'
                      }}>
                        200+
                      </Title>
                      <Paragraph style={{ 
                        margin: 0, 
                        color: 'var(--text-secondary)',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        Активных практик
                      </Paragraph>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>

      </div>
    </div>
  );
};

export default Hero;