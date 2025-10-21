import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate, Link } from 'react-router-dom';

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps = {}) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };

    if (showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown]);

  return (
    <header className="bg-white shadow-sm max-w-[1600px] mx-auto">
        {/* Menu Banner */}
        <div className="flex items-center justify-center">
          <img src="/banner-udea.jpg" alt="Banner UdeA" className="w-full object-cover max-h-32 sm:max-h-40 md:max-h-none" />
        </div>

        <div className="bg-blue-50">
          <div className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
            <div className="flex items-center justify-between gap-2">
            
            
            {/* Title - Center on mobile, left on desktop */}
            <div className="flex-1 flex items-center lg:justify-start">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-grey-700 font-medium text-xs sm:text-sm lg:text-base text-center sm:text-left focus:outline-none"
                aria-label="Ir al Dashboard"
              >
                <img
                  src="/icon-48x48-transparent.png"
                  alt="Logo UdeA"
                  className="h-6 w-6 sm:h-7 sm:w-7 object-contain"
                  style={{ minWidth: '1.5rem' }}
                />
                Elige tu Menú
              </Link>
            </div>

             {/* User Widget - Right side */}
              <div className="flex items-center gap-2 sm:gap-4">
                {user && (
                  <div className="relative" ref={dropdownRef}>
                    {/* User Widget */}
                    <div 
                      className="flex items-center gap-2 px-3 py-3 rounded-md cursor-pointer hover:bg-blue-100 transition-colors"
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                    >
                      {/* User Icon */}
                      <i className="fa-solid fa-user text-blue-600"></i>
                      
                      {/* Full Name */}
                      <span className="text-blue-600 hidden sm:block font-medium text-sm">
                        {user.nombres || user.usuario || user.sub}
                      </span>
                      
                      {/* Dropdown Arrow */}
                      <i className={`fa-solid fa-chevron-down text-blue-600 text-xs transition-transform ${showUserDropdown ? 'rotate-180' : ''}`}></i>
                    </div>

                    {/* Dropdown Menu */}
                    {showUserDropdown && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                        <span className="p-4 pb-2 border-b border-gray-200 text-blue-600 sm:hidden font-medium text-sm text-center block">
                          {user.nombres || user.usuario || user.sub}
                        </span>
                        <div className="py-1">
                          <button
                            onClick={() => {
                              navigate('/cambiar-contrasena');
                              setShowUserDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <i className="fa-solid fa-key text-gray-500"></i>
                            Cambiar contraseña
                          </button>
                          <hr className="my-1 border-gray-200" />
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <i className="fa-solid fa-sign-out-alt text-red-500"></i>
                            Cerrar Sesión
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

            {/* Mobile menu button */}
            {onMenuClick && (
              <button
                onClick={onMenuClick}
                className="md:hidden p-2 text-white bg-orange-600 hover:bg-blue-500 rounded-md transition-colors"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            </div>
          </div>
        </div>
    </header>
  );
};
