import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../stores/authStore';
import { useSolicitarServicioStore } from '../stores/solicitarServicioStore';

export const SolicitarServicioPage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  
  const {
    diasDisponibles,
    tiposServicio,
    restaurantes,
    menus,
    diaSeleccionado,
    tipoServicioSeleccionado,
    restauranteSeleccionado,
    menuSeleccionado,
    declinarBeneficio,
    currentDayIndex,
    completedDays,
    loading,
    error,
    currentStep,
    pedidoRealizado,
    fetchDiasDisponibles,
    fetchTiposServicio,
    fetchRestaurantes,
    fetchMenus,
    realizarPedido,
    selectTipoServicio,
    selectRestaurante,
    selectMenu,
    toggleDeclinarBeneficio,
    nextDay,
    nextStep,
    previousStep,
    clearError,
    reset
  } = useSolicitarServicioStore();

  // Initialize data when component mounts
  useEffect(() => {
    if (user && token && (user.documento || user.sub)) {
      const documentNumber = user.documento || user.sub;
      console.log('SolicitarServicioPage - Using document number:', documentNumber);
      console.log('SolicitarServicioPage - User object:', user);
      fetchDiasDisponibles(token, documentNumber);
      fetchTiposServicio(token, documentNumber);
      fetchRestaurantes(token, documentNumber);
    }
  }, [user, token, fetchDiasDisponibles, fetchTiposServicio, fetchRestaurantes]);

  // Track menu loading separately
  const [isLoadingMenus, setIsLoadingMenus] = useState(false);

  // Fetch menus when restaurant and service type are selected
  useEffect(() => {
    if (user && token && (user.documento || user.sub) && diaSeleccionado && tipoServicioSeleccionado && restauranteSeleccionado) {
      const documentNumber = user.documento || user.sub;
      setIsLoadingMenus(true);
      fetchMenus(
        token,
        documentNumber,
        restauranteSeleccionado.id,
        tipoServicioSeleccionado.id,
        diaSeleccionado.id
      ).finally(() => {
        setIsLoadingMenus(false);
      });
    }
  }, [user, token, diaSeleccionado, tipoServicioSeleccionado, restauranteSeleccionado, fetchMenus]);

  // Handle step navigation
  const handleNextStep = () => {
    if (currentStep === 0 && (menuSeleccionado || declinarBeneficio)) {
      nextStep();
    }
  };

  const handlePreviousStep = () => {
    previousStep();
  };

  const handleConfirmPedido = async () => {
    if (user && token && (user.documento || user.sub) && diaSeleccionado && tipoServicioSeleccionado && restauranteSeleccionado) {
      const documentNumber = user.documento || user.sub;
      
      // If user declined the benefit, send menu_id as 0 and restaurante_id as 1
      // Otherwise send the selected menu id and restaurant id
      const menuId = declinarBeneficio ? 0 : (menuSeleccionado?.id || 0);
      const restauranteId = declinarBeneficio ? 1 : restauranteSeleccionado.id;
      
      await realizarPedido(
        token,
        documentNumber,
        diaSeleccionado.id,
        restauranteId,
        tipoServicioSeleccionado.id,
        menuId,
        diaSeleccionado.fecha
      );
    }
  };

  const handleContinuar = () => {
    if (pedidoRealizado) {
      // Check if there are more days to process
      if (currentDayIndex < diasDisponibles.length - 1) {
        nextDay();
      } else {
        // All days completed, go back to dashboard
        reset();
        navigate('/dashboard');
      }
    } else {
      handleNextStep();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return menuSeleccionado !== null || declinarBeneficio;
      case 1:
        return true;
      default:
        return false;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 0:
        return 'Seleccionar Restaurante, Tipo de Servicio y Menú';
      case 1:
        return 'Confirmar Pedido';
      default:
        return '';
    }
  };

  // Show initial loading only if no data is available yet
  const isInitialLoading = loading && diasDisponibles.length === 0 && tiposServicio.length === 0 && restaurantes.length === 0;
  
  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando datos...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show message when there are no days available
  if (!loading && diasDisponibles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="flex">
          <Sidebar />
          
          <main className="flex-1 p-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">No tienes días habilitados aún</h2>
                <p className="text-gray-600">Por favor, contacta al administrador o vuelve más tarde.</p>
              </div>
            </div>
          </main>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
        <div className="bg-white rounded-lg shadow p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Solicitar Servicio
            </h1>
            <p className="text-gray-600 mb-4">
              Día {currentDayIndex + 1} de {diasDisponibles.length}: {diaSeleccionado?.nombre} - {diaSeleccionado?.fecha}
            </p>
            <p className="text-gray-600">
              Paso {currentStep + 1} de 2: {getStepTitle()}
            </p>
            
            {/* Day Progress */}
            {/* <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progreso de días</span>
                <span className="text-sm text-gray-500">{completedDays.length} de {diasDisponibles.length} completados</span>
              </div>
              <div className="flex items-center space-x-2">
                {diasDisponibles.map((dia, index) => {
                  const status = getDayStatus(index);
                  return (
                    <div key={dia.id} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                        status === 'completed' 
                          ? 'bg-green-600 text-white' 
                          : status === 'current'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {status === 'completed' ? '✓' : index + 1}
                      </div>
                      {index < diasDisponibles.length - 1 && (
                        <div className={`w-8 h-1 mx-1 ${
                          status === 'completed' ? 'bg-green-600' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div> */}
            
            {/* Step Progress */}
            <div className="mt-4">
              <div className="flex items-center">
                {[0, 1].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      step <= currentStep 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step + 1}
                    </div>
                    {step < 1 && (
                      <div className={`w-12 h-1 mx-2 ${
                        step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    {error}
                  </div>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    onClick={clearError}
                    className="text-red-400 hover:text-red-600"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 0: Select Restaurant, Service Type and Menu */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Selecciona restaurante, tipo de servicio y menú</h2>
              
              {/* Selection Row */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
                
                  
                  {/* Restaurant Dropdown */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Restaurante:
                    </label>
                    <select
                      value={restauranteSeleccionado?.id || ''}
                      onChange={(e) => {
                        const selectedId = parseInt(e.target.value);
                        const selectedRestaurant = restaurantes.find(r => r.id === selectedId);
                        if (selectedRestaurant) {
                          selectRestaurante(selectedRestaurant);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecciona un restaurante</option>
                      {restaurantes.map((restaurante) => (
                        <option key={restaurante.id} value={restaurante.id}>
                          {restaurante.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Service Type Dropdown */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Servicio:
                    </label>
                    <select
                      value={tipoServicioSeleccionado?.id || ''}
                      onChange={(e) => {
                        const selectedId = parseInt(e.target.value);
                        const selectedService = tiposServicio.find(t => t.id === selectedId);
                        if (selectedService) {
                          selectTipoServicio(selectedService);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecciona tipo de servicio</option>
                      {tiposServicio.map((tipo) => (
                        <option key={tipo.id} value={tipo.id}>
                          {tipo.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Menu Selection */}
              {tipoServicioSeleccionado && restauranteSeleccionado && (
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-800">Selecciona un menú o declina el beneficio</h3>
                  
                  {/* Decline option */}
                  <div className="mb-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={declinarBeneficio}
                        onChange={toggleDeclinarBeneficio}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-gray-700">Declinar beneficio para este día</span>
                    </label>
                  </div>

                  {/* Menus */}
                  {!declinarBeneficio && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Menús Disponibles</h4>
                      {isLoadingMenus ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                          <p className="text-gray-600">Cargando menús...</p>
                        </div>
                      ) : menus.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                            <svg className="w-12 h-12 mx-auto mb-3 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <p className="text-gray-700 font-medium mb-1">No hay menú para estas opciones</p>
                            <p className="text-gray-600 text-sm">Intenta con otras opciones de restaurante o tipo de servicio</p>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {menus.map((menu) => (
                            <button
                              key={menu.id}
                              onClick={() => selectMenu(menu)}
                              className={`p-4 border rounded-lg text-left transition-colors ${
                                menuSeleccionado?.id === menu.id
                                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <div className="font-medium mb-3">{menu.nombre}</div>
                              <div className="w-full h-32 rounded overflow-hidden bg-gray-100">
                                {menu.foto ? (
                                  <img
                                    src={menu.foto}
                                    alt={menu.nombre}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      // If image fails to load, show placeholder
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      const placeholder = target.nextElementSibling as HTMLElement;
                                      if (placeholder) placeholder.style.display = 'flex';
                                    }}
                                  />
                                ) : null}
                                <div 
                                  className={`w-full h-full flex items-center justify-center text-gray-400 ${
                                    menu.foto ? 'hidden' : 'flex'
                                  }`}
                                >
                                  <div className="text-center">
                                    <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-sm">Sin imagen</p>
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 1: Confirm Order */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Confirmar Pedido</h2>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-md font-medium text-gray-800 mb-4">Resumen del Pedido</h3>
                
                {/* Order Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Día:</span>
                    <span className="font-medium">{diaSeleccionado?.nombre} - {diaSeleccionado?.fecha}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Restaurante:</span>
                    <span className="font-medium">{restauranteSeleccionado?.nombre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipo de Servicio:</span>
                    <span className="font-medium">{tipoServicioSeleccionado?.nombre}</span>
                  </div>
                  {declinarBeneficio ? (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Opción:</span>
                      <span className="font-medium text-red-600">Beneficio Declinado</span>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Menú:</span>
                      <span className="font-medium">{menuSeleccionado?.nombre}</span>
                    </div>
                  )}
                </div>

                {/* Menu Image */}
                {/* {!declinarBeneficio && menuSeleccionado && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Imagen del Menú</h4>
                    <div className="w-full max-w-xs mx-auto">
                      <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                        {menuSeleccionado.foto ? (
                          <img
                            src={menuSeleccionado.foto}
                            alt={menuSeleccionado.nombre}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // If image fails to load, show placeholder
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const placeholder = target.nextElementSibling as HTMLElement;
                              if (placeholder) placeholder.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className={`w-full h-full flex items-center justify-center text-gray-400 ${
                            menuSeleccionado.foto ? 'hidden' : 'flex'
                          }`}
                        >
                          <div className="text-center">
                            <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm">Sin imagen</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )} */}
              </div>

              {pedidoRealizado ? (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">
                        ¡Pedido Realizado Exitosamente!
                      </h3>
                      <div className="mt-2 text-sm text-green-700">
                        Tu pedido ha sido registrado correctamente.
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    ¿Estás seguro de que quieres realizar este pedido?
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            <div className="flex space-x-4">
              
              
              {/* Previous Step Button - Disabled if step is 0 OR if order was already placed for this day */}
              <Button
                onClick={handlePreviousStep}
                disabled={currentStep === 0 || (diaSeleccionado ? completedDays.includes(diaSeleccionado.id) : false)}
                variant="outline"
              >
                Anterior
              </Button>
            </div>
            
            <div className="flex space-x-4">
              {currentStep === 1 && !pedidoRealizado ? (
                <Button
                  onClick={handleConfirmPedido}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? 'Procesando...' : 'Confirmar Pedido'}
                </Button>
              ) : (
                <Button
                  onClick={handleContinuar}
                  disabled={!canProceed() || loading}
                >
                  {pedidoRealizado 
                    ? (currentDayIndex < diasDisponibles.length - 1 ? 'Siguiente Día' : 'Finalizar')
                    : 'Continuar'
                  }
                </Button>
              )}
            </div>
          </div>
        </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};
