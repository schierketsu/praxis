import React, { useState, useEffect } from 'react';
import { Layout, Card, Typography, Button, Space, Tag, Row, Col, Avatar, Divider, message, Form, Input, Select } from 'antd';
import { UserOutlined, EditOutlined, LogoutOutlined, MailOutlined, PhoneOutlined, BookOutlined, ArrowLeftOutlined, SaveOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { universitiesAPI } from '../services/api';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;

export default function StudentDashboard() {
  const { user, student, logout, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(student);
  const [form] = Form.useForm();
  const [universities, setUniversities] = useState([]);
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  // Обновляем данные студента при изменении
  useEffect(() => {
    setCurrentStudent(student);
    if (student) {
      setSkills(student.skills || []);
      setInterests(student.interests || []);
    }
  }, [student]);

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
    if (currentStudent && isEditing) {
      form.setFieldsValue({
        first_name: currentStudent.user?.first_name,
        last_name: currentStudent.user?.last_name,
        email: currentStudent.user?.email,
        university: currentStudent.university,
        course: currentStudent.course,
        specialization: currentStudent.specialization,
        phone: currentStudent.phone,
        bio: currentStudent.bio
      });
    }
  }, [currentStudent, isEditing, form]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      message.success('Выход выполнен успешно');
    } catch (error) {
      console.error('Ошибка выхода:', error);
      message.error('Ошибка при выходе');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (values) => {
    setLoading(true);
    try {
      const profileData = {
        ...values,
        skills: skills,
        interests: interests
      };

      const response = await updateProfile(profileData);
      setCurrentStudent(response.student);
      setIsEditing(false);
      message.success('Профиль обновлен успешно!');
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

  const handleCancel = () => {
    setIsEditing(false);
    // Сбрасываем форму к исходным значениям
    if (currentStudent) {
      form.setFieldsValue({
        first_name: currentStudent.user?.first_name,
        last_name: currentStudent.user?.last_name,
        email: currentStudent.user?.email,
        university: currentStudent.university,
        course: currentStudent.course,
        specialization: currentStudent.specialization,
        phone: currentStudent.phone,
        bio: currentStudent.bio
      });
      setSkills(currentStudent.skills || []);
      setInterests(currentStudent.interests || []);
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

  if (!currentStudent) {
    return (
      <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <Content style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: '40px 24px'
        }}>
          <Card style={{ textAlign: 'center', maxWidth: '400px' }}>
            <Title level={3}>Профиль не найден</Title>
            <Text type="secondary">Данные пользователя не загружены</Text>
          </Card>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Content style={{ padding: '40px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Кнопка назад */}
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => window.history.back()}
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
            Назад
          </Button>

          {/* Заголовок */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <Title level={1} style={{ 
              margin: '0 0 16px 0',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '48px',
              fontWeight: '800'
            }}>
              Личный кабинет
            </Title>
            <Text type="secondary" style={{ fontSize: '18px' }}>
              Управляйте своим профилем и настройками
            </Text>
          </div>

          {/* Основная информация */}
          <Card
            style={{
              marginBottom: '32px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
            styles={{
              body: {
                padding: '40px'
              }
            }}
          >
            {isEditing ? (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
                size="large"
              >
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                  <Title level={2} style={{ 
                    margin: '0 0 16px 0',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: '32px',
                    fontWeight: '700'
                  }}>
                    Редактирование профиля
                  </Title>
                  <Text type="secondary" style={{ fontSize: '16px' }}>
                    Измените информацию о себе
                  </Text>
                </div>

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

                <Divider style={{ margin: '32px 0' }} />

                <div style={{ textAlign: 'center' }}>
                  <Space size="large">
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      icon={<SaveOutlined />}
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
                    <Button
                      icon={<CloseOutlined />}
                      onClick={handleCancel}
                      size="large"
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
                  </Space>
                </div>
              </Form>
            ) : (
              <>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                  <Avatar
                    size={120}
                    icon={<UserOutlined />}
                    style={{
                      backgroundColor: '#667eea',
                      marginBottom: '24px',
                      boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
                    }}
                  />
                  <Title level={2} style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>
                    {currentStudent.user?.first_name} {currentStudent.user?.last_name}
                  </Title>
                  <Text type="secondary" style={{ fontSize: '18px' }}>
                    @{currentStudent.user?.username}
                  </Text>
                </div>

            <Row gutter={[32, 32]}>
              <Col xs={24} lg={12}>
                <div style={{ marginBottom: '24px' }}>
                  <Text strong style={{ color: '#667eea', fontSize: '16px' }}>
                    <MailOutlined style={{ marginRight: '12px' }} />
                    Email:
                  </Text>
                  <br />
                  <Text style={{ fontSize: '16px', marginTop: '8px', display: 'block' }}>
                    {currentStudent.user?.email || 'Не указан'}
                  </Text>
                </div>
              </Col>
              <Col xs={24} lg={12}>
                <div style={{ marginBottom: '24px' }}>
                  <Text strong style={{ color: '#667eea', fontSize: '16px' }}>
                    <PhoneOutlined style={{ marginRight: '12px' }} />
                    Телефон:
                  </Text>
                  <br />
                  <Text style={{ fontSize: '16px', marginTop: '8px', display: 'block' }}>
                    {currentStudent.phone || 'Не указан'}
                  </Text>
                </div>
              </Col>
            </Row>

            <Row gutter={[32, 32]}>
              <Col xs={24} lg={12}>
                <div style={{ marginBottom: '24px' }}>
                  <Text strong style={{ color: '#667eea', fontSize: '16px' }}>
                    <BookOutlined style={{ marginRight: '12px' }} />
                    Университет:
                  </Text>
                  <br />
                  <Text style={{ fontSize: '16px', marginTop: '8px', display: 'block' }}>
                    {currentStudent.university_name}
                  </Text>
                </div>
              </Col>
              <Col xs={24} lg={12}>
                <div style={{ marginBottom: '24px' }}>
                  <Text strong style={{ color: '#667eea', fontSize: '16px' }}>
                    Курс:
                  </Text>
                  <br />
                  <Text style={{ fontSize: '16px', marginTop: '8px', display: 'block' }}>
                    {currentStudent.course} курс
                  </Text>
                </div>
              </Col>
            </Row>

            {currentStudent.specialization && (
              <div style={{ marginBottom: '24px' }}>
                <Text strong style={{ color: '#667eea', fontSize: '16px' }}>
                  Специализация:
                </Text>
                <br />
                <Text style={{ fontSize: '16px', marginTop: '8px', display: 'block' }}>
                  {currentStudent.specialization}
                </Text>
              </div>
            )}

            {currentStudent.bio && (
              <div style={{ marginBottom: '24px' }}>
                <Text strong style={{ color: '#667eea', fontSize: '16px' }}>
                  О себе:
                </Text>
                <br />
                <Paragraph style={{ marginTop: '8px', fontSize: '16px', lineHeight: '1.6' }}>
                  {currentStudent.bio}
                </Paragraph>
              </div>
            )}

            {currentStudent.skills && currentStudent.skills.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <Text strong style={{ color: '#667eea', fontSize: '16px' }}>
                  Навыки:
                </Text>
                <br />
                <div style={{ marginTop: '8px' }}>
                  {currentStudent.skills.map((skill, index) => (
                    <Tag key={index} color="blue" style={{ 
                      marginBottom: '8px', 
                      padding: '4px 12px',
                      fontSize: '14px',
                      borderRadius: '8px'
                    }}>
                      {skill}
                    </Tag>
                  ))}
                </div>
              </div>
            )}

            {currentStudent.interests && currentStudent.interests.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <Text strong style={{ color: '#667eea', fontSize: '16px' }}>
                  Интересы:
                </Text>
                <br />
                <div style={{ marginTop: '8px' }}>
                  {currentStudent.interests.map((interest, index) => (
                    <Tag key={index} color="green" style={{ 
                      marginBottom: '8px', 
                      padding: '4px 12px',
                      fontSize: '14px',
                      borderRadius: '8px'
                    }}>
                      {interest}
                    </Tag>
                  ))}
                </div>
              </div>
            )}

            <Divider style={{ margin: '32px 0' }} />

            <div style={{ textAlign: 'center' }}>
              <Space size="large">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={handleEdit}
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
                  Редактировать профиль
                </Button>
                <Button
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                  loading={loading}
                  size="large"
                  style={{
                    borderRadius: '12px',
                    height: '48px',
                    paddingLeft: '32px',
                    paddingRight: '32px',
                    fontWeight: '600'
                  }}
                >
                  Выйти
                </Button>
              </Space>
            </div>
              </>
            )}
          </Card>
        </div>
      </Content>
    </Layout>
  );
}
