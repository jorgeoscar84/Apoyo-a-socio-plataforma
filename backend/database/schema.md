# Esquema de Base de Datos - Appwrite
## Plataforma de Capacitación y Apoyo para Socios

Este documento define la estructura de colecciones y atributos para Appwrite.

---

## 📋 Índice de Colecciones

1. [usuarios](#colección-usuarios)
2. [categorias](#colección-categorias)
3. [videos](#colección-videos)
4. [progreso_videos](#colección-progreso_videos)
5. [eventos](#colección-eventos)
6. [inscripciones_eventos](#colección-inscripciones_eventos)
7. [materiales](#colección-materiales)
8. [descargas_materiales](#colección-descargas_materiales)
9. [favoritos_materiales](#colección-favoritos_materiales)
10. [planes](#colección-planes)
11. [demos](#colección-demos)
12. [noticias](#colección-noticias)
13. [notificaciones](#colección-notificaciones)
14. [configuracion](#colección-configuracion)

---

## 🗂️ Colección: usuarios

### Propósito
Almacena la información de todos los usuarios de la plataforma.

### Atributos

| Nombre | Tipo | Requerido | Único | Descripción |
|--------|------|-----------|-------|-------------|
| nombre | string | Sí | No | Nombre del usuario |
| apellido | string | Sí | No | Apellido del usuario |
| email | string | Sí | Sí | Email del usuario (único) |
| telefono | string | No | No | Teléfono del usuario |
| avatar | string | No | No | URL del avatar del usuario |
| rol | string | Sí | No | Rol del usuario: "SOCIO", "ASESOR", "ADMIN" |
| activo | boolean | Sí | No | Si el usuario está activo |
| emailVerificado | boolean | Sí | No | Si el email está verificado |
| ultimoAcceso | datetime | No | No | Fecha del último acceso |
| creadoEn | datetime | Sí | No | Fecha de creación |
| actualizadoEn | datetime | Sí | No | Fecha de última actualización |

### Índices

| Nombre | Campos | Tipo |
|--------|--------|------|
| idx_email | email | unique |
| idx_rol | rol | key |
| idx_activo | activo | key |

### Permisos

| Rol | Permisos |
|-----|----------|
| SOCIO | Leer su propio documento |
| ASESOR | Leer su propio documento |
| ADMIN | Leer todos, Crear, Editar, Eliminar |

---

## 🗂️ Colección: categorias

### Propósito
Almacena las categorías para organizar videos, materiales y eventos.

### Atributos

| Nombre | Tipo | Requerido | Único | Descripción |
|--------|------|-----------|-------|-------------|
| nombre | string | Sí | No | Nombre de la categoría |
| slug | string | Sí | Sí | Slug único para URL |
| descripcion | string | No | No | Descripción de la categoría |
| icono | string | No | No | Nombre del icono (Lucide) |
| imagen | string | No | No | URL de la imagen de la categoría |
| orden | integer | Sí | No | Orden de visualización |
| padreId | string | No | No | ID de categoría padre (para subcategorías) |
| activo | boolean | Sí | No | Si la categoría está activa |
| creadoEn | datetime | Sí | No | Fecha de creación |
| actualizadoEn | datetime | Sí | No | Fecha de última actualización |

### Índices

| Nombre | Campos | Tipo |
|--------|--------|------|
| idx_slug | slug | unique |
| idx_padreId | padreId | key |
| idx_activo | activo | key |

### Permisos

| Rol | Permisos |
|-----|----------|
| SOCIO | Leer todos |
| ASESOR | Leer todos |
| ADMIN | Leer todos, Crear, Editar, Eliminar |

---

## 🗂️ Colección: videos

### Propósito
Almacena los videos de capacitación.

### Atributos

| Nombre | Tipo | Requerido | Único | Descripción |
|--------|------|-----------|-------|-------------|
| categoriaId | string | Sí | No | ID de la categoría |
| titulo | string | Sí | No | Título del video |
| slug | string | Sí | Sí | Slug único para URL |
| descripcion | string | Sí | No | Descripción del video |
| videoUrl | string | Sí | No | URL del video (YouTube, Vimeo, etc.) |
| videoPlataforma | string | Sí | No | Plataforma: "youtube", "vimeo", "appwrite" |
| videoId | string | Sí | No | ID del video en la plataforma |
| thumbnailUrl | string | No | No | URL de la miniatura |
| duracion | integer | Sí | No | Duración en segundos |
| orden | integer | Sí | No | Orden de visualización |
| materialApoyo | string | No | No | JSON con array de materiales de apoyo |
| destacado | boolean | Sí | No | Si es un video destacado |
| activo | boolean | Sí | No | Si el video está activo |
| creadoEn | datetime | Sí | No | Fecha de creación |
| actualizadoEn | datetime | Sí | No | Fecha de última actualización |

### Índices

| Nombre | Campos | Tipo |
|--------|--------|------|
| idx_slug | slug | unique |
| idx_categoriaId | categoriaId | key |
| idx_activo | activo | key |
| idx_destacado | destacado | key |

### Permisos

| Rol | Permisos |
|-----|----------|
| SOCIO | Leer activos |
| ASESOR | Leer activos, Crear, Editar |
| ADMIN | Leer todos, Crear, Editar, Eliminar |

---

## 🗂️ Colección: progreso_videos

### Propósito
Registra el progreso de los usuarios en los videos.

### Atributos

| Nombre | Tipo | Requerido | Único | Descripción |
|--------|------|-----------|-------|-------------|
| usuarioId | string | Sí | No | ID del usuario |
| videoId | string | Sí | No | ID del video |
| progreso | integer | Sí | No | Progreso del video (0-100) |
| completado | boolean | Sí | No | Si el video fue completado |
| tiempoVisto | integer | Sí | No | Tiempo visto en segundos |
| ultimaVista | datetime | No | No | Fecha de última vista |
| creadoEn | datetime | Sí | No | Fecha de creación |
| actualizadoEn | datetime | Sí | No | Fecha de última actualización |

### Índices

| Nombre | Campos | Tipo |
|--------|--------|------|
| idx_usuario_video | usuarioId, videoId | unique |
| idx_usuarioId | usuarioId | key |
| idx_videoId | videoId | key |
| idx_completado | completado | key |

### Permisos

| Rol | Permisos |
|-----|----------|
| SOCIO | Leer/Crear/Editar sus propios registros |
| ASESOR | Leer sus propios registros |
| ADMIN | Leer todos |

---

## 🗂️ Colección: eventos

### Propósito
Almacena los eventos formativos.

### Atributos

| Nombre | Tipo | Requerido | Único | Descripción |
|--------|------|-----------|-------|-------------|
| titulo | string | Sí | No | Título del evento |
| slug | string | Sí | Sí | Slug único para URL |
| descripcion | string | Sí | No | Descripción del evento |
| tipo | string | Sí | No | Tipo: "presentacion", "demo", "entrenamiento", "qa", "masterclass" |
| fechaHora | datetime | Sí | No | Fecha y hora del evento |
| duracion | integer | Sí | No | Duración en minutos |
| modalidad | string | Sí | No | Modalidad: "virtual", "presencial" |
| lugar | string | No | No | Lugar del evento (si es presencial) |
| enlaceVirtual | string | No | No | URL del enlace virtual (Zoom, Meet, etc.) |
| plataformaVirtual | string | No | No | Plataforma: "zoom", "meet", "teams" |
| capacidad | integer | No | No | Capacidad máxima |
| inscritos | integer | Sí | No | Número de inscritos |
| imagen | string | No | No | URL de la imagen del evento |
| instructorNombre | string | Sí | No | Nombre del instructor |
| instructorCargo | string | No | No | Cargo del instructor |
| instructorFoto | string | No | No | URL de la foto del instructor |
| grabacionUrl | string | No | No | URL de la grabación |
| grabacionDisponible | boolean | Sí | No | Si la grabación está disponible |
| activo | boolean | Sí | No | Si el evento está activo |
| creadoEn | datetime | Sí | No | Fecha de creación |
| actualizadoEn | datetime | Sí | No | Fecha de última actualización |

### Índices

| Nombre | Campos | Tipo |
|--------|--------|------|
| idx_slug | slug | unique |
| idx_tipo | tipo | key |
| idx_fechaHora | fechaHora | key |
| idx_activo | activo | key |

### Permisos

| Rol | Permisos |
|-----|----------|
| SOCIO | Leer activos |
| ASESOR | Leer activos, Crear, Editar |
| ADMIN | Leer todos, Crear, Editar, Eliminar |

---

## 🗂️ Colección: inscripciones_eventos

### Propósito
Registra las inscripciones de usuarios a eventos.

### Atributos

| Nombre | Tipo | Requerido | Único | Descripción |
|--------|------|-----------|-------|-------------|
| eventoId | string | Sí | No | ID del evento |
| usuarioId | string | Sí | No | ID del usuario |
| fechaInscripcion | datetime | Sí | No | Fecha de inscripción |
| asistio | boolean | Sí | No | Si asistió al evento |
| recordatorioEnviado | boolean | Sí | No | Si se envió recordatorio |
| creadoEn | datetime | Sí | No | Fecha de creación |

### Índices

| Nombre | Campos | Tipo |
|--------|--------|------|
| idx_evento_usuario | eventoId, usuarioId | unique |
| idx_eventoId | eventoId | key |
| idx_usuarioId | usuarioId | key |

### Permisos

| Rol | Permisos |
|-----|----------|
| SOCIO | Leer/Crear/Eliminar sus propias inscripciones |
| ASESOR | Leer propias, Crear/Eliminar propias |
| ADMIN | Leer todas |

---

## 🗂️ Colección: materiales

### Propósito
Almacena el material POP disponible.

### Atributos

| Nombre | Tipo | Requerido | Único | Descripción |
|--------|------|-----------|-------|-------------|
| nombre | string | Sí | No | Nombre del material |
| slug | string | Sí | Sí | Slug único para URL |
| descripcion | string | Sí | No | Descripción del material |
| categoria | string | Sí | No | Categoría: "brochure", "presentacion", "redes", "video", "guion", "casos" |
| tags | string | No | No | JSON con array de tags |
| archivos | string | Sí | No | JSON con array de archivos {nombre, formato, tamano, url, thumbnail} |
| thumbnail | string | No | No | URL de la miniatura |
| descargas | integer | Sí | No | Número de descargas |
| destacado | boolean | Sí | No | Si es material destacado |
| activo | boolean | Sí | No | Si el material está activo |
| creadoEn | datetime | Sí | No | Fecha de creación |
| actualizadoEn | datetime | Sí | No | Fecha de última actualización |

### Índices

| Nombre | Campos | Tipo |
|--------|--------|------|
| idx_slug | slug | unique |
| idx_categoria | categoria | key |
| idx_destacado | destacado | key |
| idx_activo | activo | key |

### Permisos

| Rol | Permisos |
|-----|----------|
| SOCIO | Leer activos |
| ASESOR | Leer activos, Crear, Editar |
| ADMIN | Leer todos, Crear, Editar, Eliminar |

---

## 🗂️ Colección: descargas_materiales

### Propósito
Registra las descargas de materiales por usuarios.

### Atributos

| Nombre | Tipo | Requerido | Único | Descripción |
|--------|------|-----------|-------|-------------|
| materialId | string | Sí | No | ID del material |
| usuarioId | string | Sí | No | ID del usuario |
| archivoIndice | integer | Sí | No | Índice del archivo descargado |
| fecha | datetime | Sí | No | Fecha de descarga |

### Índices

| Nombre | Campos | Tipo |
|--------|--------|------|
| idx_materialId | materialId | key |
| idx_usuarioId | usuarioId | key |

### Permisos

| Rol | Permisos |
|-----|----------|
| SOCIO | Crear sus propias descargas |
| ADMIN | Leer todas |

---

## 🗂️ Colección: favoritos_materiales

### Propósito
Registra los materiales favoritos de los usuarios.

### Atributos

| Nombre | Tipo | Requerido | Único | Descripción |
|--------|------|-----------|-------|-------------|
| materialId | string | Sí | No | ID del material |
| usuarioId | string | Sí | No | ID del usuario |
| creadoEn | datetime | Sí | No | Fecha de creación |

### Índices

| Nombre | Campos | Tipo |
|--------|--------|------|
| idx_material_usuario | materialId, usuarioId | unique |

### Permisos

| Rol | Permisos |
|-----|----------|
| SOCIO | Leer/Crear/Eliminar sus propios |
| ADMIN | Leer todos |

---

## 🗂️ Colección: planes

### Propósito
Almacena los planes del software contable.

### Atributos

| Nombre | Tipo | Requerido | Único | Descripción |
|--------|------|-----------|-------|-------------|
| nombre | string | Sí | No | Nombre del plan |
| slug | string | Sí | Sí | Slug único para URL |
| descripcion | string | Sí | No | Descripción del plan |
| precio | float | Sí | No | Precio del plan |
| moneda | string | Sí | No | Moneda: "MXN", "USD" |
| caracteristicas | string | Sí | No | JSON con características del plan |
| destacado | boolean | Sí | No | Si es plan destacado |
| badge | string | No | No | Badge del plan (ej: "Popular") |
| color | string | No | No | Color del plan (hex) |
| imagen | string | No | No | URL de la imagen del plan |
| pdfBrochure | string | No | No | URL del brochure PDF |
| orden | integer | Sí | No | Orden de visualización |
| activo | boolean | Sí | No | Si el plan está activo |
| creadoEn | datetime | Sí | No | Fecha de creación |
| actualizadoEn | datetime | Sí | No | Fecha de última actualización |

### Índices

| Nombre | Campos | Tipo |
|--------|--------|------|
| idx_slug | slug | unique |
| idx_activo | activo | key |
| idx_orden | orden | key |

### Permisos

| Rol | Permisos |
|-----|----------|
| SOCIO | Leer activos |
| ASESOR | Leer activos |
| ADMIN | Leer todos, Crear, Editar, Eliminar |

---

## 🗂️ Colección: demos

### Propósito
Almacena las demos del producto.

### Atributos

| Nombre | Tipo | Requerido | Único | Descripción |
|--------|------|-----------|-------|-------------|
| titulo | string | Sí | No | Título de la demo |
| slug | string | Sí | Sí | Slug único para URL |
| descripcion | string | Sí | No | Descripción de la demo |
| tipo | string | Sí | No | Tipo: "grabada", "guion" |
| videoUrl | string | No | No | URL del video (si es grabada) |
| guionUrl | string | No | No | URL del guion (si es guion) |
| checklistUrl | string | No | No | URL del checklist |
| thumbnail | string | No | No | URL de la miniatura |
| duracion | integer | No | No | Duración en minutos |
| tags | string | No | No | JSON con array de tags |
| vistas | integer | Sí | No | Número de vistas |
| descargas | integer | Sí | No | Número de descargas |
| activo | boolean | Sí | No | Si la demo está activa |
| creadoEn | datetime | Sí | No | Fecha de creación |
| actualizadoEn | datetime | Sí | No | Fecha de última actualización |

### Índices

| Nombre | Campos | Tipo |
|--------|--------|------|
| idx_slug | slug | unique |
| idx_tipo | tipo | key |
| idx_activo | activo | key |

### Permisos

| Rol | Permisos |
|-----|----------|
| SOCIO | Leer activos |
| ASESOR | Leer activos, Editar |
| ADMIN | Leer todos, Crear, Editar, Eliminar |

---

## 🗂️ Colección: noticias

### Propósito
Almacena las noticias y novedades.

### Atributos

| Nombre | Tipo | Requerido | Único | Descripción |
|--------|------|-----------|-------|-------------|
| titulo | string | Sí | No | Título de la noticia |
| slug | string | Sí | Sí | Slug único para URL |
| contenido | string | Sí | No | Contenido de la noticia |
| imagen | string | No | No | URL de la imagen |
| destacada | boolean | Sí | No | Si es noticia destacada |
| activa | boolean | Sí | No | Si la noticia está activa |
| fechaPublicacion | datetime | Sí | No | Fecha de publicación |
| creadoEn | datetime | Sí | No | Fecha de creación |
| actualizadoEn | datetime | Sí | No | Fecha de última actualización |

### Índices

| Nombre | Campos | Tipo |
|--------|--------|------|
| idx_slug | slug | unique |
| idx_destacada | destacada | key |
| idx_activa | activa | key |
| idx_fechaPublicacion | fechaPublicacion | key |

### Permisos

| Rol | Permisos |
|-----|----------|
| SOCIO | Leer activas |
| ASESOR | Leer activas, Crear, Editar |
| ADMIN | Leer todos, Crear, Editar, Eliminar |

---

## 🗂️ Colección: notificaciones

### Propósito
Almacena las notificaciones de los usuarios.

### Atributos

| Nombre | Tipo | Requerido | Único | Descripción |
|--------|------|-----------|-------|-------------|
| usuarioId | string | Sí | No | ID del usuario |
| titulo | string | Sí | No | Título de la notificación |
| mensaje | string | Sí | No | Mensaje de la notificación |
| tipo | string | Sí | No | Tipo: "sistema", "evento", "material" |
| leida | boolean | Sí | No | Si la notificación fue leída |
| link | string | No | No | URL de enlace (opcional) |
| creadoEn | datetime | Sí | No | Fecha de creación |

### Índices

| Nombre | Campos | Tipo |
|--------|--------|------|
| idx_usuarioId | usuarioId | key |
| idx_leida | leida | key |
| idx_creadoEn | creadoEn | key |

### Permisos

| Rol | Permisos |
|-----|----------|
| SOCIO | Leer/Editar sus propias |
| ADMIN | Leer todas, Crear |

---

## 🗂️ Colección: configuracion

### Propósito
Almacena la configuración del sistema.

### Atributos

| Nombre | Tipo | Requerido | Único | Descripción |
|--------|------|-----------|-------|-------------|
| clave | string | Sí | Sí | Clave de configuración |
| valor | string | Sí | No | Valor de configuración |
| descripcion | string | No | No | Descripción de la configuración |
| actualizadoEn | datetime | Sí | No | Fecha de última actualización |

### Índices

| Nombre | Campos | Tipo |
|--------|--------|------|
| idx_clave | clave | unique |

### Permisos

| Rol | Permisos |
|-----|----------|
| ADMIN | Leer todos, Crear, Editar, Eliminar |

---

## 📝 Notas Importantes

### Tipos de Datos en Appwrite

- **string**: Texto plano
- **integer**: Números enteros
- **float**: Números decimales
- **boolean**: true/false
- **datetime**: Fecha y hora (ISO 8601)

### JSON en Atributos

Para almacenar arrays u objetos complejos, usar el tipo `string` con JSON:
```json
{
  "materialApoyo": [
    {"nombre": "Guía", "url": "https://...", "tipo": "pdf"},
    {"nombre": "Checklist", "url": "https://...", "tipo": "pdf"}
  ]
}
```

### Permisos

Los permisos en Appwrite se configuran a nivel de documento:
- **Read**: Quién puede leer
- **Write**: Quién puede crear/editar
- **Delete**: Quién puede eliminar

### Relaciones

Las relaciones entre colecciones se manejan mediante campos de ID:
- `categoriaId` referencia a `categorias`
- `usuarioId` referencia a `usuarios`
- `videoId` referencia a `videos`
- `eventoId` referencia a `eventos`
- `materialId` referencia a `materiales`

---

**FIN DEL ESQUEMA DE BASE DE DATOS**
