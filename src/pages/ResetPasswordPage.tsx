import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { AuthService } from '../services/authService';
import { RoleBasedVideo } from '../components/video/RoleBasedVideo';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Get token from URL parameters
  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      // If no token, redirect to login with error message
      navigate('/login', { 
        state: { error: 'El link de recuperación de contraseña ya no aparece activo, intente de nuevo' } 
      });
    } else {
      setToken(tokenParam);
    }
  }, [searchParams, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    
    if (!token) {
      setValidationError('Token no válido');
      return;
    }
    
    // Basic validation
    if (!password.trim() || !confirmPassword.trim()) {
      setValidationError('Por favor complete todos los campos');
      return;
    }
    
    if (password !== confirmPassword) {
      setValidationError('Las contraseñas no coinciden');
      return;
    }
    
    if (password.length < 8) {
      setValidationError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await AuthService.resetPassword({
        tk: token,
        nuevo_password: password,
        confirmar_password: confirmPassword,
      });
      
      if (response.success) {
        // Success - redirect to login with success message
        navigate('/login', { 
          state: { message: 'Contraseña actualizada exitosamente, ya puedes ingresar' } 
        });
      } else {
        // Failure - redirect to login with error message
        navigate('/login', { 
          state: { error: 'El link de recuperación de contraseña ya no aparece activo, intente de nuevo' } 
        });
      }
    } catch (error: any) {
      console.error('Reset password error:', error);
      // Failure - redirect to login with error message
      navigate('/login', { 
        state: { error: 'El link de recuperación de contraseña ya no aparece activo, intente de nuevo' } 
      });
    } finally {
      setLoading(false);
    }
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
          {/* Reset Password Form */}
          <div className="flex justify-center mb-0">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 w-full max-w-md">
              <h2 className="text-md sm:text-md font-bold text-center text-gray-800 mb-4 sm:mb-6">
                Restaurar contraseña
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nueva contraseña
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setValidationError('');
                      }}
                      placeholder="Ingrese su nueva contraseña"
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirme nueva contraseña
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setValidationError('');
                      }}
                      placeholder="Confirme su nueva contraseña"
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                
                {validationError && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-xs sm:text-sm text-red-600">{validationError}</p>
                  </div>
                )}
                
                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? 'Restaurando...' : 'Restaurar contraseña'}
                  </Button>
                </div>
              </form>
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

