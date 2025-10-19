import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Оптимизация сборки
    target: 'es2015',
    minify: 'terser',
    sourcemap: false,
    
    // Разделение на чанки для лучшего кэширования
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React и React DOM в отдельный чанк
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }
          // React Router в отдельный чанк
          if (id.includes('react-router')) {
            return 'router';
          }
          // Ant Design в отдельный чанк
          if (id.includes('antd')) {
            return 'antd';
          }
          // Axios в отдельный чанк
          if (id.includes('axios')) {
            return 'axios';
          }
          // Leaflet карты в отдельный чанк
          if (id.includes('leaflet')) {
            return 'leaflet';
          }
          // Компоненты в отдельный чанк
          if (id.includes('components/')) {
            return 'components';
          }
          // Сервисы в отдельный чанк
          if (id.includes('services/')) {
            return 'services';
          }
        }
      }
    },
    
    // Оптимизация размера
    chunkSizeWarningLimit: 1000,
    
    // Сжатие
    terserOptions: {
      compress: {
        drop_console: true, // Удаляем console.log в продакшене
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      },
      mangle: {
        safari10: true
      }
    }
  },
  
  // Оптимизация dev сервера
  server: {
    hmr: {
      overlay: false // Отключаем overlay для лучшей производительности
    }
  },
  
  // Оптимизация зависимостей
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'antd',
      'axios',
      'leaflet',
      'react-leaflet'
    ]
  }
})
