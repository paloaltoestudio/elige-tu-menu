import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'students' | 'employees'>('students');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!email.trim()) {
      setError('Por favor ingrese su correo electrónico');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor ingrese un correo electrónico válido');
      return;
    }
    
    setLoading(true);
    
    // TODO: Implement API call when web service is ready
    // For now, just simulate a delay and show success message
    setTimeout(() => {
      setLoading(false);
      // In the future, this would navigate to a success page or show a success message
      console.log('Password reset email would be sent to:', email);
    }, 1000);
  };

  const handleCancel = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Header with University Logo and Menu Banner */}
      <div className="bg-white">
        <Header />
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Forgot Password Form */}
          <div className="flex justify-center mb-0">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 w-full max-w-md">
              <h2 className="text-md sm:text-md font-bold text-center text-gray-800 mb-4 sm:mb-6">
                Olvidé la contraseña
              </h2>
              
              <p className="text-sm text-gray-600 mb-4 sm:mb-6 text-center">
                Introduzca su dirección de correo electrónico y te enviaremos las instrucciones para restablecer la contraseña.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="Correo electrónico"
                  required
                />
                
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-xs sm:text-sm text-red-600">{error}</p>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-3 sm:space-x-3 pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                    className="flex-1 w-full"
                  >
                    {loading ? 'Enviando...' : 'Siguiente'}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 w-full"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
              
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  Si no recibe un correo electrónico de nosotros dentro de unos minutos, por favor revise su filtro de correo no deseado. Le enviamos mensajes de correo electrónico en la siguiente dirección:
                </p>
                <p className="text-xs text-blue-600 mt-1">{email}</p>
              </div>
            </div>
          </div>
        </div>
          
        {/* Video Tutorials - Tabbed Interface */}
        <div className="bg-white w-full py-10">
          <div className="max-w-2xl mx-auto rounded-lg shadow-md overflow-hidden w-full">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('students')}
                className={`flex-1 px-4 py-3 text-sm sm:text-base font-medium transition-colors ${
                  activeTab === 'students'
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Para Estudiantes</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('employees')}
                className={`flex-1 px-4 py-3 text-sm sm:text-base font-medium transition-colors ${
                  activeTab === 'employees'
                    ? 'bg-green-50 text-green-700 border-b-2 border-green-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Para Empleados</span>
                </div>
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-4 sm:p-6">
              {activeTab === 'students' && (
                <div className="animate-fadeIn">
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe 
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/j-Lq2d3j3aY?si=aC1ZTw95PcqXv3Xf" 
                      title="Tutorial para estudiantes - Eligetumenudea.com" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      referrerPolicy="strict-origin-when-cross-origin" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              {activeTab === 'employees' && (
                <div className="animate-fadeIn">
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe 
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/IL3VXuQGhoQ" 
                      title="Tutorial para empleados - Eligetumenudea.com" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      referrerPolicy="strict-origin-when-cross-origin" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      

      {/* Footer */}
      <Footer />
    </div>
  );
};

