# PRD - Plataforma de Capacitación y Apoyo para Socios
## Portal de Formación y Recursos Comerciales

---

## 📋 Resumen Ejecutivo

### ¿Qué es esta plataforma?

Una plataforma web **100% educativa y de apoyo** para los socios de la red de distribución multinivel. Su único fin es:

| Fin | NO es |
|-----|-------|
| ✅ **Informar** sobre el producto y el negocio | ❌ Mostrar comisiones o resultados |
| ✅ **Capacitar** a los socios | ❌ Gestionar la red multinivel |
| ✅ **Facilitar materiales comerciales** | ❌ Procesar pagos |
| ✅ **Organizar eventos formativos** | ❌ Mostrar rankings |

### ¿Qué NO incluye esta plataforma?

Todo lo relacionado con **resultados financieros, comisiones, rankings, KPIs de desempeño** ya existe en la plataforma multinivel principal. Esta plataforma **no duplica ninguna funcionalidad** de aquella.

### Público Principal

**Contadores** que distribuyen software contable como parte de la red multinivel.

---

## 🎯 Objetivos de la Plataforma

### Objetivo Principal

Proporcionar un espacio centralizado donde los socios encuentren todo lo necesario para:

1. **Aprender** sobre el software contable que distribuyen
2. **Capacitarse** en técnicas de venta y liderazgo
3. **Acceder** a material comercial profesional
4. **Participar** en eventos formativos semanales

### Objetivos Específicos

| # | Objetivo | Cómo se mide |
|---|----------|--------------|
| 1 | Centralizar capacitaciones | Todos los videos en un solo lugar |
| 2 | Facilitar acceso a materiales | 100% de POP descargable |
| 3 | Organizar eventos semanales | Calendario actualizado |
| 4 | Reducir curva de aprendizaje | Onboarding estructurado |
| 5 | Profesionalizar la presentación | Material de alta calidad |

---

## 👥 Roles y Permisos del Sistema

### Estructura Jerárquica

```
┌─────────────────────────────────────────────────────────────┐
│                      ADMINISTRADOR                          │
│                      GENERAL                                │
│  (Control total de la plataforma)                          │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      ASESOR                                 │
│                      COMERCIAL                              │
│  (Gestión de contenido limitada)                           │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        SOCIO                                │
│                   (Solo lectura)                           │
└─────────────────────────────────────────────────────────────┘
```

---

### Rol 1: SOCIO (Usuario Final)

**Descripción**: Contador que forma parte de la red de distribución.

**Permisos**:

| Acción | ¿Permitido? |
|--------|-------------|
| Ver capacitaciones (videos) | ✅ Sí |
| Descargar material POP | ✅ Sí |
| Inscribirse a eventos | ✅ Sí |
| Ver grabaciones de eventos | ✅ Sí |
| Ver planes y demos | ✅ Sí |
| Editar su propio perfil | ✅ Sí |
| Marcar videos como favoritos | ✅ Sí |
| Ver su propio progreso | ✅ Sí |
| **Subir contenido** | ❌ No |
| **Editar contenido** | ❌ No |
| **Ver estadísticas globales** | ❌ No |
| **Gestionar usuarios** | ❌ No |
| **Acceder al panel admin** | ❌ No |

**Experiencia de usuario**:
- Accede al portal de capacitación
- Ve videos y descarga materiales
- Se inscribe a eventos
- Ve su progreso personal

---

### Rol 2: ASESOR COMERCIAL

**Descripción**: Personal comercial que apoya la gestión de contenidos básicos.

**Permisos**:

| Acción | ¿Permitido? |
|--------|-------------|
| Todo lo del SOCIO | ✅ Sí |
| **Subir videos de capacitación** | ✅ Sí |
| **Editar videos de capacitación** | ✅ Sí |
| **Subir material POP** | ✅ Sí |
| **Editar material POP** | ✅ Sí |
| **Crear/editar eventos** | ✅ Sí |
| **Ver estadísticas de contenido** | ✅ Sí |
| **Gestionar noticias** | ✅ Sí |
| Crear/editar usuarios | ❌ No |
| Cambiar roles de usuarios | ❌ No |
| Acceder configuración del sistema | ❌ No |
| Ver logs del sistema | ❌ No |
| Gestionar planes | ❌ No |
| Gestionar demos | ⚠️ Solo editar, no crear |
| Eliminar contenido | ❌ No (solo desactivar) |

**Experiencia de usuario**:
- Accede al portal como socio
- Tiene acceso adicional al **Panel de Contenidos**
- Puede subir nuevos videos y materiales
- Puede editar descripciones y organizacion
- Puede crear y gestionar eventos

**Qué NO puede hacer**:
- No accede a configuración crítica
- No puede gestionar usuarios
- No puede cambiar roles
- No puede eliminar definitivamente (solo desactivar)

---

### Rol 3: ADMINISTRADOR GENERAL

**Descripción**: Dueño del negocio o persona de confianza con control total.

**Permisos**:

| Acción | ¿Permitido? |
|--------|-------------|
| **TODO** | ✅ Sí |

**Permisos específicos**:

| Categoría | Acciones |
|-----------|----------|
| **Usuarios** | Crear, editar, eliminar, cambiar roles, ver todos |
| **Contenido** | Crear, editar, eliminar TODO el contenido |
| **Planes** | Gestionar planes y precios |
| **Demos** | Gestionar demos |
| **Eventos** | Crear, editar, eliminar eventos |
| **Material POP** | Subir, editar, eliminar materiales |
| **Configuración** | Ajustes del sistema |
| **Estadísticas** | Ver todas las métricas |
| **Logs** | Ver actividad del sistema |

**Experiencia de usuario**:
- Accede a TODO
- Panel de administración completo
- Gestión de usuarios y roles
- Configuración del sistema
- Métricas globales

---

### Matriz de Permisos Completa

| Funcionalidad | SOCIO | ASESOR | ADMIN |
|---------------|:-----:|:------:|:-----:|
| **CAPACITACIONES** |
| Ver videos | ✅ | ✅ | ✅ |
| Subir videos | ❌ | ✅ | ✅ |
| Editar videos | ❌ | ✅ | ✅ |
| Eliminar videos | ❌ | ❌ | ✅ |
| **EVENTOS** |
| Ver eventos | ✅ | ✅ | ✅ |
| Inscribirse | ✅ | ✅ | ✅ |
| Crear eventos | ❌ | ✅ | ✅ |
| Eliminar eventos | ❌ | ❌ | ✅ |
| **MATERIAL POP** |
| Descargar | ✅ | ✅ | ✅ |
| Subir material | ❌ | ✅ | ✅ |
| Editar material | ❌ | ✅ | ✅ |
| Eliminar material | ❌ | ❌ | ✅ |
| **PLANES** |
| Ver planes | ✅ | ✅ | ✅ |
| Crear/editar planes | ❌ | ❌ | ✅ |
| **DEMOS** |
| Ver demos | ✅ | ✅ | ✅ |
| Editar demos | ❌ | ⚠️ | ✅ |
| Crear demos | ❌ | ❌ | ✅ |
| **USUARIOS** |
| Ver su perfil | ✅ | ✅ | ✅ |
| Editar su perfil | ✅ | ✅ | ✅ |
| Ver otros usuarios | ❌ | ❌ | ✅ |
| Crear usuarios | ❌ | ❌ | ✅ |
| Editar usuarios | ❌ | ❌ | ✅ |
| Cambiar roles | ❌ | ❌ | ✅ |
| Eliminar usuarios | ❌ | ❌ | ✅ |
| **ESTADÍSTICAS** |
| Su progreso | ✅ | ✅ | ✅ |
| Stats de contenido | ❌ | ✅ | ✅ |
| Stats globales | ❌ | ❌ | ✅ |
| **CONFIGURACIÓN** |
| Ajustes del sistema | ❌ | ❌ | ✅ |

---

## 🏗️ Arquitectura Técnica

### Stack Tecnológico

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND                                  │
│                                                              │
│  Opción recomendada para no-code/low-code:                  │
│  • Bubble.io                                                │
│  • FlutterFlow (Flutter)                                    │
│  • WeWeb + Vue.js                                           │
│  • Softr + Airtable                                         │
│                                                              │
│  Si desarrollan con código:                                 │
│  • Next.js 16 + React 19                                    │
│  • Node.js 24 LTS                                           │
│  • Tailwind CSS 4                                           │
│  • TypeScript                                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND - APPWRITE                       │
│                    (Autoalojado en VPS)                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Appwrite es un BaaS (Backend as a Service) que incluye:   │
│                                                              │
│  📦 DATABASE (Base de datos)                                │
│     - Colecciones de documentos                             │
│     - Relaciones entre documentos                           │
│     - Permisos a nivel de documento                         │
│                                                              │
│  🔐 AUTH (Autenticación)                                    │
│     - Login con email/password                              │
│     - OAuth (Google, etc.)                                  │
│     - Gestión de sesiones                                   │
│     - Recuperación de contraseña                            │
│                                                              │
│  📁 STORAGE (Almacenamiento)                                │
│     - Videos                                                │
│     - Imágenes                                              │
│     - Documentos PDF                                        │
│     - Archivos descargables                                 │
│                                                              │
│  ⚡ FUNCTIONS (Funciones serverless)                        │
│     - Lógica personalizada                                  │
│     - Webhooks                                              │
│     - Procesamiento                                         │
│                                                              │
│  📧 MESSAGING (Mensajería)                                  │
│     - Emails                                                │
│     - Notificaciones push                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    INFRAESTRUCTURA                           │
│                                                              │
│  • VPS propio (DigitalOcean, Linode, Hetzner, etc.)        │
│  • Docker para contenedores                                 │
│  • Appwrite autoalojado                                     │
│  • SSL con Let's Encrypt                                    │
│  • Dominio propio                                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### ¿Por qué Appwrite?

