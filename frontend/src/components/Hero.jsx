import React, { useState, useEffect, useCallback } from 'react';
import { Carousel, Button, Statistic } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
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
    navigate('/internships');
  }, [navigate]);

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
        { title: 'IT-компаний', value: 47, suffix: '+' },
        { title: 'Практик', value: 120, suffix: '+' },
        { title: 'Студентов', value: 500, suffix: '+' }
      ],
      features: [
        { icon: '🔍', title: 'Умный поиск', description: 'Найдите стажировку по вашим навыкам' },
        { icon: '🏢', title: 'Топ компании', description: 'Стажировки в ведущих IT-компаниях' },
        { icon: '📈', title: 'Карьерный рост', description: 'От стажировки до работы мечты' }
      ]
    },
    {
      id: 'companies',
      title: 'Найдите',
      titleHighlight: 'талантливых студентов',
      description: 'Разместите вакансии стажировок и найдите перспективных студентов для вашей команды. Быстро, эффективно, бесплатно.',
      primaryButton: 'Разместить вакансию',
      secondaryButton: 'Узнать больше',
      onPrimaryClick: () => navigate('/company-registration'),
      onSecondaryClick: handleLearnMore,
      stats: [
        { title: 'Студентов', value: 500, suffix: '+' },
        { title: 'Заявок', value: 120, suffix: '+' },
        { title: 'Компаний', value: 47, suffix: '+' }
      ],
      features: [
        { icon: '⭐', title: 'Лучшие таланты', description: 'Найдите мотивированных студентов' },
        { icon: '⚡', title: 'Быстрое размещение', description: 'Разместите вакансию за 5 минут' },
        { icon: '🎯', title: 'Точный подбор', description: 'Найдите идеального стажера' }
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
        box-shadow: 0 8px 32px rgba(102, 126, 234, 0.2) !important;
        padding: 12px !important;
        height: 550px !important;
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
        bottom: -40px !important;
        height: 24px !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        gap: 12px !important;
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
        background: rgba(102, 126, 234, 0.3) !important;
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
        transform: scale(1.4) !important;
      }
      
      .hero-carousel .slick-dots li:hover button {
        background: rgba(37, 99, 235, 0.6) !important;
        transform: scale(1.2) !important;
        opacity: 0.8 !important;
      }
      
      .hero-carousel .slick-dots li.slick-active:hover button {
        background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%) !important;
        transform: scale(1.5) !important;
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
    <div style={{ 
      padding: '0px 0 40px 0',
      position: 'relative'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 16px', width: '100%' }}>
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
                    fontSize: isMobile ? '32px' : '48px', 
                    fontWeight: '700', 
                    color: '#1a202c',
                    lineHeight: '1.2',
                    textAlign: isMobile ? 'center' : 'left'
                  }}>
                    {slide.title}
                    <br />
                    <span style={{ color: '#2563eb' }}>
                      {slide.titleHighlight}
                    </span>
                  </div>
                  
                  <div style={{ 
                    fontSize: isMobile ? '16px' : '20px', 
                    color: '#64748b',
                    lineHeight: '1.6',
                    textAlign: isMobile ? 'center' : 'left'
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
                        height: isMobile ? '48px' : '56px',
                        padding: isMobile ? '0 24px' : '0 32px',
                        fontSize: isMobile ? '1rem' : '1.1rem',
                        fontWeight: '600',
                        borderRadius: '12px',
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
                        height: isMobile ? '48px' : '56px',
                        padding: isMobile ? '0 24px' : '0 32px',
                        fontSize: isMobile ? '1rem' : '1.1rem',
                        fontWeight: '600',
                        borderRadius: '12px',
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
                    alignItems: isMobile ? 'center' : 'flex-start'
                  }}>
                    {slide.stats.map((stat, statIndex) => (
                      <StatisticItem
                        key={statIndex}
                        title={stat.title}
                        value={stat.value}
                        suffix={stat.suffix}
                        valueStyle={{ 
                          color: '#2563eb', 
                          fontSize: isMobile ? '1.5rem' : '2rem', 
                          fontWeight: '700' 
                        }}
                        titleStyle={{ 
                          color: '#718096', 
                          fontSize: isMobile ? '0.9rem' : '1rem' 
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
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #f8fafc 100%)',
                    borderRadius: '12px',
                    color: 'white',
                    minHeight: '400px'
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
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '16px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          backdropFilter: 'blur(10px)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                          e.currentTarget.style.transform = 'translateY(-3px)';
                          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                        >
                          <div style={{
                            width: '48px',
                            height: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '12px',
                            fontSize: '24px',
                            flexShrink: 0
                          }}>
                            {feature.icon}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{
                              fontSize: '18px',
                              fontWeight: '700',
                              color: 'white',
                              marginBottom: '6px',
                              lineHeight: '1.3'
                            }}>
                              {feature.title}
                            </div>
                            <div style={{
                              fontSize: '15px',
                              color: 'rgba(255, 255, 255, 0.85)',
                              lineHeight: '1.5',
                              fontWeight: '500'
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