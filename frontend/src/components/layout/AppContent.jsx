import React, { useState, useEffect } from 'react';
import { Layout, message, Spin, Typography } from 'antd';
import SearchFilters from '../SearchFilters';
import InternshipTable from '../InternshipTable';
import Hero from '../Hero';
import Features from '../Features';
import WelcomeBanner from '../WelcomeBanner';
import { companiesAPI, companyInternshipsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Paragraph } = Typography;

const contentStyle = {
  minHeight: 'calc(100vh - 80px)',
  background: 'var(--background-gradient)',
  padding: '60px 24px',
  position: 'relative',
  overflow: 'hidden'
};

export default function AppContent() {
  const { student, company } = useAuth();
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
      // Для всех пользователей (студентов и компаний) используем одинаковый API
      const response = await companiesAPI.getCompaniesWithInternships(params);
      setCompanies(response || []);
    } catch (error) {
      message.error('Ошибка при загрузке данных');
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  // Устанавливаем значение по умолчанию для учебного заведения из профиля пользователя (только для студентов)
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
    // Для всех пользователей фильтрация происходит на backend
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
      {!student && !company && (
        <>
          <WelcomeBanner />
          <Hero />
          <Features />
        </>
      )}

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>

        <div style={{ marginTop: '10px', marginBottom: '40px' }}>
          <div className="fade-in-up" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <Title
              level={2}
              style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                background: 'var(--primary-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '24px'
              }}
            >
              Начни поиск прямо сейчас
            </Title>
            <Paragraph
              style={{
                fontSize: '1.125rem',
                color: 'var(--text-secondary)',
                maxWidth: '600px',
                margin: '0 auto'
              }}
            >
              Найди подходящую практику с помощью фильтров
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
        </div>

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