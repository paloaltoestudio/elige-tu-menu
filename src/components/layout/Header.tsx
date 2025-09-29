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
    <header className="bg-white shadow-sm">
        {/* Menu Banner */}
        <div className="md:flex items-center justify-center">
          <img src="/banner-udea.jpg" alt="Banner UdeA" className="w-full" />
        </div>

        <div className="bg-blue-50 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-blue-700 font-medium">
                Elige tu Menú - Servicio de Alimentación Estudiantes y Empleados U de A
              </span>
            </div>

             {/* User Info and Logout */}
              <div className="flex items-center space-x-4">
                {user && (
                  <>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {user.usuario || user.sub}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user.documento && `Doc: ${user.documento} • `}
                        {user.rol === 'ESTUDIANTE' ? 'Estudiante' : 'Docente'}
                      </p>
                    </div>

                    <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    >
                    Cerrar Sesión
                    </Button>
                  </>
                )}
                
              </div>
          </div>
        </div>
    </header>
  );
};
