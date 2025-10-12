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
        manualChunks: {
          // React и React DOM в отдельный чанк
          'react-vendor': ['react', 'react-dom'],
          // React Router в отдельный чанк
          'router': ['react-router-dom'],
          // Ant Design в отдельный чанк
          'antd': ['antd'],
          // Axios в отдельный чанк
          'axios': ['axios'],
          // Leaflet карты в отдельный чанк
          'leaflet': ['leaflet', 'react-leaflet']
        }
      }
    },
    
    // Оптимизация размера
    chunkSizeWarningLimit: 1000,
    
    // Сжатие
    terserOptions: {
      compress: {
        drop_console: true, // Удаляем console.log в продакшене
        drop_debugger: true
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
