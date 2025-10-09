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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Header with University Logo and Menu Banner */}
      <div className="bg-white">
        <Header />
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
            {/* Left Column - Login Form */}
            <div className="flex justify-center lg:justify-end">
              <LoginForm />
            </div>
            
            {/* Right Column - Video Tutorials */}
            <div className="space-y-4 lg:space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 text-center lg:text-left mb-4 lg:hidden">
                Videos tutoriales
              </h3>
              
              {/* Employee Video */}
              <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1">
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                      <iframe 
                        className="absolute top-0 left-0 w-full h-full rounded"
                        src="https://www.youtube.com/embed/IL3VXuQGhoQ" 
                        title="Eligetumenudea.com Solicitud de pedidos usuarios" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerPolicy="strict-origin-when-cross-origin" 
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                  <div className="flex justify-center sm:justify-start">
                    <span className="bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
                      Para empleados
                    </span>
                  </div>
                </div>
              </div>

              {/* Student Video */}
              <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1">
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                      <iframe 
                        className="absolute top-0 left-0 w-full h-full rounded"
                        src="https://www.youtube.com/embed/j-Lq2d3j3aY?si=aC1ZTw95PcqXv3Xf" 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerPolicy="strict-origin-when-cross-origin" 
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                  <div className="flex justify-center sm:justify-start">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
                      Para estudiantes
                    </span>
                  </div>
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
