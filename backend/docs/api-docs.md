# Documentación de API
## Plataforma de Capacitación y Apoyo para Socios

Esta documentación describe todos los endpoints y funciones serverless disponibles en la plataforma.

---

## 📋 Índice

1. [Configuración General](#configuración-general)
2. [Autenticación](#autenticación)
3. [Colecciones de Base de Datos](#colecciones-de-base-de-datos)
4. [Funciones Serverless](#funciones-serverless)
5. [Webhooks](#webhooks)
6. [Códigos de Error](#códigos-de-error)

---

## 🔧 Configuración General

### Base URL

```
Producción: https://api.tudominio.com/v1
Desarrollo: http://localhost:3000/api/v1
```

### Headers Requeridos

```http
Content-Type: application/json
X-Appwrite-Project: tu_project_id
X-Appwrite-Key: tu_api_key  # Para operaciones de servidor
```

### Autenticación de Usuario

```http
X-Appwrite-Session: session_id  # Obtenido al iniciar sesión
```

---

## 🔐 Autenticación

### Iniciar Sesión

**Endpoint:** `POST /account/sessions/email`

```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Respuesta:**
```json
{
  "$id": "session_id",
  "userId": "user_id",
  "secret": "session_secret",
  "expiresAt": 1234567890
}
```

### Cerrar Sesión

**Endpoint:** `DELETE /account/sessions/{sessionId}`

### Obtener Usuario Actual

**Endpoint:** `GET /account`

**Respuesta:**
```json
{
  "$id": "user_id",
  "email": "usuario@ejemplo.com",
  "name": "Nombre Usuario",
  "registration": "2024-01-01T00:00:00.000Z",
  "status": true,
  "emailVerification": true
}
```

### Recuperar Contraseña

**Endpoint:** `POST /account/recovery`

```json
{
  "email": "usuario@ejemplo.com",
  "url": "https://tudominio.com/recuperar-contrasena"
}
```

---

## 📦 Colecciones de Base de Datos

### Usuarios

| Campo | Tipo | Descripción |
|-------|------|-------------|
| nombre | string | Nombre del usuario |
| apellido | string | Apellido del usuario |
| email | string | Email (único) |
| telefono | string | Teléfono |
| avatar | string | URL del avatar |
| rol | string | SOCIO, ASESOR, ADMIN |
| activo | boolean | Usuario activo |
| emailVerificado | boolean | Email verificado |
| ultimoAcceso | datetime | Último acceso |
| creadoEn | datetime | Fecha de creación |
| actualizadoEn | datetime | Última actualización |

**Endpoints:**
- `GET /databases/{databaseId}/collections/usuarios/documents` - Listar usuarios
- `GET /databases/{databaseId}/collections/usuarios/documents/{documentId}` - Obtener usuario
- `POST /databases/{databaseId}/collections/usuarios/documents` - Crear usuario
- `PUT /databases/{databaseId}/collections/usuarios/documents/{documentId}` - Actualizar usuario
- `DELETE /databases/{databaseId}/collections/usuarios/documents/{documentId}` - Eliminar usuario

---

### Categorías

| Campo | Tipo | Descripción |
|-------|------|-------------|
| nombre | string | Nombre de la categoría |
| slug | string | Slug único para URL |
| descripcion | string | Descripción |
| icono | string | Nombre del icono (Lucide) |
| imagen | string | URL de imagen |
| orden | integer | Orden de visualización |
| padreId | string | ID de categoría padre |
| activo | boolean | Categoría activa |

**Endpoints:**
- `GET /databases/{databaseId}/collections/categorias/documents` - Listar categorías
- `GET /databases/{databaseId}/collections/categorias/documents/{documentId}` - Obtener categoría

**Ejemplo de respuesta:**
```json
{
  "$id": "categoria_id",
  "nombre": "Uso de Plataforma",
  "slug": "uso-plataforma",
  "descripcion": "Aprende a utilizar la plataforma",
  "icono": "smartphone",
  "orden": 1,
  "activo": true
}
```

---

### Videos de Capacitación

| Campo | Tipo | Descripción |
|-------|------|-------------|
| categoriaId | string | ID de la categoría |
| titulo | string | Título del video |
| slug | string | Slug único |
| descripcion | string | Descripción |
| videoUrl | string | URL del video |
| videoPlataforma | string | youtube, vimeo, appwrite |
| videoId | string | ID en la plataforma |
| thumbnailUrl | string | URL de miniatura |
| duracion | integer | Duración en segundos |
| orden | integer | Orden de visualización |
| materialApoyo | string | JSON con materiales |
| destacado | boolean | Video destacado |
| activo | boolean | Video activo |

**Endpoints:**
- `GET /databases/{databaseId}/collections/videos/documents` - Listar videos
- `GET /databases/{databaseId}/collections/videos/documents/{documentId}` - Obtener video

**Queries útiles:**
```
# Videos por categoría
?queries[]={"attribute":"categoriaId","value":"categoria_id"}

# Videos destacados
?queries[]={"attribute":"destacado","value":true}

# Videos activos
?queries[]={"attribute":"activo","value":true}
```

---

### Progreso de Videos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| usuarioId | string | ID del usuario |
| videoId | string | ID del video |
| progreso | integer | Progreso (0-100) |
| completado | boolean | Video completado |
| tiempoVisto | integer | Tiempo visto (segundos) |
| ultimaVista | datetime | Última visualización |

**Endpoints:**
- `GET /databases/{databaseId}/collections/progreso_videos/documents` - Listar progreso
- `POST /databases/{databaseId}/collections/progreso_videos/documents` - Crear/actualizar progreso

---

### Eventos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| titulo | string | Título del evento |
| slug | string | Slug único |
| descripcion | string | Descripción |
| tipo | string | presentacion, demo, entrenamiento, qa, masterclass |
| fechaHora | datetime | Fecha y hora |
| duracion | integer | Duración en minutos |
| modalidad | string | virtual, presencial |
| lugar | string | Lugar (presencial) |
| enlaceVirtual | string | URL del evento |
| plataformaVirtual | string | zoom, meet, teams |
| capacidad | integer | Capacidad máxima |
| inscritos | integer | Número de inscritos |
| imagen | string | URL de imagen |
| instructorNombre | string | Nombre del instructor |
| grabacionUrl | string | URL de grabación |
| grabacionDisponible | boolean | Grabación disponible |
| activo | boolean | Evento activo |

---

### Material POP

| Campo | Tipo | Descripción |
|-------|------|-------------|
| nombre | string | Nombre del material |
| slug | string | Slug único |
| descripcion | string | Descripción |
| categoria | string | brochure, presentacion, redes, video, guion, casos |
| tags | string | JSON con array de tags |
| archivos | string | JSON con array de archivos |
| thumbnail | string | URL de miniatura |
| descargas | integer | Número de descargas |
| destacado | boolean | Material destacado |
| activo | boolean | Material activo |

---

### Planes

| Campo | Tipo | Descripción |
|-------|------|-------------|
| nombre | string | Nombre del plan |
| slug | string | Slug único |
| descripcion | string | Descripción |
| precio | float | Precio |
| moneda | string | MXN, USD |
| caracteristicas | string | JSON con características |
| destacado | boolean | Plan destacado |
| badge | string | Badge (ej: "Popular") |
| color | string | Color del plan |
| orden | integer | Orden de visualización |
| activo | boolean | Plan activo |

---

### Demos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| titulo | string | Título de la demo |
| slug | string | Slug único |
| descripcion | string | Descripción |
| tipo | string | grabada, guion |
| videoUrl | string | URL del video |
| guionUrl | string | URL del guion |
| checklistUrl | string | URL del checklist |
| thumbnail | string | URL de miniatura |
| duracion | integer | Duración en minutos |
| tags | string | JSON con tags |
| vistas | integer | Número de vistas |
| descargas | integer | Número de descargas |
| activo | boolean | Demo activa |

---

### Noticias

| Campo | Tipo | Descripción |
|-------|------|-------------|
| titulo | string | Título |
| slug | string | Slug único |
| contenido | string | Contenido (Markdown) |
| imagen | string | URL de imagen |
| destacada | boolean | Noticia destacada |
| activa | boolean | Noticia activa |
| fechaPublicacion | datetime | Fecha de publicación |

---

### Notificaciones

| Campo | Tipo | Descripción |
|-------|------|-------------|
| usuarioId | string | ID del usuario |
| titulo | string | Título |
| mensaje | string | Mensaje |
| tipo | string | sistema, evento, material |
| leida | boolean | Notificación leída |
| link | string | URL de enlace |

---

## ⚡ Funciones Serverless

### 1. Envío de Notificaciones

**Endpoint:** `POST /functions/send-notification/executions`

**Descripción:** Envía una notificación a un usuario específico.

**Body:**
```json
{
  "usuarioId": "user_id",
  "titulo": "Nueva actualización",
  "mensaje": "Hay un nuevo video disponible",
  "tipo": "sistema",
  "link": "/videos/nuevo-video"
}
```

**Respuesta:**
```json
{
  "success": true,
  "notification": {
    "id": "notification_id",
    "titulo": "Nueva actualización",
    "mensaje": "Hay un nuevo video disponible",
    "tipo": "sistema",
    "creadoEn": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 2. Inscripción a Eventos

**Endpoint:** `POST /functions/event-registration/executions`

**Descripción:** Inscribe un usuario a un evento.

**Body:**
```json
{
  "eventoId": "evento_id",
  "usuarioId": "user_id"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "inscripcion": {
    "id": "inscripcion_id",
    "eventoId": "evento_id",
    "fechaInscripcion": "2024-01-01T00:00:00.000Z"
  },
  "evento": {
    "titulo": "Webinar de Ventas",
    "fechaHora": "2024-01-15T10:00:00.000Z",
    "enlaceVirtual": "https://zoom.us/j/example"
  }
}
```

**Errores posibles:**
- `Evento no encontrado` - El evento no existe
- `Ya estás inscrito en este evento` - Inscripción duplicada
- `El evento ha alcanzado su capacidad máxima` - Sin cupo

---

### 3. Actualizar Progreso de Video

**Endpoint:** `POST /functions/update-video-progress/executions`

**Descripción:** Actualiza el progreso de visualización de un video.

**Body:**
```json
{
  "usuarioId": "user_id",
  "videoId": "video_id",
  "progreso": 75,
  "tiempoVisto": 450,
  "completado": false
}
```

**Respuesta:**
```json
{
  "success": true,
  "progreso": {
    "id": "progreso_id",
    "progreso": 75,
    "completado": false,
    "tiempoVisto": 450,
    "ultimaVista": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 4. Enviar Recordatorio de Evento

**Endpoint:** `GET /functions/send-event-reminder/executions`

**Descripción:** Envía recordatorios a usuarios con eventos próximos (24 horas). Programar como cron job.

**Respuesta:**
```json
{
  "success": true,
  "message": "Recordatorios enviados: 15",
  "eventosProximos": 3,
  "recordatoriosEnviados": 15
}
```

---

### 5. Obtener Estadísticas del Usuario

**Endpoint:** `GET /functions/user-stats/executions?usuarioId={userId}`

**Descripción:** Obtiene estadísticas completas de un usuario.

**Respuesta:**
```json
{
  "success": true,
  "stats": {
    "usuario": {
      "id": "user_id"
    },
    "capacitacion": {
      "videosCompletados": 12,
      "videosEnProgreso": 3,
      "videosTotal": 15,
      "tiempoTotalVisto": 5400,
      "tiempoFormateado": "1h 30min",
      "progresoPromedio": 68
    },
    "eventos": {
      "inscritos": 5,
      "asistidos": 3,
      "proximos": [
        {
          "id": "evento_id",
          "titulo": "Webinar de Ventas",
          "fechaHora": "2024-01-15T10:00:00.000Z",
          "modalidad": "virtual"
        }
      ]
    },
    "materiales": {
      "descargados": 8,
      "favoritos": 4
    },
    "notificaciones": {
      "noLeidas": 2
    },
    "actividad": {
      "nivel": "intermedio",
      "score": 23
    }
  }
}
```

---

## 🔗 Webhooks

### Eventos Disponibles

| Evento | Descripción |
|--------|-------------|
| `users.create` | Nuevo usuario creado |
| `users.update` | Usuario actualizado |
| `users.delete` | Usuario eliminado |
| `databases.documents.create` | Documento creado |
| `databases.documents.update` | Documento actualizado |
| `databases.documents.delete` | Documento eliminado |

### Configuración de Webhook

1. Ir a Appwrite Console > Webhooks
2. Crear nuevo webhook
3. Configurar URL de destino
4. Seleccionar eventos a escuchar
5. Guardar

### Ejemplo de Payload

```json
{
  "name": "databases.documents.create",
  "data": {
    "$id": "document_id",
    "$collection": "collection_id",
    "$database": "database_id",
    "titulo": "Nuevo Video"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## ⚠️ Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Bad Request - Parámetros inválidos |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Conflicto (ej: duplicado) |
| 429 | Too Many Requests - Rate limit excedido |
| 500 | Internal Server Error - Error del servidor |
| 503 | Service Unavailable - Servicio no disponible |

### Formato de Error

```json
{
  "success": false,
  "error": "Descripción del error",
  "code": "ERROR_CODE"
}
```

---

## 📊 Rate Limits

| Tipo | Límite |
|------|--------|
| Requests por minuto | 60 |
| Upload por request | 50MB |
| Funciones simultáneas | 10 |

---

## 🔒 Permisos por Rol

### SOCIO
- Leer videos activos
- Leer eventos activos
- Leer materiales activos
- Leer planes activos
- Leer demos activas
- Gestionar propio progreso
- Gestionar propias inscripciones
- Gestionar propios favoritos

### ASESOR
- Todos los permisos de SOCIO
- Crear/editar videos
- Crear/editar eventos
- Crear/editar materiales
- Crear/editar demos
- Crear/editar noticias

### ADMIN
- Todos los permisos
- Gestionar usuarios
- Gestionar planes
- Gestionar configuración
- Ver todas las estadísticas

---

## 📝 Ejemplos de Uso

### Listar videos destacados

```javascript
const response = await fetch(
  'https://api.tudominio.com/v1/databases/plataforma_capacitacion/collections/videos/documents?queries[]={"attribute":"destacado","value":true,"method":"equal"}',
  {
    headers: {
      'X-Appwrite-Project': 'tu_project_id'
    }
  }
);
const data = await response.json();
console.log(data.documents);
```

### Crear progreso de video

```javascript
const response = await fetch(
  'https://api.tudominio.com/v1/functions/update-video-progress/executions',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': 'tu_project_id'
    },
    body: JSON.stringify({
      usuarioId: 'user_id',
      videoId: 'video_id',
      progreso: 50,
      tiempoVisto: 300
    })
  }
);
const data = await response.json();
console.log(data);
```

---

**FIN DE LA DOCUMENTACIÓN**
