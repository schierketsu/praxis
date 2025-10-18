import React, { useState, useEffect } from 'react';
import { Layout, message, Spin, Typography } from 'antd';
import SearchFilters from '../SearchFilters';
import InternshipTable from '../InternshipTable';
import Hero from '../Hero';
import Features from '../Features';
import HowItWorksSection from '../HowItWorksSection';
import WelcomeBanner from '../WelcomeBanner';
import UnderHeader from '../UnderHeader';
import { companiesAPI, companyInternshipsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Paragraph } = Typography;

const contentStyle = {
  minHeight: 'calc(100vh - 80px)',
  background: 'rgb(255, 255, 255)',
  padding: '60px 24px 0 24px',
  position: 'relative',
  overflow: 'hidden'
};

export default function AppContent() {
  const { student, company, loading: authLoading } = useAuth();
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

  // Показываем загрузку, пока проверяется статус аутентификации
  if (authLoading) {
    return (
      <Layout.Content style={contentStyle}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 80px)'
        }}>
          <Spin size="large" />
        </div>
      </Layout.Content>
    );
  }

  return (
    <Layout.Content style={contentStyle}>
      {!student && !company && (
        <>
          <WelcomeBanner />
          <Hero />
          <Features />
          <HowItWorksSection />
        </>
      )}

      {(student || company) && (
        <>
          <UnderHeader />
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px 120px 24px' }}>

            <div style={{ marginTop: '60px', marginBottom: '40px' }}>
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
        </>
      )}
    </Layout.Content>
  );
}