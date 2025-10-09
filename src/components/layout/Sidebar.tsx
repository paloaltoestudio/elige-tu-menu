import { useLocation, Link } from 'react-router-dom';

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className = '' }: SidebarProps) => {
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
      active: false,
    },
    {
      label: 'Mis solicitudes',
      path: '/mis-solicitudes',
      active: location.pathname === '/mis-solicitudes',
    },
    {
      label: 'Cancelación de pedidos (Solo aparecerán los pedidos en las horas habilitadas)',
      path: '/cancelaciones',
      active: false,
    },
  ];

  return (
    <nav className={`bg-white border-r border-gray-200 w-64 min-h-screen ${className}`}>
      <div className="p-6">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
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
  );
};
