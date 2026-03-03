# Frontend - Plataforma de Capacitación y Apoyo para Socios

Este proyecto es el frontend de la plataforma de capacitación, desarrollado con **Next.js 14 + React 18 + Tailwind CSS**.

---

## 🛠 Stack Tecnológico

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| Next.js | 14.2.0 | Framework React con SSR y routing |
| React | 18.3.0 | Biblioteca UI |
| TypeScript | 5.5+ | Tipado estático |
| Tailwind CSS | 3.4+ | Framework de estilos |
| node-appwrite | 14.0+ | SDK de Appwrite |
| Radix UI | 1.0+ | Componentes UI accesibles |
| Lucide React | 0.400+ | Iconos SVG |
| Recharts | 2.12+ | Gráficos y visualizaciones |
| React Hook Form | 7.51+ | Formularios y validación |
| Zod | 3.23+ | Validación de esquemas |

---

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/                    # Páginas de Next.js (App Router)
│   │   ├── globals.css        # Estilos globales
│   │   ├── layout.tsx         # Layout principal
│   │   ├── page.tsx           # Página de inicio
│   │   ├── login/             # Página de login
│   │   ├── dashboard/         # Dashboard
│   │   ├── capacitaciones/     # Módulo de capacitaciones
│   │   ├── eventos/            # Módulo de eventos
│   │   ├── material-pop/        # Módulo de material POP
│   │   ├── planes/             # Módulo de planes
│   │   ├── demos/              # Módulo de demos
│   │   ├── perfil/             # Módulo de perfil
│   │   └── admin/             # Panel de administración
│   │
│   ├── components/             # Componentes UI reutilizables
│   │   ├── ui/               # Componentes base (Button, Card, etc.)
│   │   ├── layout/            # Layout components (Header, Sidebar)
│   │   ├── dashboard/         # Dashboard components
│   │   ├── capacitaciones/     # Capacitaciones components
│   │   ├── eventos/            # Eventos components
│   │   ├── material-pop/        # Material POP components
│   │   ├── planes/             # Planes components
│   │   ├── demos/              # Demos components
│   │   ├── perfil/             # Perfil components
│   │   └── admin/             # Admin components
│   │
│   ├── lib/                    # Utilidades y helpers
│   │   ├── appwrite/          # Cliente de Appwrite
│   │   └── utils/            # Funciones utilitarias
│   │
│   ├── types/                  # Definiciones de TypeScript
│   └── styles/                 # Estilos específicos
│
├── public/                     # Archivos estáticos
├── .env.example               # Variables de entorno ejemplo
├── package.json                # Dependencias del proyecto
├── tailwind.config.ts          # Configuración de Tailwind
├── tsconfig.json              # Configuración de TypeScript
├── next.config.js             # Configuración de Next.js
├── postcss.config.js           # Configuración de PostCSS
└── README.md                 # Este archivo
```

---

## 🚀 Guía de Instalación

### Prerrequisitos

- Node.js 18+ y npm
- Cuenta en Appwrite configurada
- Project ID y API Key de Appwrite

### Paso 1: Clonar el proyecto

```bash
git clone https://github.com/tu-usuario/plataforma-capacitacion-frontend.git
cd plataforma-capacitacion-frontend
```

### Paso 2: Instalar dependencias

```bash
npm install
```

### Paso 3: Configurar variables de entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus configuraciones
nano .env
```

Variables requeridas:
```
NEXT_PUBLIC_APPWRITE_ENDPOINT=http://tu-appwrite-url/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_APPWRITE_API_KEY=tu_api_key_frontend
NEXT_PUBLIC_APPWRITE_DATABASE_ID=plataforma_capacitacion
```

### Paso 4: Iniciar servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:3000`

---

## 📋 Sistema de Diseño

### Colores

```css
--color-primary: #3B82F6        /* Azul principal */
--color-secondary: #F59E0B      /* Naranja */
--color-tertiary: #10B981        /* Verde */
--color-success: #22C55E        /* Verde (estado) */
--color-warning: #F59E0B        /* Amarillo (estado) */
--color-error: #EF4444          /* Rojo (estado) */
```

### Tipografía

- **Fuentes**: Inter, Poppins (cargadas desde Google Fonts)
- **Tamaños**: 
  - H1: 40px
  - H2: 32px
  - H3: 24px
  - H4: 20px
  - H5: 18px
  - H6: 16px
  - Body: 16px
  - Small: 14px
  - XS: 12px

### Componentes UI

#### Botones

Variantes disponibles:
- **primary**: Azul, acción principal
- **secondary**: Naranja, acción secundaria
- **outline**: Borde azul, acción alternativa
- **ghost**: Transparente, acción sutil

Tamaños:
- **sm**: Pequeño
- **md**: Mediano (por defecto)
- **lg**: Grande

Ejemplo:
```tsx
<Button variant="primary" size="md">
  Inscribirme
</Button>
```

#### Cards

Estilos:
- Bordes redondeados (rounded-xl)
- Sombras suaves (shadow-sm hover:shadow-md)
- Padding generoso (p-6)
- Transiciones suaves (duration-200)

