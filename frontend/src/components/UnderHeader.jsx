import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';


const UnderHeader = () => {
    const [isMobile, setIsMobile] = useState(false);
    const { student, company } = useAuth();

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
      /* Убираем любые возможные границы между header и under header */
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
      
      /* Убираем любые границы у всех элементов между header и under header */
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
      }
    `;

        document.head.appendChild(style);

        return () => {
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        };
    }, []);


    // Определяем текст в зависимости от типа пользователя
    const getWelcomeText = () => {
        if (student) {
            // Данные пользователя находятся в student.user
            const studentName = student.user?.first_name ||
                student.user?.last_name ||
                student.user?.username ||
                'Студент';
            return {
                title: `Привет, ${studentName}!`,
                subtitle: 'Начинай поиск практик прямо сейчас! 🚀'
            };
        } else if (company) {
            const companyName = company.name || company.username || 'Компания';
            return {
                title: `Добро пожаловать, ${companyName}!`,
                subtitle: 'Размещайте практики и находите талантливых студентов для вашей команды 🚀'
            };
        }
        return {
            title: 'Добро пожаловать!',
            subtitle: 'Начните работу с платформой 🚀'
        };
    };

    const welcomeText = getWelcomeText();

    return (
        <div style={{
            background: '#d1e3f7',
            padding: '0px 0',
            position: 'relative',
            width: '100%',
            zIndex: 5,
            overflow: 'hidden',
            margin: isMobile ? '-60px -16px 0 -16px' : '-60px -24px 0 -24px',
            width: isMobile ? 'calc(100% + 32px)' : 'calc(100% + 48px)',
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
                    justifyContent: 'center',
                    minHeight: isMobile ? '200px' : '280px'
                }}>
                    {/* Центральная часть - текст и кнопка */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px',
                        textAlign: 'center',
                        maxWidth: '800px'
                    }}>
                        <h1 style={{
                            color: 'black',
                            fontSize: isMobile ? '2rem' : '3.5rem',
                            fontWeight: '700',
                            lineHeight: '1.1',
                            margin: '0',
                            textShadow: 'none',
                            padding: isMobile ? '0 16px' : '0'
                        }}>
                            {welcomeText.title}
                        </h1>

                        <span style={{
                            color: 'black',
                            fontSize: isMobile ? '1rem' : '1.25rem',
                            fontWeight: '400',
                            lineHeight: '1.5',
                            textAlign: 'center',
                            display: 'block',
                            width: '100%',
                            padding: isMobile ? '0 16px' : '0'
                        }}>
                            {welcomeText.subtitle}
                        </span>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnderHeader;
