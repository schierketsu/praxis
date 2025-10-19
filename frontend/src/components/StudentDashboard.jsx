import React, { useState, useEffect } from 'react';
import { Layout, Card, Typography, Button, Space, Tag, Row, Col, Avatar, Divider, message, Form, Input, Select, Upload } from 'antd';
import { UserOutlined, EditOutlined, MailOutlined, PhoneOutlined, BookOutlined, ArrowLeftOutlined, SaveOutlined, CloseOutlined, PlusOutlined, UploadOutlined, FileOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { universitiesAPI } from '../services/api';
import AppHeader from './layout/AppHeader';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;

export default function StudentDashboard() {
  const { user, student, logout, updateProfile, checkAuthStatus } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(student);
  const [form] = Form.useForm();
  const [universities, setUniversities] = useState([]);
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarKey, setAvatarKey] = useState(0); // Для принудительного обновления аватара
  const [avatarError, setAvatarError] = useState(false); // Для обработки ошибок загрузки аватара
  const [avatarUrl, setAvatarUrl] = useState(null); // Локальное состояние для URL аватара

  // Обновляем данные студента при изменении
  useEffect(() => {
    setCurrentStudent(student);
    if (student) {
      setSkills(student.skills || []);
      setInterests(student.interests || []);
      // Принудительно обновляем аватар при изменении данных
      setAvatarKey(prev => prev + 1);
      setAvatarError(false); // Сбрасываем ошибку при обновлении данных

      // Принудительно обновляем URL аватара с timestamp для обхода кэша
      if (student.avatar_url) {
        const timestamp = new Date().getTime();
        setAvatarUrl(`${student.avatar_url}?t=${timestamp}`);
      } else {
        setAvatarUrl(null);
      }
    }
    // Очищаем предпросмотр файлов при обновлении данных
    setResumeFile(null);
    setAvatarFile(null);
  }, [student]);

  // Принудительно обновляем данные студента при монтировании компонента
  useEffect(() => {
    const refreshStudentData = async () => {
      try {
        // Принудительно обновляем данные студента
        await checkAuthStatus();
      } catch (error) {
        console.error('Ошибка обновления данных студента:', error);
      }
    };

    refreshStudentData();
  }, [checkAuthStatus]);

  // Обновляем данные при фокусе окна (возврат на страницу)
  useEffect(() => {
    const handleFocus = async () => {
      try {
        await checkAuthStatus();
      } catch (error) {
        console.error('Ошибка обновления данных при фокусе:', error);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [checkAuthStatus]);

  // Принудительно обновляем аватар при изменении данных студента
  useEffect(() => {
    if (student?.avatar_url) {
      const timestamp = new Date().getTime();
      setAvatarUrl(`${student.avatar_url}?t=${timestamp}`);
    } else {
      setAvatarUrl(null);
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
      // Очищаем предпросмотр файлов при входе в режим редактирования
      setResumeFile(null);
      setAvatarFile(null);
    }
  }, [currentStudent, isEditing, form]);


  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (values) => {
    setLoading(true);
    try {
      // Создаем FormData для отправки файлов
      const formData = new FormData();

      // Добавляем текстовые поля
      Object.keys(values).forEach(key => {
        if (key !== 'resume' && key !== 'avatar' && values[key] !== undefined) {
          formData.append(key, values[key]);
        }
      });

      // Добавляем файл резюме, если он есть
      if (resumeFile && resumeFile instanceof File) {
        formData.append('resume', resumeFile);
      } else if (values.resume === null) {
        // Если пользователь удалил резюме, отправляем пустое значение
        formData.append('resume', '');
      }

      // Добавляем файл аватара, если он есть
      if (avatarFile && avatarFile instanceof File) {
        formData.append('avatar', avatarFile);
      } else if (values.avatar === 'DELETE') {
        // Если пользователь удалил аватар, отправляем пустое значение
        formData.append('avatar', '');
      }

      // Добавляем навыки и интересы
      formData.append('skills', JSON.stringify(skills));
      formData.append('interests', JSON.stringify(interests));


      const response = await updateProfile(formData);
      setCurrentStudent(response.student);
      setIsEditing(false);

      // Очищаем предпросмотр после успешной загрузки
      setResumeFile(null);
      setAvatarFile(null);

      // Принудительно обновляем аватар после успешного сохранения
      setAvatarKey(prev => prev + 1);
      setAvatarError(false);

      // Обновляем URL аватара с новым timestamp
      if (response.student?.avatar_url) {
        const timestamp = new Date().getTime();
        setAvatarUrl(`${response.student.avatar_url}?t=${timestamp}`);
      } else {
        setAvatarUrl(null);
      }

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
    // Очищаем предпросмотр
    setResumeFile(null);
    setAvatarFile(null);

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
      <Layout style={{ minHeight: '100vh', background: 'var(--background-gradient)' }}>
        <AppHeader />
        <Content style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px 24px'
        }}>
          <Card style={{
            textAlign: 'center',
            maxWidth: '400px',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(20px)',
            borderRadius: 'var(--border-radius-lg)',
            border: '1px solid var(--glass-border)',
            boxShadow: 'var(--shadow-soft)'
          }}>
            <Title level={3} style={{ color: 'var(--text-primary)' }}>Профиль не найден</Title>
            <Text style={{ color: 'var(--text-secondary)' }}>Данные пользователя не загружены</Text>
          </Card>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', background: 'var(--background-gradient)' }}>
      <AppHeader />
      <Content style={{ padding: isMobile ? '20px 16px' : '40px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Кнопка назад */}
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/')}
            size={isMobile ? 'middle' : 'large'}
            style={{
              marginBottom: isMobile ? '24px' : '32px',
              borderRadius: 'var(--border-radius)',
              height: isMobile ? '40px' : '48px',
              fontWeight: '600',
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(37, 99, 235, 0.2)',
              color: 'var(--text-primary)',
              boxShadow: 'var(--shadow-soft)',
              fontSize: isMobile ? '14px' : '16px'
            }}
          >
            {isMobile ? 'Назад' : 'Назад к главной'}
          </Button>

          {/* Заголовок */}
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '48px' }}>
            <Title level={1} style={{
              margin: '0 0 16px 0',
              fontSize: isMobile ? '32px' : '48px',
              fontWeight: '800',
              color: 'black',
              lineHeight: '1.1',
              textShadow: 'none',
              letterSpacing: '-0.02em'
            }}>
              Личный кабинет
            </Title>
            <Text style={{
              fontSize: isMobile ? '16px' : '18px',
              color: 'var(--text-secondary)',
              fontWeight: '500'
            }}>
              {isMobile ? 'Ваш профиль' : 'Управляйте своим профилем и настройками'}
            </Text>
          </div>

          {/* Основная информация */}
          <Card
            style={{
              marginBottom: '32px',
              borderRadius: 'var(--border-radius-lg)',
              background: 'rgb(255, 255, 255)',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              transition: 'none !important',
              transform: 'none !important',
              animation: 'none !important',
              willChange: 'auto'
            }}
            styles={{
              body: {
                padding: '48px'
              }
            }}
            hoverable={false}
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
                    background: 'var(--primary-gradient)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: '32px',
                    fontWeight: '800',
                    letterSpacing: '-0.02em'
                  }}>
                    Редактирование профиля
                  </Title>
                  <Text style={{
                    fontSize: '16px',
                    color: 'var(--text-secondary)',
                    fontWeight: '500'
                  }}>
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

                {/* Аватар */}
                <Form.Item label="Аватар">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Avatar
                      key={avatarKey}
                      size={80}
                      src={avatarFile ? URL.createObjectURL(avatarFile) : (avatarError ? null : avatarUrl)}
                      icon={<UserOutlined />}
                      onError={() => setAvatarError(true)}
                      style={{
                        background: (avatarFile || (avatarUrl && !avatarError)) ? 'transparent' : 'var(--primary-gradient)',
                        boxShadow: 'var(--shadow-small)',
                        border: '2px solid rgba(255, 255, 255, 0.8)'
                      }}
                    />
                    <div>
                      <Upload
                        name="avatar"
                        beforeUpload={(file) => {
                          const isImage = file.type.startsWith('image/');
                          if (!isImage) {
                            message.error('Можно загружать только изображения!');
                            return false;
                          }
                          const isLt2M = file.size / 1024 / 1024 < 2;
                          if (!isLt2M) {
                            message.error('Размер файла должен быть меньше 2MB!');
                            return false;
                          }

                          // Создаем новый File объект с правильными данными
                          const newFile = new File([file], file.name, { type: file.type });
                          setAvatarFile(newFile);
                          // Не устанавливаем в форму, так как файлы не передаются через форму
                          message.success('Аватар выбран! Нажмите "Сохранить изменения" для загрузки.');
                          return false; // Предотвращаем автоматическую загрузку
                        }}
                        showUploadList={false}
                      >
                        <Button icon={<UploadOutlined />}>
                          {currentStudent?.avatar_url ? 'Изменить аватар' : 'Загрузить аватар'}
                        </Button>
                      </Upload>
                      {(currentStudent?.avatar_url || avatarFile) && (
                        <Button
                          type="text"
                          danger
                          size="small"
                          onClick={() => {
                            setAvatarFile(null);
                            // Устанавливаем специальное значение для удаления
                            form.setFieldsValue({ avatar: 'DELETE' });
                            message.success('Аватар будет удален после сохранения');
                          }}
                          style={{ marginLeft: '8px' }}
                        >
                          Удалить
                        </Button>
                      )}
                    </div>
                  </div>
                </Form.Item>

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
                      label="Учебное заведение"
                      rules={[{ required: true, message: 'Выберите учебное заведение' }]}
                    >
                      <Select placeholder="Выберите учебное заведение">
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

                {/* Резюме */}
                <Form.Item
                  name="resume"
                  label="Резюме"
                >
                  <div>
                    {/* Показываем уже загруженное резюме */}
                    {currentStudent.resume && !resumeFile && (
                      <div style={{ marginBottom: '16px', padding: '12px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #e6f7ff' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <FileOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                            <div>
                              <div style={{ fontWeight: '500', color: '#1890ff' }}>Резюме загружено</div>
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                {currentStudent.resume.split('/').pop()}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <Button
                              type="link"
                              icon={<FileOutlined />}
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = currentStudent.resume;
                                link.download = 'resume.pdf';
                                link.target = '_blank';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                            >
                              Скачать
                            </Button>
                            <Button
                              type="link"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => {
                                // Устанавливаем пустое значение для удаления
                                form.setFieldsValue({ resume: null });
                                setResumeFile(null);
                              }}
                            >
                              Удалить
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Показываем новый выбранный файл */}
                    {resumeFile && (
                      <div style={{ marginBottom: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <FileOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                            <span style={{ fontWeight: '500' }}>{resumeFile.name}</span>
                            <span style={{ marginLeft: '8px', color: '#666', fontSize: '12px' }}>
                              ({(resumeFile.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => {
                              setResumeFile(null);
                              form.setFieldsValue({ resume: null });
                            }}
                          >
                            Удалить
                          </Button>
                        </div>
                      </div>
                    )}

                    <Upload
                      name="resume"
                      beforeUpload={(file) => {
                        const isPdf = file.type === 'application/pdf';
                        const isDoc = file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                        if (!isPdf && !isDoc) {
                          message.error('Можно загружать только PDF или DOC файлы!');
                          return false;
                        }
                        const isLt5M = file.size / 1024 / 1024 < 5;
                        if (!isLt5M) {
                          message.error('Размер файла должен быть меньше 5MB!');
                          return false;
                        }

                        // Создаем новый File объект с правильными данными
                        const newFile = new File([file], file.name, { type: file.type });
                        setResumeFile(newFile);
                        form.setFieldsValue({ resume: newFile });
                        return false; // Предотвращаем автоматическую загрузку
                      }}
                      showUploadList={false}
                    >
                      <Button icon={<FileOutlined />}>
                        {resumeFile ? 'Изменить резюме' : (currentStudent.resume ? 'Заменить резюме' : 'Загрузить резюме')}
                      </Button>
                    </Upload>
                  </div>
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
                          background: 'var(--primary-gradient)',
                          border: 'none',
                          borderRadius: 'var(--border-radius)',
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
                          background: 'var(--primary-gradient)',
                          border: 'none',
                          borderRadius: 'var(--border-radius)',
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
                        borderRadius: 'var(--border-radius)',
                        height: '52px',
                        paddingLeft: '32px',
                        paddingRight: '32px',
                        fontWeight: '600',
                        background: 'var(--primary-gradient)',
                        border: 'none',
                        boxShadow: 'var(--shadow-soft)',
                        fontSize: '16px',
                      }}
                    >
                      Сохранить изменения
                    </Button>
                    <Button
                      icon={<CloseOutlined />}
                      onClick={handleCancel}
                      size="large"
                      style={{
                        borderRadius: 'var(--border-radius)',
                        height: '52px',
                        paddingLeft: '32px',
                        paddingRight: '32px',
                        fontWeight: '600',
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid rgba(37, 99, 235, 0.2)',
                        color: 'var(--text-primary)',
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
                    key={avatarKey}
                    size={120}
                    src={avatarFile ? URL.createObjectURL(avatarFile) : (avatarError ? null : avatarUrl)}
                    icon={<UserOutlined />}
                    loading="lazy"
                    onError={() => setAvatarError(true)}
                    style={{
                      background: (avatarFile || (avatarUrl && !avatarError)) ? 'transparent' : 'var(--primary-gradient)',
                      marginBottom: '24px',
                      boxShadow: 'var(--shadow-medium)',
                      border: '4px solid rgba(255, 255, 255, 0.8)'
                    }}
                  />
                  <Title level={2} style={{
                    margin: '0 0 8px 0',
                    color: 'var(--text-primary)',
                    fontSize: '32px',
                    fontWeight: '700'
                  }}>
                    {currentStudent.user?.first_name} {currentStudent.user?.last_name}
                  </Title>
                  <Text style={{
                    fontSize: '18px',
                    color: 'var(--text-secondary)',
                    fontWeight: '500'
                  }}>
                    @{currentStudent.user?.username}
                  </Text>
                </div>

                <Row gutter={[32, 32]}>
                  <Col xs={24} lg={12}>
                    <div style={{ marginBottom: '24px' }}>
                      <Text strong style={{ color: 'var(--text-primary)', fontSize: '16px' }}>
                        <MailOutlined style={{ marginRight: '12px', color: 'var(--text-secondary)' }} />
                        Email:
                      </Text>
                      <br />
                      <Text style={{
                        fontSize: '16px',
                        marginTop: '8px',
                        display: 'block',
                        color: 'var(--text-secondary)'
                      }}>
                        {currentStudent.user?.email || 'Не указан'}
                      </Text>
                    </div>
                  </Col>
                  <Col xs={24} lg={12}>
                    <div style={{ marginBottom: '24px' }}>
                      <Text strong style={{ color: 'var(--text-primary)', fontSize: '16px' }}>
                        <PhoneOutlined style={{ marginRight: '12px', color: 'var(--text-secondary)' }} />
                        Телефон:
                      </Text>
                      <br />
                      <Text style={{
                        fontSize: '16px',
                        marginTop: '8px',
                        display: 'block',
                        color: 'var(--text-secondary)'
                      }}>
                        {currentStudent.phone || 'Не указан'}
                      </Text>
                    </div>
                  </Col>
                </Row>

                <Row gutter={[32, 32]}>
                  <Col xs={24} lg={12}>
                    <div style={{ marginBottom: '24px' }}>
                      <Text strong style={{ color: 'var(--text-primary)', fontSize: '16px' }}>
                        <BookOutlined style={{ marginRight: '12px', color: 'var(--text-secondary)' }} />
                        Учебное заведение:
                      </Text>
                      <br />
                      <Text style={{
                        fontSize: '16px',
                        marginTop: '8px',
                        display: 'block',
                        color: 'var(--text-secondary)'
                      }}>
                        {currentStudent.university_name || 'Не указан'}
                      </Text>
                    </div>
                  </Col>
                  <Col xs={24} lg={12}>
                    <div style={{ marginBottom: '24px' }}>
                      <Text strong style={{ color: 'var(--text-primary)', fontSize: '16px' }}>
                        Курс:
                      </Text>
                      <br />
                      <Text style={{
                        fontSize: '16px',
                        marginTop: '8px',
                        display: 'block',
                        color: 'var(--text-secondary)'
                      }}>
                        {currentStudent.course ? `${currentStudent.course} курс` : 'Не указан'}
                      </Text>
                    </div>
                  </Col>
                </Row>

                {currentStudent.specialization && (
                  <div style={{ marginBottom: '24px' }}>
                    <Text strong style={{ color: 'var(--text-primary)', fontSize: '16px' }}>
                      Специализация:
                    </Text>
                    <br />
                    <Text style={{
                      fontSize: '16px',
                      marginTop: '8px',
                      display: 'block',
                      color: 'var(--text-secondary)'
                    }}>
                      {currentStudent.specialization}
                    </Text>
                  </div>
                )}

                {currentStudent.bio && (
                  <div style={{ marginBottom: '24px' }}>
                    <Text strong style={{ color: 'var(--text-primary)', fontSize: '16px' }}>
                      О себе:
                    </Text>
                    <br />
                    <Paragraph style={{
                      marginTop: '8px',
                      fontSize: '16px',
                      lineHeight: '1.6',
                      color: 'var(--text-secondary)'
                    }}>
                      {currentStudent.bio}
                    </Paragraph>
                  </div>
                )}

                {/* Резюме */}
                {currentStudent.resume && (
                  <div style={{ marginBottom: '24px' }}>
                    <Text strong style={{ color: 'var(--text-primary)', fontSize: '16px' }}>
                      Резюме:
                    </Text>
                    <br />
                    <div style={{ marginTop: '8px' }}>
                      <Button
                        type="primary"
                        icon={<FileOutlined />}
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = currentStudent.resume;
                          link.download = 'resume.pdf';
                          link.target = '_blank';
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        style={{
                          background: 'var(--primary-gradient)',
                          border: 'none',
                          borderRadius: 'var(--border-radius)',
                          height: '40px',
                          fontSize: '14px',
                          fontWeight: '500',
                        }}
                      >
                        Скачать резюме
                      </Button>
                    </div>
                  </div>
                )}

                {currentStudent.skills && currentStudent.skills.length > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <Text strong style={{ color: 'var(--text-primary)', fontSize: '16px' }}>
                      Навыки:
                    </Text>
                    <br />
                    <div style={{ marginTop: '8px' }}>
                      {currentStudent.skills.map((skill, index) => (
                        <Tag key={index} style={{
                          marginBottom: '8px',
                          padding: '4px 12px',
                          fontSize: '14px',
                          borderRadius: 'var(--border-radius)',
                          backgroundColor: 'rgba(37, 99, 235, 0.08)',
                          color: '#2563eb',
                          border: '1px solid rgba(37, 99, 235, 0.15)',
                          fontWeight: '500'
                        }}>
                          {skill}
                        </Tag>
                      ))}
                    </div>
                  </div>
                )}

                {currentStudent.interests && currentStudent.interests.length > 0 && (
                  <div style={{ marginBottom: '32px' }}>
                    <Text strong style={{ color: 'var(--text-primary)', fontSize: '16px' }}>
                      Интересы:
                    </Text>
                    <br />
                    <div style={{ marginTop: '8px' }}>
                      {currentStudent.interests.map((interest, index) => (
                        <Tag key={index} style={{
                          marginBottom: '8px',
                          padding: '4px 12px',
                          fontSize: '14px',
                          borderRadius: 'var(--border-radius)',
                          backgroundColor: 'rgba(16, 185, 129, 0.08)',
                          color: '#10b981',
                          border: '1px solid rgba(16, 185, 129, 0.15)',
                          fontWeight: '500'
                        }}>
                          {interest}
                        </Tag>
                      ))}
                    </div>
                  </div>
                )}

                <Divider style={{ margin: '32px 0' }} />

                <div style={{ textAlign: 'center' }}>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={handleEdit}
                    size="large"
                    style={{
                      borderRadius: 'var(--border-radius)',
                      height: '52px',
                      paddingLeft: '32px',
                      paddingRight: '32px',
                      fontWeight: '600',
                      background: 'var(--primary-gradient)',
                      border: 'none',
                      boxShadow: 'var(--shadow-soft)',
                      fontSize: '16px',
                    }}
                  >
                    Редактировать профиль
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </Content>
    </Layout>
  );
}
