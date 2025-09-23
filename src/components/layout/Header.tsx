import { useAuthStore } from '../../stores/authStore';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and University Info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  UNIVERSIDAD DE ANTIOQUIA
                </h1>
                <p className="text-sm text-gray-600">
                  Dirección de Bienestar Universitario
                </p>
              </div>
            </div>
          </div>

          {/* Menu Banner */}
          <div className="hidden md:flex items-center">
            <div className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg">
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-bold">Elige tu menú</span>
                <div className="flex space-x-2">
                  <span className="text-xl">🥦</span>
                  <span className="text-xl">🍗</span>
                  <span className="text-xl">🐟</span>
                  <span className="text-xl">🍲</span>
                  <span className="text-xl">🍎</span>
                </div>
              </div>
            </div>
          </div>

          {/* User Info and Logout */}
          <div className="flex items-center space-x-4">
            {user && (
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.usuario || user.sub}
                </p>
                <p className="text-xs text-gray-500">
                  {user.documento && `Doc: ${user.documento} • `}
                  {user.rol === 'ESTUDIANTE' ? 'Estudiante' : 'Docente'}
                </p>
              </div>
            )}
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