#### Layouts

- **Header**: Navegación principal
- **Sidebar**: Menú lateral responsive
- **Footer**: Información del footer

---

## 🔐 Integración con Appwrite

### Cliente de Appwrite

Ubicación: [`src/lib/appwrite/client.ts`](src/lib/appwrite/client.ts)

Funciones principales:
- **Autenticación**: login, logout, create account
- **Base de datos**: list, get, create, update, delete
- **Storage**: getFilePreview, getFileDownload

### Contexto de Autenticación

El sistema de autenticación usa Context API de React para manejar:
- Usuario logueado
- Credenciales (email, password)
- Session actual
- Funciones de login/logout

---

## 📄 Módulos de la Aplicación

### 1. Autenticación

**Rutas**:
- `/login` - Página de login
- `/recuperar` - Recuperación de contraseña
- `/primer-acceso` - Primer acceso (cambio de contraseña)

**Componentes**:
- LoginForm
- ForgotPasswordForm
- ChangePasswordForm

### 2. Dashboard

**Ruta**: `/dashboard`

**Características**:
- Bienvenida personalizada
- Barra de progreso de capacitaciones
- Próximos eventos
- Continúa viendo (videos)
- Material reciente
- Novedades

### 3. Capacitaciones

**Rutas**:
- `/capacitaciones` - Lista de capacitaciones
- `/capacitaciones/[slug]` - Detalle de video

**Componentes**:
- CategoryFilter
- VideoCard
- VideoPlayer
- ProgressIndicator
- MaterialDownload

### 4. Eventos

**Rutas**:
- `/eventos` - Calendario de eventos
- `/eventos/[slug]` - Detalle de evento
- `/eventos/mis-inscripciones` - Mis inscripciones

**Componentes**:
- CalendarView (semanal/mensual)
- EventCard
- EventDetail
- RegistrationButton
- RecordingList

### 5. Material POP

**Rutas**:
- `/material-pop` - Lista de material
- `/material-pop/[slug]` - Detalle de material

**Componentes**:
- CategoryFilter
- MaterialCard
- FilePreview
- DownloadButton
- FavoriteButton
- SearchBar

### 6. Planes

**Rutas**:
- `/planes` - Comparador de planes
- `/planes/[slug]` - Detalle de plan

**Componentes**:
- PlanComparisonCard
- PlanDetail
- FeatureList
- ComparisonTable

### 7. Demos

**Rutas**:
- `/demos` - Lista de demos
- `/demos/[slug]` - Detalle de demo

**Componentes**:
- DemoCard
- DemoPlayer
- ScriptDownload
- RequestLiveDemo

### 8. Perfil

**Rutas**:
- `/perfil` - Datos personales
- `/perfil/progreso` - Progreso en capacitaciones
- `/perfil/favoritos` - Material favorito

**Componentes**:
- ProfileForm
- ProgressChart
- FavoritesList
- SettingsPanel

### 9. Panel de Administración

**Rutas**:
- `/admin` - Dashboard de admin
- `/admin/usuarios` - CRUD de usuarios (ADMIN)
- `/admin/videos` - CRUD de videos (ASESOR/ADMIN)
- `/admin/eventos` - CRUD de eventos (ASESOR/ADMIN)
- `/admin/material` - CRUD de material (ASESOR/ADMIN)
- `/admin/planes` - Gestión de planes (ADMIN)
- `/admin/demos` - Gestión de demos (ASESOR/ADMIN)
- `/admin/estadisticas` - Métricas (ASESOR/ADMIN)

**Componentes**:
- AdminLayout
- CRUDTable
- StatsCard
- MetricChart

---

## 🎨 Sistema de Diseño en Componentes

### Principios

1. **Consistencia**: Usar las mismas variantes y tamaños en todos los componentes
2. **Accesibilidad**: Atributos ARIA, foco visible, contraste adecuado
3. **Responsividad**: Mobile-first, breakpoints de Tailwind
4. **Performance**: Lazy loading de componentes pesados, optimización de imágenes
5. **UX**: Feedback visual (loading states, hover effects, transitions)

### Convenciones de Nombres

- **Componentes**: PascalCase (Button, Card, etc.)
- **Utilidades**: camelCase (formatDate, validateEmail, etc.)
- **Constantes**: UPPER_SNAKE_CASE (API_ENDPOINT, COLLECTIONS, etc.)
- **Interfaces**: PascalCase con prefijo I (ButtonProps, User, etc.)

### Clases de Tailwind

Usar las clases de Tailwind para estilos, no CSS inline:

```tsx
// ✅ Bueno
<div className="bg-white rounded-xl shadow-sm p-6">

// ❌ Malo
<div style={{ backgroundColor: 'white', borderRadius: '12px' }}>
```

---

## 🔧 Scripts Disponibles

