# 🚀 Plataforma de Capacitación para Socios

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Appwrite](https://img.shields.io/badge/Appwrite-1.5-pink?style=flat-square&logo=appwrite)](https://appwrite.io/)

Plataforma web completa de capacitación y apoyo para socios comerciales. Incluye módulos de capacitaciones en video, eventos, material POP, planes y demos, con un panel de administración completo.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Comandos Disponibles](#-comandos-disponibles)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Módulos](#-módulos)
- [Roles de Usuario](#-roles-de-usuario)
- [Despliegue](#-despliegue)
- [Documentación](#-documentación)
- [Licencia](#-licencia)

---

## ✨ Características

### Módulos Principales
- 📹 **Capacitaciones**: Videos con tracking de progreso, categorías y materiales de apoyo
- 📅 **Eventos**: Webinars, talleres y masterclasses con inscripciones
- 📦 **Material POP**: Descarga de materiales de marketing y ventas
- 💳 **Planes**: Comparador de planes del software contable
- 🎬 **Demos**: Videos de demostración con guiones y checklists

### Sistema de Usuarios
- 🔐 Autenticación completa (registro, login, recuperación de contraseña)
- 👥 Roles de usuario (SOCIO, ASESOR, ADMIN)
- 👤 Perfiles de usuario con avatar

### Panel de Administración
- 📊 Dashboard con estadísticas
- 👥 Gestión de usuarios
- 🎥 CRUD de videos
- 📅 CRUD de eventos
- 📦 CRUD de materiales

### Tecnologías
- ⚡ Next.js 14 con App Router
- 💙 TypeScript
- 🎨 Tailwind CSS
- 🔧 Appwrite (Backend as a Service)
- 📊 Recharts para gráficos

---

## 📦 Requisitos Previos

- **Node.js** >= 18.17.0
- **npm** >= 9.0.0 o **pnpm** >= 8.0.0
- **Appwrite** (Cloud o self-hosted en VPS)
- **Cuenta en Vercel** (para deploy) o servidor propio

---

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/jorgeoscar84/Apoyo-a-socio-plataforma.git
cd Apoyo-a-socio-plataforma
```

### 2. Instalar dependencias del frontend

```bash
cd frontend
npm install
```

### 3. Configurar variables de entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env.local

# Editar con tus valores
nano .env.local
```

### 4. Iniciar servidor de desarrollo

```bash
npm run dev
```

El proyecto estará disponible en `http://localhost:3000`

---

## ⚙️ Configuración

### Variables de Entorno del Frontend

Crea un archivo `.env.local` en la carpeta `frontend/` con las siguientes variables:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://tu-appwrite-url.com/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=tu-project-id

# Collection IDs
NEXT_PUBLIC_COLLECTION_USUARIOS=usuarios_collection_id
NEXT_PUBLIC_COLLECTION_VIDEOS=videos_collection_id
NEXT_PUBLIC_COLLECTION_CATEGORIAS=categorias_collection_id
NEXT_PUBLIC_COLLECTION_PROGRESO=progreso_collection_id
NEXT_PUBLIC_COLLECTION_EVENTOS=eventos_collection_id
NEXT_PUBLIC_COLLECTION_INSCRIPCIONES=inscripciones_collection_id
NEXT_PUBLIC_COLLECTION_MATERIALES=materiales_collection_id
NEXT_PUBLIC_COLLECTION_DESCARGAS=descargas_collection_id
NEXT_PUBLIC_COLLECTION_FAVORITOS=favoritos_collection_id
NEXT_PUBLIC_COLLECTION_PLANES=planes_collection_id
NEXT_PUBLIC_COLLECTION_DEMOS=demos_collection_id

# Storage Buckets
NEXT_PUBLIC_BUCKET_VIDEOS=videos_bucket_id
NEXT_PUBLIC_BUCKET_MATERIALES=materiales_bucket_id
NEXT_PUBLIC_BUCKET_GENERAL=general_bucket_id
```

### Configuración de Appwrite

1. **Crear proyecto en Appwrite Console**
2. **Ejecutar script de inicialización**:
   ```bash
   cd backend/database
   # Configurar APPWRITE_ENDPOINT y APPWRITE_PROJECT_ID
   node init-collections.js
   ```
3. **Crear buckets de storage**:
   - `videos` - Para thumbnails de videos
   - `materiales` - Para archivos de material POP
   - `general` - Para imágenes generales

Ver documentación detallada en [`backend/database/schema.md`](backend/database/schema.md)

---

## 📜 Comandos Disponibles

### Frontend

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo (localhost:3000)

# Producción
npm run build        # Compila para producción
npm run start        # Inicia servidor de producción
npm run lint         # Ejecuta ESLint

# Instalación
npm install          # Instala dependencias
```

### Backend (Docker)

```bash
# En backend/config/appwrite/
docker-compose up -d        # Iniciar Appwrite
docker-compose down         # Detener Appwrite
docker-compose logs -f      # Ver logs
docker-compose restart      # Reiniciar servicios
```

### Scripts de Base de Datos

```bash
# En backend/database/
node init-collections.js    # Crear colecciones en Appwrite
node seed-data.js           # Insertar datos de prueba
```

---

## 📁 Estructura del Proyecto

```
Apoyo-a-socio-plataforma/
├── 📁 backend/
│   ├── 📁 config/appwrite/     # Configuración Docker Appwrite
│   ├── 📁 database/            # Schema y scripts de BD
│   ├── 📁 functions/           # Appwrite Functions
│   ├── 📁 scripts/             # Scripts de utilidad
│   └── 📁 docs/                # Documentación backend
├── 📁 frontend/
│   ├── 📁 src/app/             # Páginas (App Router)
│   │   ├── 📁 admin/           # Panel administración
│   │   ├── 📁 capacitaciones/  # Módulo capacitaciones
│   │   ├── 📁 eventos/         # Módulo eventos
│   │   ├── 📁 material/        # Módulo material POP
│   │   ├── 📁 planes/          # Módulo planes
│   │   └── 📁 demos/           # Módulo demos
│   ├── 📁 components/          # Componentes React
│   │   ├── 📁 admin/           # Componentes admin
│   │   ├── 📁 ui/              # Componentes UI base
│   │   └── 📁 ...              # Otros componentes
│   ├── 📁 lib/                 # Utilidades y cliente Appwrite
│   └── 📁 public/              # Archivos estáticos
├── 📄 PRD-Plataforma-Capacitacion-Socios-v3.md
├── 📄 plan-ejecucion-codificacion.md
├── 📄 CONTEXTO_PROYECTO.md
└── 📄 README.md
```

---

## 🧩 Módulos

### Capacitaciones
- Lista de videos con filtros por categoría
- Reproductor de video con tracking de progreso
- Materiales de apoyo descargables
- Videos destacados

### Eventos
- Calendario de eventos
- Inscripción/desinscripción
- Recordatorios por email
- Grabaciones de eventos pasados

### Material POP
- Catálogo de materiales de marketing
- Descarga de archivos
- Sistema de favoritos
- Filtros por categoría

### Planes
- Comparador de planes del software
- Características detalladas
- Brochure PDF descargable

### Demos
- Videos de demostración
- Guiones y checklists
- Contador de vistas

---

## 👥 Roles de Usuario

| Rol | Permisos |
|-----|----------|
| **SOCIO** | Ver contenido, inscribirse a eventos, descargar materiales, marcar favoritos |
| **ASESOR** | Todo lo anterior + Crear/editar videos, eventos y materiales |
| **ADMIN** | Acceso total + Gestión de usuarios + Estadísticas |

---

## 🚀 Despliegue

### Vercel (Recomendado para desarrollo)

1. Conectar repositorio en Vercel
2. Configurar variables de entorno en Vercel Dashboard
3. Deploy automático en cada push a main

### VPS (Producción)

1. Configurar Appwrite en el VPS:
   ```bash
   cd backend/config/appwrite
   # Configurar .env
   docker-compose up -d
   ```

2. Build y deploy del frontend:
   ```bash
   cd frontend
   npm run build
   # Usar PM2 o similar para servir
   ```

Ver [`backend/README.md`](backend/README.md) para instrucciones detalladas.

---

## 📚 Documentación

- [`CONTEXTO_PROYECTO.md`](CONTEXTO_PROYECTO.md) - Contexto completo del proyecto
- [`PRD-Plataforma-Capacitacion-Socios-v3.md`](PRD-Plataforma-Capacitacion-Socios-v3.md) - Requisitos del proyecto
- [`backend/database/schema.md`](backend/database/schema.md) - Esquema de base de datos
- [`backend/docs/api-docs.md`](backend/docs/api-docs.md) - Documentación de API
- [`backend/README.md`](backend/README.md) - Documentación del backend

---

## 🤝 Contribución

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

---

## 📄 Licencia

Este proyecto es privado y confidencial. Todos los derechos reservados.

---

## 📞 Soporte

Para soporte técnico o consultas sobre el proyecto, contactar al equipo de desarrollo.

---

**Desarrollado con ❤️ para socios comerciales**
