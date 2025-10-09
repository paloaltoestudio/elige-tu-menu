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
        <div className="flex items-center justify-center">
          <img src="/banner-udea.jpg" alt="Banner UdeA" className="w-full object-cover max-h-32 sm:max-h-40 md:max-h-none" />
        </div>

        <div className="bg-blue-50 px-3 sm:px-4 lg:px-6 py-4 sm:py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
            <div className="flex items-center">
              <span className="text-blue-700 font-medium text-xs sm:text-sm lg:text-base text-center sm:text-left">
                Elige tu Menú - Servicio de Alimentación Estudiantes y Empleados U de A
              </span>
            </div>

             {/* User Info and Logout */}
              <div className="flex items-center gap-2 sm:gap-4">
                {user && (
                  <>
                    <div className="text-right hidden sm:block">
                      <p className="text-xs sm:text-sm font-medium text-gray-900">
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
                      className="text-xs sm:text-sm whitespace-nowrap"
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
