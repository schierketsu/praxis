import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Spin, Typography } from 'antd';
import L from 'leaflet';
import { loadLeafletCSS } from '../utils/resourceLoader';

const { Text } = Typography;

export default function MapComponent({ address, companyName, latitude, longitude }) {
  const [loading, setLoading] = useState(true);
  const [mapError, setMapError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [map, setMap] = useState(null);

  // Ленивая загрузка карты - загружаем только когда компонент становится видимым
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Загружаем CSS только когда карта становится видимой
          loadLeafletCSS().catch(console.error);
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

  // Инициализация карты
  useEffect(() => {
    if (!isVisible) return;

    const mapContainer = document.getElementById(`map-container-${companyName}`);
    if (!mapContainer) return;

    try {
      // Определяем координаты
      let lat, lon;

      if (latitude && longitude) {
        lat = parseFloat(latitude);
        lon = parseFloat(longitude);
      } else {
        // Если координат нет, используем координаты Москвы как fallback
        lat = 55.7558;
        lon = 37.6176;
      }

      // Создаем карту
      const leafletMap = L.map(mapContainer, {
        center: [lat, lon],
        zoom: latitude && longitude ? 15 : 10,
        zoomControl: true,
        attributionControl: false // Убираем подпись Leaflet
      });

      // Добавляем тайлы OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: false, // Убираем подпись
        maxZoom: 19
      }).addTo(leafletMap);

      // Добавляем маркер, если есть точные координаты
      if (latitude && longitude) {
        const marker = L.marker([lat, lon]).addTo(leafletMap);
        // Убираем popup с названием компании
      }

      setMap(leafletMap);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка создания карты:', error);
      setMapError(true);
      setLoading(false);
    }

    // Очистка при размонтировании
    return () => {
      if (map) {
        map.remove();
        setMap(null);
      }
    };
  }, [isVisible, companyName, latitude, longitude, address]);

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

  if (mapError) {
    return (
      <div
        id={`map-container-${companyName}`}
        style={{
          width: '100%',
          height: '250px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          color: '#999',
          padding: '20px'
        }}
      >
        <Text style={{ marginBottom: '16px', textAlign: 'center' }}>
          Карта недоступна
        </Text>
        {address && (
          <Text style={{ fontSize: '14px', textAlign: 'center', color: '#666' }}>
            Адрес: {address}
          </Text>
        )}
      </div>
    );
  }

  return (
    <div
      id={`map-container-${companyName}`}
      style={{
        width: '100%',
        height: '250px',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #e8e8e8'
      }}
    />
  );
}
