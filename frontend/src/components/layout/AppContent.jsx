import React, { useState, useEffect } from 'react';
import { Layout, message, Spin, Typography } from 'antd';
import SearchFilters from '../SearchFilters';
import InternshipTable from '../InternshipTable';
import { companiesAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Paragraph } = Typography;

const contentStyle = {
  minHeight: 'calc(100vh - 80px)',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  padding: '40px 24px',
  position: 'relative'
};

export default function AppContent() {
  const { student } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({});
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedTechs, setSelectedTechs] = useState([]);
  const [userInteractedWithUniversity, setUserInteractedWithUniversity] = useState(false);

  // Загрузка данных
  const fetchCompanies = async (params = {}) => {
    setLoading(true);
    try {
      const response = await companiesAPI.getCompaniesWithInternships(params);
      setCompanies(response || []);
    } catch (error) {
      message.error('Ошибка при загрузке данных');
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  // Устанавливаем значение по умолчанию для учебного заведения из профиля пользователя
  useEffect(() => {
    if (student && student.university && !selectedUniversity && !userInteractedWithUniversity) {
      setSelectedUniversity(student.university);
      // Автоматически применяем фильтр с учебным заведением пользователя
      const params = { university: student.university };
      setSearchParams(params);
    }
  }, [student, selectedUniversity, userInteractedWithUniversity]);

  // Загрузка данных при изменении параметров поиска
  useEffect(() => {
    fetchCompanies(searchParams);
  }, [searchParams]);

  // Обработчик поиска
  const handleSearch = (params) => {
    setSearchParams(params);
  };

  // Обработчик изменения университета
  const handleUniversityChange = (value) => {
    setSelectedUniversity(value);
    setUserInteractedWithUniversity(true);
  };

  // Обработчик сброса фильтров
  const handleReset = () => {
    setSearchParams({});
    setSelectedLocation('');
    setSelectedUniversity('');
    setSelectedTechs([]);
    setUserInteractedWithUniversity(false);
    fetchCompanies();
  };

  return (
    <Layout.Content style={contentStyle}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '48px',
          padding: '60px 0',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
          borderRadius: '24px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <Title 
            level={1} 
            style={{ 
              margin: 0, 
              fontSize: '48px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: '1.2',
              letterSpacing: '-1px'
            }}
          >
            Найди свою практику мечты
          </Title>
          <Paragraph 
            style={{ 
              margin: '24px 0 0 0', 
              fontSize: '20px', 
              color: '#4a5568',
              fontWeight: '500',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: '1.6'
            }}
          >
            Соединяем талантливых студентов с ведущими IT-компаниями
          </Paragraph>
        </div>
        
        <SearchFilters
          onSearch={handleSearch}
          onReset={handleReset}
          loading={loading}
          selectedLocation={selectedLocation}
          selectedUniversity={selectedUniversity}
          selectedTechs={selectedTechs}
          onLocationChange={setSelectedLocation}
          onUniversityChange={handleUniversityChange}
          onTechChange={setSelectedTechs}
        />
        
        <Spin spinning={loading}>
          <InternshipTable
            data={companies}
            loading={loading}
            selectedTechs={selectedTechs}
          />
        </Spin>
      </div>
    </Layout.Content>
  );
}