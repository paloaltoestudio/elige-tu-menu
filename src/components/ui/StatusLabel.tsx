interface StatusLabelProps {
  status: 'SOLICITADO' | 'DESPACHADO' | 'CANCELADO' | 'EN NOVEDAD';
  className?: string;
}

export const StatusLabel = ({ status, className = '' }: StatusLabelProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'SOLICITADO':
        return {
          bgColor: '#4F5AFB',
          icon: <i className="fa-solid fa-file-circle-check text-white"></i>
        };
      case 'DESPACHADO':
        return {
          bgColor: '#42B43C',
          icon: <i className="fa-solid fa-check text-white"></i>
        };
      case 'CANCELADO':
        return {
          bgColor: '#CF0C0C',
          icon: <i className="fa-solid fa-times-circle text-white"></i>
        };
      case 'EN NOVEDAD':
        return {
          bgColor: '#DFAC20',
          icon: <i className="fa-solid fa-info-circle text-white"></i>
        };
      default:
        return {
          bgColor: '#6B7280',
          icon: <i className="fa-solid fa-info-circle text-white"></i>
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-white font-medium text-sm min-w-[100px] ${className}`}
      style={{ backgroundColor: config.bgColor }}
    >
      {status}
      {config.icon}
    </span>
  );
};
