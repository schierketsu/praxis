import React, { useState, useEffect } from 'react';
import { Card, Rate, Typography, Button, Space, Avatar, Divider, Empty, Spin, message } from 'antd';
import { UserOutlined, StarOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { reviewsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import RatingDisplay from './RatingDisplay';
import ReviewForm from './ReviewForm';

const { Title, Text, Paragraph } = Typography;

export default function ReviewsSection({ companyId, companyName }) {
  const { user, student, company } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [reviewFormVisible, setReviewFormVisible] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [companyId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await reviewsAPI.getCompanyReviews(companyId);
      setReviews(response.results || []);

      // Находим отзыв текущего пользователя
      if (user && response.results) {
        const currentUserReview = response.results.find(review => review.student_user_id === user.id);
        setUserReview(currentUserReview || null);
      }

      // Вычисляем средний рейтинг
      if (response.results && response.results.length > 0) {
        const total = response.results.reduce((sum, review) => sum + review.rating, 0);
        setAverageRating(total / response.results.length);
        setTotalReviews(response.results.length);
      }
    } catch (error) {
      console.error('Ошибка загрузки отзывов:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleReviewSuccess = () => {
    fetchReviews(); // Обновляем список отзывов
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await reviewsAPI.deleteReview(reviewId);
      message.success('Отзыв успешно удален!');
      fetchReviews(); // Обновляем список отзывов
    } catch (error) {
      console.error('Ошибка удаления отзыва:', error);
      message.error('Ошибка при удалении отзыва');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Card
      style={{
        borderRadius: '24px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        marginTop: '32px'
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title level={2} style={{
            margin: 0,
            background: 'var(--primary-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '28px',
            fontWeight: '700',
            letterSpacing: '-0.01em'
          }}>
            Отзывы студентов
          </Title>

          {user && student && (
            <Button
              type="primary"
              icon={userReview ? <EditOutlined /> : <PlusOutlined />}
              onClick={() => {
                if (userReview) {
                  setIsEditing(true);
                }
                setReviewFormVisible(true);
              }}
              style={{
                borderRadius: 'var(--border-radius)',
                height: '40px',
                fontWeight: '600',
                background: 'var(--primary-gradient)',
                border: 'none',
                boxShadow: 'var(--shadow-soft)'
              }}
            >
              {userReview ? 'Редактировать отзыв' : 'Оставить отзыв'}
            </Button>
          )}
        </div>

        {totalReviews === 0 && (
          <Text style={{ fontSize: '16px', color: '#666' }}>
            Пока нет отзывов о компании
          </Text>
        )}
      </div>

      {reviews.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {reviews.map((review) => (
            <Card
              key={review.id}
              style={{
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(102, 126, 234, 0.1)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
              }}
              styles={{
                body: {
                  padding: '20px'
                }
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Avatar
                    size={40}
                    icon={<UserOutlined />}
                    style={{ backgroundColor: '#667eea' }}
                  />
                  <div>
                    <Text strong style={{ fontSize: '16px', color: '#2c3e50' }}>
                      {review.is_anonymous ? 'Анонимный студент' : review.student_name}
                    </Text>
                    <br />
                    <Text style={{ fontSize: '12px', color: '#999' }}>
                      {formatDate(review.created_date)}
                    </Text>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Rate
                    disabled
                    value={review.rating}
                    style={{ color: '#faad14' }}
                  />
                  {user && review.student_user_id === user.id && (
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteReview(review.id)}
                      style={{
                        color: '#ff4d4f',
                        border: 'none',
                        boxShadow: 'none'
                      }}
                      title="Удалить отзыв"
                    />
                  )}
                </div>
              </div>

              <Paragraph
                style={{
                  margin: 0,
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: '#5a6c7d'
                }}
              >
                {review.comment}
              </Paragraph>

              {/* Кнопка "Ответить" для компаний */}
              {company && (
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f0f0f0' }}>
                  <Button
                    type="text"
                    size="small"
                    onClick={() => {
                      // TODO: Реализовать ответ на отзыв
                      message.info('Функция ответа на отзыв будет добавлена в следующей версии');
                    }}
                    style={{
                      color: '#667eea',
                      fontSize: '12px',
                      padding: '4px 8px',
                      height: 'auto'
                    }}
                  >
                    Ответить на отзыв
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Empty
          description="Пока нет отзывов"
          style={{ padding: '40px 0' }}
        />
      )}

      {/* Форма отзыва */}
      <ReviewForm
        visible={reviewFormVisible}
        onClose={() => {
          setReviewFormVisible(false);
          setIsEditing(false);
        }}
        companyId={companyId}
        companyName={companyName}
        onSuccess={handleReviewSuccess}
        existingReview={isEditing ? userReview : null}
        isEditing={isEditing}
      />
    </Card>
  );
}
