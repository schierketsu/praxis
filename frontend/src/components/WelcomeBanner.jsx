import React, { useState, useEffect } from 'react';
import { Button, Typography } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const WelcomeBanner = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Агрессивные стили для перекрытия белых линий
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
      /* Убираем любые возможные границы между header и welcome banner */
      .ant-layout-header + .ant-layout-content {
        border-top: none !important;
        outline: none !important;
        box-shadow: none !important;
        background: transparent !important;
      }
      
      .ant-layout-content {
        border-top: none !important;
        outline: none !important;
        box-shadow: none !important;
        background: transparent !important;
      }
      
      /* Принудительно перекрываем фон main элемента */
      main.ant-layout-content {
        background: transparent !important;
        border: none !important;
        outline: none !important;
        box-shadow: none !important;
      }
      
      /* Убираем любые границы у всех элементов между header и welcome banner */
      .ant-layout-header,
      .ant-layout-content,
      .ant-layout-content > div {
        border: none !important;
        outline: none !important;
        box-shadow: none !important;
      }
      
      /* Мобильные стили для полной ширины */
      @media (max-width: 768px) {
        .ant-layout {
          width: 100vw !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        .ant-layout-header {
          width: 100vw !important;
          margin: 0 !important;
          padding: 0 12px !important;
        }
        
        .ant-layout-content {
          width: 100vw !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        body {
          margin: 0 !important;
          padding: 0 !important;
          overflow-x: hidden !important;
        }
        
        #root {
          width: 100vw !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* Агрессивное устранение промежутков между секциями */
        .welcome-banner {
          margin-bottom: 0 !important;
          padding-bottom: 0 !important;
        }
        
        .features-section {
          margin-top: 0 !important;
          padding-top: 0 !important;
        }
        
        /* Убираем промежутки между всеми элементами */
        .ant-layout-content > * {
          margin: 0 !important;
          padding: 0 !important;
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }
        
        /* Продолжение фона WelcomeBanner после кнопки */
        .welcome-banner::after {
          content: '' !important;
          position: absolute !important;
          bottom: 0 !important;
          left: 0 !important;
          right: 0 !important;
          height: 20px !important;
          background: #d1e3f7 !important;
          z-index: 1 !important;
        }
        
      }
    `;

        document.head.appendChild(style);

        return () => {
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        };
    }, []);

    const handleGetStarted = () => {
        // Прокрутка к hero секции
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div 
            className="welcome-banner"
            style={{
                background: '#d1e3f7',
                padding: isMobile ? '40px 0 60px 0' : '80px 0',
                position: 'relative',
                zIndex: 5,
                overflow: 'visible',
                margin: isMobile ? '0' : '-60px -24px 0 -24px',
                width: isMobile ? '100%' : 'calc(100% + 48px)',
                border: 'none',
                outline: 'none',
                boxShadow: 'none'
            }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: isMobile ? '0 16px' : '0 24px'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: isMobile ? '24px' : '60px',
                    minHeight: isMobile ? '200px' : '400px',
                    flexDirection: isMobile ? 'column' : 'row'
                }}>
                    {/* Левая часть - текст и кнопка */}
                    <div style={{
                        flex: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: isMobile ? '16px' : '24px',
                        textAlign: isMobile ? 'center' : 'left',
                        order: isMobile ? 2 : 1
                    }}>
                        <h1 style={{
                            color: 'black',
                            fontSize: isMobile ? '1.8rem' : '3.5rem',
                            fontWeight: '700',
                            lineHeight: isMobile ? '1.2' : '1.1',
                            margin: '0',
                            textShadow: 'none'
                        }}>
                            {isMobile ? 'Привет, это практикастудентам.рф — платформа для поиска практик' : 'Привет, это\nпрактикастудентам.рф —\nплатформа для поиска практик'}
                        </h1>

                        <span style={{
                            color: 'black',
                            fontSize: isMobile ? '1rem' : '1.25rem',
                            fontWeight: '400',
                            lineHeight: '1.5',
                            maxWidth: isMobile ? '100%' : '500px'
                        }}>
                            {isMobile ? 'Найди подходящую практику в ведущих IT-компаниях, получи ценный опыт и начни карьеру в технологиях.' : 'Найди подходящую практику в ведущих IT-компаниях, получи ценный опыт и начни карьеру в технологиях. Это бесплатно и доступно каждому студенту'}
                        </span>

                        <Button
                            type="primary"
                            size={isMobile ? 'middle' : 'large'}
                            onClick={handleGetStarted}
                            style={{
                                height: isMobile ? '44px' : '56px',
                                padding: isMobile ? '0 24px' : '0 32px',
                                fontSize: isMobile ? '1rem' : '1.1rem',
                                fontWeight: '600',
                                borderRadius: isMobile ? '8px' : '12px',
                                background: '#2054DE',
                                border: '2px solid #2054DE',
                                color: 'white',
                                boxShadow: '0 8px 32px rgba(32, 84, 222, 0.3)',
                                transition: 'all 0.3s ease',
                                alignSelf: isMobile ? 'center' : 'flex-start',
                                width: isMobile ? '100%' : 'auto'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#1a47c7';
                                e.currentTarget.style.borderColor = '#1a47c7';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 12px 40px rgba(32, 84, 222, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#2054DE';
                                e.currentTarget.style.borderColor = '#2054DE';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 8px 32px rgba(32, 84, 222, 0.3)';
                            }}
                        >
                            Приступить
                            <ArrowRightOutlined style={{ marginLeft: '8px' }} />
                        </Button>
                    </div>

                    {/* Правая часть - изображение/видео */}
                    <div style={{
                        flex: '1',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                        order: isMobile ? 1 : 0,
                        width: isMobile ? '100%' : 'auto'
                    }}>
                        <div style={{
                            width: '100%',
                            maxWidth: isMobile ? '300px' : '550px',
                            height: isMobile ? '200px' : '420px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: isMobile ? '12px' : '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                            overflow: 'hidden'
                        }}>
                            <img
                                src="/card/8.gif"
                                alt="Welcome animation"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '20px'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeBanner;
