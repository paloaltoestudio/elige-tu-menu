import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../stores/authStore';
import { useSolicitarServicioStore } from '../stores/solicitarServicioStore';
import { formatDateToSpanish } from '../utils/dateFormat';

export const SolicitarServicioPage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Track if we've already preselected the menu for the current day
  const hasPreselectedMenuRef = useRef<number | null>(null);
  
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
    hasActiveTickets,
    serviceAvailabilityDate,
    isEditingDay,
    getExistingOrderForDay,
    preloadDataForDay,
    checkTicketAvailability,
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

  // Track if this is the initial mount (automatically reset to true on each mount)
  const isInitialMount = useRef(true);

  // Track menu loading separately
  const [isLoadingMenus, setIsLoadingMenus] = useState(false);

  // Track if service availability banner is dismissed
  const [isServiceBannerDismissed, setIsServiceBannerDismissed] = useState(false);

  // Track the last fetch key to prevent duplicate fetches
  const lastFetchKey = useRef<string | null>(null);

  // Cleanup when component unmounts (navigating away)
  useEffect(() => {
    return () => {
      // Reset all state and refs when leaving the page for a clean UI on return
      reset();
      hasPreselectedMenuRef.current = null;
      lastFetchKey.current = null;
      isInitialMount.current = true;
      setIsLoadingMenus(false);
    };
  }, [reset]);

  // Check ticket availability first when component mounts AND when day changes
  useEffect(() => {
    if (user && token && (user.documento || user.sub)) {
      const documentNumber = user.documento || user.sub;
      checkTicketAvailability(token, documentNumber);
    }
  }, [user, token, diaSeleccionado?.id, checkTicketAvailability]);

  // Initialize data when component mounts (regardless of tickets)
  // Fetch all data and then preload the first day's data
  useEffect(() => {
    const initializeData = async () => {
      if (user && token && (user.documento || user.sub)) {
        const documentNumber = user.documento || user.sub;
        
        // Fetch all data in parallel
        await Promise.all([
          fetchDiasDisponibles(token, documentNumber),
          fetchTiposServicio(token, documentNumber),
          fetchRestaurantes(token, documentNumber)
        ]);
        
        // After all data is loaded, preload the first day if it exists
        const state = useSolicitarServicioStore.getState();
        if (state.diaSeleccionado) {
          preloadDataForDay(state.diaSeleccionado);
        }
      }
    };
    
    initializeData();
  }, [user, token, fetchDiasDisponibles, fetchTiposServicio, fetchRestaurantes, preloadDataForDay]);

  // Reset preselection flag on mount and when day, restaurant, or service type changes
  // This ensures menu gets preselected when user comes back to the page
  useEffect(() => {
    hasPreselectedMenuRef.current = null;
  }, [diaSeleccionado?.id, restauranteSeleccionado?.id, tipoServicioSeleccionado?.id]);

  // Fetch menus when restaurant and service type are selected
  // Only fetch if user has tickets OR has an existing order for this day
  useEffect(() => {
    if (user && token && (user.documento || user.sub) && 
        diaSeleccionado && tipoServicioSeleccionado && restauranteSeleccionado) {
      const documentNumber = user.documento || user.sub;
      
      // Check if user has existing order for this day with a menu (not declined)
      const existingOrder = diaSeleccionado ? getExistingOrderForDay(diaSeleccionado.id) : null;
      const hasExistingOrderWithMenu = existingOrder && parseInt(existingOrder.id_menu) !== 0;
      
      // Only fetch menus if user has tickets OR has an existing order with a menu
      if (hasActiveTickets || hasExistingOrderWithMenu) {
        // Create a unique key for this fetch to prevent duplicates
        const fetchKey = `${restauranteSeleccionado.id}-${tipoServicioSeleccionado.id}-${diaSeleccionado.id}`;
        
        // Only fetch if this is a different combination or first mount
        if (lastFetchKey.current !== fetchKey || isInitialMount.current) {
          lastFetchKey.current = fetchKey;
          isInitialMount.current = false;
          
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
      }
    }
  }, [user, token, diaSeleccionado, tipoServicioSeleccionado, restauranteSeleccionado, hasActiveTickets, getExistingOrderForDay, fetchMenus]);

  // Preselect menu if this day has an existing order (only once per day)
  useEffect(() => {
    if (diaSeleccionado && menus.length > 0 && !declinarBeneficio) {
      // Only preselect if we haven't already done it for this day
      if (hasPreselectedMenuRef.current !== diaSeleccionado.id) {
        const existingOrder = getExistingOrderForDay(diaSeleccionado.id);
        
        if (existingOrder) {
          const existingMenuId = parseInt(existingOrder.id_menu);
          // Only preselect menu if it's not a "declined benefit" order (menu_id !== 0)
          if (existingMenuId !== 0) {
            const menu = menus.find(m => m.id === existingMenuId);
            if (menu) {
              // Only select if not already selected to avoid unnecessary updates
              if (menuSeleccionado?.id !== menu.id) {
                selectMenu(menu);
              }
              // Mark that we've preselected for this day
              hasPreselectedMenuRef.current = diaSeleccionado.id;
            }
          }
        } else {
          // No existing order, mark as done so we don't keep checking
          hasPreselectedMenuRef.current = diaSeleccionado.id;
        }
      }
    }
  }, [diaSeleccionado, menus, getExistingOrderForDay, selectMenu, declinarBeneficio, menuSeleccionado]);

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
        <div className="bg-white rounded-lg shadow p-6">

        {/* Service Availability Banner */}
        {serviceAvailabilityDate && !isServiceBannerDismissed && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm text-gray-900 font-medium">
                    Servicio disponible hasta {formatDateToSpanish(serviceAvailabilityDate)}
                  </p>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    onClick={() => setIsServiceBannerDismissed(true)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Header */}
          <div className="mb-3">
            <div className="flex justify-between gap-2 mb-2">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                Solicitar Servicio
              </h1>
              {diaSeleccionado && isEditingDay(diaSeleccionado.id) && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Editando <span className="hidden md:inline ml-1"> pedido</span>
                </span>
              )}
            </div>
            <p className="text-gray-600 mb-4">
             {diaSeleccionado?.nombre} - {diaSeleccionado?.fecha ? formatDateToSpanish(diaSeleccionado.fecha) : ''}
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
              <h2 className="text-md font-semibold text-gray-900">Selecciona restaurante, tipo de servicio y menú</h2>
              
              {/* No Tickets Warning - Show for NEW orders OR editing orders with declined benefit (menu_id = 0) */}
              {!hasActiveTickets && diaSeleccionado && (
                !isEditingDay(diaSeleccionado.id) || 
                (() => {
                  const existingOrder = getExistingOrderForDay(diaSeleccionado.id);
                  return existingOrder && parseInt(existingOrder.id_menu) === 0;
                })()
              ) && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700 font-medium">
                        Actualmente no posee ningún día para realizar pedidos
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {hasActiveTickets && (
              <>
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
                    <div className="mb-4 decline hover:bg-gray-50">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={declinarBeneficio}
                          onChange={toggleDeclinarBeneficio}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded scale-125"
                        />
                        <span className="text-gray-700 uppercase">Rechazar beneficio para este día</span>
                      </label>
                    </div>

                    {/* Menus - Only show if user has tickets OR is editing existing order with a menu (not declined) */}
                    {!declinarBeneficio && (
                      hasActiveTickets || 
                      (diaSeleccionado && isEditingDay(diaSeleccionado.id) && (() => {
                        const existingOrder = getExistingOrderForDay(diaSeleccionado.id);
                        return existingOrder && parseInt(existingOrder.id_menu) !== 0;
                      })())
                    ) && (
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
                            {menus.map((menu) => {
                              const isSelected = menuSeleccionado?.id === menu.id;
                              return (
                              <button
                                key={menu.id}
                                onClick={() => selectMenu(menu)}
                                className={`p-4 border rounded-lg text-left transition-colors ${
                                  isSelected
                                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                <div className="font-medium mb-3">{menu.nombre}</div>
                                <div
                                  className="text-sm text-gray-600 mb-3 whitespace-pre-line"
                                >
                                  {menu.descripcion?.replace(/\\r\\n|\\n|\\r/g, '\n')}
                                </div>
                                <div className="w-full h-32 rounded overflow-hidden bg-gray-100">
                                  <img
                                    src={menu.foto || '/lunch_placeholder.jpg'}
                                    alt={menu.nombre}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      // If image fails to load, use placeholder
                                      const target = e.target as HTMLImageElement;
                                      target.src = '/lunch_placeholder.jpg';
                                    }}
                                  />
                                </div>
                              </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
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
                  <div className="flex flex-col sm:flex-row justify-between">
                    <span className="text-gray-600">Día:</span>
                    <span className="font-medium">{diaSeleccionado?.nombre} - {diaSeleccionado?.fecha ? formatDateToSpanish(diaSeleccionado.fecha) : ''}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between">
                    <span className="text-gray-600">Restaurante:</span>
                    <span className="font-medium">{restauranteSeleccionado?.nombre}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between">
                    <span className="text-gray-600">Tipo de Servicio:</span>
                    <span className="font-medium">{tipoServicioSeleccionado?.nombre}</span>
                  </div>
                  {declinarBeneficio ? (
                    <div className="flex flex-col sm:flex-row justify-between">
                      <span className="text-gray-600">Opción:</span>
                      <span className="font-medium text-red-600">Servicio no solicitado</span>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row justify-between">
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
                        {diaSeleccionado && isEditingDay(diaSeleccionado.id) ? '¡Pedido Actualizado Exitosamente!' : '¡Pedido Realizado Exitosamente!'}
                      </h3>
                      <div className="mt-2 text-sm text-green-700">
                        {diaSeleccionado && isEditingDay(diaSeleccionado.id) 
                          ? 'Tu pedido ha sido actualizado correctamente.' 
                          : 'Tu pedido ha sido registrado correctamente.'}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    {diaSeleccionado && isEditingDay(diaSeleccionado.id) 
                      ? '¿Estás seguro de que quieres actualizar este pedido?' 
                      : '¿Estás seguro de que quieres realizar este pedido?'}
                  </p>
                </div>
              )}
            </div>
          )}
          {hasActiveTickets && (
            <>
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
                    {loading ? 'Procesando...' : (diaSeleccionado && isEditingDay(diaSeleccionado.id) ? 'Confirmar Cambios' : 'Confirmar Pedido')}
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
            </>
          )}
        </div>
        </main>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};
