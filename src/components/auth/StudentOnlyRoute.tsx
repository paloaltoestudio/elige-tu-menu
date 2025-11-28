import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { ProtectedRoute } from './ProtectedRoute';

interface StudentOnlyRouteProps {
  children: React.ReactNode;
}

export const StudentOnlyRoute = ({ children }: StudentOnlyRouteProps) => {
  const { user } = useAuthStore();

  // First check authentication
  return (
    <ProtectedRoute>
      {user?.rol === 'ESTUDIANTE' ? (
        <>{children}</>
      ) : (
        <Navigate to="/dashboard" replace />
      )}
    </ProtectedRoute>
  );
};