| Ventaja | Explicación |
|---------|-------------|
| Autoalojado | Control total de datos en tu VPS |
| Backend completo | DB, Auth, Storage, Functions en uno |
| APIs listas | REST y GraphQL incluidos |
| SDKs | JavaScript, Flutter, iOS, Android |
| Permisos | Control granular de acceso |
| Escalable | Crece con tu negocio |
| Sin vendor lock-in | Es open source |

### Base de Datos en Appwrite

Appwrite soporta múltiples motores. La elección depende de tu equipo:

| Motor | Cuándo usarlo |
|-------|---------------|
| **MariaDB** (default) | Recomendado, mejorado de MySQL |
| **MySQL** | Si el equipo ya lo conoce |
| **PostgreSQL** | Para consultas complejas |
| **MongoDB** | Para datos muy flexibles |

**Importante**: Este PRD define la **estructura de datos**, no el motor específico. Tu equipo de desarrolladores elegirá el más conveniente.

---

## 📐 Estructura de la Plataforma

### Mapa del Sitio

```
🏠 LANDING PAGE (Público)
│
├── 🔐 AUTENTICACIÓN
│   ├── Login
│   ├── Recuperar contraseña
│   └── Primer acceso (cambio de password)
│
└── 📊 PORTAL (Privado)
    │
    ├── 🏠 DASHBOARD
    │   ├── Bienvenida
    │   ├── Mi progreso
    │   ├── Próximos eventos
    │   ├── Novedades
    │   └── Accesos rápidos
    │
    ├── 🎓 CAPACITACIONES
    │   │
    │   ├── 📱 Uso de la Plataforma Multinivel
    │   │   ├── Navegación general
    │   │   ├── Mi cuenta y configuración
    │   │   ├── Herramientas disponibles
    │   │   └── Preguntas frecuentes
    │   │
    │   ├── 💻 Producto (Software Contable)
    │   │   ├── Introducción al software
    │   │   ├── Módulos principales
    │   │   ├── Funcionalidades clave
    │   │   ├── Casos de uso comunes
    │   │   └── Novedades y actualizaciones
    │   │
    │   ├── 💰 Capacitación Comercial
    │   │   ├── Técnicas de venta
    │   │   ├── Presentaciones efectivas
    │   │   ├── Manejo de objeciones
    │   │   ├── Cierre de ventas
    │   │   └── Seguimiento a clientes
    │   │
    │   └── 👑 Liderazgo y Equipo
    │       ├── Liderazgo efectivo
    │       ├── Gestión de equipo
    │       ├── Comunicación
    │       └── Motivación
    │
    ├── 📅 EVENTOS
    │   ├── Calendario semanal
    │   ├── Próximos eventos
    │   ├── Mis inscripciones
    │   └── Grabaciones
    │
    ├── 📦 MATERIAL POP
    │   ├── Brochures y folletos
    │   ├── Presentaciones
    │   ├── Material redes sociales
    │   ├── Videos promocionales
    │   ├── Guiones de venta
    │   └── Casos de éxito
    │
    ├── 📋 PLANES
    │   ├── Comparador de planes
    │   └── Detalle de cada plan
    │
    ├── 🎬 DEMOS
    │   ├── Demos grabadas
    │   ├── Solicitar demo en vivo
    │   └── Guiones para demos
    │
    ├── 👤 MI PERFIL
    │   ├── Mis datos
    │   ├── Mi progreso
    │   ├── Mis favoritos
    │   └── Configuración
    │
    └── 🛠️ PANEL DE ADMINISTRACIÓN
        │
        ├── 👥 Usuarios (Solo ADMIN)
        │   ├── Lista de usuarios
        │   ├── Crear usuario
        │   ├── Editar usuario
        │   └── Asignar roles
        │
        ├── 📹 Contenido
        │   ├── Videos de capacitación
        │   ├── Categorías
        │   └── Orden y organización
        │
        ├── 📅 Eventos
        │   ├── Crear evento
        │   ├── Gestionar eventos
        │   └── Ver inscripciones
        │
        ├── 📦 Material POP
        │   ├── Subir material
        │   ├── Gestionar archivos
        │   └── Organizar categorías
        │
        ├── 📋 Planes y Demos
        │   ├── Gestionar planes
        │   └── Gestionar demos
        │
        ├── 📊 Estadísticas
        │   ├── Uso de la plataforma
        │   ├── Videos más vistos
        │   ├── Material más descargado
        │   └── Eventos más populares
        │
        └── ⚙️ Configuración (Solo ADMIN)
            ├── Ajustes generales
            ├── Emails
            └── Sistema
```

---

## 🧩 Módulos Detallados

### Módulo 1: Dashboard Principal

#### Propósito
Página de inicio que da la bienvenida y muestra información relevante.

#### Elementos

```
┌─────────────────────────────────────────────────────────────────┐
│  DASHBOARD                                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  ¡Bienvenido, [Nombre]! 👋                                │ │
│  │                                                           │ │
│  │  Tu progreso en capacitaciones:                          │ │
│  │  ████████████████░░░░░░░░░░░░ 65%                        │ │
│  │  13 de 20 videos completados                             │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────┐           │
│  │  📅 Próximos Eventos  │  │  📹 Continúa Viendo  │           │
│  │                      │  │                      │           │
│  │  • Demo Producto     │  │  [Thumbnail]         │           │
│  │    Hoy 15:00         │  │  Introducción al...  │           │
│  │                      │  │  50% completado      │           │
│  │  • Training Comercial│  │  [Continuar ▶]       │           │
│  │    Mañana 10:00      │  │                      │           │
│  │                      │  └──────────────────────┘           │
│  │  [Ver calendario]    │                                     │
│  └──────────────────────┘                                     │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  📦 Material Reciente                                     │ │
│  │                                                           │ │
│  │  [Img] Brochure Plan Premium    [Img] Guion de Venta      │ │
│  │        Nuevo hace 2 días              Nuevo hace 3 días   │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  📢 Novedades                                             │ │
│  │                                                           │ │
│  │  • Nueva capacitación disponible: "Técnicas de Cierre"    │ │
│  │  • Material actualizado: Brochures 2025                  │ │
│  │  • Evento especial: Masterclass con invitado             │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Componentes

| Componente | Contenido |
|------------|-----------|
| Bienvenida | Saludo personalizado |
| Barra de progreso | % de videos vistos |
| Próximos eventos | Los 3 más cercanos |
| Continuar viendo | Videos sin terminar |
| Material reciente | Últimos 4 agregados |
| Novedades | Anuncios importantes |

---

### Módulo 2: Capacitaciones

#### Propósito
Biblioteca completa de videos organizados por categoría.

#### Estructura de Categorías

```
CAPACITACIONES
│
├── 📱 USO DE LA PLATAFORMA MULTINIVEL
│   ├── Introducción a la plataforma
│   ├── Navegación y menús
│   ├── Mi cuenta y perfil
│   ├── Configuraciones importantes
│   └── Preguntas frecuentes
│
├── 💻 PRODUCTO (SOFTWARE CONTABLE)
│   ├── Visión general del software
│   ├── Módulo: Contabilidad
│   ├── Módulo: Facturación
│   ├── Módulo: Impuestos
│   ├── Módulo: Inventarios
│   ├── Módulo: Nómina
│   ├── Reportes
│   └── Novedades y actualizaciones
│
├── 💰 CAPACITACIÓN COMERCIAL
│   ├── Fundamentos de venta
│   ├── Técnicas de presentación
│   ├── Manejo de objeciones
│   ├── Cierre de ventas
│   ├── Seguimiento de clientes
│   └── Ventas online vs presencial
│
└── 👑 LIDERAZGO Y EQUIPO
    ├── Liderazgo efectivo
    ├── Construir tu equipo
    ├── Comunicación asertiva
    ├── Motivación y seguimiento
    └── Duplicación exitosa
```

#### Pantalla de Lista de Capacitaciones

```
┌─────────────────────────────────────────────────────────────────┐
│  CAPACITACIONES                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🔍 [Buscar capacitación...                    ] [Filtrar ▼]   │
│                                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │📱 Plata- │ │💻 Produc-│ │💰 Comerc.│ │👑 Lideraz│         │
│  │  forma   │ │   to     │ │          │ │   go     │         │
│  │   5 videos│ │  12 videos│ │  8 videos│ │  6 videos│         │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘         │
│                                                                 │
│  ═══════════════════════════════════════════════════════════   │
│                                                                 │
│  📱 USO DE LA PLATAFORMA MULTINIVEL                             │
│                                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐             │
│  │ [Thumbnail] │ │ [Thumbnail] │ │ [Thumbnail] │             │
│  │             │ │             │ │             │             │
│  │ ▶ 10:25     │ │ ▶ 15:30     │ │ ▶ 8:45      │             │
│  │             │ │             │ │             │             │
│  │ Introducción│ │ Navegación  │ │ Mi Cuenta   │             │
│  │ a la plata- │ │ y menús     │ │ y perfil    │             │
│  │ forma       │ │             │ │             │             │
│  │             │ │             │ │             │             │
│  │ ✓ Visto     │ │ ████░ 50%   │ │ ○ No visto  │             │
│  └─────────────┘ └─────────────┘ └─────────────┘             │
│                                                                 │
│  [Ver más videos de esta categoría →]                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Pantalla de Video

