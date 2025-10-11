import React, { useState, useEffect } from 'react';
import { Card, Tag, Space, Typography, Button, Avatar, Row, Col, Divider } from 'antd';
import { InfoCircleOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Text, Link } = Typography;

export default function InternshipTable({ data, loading, pagination, onTableChange, selectedTechs = [] }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerView = 4;

  const handleCompanyClick = (record) => {
    if (record.id) {
      navigate(`/company/${record.id}`);
    }
  };

  const getCompanyTechs = (internships) => {
    const allTechs = new Set();
    internships.forEach(internship => {
      if (internship.tech_stack) {
        internship.tech_stack.forEach(tech => allTechs.add(tech));
      }
    });
    return Array.from(allTechs);
  };

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
    <div style={{ position: 'relative', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
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
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
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
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
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
                onClick={() => handleCompanyClick(company)}
                      style={{
                        height: '580px',
                        borderRadius: '20px',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                bodyStyle={{
                  padding: '24px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <Avatar 
                    src={company.logo_url} 
                    size={80}
                    style={{ 
                      backgroundColor: '#f0f2f5',
                      border: '3px solid #fff',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      borderRadius: '16px',
                      objectFit: 'contain'
                    }}
                    shape="square"
                  >
                    {company.name.charAt(0)}
                  </Avatar>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <Text strong style={{ fontSize: '18px', color: '#2c3e50' }}>
                    {company.name}
                  </Text>
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
                    {company.description || 'Описание компании не указано'}
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
                                borderRadius: '8px',
                                backgroundColor: isSelected ? '#667eea' : 'rgba(102, 126, 234, 0.1)',
                                color: isSelected ? 'white' : '#667eea',
                                border: 'none',
                                fontWeight: '500'
                              }}
                            >
                              {tech}
                            </Tag>
                          );
                        })}
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
                    style={{
                      borderRadius: '12px',
                      height: '44px',
                      fontWeight: '600',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
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
    </div>
  );
}
