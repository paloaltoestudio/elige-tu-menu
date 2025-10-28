import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { LoginCredentials } from '../../types/auth';

const REMEMBER_ME_KEY = 'rememberMe';
const SAVED_USERNAME_KEY = 'savedUsername';

export const LoginForm = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    usuario: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, loading, error, clearError } = useAuthStore();

  // Load saved credentials on mount
  useEffect(() => {
    const savedRememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
    const savedUsername = localStorage.getItem(SAVED_USERNAME_KEY);
    
    if (savedRememberMe && savedUsername) {
      setRememberMe(true);
      setCredentials(prev => ({
        ...prev,
        usuario: savedUsername
      }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    // Basic validation
    if (!credentials.usuario.trim() || !credentials.password.trim()) {
      return;
    }
    
    try {
      await login(credentials);
      
      // Save or clear credentials based on rememberMe checkbox
      if (rememberMe) {
        localStorage.setItem(REMEMBER_ME_KEY, 'true');
        localStorage.setItem(SAVED_USERNAME_KEY, credentials.usuario);
      } else {
        localStorage.removeItem(REMEMBER_ME_KEY);
        localStorage.removeItem(SAVED_USERNAME_KEY);
      }
    } catch (error) {
      // Error is handled by the store
      console.error('Login error:', error);
    }
  };

  const handleInputChange = (field: keyof LoginCredentials) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCredentials(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
    if (error) clearError();
  };

  const handleCancel = () => {
    setCredentials({ usuario: '', password: '' });
    setRememberMe(false);
    clearError();
    // Clear saved credentials when user clicks cancel
    localStorage.removeItem(REMEMBER_ME_KEY);
    localStorage.removeItem(SAVED_USERNAME_KEY);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 w-full max-w-md">
      <h2 className="text-md sm:text-md font-bold text-center text-gray-800 mb-4 sm:mb-6">
        Iniciar Sesión
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <Input
          label="Usuario"
          type="text"
          value={credentials.usuario}
          onChange={handleInputChange('usuario')}
          placeholder="Ingrese su usuario"
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              value={credentials.password}
              onChange={handleInputChange('password')}
              placeholder="Ingrese su contraseña"
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
        
        <div className="flex items-center py-1">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-xs sm:text-sm text-gray-700">
            Recordar datos en este equipo
          </label>
        </div>
        
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
            {loading ? 'Ingresando...' : 'Ingresar'}
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
          onClick={() => navigate('/olvide-contrasena')}
          className="text-xs sm:text-sm text-blue-600 hover:text-blue-500"
        >
          ¿Olvidó la contraseña?
        </button>
      </div>
    </div>
  );
};