```
┌─────────────────────────────────────────────────────────────────┐
│  CAPACITACIONES > Uso de Plataforma > Introducción             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │                                                           │ │
│  │                    REPRODUCTOR DE VIDEO                   │ │
│  │                                                           │ │
│  │                      [▶ ▶▶]                               │ │
│  │                                                           │ │
│  │           ━━━━━━━━━━━━━━●─────────────────                │ │
│  │           03:45                           10:25            │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Introducción a la Plataforma Multinivel                       │
│  Duración: 10:25 | Categoría: Uso de Plataforma                │
│                                                                 │
│  📝 Descripción:                                                │
│  En este video aprenderás los conceptos básicos de cómo        │
│  navegar y utilizar la plataforma multinivel para sacar        │
│  el máximo provecho de sus herramientas.                       │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  📎 Material de apoyo:                                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 📄 Guía rápida de navegación (PDF)          [Descargar] │   │
│  │ 📄 Checklist de configuración inicial (PDF) [Descargar] │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  📋 Videos de esta categoría:                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ ▶ Introducción (actual)                           10:25  │  │
│  │ ▶ Navegación y menús                              15:30  │  │
│  │ ▶ Mi cuenta y perfil                               8:45  │  │
│  │ ▶ Configuraciones importantes                     12:10  │  │
│  │ ▶ Preguntas frecuentes                            20:00  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Funcionalidades del reproductor

| Función | Descripción |
|---------|-------------|
| Reproducir/Pausar | Control básico |
| Barra de progreso | Visualizar avance |
| Volumen | Control de audio |
| Pantalla completa | Expande video |
| Velocidad | 0.5x, 1x, 1.5x, 2x |
| Autoguardado | Guarda progreso automáticamente |

---

### Módulo 3: Eventos

#### Propósito
Calendario de eventos formativos semanales con inscripción online.

#### Tipos de Eventos

| Tipo | Descripción | Frecuencia típica |
|------|-------------|-------------------|
| Presentación de Negocio | Cómo presentar el negocio | Semanal |
| Demo del Producto | Demostración en vivo | 2x por semana |
| Entrenamiento Comercial | Técnicas de venta | Semanal |
| Capacitación de Producto | Uso del software | Semanal |
| Masterclass | Invitado especial | Mensual |
| Q&A | Preguntas y respuestas | Quincenal |

#### Pantalla de Calendario

```
┌─────────────────────────────────────────────────────────────────┐
│  EVENTOS                                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [< Semana Ant.]        20 - 26 Enero 2025        [Semana Sig. >]│
│                                                                 │
│  ┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐ │
│  │  LUN 20 │  MAR 21 │  MIÉ 22 │  JUE 23 │  VIE 24 │  SÁB 25 │ │
│  │    •    │    •    │    ••   │    •    │    •    │         │ │
│  └─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘ │
│                                                                 │
│  ══════════════════════════════════════════════════════════════ │
│                                                                 │
│  📅 LUNES 20 DE ENNERO                                          │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  🎯 PRESENTACIÓN DE NEGOCIO                               │ │
│  │                                                           │ │
│  │  10:00 - 11:00 | Virtual (Zoom)                          │ │
│  │                                                           │ │
│  │  Aprende a presentar el negocio de manera efectiva.       │ │
│  │  Ideal para nuevos socios.                               │ │
│  │                                                           │ │
│  │  👤 Facilitador: Juan Pérez                               │ │
│  │  📊 Cupos: 45/100 disponibles                            │ │
│  │                                                           │ │
│  │  [Inscribirme]  [Agregar al calendario]                  │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  💻 DEMO DEL PRODUCTO                                     │ │
│  │                                                           │ │
│  │  15:00 - 16:00 | Virtual (Zoom)                          │ │
│  │                                                           │ │
│  │  Demostración en vivo del software contable.              │ │
│  │  Trae tus preguntas.                                     │ │
│  │                                                           │ │
│  │  👤 Facilitador: María López                              │ │
│  │  📊 Cupos: 78/100 disponibles                            │ │
│  │                                                           │ │
│  │  [Inscribirme]  [Agregar al calendario]                  │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Detalle de Evento

```
┌─────────────────────────────────────────────────────────────────┐
│  EVENTO > Presentación de Negocio                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  [Imagen del evento o banner]                           │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  🎯 PRESENTACIÓN DE NEGOCIO                                     │
│                                                                 │
│  📅 Lunes 20 de Enero, 2025                                    │
│  🕐 10:00 - 11:00 (1 hora)                                     │
│  📍 Virtual - Zoom                                             │
│  👤 Facilitador: Juan Pérez - Director Comercial               │
│                                                                 │
│  ═══════════════════════════════════════════════════════════   │
│                                                                 │
│  📝 Descripción:                                                │
│                                                                 │
│  En esta sesión aprenderás las técnicas más efectivas para     │
│  presentar el negocio a prospectos. Incluye:                   │
│                                                                 │
│  • Estructura de una presentación exitosa                      │
│  • Puntos clave a destacar                                     │
│  • Manejo de preguntas frecuentes                              │
│  • Práctica y retroalimentación                                │
│                                                                 │
│  ═══════════════════════════════════════════════════════════   │
│                                                                 │
│  📊 Información:                                                │
│  • Cupos disponibles: 45/100                                   │
│  • Inscritos hasta ahora: 55                                   │
│                                                                 │
│  ═══════════════════════════════════════════════════════════   │
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐                   │
│  │   [INSCRIBIRME]  │  │ [+ Google Cal]   │                   │
│  └──────────────────┘  └──────────────────┘                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Mis Inscripciones

```
┌─────────────────────────────────────────────────────────────────┐
│  MIS INSCRIPCIONES                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📅 Próximos eventos inscritos:                                 │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 🎯 Presentación de Negocio                                │ │
│  │    Lunes 20 Enero, 10:00                                  │ │
│  │    [Unirse al evento]  [Cancelar inscripción]             │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 💻 Demo del Producto                                      │ │
│  │    Miércoles 22 Enero, 15:00                              │ │
│  │    [Unirse al evento]  [Cancelar inscripción]             │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ═══════════════════════════════════════════════════════════   │
│                                                                 │
│  📹 Grabaciones disponibles:                                    │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ [▶] Entrenamiento Comercial - 15 Enero      (1h 15min)   │ │
│  │ [▶] Q&A Session - 13 Enero                  (45min)      │ │
│  │ [▶] Masterclass: Ventas Efectivas - 8 Enero (2h)         │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### Módulo 4: Material POP

#### Propósito
Biblioteca de material gráfico y comercial para descargar.

#### Categorías de Material

| Categoría | Descripción | Formatos típicos |
|-----------|-------------|------------------|
| Brochures | Folletos informativos | PDF, InDesign |
| Presentaciones | Decks para clientes | PPTX, PDF |
| Redes Sociales | Posts, stories, banners | PNG, JPG, MP4 |
| Videos Promocionales | Videos de marketing | MP4 |
| Guiones de Venta | Textos para llamadas | DOCX, PDF |
| Casos de Éxito | Testimonios documentados | PDF, Video |
| Infografías | Datos visuales | PNG, PDF |
| Identidad de Marca | Logos, manuales | AI, SVG, PDF |

#### Pantalla Principal

```
┌─────────────────────────────────────────────────────────────────┐
│  MATERIAL POP                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🔍 [Buscar material...                       ] [Filtrar ▼]    │
│                                                                 │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐  │
│  │ 📄Brochures│ │ 📊Presentac.│ │ 📱Redes Soc│ │ 🎬Videos   │  │
│  │    (8)     │ │    (6)     │ │    (24)    │ │    (5)     │  │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘  │
│                                                                 │
│  ═══════════════════════════════════════════════════════════   │
│                                                                 │
│  📄 BROCHURES Y FOLLETOS                                        │
│                                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│  │ [Preview]   │ │ [Preview]   │ │ [Preview]   │              │
│  │             │ │             │ │             │              │
│  │ Brochure    │ │ Folleto     │ │ Brochure    │              │
│  │ Plan Básico │ │ Corporativo │ │ Comparativo │              │
│  │             │ │             │ │             │              │
│  │ 📄 PDF 2MB  │ │ 📄 PDF 3MB  │ │ 📄 PDF 4MB  │              │
│  │ 🏷️ Básico   │ │ 🏷️ Empresa │ │ 🏷️ Todos    │              │
│  │             │ │             │ │             │              │
│  │ [👁] [⬇] [♡]│ │ [👁] [⬇] [♡]│ │ [👁] [⬇] [♡]│              │
│  └─────────────┘ └─────────────┘ └─────────────┘              │
│                                                                 │
│  [Ver más brochures →]                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Funcionalidades

| Función | Descripción |
|---------|-------------|
| Vista previa | Ver el archivo antes de descargar |
| Descargar | Descarga individual |
| Favoritos | Marcar como favorito |
| Búsqueda | Por nombre, tag, categoría |
| Filtros | Por tipo, fecha, uso |
| Descarga múltiple | Varios archivos en ZIP |

---

### Módulo 5: Planes

#### Propósito
Comparador visual de los planes del software contable.

#### Pantalla de Comparador

```
┌─────────────────────────────────────────────────────────────────┐
│  PLANES DEL SOFTWARE                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Encuentra el plan ideal para cada cliente                      │
│                                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│  │   BÁSICO    │ │  ESTÁNDAR   │ │   PREMIUM   │              │
│  │             │ │ ⭐ Popular  │ │             │              │
│  │   $99/mes   │ │  $199/mes   │ │  $349/mes   │              │
│  │             │ │             │ │             │              │
│  │ ✓ 3 módulos │ │ ✓ 6 módulos │ │ ✓ 10 módulos│              │
│  │ ✓ 5 usuarios│ │ ✓ 15 usuarios│ │ ✓ 50 usuarios│            │
│  │ ✓ Soporte bá│ │ ✓ Soporte pri│ │ ✓ Soporte ded│             │
│  │ ✗ Backup    │ │ ✓ Backup sem │ │ ✓ Backup diario│           │
│  │             │ │             │ │             │              │
│  │ [Ver detalle]│ │ [Ver detalle]│ │ [Ver detalle]│            │
│  └─────────────┘ └─────────────┘ └─────────────┘              │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  📊 Ver tabla comparativa completa                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Tabla Comparativa

