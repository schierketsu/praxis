import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, Select, Button, Space, Row, Col, Tag, Typography } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { companiesAPI, internshipsAPI, universitiesAPI } from '../services/api';

const { Option } = Select;
const { Text } = Typography;

export default function SearchFilters({ onSearch, onReset, loading, selectedLocation, selectedUniversity, selectedTechs, onLocationChange, onUniversityChange, onTechChange, isInitialized, isMobile = false }) {
  const [locations, setLocations] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [filtersLoaded, setFiltersLoaded] = useState(false);

  useEffect(() => {
    fetchFilterData();
  }, []);

  const fetchFilterData = async () => {
    try {
      // Получаем локации из практик
      const internshipsResponse = await internshipsAPI.getInternships();
      const uniqueLocations = [...new Set(internshipsResponse.results.map(i => i.location).filter(Boolean))];
      setLocations(uniqueLocations);

      // Получаем университеты
      const universitiesResponse = await universitiesAPI.getUniversities();
      setUniversities(universitiesResponse.results || []);

      // Получаем все технологии
      const allTechs = new Set();
      internshipsResponse.results.forEach(internship => {
        if (internship.tech_stack) {
          internship.tech_stack.forEach(tech => allTechs.add(tech));
        }
      });
      setTechnologies([...allTechs].sort());
      setFiltersLoaded(true);
    } catch (error) {
      console.error('Error fetching filter data:', error);
    }
  };

  // Дебаунсинг для поиска
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId;
      return (params) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          onSearch(params);
        }, 300); // 300ms задержка
      };
    })(),
    [onSearch]
  );

  const handleSearch = useCallback(() => {
    const params = {};
    if (selectedLocation) params.location = selectedLocation;
    if (selectedUniversity) params.university = selectedUniversity;
    if (selectedTechs.length > 0) params.tech_stack = selectedTechs.join(',');
    debouncedSearch(params);
  }, [selectedLocation, selectedUniversity, selectedTechs, debouncedSearch]);

  const handleReset = () => {
    onLocationChange('');
    onUniversityChange('');
    onTechChange([]);
    onReset();
  };

  const handleTechSelect = (value) => {
    if (!selectedTechs.includes(value)) {
      const newTechs = [...selectedTechs, value];
      onTechChange(newTechs);
      // Автоматически применяем фильтр при выборе технологии
      const params = {};
      if (selectedLocation) params.location = selectedLocation;
      if (selectedUniversity) params.university = selectedUniversity;
      params.tech_stack = newTechs.join(',');
      onSearch(params);
    }
  };

  const handleTechDeselect = (value) => {
    const newTechs = selectedTechs.filter(tech => tech !== value);
    onTechChange(newTechs);
    // Автоматически применяем фильтр при снятии выбора технологии
    const params = {};
    if (selectedLocation) params.location = selectedLocation;
    if (selectedUniversity) params.university = selectedUniversity;
    if (newTechs.length > 0) params.tech_stack = newTechs.join(',');
    onSearch(params);
  };

  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    return (
      <Tag
        size="small"
        closable={closable}
        onClose={onClose}
        style={{
          marginRight: 3,
          fontSize: '12px',
          padding: '4px 8px',
          borderRadius: '6px',
          backgroundColor: '#4c63d2',
          color: 'white',
          border: 'none',
          fontWeight: '500'
        }}
      >
        {label}
      </Tag>
    );
  };

  return (
    <Card
      data-testid="search-filters"
      style={{
        marginBottom: isMobile ? '24px' : '40px',
        borderRadius: isMobile ? '16px' : '20px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: isMobile ? '0 4px 16px rgba(0, 0, 0, 0.08)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        padding: isMobile ? '16px' : '24px'
      }}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Row gutter={isMobile ? [12, 12] : [16, 16]}>
          <Col xs={24} sm={24} md={6}>
            <Text style={{ 
              marginBottom: isMobile ? '8px' : '12px', 
              fontWeight: '600', 
              color: '#4a5568', 
              fontSize: isMobile ? '13px' : '14px', 
              display: 'block' 
            }}>
              Локация
            </Text>
            <Select
              showSearch
              allowClear
              placeholder="Выберите локацию"
              value={selectedLocation || undefined}
              onChange={(value) => {
                onLocationChange(value || '');
                // Автоматически применяем фильтр при изменении локации
                const params = {};
                if (value) params.location = value;
                if (selectedUniversity) params.university = selectedUniversity;
                if (selectedTechs.length > 0) params.tech_stack = selectedTechs.join(',');
                onSearch(params);
              }}
              onClear={() => {
                onLocationChange('');
                // Автоматически применяем фильтр при очистке локации
                const params = {};
                if (selectedUniversity) params.university = selectedUniversity;
                if (selectedTechs.length > 0) params.tech_stack = selectedTechs.join(',');
                onSearch(params);
              }}
              style={{
                width: '100%',
                borderRadius: isMobile ? '8px' : '12px'
              }}
              size={isMobile ? 'middle' : 'large'}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {locations.map(location => (
                <Option key={location} value={location}>
                  {location}
                </Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={24} md={6}>
            <Text style={{ 
              marginBottom: isMobile ? '8px' : '12px', 
              fontWeight: '600', 
              color: '#4a5568', 
              fontSize: isMobile ? '13px' : '14px', 
              display: 'block' 
            }}>
              Учебное заведение
            </Text>
            <Select
              showSearch
              allowClear
              placeholder="Выберите учебное заведение"
              value={selectedUniversity || undefined}
              onChange={(value) => {
                onUniversityChange(value || '');
                // Автоматически применяем фильтр при изменении университета
                const params = {};
                if (selectedLocation) params.location = selectedLocation;
                if (value) params.university = value;
                if (selectedTechs.length > 0) params.tech_stack = selectedTechs.join(',');
                onSearch(params);
              }}
              onClear={() => {
                onUniversityChange('');
                // Автоматически применяем фильтр при очистке университета
                const params = {};
                if (selectedLocation) params.location = selectedLocation;
                if (selectedTechs.length > 0) params.tech_stack = selectedTechs.join(',');
                onSearch(params);
              }}
              style={{
                width: '100%',
                borderRadius: isMobile ? '8px' : '12px'
              }}
              size={isMobile ? 'middle' : 'large'}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              loading={!filtersLoaded || !isInitialized}
            >
              {universities.map(university => (
                <Option key={university.id} value={university.id}>
                  {university.name}
                </Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={24} md={12}>
            <Text style={{ 
              marginBottom: isMobile ? '8px' : '12px', 
              fontWeight: '600', 
              color: '#4a5568', 
              fontSize: isMobile ? '13px' : '14px', 
              display: 'block' 
            }}>
              Стек технологий
            </Text>
            <Select
              mode="multiple"
              allowClear
              placeholder="Выберите технологии"
              value={selectedTechs}
              onSelect={handleTechSelect}
              onDeselect={handleTechDeselect}
              onClear={() => {
                onTechChange([]);
                // Автоматически применяем фильтр при очистке технологий
                const params = {};
                if (selectedLocation) params.location = selectedLocation;
                if (selectedUniversity) params.university = selectedUniversity;
                onSearch(params);
              }}
              style={{
                width: '100%',
                borderRadius: isMobile ? '8px' : '12px'
              }}
              size={isMobile ? 'middle' : 'large'}
              maxTagCount={isMobile ? 2 : "responsive"}
              tagRender={tagRender}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {technologies.map(tech => (
                <Option key={tech} value={tech}>
                  {tech}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>

        <Row justify={isMobile ? "center" : "end"}>
          <Space>
            <Button
              type="default"
              icon={<ReloadOutlined />}
              onClick={handleReset}
              disabled={loading}
              size={isMobile ? "middle" : "large"}
              style={{
                borderRadius: isMobile ? '8px' : '12px',
                height: isMobile ? '36px' : '44px',
                fontSize: isMobile ? '13px' : '14px',
                fontWeight: '600',
                background: 'rgba(102, 126, 234, 0.1)',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                color: '#667eea',
                transition: 'all 0.3s ease',
                padding: isMobile ? '0 16px' : '0 24px'
              }}
            >
              Сбросить
            </Button>
          </Space>
        </Row>

      </Space>
    </Card>
  );
}
