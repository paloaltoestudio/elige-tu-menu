import { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../stores/authStore';
import { UserProfileService } from '../services/userProfileService';
import type { UserProfile } from '../types/userProfile';

export const UserProfilePage = () => {
  const { user, token } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    correoElectronico: '',
    telefono: '',
    celular: '',
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    correoElectronico: '',
    telefono: '',
    celular: '',
    general: '',
  });

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user || !token) {
        setError('Usuario no autenticado');
        setFetching(false);
        return;
      }

      const documentNumber = user.documento || user.sub;
      if (!documentNumber) {
        setError('No se pudo obtener el número de documento');
        setFetching(false);
        return;
      }

      try {
        setFetching(true);
        setError(null);
        const response = await UserProfileService.getUserInfo({
          tk: token,
          numero_documento: documentNumber,
        });

        if (response.codigo === 200 && response.perfil) {
          setProfile(response.perfil);
          setFormData({
            correoElectronico: response.perfil.correoElectronico || '',
            telefono: response.perfil.telefono || '',
            celular: response.perfil.celular || '',
          });
        } else {
          setError(response.mensaje || 'Error al obtener información del usuario');
        }
      } catch (err: any) {
        setError(err.message || 'Error al obtener información del usuario');
      } finally {
        setFetching(false);
      }
    };

    fetchUserProfile();
  }, [user, token]);

  const validateForm = () => {
    const errors = {
      correoElectronico: '',
      telefono: '',
      celular: '',
      general: '',
    };

    let isValid = true;

    // Check that at least one field is provided
    const hasAtLeastOneField = 
      (formData.correoElectronico.trim() !== '') ||
      (formData.telefono.trim() !== '') ||
      (formData.celular.trim() !== '');

    if (!hasAtLeastOneField) {
      errors.general = 'Debe proporcionar al menos un campo para actualizar';
      isValid = false;
    }

    // Validate correoElectronico if provided
    if (formData.correoElectronico.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.correoElectronico)) {
        errors.correoElectronico = 'El correo electrónico no es válido';
        isValid = false;
      }
    }

    // Validate telefono if provided
    const telefonoValue = formData.telefono.trim();
    if (telefonoValue) {
      // Check if it contains only numbers
      if (!/^\d+$/.test(telefonoValue)) {
        errors.telefono = 'El teléfono solo debe contener números';
        isValid = false;
      }
      // Check max length
      if (telefonoValue.length != 10) {
        errors.telefono = 'El teléfono debe tener 10 caracteres';
        isValid = false;
      }
    }

    // Validate celular if provided
    const celularValue = formData.celular.trim();
    if (celularValue) {
      // Check if it contains only numbers
      if (!/^\d+$/.test(celularValue)) {
        errors.celular = 'El celular solo debe contener números';
        isValid = false;
      }
      // Check max length
      if (celularValue.length != 10) {
        errors.celular = 'El celular debe tener 10 caracteres';
        isValid = false;
      }
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    
    // For telefono and celular, remove spaces and non-numeric characters
    if (name === 'telefono' || name === 'celular') {
      // Remove all non-numeric characters (spaces, dashes, etc.)
      processedValue = value.replace(/\D/g, '');
      
      // Apply max length limits
      if (name === 'telefono' && processedValue.length > 7) {
        processedValue = processedValue.slice(0, 10);
      } else if (name === 'celular' && processedValue.length > 10) {
        processedValue = processedValue.slice(0, 10);
      }
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    // Clear validation error for this field
    setValidationErrors((prev) => ({
      ...prev,
      [name]: '',
    }));

    // Clear general error
    setError(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSuccess(false);
    setError(null);
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        correoElectronico: profile.correoElectronico || '',
        telefono: profile.telefono || '',
        celular: profile.celular || '',
      });
    }
    setIsEditing(false);
    setError(null);
    setValidationErrors({
      correoElectronico: '',
      telefono: '',
      celular: '',
      general: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!user || !token) {
      setError('Usuario no autenticado');
      return;
    }

    const documentNumber = user.documento || user.sub;
    if (!documentNumber) {
      setError('No se pudo obtener el número de documento');
      return;
    }

    setLoading(true);
    setError(null);

    // Sanitize and validate data before sending
    const telefonoValue = formData.telefono.trim();
    const celularValue = formData.celular.trim();
    
    // Ensure telefono and celular only contain numbers and meet length requirements
    const sanitizedTelefono = telefonoValue && /^\d+$/.test(telefonoValue) && telefonoValue.length <= 10 
      ? telefonoValue 
      : undefined;
    
    const sanitizedCelular = celularValue && /^\d+$/.test(celularValue) && celularValue.length <= 10 
      ? celularValue 
      : undefined;

    // Double-check validation before sending
    if (telefonoValue && (!/^\d+$/.test(telefonoValue) || telefonoValue.length != 10)) {
      setError('El teléfono no cumple con los requisitos (10 números)');
      setLoading(false);
      return;
    }

    if (celularValue && (!/^\d+$/.test(celularValue) || celularValue.length != 10)) {
      setError('El celular no cumple con los requisitos (10 números)');
      setLoading(false);
      return;
    }

    try {
      const response = await UserProfileService.updateUserInfo({
        tk: token,
        numero_documento: documentNumber,
        correo: formData.correoElectronico.trim() || undefined,
        telefono: sanitizedTelefono,
        celular: sanitizedCelular,
      });

      if (response.success === true) {
        // Update profile with new data from form
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                correoElectronico: formData.correoElectronico,
                telefono: formData.telefono,
                celular: formData.celular,
              }
            : null
        );

        setSuccess(true);
        setIsEditing(false);

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else if (response.codigo === '400' || response.codigo === 400) {
        setError(response.mensaje || 'Error al actualizar información del usuario');
      } else {
        setError(response.mensaje || response.message || 'Error al actualizar información del usuario');
      }
    } catch (err: any) {
      setError(err.message || 'Error al actualizar información del usuario');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        <div className="max-w-[1600px] mx-auto">
          <div className="flex">
            <Sidebar
              isMobileMenuOpen={isMobileMenuOpen}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
            />
            <main className="flex-1 p-8">
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Cargando información del usuario...</p>
                </div>
              </div>
            </main>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

      <div className="max-w-[1600px] mx-auto">
        <div className="flex">
          <Sidebar
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />

          <main className="flex-1 p-8">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Información del Perfil
                  </h1>
                  {!isEditing && (
                    <Button
                      type="button"
                      onClick={handleEdit}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <i className="fa-solid fa-pen mr-0 sm:mr-2"></i>
                      <span className="hidden sm:inline">Editar</span>
                    </Button>
                  )}
                </div>

                {/* Success Message */}
                {success && (
                  <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-green-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">
                          ¡Información actualizada exitosamente!
                        </h3>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-red-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error</h3>
                        <div className="mt-2 text-sm text-red-700">{error}</div>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Número de Documento (Read-only) */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Número de Documento
                      </label>
                      <Input
                        type="text"
                        value={user?.documento || user?.sub || ''}
                        disabled
                        className="bg-gray-100 cursor-not-allowed"
                      />
                    </div>

                    {/* Nombre de Usuario (Read-only) */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Nombre de Usuario
                      </label>
                      <Input
                        type="text"
                        value={profile?.nombreUsuario || ''}
                        disabled
                        className="bg-gray-100 cursor-not-allowed"
                      />
                    </div>

                    {/* Nombre Completo (Read-only) */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Nombre Completo
                      </label>
                      <Input
                        type="text"
                        value={profile?.nombreCompleto || ''}
                        disabled
                        className="bg-gray-100 cursor-not-allowed"
                      />
                    </div>

                    {/* Correo Electrónico */}
                    <div>
                      <label htmlFor="correoElectronico" className="block text-sm font-bold text-gray-700 mb-2">
                        Correo Electrónico
                      </label>
                      <Input
                        id="correoElectronico"
                        name="correoElectronico"
                        type="email"
                        value={formData.correoElectronico}
                        onChange={handleInputChange}
                        disabled={!isEditing || loading}
                        error={validationErrors.correoElectronico}
                        placeholder="Opcional"
                      />
                    </div>

                    {/* Teléfono */}
                    <div>
                      <label htmlFor="telefono" className="block text-sm font-bold text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <Input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        disabled={!isEditing || loading}
                        error={validationErrors.telefono}
                        placeholder="Opcional"
                      />
                    </div>

                    {/* Celular */}
                    <div>
                      <label htmlFor="celular" className="block text-sm font-bold text-gray-700 mb-2">
                        Celular
                      </label>
                      <Input
                        id="celular"
                        name="celular"
                        type="tel"
                        value={formData.celular}
                        onChange={handleInputChange}
                        disabled={!isEditing || loading}
                        error={validationErrors.celular}
                        placeholder="Opcional"
                      />
                    </div>
                  </div>

                  {/* General validation error */}
                  {validationErrors.general && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                      <p className="text-sm text-red-700">{validationErrors.general}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex items-center space-x-4 pt-4">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                      </Button>

                      <Button
                        type="button"
                        onClick={handleCancel}
                        variant="outline"
                        disabled={loading}
                      >
                        Cancelar
                      </Button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

