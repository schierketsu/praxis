import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Spin } from 'antd';
import { AuthProvider } from './contexts/AuthContext';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import StudentOnlyRoute from './components/StudentOnlyRoute';
import SmartPreloader from './components/SmartPreloader';

// Ленивая загрузка компонентов
const CompanyDetail = lazy(() => import('./components/CompanyDetail'));
const StudentDashboard = lazy(() => import('./components/StudentDashboard'));
const CompanyDashboard = lazy(() => import('./components/CompanyDashboard'));
const ApplicationsPage = lazy(() => import('./components/ApplicationsPage'));

// Компонент загрузки
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px'
  }}>
    <Spin size="large" />
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <SmartPreloader />
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<AppLayout />} />
            <Route path="/company/:companyId" element={<CompanyDetail />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/company-dashboard" element={
              <ProtectedRoute>
                <CompanyDashboard />
              </ProtectedRoute>
            } />
            <Route path="/applications" element={
              <StudentOnlyRoute>
                <ApplicationsPage />
              </StudentOnlyRoute>
            } />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}
