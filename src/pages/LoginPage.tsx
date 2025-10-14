import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { LoginForm } from '../components/auth/LoginForm';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

export const LoginPage = () => {
  const { isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'students' | 'employees'>('students');

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
          {/* Login Form */}
          <div className="flex justify-center mb-0">
            <LoginForm />
          </div>
        </div>
          
        {/* Video Tutorials - Tabbed Interface */}
        <div className="bg-white w-full py-10">
          <div className="max-w-2xl mx-auto rounded-lg shadow-md overflow-hidden w-full">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('students')}
                className={`flex-1 px-4 py-3 text-sm sm:text-base font-medium transition-colors ${
                  activeTab === 'students'
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Para Estudiantes</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('employees')}
                className={`flex-1 px-4 py-3 text-sm sm:text-base font-medium transition-colors ${
                  activeTab === 'employees'
                    ? 'bg-green-50 text-green-700 border-b-2 border-green-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Para Empleados</span>
                </div>
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-4 sm:p-6">
              {activeTab === 'students' && (
                <div className="animate-fadeIn">
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe 
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/j-Lq2d3j3aY?si=aC1ZTw95PcqXv3Xf" 
                      title="Tutorial para estudiantes - Eligetumenudea.com" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      referrerPolicy="strict-origin-when-cross-origin" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              {activeTab === 'employees' && (
                <div className="animate-fadeIn">
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe 
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/IL3VXuQGhoQ" 
                      title="Tutorial para empleados - Eligetumenudea.com" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      referrerPolicy="strict-origin-when-cross-origin" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      

      {/* Footer */}
      <Footer />
    </div>
  );
};
