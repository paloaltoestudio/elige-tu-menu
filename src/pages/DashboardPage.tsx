import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Link } from 'react-router-dom';

export const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Bienvenido al Sistema de Menú
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/solicitar-servicio" className="block">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 hover:bg-blue-100 transition-colors cursor-pointer">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Solicitar Servicio
                </h3>
                <p className="text-blue-700 text-sm">
                  Elige tu menú para la semana actual
                </p>
              </div>
            </Link>
            
            <Link to="/mis-solicitudes" className="block">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 hover:bg-green-100 transition-colors cursor-pointer">
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  Mis Solicitudes
                </h3>
                <p className="text-green-700 text-sm">
                  Revisa tus solicitudes anteriores
                </p>
              </div>
            </Link>
            
            <Link to="/cambiar-contrasena" className="block">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 hover:bg-purple-100 transition-colors cursor-pointer">
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
      
      <Footer />
    </div>
  );
};
