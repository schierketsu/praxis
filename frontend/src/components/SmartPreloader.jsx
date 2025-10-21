import React, { useEffect } from 'react';
import { resourceLoader } from '../utils/resourceLoader';

/**
 * Компонент для умной предзагрузки ресурсов
 * Загружает ресурсы только когда они действительно нужны
 */
const SmartPreloader = () => {
  useEffect(() => {
    // Предзагружаем только критические ресурсы
    const preloadCriticalResources = async () => {
      try {
        // Предзагружаем основные шрифты если они есть
        const fontPreloads = [
          'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
        ];
        
        for (const font of fontPreloads) {
          await resourceLoader.load(font, 'style');
        }
        
        // Предзагружаем иконки только если они действительно нужны
        // checkblue.png загружается динамически в компонентах где используется
        
      } catch (error) {
        console.warn('Ошибка предзагрузки ресурсов:', error);
      }
    };

    // Запускаем предзагрузку с небольшой задержкой
    const timeoutId = setTimeout(preloadCriticalResources, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  return null; // Этот компонент не рендерит ничего
};

export default SmartPreloader;