```
┌─────────────────────────────────────────────────────────────────┐
│  COMPARATIVA COMPLETA                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Característica    │  BÁSICO   │ ESTÁNDAR │  PREMIUM  │ ENTERPR│
│  ──────────────────┼───────────┼──────────┼───────────┼────────│
│  Módulos incluidos │     3     │     6    │     10    │  Todos │
│  Usuarios máx.     │     5     │    15    │     50    │ Sin lím│
│  Soporte           │  Básico   │ Priorita.│ Dedicado  │ Dedicad│
│  Almacenamiento    │   5 GB    │   20 GB  │   100 GB  │  1 TB  │
│  Backup            │    No     │  Semanal │  Diario   │ Diario │
│  Actualizaciones   │    Sí     │    Sí    │    Sí     │   Sí   │
│  App móvil         │    No     │    Sí    │    Sí     │   Sí   │
│  API               │    No     │    No    │    Sí     │   Sí   │
│  Multi-sucursal    │    No     │    No    │    No     │   Sí   │
│  ──────────────────┼───────────┼──────────┼───────────┼────────│
│  PRECIO/MES        │   $99     │   $199   │   $349    │  $599  │
│                    │ [Detalles]│ [Detalles]│ [Detalles]│[Detalle│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### Módulo 6: Demos

#### Propósito
Acceso a demos del producto para usar con clientes.

#### Contenido

| Tipo | Descripción |
|------|-------------|
| Demos Grabadas | Videos pregrabados de demostración |
| Demos en Vivo | Solicitar sesión con un asesor |
| Guiones de Demo | Textos paso a paso para hacer demos |
| Checklist | Verificación antes de cada demo |

#### Pantalla

```
┌─────────────────────────────────────────────────────────────────┐
│  DEMOS                                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🎬 DEMOS GRABADAS                                              │
│                                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│  │ [Thumbnail] │ │ [Thumbnail] │ │ [Thumbnail] │              │
│  │             │ │             │ │             │              │
│  │ ▶ 25:30     │ │ ▶ 18:45     │ │ ▶ 32:10     │              │
│  │             │ │             │ │             │              │
│  │ Demo General│ │ Demo Contab.│ │ Demo Impues.│              │
│  │ Vista general│ │ Módulo cont.│ │ Módulo fiscal│             │
│  │             │ │             │ │             │              │
│  │ [Ver demo]  │ │ [Ver demo]  │ │ [Ver demo]  │              │
│  └─────────────┘ └─────────────┘ └─────────────┘              │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  📝 GUIONES DE DEMO                                             │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 📄 Guion Demo General (DOCX)               [Descargar]   │  │
│  │ 📄 Guion Demo para Contadores (DOCX)       [Descargar]   │  │
│  │ 📄 Checklist Pre-Demo (PDF)                [Descargar]   │  │
│  │ 📄 Objeciones Comunes (PDF)                [Descargar]   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  🎯 ¿Necesitas una demo personalizada?                          │
│                                                                 │
│  Agenda una sesión en vivo con uno de nuestros asesores.       │
│                                                                 │
│  [Solicitar Demo en Vivo]                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### Módulo 7: Panel de Administración

#### Acceso según Rol

| Sección | SOCIO | ASESOR | ADMIN |
|---------|:-----:|:------:|:-----:|
| Panel de Admin | ❌ No ve | ✅ Parcial | ✅ Completo |
| Usuarios | ❌ | ❌ | ✅ |
| Videos | ❌ | ✅ CRUD | ✅ CRUD |
| Eventos | ❌ | ✅ CRUD | ✅ CRUD |
| Material POP | ❌ | ✅ CRUD | ✅ CRUD |
| Planes | ❌ | ❌ Solo ver | ✅ CRUD |
| Demos | ❌ | ✅ Editar | ✅ CRUD |
| Estadísticas | ❌ | ✅ Contenido | ✅ Todo |
| Configuración | ❌ | ❌ | ✅ |

#### Dashboard Admin

```
┌─────────────────────────────────────────────────────────────────┐
│  PANEL DE ADMINISTRACIÓN                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📊 Resumen (Solo visible para ADMIN y ASESOR)                  │
│                                                                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │
│  │ 👥 Usuarios  │ │ 📹 Videos    │ │ 📦 Material  │           │
│  │    156       │ │    42        │ │    67        │           │
│  │  +12 este mes│ │  3 nuevos    │ │  5 nuevos    │           │
│  └──────────────┘ └──────────────┘ └──────────────┘           │
│                                                                 │
│  ┌──────────────┐ ┌──────────────┐                            │
│  │ 📅 Eventos   │ │ 👁️ Vistas    │                            │
│  │    8 activos │ │   1,234      │                            │
│  │  2 esta sem. │ │  Este mes    │                            │
│  └──────────────┘ └──────────────┘                            │
│                                                                 │
│  ═══════════════════════════════════════════════════════════   │
│                                                                 │
│  📹 GESTIÓN DE CONTENIDO (ASESOR y ADMIN)                       │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Videos de Capacitación                    [+ Nuevo video] │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Título                    Categoría       Estado  Acciones│  │
│  │ Introducción a la Plata... Plataforma     Activo  [✏][🗑]│  │
│  │ Módulo Contabilidad       Producto        Activo  [✏][🗑]│  │
│  │ Técnicas de Venta         Comercial       Activo  [✏][🗑]│  │
│  │ Liderazgo Efectivo        Liderazgo       Activo  [✏][🗑]│  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Material POP                              [+ Nuevo material]│
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Nombre                    Categoría       Descarg. Accion.│  │
│  │ Brochure Plan Premium     Brochure         234    [✏][🗑]│  │
│  │ Presentación Corporativa  Presentación     156    [✏][🗑]│  │
│  │ Post Instagram #1         Redes Sociales   89     [✏][🗑]│  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ═══════════════════════════════════════════════════════════   │
│                                                                 │
│  👥 GESTIÓN DE USUARIOS (Solo ADMIN)                            │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Usuarios                                  [+ Nuevo usuario]│
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Nombre         Email           Rol        Estado  Acciones│  │
│  │ Juan Pérez     juan@email.com  SOCIO      Activo  [✏][🗑]│  │
│  │ María López    maria@email.com ASESOR     Activo  [✏][🗑]│  │
│  │ Carlos Ruiz    carlos@email.coADMIN      Activo  [✏][🗑]│  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Diseño Visual

### Principios de Diseño

1. **Limpio y Profesional** - Transmite seriedad y confianza
2. **Fácil de Navegar** - Encontrar información rápidamente
3. **Visualmente Atractivo** - Sensación de plataforma premium
4. **Consistente** - Mismo estilo en todas las secciones
5. **Accesible** - Funciona en cualquier dispositivo
6. **Moderno y Dinámico** - Interfaces intuitivas con transiciones suaves

### Paleta de Colores Basada en Referencias

```
COLOR PRINCIPAL (Botones, acentos)
├── Primary: #3B82F6 (Azul principal) - Basado en interfaces modernas
├── Primary Dark: #2563EB (Hover)
├── Primary Light: #EFF6FF (Fondos claros)
└── Primary Contrast: #FFFFFF (Texto en botones)

COLOR SECUNDARIO (Highlights, badges)
├── Secondary: #F59E0B (Naranja vibrante) - Basado en sitios educativos
├── Secondary Dark: #D97706 (Hover)
├── Secondary Light: #FFFBEB (Fondos claros)
└── Secondary Contrast: #FFFFFF (Texto en botones)

COLOR TERCERIO (Acciones alternativas)
├── Tertiary: #10B981 (Verde) - Basado en interfaces de éxito
├── Tertiary Dark: #059669 (Hover)
└── Tertiary Light: #D1FAE5 (Fondos claros)

COLORES DE ESTADO
├── Success: #10B981 (Verde) - Basado en interfaces de validación
├── Warning: #F59E0B (Amarillo) - Basado en interfaces de atención
├── Error: #EF4444 (Rojo) - Basado en interfaces de error
└── Info: #3B82F6 (Azul) - Basado en interfaces informativas

