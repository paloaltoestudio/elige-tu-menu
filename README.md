# Elige tu Menú - Universidad de Antioquia

Una aplicación web para que estudiantes y empleados de la Universidad de Antioquia puedan seleccionar su menú semanal del servicio de alimentación.

## Características Principales

### Autenticación y Seguridad
- ✅ Autenticación con JWT
- ✅ Validación de roles (Estudiante/Docente/Usuario)
- ✅ Gestión de sesiones con expiración automática
- ✅ Validación de tokens JWT en tiempo real
- ✅ Protección de rutas
- ✅ Recordar credenciales (solo usuario, no contraseña)
- ✅ Cambio de contraseña desde la aplicación

### Gestión de Pedidos
- ✅ Solicitar servicio de alimentación por día
- ✅ Crear y editar pedidos existentes desde la misma interfaz
- ✅ Selección de restaurante, tipo de servicio y menú
- ✅ Opción para declinar beneficio
- ✅ Validación de disponibilidad de tickets/créditos
- ✅ Visualización de pedidos del ciclo actual
- ✅ Flujo multi-día con navegación secuencial

### Administración de Solicitudes
- ✅ Ver historial de solicitudes realizadas
- ✅ Cancelación de pedidos en horarios habilitados
- ✅ Filtrado por estado y fecha
- ✅ Paginación de resultados

### Experiencia de Usuario
- ✅ Interfaz responsive con Tailwind CSS
- ✅ Tutoriales en video según el rol del usuario
- ✅ Indicadores visuales de edición/creación
- ✅ Mensajes de confirmación y error claros
- ✅ Estado global optimizado con Zustand

## Tecnologías

- **React 19** - Framework de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS
- **Zustand** - Gestión de estado
- **Axios** - Cliente HTTP
- **JWT Decode** - Decodificación de tokens
- **Vite** - Herramienta de build

## Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd Elige-tu-menu
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp env.example .env
```

Edita el archivo `.env` con tus valores:
```
VITE_API_BASE_URL=https://tu-api-url.com
VITE_APP_NAME=Elige tu Menú
```

4. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── auth/           # Componentes de autenticación
│   │   ├── LoginForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── layout/         # Componentes de layout (Header, Sidebar, Footer)
│   └── ui/             # Componentes de UI básicos
├── pages/              # Páginas principales
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── SolicitarServicioPage.tsx    # Crear/Editar pedidos
│   ├── MisSolicitudesPage.tsx       # Historial de solicitudes
│   ├── CancelOrdersPage.tsx         # Cancelación de pedidos
│   ├── ChangePasswordPage.tsx       # Cambio de contraseña
│   └── TutorialPage.tsx             # Videos tutoriales
├── services/           # Servicios de API
│   ├── authService.ts
│   ├── solicitarServicioService.ts
│   ├── solicitudesService.ts
│   └── cancelOrdersService.ts
├── stores/             # Stores de Zustand
│   ├── authStore.ts
│   ├── solicitarServicioStore.ts
│   ├── solicitudesStore.ts
│   └── cancelOrdersStore.ts
├── types/              # Definiciones de TypeScript
├── hooks/              # Custom hooks
└── App.tsx             # Componente principal
```

## API Endpoints

### Autenticación
- `POST /api/ws_eligetumenu/acceder` - Login de usuario
- `POST /api/ws_eligetumenu/cambiar_contrasena` - Cambiar contraseña

### Gestión de Pedidos
- `POST /api/ws_eligetumenu/disponibilidad_servicio_tickets` - Validar tickets activos
- `POST /api/ws_eligetumenu/dias_disponibles_usuario` - Obtener días disponibles
- `POST /api/ws_eligetumenu/listar_pedidos_ciclo_actual` - Listar pedidos del ciclo actual
- `POST /api/ws_eligetumenu/tipos_servicio_x_usuario` - Obtener tipos de servicio
- `POST /api/ws_eligetumenu/listar_restaurantes_usuario` - Listar restaurantes disponibles
- `POST /api/ws_eligetumenu/listar_menus_usuario` - Listar menús disponibles
- `POST /api/ws_eligetumenu/realizar_pedido` - Crear nuevo pedido
- `POST /api/ws_eligetumenu/modificar_pedido` - Editar pedido existente

### Consultas y Cancelaciones
- `POST /api/ws_eligetumenu/listar_solicitudes_usuario` - Listar solicitudes del usuario
- `POST /api/ws_eligetumenu/listar_pedidos_cancelables` - Listar pedidos cancelables
- `POST /api/ws_eligetumenu/cancelar_pedido` - Cancelar un pedido

## Roles de Usuario

- **ESTUDIANTE** - Estudiantes de la universidad
  - Acceso completo al sistema
  - Tutorial específico para estudiantes
  
- **DOCENTE** - Docentes y profesores
  - Acceso completo al sistema
  - Tutorial específico para docentes/empleados
  
- **WEBUSER** - Usuarios web/empleados
  - Acceso completo al sistema
  - Tutorial específico para usuarios

## Páginas y Funcionalidades

### 1. Login
- Validación de credenciales con JWT
- Opción "Recordar datos en este equipo" (solo guarda usuario)
- Validación de roles permitidos
- Redirección automática según estado de autenticación

### 2. Dashboard
- Resumen de información del usuario
- Acceso rápido a las funcionalidades principales

### 3. Solicitar Servicio
- Validación automática de tickets/créditos disponibles
- Carga de pedidos existentes del ciclo actual
- Creación de nuevos pedidos o edición de existentes
- Flujo multi-día con navegación secuencial
- Selección de restaurante, tipo de servicio y menú
- Opción para declinar beneficio
- Indicadores visuales de modo edición
- Confirmación antes de realizar cambios

### 4. Mis Solicitudes
- Historial completo de solicitudes
- Filtrado por estado y fecha
- Paginación de resultados
- Visualización de detalles del pedido

### 5. Cancelación de Pedidos
- Lista de pedidos cancelables según horarios habilitados
- Cancelación con confirmación
- Solo muestra pedidos en ventana de tiempo permitida

### 6. Videos y Tutoriales
- Tutoriales en video según el rol del usuario
- Video específico para estudiantes
- Video específico para docentes/empleados
- Integración con YouTube

### 7. Cambiar Contraseña
- Formulario seguro para cambio de contraseña
- Validación de contraseña actual
- Confirmación de nueva contraseña

## Características Técnicas

### Gestión de Estado
- Zustand para estado global optimizado
- Stores separados por funcionalidad
- Persistencia de sesión en localStorage

### Validaciones
- Validación de tokens JWT en tiempo real
- Auto-logout al expirar la sesión
- Validación de disponibilidad de tickets antes de solicitar servicio
- Validación de campos en formularios

### Experiencia de Usuario
- Diseño responsive (mobile-first)
- Feedback visual en todas las acciones
- Mensajes de error y éxito claros
- Loading states en operaciones asíncronas
- Navegación intuitiva con sidebar

## Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Preview del build
- `npm run lint` - Linting del código

## Desarrollo

Para contribuir al proyecto:

1. Crea una rama feature: `git checkout -b feature/nueva-funcionalidad`
2. Realiza tus cambios
3. Ejecuta los tests: `npm run lint`
4. Commit tus cambios: `git commit -m "feat: nueva funcionalidad"`
5. Push a tu rama: `git push origin feature/nueva-funcionalidad`
6. Crea un Pull Request

## Licencia

Desarrollado para la Universidad de Antioquia por TREDA SOLUTIONS.