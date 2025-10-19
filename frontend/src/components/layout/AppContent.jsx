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

const mobileContentStyle = {
  minHeight: 'calc(100vh - 80px)',
  background: 'rgb(255, 255, 255)',
  padding: '0',
  margin: '0',
  position: 'relative',
  overflow: 'hidden',
  border: 'none',
  outline: 'none',
  boxShadow: 'none'
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
  const [isInitialized, setIsInitialized] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Определяем мобильные устройства
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Инициализация для студентов
  useEffect(() => {
    if (authLoading) return;
    
    if (student && student.university && student.university_name && !isInitialized) {
      // Устанавливаем фильтр по умолчанию для студента
      setSelectedUniversity(student.university);
      const params = { university: student.university };
      setSearchParams(params);
      setIsInitialized(true);
      setInitialLoadComplete(true);
    } else if (!student && !company && !authLoading) {
      // Для неавторизованных пользователей загружаем все данные
      setInitialLoadComplete(true);
    } else if (company && !authLoading) {
      // Для компаний загружаем все данные
      setInitialLoadComplete(true);
    }
  }, [student, company, authLoading, isInitialized]);

  // Загрузка данных при изменении параметров поиска
  useEffect(() => {
    if (!initialLoadComplete) return;
    fetchCompanies(searchParams);
  }, [searchParams, initialLoadComplete]);

  // Обработчик поиска
  const handleSearch = (params) => {
    // Для всех пользователей фильтрация происходит на backend
    setSearchParams(params);
  };

  // Обработчик изменения университета
  const handleUniversityChange = (value) => {
    setSelectedUniversity(value);
    setUserInteractedWithUniversity(true);
    // Автоматически применяем фильтр при изменении университета
    const params = {};
    if (value) params.university = value;
    setSearchParams(params);
  };

  // Обработчик сброса фильтров
  const handleReset = () => {
    setSearchParams({});
    setSelectedLocation('');
    setSelectedUniversity('');
    setSelectedTechs([]);
    setUserInteractedWithUniversity(false);
    setIsInitialized(false);
    setInitialLoadComplete(false);
    
    // После сброса, если есть студент с университетом, снова применяем фильтр по умолчанию
    if (student && student.university && student.university_name) {
      setTimeout(() => {
        setSelectedUniversity(student.university);
        const params = { university: student.university };
        setSearchParams(params);
        setIsInitialized(true);
        setInitialLoadComplete(true);
      }, 100);
    } else {
      setInitialLoadComplete(true);
      fetchCompanies();
    }
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
    <Layout.Content style={isMobile ? mobileContentStyle : contentStyle}>
      {!student && !company && (
        <>
          <WelcomeBanner />
          {!isMobile && <Hero />}
          <Features />
          {isMobile && (
            <div style={{ 
              height: '60px', 
              background: 'white',
              margin: '0 -24px'
            }} />
          )}
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
                isInitialized={isInitialized}
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