NEUTRALES
├── Background: #FFFFFF (Fondo principal)
├── Background Secondary: #F9FAFB (Fondo secundario)
├── Background Tertiary: #F3F4F6 (Fondo terciario)
├── Text Primary: #111827 (Texto principal)
├── Text Secondary: #6B7280 (Texto secundario)
├── Text Tertiary: #9CA3AF (Texto terciario)
├── Border: #E5E7EB (Bordes)
├── Border Dark: #D1D5DB (Bordes oscuros)
└── Shadow: #000000 (Sombras con opacidad 0.1)
```

### Tipografía Basada en Referencias

```
TÍTULOS
├── Fuente: Inter o Poppins (Basado en interfaces modernas)
├── Pesos: 600 (semibold), 700 (bold)
├── Tamaños: 
│   H1(40px), H2(32px), H3(24px), H4(20px), H5(18px), H6(16px)
└── Características: 
    - Espaciado generoso
    - Letra clara y legible
    - Contraste adecuado

TEXTO NORMAL
├── Fuente: Inter (Basado en interfaces modernas)
├── Pesos: 400 (regular), 500 (medium)
├── Tamaños: 16px (principal), 14px (secundario)
└── Características:
    - Interlineado de 1.5
    - Longitud de línea óptima (60-75 caracteres)
    - Legibilidad máxima

TEXTO PEQUEÑO
├── Fuente: Inter
├── Tamaños: 12px, 13px
└── Características:
    - Usado para metadata y labels
    - Menor opacidad para jerarquía
```

### Referencias Visuales Analizadas

#### 1. Interfaz de Calendario (Yle)
- **Diseño**: Fondo oscuro con colores vibrantes para eventos
- **Características**:
  - Sidebar con iconos circulares y colores diferenciados
  - Tarjetas de eventos con bordes redondeados
  - Transiciones suaves al hover
  - Jerarquía clara con colores para diferentes tipos de eventos
  - Espaciado generoso y buena respiración visual

#### 2. Plataforma Educativa (Examin)
- **Diseño**: Fondo blanco con secciones coloridas
- **Características**:
  - Tarjetas con fondos de colores vibrantes para categorías
  - Iconos blancos sobre fondos de color
  - Títulos claros y jerarquía visual
  - Botones con estilos diferenciados (primario, secundario)
  - Galerías de cursos con imágenes y metadata

#### 3. Plataforma de Cursos (Segunda referencia)
- **Diseño**: Diseño limpio y minimalista
- **Características**:
  - Galerías de cursos con imágenes prominentes
  - Información de precios y calificaciones claras
  - Botones de inscripción distintivos
  - Uso de badges y etiquetas para metadata
  - Responsividad en la presentación

### Componentes UI Detallados

#### Botones

```
PRIMARIO:
┌────────────────┐
│   Inscribirme  │  bg-blue-600, text-white, rounded-lg, hover:bg-blue-700, transition-colors
└────────────────┘

SECUNDARIO:
┌────────────────┐
│    Ver más     │  bg-gray-100, text-gray-700, rounded-lg, hover:bg-gray-200, transition-colors
└────────────────┘

OUTLINE:
┌────────────────┐
│   Descargar    │  border-blue-600, text-blue-600, rounded-lg, hover:bg-blue-50, transition-colors
└────────────────┘

GHOST:
┌────────────────┐
│    Cancelar    │  text-gray-600, hover:bg-gray-100, rounded-lg, transition-colors
└────────────────┘

SMALL:
┌───────┐
│  OK   │  text-sm, px-3, py-1.5, rounded
└───────┘
```

#### Cards

```
┌─────────────────────────────────┐
│                                 │
│  [Imagen/Thumbnail]             │
│                                 │
│  Título principal               │
│  Descripción secundaria         │
│                                 │
│  [Botón de acción]              │
│                                 │
└─────────────────────────────────┘

Estilos:
- bg-white
- border border-gray-200
- rounded-xl
- shadow-sm hover:shadow-lg transition-shadow
- p-6
- hover:transform hover:scale-105 transition-transform
```

#### Tarjetas de Categorías (Basado en Examin)

```
┌──────────────────────┐
│  [Icono Blanco]      │
│                     │
│  Título de Categoría │
│  (1,234) Temas      │
└──────────────────────┘

Estilos:
- bg-blue-500 (ejemplo)
- text-white
- rounded-lg
- p-6
- text-center
- hover:bg-blue-600 transition-colors
```

#### Calendario

```
┌─────────────────────────────────────────────────────────────────┐
│  CALENDARIO SEMANAL                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                         │
│  [< Mes Anterior]  Septiembre 2025  [Mes Siguiente >]      │
│                                                         │
│  ┌───┬───┬───┬───┬───┬───┬───┐                             │
│  │ L │ M │ X │ J │ V │ S │ D │                             │
│  ├───┼───┼───┼───┼───┼───┼───┤                             │
│  │   │   │   │   │ 4 │ 5 │ 6 │                             │
│  │ 7 │ 8 │ 9 │10 │11 │12 │13 │                             │
│  │14 │15 │16 │17 │18 │19 │20 │                             │
│  │21 │22 │23 │24 │25 │26 │27 │                             │
│  │28 │29 │30 │ 1 │ 2 │ 3 │ 4 │                             │
│  └───┴───┴───┴───┴───┴───┴───┘                             │
│                                                         │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Evento 1: Reunión de Brainstorming                  │ │
│  │  10:00 - 12:00 | Sala A                             │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────────────┘

Estilos:
- Grid semanal con días claros
- Eventos con colores diferenciados
- Hover effects en eventos
- Detalle de evento al seleccionar
```

#### Galerías de Cursos

```
┌─────────────────────────────────────────────────────────────────┐
│  GALERÍA DE CURSOS                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                         │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ │
│  │ [Thumbnail]│ │ [Thumbnail]│ │ [Thumbnail]│ │ [Thumbnail]│ │
│  │            │ │            │ │            │ │            │ │
│  │ Título     │ │ Título     │ │ Título     │ │ Título     │ │
│  │ Precio     │ │ Precio     │ │ Precio     │ │ Precio     │ │
│  │ Calificación│ Calificación│ Calificación│ Calificación│ │
│  │ [Botón]    │ │ [Botón]    │ │ [Botón]    │ │ [Botón]    │ │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────────────┘

Estilos:
- Grid responsive (3-4 columnas en desktop)
- Tarjetas con sombras suaves
- Imágenes con ratio consistente
- Información clave visible
- Hover effects sutiles
```

#### Badges/Tags

```
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│  Nuevo   │  │ Popular  │  │ Premium  │  │ Hot      │
└──────────┘  └──────────┘  └──────────┘  └──────────┘

Variantes:
- Default: bg-gray-100 text-gray-700
- Primary: bg-blue-100 text-blue-700
- Secondary: bg-orange-100 text-orange-700
- Success: bg-green-100 text-green-700
- Warning: bg-yellow-100 text-yellow-700

Estilos:
- px-2 py-1 rounded-full text-xs font-medium
- Espaciado entre badges
```

#### Navegación y Layout

```
HEADER:
┌─────────────────────────────────────────────────────────────┐
│  Logo  │ Menú Principal  │  Buscador  │  Notificaciones  │  Perfil │
└─────────────────────────────────────────────────────────────┘

SIDEBAR:
┌─────────────────────────────────────────────────────────────┐
│  Dashboard  │  Capacitaciones  │  Eventos  │  Material  │  ... │
└─────────────────────────────────────────────────────────────┘

LAYOUT PRINCIPAL:
┌─────────────────────────────────────────────────────────────┐
│  Sidebar  │                                               │
│          │                  Contenido Principal           │
│          │                                               │
└─────────────────────────────────────────────────────────────┘

