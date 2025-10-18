import React, { useState, useEffect, useCallback } from 'react';
import { Carousel, Button, Statistic } from 'antd';
import { ArrowRightOutlined, BulbFilled, CrownFilled, RiseOutlined, StarFilled, ThunderboltFilled, AimOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Проверка размера экрана
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Обработчики
  const handleStartSearch = useCallback(() => {
    // Ищем секцию поиска по нескольким селекторам
    const searchSection = document.querySelector('[data-testid="search-filters"]') ||
      document.querySelector('.ant-card') ||
      document.querySelector('[class*="search"]') ||
      document.querySelector('.ant-form');

    if (searchSection) {
      // Прокручиваем к секции поиска с небольшим отступом
      const rect = searchSection.getBoundingClientRect();
      const scrollTop = window.pageYOffset + rect.top - 100; // 100px отступ сверху
      window.scrollTo({ top: scrollTop, behavior: 'smooth' });
    } else {
      // Fallback - прокрутка к началу страницы
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleLearnMore = useCallback(() => {
    const infoSection = document.getElementById('info-section');
    if (infoSection) {
      infoSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const onChange = useCallback((current) => {
    setCurrentSlide(current);
  }, []);

  // Данные для слайдов
  const slidesData = [
    {
      id: 'students',
      title: 'Найди свою',
      titleHighlight: 'практику мечты',
      description: 'Платформа для поиска стажировок в ведущих IT-компаниях. Найди подходящую практику и начни карьеру в технологиях.',
      primaryButton: 'Начать поиск',
      secondaryButton: 'Узнать больше',
      onPrimaryClick: handleStartSearch,
      onSecondaryClick: handleLearnMore,
      stats: [
        { title: 'IT-компаний', value: 17, suffix: '+' },
        { title: 'Практик', value: 41, suffix: '+' }
      ],
      features: [
        { icon: <BulbFilled style={{ fontSize: '40px', color: '#F4A460' }} />, title: 'Умный поиск', description: 'Найдите стажировку по вашим навыкам' },
        { icon: <CrownFilled style={{ fontSize: '40px', color: '#1890ff' }} />, title: 'Топ компании', description: 'Стажировки в ведущих IT-компаниях' },
        { icon: <RiseOutlined style={{ fontSize: '40px', color: '#A52A2A' }} />, title: 'Карьерный рост', description: 'От стажировки до работы мечты' }
      ]
    },
    {
      id: 'companies',
      title: 'Найдите',
      titleHighlight: 'талантливых студентов',
      description: 'Разместите вакансии стажировок и найдите перспективных студентов для вашей команды. Быстро, эффективно, бесплатно.',
      primaryButton: 'Разместить вакансию',
      secondaryButton: 'Узнать больше',
      onPrimaryClick: () => {
        // Открываем модальное окно регистрации компании через событие
        const event = new CustomEvent('openAuthModal', {
          detail: { mode: 'register', userType: 'company' }
        });
        window.dispatchEvent(event);
      },
      onSecondaryClick: handleLearnMore,
      stats: [
        { title: 'Среднее число заявок', value: 35, suffix: '+' },
        { title: 'Активных пользователей', value: 120, suffix: '+' },
        // { title: 'Компаний', value: 47, suffix: '+' }
      ],
      features: [
        { icon: <StarFilled style={{ fontSize: '40px', color: '#faad14' }} />, title: 'Лучшие таланты', description: 'Найдите мотивированных студентов' },
        { icon: <ThunderboltFilled style={{ fontSize: '40px', color: '#9400D3' }} />, title: 'Быстрое размещение', description: 'Разместите вакансию за 5 минут' },
        { icon: <AimOutlined style={{ fontSize: '40px', color: '#008000' }} />, title: 'Точный подбор', description: 'Найдите идеального стажера' }
      ]
    }
  ];

  // Компонент для отображения статистики
  const StatisticItem = React.memo(({ title, value, suffix, valueStyle, titleStyle }) => (
    <Statistic
      title={title}
      value={value}
      suffix={suffix}
      valueStyle={valueStyle}
      titleStyle={titleStyle}
    />
  ));

  // Стили для карусели
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .hero-carousel {
        border-radius: 16px !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
        padding: 12px !important;
        height: 550px !important;
        background: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: blur(10px) !important;
        margin: 0 !important;
        border: none !important;
        outline: none !important;
      }
      
      /* Убираем любые возможные границы между header и hero */
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
      
      /* Убираем любые границы у всех элементов между header и hero */
      .ant-layout-header,
      .ant-layout-content,
      .ant-layout-content > div {
        border: none !important;
        outline: none !important;
        box-shadow: none !important;
      }
      
      .hero-carousel .slick-slider {
        height: 550px !important;
      }
      
      .hero-carousel .slick-list {
        height: 550px !important;
      }
      
      .hero-carousel .slick-slide > div > div {
        padding: 0 16px !important;
      }
      
      .hero-carousel .slick-arrow {
        display: none !important;
      }
      
      .hero-carousel .slick-dots {
        bottom: 20px !important;
        height: 24px !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        gap: 12px !important;
        background: rgba(255, 255, 255, 0.9) !important;
        backdrop-filter: blur(10px) !important;
        border-radius: 20px !important;
        padding: 8px 16px !important;
        margin: 0 auto !important;
        width: fit-content !important;
      }
      
      .hero-carousel .slick-dots li {
        width: 32px !important;
        height: 12px !important;
        margin: 0 !important;
        list-style: none !important;
      }
      
      .hero-carousel .slick-dots li button {
        width: 32px !important;
        height: 12px !important;
        border-radius: 6px !important;
        background: rgba(37, 99, 235, 0.3) !important;
        border: none !important;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
        cursor: pointer !important;
        opacity: 0.6 !important;
        transform: scale(1) !important;
        font-size: 0 !important;
        text-indent: -9999px !important;
        overflow: hidden !important;
      }
      
      .hero-carousel .slick-dots li.slick-active button {
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%) !important;
        opacity: 1 !important;
        transform: scale(1.2) !important;
      }
      
      .hero-carousel .slick-dots li:hover button {
        background: rgba(37, 99, 235, 0.6) !important;
        transform: scale(1.1) !important;
        opacity: 0.8 !important;
      }
      
      .hero-carousel .slick-dots li.slick-active:hover button {
        background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%) !important;
        transform: scale(1.3) !important;
      }
      
      /* Адаптивность для мобильных устройств */
      @media (max-width: 768px) {
        .hero-carousel {
          height: 600px !important;
        }
        
        .hero-carousel .slick-slider {
          height: 600px !important;
        }
        
        .hero-carousel .slick-list {
          height: 600px !important;
        }
        
        .hero-carousel .slick-dots {
          bottom: 15px !important;
          padding: 6px 12px !important;
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

  return (
    <div className="hero-section" style={{
      padding: '60px 0 40px 0',
      position: 'relative',
      background: 'rgb(255, 255, 255)',
      borderRadius: '0',
      margin: '0 -24px 0 -24px',
      width: 'calc(100% + 48px)',
      zIndex: 10,
      border: 'none',
      outline: 'none',
      boxShadow: 'none',
      top: '0',
      left: '0'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px 16px 0 16px', width: '100%' }}>
        <Carousel
          className="hero-carousel"
          arrows={false}
          dots={true}
          infinite={true}
          afterChange={onChange}
          autoplay={true}
          autoplaySpeed={8000}
        >
          {slidesData.map((slide, index) => (
            <div key={slide.id}>
              <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: '24px',
                height: '100%',
                minHeight: '500px'
              }}>
                {/* Левая карточка */}
                <div style={{
                  flex: '1.2',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                  padding: '24px',
                  background: 'transparent',
                  borderRadius: '12px',
                  minHeight: '400px'
                }}>
                  <div style={{
                    fontSize: isMobile ? '24px' : '48px',
                    fontWeight: '700',
                    color: '#1a202c',
                    lineHeight: isMobile ? '1.3' : '1.2',
                    marginBottom: isMobile ? '12px' : '16px',
                    textAlign: isMobile ? 'center' : 'left'
                  }}>
                    {slide.title}
                    <br />
                    <span style={{ color: '#2563eb', fontStyle: 'italic' }}>
                      {slide.titleHighlight}
                    </span>
                  </div>

                  <div style={{
                    fontSize: isMobile ? '1rem' : '1.25rem',
                    color: 'black',
                    lineHeight: isMobile ? '1.4' : '1.5',
                    textAlign: isMobile ? 'center' : 'left',
                    marginBottom: isMobile ? '16px' : '24px',
                    fontWeight: '400'
                  }}>
                    {slide.description}
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'center' : 'flex-start'
                  }}>
                    <Button
                      type="primary"
                      size="large"
                      onClick={slide.onPrimaryClick}
                      style={{
                        height: isMobile ? '40px' : '56px',
                        padding: isMobile ? '0 20px' : '0 32px',
                        fontSize: isMobile ? '0.9rem' : '1.1rem',
                        fontWeight: '600',
                        borderRadius: isMobile ? '8px' : '12px',
                        background: 'var(--primary-gradient)',
                        border: 'none',
                        boxShadow: 'var(--shadow-soft)',
                        width: isMobile ? '100%' : 'auto'
                      }}
                    >
                      {slide.primaryButton}
                      <ArrowRightOutlined style={{ marginLeft: '8px' }} />
                    </Button>

                    <Button
                      type="default"
                      size="large"
                      onClick={slide.onSecondaryClick}
                      style={{
                        height: isMobile ? '40px' : '56px',
                        padding: isMobile ? '0 20px' : '0 32px',
                        fontSize: isMobile ? '0.9rem' : '1.1rem',
                        fontWeight: '600',
                        borderRadius: isMobile ? '8px' : '12px',
                        border: '2px solid #e2e8f0',
                        color: '#4a5568',
                        width: isMobile ? '100%' : 'auto'
                      }}
                    >
                      {slide.secondaryButton}
                    </Button>
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: isMobile ? '16px' : '24px',
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'center' : 'flex-start',
                    marginTop: '20px'
                  }}>
                    {slide.stats.map((stat, statIndex) => (
                      <StatisticItem
                        key={statIndex}
                        title={stat.title}
                        value={stat.value}
                        suffix={stat.suffix}
                        valueStyle={{
                          color: '#2563eb',
                          fontSize: isMobile ? '1.2rem' : '2rem',
                          fontWeight: '700'
                        }}
                        titleStyle={{
                          color: '#718096',
                          fontSize: isMobile ? '0.8rem' : '1rem'
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Правая карточка */}
                {!isMobile && (
                  <div style={{
                    flex: '0.8',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    padding: '24px',
                    background: 'transparent',
                    borderRadius: '12px',
                    color: 'black',
                    minHeight: '400px',
                    marginLeft: '-50px'
                  }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '20px',
                      height: '100%',
                      justifyContent: 'center'
                    }}>
                      {slide.features.map((feature, featureIndex) => (
                        <div key={featureIndex} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          padding: '20px',
                          background: 'transparent',
                          borderRadius: '16px',
                          border: 'none',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer'
                        }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
                            e.currentTarget.style.transform = 'translateY(-3px)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <div style={{
                            width: '80px',
                            height: '80px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(0, 0, 0, 0.03)',
                            borderRadius: '12px',
                            fontSize: '48px',
                            flexShrink: 0
                          }}>
                            {feature.icon}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{
                              fontSize: '18px',
                              fontWeight: '700',
                              color: 'black',
                              marginBottom: '6px',
                              lineHeight: '1.3',
                              fontStyle: 'italic'
                            }}>
                              {feature.title}
                            </div>
                            <div style={{
                              fontSize: '15px',
                              color: 'black',
                              lineHeight: '1.5',
                              fontWeight: '400',
                              fontStyle: 'italic'
                            }}>
                              {feature.description}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default Hero;