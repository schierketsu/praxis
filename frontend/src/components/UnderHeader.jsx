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
                            fontSize: isMobile ? '2.5rem' : '3.5rem',
                            fontWeight: '700',
                            lineHeight: '1.1',
                            margin: '0',
                            textShadow: 'none'
                        }}>
                            {welcomeText.title}
                        </h1>

                        <span style={{
                            color: 'black',
                            fontSize: isMobile ? '1.1rem' : '1.25rem',
                            fontWeight: '400',
                            lineHeight: '1.5',
                            textAlign: 'center',
                            display: 'block',
                            width: '100%'
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
