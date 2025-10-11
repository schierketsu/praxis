import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import CompanyDetail from './components/CompanyDetail';

export default function App() {
  console.log('App component rendered');
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<AppLayout />} />
        <Route path="/company/:companyId" element={<CompanyDetail />} />
      </Routes>
    </Router>
  );
}