Estilos:
- Sidebar collapsable en mobile
- Header sticky
- Espaciado consistente
- Jerarquía visual clara
```

### Animaciones y Transiciones

- **Duración**: 200-300ms para transiciones
- **Easing**: `ease-in-out` para movimientos suaves
- **Tipos**:
  - Fade in/out
  - Scale transform
  - Slide horizontal
  - Opacity changes
- **Uso**: 
  - Al cargar contenido
  - Al hover en elementos interactivos
  - Al cambiar secciones
  - En notificaciones

### Responsividad

#### Breakpoints

| Dispositivo | Ancho | Comportamiento |
|-------------|-------|----------------|
| Mobile | < 640px | Sidebar oculta, navegación inferior |
| Tablet | 640px - 1024px | Sidebar colapsable |
| Desktop | > 1024px | Sidebar visible, layout completo |

#### Adaptaciones Específicas

- **Cards**: 1 columna (mobile) → 3-4 columnas (desktop)
- **Calendario**: Lista (mobile) → Grid semanal (desktop)
- **Galerías**: 1-2 elementos (mobile) → 4 elementos (desktop)
- **Tablas**: Scroll horizontal (mobile) → Normal (desktop)
- **Botones**: Full width (mobile) → Auto width (desktop)

### Iconos y Assets

- **Conjunto**: Lucide Icons o Heroicons
- **Tamaño**: 20px (íconos principales), 16px (íconos secundarios)
- **Estilo**: Línea o filled según contexto
- **Uso**: 
  - Navegación
  - Acciones
  - Estados
  - Decoración

### Componentes Específicos Basados en Referencias

#### 1. Dashboard (Basado en Yle)

```
┌─────────────────────────────────────────────────────────────────┐
│  DASHBOARD                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                         │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Bienvenido, [Nombre]! 👋                           │ │
│  │                                                   │ │
│  │  Tu progreso: 65%                                  │ │
│  │  13 de 20 videos completados                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                         │
│  ┌──────────────┐ ┌──────────────────────┐              │
│  │  Próximos    │ │  Continúa Viendo    │              │
│  │  Eventos     │ │                    │              │
│  │              │ │  [Thumbnail]       │              │
│  │  • Demo      │ │  Introducción al... │              │
│  │    Producto  │ │  50% completado     │              │
│  │    Hoy 15:00 │ │  [Continuar ▶]      │              │
│  │              │ │                    │              │
│  │  • Training  │ └──────────────────────┘              │
│  │    Comercial │                                     │
│  │    Mañana    │                                     │
│  │    10:00     │                                     │
│  └──────────────┘                                     │
│                                                         │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Material Reciente                                 │ │
│  │                                                   │ │
│  │  [Img] Brochure Plan Premium  [Img] Guion de Venta   │ │
│  │        Nuevo hace 2 días          Nuevo hace 3 días  │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Novedades                                         │ │
│  │                                                   │ │
│  │  • Nueva capacitación: "Técnicas de Cierre"          │ │
│  │  • Material actualizado: Brochures 2025             │ │
│  │  • Evento especial: Masterclass                    │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────────────┘
```

#### 2. Galería de Cursos (Basado en referencias)

```
┌─────────────────────────────────────────────────────────────────┐
│  CURSOS DISPONIBLES                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                         │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ │
│  │ Web Dev    │ │ Marketing  │ │ UX/UI      │ │ Business  │ │
│  │ (25)       │ │ (20)       │ │ (34)       │ │ (40)      │ │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ [Thumbnail]                                        │ │
│  │                                                   │ │
│  │ Become a Certified Web Developer                    │ │
│  │ HTML, CSS and JavaScript                           │ │
│  │ Price: $140                                       │ │
│  │ 5.0 (50K Reviews)                                 │ │
│  │ [Enroll Course]                                   │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ [Thumbnail]                                        │ │
│  │                                                   │ │
│  │ A Digital Marketing Method                         │ │
│  │ With Communication                                │ │
│  │ Price: $120                                       │ │
│  │ 5.0 (50K Reviews)                                 │ │
│  │ [Enroll Course]                                   │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────────────┘
```

#### 3. Categorías de Cursos (Basado en Examin)

```
┌─────────────────────────────────────────────────────────────────┐
│  CATEGORÍAS DE CURSOS                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────┐ ┌──────────────────────┐        │
│  │  Ingeniería De       │ │  Programa            │        │
│  │  Software           │ │  Interactivo         │        │
│  │  (1,226) Temas      │ │  (2,366) Temas       │        │
│  └──────────────────────┘ └──────────────────────┘        │
│                                                         │
│  ┌──────────────────────┐ ┌──────────────────────┐        │
│  │  Mecánica Cuántica   │ │  Prevención De La    │        │
│  │  (766) Temas        │ │  Dementia           │        │
│  │                    │ │  (4,500) Temas      │        │
│  └──────────────────────┘ └──────────────────────┘        │
│                                                         │
│  ┌──────────────────────┐ ┌──────────────────────┐        │
│  │  Potencial Oculto    │ │  C++ Básico          │        │
│  │  (975) Temas        │ │  (3,340) Temas       │        │
│  └──────────────────────┘ └──────────────────────┘        │
│                                                         │
└─────────────────────────────────────────────────────────────────┘
```

### Guía para Implementación Visual

#### 1. Estructura de Carpetas

```
src/
├── assets/
│   ├── icons/          # Iconos vectoriales
│   ├── images/         # Imágenes placeholder
│   └── fonts/          # Fuentes personalizadas
├── components/
│   ├── ui/            # Componentes reutilizables
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Calendar/
│   │   └── Gallery/
│   └── layouts/        # Layouts principales
├── styles/
│   ├── globals.css     # Estilos globales
│   ├── variables.css   # Variables de color y tipografía
│   └── components.css  # Estilos de componentes
└── pages/
    ├── Dashboard/
    ├── Courses/
    └── Events/
