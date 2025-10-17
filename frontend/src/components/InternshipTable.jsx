import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, Tag, Space, Typography, Button, Avatar, Row, Col, Divider, Tooltip } from 'antd';
import { InfoCircleOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import RatingDisplay from './RatingDisplay';

const { Text, Link } = Typography;

// Оптимизированный компонент карточки компании
const CompanyCard = React.memo(({ record, onCompanyClick, getCompanyTechs }) => {
  const techs = getCompanyTechs(record.internships || []);

  // Отладочная информация
  console.log('CompanyCard rendered for:', record.name);
  console.log('Company card data:', record);
  console.log('has_blue_checkmark:', record.has_blue_checkmark);
  console.log('Company name:', record.name);
  if (record.name === 'ВКонтакте') {
    console.log('ВКонтакте CompanyCard data:', record);
    console.log('ВКонтакте has_blue_checkmark:', record.has_blue_checkmark);
    console.log('ВКонтакте will show checkmark:', record.has_blue_checkmark === true);
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Card
        hoverable
        style={{
          height: '580px',
          borderRadius: '16px',
          border: 'none',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.1)',
          display: 'flex',
          flexDirection: 'column'
        }}
        styles={{ body: { padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' } }}
      >
        {/* Логотип и название */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Avatar
            size={80}
            src={record.logo}
            style={{
              marginBottom: '16px',
              border: '3px solid rgba(102, 126, 234, 0.2)'
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
            <Text
              strong
              style={{
                fontSize: '18px',
                color: '#2c3e50',
                display: 'block'
              }}
            >
              {record.name}
            </Text>
            {record.has_blue_checkmark && (
              <Tooltip
                title="Компания официально подтверждена и использует наш сервис для ответа на ваши заявки"
                placement="top"
              >
                <img
                  src="/checkblue.png"
                  alt="Verified"
                  style={{
                    width: '24px',
                    height: '24px',
                    cursor: 'help',
                    display: 'block'
                  }}
                />
              </Tooltip>
            )}
          </div>
          <Text
            style={{
              fontSize: '14px',
              color: '#7f8c8d',
              display: 'block',
              lineHeight: '1.4'
            }}
          >
            {record.description?.substring(0, 100)}...
          </Text>
        </div>

        <Divider style={{ margin: '16px 0' }} />

        {/* Статистика */}
        <div style={{ marginBottom: '20px' }}>
          <Row gutter={16}>
            <Col span={12}>
              <div style={{ textAlign: 'center' }}>
                <Text strong style={{ fontSize: '20px', color: '#667eea' }}>
                  {record.internships?.length || 0}
                </Text>
                <br />
                <Text style={{ fontSize: '12px', color: '#7f8c8d' }}>
                  Практик
                </Text>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ textAlign: 'center' }}>
                <Text strong style={{ fontSize: '20px', color: '#667eea' }}>
                  {techs.length}
                </Text>
                <br />
                <Text style={{ fontSize: '12px', color: '#7f8c8d' }}>
                  Технологий
                </Text>
              </div>
            </Col>
          </Row>
        </div>

        {/* Технологии */}
        <div style={{ marginBottom: '20px' }}>
          <Text
            style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#2c3e50',
              marginBottom: '8px',
              display: 'block'
            }}
          >
            Технологии:
          </Text>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {techs.length > 0 ? (
              <>
                {techs.slice(0, 5).map(tech => (
                  <Tag
                    key={tech}
                    size="small"
                    style={{
                      borderRadius: '8px',
                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                      color: '#667eea',
                      border: 'none',
                      fontWeight: '500'
                    }}
                  >
                    {tech}
                  </Tag>
                ))}
                {techs.length > 5 && (
                  <Tag size="small" style={{
                    borderRadius: '8px',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    color: '#667eea',
                    border: 'none'
                  }}>
                    +{techs.length - 5}
                  </Tag>
                )}
              </>
            ) : (
              <Text style={{ fontSize: '12px', color: '#8b9dc3' }}>
                Технологии не указаны
              </Text>
            )}
          </div>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <Button
            type="primary"
            icon={<InfoCircleOutlined />}
            size="large"
            block
            onClick={() => onCompanyClick(record)}
            style={{
              borderRadius: '12px',
              height: '44px',
              fontWeight: '600',
              background: 'var(--primary-gradient)',
              border: 'none',
              boxShadow: 'var(--shadow-soft)'
            }}
          >
            Подробнее
          </Button>
        </div>
      </Card>
    </div>
  );
});

export default function InternshipTable({ data, loading, pagination, onTableChange, selectedTechs = [] }) {
  const navigate = useNavigate();
  const { user, student, company } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const cardsPerView = 4;


  const handleCompanyClick = useCallback((record) => {
    if (record.id) {
      // Проверяем авторизацию пользователя
      if (!user || (!student && !company)) {
        // Если пользователь не авторизован, показываем модальное окно авторизации
        setAuthModalVisible(true);
        return;
      }
      // Если пользователь авторизован, переходим на страницу компании
      navigate(`/company/${record.id}`);
    }
  }, [user, student, company, navigate]);

  const handleAuthModalClose = useCallback(() => {
    setAuthModalVisible(false);
  }, []);

  const getCompanyTechs = useCallback((internships) => {
    const allTechs = new Set();
    internships.forEach(internship => {
      if (internship.tech_stack) {
        internship.tech_stack.forEach(tech => allTechs.add(tech));
      }
    });
    return Array.from(allTechs);
  }, []);

  // Мемоизируем отфильтрованные данные
  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    return data.filter(record => {
      // Для всех пользователей показываем только компании с практиками
      if (!record.internships || record.internships.length === 0) return false;

      // Фильтрация по технологиям
      if (selectedTechs.length > 0) {
        const companyTechs = getCompanyTechs(record.internships);
        const hasMatchingTech = selectedTechs.some(tech => companyTechs.includes(tech));
        if (!hasMatchingTech) return false;
      }

      return true;
    });
  }, [data, selectedTechs, getCompanyTechs]);

  const handlePrev = () => {
    setCurrentIndex(prev => prev === 0 ? data.length - 1 : prev - 1);
  };

  const handleNext = () => {
    setCurrentIndex(prev => prev === data.length - 1 ? 0 : prev + 1);
  };

  // Сброс индекса при изменении данных (фильтрация)
  useEffect(() => {
    setCurrentIndex(0);
  }, [data]);

  // Создаем циклический массив карточек
  const getVisibleCards = () => {
    if (data.length === 0) return [];

    const cards = [];
    const actualCardsPerView = Math.min(cardsPerView, data.length);

    for (let i = 0; i < actualCardsPerView; i++) {
      const index = (currentIndex + i) % data.length;
      cards.push(data[index]);
    }
    return cards;
  };

  const visibleCards = getVisibleCards();
  const showNavigation = data.length > 4;


  return (
    <div id="internship-carousel" style={{ position: 'relative', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>

      {/* Кнопка "Назад" - показываем только если данных больше 4 */}
      {showNavigation && (
        <Button
          type="primary"
          shape="circle"
          icon={<LeftOutlined />}
          onClick={handlePrev}
          style={{
            position: 'absolute',
            left: '-20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: '48px',
            height: '48px',
            background: 'var(--primary-gradient)',
            border: 'none',
            boxShadow: 'var(--shadow-soft)'
          }}
        />
      )}

      {/* Кнопка "Вперед" - показываем только если данных больше 4 */}
      {showNavigation && (
        <Button
          type="primary"
          shape="circle"
          icon={<RightOutlined />}
          onClick={handleNext}
          style={{
            position: 'absolute',
            right: '-20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: '48px',
            height: '48px',
            background: 'var(--primary-gradient)',
            border: 'none',
            boxShadow: 'var(--shadow-soft)'
          }}
        />
      )}

      {/* Карусель */}
      <div style={{
        display: 'flex',
        gap: '24px',
        overflow: 'hidden',
        padding: '0 20px'
      }}>
        {visibleCards.map((company, index) => {
          const techs = getCompanyTechs(company.internships || []);

          return (
            <div
              key={`${company.id}-${currentIndex}-${index}`}
              style={{
                flex: '0 0 calc(25% - 18px)',
                minWidth: '280px'
              }}
            >
              <Card
                hoverable
                loading={loading}
                style={{
                  height: '580px',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s ease',
                  boxShadow: 'none'
                }}
                styles={{
                  body: {
                    padding: '24px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }
                }}
              >
                {/* Логотип компании */}
                <div style={{
                  textAlign: 'center',
                  marginBottom: '24px',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'relative',
                    display: 'inline-block'
                  }}>
                    <Avatar
                      src={company.logo_url}
                      size={90}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: '4px solid rgba(255, 255, 255, 0.8)',
                        boxShadow: 'var(--shadow-medium)',
                        borderRadius: '20px',
                        objectFit: 'contain',
                        transition: 'var(--transition)'
                      }}
                      shape="square"
                    >
                      {company.name.charAt(0)}
                    </Avatar>
                    {/* Декоративное кольцо */}
                    <div style={{
                      position: 'absolute',
                      top: '-8px',
                      left: '-8px',
                      right: '-8px',
                      bottom: '-8px',
                      borderRadius: '28px',
                      background: 'var(--primary-gradient)',
                      opacity: 0.1,
                      zIndex: -1
                    }} />
                  </div>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Text strong style={{ fontSize: '18px', color: '#2c3e50' }}>
                      {company.name}
                    </Text>
                    {company.has_blue_checkmark && (
                      <Tooltip
                        title="Компания официально подтверждена и использует наш сервис для ответа на ваши заявки"
                        placement="top"
                      >
                        <img
                          src="/checkblue.png"
                          alt="Verified"
                          style={{
                            width: '24px',
                            height: '24px',
                            cursor: 'help',
                            display: 'block'
                          }}
                        />
                      </Tooltip>
                    )}
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    <RatingDisplay
                      rating={company.average_rating || 0}
                      showText={false}
                      size="small"
                      showCount={true}
                      totalReviews={company.total_reviews || 0}
                      style={{ justifyContent: 'center' }}
                    />
                  </div>
                </div>

                <div style={{
                  marginBottom: '16px',
                  height: '100px',
                  display: 'flex',
                  alignItems: 'flex-start'
                }}>
                  <Text style={{
                    fontSize: '14px',
                    color: '#5a6c7d',
                    lineHeight: '1.5',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    margin: 0
                  }}>
                    {company.short_description || company.description || 'Описание компании не указано'}
                  </Text>
                </div>

                <div style={{
                  marginBottom: '20px',
                  height: '80px',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ marginBottom: '8px' }}>
                    <Text style={{ fontSize: '12px', color: '#8b9dc3', fontWeight: '600' }}>
                      ТЕХНОЛОГИИ:
                    </Text>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {techs.length > 0 ? (
                      <>
                        {techs.slice(0, 5).map(tech => {
                          const isSelected = selectedTechs.includes(tech);
                          return (
                            <Tag
                              key={tech}
                              size="small"
                              style={{
                                borderRadius: '6px',
                                backgroundColor: isSelected ? '#4c63d2' : '#f0f4ff',
                                color: isSelected ? 'white' : '#4c63d2',
                                border: isSelected ? 'none' : '1px solid #e0e7ff',
                                fontWeight: '500',
                                fontSize: '12px',
                                padding: '4px 8px'
                              }}
                            >
                              {tech}
                            </Tag>
                          );
                        })}
                        {techs.length > 5 && (
                          <Tag size="small" style={{
                            borderRadius: '6px',
                            backgroundColor: '#f0f4ff',
                            color: '#4c63d2',
                            border: '1px solid #e0e7ff',
                            fontWeight: '500',
                            fontSize: '12px',
                            padding: '4px 8px'
                          }}>
                            +{techs.length - 5}
                          </Tag>
                        )}
                      </>
                    ) : (
                      <Text style={{ fontSize: '12px', color: '#8b9dc3' }}>
                        Технологии не указаны
                      </Text>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: 'auto' }}>
                  <Button
                    type="primary"
                    icon={<InfoCircleOutlined />}
                    size="large"
                    block
                    onClick={() => handleCompanyClick(company)}
                    style={{
                      borderRadius: '12px',
                      height: '44px',
                      fontWeight: '600',
                      background: 'var(--primary-gradient)',
                      border: 'none',
                      boxShadow: 'var(--shadow-soft)'
                    }}
                  >
                    Подробнее
                  </Button>
                </div>
              </Card>
            </div>
          );
        })}
      </div>


      {/* Модальное окно авторизации */}
      <AuthModal
        visible={authModalVisible}
        onClose={handleAuthModalClose}
        initialMode="login"
      />
    </div>
  );
}
