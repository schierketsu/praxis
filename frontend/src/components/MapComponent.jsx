import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Spin, Typography } from 'antd';

const { Text } = Typography;

export default function MapComponent({ address, companyName, latitude, longitude }) {
  const [loading, setLoading] = useState(true);
  const [mapError, setMapError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Мемоизируем URL карты, чтобы избежать пересоздания при каждом рендере
  const mapUrl = useMemo(() => {
    // Если есть координаты, используем их
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);
      
      // Создаем bounding box вокруг точки
      const offset = 0.01; // Примерно 1 км
      const bbox = `${lon - offset},${lat - offset},${lon + offset},${lat + offset}`;
      
      return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
    }
    
    // Если координат нет, но есть адрес, используем адрес
    if (address) {
      const encodedAddress = encodeURIComponent(`${address}, ${companyName}`);
      return `https://www.openstreetmap.org/export/embed.html?bbox=47.0,56.0,47.5,56.2&layer=mapnik&q=${encodedAddress}`;
    }
    
    return null;
  }, [address, companyName, latitude, longitude]);

  // Оптимизированная загрузка без искусственной задержки
  useEffect(() => {
    if (mapUrl) {
      // Убираем искусственную задержку и загружаем карту сразу
      setLoading(false);
    }
  }, [mapUrl]);

  // Ленивая загрузка карты - загружаем только когда компонент становится видимым
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const mapContainer = document.getElementById(`map-container-${companyName}`);
    if (mapContainer) {
      observer.observe(mapContainer);
    }

    return () => observer.disconnect();
  }, [companyName]);

  const handleMapError = useCallback(() => {
    setMapError(true);
  }, []);

  if (loading) {
    return (
      <div 
        id={`map-container-${companyName}`}
        style={{ 
          width: '100%', 
          height: '250px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px'
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!mapUrl || mapError) {
    return (
      <div 
        id={`map-container-${companyName}`}
        style={{
          width: '100%',
          height: '250px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          color: '#999'
        }}
      >
        <Text>Карта недоступна</Text>
      </div>
    );
  }

  return (
    <div 
      id={`map-container-${companyName}`}
      style={{ 
        width: '100%', 
        height: '400px',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #e8e8e8'
      }}
    >
      {isVisible ? (
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight="0"
          marginWidth="0"
          src={mapUrl}
          style={{ border: 0 }}
          onError={handleMapError}
          title={`Карта расположения ${companyName}`}
          loading="lazy"
        />
      ) : (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          color: '#999'
        }}>
          <Text>Загрузка карты...</Text>
        </div>
      )}
    </div>
  );
}
