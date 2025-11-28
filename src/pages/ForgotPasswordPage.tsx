import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { AuthService } from '../services/authService';
import { RoleBasedVideo } from '../components/video/RoleBasedVideo';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    
    // Basic validation - if invalid email, redirect to login with success message (for security)
    if (!email.trim()) {
      navigate('/login', {
        state: { 
          message: 'Verifica tu bandeja de entrada de correo electrónico y sigue las instrucciones.' 
        }
      });
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      navigate('/login', {
        state: { 
          message: 'Verifica tu bandeja de entrada de correo electrónico y sigue las instrucciones.' 
        }
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await AuthService.forgotPassword({ correo: email });
      
      if (response.success) {
        // Success - show the email message
        setSuccess(true);
      } else {
        // Failure - redirect to login with same message as success (for security)
        navigate('/login', {
          state: { 
            message: 'Verifica tu bandeja de entrada de correo electrónico y sigue las instrucciones.' 
          }
        });
      }
    } catch (error: any) {
      console.error('Forgot password error:', error);
      // Failure - redirect to login with same message as success (for security)
      navigate('/login', {
        state: { 
          message: 'Verifica tu bandeja de entrada de correo electrónico y sigue las instrucciones.' 
        }
      });
    } finally {
      setLoading(false);
    }
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
              
              {success ? (
                <>
                  <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                    <p className="text-sm text-green-800 text-center">
                      Verifica tu bandeja de entrada de correo electrónico y sigue las instrucciones
                    </p>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500">
                      Si no recibe un correo electrónico de nosotros dentro de unos minutos, por favor revise su filtro de correo no deseado. Le enviamos mensajes de correo electrónico en la siguiente dirección:
                    </p>
                    <p className="text-xs text-blue-600 mt-1">{email}</p>
                  </div>
                  <div className="mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleCancel}
                    >
                      Volver al inicio
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-4 sm:mb-6 text-center">
                    Introduzca su dirección de correo electrónico y te enviaremos las instrucciones para restablecer la contraseña.
                  </p>
                  
                  <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setSuccess(false);
                      }}
                      placeholder="Correo electrónico"
                      required
                    />
                    
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
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="text-xs sm:text-sm text-blue-600 hover:text-blue-500"
                    >
                      Iniciar sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
          
        {/* Video Tutorial - Based on Environment Role */}
        <RoleBasedVideo />
      </div>
      

      {/* Footer */}
      <Footer />
    </div>
  );
};

