# Elige tu Menú - Universidad de Antioquia

Una aplicación web para que estudiantes y empleados de la Universidad de Antioquia puedan seleccionar su menú semanal.

## Características

- ✅ Autenticación con JWT
- ✅ Validación de roles (Estudiante/Docente)
- ✅ Gestión de sesiones con expiración automática
- ✅ Interfaz responsive con Tailwind CSS
- ✅ Estado global con Zustand
- ✅ Validación de tokens JWT
- ✅ Protección de rutas

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
│   ├── layout/         # Componentes de layout
│   └── ui/             # Componentes de UI básicos
├── pages/              # Páginas principales
├── services/           # Servicios de API
├── stores/             # Stores de Zustand
├── types/              # Definiciones de TypeScript
└── App.tsx             # Componente principal
```

## API Endpoints

### Autenticación
- `POST /api/ws_eligetumenu/acceder` - Login de usuario

**Request:**
```json
{
  "usuario": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "mensaje": "Usuario identificado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Roles de Usuario

- **ESTUDIANTE** - Acceso completo al sistema
- **DOCENTE** - Acceso completo al sistema
- **WEBUSER** - Acceso denegado

## Funcionalidades de Autenticación

1. **Login**: Validación de credenciales
2. **Token Management**: Almacenamiento y validación automática
3. **Session Management**: Expiración automática y limpieza
4. **Role Validation**: Verificación de roles permitidos
5. **Auto Logout**: Redirección automática al login cuando el token expira

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