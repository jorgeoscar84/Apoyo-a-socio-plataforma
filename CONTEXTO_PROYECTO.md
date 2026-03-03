# CONTEXTO DEL PROYECTO - Plataforma de Capacitación para Socios

## 📋 Descripción General

Plataforma web de capacitación para socios comerciales que incluye:

- **Módulo de Capacitaciones**: Videos con tracking de progreso, categorización y materiales de apoyo
- **Módulo de Eventos**: Calendario de eventos, inscripciones, recordatorios y grabaciones
- **Módulo de Material POP**: Descargas de materiales, favoritos y categorización
- **Módulo de Planes**: Comparador de planes del software contable
- **Módulo de Demos**: Videos de demostración con guiones y checklists
- **Panel de Administración**: CRUD completo para todos los módulos
- **Sistema de Autenticación**: Registro, login, recuperación de contraseña y roles de usuario

---

## 🛠️ Stack Tecnológico

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Componentes UI**: Radix UI, Lucide React (iconos)
- **Gráficos**: Recharts
- **Formularios**: React Hook Form + Zod
- **Estado**: React Context API

### Backend
- **BaaS**: Appwrite (autogestionado en VPS)
- **Autenticación**: Appwrite Auth
- **Base de datos**: Appwrite Database
- **Storage**: Appwrite Storage
- **Functions**: Appwrite Functions (Node.js)

### Deploy
- **Preview/Testing**: Vercel
- **Producción**: VPS propio
- **Repositorio**: GitHub

---

## 📁 Estructura del Proyecto

```
Apoyo a socio plataforma/
├── backend/
│   ├── config/
│   │   └── appwrite/
│   │       ├── docker-compose.yml        # Configuración Docker para Appwrite
│   │       ├── .env.example              # Variables de entorno ejemplo
│   │       └── .env.production.example   # Variables para producción
│   ├── database/
│   │   ├── schema.md                     # Esquema de colecciones Appwrite
│   │   ├── init-collections.js           # Script de inicialización
│   │   └── seed-data.js                  # Datos de prueba
│   ├── functions/
│   │   ├── event-registration/           # Función inscripciones eventos
│   │   ├── send-event-reminder/          # Función recordatorios
│   │   ├── send-notification/            # Función notificaciones
│   │   ├── update-video-progress/        # Función progreso videos
│   │   └── user-stats/                   # Función estadísticas usuario
│   ├── scripts/
│   │   └── backup.sh                     # Script de backup
│   ├── docs/
│   │   └── api-docs.md                   # Documentación API
│   └── README.md
├── frontend/
│   ├── src/app/                          # App Router (páginas)
│   │   ├── admin/                        # Panel administración
│   │   │   ├── page.tsx                  # Dashboard admin
│   │   │   ├── estadisticas/             # Estadísticas generales
│   │   │   ├── eventos/                  # CRUD eventos
│   │   │   ├── materiales/               # CRUD materiales
│   │   │   ├── usuarios/                 # Gestión usuarios
│   │   │   └── videos/                   # CRUD videos
│   │   ├── capacitaciones/               # Módulo capacitaciones
│   │   ├── dashboard/                    # Dashboard socio
│   │   ├── demos/                        # Módulo demos
│   │   ├── eventos/                      # Módulo eventos
│   │   ├── login/                        # Login
│   │   ├── material/                     # Módulo material POP
│   │   ├── perfil/                       # Perfil usuario
│   │   ├── planes/                       # Módulo planes
│   │   ├── register/                     # Registro
│   │   ├── recuperar-contrasena/         # Recuperar contraseña
│   │   └── restablecer-contrasena/       # Restablecer contraseña
│   ├── components/
│   │   ├── admin/                        # Componentes admin
│   │   ├── demos/                        # Componentes demos
│   │   ├── events/                       # Componentes eventos
│   │   ├── layout/                       # Layout (Sidebar)
│   │   ├── material/                     # Componentes materiales
│   │   ├── plans/                        # Componentes planes
│   │   ├── profile/                      # Componentes perfil
│   │   ├── ui/                           # Componentes UI reutilizables
│   │   └── video/                        # Componentes videos
│   ├── lib/
│   │   ├── appwrite/
│   │   │   └── client.ts                 # Cliente Appwrite + funciones
│   │   └── context/
│   │       └── AuthContext.tsx           # Contexto autenticación
│   ├── .env.example                      # Variables entorno ejemplo
│   ├── .env.production                   # Variables producción (placeholders)
│   ├── next.config.js                    # Configuración Next.js
│   ├── tailwind.config.ts                # Configuración Tailwind
│   └── package.json
├── PRD-Plataforma-Capacitacion-Socios-v3.md  # Documento de requisitos
├── plan-ejecucion-codificacion.md        # Plan de ejecución
├── vercel.json                           # Configuración Vercel
├── .gitignore
├── README.md
└── CONTEXTO_PROYECTO.md                  # Este archivo
```

---

## 🔐 Variables de Entorno Requeridas

### Frontend (.env.local / .env.production)

