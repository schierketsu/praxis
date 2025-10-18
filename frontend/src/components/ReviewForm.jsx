import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Rate, Button, message, Space, Typography } from 'antd';
import { reviewsAPI } from '../services/api';

const { TextArea } = Input;
const { Title } = Typography;

export default function ReviewForm({
  visible,
  onClose,
  companyId,
  companyName,
  onSuccess,
  existingReview = null,
  isEditing = false
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Заполняем форму при редактировании
  useEffect(() => {
    if (visible && isEditing && existingReview) {
      form.setFieldsValue({
        rating: existingReview.rating,
        comment: existingReview.comment
      });
    } else if (visible && !isEditing) {
      form.resetFields();
    }
  }, [visible, isEditing, existingReview, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (isEditing && existingReview) {
        // Обновляем существующий отзыв
        await reviewsAPI.updateReview(existingReview.id, {
          rating: values.rating,
          comment: values.comment,
          is_anonymous: false
        });
        message.success('Отзыв успешно обновлен!');
      } else {
        // Создаем новый отзыв
        await reviewsAPI.createReview({
          company: companyId,
          rating: values.rating,
          comment: values.comment,
          is_anonymous: false
        });
        message.success('Отзыв успешно добавлен!');
      }

      form.resetFields();
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Ошибка сохранения отзыва:', error);
      message.error('Ошибка при сохранении отзыва');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={800}
      centered
      closable={false}
      maskClosable={false}
      styles={{
        body: {
          padding: '0',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
        },
        mask: {
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(0, 0, 0, 0.3)'
        }
      }}
    >
      <div style={{
        padding: '40px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{
            margin: '0 0 24px 0',
            fontSize: '28px',
            fontWeight: '700',
            color: 'black',
            lineHeight: '1.1',
            textShadow: 'none',
            letterSpacing: '-0.01em'
          }}>
            {isEditing ? `Редактировать отзыв о ${companyName}` : `Оставить отзыв о ${companyName}`}
          </Title>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          size="large"
        >
          <Form.Item
            name="rating"
            label="Оценка"
            rules={[{ required: true, message: 'Пожалуйста, поставьте оценку' }]}
          >
            <Rate
              style={{ fontSize: '24px', color: '#faad14' }}
            />
          </Form.Item>

          <Form.Item
            name="comment"
            label="Отзыв"
            rules={[
              { required: true, message: 'Пожалуйста, напишите отзыв' },
              { min: 10, message: 'Отзыв должен содержать минимум 10 символов' }
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Поделитесь своим опытом прохождения практики в этой компании..."
            />
          </Form.Item>


          <Form.Item style={{ marginBottom: '24px', textAlign: 'center' }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                block
                style={{
                  borderRadius: '12px',
                  height: '48px',
                  fontWeight: '600',
                  background: 'var(--primary-gradient)',
                  border: 'none',
                  boxShadow: 'var(--shadow-soft)'
                }}
              >
                {isEditing ? 'Обновить отзыв' : 'Отправить отзыв'}
              </Button>

              <Button
                onClick={handleCancel}
                size="large"
                block
                style={{
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
                Отмена
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}