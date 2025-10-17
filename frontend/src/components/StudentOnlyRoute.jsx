import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function StudentOnlyRoute({ children }) {
    const { student, company } = useAuth();

    // Если пользователь не авторизован, перенаправляем на главную
    if (!student && !company) {
        return <Navigate to="/" replace />;
    }

    // Если это компания, перенаправляем на панель управления компании
    if (company) {
        return <Navigate to="/company-dashboard" replace />;
    }

    // Если это студент, показываем контент
    return children;
}
