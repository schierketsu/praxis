import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Card, Typography, Space, message, Row, Col, Tag } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, BookOutlined, PlusOutlined } from '@ant-design/icons';
import { authAPI, universitiesAPI } from '../services/api';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function StudentProfileEdit({ student, onSave, onCancel }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  // Загружаем список университетов
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await universitiesAPI.getUniversities();
        setUniversities(response.results || []);
      } catch (error) {
        console.error('Ошибка загрузки университетов:', error);
      }
    };
    fetchUniversities();
  }, []);

  // Инициализируем форму данными студента
  useEffect(() => {
    if (student) {
      form.setFieldsValue({
        first_name: student.user?.first_name,
        last_name: student.user?.last_name,
        email: student.user?.email,
        university: student.university,
        course: student.course,
        specialization: student.specialization,
        phone: student.phone,
        bio: student.bio
      });
      setSkills(student.skills || []);
      setInterests(student.interests || []);
    }
  }, [student, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const profileData = {
        ...values,
        skills: skills,
        interests: interests
      };

      const response = await authAPI.updateProfile(profileData);
      message.success('Профиль обновлен успешно!');
      
      if (onSave) {
        onSave(response);
      }
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      if (error.response?.data?.error) {
        message.error(error.response.data.error);
      } else if (error.response?.data) {
        const errors = error.response.data;
        if (typeof errors === 'object') {
          Object.keys(errors).forEach(key => {
            if (Array.isArray(errors[key])) {
              message.error(`${key}: ${errors[key].join(', ')}`);
            } else {
              message.error(`${key}: ${errors[key]}`);
            }
          });
        }
      } else {
        message.error('Ошибка при обновлении профиля. Попробуйте еще раз.');
      }
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const removeInterest = (interestToRemove) => {
    setInterests(interests.filter(interest => interest !== interestToRemove));
  };

  return (
    <div
      style={{
        padding: '40px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={2} style={{ 
          margin: '0 0 16px 0',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '28px',
          fontWeight: '700'
        }}>
          Редактирование профиля
        </Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          Заполните информацию о себе
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        size="large"
      >
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="first_name"
              label="Имя"
              rules={[{ required: true, message: 'Введите имя' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Имя" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="last_name"
              label="Фамилия"
              rules={[{ required: true, message: 'Введите фамилию' }]}
            >
              <Input placeholder="Фамилия" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Введите email' },
            { type: 'email', message: 'Некорректный email' }
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="email@example.com" />
        </Form.Item>

        <Row gutter={[16, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="university"
              label="Университет"
              rules={[{ required: true, message: 'Выберите университет' }]}
            >
              <Select placeholder="Выберите университет">
                {universities.map(uni => (
                  <Option key={uni.id} value={uni.id}>
                    {uni.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="course"
              label="Курс"
              rules={[{ required: true, message: 'Выберите курс' }]}
            >
              <Select placeholder="Выберите курс">
                <Option value={1}>1 курс</Option>
                <Option value={2}>2 курс</Option>
                <Option value={3}>3 курс</Option>
                <Option value={4}>4 курс</Option>
                <Option value={5}>5 курс</Option>
                <Option value={6}>6 курс</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="specialization"
          label="Специализация"
        >
          <Input prefix={<BookOutlined />} placeholder="Например: Программирование" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Телефон"
        >
          <Input prefix={<PhoneOutlined />} placeholder="+7 (999) 123-45-67" />
        </Form.Item>

        <Form.Item
          name="bio"
          label="О себе"
        >
          <TextArea 
            rows={3} 
            placeholder="Расскажите о себе, своих интересах и целях..."
          />
        </Form.Item>

        {/* Навыки */}
        <Form.Item label="Навыки">
          <div style={{ marginBottom: '8px' }}>
            <Space.Compact style={{ width: '100%' }}>
              <Input
                placeholder="Добавить навык"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onPressEnter={addSkill}
              />
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={addSkill}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none'
                }}
              >
                Добавить
              </Button>
            </Space.Compact>
          </div>
          <div>
            {skills.map((skill, index) => (
              <Tag
                key={index}
                closable
                onClose={() => removeSkill(skill)}
                color="blue"
                style={{ marginBottom: '4px' }}
              >
                {skill}
              </Tag>
            ))}
          </div>
        </Form.Item>

        {/* Интересы */}
        <Form.Item label="Интересы">
          <div style={{ marginBottom: '8px' }}>
            <Space.Compact style={{ width: '100%' }}>
              <Input
                placeholder="Добавить интерес"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onPressEnter={addInterest}
              />
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={addInterest}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none'
                }}
              >
                Добавить
              </Button>
            </Space.Compact>
          </div>
          <div>
            {interests.map((interest, index) => (
              <Tag
                key={index}
                closable
                onClose={() => removeInterest(interest)}
                color="green"
                style={{ marginBottom: '4px' }}
              >
                {interest}
              </Tag>
            ))}
          </div>
        </Form.Item>

        <Form.Item style={{ marginBottom: '24px', textAlign: 'center' }}>
          <Space size="middle">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              style={{
                borderRadius: '12px',
                height: '48px',
                paddingLeft: '32px',
                paddingRight: '32px',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
              }}
            >
              Сохранить изменения
            </Button>
            {onCancel && (
              <Button
                size="large"
                onClick={onCancel}
                style={{
                  borderRadius: '12px',
                  height: '48px',
                  paddingLeft: '32px',
                  paddingRight: '32px',
                  fontWeight: '600'
                }}
              >
                Отмена
              </Button>
            )}
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}
