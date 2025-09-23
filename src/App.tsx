import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  const { isAuthenticated, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <div className="App">
      {isAuthenticated ? (
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      ) : (
        <LoginPage />
      )}
    </div>
  );
}

export default App;
