export const Footer = () => {
  return (
    <footer className="bg-gray-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-center">
            <span className="text-sm text-gray-600 mb-2 sm:block sm:mb-0">Desarrollado por</span>
            <img src="/logo-treda-15.svg" alt="Treda Solutions" className="w-30 -mt-2 mb-3 sm:mb-0" />
            <span className="text-sm text-gray-600 sm:block">para Bienestar de la Universidad de Antioquia</span>
          </div>
      </div>
    </footer>
  );
};
