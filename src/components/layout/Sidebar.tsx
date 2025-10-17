import { useLocation, Link } from 'react-router-dom';

interface SidebarProps {
  className?: string;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export const Sidebar = ({ className = '', isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) => {
  const location = useLocation();

  const navigationItems = [
    {
      label: 'Inicio',
      path: '/dashboard',
      active: location.pathname === '/dashboard',
    },
    {
      label: 'Solicitar Servicio',
      path: '/solicitar-servicio',
      active: location.pathname === '/solicitar-servicio',
    },
    {
      label: 'Videos y tutoriales',
      path: '/tutoriales',
      active: location.pathname === '/tutoriales',
    },
    {
      label: 'Mis solicitudes',
      path: '/mis-solicitudes',
      active: location.pathname === '/mis-solicitudes',
    },
    {
      label: 'Cancelación de pedidos (Solo aparecerán los pedidos en las horas habilitadas)',
      path: '/cancelaciones',
      active: location.pathname === '/cancelaciones',
    },
    {
      label: 'Cambiar contraseña',
      path: '/cambiar-contrasena',
      active: location.pathname === '/cambiar-contrasena',
    },
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav
        className={`bg-white border-r border-gray-200 w-64 min-h-screen
          fixed md:static inset-y-0 left-0 z-40
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${className}`}
      >
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4 md:hidden">
            <h2 className="text-lg font-semibold text-gray-900">Menú</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <ul className="space-y-1 lg:space-y-2">
            {navigationItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                    item.active
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-2'
                      : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
};
