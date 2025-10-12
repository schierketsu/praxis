import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppLayout from './components/layout/AppLayout';
import CompanyDetail from './components/CompanyDetail';
import StudentDashboard from './components/StudentDashboard';
import ApplicationsPage from './components/ApplicationsPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  console.log('App component rendered');
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<AppLayout />} />
          <Route path="/company/:companyId" element={<CompanyDetail />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/applications" element={
            <ProtectedRoute>
              <ApplicationsPage />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
