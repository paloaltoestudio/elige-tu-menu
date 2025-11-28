import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { LoginForm } from '../components/auth/LoginForm';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { RoleBasedVideo } from '../components/video/RoleBasedVideo';

export const LoginPage = () => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Get messages from navigation state
  useEffect(() => {
    if (location.state) {
      if (location.state.message) {
        setSuccessMessage(location.state.message);
      }
      if (location.state.error) {
        setErrorMessage(location.state.error);
      }
    }
  }, [location]);

  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Header with University Logo and Menu Banner */}
      <div className="bg-white">
        <Header />
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-4 max-w-md mx-auto">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <p className="text-sm text-green-800 text-center">{successMessage}</p>
              </div>
            </div>
          )}
          {errorMessage && (
            <div className="mb-4 max-w-md mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-800 text-center">{errorMessage}</p>
              </div>
            </div>
          )}
          {/* Login Form */}
          <div className="flex justify-center mb-0">
            <LoginForm />
          </div>
        </div>
          
        {/* Video Tutorial - Based on Environment Role */}
        <RoleBasedVideo />
      </div>
      

      {/* Footer */}
      <Footer />
    </div>
  );
};
