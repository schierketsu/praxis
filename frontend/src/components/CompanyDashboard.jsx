import React, { useState, useEffect } from 'react';
import { Layout, Card, Typography, Button, Space, Tag, Row, Col, Avatar, Divider, message, Form, Input, Select, Upload, Tabs, Table, Modal } from 'antd';
import { UserOutlined, EditOutlined, MailOutlined, PhoneOutlined, BookOutlined, ArrowLeftOutlined, SaveOutlined, CloseOutlined, PlusOutlined, UploadOutlined, FileOutlined, DeleteOutlined, GlobalOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { universitiesAPI, companyInternshipsAPI } from '../services/api';
import AppHeader from './layout/AppHeader';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

export default function CompanyDashboard() {
    const { user, company, logout, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCompany, setCurrentCompany] = useState(company);
    const [form] = Form.useForm();
    const [universities, setUniversities] = useState([]);
    const [logoFile, setLogoFile] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');
    const [internships, setInternships] = useState([]);
    const [internshipModalVisible, setInternshipModalVisible] = useState(false);
    const [editingInternship, setEditingInternship] = useState(null);
    const [internshipForm] = Form.useForm();
    const [applications, setApplications] = useState([]);
    const [applicationsLoading, setApplicationsLoading] = useState(false);
    const [applicationModalVisible, setApplicationModalVisible] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);

    // Обновляем данные компании при изменении
    useEffect(() => {
        setCurrentCompany(company);
    }, [company]);


    // Обработка нажатия Escape для закрытия модального окна
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && applicationModalVisible) {
                setApplicationModalVisible(false);
                setSelectedApplication(null);
                setApplicationsLoading(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [applicationModalVisible]);

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

    // Загружаем практики компании
    useEffect(() => {
        const fetchInternships = async () => {
            try {
                const response = await companyInternshipsAPI.getInternships();
                setInternships(response);
            } catch (error) {
                console.error('Ошибка загрузки практик:', error);
            }
        };
        if (currentCompany) {
            fetchInternships();
        }
    }, [currentCompany]);

    // Загружаем заявки компании
    useEffect(() => {
        const fetchApplications = async () => {
            setApplicationsLoading(true);
            try {
                const response = await companyInternshipsAPI.getApplications();
                setApplications(response);
            } catch (error) {
                console.error('Ошибка загрузки заявок:', error);
                message.error('Ошибка при загрузке заявок');
            } finally {
                setApplicationsLoading(false);
            }
        };
        if (currentCompany) {
            fetchApplications();
        }
    }, [currentCompany]);

    // Инициализируем форму данными компании
    useEffect(() => {
        if (currentCompany && isEditing) {
            form.setFieldsValue({
                name: currentCompany.name,
                description: currentCompany.description,
                website: currentCompany.website,
                address: currentCompany.address,
                latitude: currentCompany.latitude,
                longitude: currentCompany.longitude,
                email: currentCompany.email
            });
        }
    }, [currentCompany, isEditing, form]);

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
                if (key !== 'logo' && values[key] !== undefined) {
                    formData.append(key, values[key]);
                }
            });

            // Добавляем файл логотипа, если он есть
            if (logoFile && logoFile instanceof File) {
                formData.append('logo', logoFile);
            } else if (values.logo === null) {
                // Если пользователь удалил логотип, отправляем пустое значение
                formData.append('logo', '');
            }

            const response = await updateProfile(formData);
            setCurrentCompany(response.company);
            setIsEditing(false);

            // Очищаем предпросмотр после успешной загрузки
            setLogoFile(null);

            message.success('Профиль компании обновлен успешно!');
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
        setLogoFile(null);

        // Сбрасываем форму к исходным значениям
        if (currentCompany) {
            form.setFieldsValue({
                name: currentCompany.name,
                description: currentCompany.description,
                website: currentCompany.website,
                address: currentCompany.address,
                latitude: currentCompany.latitude,
                longitude: currentCompany.longitude,
                email: currentCompany.email
            });
        }
    };

    // Функции для управления практиками
    const handleCreateInternship = () => {
        setEditingInternship(null);
        internshipForm.resetFields();
        setInternshipModalVisible(true);
    };

    const handleEditInternship = (internship) => {
        setEditingInternship(internship);
        internshipForm.setFieldsValue({
            position: internship.position,
            description: internship.description,
            location: internship.location,
            requirements: internship.requirements,
            tech_stack: internship.tech_stack,
            available_positions: internship.available_positions,
            university_ids: internship.universities?.map(u => u.id) || []
        });
        setInternshipModalVisible(true);
    };

    const handleDeleteInternship = async (internshipId) => {
        try {
            await companyInternshipsAPI.deleteInternship(internshipId);
            setInternships(internships.filter(i => i.id !== internshipId));
            message.success('Практика удалена успешно');
        } catch (error) {
            message.error('Ошибка при удалении практики');
        }
    };

    const handleInternshipSubmit = async (values) => {
        try {
            if (editingInternship) {
                await companyInternshipsAPI.updateInternship(editingInternship.id, values);
                setInternships(internships.map(i => i.id === editingInternship.id ? { ...i, ...values } : i));
                message.success('Практика обновлена успешно');
            } else {
                const newInternship = await companyInternshipsAPI.createInternship(values);
                setInternships([...internships, newInternship]);
                message.success('Практика создана успешно');
            }
            setInternshipModalVisible(false);
            internshipForm.resetFields();
        } catch (error) {
            console.error('Ошибка при сохранении практики:', error);
            if (error.response?.data?.error) {
                message.error(error.response.data.error);
            } else if (error.response?.data) {
                const errors = error.response.data;
                if (typeof errors === 'object') {
                    const firstError = Object.keys(errors)[0];
                    if (firstError && errors[firstError]) {
                        if (Array.isArray(errors[firstError])) {
                            message.error(`${firstError}: ${errors[firstError].join(', ')}`);
                        } else {
                            message.error(`${firstError}: ${errors[firstError]}`);
                        }
                    } else {
                        message.error('Ошибка при сохранении практики');
                    }
                }
            } else {
                message.error('Ошибка при сохранении практики');
            }
        }
    };

    // Функции для работы с заявками
    const handleViewApplication = async (applicationId) => {
        try {
            setApplicationsLoading(true);
            setApplicationModalVisible(true); // Открываем модальное окно сразу
            const application = await companyInternshipsAPI.getApplicationDetail(applicationId);
            setSelectedApplication(application);
        } catch (error) {
            console.error('Ошибка при загрузке заявки:', error);
            message.error('Ошибка при загрузке заявки');
            setApplicationModalVisible(false); // Закрываем модальное окно при ошибке
        } finally {
            setApplicationsLoading(false);
        }
    };

    const handleAcceptApplication = async (applicationId) => {
        try {
            await companyInternshipsAPI.updateApplicationStatus(applicationId, 'accepted');
            setApplications(applications.map(app =>
                app.id === applicationId ? { ...app, status: 'accepted' } : app
            ));
            message.success('Заявка принята');
        } catch (error) {
            message.error('Ошибка при принятии заявки');
        }
    };

    const handleRejectApplication = async (applicationId) => {
        try {
            await companyInternshipsAPI.updateApplicationStatus(applicationId, 'rejected');
            setApplications(applications.map(app =>
                app.id === applicationId ? { ...app, status: 'rejected' } : app
            ));
            message.success('Заявка отклонена');
        } catch (error) {
            message.error('Ошибка при отклонении заявки');
        }
    };

    if (!currentCompany) {
        return (
            <Layout style={{ minHeight: '100vh', background: '#F5F5F5' }}>
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
                        background: 'rgb(255, 255, 255)',
                        borderRadius: 'var(--border-radius-lg)',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        transition: 'none !important',
                        transform: 'none !important',
                        animation: 'none !important',
                        willChange: 'auto'
                    }}
                        hoverable={false}>
                        <Title level={3} style={{ color: 'var(--text-primary)' }}>Профиль не найден</Title>
                        <Text style={{ color: 'var(--text-secondary)' }}>Данные компании не загружены</Text>
                    </Card>
                </Content>
            </Layout>
        );
    }

    return (
        <Layout style={{ minHeight: '100vh', background: '#F5F5F5' }}>
            <AppHeader />
            <Content style={{ padding: '40px 24px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {/* Кнопка назад */}
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/')}
                        size="large"
                        style={{
                            marginBottom: '32px',
                            borderRadius: 'var(--border-radius)',
                            height: '48px',
                            fontWeight: '600',
                            background: 'rgba(255, 255, 255, 0.9)',
                            border: '1px solid rgba(37, 99, 235, 0.2)',
                            color: 'var(--text-primary)',
                            boxShadow: 'var(--shadow-soft)',
                            transition: 'var(--transition)'
                        }}
                    >
                        Назад к главной
                    </Button>

                    {/* Заголовок */}
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <Title level={1} style={{
                            margin: '0 0 16px 0',
                            fontSize: '48px',
                            fontWeight: '800',
                            color: 'black',
                            lineHeight: '1.1',
                            textShadow: 'none',
                            letterSpacing: '-0.02em'
                        }}>
                            Панель управления
                        </Title>
                        <Text style={{
                            fontSize: '18px',
                            color: 'var(--text-secondary)',
                            fontWeight: '500'
                        }}>
                            Управляйте информацией о компании и практиках
                        </Text>
                    </div>

                    {/* Основная информация с вкладками */}
                    <Card
                        style={{
                            marginBottom: '32px',
                            borderRadius: 'var(--border-radius-lg)',
                            background: 'rgb(255, 255, 255)',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                            overflow: 'hidden',
                            transition: 'none !important',
                            transform: 'none !important',
                            animation: 'none !important',
                            willChange: 'auto'
                        }}
                        hoverable={false}
                        styles={{
                            body: {
                                padding: '0'
                            }
                        }}
                    >
                        <Tabs
                            activeKey={activeTab}
                            onChange={setActiveTab}
                            centered
                            size="large"
                            style={{
                                width: '100%'
                            }}
                            tabBarStyle={{
                                marginBottom: '0',
                                borderBottom: '1px solid #f0f0f0',
                                padding: '0 24px',
                                background: '#fafafa'
                            }}
                            items={[
                                {
                                    key: 'profile',
                                    label: 'Профиль компании',
                                    children: (
                                        <div style={{ padding: '48px' }}>
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
                                                            Редактирование профиля компании
                                                        </Title>
                                                        <Text style={{
                                                            fontSize: '16px',
                                                            color: 'var(--text-secondary)',
                                                            fontWeight: '500'
                                                        }}>
                                                            Измените информацию о компании
                                                        </Text>
                                                    </div>

                                                    <Form.Item
                                                        name="name"
                                                        label="Название компании"
                                                        rules={[{ required: true, message: 'Введите название компании' }]}
                                                    >
                                                        <Input prefix={<UserOutlined />} placeholder="Название компании" />
                                                    </Form.Item>

                                                    <Form.Item
                                                        name="description"
                                                        label="Описание компании"
                                                    >
                                                        <TextArea
                                                            rows={4}
                                                            placeholder="Расскажите о деятельности компании..."
                                                        />
                                                    </Form.Item>

                                                    <Row gutter={[16, 0]}>
                                                        <Col xs={24} sm={12}>
                                                            <Form.Item
                                                                name="website"
                                                                label="Веб-сайт"
                                                            >
                                                                <Input prefix={<GlobalOutlined />} placeholder="https://example.com" />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col xs={24} sm={12}>
                                                            <Form.Item
                                                                name="email"
                                                                label="Email"
                                                                rules={[
                                                                    { type: 'email', message: 'Некорректный email' }
                                                                ]}
                                                            >
                                                                <Input prefix={<MailOutlined />} placeholder="email@company.com" />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>

                                                    <Form.Item
                                                        name="address"
                                                        label="Адрес"
                                                    >
                                                        <Input prefix={<EnvironmentOutlined />} placeholder="Адрес компании" />
                                                    </Form.Item>

                                                    <Row gutter={[16, 0]}>
                                                        <Col xs={24} sm={12}>
                                                            <Form.Item
                                                                name="latitude"
                                                                label="Широта"
                                                            >
                                                                <Input placeholder="56.11427957912669" />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col xs={24} sm={12}>
                                                            <Form.Item
                                                                name="longitude"
                                                                label="Долгота"
                                                            >
                                                                <Input placeholder="47.257093448374484" />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>

                                                    {/* Логотип */}
                                                    <Form.Item
                                                        name="logo"
                                                        label="Логотип компании"
                                                    >
                                                        <div>
                                                            {/* Показываем уже загруженный логотип */}
                                                            {currentCompany.logo && !logoFile && (
                                                                <div style={{ marginBottom: '16px', padding: '12px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #e6f7ff' }}>
                                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                            <FileOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                                                                            <div>
                                                                                <div style={{ fontWeight: '500', color: '#1890ff' }}>Логотип загружен</div>
                                                                                <div style={{ fontSize: '12px', color: '#666' }}>
                                                                                    {currentCompany.logo.split('/').pop()}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                                            <Button
                                                                                type="link"
                                                                                icon={<FileOutlined />}
                                                                                onClick={() => {
                                                                                    const link = document.createElement('a');
                                                                                    link.href = currentCompany.logo;
                                                                                    link.download = 'logo.png';
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
                                                                                    form.setFieldsValue({ logo: null });
                                                                                    setLogoFile(null);
                                                                                }}
                                                                            >
                                                                                Удалить
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Показываем новый выбранный файл */}
                                                            {logoFile && (
                                                                <div style={{ marginBottom: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '8px' }}>
                                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                            <FileOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                                                                            <span style={{ fontWeight: '500' }}>{logoFile.name}</span>
                                                                            <span style={{ marginLeft: '8px', color: '#666', fontSize: '12px' }}>
                                                                                ({(logoFile.size / 1024 / 1024).toFixed(2)} MB)
                                                                            </span>
                                                                        </div>
                                                                        <Button
                                                                            type="link"
                                                                            danger
                                                                            icon={<DeleteOutlined />}
                                                                            onClick={() => {
                                                                                setLogoFile(null);
                                                                                form.setFieldsValue({ logo: null });
                                                                            }}
                                                                        >
                                                                            Удалить
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <Upload
                                                                name="logo"
                                                                beforeUpload={(file) => {
                                                                    const isImage = file.type.startsWith('image/');
                                                                    if (!isImage) {
                                                                        message.error('Можно загружать только изображения!');
                                                                        return false;
                                                                    }
                                                                    const isLt5M = file.size / 1024 / 1024 < 5;
                                                                    if (!isLt5M) {
                                                                        message.error('Размер файла должен быть меньше 5MB!');
                                                                        return false;
                                                                    }

                                                                    // Создаем новый File объект с правильными данными
                                                                    const newFile = new File([file], file.name, { type: file.type });
                                                                    setLogoFile(newFile);
                                                                    form.setFieldsValue({ logo: newFile });
                                                                    return false; // Предотвращаем автоматическую загрузку
                                                                }}
                                                                showUploadList={false}
                                                            >
                                                                <Button icon={<FileOutlined />}>
                                                                    {logoFile ? 'Изменить логотип' : (currentCompany.logo ? 'Заменить логотип' : 'Загрузить логотип')}
                                                                </Button>
                                                            </Upload>
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
                                                                    transition: 'var(--transition)'
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
                                                                    transition: 'var(--transition)'
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
                                                            src={currentCompany.logo}
                                                            icon={<UserOutlined />}
                                                            style={{
                                                                background: 'var(--primary-gradient)',
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
                                                            {currentCompany.name}
                                                        </Title>
                                                        <Text style={{
                                                            fontSize: '18px',
                                                            color: 'var(--text-secondary)',
                                                            fontWeight: '500'
                                                        }}>
                                                            {currentCompany.user?.first_name} {currentCompany.user?.last_name}
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
                                                                    {currentCompany.email || 'Не указан'}
                                                                </Text>
                                                            </div>
                                                        </Col>
                                                        <Col xs={24} lg={12}>
                                                            <div style={{ marginBottom: '24px' }}>
                                                                <Text strong style={{ color: 'var(--text-primary)', fontSize: '16px' }}>
                                                                    <GlobalOutlined style={{ marginRight: '12px', color: 'var(--text-secondary)' }} />
                                                                    Веб-сайт:
                                                                </Text>
                                                                <br />
                                                                <Text style={{
                                                                    fontSize: '16px',
                                                                    marginTop: '8px',
                                                                    display: 'block',
                                                                    color: 'var(--text-secondary)'
                                                                }}>
                                                                    {currentCompany.website || 'Не указан'}
                                                                </Text>
                                                            </div>
                                                        </Col>
                                                    </Row>

                                                    {currentCompany.address && (
                                                        <div style={{ marginBottom: '24px' }}>
                                                            <Text strong style={{ color: 'var(--text-primary)', fontSize: '16px' }}>
                                                                <EnvironmentOutlined style={{ marginRight: '12px', color: 'var(--text-secondary)' }} />
                                                                Адрес:
                                                            </Text>
                                                            <br />
                                                            <Text style={{
                                                                fontSize: '16px',
                                                                marginTop: '8px',
                                                                display: 'block',
                                                                color: 'var(--text-secondary)'
                                                            }}>
                                                                {currentCompany.address}
                                                            </Text>
                                                        </div>
                                                    )}

                                                    {currentCompany.description && (
                                                        <div style={{ marginBottom: '24px' }}>
                                                            <Text strong style={{ color: 'var(--text-primary)', fontSize: '16px' }}>
                                                                О компании:
                                                            </Text>
                                                            <br />
                                                            <Paragraph style={{
                                                                marginTop: '8px',
                                                                fontSize: '16px',
                                                                lineHeight: '1.6',
                                                                color: 'var(--text-secondary)'
                                                            }}>
                                                                {currentCompany.description}
                                                            </Paragraph>
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
                                                                transition: 'var(--transition)'
                                                            }}
                                                        >
                                                            Редактировать профиль
                                                        </Button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )
                                },
                                {
                                    key: 'internships',
                                    label: 'Управление практиками',
                                    children: (
                                        <div style={{ padding: '48px' }}>
                                            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Title level={3} style={{ margin: 0 }}>Практики компании</Title>
                                                <Button
                                                    type="primary"
                                                    icon={<PlusOutlined />}
                                                    onClick={handleCreateInternship}
                                                    style={{
                                                        borderRadius: 'var(--border-radius)',
                                                        height: '40px',
                                                        fontWeight: '600',
                                                        background: 'var(--primary-gradient)',
                                                        border: 'none',
                                                        boxShadow: 'var(--shadow-soft)'
                                                    }}
                                                >
                                                    Добавить практику
                                                </Button>
                                            </div>

                                            {internships.length > 0 ? (
                                                <Table
                                                    dataSource={internships}
                                                    rowKey="id"
                                                    columns={[
                                                        {
                                                            title: 'Должность',
                                                            dataIndex: 'position',
                                                            key: 'position',
                                                        },
                                                        {
                                                            title: 'Локация',
                                                            dataIndex: 'location',
                                                            key: 'location',
                                                        },
                                                        {
                                                            title: 'Технологии',
                                                            dataIndex: 'tech_stack',
                                                            key: 'tech_stack',
                                                            render: (techStack) => (
                                                                <div>
                                                                    {techStack?.slice(0, 3).map(tech => (
                                                                        <Tag key={tech} size="small">{tech}</Tag>
                                                                    ))}
                                                                    {techStack?.length > 3 && <Tag size="small">+{techStack.length - 3}</Tag>}
                                                                </div>
                                                            )
                                                        },
                                                        {
                                                            title: 'Статус',
                                                            dataIndex: 'is_active',
                                                            key: 'is_active',
                                                            render: (isActive) => (
                                                                <Tag color={isActive ? 'green' : 'red'}>
                                                                    {isActive ? 'Активна' : 'Неактивна'}
                                                                </Tag>
                                                            )
                                                        },
                                                        {
                                                            title: 'Действия',
                                                            key: 'actions',
                                                            render: (_, record) => (
                                                                <Space>
                                                                    <Button
                                                                        size="small"
                                                                        onClick={() => handleEditInternship(record)}
                                                                    >
                                                                        Редактировать
                                                                    </Button>
                                                                    <Button
                                                                        size="small"
                                                                        danger
                                                                        onClick={() => handleDeleteInternship(record.id)}
                                                                    >
                                                                        Удалить
                                                                    </Button>
                                                                </Space>
                                                            )
                                                        }
                                                    ]}
                                                />
                                            ) : (
                                                <div style={{ textAlign: 'center', padding: '40px' }}>
                                                    <Text style={{ color: 'var(--text-secondary)' }}>
                                                        У вас пока нет практик. Создайте первую практику для привлечения студентов.
                                                    </Text>
                                                </div>
                                            )}
                                        </div>
                                    )
                                },
                                {
                                    key: 'applications',
                                    label: 'Входящие заявки',
                                    children: (
                                        <div style={{ padding: '48px' }}>
                                            <div style={{ marginBottom: '24px' }}>
                                                <Title level={3} style={{ margin: 0 }}>Заявки студентов</Title>
                                                <Text type="secondary">Заявки на ваши практики</Text>
                                            </div>

                                            <Table
                                                dataSource={applications}
                                                loading={applicationsLoading}
                                                rowKey="id"
                                                columns={[
                                                    {
                                                        title: 'Студент',
                                                        dataIndex: 'student_name',
                                                        key: 'student_name',
                                                        render: (text, record) => (
                                                            <div>
                                                                <Text strong>{text}</Text>
                                                                <br />
                                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                                    {record.student_university}
                                                                </Text>
                                                            </div>
                                                        )
                                                    },
                                                    {
                                                        title: 'Практика',
                                                        dataIndex: 'internship',
                                                        key: 'internship',
                                                        render: (internship) => (
                                                            <div>
                                                                <Text strong>{internship?.position}</Text>
                                                                <br />
                                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                                    {internship?.company_name}
                                                                </Text>
                                                            </div>
                                                        )
                                                    },
                                                    {
                                                        title: 'Статус',
                                                        dataIndex: 'status',
                                                        key: 'status',
                                                        render: (status) => {
                                                            const statusConfig = {
                                                                'pending': { color: 'orange', text: 'На рассмотрении' },
                                                                'accepted': { color: 'green', text: 'Принята' },
                                                                'rejected': { color: 'red', text: 'Отклонена' }
                                                            };
                                                            const config = statusConfig[status] || { color: 'default', text: status };
                                                            return <Tag color={config.color}>{config.text}</Tag>;
                                                        }
                                                    },
                                                    {
                                                        title: 'Дата подачи',
                                                        dataIndex: 'created_at',
                                                        key: 'created_at',
                                                        render: (date) => new Date(date).toLocaleDateString('ru-RU')
                                                    },
                                                    {
                                                        title: 'Действия',
                                                        key: 'actions',
                                                        render: (_, record) => (
                                                            <Space>
                                                                <Button
                                                                    size="small"
                                                                    type="primary"
                                                                    onClick={() => handleViewApplication(record.id)}
                                                                >
                                                                    Просмотреть
                                                                </Button>
                                                                {record.status === 'pending' && (
                                                                    <>
                                                                        <Button
                                                                            size="small"
                                                                            type="primary"
                                                                            style={{ background: '#52c41a', borderColor: '#52c41a' }}
                                                                            onClick={() => handleAcceptApplication(record.id)}
                                                                        >
                                                                            Принять
                                                                        </Button>
                                                                        <Button
                                                                            size="small"
                                                                            danger
                                                                            onClick={() => handleRejectApplication(record.id)}
                                                                        >
                                                                            Отклонить
                                                                        </Button>
                                                                    </>
                                                                )}
                                                                {record.status === 'rejected' && (
                                                                    <Button
                                                                        size="small"
                                                                        type="primary"
                                                                        style={{ background: '#52c41a', borderColor: '#52c41a' }}
                                                                        onClick={() => handleAcceptApplication(record.id)}
                                                                    >
                                                                        Принять
                                                                    </Button>
                                                                )}
                                                            </Space>
                                                        )
                                                    }
                                                ]}
                                                pagination={{
                                                    pageSize: 10,
                                                    showSizeChanger: true,
                                                    showQuickJumper: true,
                                                    showTotal: (total, range) => `${range[0]}-${range[1]} из ${total} заявок`
                                                }}
                                            />
                                        </div>
                                    )
                                }
                            ]}
                        />
                    </Card>

                    {/* Модальное окно для создания/редактирования практики */}
                    <Modal
                        title={editingInternship ? 'Редактировать практику' : 'Создать практику'}
                        open={internshipModalVisible}
                        onCancel={() => {
                            setInternshipModalVisible(false);
                            internshipForm.resetFields();
                        }}
                        footer={null}
                        width={800}
                    >
                        <Form
                            form={internshipForm}
                            layout="vertical"
                            onFinish={handleInternshipSubmit}
                        >
                            <Form.Item
                                name="position"
                                label="Должность"
                                rules={[{ required: true, message: 'Введите должжность' }]}
                            >
                                <Input placeholder="Например: Frontend разработчик" />
                            </Form.Item>

                            <Form.Item
                                name="description"
                                label="Описание"
                                rules={[{ required: true, message: 'Введите описание' }]}
                            >
                                <TextArea rows={4} placeholder="Опишите, чем будет заниматься студент..." />
                            </Form.Item>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="location"
                                        label="Локация"
                                        rules={[{ required: true, message: 'Введите локацию' }]}
                                    >
                                        <Input placeholder="Например: Чебоксары" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="available_positions"
                                        label="Количество мест"
                                        rules={[{ required: true, message: 'Введите количество мест' }]}
                                    >
                                        <Input type="number" min="1" placeholder="1" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                name="requirements"
                                label="Требования"
                                rules={[{ required: true, message: 'Введите требования' }]}
                            >
                                <TextArea rows={3} placeholder="Опишите требования к кандидату..." />
                            </Form.Item>

                            <Form.Item
                                name="tech_stack"
                                label="Технологии"
                                rules={[{ required: true, message: 'Выберите технологии' }]}
                            >
                                <Select
                                    mode="tags"
                                    placeholder="Введите технологии"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>

                            <Form.Item
                                name="university_ids"
                                label="Подходящие университеты"
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Выберите университеты"
                                    style={{ width: '100%' }}
                                >
                                    {universities.map(uni => (
                                        <Option key={uni.id} value={uni.id}>
                                            {uni.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <div style={{ textAlign: 'right', marginTop: '24px' }}>
                                <Space>
                                    <Button onClick={() => setInternshipModalVisible(false)}>
                                        Отмена
                                    </Button>
                                    <Button type="primary" htmlType="submit">
                                        {editingInternship ? 'Обновить' : 'Создать'}
                                    </Button>
                                </Space>
                            </div>
                        </Form>
                    </Modal>

                    {/* Модальное окно для просмотра заявки */}
                    <Modal
                        title="Детали заявки"
                        open={applicationModalVisible}
                        onCancel={() => {
                            setApplicationModalVisible(false);
                            setSelectedApplication(null);
                            setApplicationsLoading(false);
                        }}
                        footer={null}
                        width={800}
                        maskClosable={true}
                        destroyOnHidden={true}
                        zIndex={1000}
                        centered={true}
                        forceRender={false}
                        getContainer={false}
                        mask={true}
                        keyboard={true}
                    >
                        {selectedApplication && (
                            <div>
                                {/* Основная информация */}
                                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                                    <Col span={12}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <Avatar
                                                size={60}
                                                src={selectedApplication.student_avatar_url}
                                                icon={<UserOutlined />}
                                                style={{
                                                    background: selectedApplication.student_avatar_url ? 'transparent' : 'var(--primary-gradient)',
                                                    boxShadow: 'var(--shadow-small)',
                                                    border: '2px solid rgba(255, 255, 255, 0.8)'
                                                }}
                                            />
                                            <div>
                                                <Text strong>Студент:</Text>
                                                <br />
                                                <Text>{selectedApplication.student_name}</Text>
                                                <br />
                                                <Text type="secondary">{selectedApplication.student_university}</Text>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div>
                                            <Text strong>Практика:</Text>
                                            <br />
                                            <Text>{selectedApplication.internship?.position}</Text>
                                            <br />
                                            <Text type="secondary">{selectedApplication.internship?.company_name}</Text>
                                        </div>
                                    </Col>
                                </Row>

                                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                                    <Col span={12}>
                                        <div>
                                            <Text strong>Статус:</Text>
                                            <br />
                                            <Tag color={
                                                selectedApplication.status === 'accepted' ? 'green' :
                                                    selectedApplication.status === 'rejected' ? 'red' : 'orange'
                                            }>
                                                {selectedApplication.status === 'accepted' ? 'Принята' :
                                                    selectedApplication.status === 'rejected' ? 'Отклонена' : 'На рассмотрении'}
                                            </Tag>
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div>
                                            <Text strong>Дата подачи:</Text>
                                            <br />
                                            <Text>{new Date(selectedApplication.created_at).toLocaleDateString('ru-RU')}</Text>
                                        </div>
                                    </Col>
                                </Row>

                                {/* Информация о студенте */}
                                <div style={{ marginBottom: '24px', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
                                    <Title level={4} style={{ marginBottom: '16px' }}>Информация о студенте</Title>

                                    <Row gutter={[16, 16]}>
                                        <Col span={8}>
                                            <div>
                                                <Text strong>Учебное заведение:</Text>
                                                <br />
                                                <Text>{selectedApplication.student_university || 'Не указано'}</Text>
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <div>
                                                <Text strong>Курс:</Text>
                                                <br />
                                                <Text>{selectedApplication.student_course || 'Не указан'}</Text>
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <div>
                                                <Text strong>Специализация:</Text>
                                                <br />
                                                <Text>{selectedApplication.student_specialization || 'Не указана'}</Text>
                                            </div>
                                        </Col>
                                    </Row>

                                    {selectedApplication.student_bio && (
                                        <div style={{ marginTop: '16px' }}>
                                            <Text strong>О себе:</Text>
                                            <br />
                                            <Text style={{ whiteSpace: 'pre-wrap' }}>{selectedApplication.student_bio}</Text>
                                        </div>
                                    )}

                                    {selectedApplication.student_skills && selectedApplication.student_skills.length > 0 && (
                                        <div style={{ marginTop: '16px' }}>
                                            <Text strong>Навыки:</Text>
                                            <br />
                                            <div style={{ marginTop: '8px' }}>
                                                {selectedApplication.student_skills.map((skill, index) => (
                                                    <Tag key={index} color="blue" style={{ marginBottom: '4px' }}>
                                                        {skill}
                                                    </Tag>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedApplication.student_interests && selectedApplication.student_interests.length > 0 && (
                                        <div style={{ marginTop: '16px' }}>
                                            <Text strong>Интересы:</Text>
                                            <br />
                                            <div style={{ marginTop: '8px' }}>
                                                {selectedApplication.student_interests.map((interest, index) => (
                                                    <Tag key={index} color="green" style={{ marginBottom: '4px' }}>
                                                        {interest}
                                                    </Tag>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedApplication.student_resume_url && (
                                        <div style={{ marginTop: '16px' }}>
                                            <Text strong>Резюме:</Text>
                                            <br />
                                            <Button
                                                type="link"
                                                href={selectedApplication.student_resume_url}
                                                target="_blank"
                                                style={{ padding: 0, height: 'auto' }}
                                            >
                                                <FileOutlined /> Скачать резюме
                                            </Button>
                                        </div>
                                    )}

                                    {/* Контактная информация */}
                                    <div style={{ marginTop: '16px', padding: '12px', background: selectedApplication.status === 'accepted' ? '#e6f7ff' : '#fff2e8', borderRadius: '6px', border: `1px solid ${selectedApplication.status === 'accepted' ? '#91d5ff' : '#ffd591'}` }}>
                                        <Text strong style={{ color: selectedApplication.status === 'accepted' ? '#1890ff' : '#fa8c16' }}>
                                            Контактная информация
                                        </Text>

                                        {selectedApplication.status === 'accepted' ? (
                                            <div style={{ marginTop: '8px' }}>
                                                <div style={{ marginBottom: '8px' }}>
                                                    <Text strong>Email:</Text>
                                                    <br />
                                                    <Text copyable>{selectedApplication.student?.email || 'Не указан'}</Text>
                                                </div>
                                                {selectedApplication.student?.phone && (
                                                    <div>
                                                        <Text strong>Телефон:</Text>
                                                        <br />
                                                        <Text copyable>{selectedApplication.student.phone}</Text>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div style={{ marginTop: '8px' }}>
                                                <Text type="secondary">
                                                    Вы увидите контактную информацию о студенте после одобрения его заявки
                                                </Text>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {selectedApplication.cover_letter && (
                                    <div style={{ marginBottom: '24px' }}>
                                        <Text strong>Сопроводительное письмо:</Text>
                                        <br />
                                        <Text style={{ whiteSpace: 'pre-wrap' }}>{selectedApplication.cover_letter}</Text>
                                    </div>
                                )}

                                {selectedApplication.status === 'pending' && (
                                    <div style={{ textAlign: 'right', marginTop: '24px' }}>
                                        <Space>
                                            <Button
                                                type="primary"
                                                style={{ background: '#52c41a', borderColor: '#52c41a' }}
                                                onClick={() => {
                                                    handleAcceptApplication(selectedApplication.id);
                                                    setApplicationModalVisible(false);
                                                }}
                                            >
                                                Принять заявку
                                            </Button>
                                            <Button
                                                danger
                                                onClick={() => {
                                                    handleRejectApplication(selectedApplication.id);
                                                    setApplicationModalVisible(false);
                                                }}
                                            >
                                                Отклонить заявку
                                            </Button>
                                        </Space>
                                    </div>
                                )}

                                {selectedApplication.status === 'rejected' && (
                                    <div style={{ textAlign: 'right', marginTop: '24px' }}>
                                        <Button
                                            type="primary"
                                            style={{ background: '#52c41a', borderColor: '#52c41a' }}
                                            onClick={() => {
                                                handleAcceptApplication(selectedApplication.id);
                                                setApplicationModalVisible(false);
                                            }}
                                        >
                                            Принять заявку
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </Modal>
                </div>
            </Content>
        </Layout>
    );
}
