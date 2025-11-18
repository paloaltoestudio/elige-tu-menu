import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useTokenValidation } from './hooks/useTokenValidation';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { MisSolicitudesPage } from './pages/MisSolicitudesPage';
import { SolicitarServicioPage } from './pages/SolicitarServicioPage';
import { ChangePasswordPage } from './pages/ChangePasswordPage';
import { CancelOrdersPage } from './pages/CancelOrdersPage';
import { TutorialPage } from './pages/TutorialPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  const { isAuthenticated, initializing, initializeAuth } = useAuthStore();
  
  // Initialize authentication and start token validation
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Start token validation for authenticated users
  useTokenValidation();

  // Show loading ONLY while authentication is being initialized (not during login)
  if (initializing) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={<LoginPage />} 
          />
          <Route 
            path="/olvide-contrasena" 
            element={<ForgotPasswordPage />} 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/mis-solicitudes" 
            element={
              <ProtectedRoute>
                <MisSolicitudesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/solicitar-servicio" 
            element={
              <ProtectedRoute>
                <SolicitarServicioPage />
              </ProtectedRoute>
            } 
          />
              <Route 
                path="/cambiar-contrasena" 
                element={<ResetPasswordPage />} 
              />
              <Route 
                path="/cambiar-contrasena-auth" 
                element={
                  <ProtectedRoute>
                    <ChangePasswordPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/cancelaciones" 
                element={
                  <ProtectedRoute>
                    <CancelOrdersPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tutoriales" 
                element={
                  <ProtectedRoute>
                    <TutorialPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/perfil" 
                element={
                  <ProtectedRoute>
                    <UserProfilePage />
                  </ProtectedRoute>
                } 
              />
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
