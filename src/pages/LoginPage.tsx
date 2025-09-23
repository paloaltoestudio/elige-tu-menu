import { LoginForm } from '../components/auth/LoginForm';

export const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header with University Logo and Menu Banner */}
      <div className="bg-white">
        {/* University Header and Menu Banner */}
        <div className="flex">
          {/* Left side - University Info */}
          <div className="bg-white p-4 flex items-center space-x-4">
            <img 
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiMzNzM3MzciLz4KPHN2ZyB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTE2IDhMMjQgMjRIOEwxNiA4WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjwvc3ZnPgo=" 
              alt="Universidad de Antioquia" 
              className="w-16 h-16"
            />
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                UNIVERSIDAD<br />DE ANTIOQUIA
              </h1>
              <p className="text-sm text-gray-600">
                Dirección de Bienestar Universitario
              </p>
            </div>
          </div>
          
          {/* Right side - Menu Banner */}
          <div className="flex-1 bg-gradient-to-r from-purple-600 to-red-500 p-6 flex items-center justify-center relative overflow-hidden">
            <div className="text-center text-white relative z-10">
              <h2 className="text-4xl font-bold italic mb-2">Elige tu menú</h2>
            </div>
            {/* Food Icons scattered around */}
            <div className="absolute inset-0 overflow-hidden">
              <span className="absolute top-4 left-20 text-3xl">🥦</span>
              <span className="absolute top-8 left-40 text-2xl">🍗</span>
              <span className="absolute top-6 right-40 text-3xl">🐟</span>
              <span className="absolute top-10 right-20 text-2xl">🍲</span>
              <span className="absolute bottom-8 left-32 text-3xl">🍎</span>
              <span className="absolute bottom-6 right-32 text-2xl">🥕</span>
              <span className="absolute top-1/2 left-10 text-2xl">🍽️</span>
              <span className="absolute top-1/2 right-10 text-2xl">🥘</span>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🔗</span>
              </div>
              <span className="text-blue-700 font-medium">
                Elige tu Menú - Servicio de Alimentación Estudiantes y Empleados U de A
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Login Form */}
          <div className="flex justify-center">
            <LoginForm />
          </div>
          
          {/* Right Column - Video Tutorials */}
          <div className="space-y-6">
            {/* Employee Video */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-start space-x-4">
                <div className="flex-1">
                  {/* Video Placeholder */}
                  <div className="relative bg-black rounded aspect-video">
                    <img 
                      src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgdmlld0JveD0iMCAwIDQwMCAyMjUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjI1IiBmaWxsPSIjMDAwIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTEyLjUiIGZpbGw9IndoaXRlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkVsaWdldHVtZW51ZGVhLmNvbSBTb2xpY2l0Li4uPC90ZXh0Pgo8Y2lyY2xlIGN4PSIyMDAiIGN5PSI4MCIgcj0iMzAiIGZpbGw9IiNGRjAwMDAiLz4KPHBvbHlnb24gcG9pbnRzPSIxOTAsNzAgMjEwLDgwIDE5MCw5MCIgZmlsbD0id2hpdGUiLz4KPHJlY3QgeD0iMTAiIHk9IjE5NSIgd2lkdGg9IjM4MCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzMzMyIgb3BhY2l0eT0iMC44Ii8+Cjx0ZXh0IHg9IjIwIiB5PSIyMDgiIGZpbGw9IndoaXRlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPjA6MDAgLyAyOjUxPC90ZXh0Pgo8L3N2Zz4K" 
                      alt="Video thumbnail - Eligetumenudea.com Solicit..."
                      className="w-full h-full object-cover rounded"
                    />
                    {/* Video Controls Overlay */}
                    <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-75 text-white p-2 rounded text-xs">
                      <div className="flex items-center justify-between">
                        <span>▶️ 🔊</span>
                        <span>0:00 / 2:51</span>
                        <span>🎬 YouTube 📺</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                  Para empleados
                </div>
              </div>
            </div>

            {/* Student Video */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-start space-x-4">
                <div className="flex-1">
                  {/* Video Placeholder */}
                  <div className="relative bg-black rounded aspect-video">
                    <img 
                      src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgdmlld0JveD0iMCAwIDQwMCAyMjUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjI1IiBmaWxsPSIjMDAwIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTEyLjUiIGZpbGw9IndoaXRlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkVsaWdldHVtZW51ZGVhLmNvbSBTb2xpY2l0Li4uPC90ZXh0Pgo8Y2lyY2xlIGN4PSIyMDAiIGN5PSI4MCIgcj0iMzAiIGZpbGw9IiNGRjAwMDAiLz4KPHBvbHlnb24gcG9pbnRzPSIxOTAsNzAgMjEwLDgwIDE5MCw5MCIgZmlsbD0id2hpdGUiLz4KPHJlY3QgeD0iMTAiIHk9IjE5NSIgd2lkdGg9IjM4MCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzMzMyIgb3BhY2l0eT0iMC44Ii8+Cjx0ZXh0IHg9IjIwIiB5PSIyMDgiIGZpbGw9IndoaXRlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPjA6MDAgLyAxMToyNjwvdGV4dD4KPC9zdmc+Cg==" 
                      alt="Video thumbnail - Eligetumenudea.com Solicit..."
                      className="w-full h-full object-cover rounded"
                    />
                    {/* Video Controls Overlay */}
                    <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-75 text-white p-2 rounded text-xs">
                      <div className="flex items-center justify-between">
                        <span>▶️ 🔊</span>
                        <span>0:00 / 11:26</span>
                        <span>🎬 YouTube 📺</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                  Para estudiantes
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Desarrollado por</span>
              <div className="bg-gray-800 text-white px-3 py-1 rounded text-sm font-bold">
                TREDA
              </div>
              <span className="text-blue-400 text-sm">💧</span>
            </div>
            <div className="text-sm text-gray-600">
              para Bienestar de la Universidad de Antioquia
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
