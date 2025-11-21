import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { Footer } from '../components/layout/Footer';
import { Link } from 'react-router-dom';

export const DashboardPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      
      <div className="max-w-[1600px] mx-auto">
        <div className="flex">
          <Sidebar 
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
          
          <main className="flex-1 p-3 sm:p-4 lg:p-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Escoje qué deseas hacer hoy 
          </h1>
          
          {/* Informative message */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Recuerda reportar las novedades al correo{' '}
                  <a 
                    href="mailto:servicioalimentacion@udea.edu.co" 
                    className="font-medium underline hover:text-blue-900"
                  >
                    servicioalimentacion@udea.edu.co
                  </a>
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/solicitar-servicio" className="block h-full">
              <div className="h-full bg-blue-50 border border-blue-200 rounded-lg p-6 hover:bg-blue-100 transition-colors cursor-pointer">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Solicitar Servicio
                </h3>
                <p className="text-blue-700 text-sm">
                  Elige tu menú para la semana siguiente
                </p>
              </div>
            </Link>
            
            <Link to="/mis-solicitudes" className="block h-full">
              <div className="h-full bg-green-50 border border-green-200 rounded-lg p-6 hover:bg-green-100 transition-colors cursor-pointer">
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  Mis Solicitudes
                </h3>
                <p className="text-green-700 text-sm">
                  Revisa tus solicitudes anteriores
                </p>
              </div>
            </Link>
            
            <Link to="/cancelaciones" className="block h-full">
              <div className="h-full bg-red-50 border border-red-200 rounded-lg p-6 hover:bg-red-100 transition-colors cursor-pointer">
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  Cancelar Pedidos
                </h3>
                <p className="text-red-700 text-sm">
                  Cancela pedidos dentro de las horas habilitadas
                </p>
              </div>
            </Link>
            
            <Link to="/perfil" className="block h-full">
              <div className="h-full bg-purple-50 border border-purple-200 rounded-lg p-6 hover:bg-purple-100 transition-colors cursor-pointer">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">
                  Perfil
                </h3>
                <p className="text-purple-700 text-sm">
                  Gestiona tu información personal
                </p>
              </div>
            </Link>
          </div>
        </div>
        </main>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};