| Comando | Descripción |
|---------|-----------|
| `npm run dev` | Iniciar servidor de desarrollo (http://localhost:3000) |
| `npm run build` | Crear build de producción |
| `npm start` | Iniciar servidor de producción |
| `npm run lint` | Ejecutar linter de ESLint |
| `npm run format` | Formatear código con Prettier |
| `npm run type-check` | Verificar tipos de TypeScript |

---

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile First */
sm: 640px   /* Mobile */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large Desktop */
2xl: 1536px  /* Extra Large */
```

### Adaptaciones

- **Sidebar**: Oculta en mobile (menú hamburguesa), visible en desktop
- **Grid**: 1 columna (mobile) → 3-4 columnas (desktop)
- **Calendario**: Lista (mobile) → Grid (desktop)
- **Tablas**: Scroll horizontal (mobile) → Normal (desktop)

---

## 🧪 Animaciones y Transiciones

### Duraciones

- Fade: 200ms
- Scale: 300ms
- Slide: 300ms
- Color: 200ms

### Easing

- `ease-in-out` para la mayoría de transiciones

### Clases de Animación

```css
.animate-fadeIn    /* Fade in suave */
.animate-slideIn   /* Slide desde la izquierda */
.animate-scaleIn   /* Scale con fade */
```

---

## 🔒 Seguridad

### Variables de Entorno

Todas las variables sensibles deben estar en `.env` y **NO** en commits:
- API Keys
- Database IDs
- URLs de producción

### Validaciones

- Validación de formularios en el cliente (React Hook Form + Zod)
- Validación adicional en el servidor
- Sanitización de inputs

### CORS y Headers

Configurado en `next.config.js`:
- Headers de seguridad (X-Content-Type-Options, X-Frame-Options)
- Rewrites para APIs de Appwrite

---

## 📊 Estado Global

El estado de la aplicación se maneja con:

### Contextos
1. **AuthContext**: Estado de autenticación (usuario, sesión, login/logout)
2. **ThemeContext**: Tema de la aplicación (light/dark, si aplica)

### Hooks Personalizados

- `useAuth()` - Acceso al contexto de autenticación
- `useAppwrite()` - Acceso a cliente de Appwrite
- `useToast()` - Notificaciones toast
- `useModal()` - Gestión de modales

---

## 🐛 Debugging

### Herramientas

- **React DevTools** - Para inspeccionar componentes y state
- **Next.js DevTools** - Para debugging de SSR y routing
- **Tailwind CSS IntelliSense** - Para autocompletado de clases

### Console Logs

```javascript
// Logging en desarrollo
if (process.env.NODE_ENV === 'development') {
  console.log('API Request:', data);
}
```

---

## 🚀 Build para Producción

### Optimizaciones Activas

1. **Tree shaking** - Eliminado código no usado
2. **Code splitting** - Lazy loading de rutas y componentes
3. **Image optimization** - Optimización automática de Next.js
4. **Minificación** - CSS y JS en producción
5. **Prefetching** - Prefetch de rutas con Link de Next.js

### Comandos

```bash
# Crear build optimizado
npm run build

# Verificar tamaño del build
npm run build -- --profile

# Analizar bundle
npx @next/bundle-analyzer
```

---

## 📦 Despliegue

### Opciones de Hosting

1. **Vercel** (Recomendado para Next.js)
2. **Netlify**
3. **DigitalOcean App Platform**
4. **AWS Amplify**
5. **Google Cloud Run**

### Variables de Entorno en Producción

Asegurar de configurar:
- `NEXT_PUBLIC_APPWRITE_ENDPOINT` - URL de Appwrite en producción
- `NEXT_PUBLIC_APPWRITE_PROJECT_ID` - Project ID real
- `NEXT_PUBLIC_APPWRITE_API_KEY` - API Key de producción
- `NEXT_PUBLIC_APP_PROD_URL` - URL base de la aplicación

---

## 📚 Recursos y Documentación

### Documentación Oficial

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Appwrite Documentation](https://appwrite.io/docs)
- [Radix UI](https://www.radix-ui.com/)
- [Recharts](https://recharts.org/)

### Tutoriales Útiles

- [Next.js App Router](https://nextjs.org/docs/app/building-your-application/routing)
- [React Context API](https://react.dev/reference/react/useContext)
- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)

---

## ✅ Checklist de Desarrollo

### Antes de Iniciar

- [ ] Node.js 18+ instalado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Variables de entorno configuradas (`.env`)
- [ ] Appwrite configurado (backend)
- [ ] Project ID y API Key obtenidos

### Desarrollo de Módulos

- [ ] Autenticación y login
- [ ] Dashboard principal
- [ ] Módulo de Capacitaciones
- [ ] Módulo de Eventos
- [ ] Módulo de Material POP
- [ ] Módulo de Planes
- [ ] Módulo de Demos
- [ ] Módulo de Perfil
- [ ] Panel de Administración

### Testing y QA

- [ ] Testing de componentes UI
- [ ] Testing de integración con Appwrite
- [ ] Testing de responsive design
- [ ] Testing de accesibilidad
- [ ] Performance testing

### Pre-lanzamiento

- [ ] Limpieza de código
- [ ] Optimización de imágenes
- [ ] Verificación de SEO
- [ ] Testing en múltiples navegadores
- [ ] Build de producción exitosa
- [ ] Despliegue en hosting

---

**FIN DEL README**
