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
        <div style={{
            background: '#d1e3f7',
            padding: '80px 0',
            position: 'relative',
            width: '100%',
            zIndex: 5,
            overflow: 'hidden',
            margin: '-60px -24px 0 -24px',
            width: 'calc(100% + 48px)',
            border: 'none',
            outline: 'none',
            boxShadow: 'none'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '0 24px'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: isMobile ? '40px' : '60px',
                    minHeight: isMobile ? '300px' : '400px',
                    flexDirection: isMobile ? 'column' : 'row'
                }}>
                    {/* Левая часть - текст и кнопка */}
                    <div style={{
                        flex: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px',
                        textAlign: isMobile ? 'center' : 'left'
                    }}>
                        <h1 style={{
                            color: 'black',
                            fontSize: isMobile ? '2.5rem' : '3.5rem',
                            fontWeight: '700',
                            lineHeight: '1.1',
                            margin: '0',
                            textShadow: 'none'
                        }}>
                            Привет, это<br />практикастудентам.рф&nbsp;—<br />платформа для поиска практик
                        </h1>

                        <span style={{
                            color: 'black',
                            fontSize: isMobile ? '1.1rem' : '1.25rem',
                            fontWeight: '400',
                            lineHeight: '1.5',
                            maxWidth: isMobile ? '100%' : '500px'
                        }}>
                            Найди подходящую практику в ведущих IT-компаниях, получи ценный опыт и начни карьеру в технологиях. Это бесплатно и доступно каждому студенту
                        </span>

                        <Button
                            type="primary"
                            size="large"
                            onClick={handleGetStarted}
                            style={{
                                height: '56px',
                                padding: '0 32px',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                borderRadius: '12px',
                                background: 'rgba(255, 255, 255, 0.2)',
                                border: '2px solid rgba(255, 255, 255, 0.3)',
                                color: 'white',
                                backdropFilter: 'blur(10px)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.3s ease',
                                alignSelf: isMobile ? 'center' : 'flex-start'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
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
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        position: 'relative',
                        order: isMobile ? -1 : 0
                    }}>
                        <div style={{
                            width: '100%',
                            maxWidth: isMobile ? '380px' : '550px',
                            height: isMobile ? '270px' : '420px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '20px',
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