```env
# Appwrite
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://tu-appwrite-url.com/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=tu-project-id

# Colecciones IDs
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

### Backend (docker-compose.yml)

```env
_APP_DOMAIN=tu-dominio.com
_APP_DOMAIN_TARGET=tu-dominio.com
_APP_CONSOLE_WHITELIST_ROOT=true
_APP_CONSOLE_WHITELIST_EMAILS=tu-email@dominio.com
_APP_SMTP_HOST=smtp.tu-proveedor.com
_APP_SMTP_PORT=587
_APP_SMTP_USERNAME=tu-usuario-smtp
_APP_SMTP_PASSWORD=tu-password-smtp
```

---

## 👥 Roles de Usuario

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **SOCIO** | Usuario final (socio comercial) | Acceso a módulos de contenido, ver videos, inscribirse a eventos, descargar materiales |
| **ASESOR** | Gestor de contenido | Todo lo anterior + Crear/editar videos, eventos y materiales |
| **ADMIN** | Administrador del sistema | Acceso total + Gestión de usuarios + Panel de estadísticas |

---

## 📊 Colecciones Appwrite

### Resumen de Colecciones

| Colección | Propósito |
|-----------|-----------|
| `usuarios` | Información de usuarios y roles |
| `categorias` | Categorías para videos, eventos y materiales |
| `videos` | Videos de capacitación |
| `progreso_videos` | Tracking de progreso de videos por usuario |
| `eventos` | Eventos formativos (webinars, talleres) |
| `inscripciones_eventos` | Registro de inscripciones a eventos |
| `materiales` | Material POP descargable |
| `descargas_materiales` | Historial de descargas |
| `favoritos_materiales` | Materiales favoritos de usuarios |
| `planes` | Planes del software contable |
| `demos` | Demos del producto |
| `noticias` | Noticias y novedades |
| `notificaciones` | Notificaciones de usuarios |
| `configuracion` | Configuración del sistema |

### Campos Principales por Colección

#### usuarios
- `nombre`, `apellido`, `email`, `telefono`, `avatar`
- `rol` (SOCIO, ASESOR, ADMIN)
- `activo`, `emailVerificado`
- `ultimoAcceso`, `creadoEn`, `actualizadoEn`

#### videos
- `categoriaId`, `titulo`, `slug`, `descripcion`
- `videoUrl`, `videoPlataforma`, `videoId`
- `thumbnailUrl`, `duracion`, `orden`
- `materialApoyo` (JSON), `destacado`, `activo`

#### eventos
- `titulo`, `slug`, `descripcion`, `tipo`
- `fechaHora`, `duracion`, `modalidad`, `lugar`
- `enlaceVirtual`, `capacidad`, `inscritos`
- `instructorNombre`, `grabacionUrl`, `activo`

#### materiales
- `nombre`, `slug`, `descripcion`, `categoria`
- `tags` (JSON), `archivos` (JSON)
- `thumbnail`, `descargas`, `destacado`, `activo`

#### planes
- `nombre`, `slug`, `descripcion`, `precio`, `moneda`
- `caracteristicas` (JSON), `destacado`, `badge`, `color`
- `pdfBrochure`, `orden`, `activo`

#### demos
- `titulo`, `slug`, `descripcion`, `tipo`
- `videoUrl`, `guionUrl`, `checklistUrl`
- `duracion`, `tags` (JSON), `vistas`, `descargas`, `activo`

---

## 📈 Estado del Proyecto

| Componente | Estado | Notas |
|------------|--------|-------|
| Frontend | ✅ 100% | Todas las páginas y componentes completados |
| Backend Schema | ✅ 100% | Schema definido en schema.md |
| Backend Scripts | ✅ 100% | Scripts de inicialización y seed |
| Appwrite Functions | ✅ 100% | 5 funciones creadas |
| Deploy Vercel | ✅ Listo | Configurado vercel.json |
| Appwrite VPS | ⏳ Pendiente | Configurar en producción |

---

## 🚀 Próximos Pasos

### Inmediatos (Configuración)
1. **Configurar Appwrite** en VPS o usar Appwrite Cloud
2. **Crear proyecto** en Appwrite Console
3. **Ejecutar script** `init-collections.js` para crear colecciones
4. **Crear buckets** de storage (videos, materiales, general)
5. **Configurar variables de entorno** en Vercel

### Testing
1. **Probar registro** de usuarios
2. **Verificar roles** y permisos
3. **Probar CRUDs** del panel admin
4. **Verificar flujos** de video y progreso
5. **Probar inscripciones** a eventos

### Producción
1. **Configurar dominio** propio
2. **Configurar SSL** (Let's Encrypt)
3. **Migrar de Vercel** a VPS propio
4. **Configurar backups** automáticos
5. **Monitoreo** y logs

---

## 📝 Notas Importantes

### Seguridad
- Las credenciales reales NO se suben al repositorio
- Usar `.env.example` como referencia
- Configurar variables en Vercel Environment Variables
- Los archivos `.env.local` y `.env.production` están en `.gitignore`

### Appwrite Functions
Las funciones están ubicadas en `backend/functions/` y deben desplegarse en Appwrite:
1. Crear función en Appwrite Console
2. Subir código de la función
3. Configurar variables de entorno
4. Configurar triggers (eventos, cron)

### Comandos Útiles

```bash
# Frontend
cd frontend
npm install          # Instalar dependencias
npm run dev          # Desarrollo (localhost:3000)
npm run build        # Build producción
npm run start        # Iniciar build
npm run lint         # Linter

# Backend - Docker
cd backend/config/appwrite
docker-compose up -d     # Iniciar Appwrite
docker-compose down      # Detener Appwrite
docker-compose logs -f   # Ver logs

# Backend - Scripts
cd backend/database
node init-collections.js # Crear colecciones
node seed-data.js        # Insertar datos prueba
```

---

## 📞 Soporte

- **Documentación Appwrite**: https://appwrite.io/docs
- **Documentación Next.js**: https://nextjs.org/docs
- **Repositorio GitHub**: https://github.com/jorgeoscar84/Apoyo-a-socio-plataforma

---

**Última actualización**: Marzo 2026
**Versión del documento**: 1.0
