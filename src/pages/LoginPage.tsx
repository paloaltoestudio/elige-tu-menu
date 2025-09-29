import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { LoginForm } from '../components/auth/LoginForm';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

export const LoginPage = () => {
  const { isAuthenticated } = useAuthStore();

  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header with University Logo and Menu Banner */}
      <div className="bg-white">
        <Header />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-11">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Login Form */}
          <div className="flex justify-center">
            <LoginForm />
          </div>
          
          {/* Right Column - Video Tutorials */}
          <div className="space-y-4">
            {/* Employee Video */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  <div className="relative bg-black rounded">
                   <iframe width="360" height="200" src="https://www.youtube.com/embed/IL3VXuQGhoQ" title="Eligetumenudea.com Solicitud de pedidos usuarios" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                  </div>
                </div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                  Para empleados
                </div>
              </div>
            </div>

            {/* Student Video */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  <div className="relative bg-black rounded">
                    <iframe width="360" height="200" src="https://www.youtube.com/embed/j-Lq2d3j3aY?si=aC1ZTw95PcqXv3Xf" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                  </div>
                </div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                  Para estudiantes
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};
