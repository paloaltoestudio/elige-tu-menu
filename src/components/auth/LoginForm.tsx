import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { LoginCredentials } from '../../types/auth';

export const LoginForm = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    usuario: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  
  const { login, loading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    // Basic validation
    if (!credentials.usuario.trim() || !credentials.password.trim()) {
      return;
    }
    
    try {
      await login(credentials);
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
    clearError();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-4">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Iniciar Sesión
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Usuario"
          type="text"
          value={credentials.usuario}
          onChange={handleInputChange('usuario')}
          placeholder="Ingrese su usuario"
          required
        />
        
        <Input
          label="Contraseña"
          type="password"
          value={credentials.password}
          onChange={handleInputChange('password')}
          placeholder="Ingrese su contraseña"
          required
        />
        
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
            Recordar datos en este equipo
          </label>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        
        <div className="flex space-x-3">
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={handleCancel}
          >
            Cancelar
          </Button>
        </div>
      </form>
      
      <div className="mt-4 text-center">
        <a
          href="#"
          className="text-sm text-blue-600 hover:text-blue-500"
        >
          ¿Olvidó la contraseña?
        </a>
      </div>
    </div>
  );
};
