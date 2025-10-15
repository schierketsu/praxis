import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, message, Typography, Row, Col, Spin } from 'antd';
import { SaveOutlined, CloseOutlined, CalendarOutlined, EnvironmentOutlined, LoadingOutlined } from '@ant-design/icons';
import { companiesAPI, internshipsAPI, applicationsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

// Вспомогательная функция для безопасного форматирования даты
const formatDate = (dateString) => {
  if (!dateString) return new Date().toISOString().split('T')[0];
  try {
    return dateString.split('T')[0];
  } catch (error) {
    console.warn('Ошибка форматирования даты:', error);
    return new Date().toISOString().split('T')[0];
  }
};

export default function ApplicationForm({ onSave, onCancel, loading, preselectedCompany }) {
  const { user, student } = useAuth();
  const [form] = Form.useForm();
  const [companies, setCompanies] = useState([]);
  const [internships, setInternships] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hasUsedPreselectedCompany, setHasUsedPreselectedCompany] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Сбрасываем флаг при изменении предзаполненной компании
  useEffect(() => {
    if (preselectedCompany) {
      setHasUsedPreselectedCompany(false);
    }
  }, [preselectedCompany]);

  // Предзаполняем компанию, если она передана и еще не использовалась
  useEffect(() => {
    if (preselectedCompany && companies.length > 0 && !hasUsedPreselectedCompany) {
      const companyId = preselectedCompany.id;
      form.setFieldsValue({ company: companyId });
      setSelectedCompany(companyId);
      handleCompanyChange(companyId);
      setHasUsedPreselectedCompany(true);
    }
  }, [preselectedCompany, companies, form, hasUsedPreselectedCompany]);

  const fetchCompanies = async () => {
    setLoadingData(true);
    try {
      const response = await companiesAPI.getCompanies();
      setCompanies(response.results || []);
    } catch (error) {
      console.error('Ошибка загрузки компаний:', error);
      message.error('Ошибка при загрузке компаний');
    } finally {
      setLoadingData(false);
    }
  };

  const handleCompanyChange = async (companyId) => {
    setSelectedCompany(companyId);
    if (companyId) {
      try {
        const response = await internshipsAPI.getInternships({ company: companyId });
        setInternships(response.results || []);
      } catch (error) {
        console.error('Ошибка загрузки практик:', error);
        message.error('Ошибка при загрузке практик компании');
      }
    } else {
      setInternships([]);
    }
  };

  const clearForm = () => {
    form.resetFields();
    setSelectedCompany(null);
    setInternships([]);
    setHasUsedPreselectedCompany(true);
  };

  const handleCancel = () => {
    clearForm();
    onCancel();
  };

  const handleSubmit = async (values) => {
    if (submitting) return; // Предотвращаем повторную отправку
    
    setSubmitting(true);
    
    try {
      // Проверяем аутентификацию
      if (!user || !student) {
        message.error('Необходимо войти в систему для создания заявки');
        return;
      }
      
      // Оптимизированный запрос с минимальными данными
      const response = await applicationsAPI.createApplication({
        internship: values.internship,
        comment: values.comment
      });
      
      // Получаем данные компании и практики из локального состояния
      const selectedCompanyData = companies.find(c => c.id === values.company);
      const selectedInternship = internships.find(i => i.id === values.internship);
      
      // Создаем заявку с локальными данными для быстрого отображения
      const newApplication = {
        id: response.id,
        company: selectedCompanyData?.name || response.company_name || 'Загрузка...',
        position: selectedInternship?.position || response.position_name || 'Загрузка...',
        status: response.status || 'pending',
        appliedDate: formatDate(response.applied_date || response.created_at || new Date().toISOString()),
        description: values.comment || ''
      };
      
      message.success('Заявка успешно создана!');
      clearForm();
      onSave(newApplication);
    } catch (error) {
      console.error('Ошибка создания заявки:', error);
      message.error(`Ошибка при создании заявки: ${error.response?.data?.detail || error.message || 'Неизвестная ошибка'}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '24px', position: 'relative' }}>
      {/* Индикатор загрузки при отправке */}
      {submitting && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          borderRadius: '12px'
        }}>
          <Spin size="large" />
          <Text style={{ marginTop: '16px', fontSize: '16px', fontWeight: '600' }}>
            Отправляем заявку...
          </Text>
        </div>
      )}
      
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <Title level={3} style={{ margin: 0, color: '#2d3748' }}>
          Новая заявка
        </Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          Заполните форму для подачи заявки на практику 
          
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
              name="company"
              label="Компания"
              rules={[{ required: true, message: 'Выберите компанию' }]}
            >
              <Select
                placeholder="Выберите компанию"
                loading={loadingData}
                onChange={handleCompanyChange}
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {companies.map(company => (
                  <Option key={company.id} value={company.id}>
                    {company.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="internship"
              label="Практика"
              rules={[{ required: true, message: 'Выберите практику' }]}
            >
              <Select
                placeholder="Выберите практику"
                disabled={!selectedCompany}
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                optionLabelProp="label"
              >
                {internships.map(internship => (
                  <Option 
                    key={internship.id} 
                    value={internship.id}
                    label={internship.position}
                  >
                    <div style={{ padding: '4px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
                        <Text strong style={{ fontSize: '14px' }}>
                          {internship.position}
                        </Text>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#999' }}>
                        {internship.location && (
                          <span>
                            <EnvironmentOutlined style={{ marginRight: '4px' }} />
                            {internship.location}
                          </span>
                        )}
                        {internship.start_date && internship.end_date && (
                          <span>
                            <CalendarOutlined style={{ marginRight: '4px' }} />
                            {new Date(internship.start_date).toLocaleDateString()} - {new Date(internship.end_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="comment"
          label="Комментарий"
          rules={[{ required: true, message: 'Введите комментарий' }]}
        >
          <TextArea
            rows={4}
            placeholder="Расскажите о себе, своих навыках и мотивации для этой практики..."
            maxLength={500}
            showCount
          />
        </Form.Item>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: '12px',
          marginTop: '24px',
          paddingTop: '24px',
          borderTop: '1px solid #f0f0f0'
        }}>
          <Button
            icon={<CloseOutlined />}
            onClick={handleCancel}
            size="large"
            style={{
              borderRadius: '12px',
              height: '48px',
              fontWeight: '600'
            }}
          >
            Отмена
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={submitting ? <LoadingOutlined /> : <SaveOutlined />}
            loading={submitting}
            disabled={submitting}
            size="large"
            style={{
              borderRadius: '12px',
              height: '48px',
              fontWeight: '600',
              background: submitting ? 'rgba(102, 126, 234, 0.7)' : 'var(--primary-gradient)',
              border: 'none',
              boxShadow: submitting ? 'none' : 'var(--shadow-soft)',
              transition: 'all 0.3s ease',
              opacity: submitting ? 0.8 : 1
            }}
          >
            {submitting ? 'Отправляем...' : 'Создать заявку'}
          </Button>
        </div>
      </Form>
    </div>
  );
}
