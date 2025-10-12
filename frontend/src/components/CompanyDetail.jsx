import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Avatar, 
  Typography, 
  Button, 
  Space, 
  Tag, 
  Table, 
  Spin, 
  message,
  Row,
  Col,
  Divider,
  Layout
} from 'antd';
import { ArrowLeftOutlined, GlobalOutlined } from '@ant-design/icons';
import { companiesAPI, internshipsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import MapComponent from './MapComponent';
import AppHeader from './layout/AppHeader';
import ReviewsSection from './ReviewsSection';
import RatingDisplay from './RatingDisplay';

const { Title, Text, Paragraph, Link } = Typography;

export default function CompanyDetail() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authModalVisible, setAuthModalVisible] = useState(false);


  useEffect(() => {
    fetchCompanyData();
  }, [companyId]);

  const fetchCompanyData = async () => {
    setLoading(true);
    try {
      // Получаем информацию о компании
      const companyResponse = await companiesAPI.getCompanies();
      const companyData = companyResponse.results.find(c => c.id === parseInt(companyId));

      if (companyData) {
        setCompany(companyData);

        // Получаем практики этой компании
        const internshipsResponse = await internshipsAPI.getInternships({
          company_name: companyData.name
        });
        setInternships(internshipsResponse.results || []);
      } else {
        message.error('Компания не найдена');
        navigate('/');
      }
    } catch (error) {
      message.error('Ошибка при загрузке данных');
      console.error('Error fetching company data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactClick = () => {
    // Проверяем авторизацию пользователя
    if (!user) {
      // Если пользователь не авторизован, показываем модальное окно авторизации
      setAuthModalVisible(true);
      return;
    }
    
    // Если пользователь авторизован, переходим на страницу заявок с предзаполненной компанией
    navigate('/applications', { 
      state: { 
        preselectedCompany: company 
      } 
    });
  };

  const internshipColumns = [
    {
      title: 'Должность',
      dataIndex: 'position',
      key: 'position',
      width: 200,
      render: (position) => <Text strong style={{ fontSize: '16px' }}>{position}</Text>
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      render: (description) => (
        <Text style={{ fontSize: '12px' }}>
          {description || 'Описание не указано'}
        </Text>
      )
    },
    {
      title: 'Стек технологий',
      dataIndex: 'tech_stack',
      key: 'tech_stack',
      width: 300,
      render: (techStack) => (
        <div>
          {techStack && techStack.length > 0 ? (
            techStack.map(tech => (
              <Tag key={tech} size="small" style={{ marginBottom: 2, marginRight: 4 }}>
                {tech}
              </Tag>
            ))
          ) : (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Не указано
            </Text>
          )}
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!company) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Text>Компания не найдена</Text>
        <br />
        <Button onClick={() => navigate('/')} style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}>Вернуться на главную</Button>
      </div>
    );
  }

  return (
    <Layout>
      <AppHeader />
      <Layout>
        <Layout.Content style={{
          minHeight: 'calc(100vh - 80px)',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          padding: '40px 24px'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/')}
          size="large"
          style={{ 
            marginBottom: '32px',
            borderRadius: '12px',
            height: '48px',
            fontWeight: '600',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: '#667eea',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          На главную
        </Button>

        <Card
          style={{
            borderRadius: '24px',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            marginBottom: '32px'
          }}
          styles={{
            body: {
              borderRadius: '24px',
              overflow: 'hidden',
              padding: '32px'
            }
          }}
        >
          <div style={{ position: 'relative' }}>
            <Row gutter={[32, 32]} align="top">
              <Col xs={24} lg={16}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <div>
                    <Title level={1} style={{ margin: 0, fontSize: '2.5rem' }}>{company.name}</Title>
                    <div style={{ marginTop: '12px' }}>
                      <RatingDisplay 
                        rating={company.average_rating || 0} 
                        showText={true}
                        showCount={true}
                        totalReviews={company.total_reviews || 0}
                        style={{ fontSize: '16px' }}
                      />
                    </div>
                  </div>

                  {company.description && (
                    <div>
                      <Title level={3} style={{ marginBottom: '16px' }}>О нас:</Title>
                      <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>{company.description}</Paragraph>
                    </div>
                  )}

                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                              {company.website && (
                                <Link href={company.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: '16px' }}>
                                  <GlobalOutlined style={{ marginRight: '8px' }} />
                                  {company.website}
                                </Link>
                              )}
                              
                              <Button
                                type="primary"
                                size="large"
                                onClick={handleContactClick}
                                style={{
                                  borderRadius: '12px',
                                  height: '48px',
                                  paddingLeft: '32px',
                                  paddingRight: '32px',
                                  fontWeight: '600',
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  border: 'none',
                                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                                  width: 'fit-content'
                                }}
                              >
                                Связаться
                              </Button>
                            </Space>
                </Space>
              </Col>
              
              <Col xs={24} lg={8}>
                {company.address && (
                  <Card 
                    style={{ 
                      borderRadius: '20px',
                      overflow: 'hidden',
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                    }}
                    styles={{
                      body: {
                        borderRadius: '20px',
                        overflow: 'hidden',
                        padding: '20px'
                      }
                    }}
                  >
                    <Title level={4} style={{ marginBottom: '12px', textAlign: 'center' }}>Мы тут:</Title>
                    <Text type="secondary" style={{ display: 'block', marginBottom: '16px', textAlign: 'center' }}>
                      {company.address}
                    </Text>
                    <div style={{ 
                      width: '100%', 
                      height: '250px', 
                      borderRadius: '12px',
                      overflow: 'hidden'
                    }}>
                      <MapComponent 
                        address={company.address} 
                        companyName={company.name}
                        latitude={company.latitude}
                        longitude={company.longitude}
                      />
                    </div>
                  </Card>
                )}
              </Col>
            </Row>
          </div>
        </Card>

        {/* Секция с практиками */}
        {internships.length > 0 && (
          <Card
            style={{
              marginTop: '32px',
              borderRadius: '24px',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
            styles={{
              body: {
                borderRadius: '24px',
                overflow: 'hidden',
                padding: '32px'
              }
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <Title level={2} style={{ 
                margin: '0 0 24px 0', 
                color: '#2c3e50',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '28px',
                fontWeight: '700'
              }}>
                Вы сможете выбрать одно из направлений:
              </Title>
            </div>

            <Row gutter={[24, 24]}>
              {internships.map((internship) => (
                <Col xs={24} sm={12} lg={8} key={internship.id}>
                  <Card
                    hoverable
                    style={{
                      height: '100%',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
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
                    <div style={{ marginBottom: '16px' }}>
                      <Title level={4} style={{ margin: 0, color: '#2c3e50' }}>
                        {internship.position}
                      </Title>
                    </div>

                    <div style={{ marginBottom: '16px', flex: 1 }}>
                      <Text style={{ 
                        fontSize: '14px', 
                        color: '#5a6c7d',
                        lineHeight: '1.5',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {internship.description}
                      </Text>
                    </div>

                    {internship.tech_stack && internship.tech_stack.length > 0 && (
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ marginBottom: '8px' }}>
                          <Text style={{ fontSize: '12px', color: '#8b9dc3', fontWeight: '600' }}>
                            ТЕХНОЛОГИИ:
                          </Text>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {internship.tech_stack.slice(0, 5).map(tech => (
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
                          {internship.tech_stack.length > 5 && (
                            <Tag size="small" style={{ 
                              borderRadius: '8px',
                              backgroundColor: 'rgba(102, 126, 234, 0.1)',
                              color: '#667eea',
                              border: 'none'
                            }}>
                              +{internship.tech_stack.length - 5}
                            </Tag>
                          )}
                        </div>
                      </div>
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        )}

        {/* Секция отзывов */}
        <ReviewsSection companyId={parseInt(companyId)} companyName={company.name} />
          </div>
        </Layout.Content>
      </Layout>
      
      {/* Модальное окно авторизации */}
      <AuthModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
        onSuccess={() => {
          setAuthModalVisible(false);
          // После успешной авторизации переходим на страницу заявок
          navigate('/applications', { 
            state: { 
              preselectedCompany: company 
            } 
          });
        }}
      />
    </Layout>
  );
}