```

#### 2. Variables CSS

```css
:root {
  /* Colores */
  --primary: #3B82F6;
  --primary-dark: #2563EB;
  --primary-light: #EFF6FF;
  
  --secondary: #F59E0B;
  --secondary-dark: #D97706;
  --secondary-light: #FFFBEB;
  
  --success: #10B981;
  --warning: #F59E0B;
  --error: #EF4444;
  --info: #3B82F6;
  
  /* Neutrales */
  --background: #FFFFFF;
  --surface: #F9FAFB;
  --surface-secondary: #F3F4F6;
  --text-primary: #111827;
  --text-secondary: #6B7280;
  --text-tertiary: #9CA3AF;
  --border: #E5E7EB;
  --border-dark: #D1D5DB;
  
  /* Tipografía */
  --font-family: 'Inter', sans-serif;
  --font-size: 16px;
  --line-height: 1.5;
  
  /* Espaciado */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  
  /* Sombras */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

#### 3. Componentes Reutilizables

```jsx
// Button Component
const Button = ({ variant = 'primary', size = 'md', children, ...props }) => {
  const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

### Consideraciones Finales

- **Consistencia**: Mantener los mismos estilos en todos los componentes
- **Accesibilidad**: Contraste mínimo 4.5:1, etiquetas adecuadas
- **Performance**: Optimizar imágenes y assets
- **Testing**: Verificar en diferentes dispositivos y navegadores
- **Documentación**: Mantener documentación de componentes visual

Esta guía visual proporciona una base sólida para la implementación de la plataforma, basada en las mejores prácticas observadas en las referencias proporcionadas, asegurando una experiencia de usuario moderna, profesional y consistente.

---

## 💾 Estructura de Datos

### Colecciones (Tablas) en Appwrite

```
┌─────────────────────────────────────────────────────────────────┐
│                    ESTRUCTURA DE DATOS                          │
│                    (Independiente del motor)                    │
└─────────────────────────────────────────────────────────────────┘
```

### Colección: usuarios

```
usuarios
├── id (string, autogenerado)
├── email (string, único)
├── password (string, hasheado)
├── nombre (string)
├── apellido (string)
├── telefono (string, opcional)
├── avatar (string, URL)
├── rol (string: "SOCIO" | "ASESOR" | "ADMIN")
├── activo (boolean)
├── emailVerificado (boolean)
├── ultimoAcceso (datetime)
├── creadoEn (datetime)
└── actualizadoEn (datetime)

Índices:
- email (único)
- rol
- activo

Permisos:
- SOCIO: Lee su propio documento
- ASESOR: Lee su propio documento
- ADMIN: Lee todos, crea, edita, elimina
```

### Colección: categorias

```
categorias
├── id (string)
├── nombre (string)
├── slug (string, único)
├── descripcion (string, opcional)
├── icono (string, nombre del icono)
├── imagen (string, URL)
├── orden (number)
├── padreId (string, opcional - referencia a categorias)
├── activo (boolean)
├── creadoEn (datetime)
└── actualizadoEn (datetime)

Índices:
- slug (único)
- padreId
- activo

Permisos:
- SOCIO: Lee todos
- ASESOR: Lee todos
- ADMIN: CRUD completo
```

### Colección: videos

```
videos
├── id (string)
├── categoriaId (string, referencia a categorias)
├── titulo (string)
├── slug (string, único)
├── descripcion (string)
├── videoUrl (string, URL del video)
├── videoPlataforma (string: "youtube" | "vimeo" | "appwrite")
├── videoId (string, ID del video en la plataforma)
├── thumbnailUrl (string, URL)
├── duracion (number, segundos)
├── orden (number)
├── materialApoyo (array de objetos)
│   ├── { nombre: string, url: string, tipo: string }
├── destacado (boolean)
├── activo (boolean)
├── creadoEn (datetime)
└── actualizadoEn (datetime)

Índices:
- slug (único)
- categoriaId
- activo
- destacado

Permisos:
- SOCIO: Lee activos
- ASESOR: Lee activos, crea, edita
- ADMIN: CRUD completo
```

### Colección: progreso_videos

```
progreso_videos
├── id (string)
├── usuarioId (string, referencia a usuarios)
├── videoId (string, referencia a videos)
├── progreso (number, 0-100)
├── completado (boolean)
├── tiempoVisto (number, segundos)
├── ultimaVista (datetime)
├── creadoEn (datetime)
└── actualizadoEn (datetime)

Índices:
- usuarioId + videoId (único compuesto)
- usuarioId
- videoId
- completado

Permisos:
- SOCIO: Lee/crea/edita sus propios registros
- ASESOR: Lee sus propios registros
- ADMIN: Lee todos
```

### Colección: eventos

```
eventos
├── id (string)
├── titulo (string)
├── slug (string, único)
├── descripcion (string)
├── tipo (string: "presentacion" | "demo" | "entrenamiento" | "qa" | "masterclass")
├── fechaHora (datetime)
├── duracion (number, minutos)
├── modalidad (string: "virtual" | "presencial")
├── lugar (string, opcional)
├── enlaceVirtual (string, URL, opcional)
├── plataformaVirtual (string: "zoom" | "meet" | "teams")
├── capacidad (number, opcional)
├── inscritos (number)
├── imagen (string, URL)
├── instructor (objeto)
│   ├── nombre: string
│   ├── cargo: string
│   └── foto: string
├── grabacionUrl (string, opcional)
├── grabacionDisponible (boolean)
├── activo (boolean)
├── creadoEn (datetime)
└── actualizadoEn (datetime)

Índices:
- slug (único)
- tipo
- fechaHora
- activo

Permisos:
- SOCIO: Lee activos
- ASESOR: Lee activos, crea, edita
- ADMIN: CRUD completo
```

### Colección: inscripciones_eventos

```
inscripciones_eventos
├── id (string)
├── eventoId (string, referencia a eventos)
├── usuarioId (string, referencia a usuarios)
├── fechaInscripcion (datetime)
├── asistio (boolean)
├── recordatorioEnviado (boolean)
└── creadoEn (datetime)

Índices:
- eventoId + usuarioId (único compuesto)
- eventoId
- usuarioId

Permisos:
- SOCIO: Lee/crea/elimina sus propias inscripciones
- ASESOR: Lee propias, crea/elimina propias
- ADMIN: Lee todas
```

### Colección: materiales

```
materiales
├── id (string)
├── nombre (string)
├── slug (string, único)
├── descripcion (string)
├── categoria (string: "brochure" | "presentacion" | "redes" | "video" | "guion" | "casos")
├── tags (array de strings)
├── archivos (array de objetos)
│   ├── { nombre: string, formato: string, tamano: number, url: string, thumbnail: string }
├── thumbnail (string, URL)
├── descargas (number)
├── destacado (boolean)
├── activo (boolean)
├── creadoEn (datetime)
└── actualizadoEn (datetime)

Índices:
- slug (único)
- categoria
- destacado
- activo

Permisos:
- SOCIO: Lee activos
- ASESOR: Lee activos, crea, edita
- ADMIN: CRUD completo
```

### Colección: descargas_materiales

```
descargas_materiales
├── id (string)
├── materialId (string, referencia a materiales)
├── usuarioId (string, referencia a usuarios)
├── archivoIndice (number, índice del archivo descargado)
└── fecha (datetime)

Índices:
- materialId
- usuarioId

Permisos:
- SOCIO: Crea sus propias descargas
- ADMIN: Lee todas
```

### Colección: favoritos_materiales

```
favoritos_materiales
├── id (string)
├── materialId (string, referencia a materiales)
├── usuarioId (string, referencia a usuarios)
└── creadoEn (datetime)

Índices:
- materialId + usuarioId (único compuesto)

Permisos:
- SOCIO: Lee/crea/elimina sus propios
- ADMIN: Lee todos
```

### Colección: planes

```
planes
├── id (string)
├── nombre (string)
├── slug (string, único)
├── descripcion (string)
├── precio (number)
├── moneda (string: "MXN" | "USD")
├── caracteristicas (objeto JSON)
│   ├── modulos: array
│   ├── usuarios: number | "ilimitado"
│   ├── soporte: string
│   ├── almacenamiento: number
│   └── ...
├── destacado (boolean)
├── badge (string, opcional)
├── color (string, hex)
├── imagen (string, URL)
├── pdfBrochure (string, URL)
├── orden (number)
├── activo (boolean)
├── creadoEn (datetime)
└── actualizadoEn (datetime)

Índices:
- slug (único)
- activo
- orden

Permisos:
- SOCIO: Lee activos
- ASESOR: Lee activos
- ADMIN: CRUD completo
```

### Colección: demos

```
demos
├── id (string)
├── titulo (string)
├── slug (string, único)
├── descripcion (string)
├── tipo (string: "grabada" | "guion")
├── videoUrl (string, opcional)
├── guionUrl (string, opcional)
├── checklistUrl (string, opcional)
├── thumbnail (string, URL)
├── duracion (number, minutos)
├── tags (array de strings)
├── vistas (number)
├── descargas (number)
├── activo (boolean)
├── creadoEn (datetime)
└── actualizadoEn (datetime)

Índices:
- slug (único)
- tipo
- activo

Permisos:
- SOCIO: Lee activos
- ASESOR: Lee activos, edita
- ADMIN: CRUD completo
```

### Colección: noticias

```
noticias
├── id (string)
├── titulo (string)
├── slug (string, único)
├── contenido (string, texto largo)
├── imagen (string, URL)
├── destacada (boolean)
├── activa (boolean)
├── fechaPublicacion (datetime)
├── creadoEn (datetime)
└── actualizadoEn (datetime)

Índices:
- slug (único)
- destacada
- activa
- fechaPublicacion

Permisos:
- SOCIO: Lee activas
- ASESOR: Lee activas, crea, edita
- ADMIN: CRUD completo
```

### Colección: notificaciones

```
notificaciones
├── id (string)
├── usuarioId (string, referencia a usuarios)
├── titulo (string)
├── mensaje (string)
├── tipo (string: "sistema" | "evento" | "material")
├── leida (boolean)
├── link (string, URL opcional)
├── creadoEn (datetime)

Índices:
- usuarioId
- leida
- creadoEn

Permisos:
- SOCIO: Lee/edita sus propias
- ADMIN: Lee todas, crea
```

### Colección: configuracion

```
configuracion
├── id (string)
├── clave (string, único)
├── valor (string o JSON)
├── descripcion (string)
└── actualizadoEn (datetime)

Índices:
- clave (único)

Permisos:
- ADMIN: CRUD completo
```

---

## 🔐 Autenticación y Seguridad

### Flujo de Autenticación

```
┌─────────────────┐
│ Usuario visita  │
│ la plataforma   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐    No     ┌─────────────────┐
│ ¿Está logueado? ├──────────►│ Página de Login │
└────────┬────────┘           └────────┬────────┘
         │ Sí                          │
         ▼                             ▼
┌─────────────────┐           ┌─────────────────┐
│ Verificar rol   │           │ Email + Password│
│ y permisos      │           │ [Ingresar]      │
└────────┬────────┘           └────────┬────────┘
         │                             │
         ▼                             ▼
┌─────────────────┐           ┌─────────────────┐
│ Mostrar         │           │ Validar         │
│ contenido según │           │ credenciales    │
│ rol             │           └────────┬────────┘
└─────────────────┘                    │
                                       ▼
                              ┌─────────────────┐
                              │ Si es válido:   │
                              │ Crear sesión    │
                              │ Redirigir       │
                              └─────────────────┘
```

### Recuperación de Contraseña

```
1. Usuario click en "¿Olvidaste tu contraseña?"
         ↓
2. Ingresa su email
         ↓
3. Sistema envía email con link único (válido 1 hora)
         ↓
4. Usuario click en link
         ↓
5. Usuario ingresa nueva contraseña
         ↓
6. Contraseña actualizada, sesión iniciada
```

### Seguridad

| Aspecto | Implementación |
|---------|---------------|
| Contraseñas | Mínimo 8 caracteres, hasheadas |
| Sesiones | Expiran en 7 días |
| HTTPS | Obligatorio en producción |
| CORS | Configurado en Appwrite |
| Rate limiting | Protección contra fuerza bruta |
| Logs | Registro de actividad |

---

## 🔄 Flujos de Usuario Principales

### Flujo 1: Nuevo Socio

```
1. Recibe email con credenciales temporales
         ↓
2. Ingresa a la plataforma
         ↓
3. Sistema pide cambiar contraseña
         ↓
4. Ve pantalla de bienvenida
         ↓
5. Comienza a explorar capacitaciones
         ↓
6. Ve videos y descarga material
         ↓
7. Se inscribe a eventos
```

### Flujo 2: Ver Capacitación

```
1. Login en la plataforma
         ↓
2. Click en "Capacitaciones"
         ↓
3. Selecciona categoría
         ↓
4. Ve lista de videos
         ↓
5. Click en video de interés
         ↓
6. Reproduce video
         ↓
7. Sistema guarda progreso automáticamente
         ↓
8. Si completa: marca como visto
         ↓
9. Descarga material de apoyo si lo hay
```

### Flujo 3: Inscribirse a Evento

```
1. Click en "Eventos"
         ↓
2. Ve calendario semanal
         ↓
3. Encuentra evento de interés
         ↓
4. Click en evento para ver detalle
         ↓
5. Click en "Inscribirme"
         ↓
6. Confirmación de inscripción
         ↓
7. Opcional: Agregar a Google Calendar
         ↓
8. Recibe email de confirmación
         ↓
9. Recibe recordatorio 1 hora antes
         ↓
10. Click en "Unirse al evento" cuando sea hora
```

### Flujo 4: Descargar Material

```
1. Click en "Material POP"
         ↓
2. Navega por categorías o busca
         ↓
3. Click en material de interés
         ↓
4. Vista previa (si está disponible)
         ↓
5. Click en "Descargar"
         ↓
6. Archivo se descarga
         ↓
7. Sistema registra descarga
```

### Flujo 5: Asesor Carga Video

```
1. Login como ASESOR
         ↓
2. Accede al Panel de Administración
         ↓
3. Click en "Videos"
         ↓
4. Click en "+ Nuevo video"
         ↓
5. Completa formulario:
   - Título
   - Descripción
   - Categoría
   - URL del video (YouTube/Vimeo)
   - Thumbnail
   - Duración
   - Material de apoyo (opcional)
         ↓
6. Click en "Guardar"
         ↓
7. Video visible para todos los socios
```

### Flujo 6: Admin Crea Usuario

```
1. Login como ADMIN
         ↓
2. Accede al Panel de Administración
         ↓
3. Click en "Usuarios"
         ↓
4. Click en "+ Nuevo usuario"
         ↓
5. Completa formulario:
   - Nombre
   - Apellido
   - Email
   - Rol (SOCIO | ASESOR | ADMIN)
   - Contraseña temporal
         ↓
6. Click en "Crear"
         ↓
7. Sistema envía email al nuevo usuario
         ↓
8. Usuario debe cambiar contraseña al primer login
```

---

## 📧 Emails del Sistema

### Tipos de Email

| Email | Destinatario | Cuándo se envía |
|-------|--------------|-----------------|
| Bienvenida | Nuevo usuario | Al crear cuenta |
| Recuperar contraseña | Usuario | Al solicitar |
| Confirmación inscripción | Usuario | Al inscribirse a evento |
| Recordatorio evento | Usuario | 1 hora antes del evento |
| Novedades | Todos | Mensual (opcional) |

### Plantillas de Email

#### Email de Bienvenida

```
Asunto: ¡Bienvenido a la Plataforma de Capacitación!

Hola [Nombre],

Tu cuenta ha sido creada exitosamente.

Puedes acceder a la plataforma con las siguientes credenciales:

Email: [email]
Contraseña temporal: [password]

Por seguridad, te recomendamos cambiar tu contraseña después del primer ingreso.

[Botón: Ingresar a la Plataforma]

Saludos,
El equipo de capacitación
```

#### Email de Recordatorio de Evento

```
Asunto: Recordatorio: [Nombre del evento] comienza en 1 hora

Hola [Nombre],

Te recordamos que el evento "[Nombre del evento]" 
comenzará en 1 hora.

Detalles:
📅 Fecha: [fecha]
🕐 Hora: [hora]
📍 Lugar: [virtual/presencial]

[Botón: Unirse al Evento]

Si no puedes asistir, la grabación estará disponible 
en las próximas 24 horas.

Saludos,
El equipo de capacitación
```

---

## 📊 Estadísticas (Solo Admin y Asesor)

### Métricas Disponibles

| Métrica | Quién la ve |
|---------|-------------|
| Videos más vistos | ASESOR y ADMIN |
| Material más descargado | ASESOR y ADMIN |
| Eventos con más inscripciones | ASESOR y ADMIN |
| Usuarios activos | Solo ADMIN |
| Últimos accesos | Solo ADMIN |
| Crecimiento mensual | Solo ADMIN |

### Dashboard de Estadísticas

```
┌─────────────────────────────────────────────────────────────────┐
│  ESTADÍSTICAS                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Período: [Este mes ▼]                                         │
│                                                                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │
│  │ 👁️ Vistas    │ │ ⬇️ Descargas │ │ 📅 Inscripc. │           │
│  │    1,234     │ │     567      │ │     89       │           │
│  │   +23%       │ │   +15%       │ │   +45%       │           │
│  └──────────────┘ └──────────────┘ └──────────────┘           │
│                                                                 │
│  ═══════════════════════════════════════════════════════════   │
│                                                                 │
│  📹 Videos más vistos:                                          │
│  1. Introducción a la Plataforma ──────────── 234 vistas       │
│  2. Técnicas de Venta ─────────────────────── 189 vistas       │
│  3. Módulo Contabilidad ───────────────────── 156 vistas       │
│                                                                 │
│  ═══════════════════════════════════════════════════════════   │
│                                                                 │
│  📦 Material más descargado:                                    │
│  1. Brochure Plan Premium ────────────────── 89 descargas      │
│  2. Presentación Corporativa ─────────────── 67 descargas      │
│  3. Guion de Demo ────────────────────────── 45 descargas      │
│                                                                 │
│  ═══════════════════════════════════════════════════════════   │
│                                                                 │
│  👥 Usuarios activos (Solo ADMIN):                              │
│  • Total usuarios: 156                                         │
│  • Activos este mes: 98                                        │
│  • Nuevos este mes: 12                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📱 Responsive Design

### Breakpoints

| Dispositivo | Ancho | Comportamiento |
|-------------|-------|----------------|
| Mobile | < 640px | Sidebar oculta, navegación inferior |
| Tablet | 640px - 1024px | Sidebar colapsable |
| Desktop | > 1024px | Sidebar visible, layout completo |

### Adaptaciones

| Elemento | Mobile | Desktop |
|----------|--------|---------|
| Sidebar | Menú hamburguesa | Visible permanente |
| Cards | 1 columna | 3-4 columnas |
| Tablas | Scroll horizontal | Normal |
| Video | Full width | Centrado con max-width |
| Calendario | Lista | Grid semanal |

---

## 🚀 Plan de Implementación

### Fase 1: Configuración (Semana 1)

| Día | Tarea | Responsable |
|-----|-------|-------------|
| 1-2 | Instalar Appwrite en VPS | Equipo dev |
| 3-4 | Configurar dominio y SSL | Equipo dev |
| 5 | Crear colecciones en DB | Equipo dev |
| 6-7 | Configurar autenticación | Equipo dev |

### Fase 2: Frontend Base (Semana 2)

| Día | Tarea | Responsable |
|-----|-------|-------------|
| 1-2 | Crear proyecto en plataforma no-code | Equipo dev |
| 3-4 | Diseñar layout principal | Equipo dev |
| 5-6 | Implementar autenticación | Equipo dev |
| 7 | Conectar con Appwrite | Equipo dev |

### Fase 3: Módulos Principales (Semanas 3-4)

| Día | Tarea |
|-----|-------|
| 1-3 | Módulo de Capacitaciones |
| 4-5 | Módulo de Eventos |
| 6-7 | Módulo de Material POP |
| 8-10 | Módulo de Planes y Demos |
| 11-12 | Dashboard principal |

### Fase 4: Panel Admin (Semana 5)

| Día | Tarea |
|-----|-------|
| 1-3 | CRUD de Videos |
| 4-5 | CRUD de Eventos |
| 6-7 | CRUD de Material |
| 8-10 | Gestión de Usuarios (Admin) |

### Fase 5: Pruebas y Ajustes (Semana 6)

| Día | Tarea |
|-----|-------|
| 1-3 | Pruebas de funcionalidad |
| 4-5 | Pruebas de permisos por rol |
| 6-7 | Corrección de bugs |
| 8-10 | Optimización y ajustes finales |

---

## ✅ Checklist de Lanzamiento

### Funcionalidad

- [ ] Login funciona correctamente
- [ ] Recuperación de contraseña funciona
- [ ] Cambio de contraseña obligatorio (primer login)
- [ ] Videos se reproducen
- [ ] Progreso se guarda
- [ ] Material se descarga
- [ ] Eventos se muestran
- [ ] Inscripciones funcionan
- [ ] Panel admin funciona
- [ ] Permisos por rol funcionan

### Contenido

- [ ] Videos de capacitación cargados
- [ ] Material POP disponible
- [ ] Eventos programados
- [ ] Planes actualizados
- [ ] Demos disponibles

### Técnico

- [ ] Appwrite funcionando
- [ ] SSL activo
- [ ] Dominio configurado
- [ ] Emails funcionando
- [ ] Backups configurados

---

## 📝 Notas Importantes

### Lo que esta plataforma NO hace

| NO hace | Ya existe en la plataforma multinivel |
|---------|--------------------------------------|
| Mostrar comisiones | ✅ Ya existe |
| Mostrar rankings | ✅ Ya existe |
| Mostrar KPIs financieros | ✅ Ya existe |
| Gestionar la red | ✅ Ya existe |
| Procesar pagos | ✅ Ya existe |
| Mostrar downline | ✅ Ya existe |

### Lo que esta plataforma SÍ hace

| SÍ hace | Propósito |
|---------|-----------|
| Capacitar en el producto | Educativo |
| Capacitar en ventas | Educativo |
| Capacitar en liderazgo | Educativo |
| Facilitar material | Comercial |
| Organizar eventos | Formativo |
| Comparar planes | Informativo |

### Integración con Plataforma Multinivel

```
┌─────────────────────┐
│ Plataforma          │
│ Multinivel          │
│ (EXISTENTE)         │
├─────────────────────┤
│ • Comisiones        │
│ • Rankings          │
│ • KPIs              │
│ • Red               │
│ • Pagos             │
└──────────┬──────────┘
           │
           │ Solo referencia por ID
           │ (sin duplicar datos)
           │
           ▼
┌─────────────────────┐
│ Plataforma de       │
│ Capacitación        │
│ (NUEVA)             │
├─────────────────────┤
│ • Videos            │
│ • Material POP      │
│ • Eventos           │
│ • Capacitaciones    │
└─────────────────────┘
```

---

## 🎨 Guía para la IA (Low-Code/No-Code)

### Cómo usar este PRD

1. **Estructura de datos**: Cada colección define exactamente qué campos crear en Appwrite

2. **Permisos**: La matriz de permisos define qué puede hacer cada rol

3. **Pantallas**: Los wireframes muestran exactamente qué debe verse

4. **Flujos**: Los diagramas de flujo muestran cómo navega el usuario

5. **Estilo visual**: Usar referencias como Stripe, Notion, Linear

### Referencias visuales para la IA

Para transmitir el estilo visual, proporcionar:
- Capturas de pantalla de Stripe Dashboard
- Capturas de Notion
- Capturas de Linear
- Links a plantillas similares

### Orden de implementación recomendado

```
1. Configurar Appwrite (colecciones, permisos)
         ↓
2. Crear autenticación
         ↓
3. Crear layout principal (header, sidebar, footer)
         ↓
4. Crear módulo de Capacitaciones
         ↓
5. Crear módulo de Eventos
         ↓
6. Crear módulo de Material POP
         ↓
7. Crear módulo de Planes
         ↓
8. Crear Dashboard
         ↓
9. Crear Panel de Administración
         ↓
10. Probar y ajustar
```

---

**FIN DEL PRD**

**Versión: 3.0 (Revisado y Corregido)**
**Fecha: Enero 2025**
**Backend: Appwrite (autoalojado)**
**Frontend: Recomendado para low-code/no-code**
**Infraestructura: VPS propio**
