/**
 * Cliente de Appwrite - Configuración Centralizada
 * Plataforma de Capacitación y Apoyo para Socios
 * 
 * Este módulo proporciona una configuración centralizada para interactuar
 * con Appwrite desde el frontend.
 */

import { Client, Account, Databases, Storage, ID, Permission, Role, Query, Models } from 'node-appwrite';

// =============================================================================
// CONFIGURACIÓN DEL CLIENTE
// =============================================================================

// Verificar que las variables de entorno estén configuradas
const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'http://localhost/v1';
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';
const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'plataforma_capacitacion';

// Cliente para uso en el servidor (con API Key)
function createServerClient() {
  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);
  
  if (process.env.APPWRITE_API_KEY) {
    client.setKey(process.env.APPWRITE_API_KEY);
  }
  
  return client;
}

// Cliente para uso en el cliente (sin API Key)
function createClientClient() {
  return new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);
}

// Instancias singleton
let serverClient: Client | null = null;
let clientClient: Client | null = null;

export function getClient(server = false): Client {
  if (server) {
    if (!serverClient) {
      serverClient = createServerClient();
    }
    return serverClient;
  }
  
  if (!clientClient) {
    clientClient = createClientClient();
  }
  return clientClient;
}

// =============================================================================
// SERVICIOS
// =============================================================================

// Account Service
export const getAccount = (server = false) => new Account(getClient(server));

// Database Service
export const getDatabases = (server = false) => new Databases(getClient(server));

// Storage Service
export const getStorage = (server = false) => new Storage(getClient(server));

// Database ID
export const DATABASE_ID = APPWRITE_DATABASE_ID;

// =============================================================================
// TIPOS
// =============================================================================

export interface Usuario extends Models.Document {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  avatar?: string;
  rol: 'SOCIO' | 'ASESOR' | 'ADMIN';
  activo: boolean;
  emailVerificado: boolean;
  ultimoAcceso?: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface Categoria extends Models.Document {
  nombre: string;
  slug: string;
  descripcion?: string;
  icono?: string;
  imagen?: string;
  orden: number;
  padreId?: string;
  activo: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export interface Video extends Models.Document {
  categoriaId: string;
  titulo: string;
  slug: string;
  descripcion: string;
  videoUrl: string;
  videoPlataforma: 'youtube' | 'vimeo' | 'appwrite';
  videoId: string;
  thumbnailUrl?: string;
  duracion: number;
  orden: number;
  materialApoyo?: string;
  destacado: boolean;
  activo: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export interface ProgresoVideo extends Models.Document {
  usuarioId: string;
  videoId: string;
  progreso: number;
  completado: boolean;
  tiempoVisto: number;
  ultimaVista?: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface Evento extends Models.Document {
  titulo: string;
  slug: string;
  descripcion: string;
  tipo: 'presentacion' | 'demo' | 'entrenamiento' | 'qa' | 'masterclass';
  fechaHora: string;
  duracion: number;
  modalidad: 'virtual' | 'presencial';
  lugar?: string;
  enlaceVirtual?: string;
  plataformaVirtual?: 'zoom' | 'meet' | 'teams';
  capacidad?: number;
  inscritos: number;
  imagen?: string;
  instructorNombre: string;
  instructorCargo?: string;
  instructorFoto?: string;
  grabacionUrl?: string;
  grabacionDisponible: boolean;
  activo: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export interface InscripcionEvento extends Models.Document {
  eventoId: string;
  usuarioId: string;
  fechaInscripcion: string;
  asistio: boolean;
  recordatorioEnviado: boolean;
  creadoEn: string;
}

export interface Material extends Models.Document {
  nombre: string;
  slug: string;
  descripcion: string;
  categoria: 'brochure' | 'presentacion' | 'redes' | 'video' | 'guion' | 'casos';
  tags?: string;
  archivos: string;
  thumbnail?: string;
  descargas: number;
  destacado: boolean;
  activo: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export interface Plan extends Models.Document {
  nombre: string;
  slug: string;
  descripcion: string;
  precio: number;
  moneda: string;
  caracteristicas: string;
  destacado: boolean;
  badge?: string;
  color?: string;
  imagen?: string;
  pdfBrochure?: string;
  orden: number;
  activo: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export interface Demo extends Models.Document {
  titulo: string;
  slug: string;
  descripcion: string;
  tipo: 'grabada' | 'guion';
  videoUrl?: string;
  guionUrl?: string;
  checklistUrl?: string;
  thumbnail?: string;
  duracion?: number;
  tags?: string;
  vistas: number;
  descargas: number;
  activo: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export interface Noticia extends Models.Document {
  titulo: string;
  slug: string;
  contenido: string;
  imagen?: string;
  destacada: boolean;
  activa: boolean;
  fechaPublicacion: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface Notificacion extends Models.Document {
  usuarioId: string;
  titulo: string;
  mensaje: string;
  tipo: 'sistema' | 'evento' | 'material';
  leida: boolean;
  link?: string;
  creadoEn: string;
}

// =============================================================================
// FUNCIONES DE AUTENTICACIÓN
// =============================================================================

/**
 * Iniciar sesión con email y contraseña
 */
export async function login(email: string, password: string) {
  const account = getAccount();
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return { success: true, session };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Cerrar sesión
 */
export async function logout() {
  const account = getAccount();
  try {
    await account.deleteSession('current');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Obtener usuario actual
 */
export async function getCurrentUser() {
  const account = getAccount();
  try {
    const user = await account.get();
    return { success: true, user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Solicitar recuperación de contraseña
 */
export async function requestPasswordRecovery(email: string) {
  const account = getAccount();
  try {
    const result = await account.createRecovery(
      email,
      `${process.env.NEXT_PUBLIC_APP_URL}/recuperar-contrasena`
    );
    return { success: true, result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Completar recuperación de contraseña
 */
export async function completePasswordRecovery(
  userId: string,
  secret: string,
  password: string
) {
  const account = getAccount();
  try {
    await account.updateRecovery(userId, secret, password, password);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Registrar nuevo usuario
 */
export async function register(
  email: string,
  password: string,
  nombre: string,
  apellido: string,
  telefono?: string
) {
  const account = getAccount();
  try {
    // Crear la cuenta de usuario
    const user = await account.create(
      ID.unique(),
      email,
      password,
      `${nombre} ${apellido}`
    );
    
    // Opcional: Crear documento de usuario en la base de datos con datos adicionales
    // Esto se puede hacer después de que el usuario verifique su email
    
    return { success: true, user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// =============================================================================
// FUNCIONES DE BASE DE DATOS
// =============================================================================

/**
 * Listar documentos con filtros opcionales
 */
export async function listDocuments<T extends Models.Document>(
  collectionId: string,
  queries: string[] = [],
  server = false
): Promise<T[]> {
  const databases = getDatabases(server);
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      collectionId,
      queries
    );
    return response.documents as T[];
  } catch (error) {
    console.error(`Error listando ${collectionId}:`, error);
    return [];
  }
}

/**
 * Obtener un documento por ID
 */
export async function getDocument<T extends Models.Document>(
  collectionId: string,
  documentId: string,
  server = false
): Promise<T | null> {
  const databases = getDatabases(server);
  try {
    const document = await databases.getDocument(
      DATABASE_ID,
      collectionId,
      documentId
    );
    return document as T;
  } catch (error) {
    console.error(`Error obteniendo documento ${documentId}:`, error);
    return null;
  }
}

/**
 * Obtener documento por slug
 */
export async function getDocumentBySlug<T extends Models.Document>(
  collectionId: string,
  slug: string,
  server = false
): Promise<T | null> {
  const documents = await listDocuments<T>(
    collectionId,
    [Query.equal('slug', slug), Query.limit(1)],
    server
  );
  return documents.length > 0 ? documents[0] : null;
}

/**
 * Crear un documento
 */
export async function createDocument<T extends Models.Document>(
  collectionId: string,
  data: Record<string, any>,
  permissions: string[] = [],
  server = false
): Promise<T | null> {
  const databases = getDatabases(server);
  try {
    const document = await databases.createDocument(
      DATABASE_ID,
      collectionId,
      ID.unique(),
      data,
      permissions.length > 0 ? permissions : undefined
    );
    return document as T;
  } catch (error) {
    console.error(`Error creando documento en ${collectionId}:`, error);
    return null;
  }
}

/**
 * Actualizar un documento
 */
export async function updateDocument<T extends Models.Document>(
  collectionId: string,
  documentId: string,
  data: Record<string, any>,
  server = false
): Promise<T | null> {
  const databases = getDatabases(server);
  try {
    const document = await databases.updateDocument(
      DATABASE_ID,
      collectionId,
      documentId,
      data
    );
    return document as T;
  } catch (error) {
    console.error(`Error actualizando documento ${documentId}:`, error);
    return null;
  }
}

/**
 * Eliminar un documento
 */
export async function deleteDocument(
  collectionId: string,
  documentId: string,
  server = false
): Promise<boolean> {
  const databases = getDatabases(server);
  try {
    await databases.deleteDocument(DATABASE_ID, collectionId, documentId);
    return true;
  } catch (error) {
    console.error(`Error eliminando documento ${documentId}:`, error);
    return false;
  }
}

// =============================================================================
// FUNCIONES ESPECÍFICAS DE LA APLICACIÓN
// =============================================================================

/**
 * Obtener categorías activas
 */
export async function getCategorias(server = false): Promise<Categoria[]> {
  return listDocuments<Categoria>(
    'categorias',
    [Query.equal('activo', true), Query.orderAsc('orden')],
    server
  );
}

/**
 * Obtener videos por categoría
 */
export async function getVideosByCategoria(
  categoriaId: string,
  server = false
): Promise<Video[]> {
  return listDocuments<Video>(
    'videos',
    [
      Query.equal('categoriaId', categoriaId),
      Query.equal('activo', true),
      Query.orderAsc('orden')
    ],
    server
  );
}

/**
 * Obtener videos destacados
 */
export async function getVideosDestacados(server = false): Promise<Video[]> {
  return listDocuments<Video>(
    'videos',
    [
      Query.equal('destacado', true),
      Query.equal('activo', true),
      Query.limit(6)
    ],
    server
  );
}

/**
 * Obtener eventos próximos
 */
export async function getEventosProximos(server = false): Promise<Evento[]> {
  const now = new Date().toISOString();
  return listDocuments<Evento>(
    'eventos',
    [
      Query.greaterThan('fechaHora', now),
      Query.equal('activo', true),
      Query.orderAsc('fechaHora'),
      Query.limit(5)
    ],
    server
  );
}

/**
 * Obtener materiales destacados
 */
export async function getMaterialesDestacados(server = false): Promise<Material[]> {
  return listDocuments<Material>(
    'materiales',
    [
      Query.equal('destacado', true),
      Query.equal('activo', true),
      Query.limit(6)
    ],
    server
  );
}

/**
 * Obtener planes activos
 */
export async function getPlanes(server = false): Promise<Plan[]> {
  return listDocuments<Plan>(
    'planes',
    [
      Query.equal('activo', true),
      Query.orderAsc('orden')
    ],
    server
  );
}

/**
 * Obtener noticias activas
 */
export async function getNoticias(server = false): Promise<Noticia[]> {
  return listDocuments<Noticia>(
    'noticias',
    [
      Query.equal('activa', true),
      Query.orderDesc('fechaPublicacion'),
      Query.limit(5)
    ],
    server
  );
}

/**
 * Obtener progreso de videos de un usuario
 */
export async function getProgresoUsuario(
  usuarioId: string,
  server = false
): Promise<ProgresoVideo[]> {
  return listDocuments<ProgresoVideo>(
    'progreso_videos',
    [Query.equal('usuarioId', usuarioId)],
    server
  );
}

/**
 * Obtener inscripciones de un usuario
 */
export async function getInscripcionesUsuario(
  usuarioId: string,
  server = false
): Promise<InscripcionEvento[]> {
  return listDocuments<InscripcionEvento>(
    'inscripciones_eventos',
    [Query.equal('usuarioId', usuarioId)],
    server
  );
}

/**
 * Obtener notificaciones no leídas
 */
export async function getNotificacionesNoLeidas(
  usuarioId: string,
  server = false
): Promise<Notificacion[]> {
  return listDocuments<Notificacion>(
    'notificaciones',
    [
      Query.equal('usuarioId', usuarioId),
      Query.equal('leida', false),
      Query.orderDesc('creadoEn'),
      Query.limit(10)
    ],
    server
  );
}

// =============================================================================
// FUNCIONES ESPECÍFICAS DE VIDEOS
// =============================================================================

/**
 * Obtener todos los videos activos con filtros opcionales
 */
export async function getVideos(
  opciones: {
    categoriaId?: string;
    destacado?: boolean;
    buscar?: string;
    ordenar?: 'recientes' | 'orden' | 'destacados';
    limite?: number;
  } = {},
  server = false
): Promise<Video[]> {
  const queries: string[] = [
    Query.equal('activo', true)
  ];

  if (opciones.categoriaId) {
    queries.push(Query.equal('categoriaId', opciones.categoriaId));
  }

  if (opciones.destacado !== undefined) {
    queries.push(Query.equal('destacado', opciones.destacado));
  }

  if (opciones.buscar) {
    queries.push(Query.search('titulo', opciones.buscar));
  }

  // Ordenamiento
  switch (opciones.ordenar) {
    case 'recientes':
      queries.push(Query.orderDesc('creadoEn'));
      break;
    case 'destacados':
      queries.push(Query.orderDesc('destacado'));
      queries.push(Query.orderAsc('orden'));
      break;
    case 'orden':
    default:
      queries.push(Query.orderAsc('orden'));
      break;
  }

  if (opciones.limite) {
    queries.push(Query.limit(opciones.limite));
  }

  return listDocuments<Video>('videos', queries, server);
}

/**
 * Obtener un video por su slug
 */
export async function getVideoBySlug(
  slug: string,
  server = false
): Promise<Video | null> {
  return getDocumentBySlug<Video>('videos', slug, server);
}

/**
 * Obtener un video por su ID
 */
export async function getVideoById(
  videoId: string,
  server = false
): Promise<Video | null> {
  return getDocument<Video>('videos', videoId, server);
}

/**
 * Obtener videos relacionados (misma categoría)
 */
export async function getVideosRelacionados(
  videoId: string,
  categoriaId: string,
  limite: number = 4,
  server = false
): Promise<Video[]> {
  return listDocuments<Video>(
    'videos',
    [
      Query.equal('categoriaId', categoriaId),
      Query.equal('activo', true),
      Query.notEqual('$id', videoId),
      Query.limit(limite)
    ],
    server
  );
}

/**
 * Obtener el progreso de un usuario en un video específico
 */
export async function getProgresoVideo(
  usuarioId: string,
  videoId: string,
  server = false
): Promise<ProgresoVideo | null> {
  const progresos = await listDocuments<ProgresoVideo>(
    'progreso_videos',
    [
      Query.equal('usuarioId', usuarioId),
      Query.equal('videoId', videoId),
      Query.limit(1)
    ],
    server
  );
  return progresos.length > 0 ? progresos[0] : null;
}

/**
 * Obtener el progreso de todos los videos de un usuario
 */
export async function getAllProgresosUsuario(
  usuarioId: string,
  server = false
): Promise<ProgresoVideo[]> {
  return listDocuments<ProgresoVideo>(
    'progreso_videos',
    [
      Query.equal('usuarioId', usuarioId),
      Query.orderDesc('ultimaVista')
    ],
    server
  );
}

/**
 * Crear o actualizar el progreso de un video
 */
export async function updateProgresoVideo(
  usuarioId: string,
  videoId: string,
  datos: {
    progreso: number;
    tiempoVisto: number;
    completado?: boolean;
  },
  server = false
): Promise<ProgresoVideo | null> {
  // Buscar progreso existente
  const progresoExistente = await getProgresoVideo(usuarioId, videoId, server);
  
  const ahora = new Date().toISOString();
  
  // Determinar si está completado (90% o más)
  const completado = datos.completado ?? datos.progreso >= 90;
  
  if (progresoExistente) {
    // Actualizar progreso existente
    return updateDocument<ProgresoVideo>(
      'progreso_videos',
      progresoExistente.$id,
      {
        progreso: datos.progreso,
        tiempoVisto: datos.tiempoVisto,
        completado,
        ultimaVista: ahora,
        actualizadoEn: ahora
      },
      server
    );
  } else {
    // Crear nuevo registro de progreso
    return createDocument<ProgresoVideo>(
      'progreso_videos',
      {
        usuarioId,
        videoId,
        progreso: datos.progreso,
        tiempoVisto: datos.tiempoVisto,
        completado,
        ultimaVista: ahora,
        creadoEn: ahora,
        actualizadoEn: ahora
      },
      [],
      server
    );
  }
}

/**
 * Obtener videos con el progreso del usuario
 */
export async function getVideosConProgreso(
  usuarioId: string,
  opciones: {
    categoriaId?: string;
    destacado?: boolean;
    buscar?: string;
    ordenar?: 'recientes' | 'orden' | 'destacados';
    limite?: number;
  } = {},
  server = false
): Promise<(Video & { progreso?: ProgresoVideo })[]> {
  const [videos, progresos] = await Promise.all([
    getVideos(opciones, server),
    getAllProgresosUsuario(usuarioId, server)
  ]);

  // Crear mapa de progresos por videoId
  const progresosMap = new Map<string, ProgresoVideo>();
  progresos.forEach(p => progresosMap.set(p.videoId, p));

  // Combinar videos con sus progresos
  return videos.map(video => ({
    ...video,
    progreso: progresosMap.get(video.$id)
  }));
}

/**
 * Obtener categoría por ID
 */
export async function getCategoriaById(
  categoriaId: string,
  server = false
): Promise<Categoria | null> {
  return getDocument<Categoria>('categorias', categoriaId, server);
}

/**
 * Obtener categoría por slug
 */
export async function getCategoriaBySlug(
  slug: string,
  server = false
): Promise<Categoria | null> {
  return getDocumentBySlug<Categoria>('categorias', slug, server);
}

/**
 * Obtener todas las categorías con conteo de videos
 */
export async function getCategoriasConVideos(
  server = false
): Promise<(Categoria & { cantidadVideos: number })[]> {
  const [categorias, videos] = await Promise.all([
    getCategorias(server),
    listDocuments<Video>('videos', [Query.equal('activo', true)], server)
  ]);

  // Contar videos por categoría
  const conteoPorCategoria = new Map<string, number>();
  videos.forEach(video => {
    const count = conteoPorCategoria.get(video.categoriaId) || 0;
    conteoPorCategoria.set(video.categoriaId, count + 1);
  });

  return categorias.map(categoria => ({
    ...categoria,
    cantidadVideos: conteoPorCategoria.get(categoria.$id) || 0
  }));
}

/**
 * Obtener videos para navegación (anterior/siguiente)
 */
export async function getNavegacionVideos(
  videoActual: Video,
  server = false
): Promise<{ anterior: Video | null; siguiente: Video | null }> {
  const videosCategoria = await listDocuments<Video>(
    'videos',
    [
      Query.equal('categoriaId', videoActual.categoriaId),
      Query.equal('activo', true),
      Query.orderAsc('orden')
    ],
    server
  );

  const indiceActual = videosCategoria.findIndex(v => v.$id === videoActual.$id);

  return {
    anterior: indiceActual > 0 ? videosCategoria[indiceActual - 1] : null,
    siguiente: indiceActual < videosCategoria.length - 1 ? videosCategoria[indiceActual + 1] : null
  };
}

// =============================================================================
// FUNCIONES ESPECÍFICAS DE EVENTOS
// =============================================================================

/**
 * Filtros para obtener eventos
 */
export interface FiltrosEventos {
  tipo?: 'presentacion' | 'demo' | 'entrenamiento' | 'qa' | 'masterclass';
  modalidad?: 'virtual' | 'presencial';
  proximos?: boolean;
  pasados?: boolean;
  grabacionDisponible?: boolean;
  buscar?: string;
  limite?: number;
  ordenar?: 'fechaAsc' | 'fechaDesc' | 'recientes';
}

/**
 * Obtener eventos con filtros opcionales
 */
export async function getEventos(
  filtros: FiltrosEventos = {},
  server = false
): Promise<Evento[]> {
  const queries: string[] = [
    Query.equal('activo', true)
  ];

  // Filtro por tipo
  if (filtros.tipo) {
    queries.push(Query.equal('tipo', filtros.tipo));
  }

  // Filtro por modalidad
  if (filtros.modalidad) {
    queries.push(Query.equal('modalidad', filtros.modalidad));
  }

  // Filtro por fecha (próximos o pasados)
  const now = new Date().toISOString();
  if (filtros.proximos) {
    queries.push(Query.greaterThan('fechaHora', now));
  } else if (filtros.pasados) {
    queries.push(Query.lessThan('fechaHora', now));
  }

  // Filtro por grabación disponible
  if (filtros.grabacionDisponible) {
    queries.push(Query.equal('grabacionDisponible', true));
  }

  // Búsqueda por título
  if (filtros.buscar) {
    queries.push(Query.search('titulo', filtros.buscar));
  }

  // Ordenamiento
  switch (filtros.ordenar) {
    case 'fechaAsc':
      queries.push(Query.orderAsc('fechaHora'));
      break;
    case 'fechaDesc':
      queries.push(Query.orderDesc('fechaHora'));
      break;
    case 'recientes':
    default:
      queries.push(Query.orderDesc('creadoEn'));
      break;
  }

  // Límite
  if (filtros.limite) {
    queries.push(Query.limit(filtros.limite));
  }

  return listDocuments<Evento>('eventos', queries, server);
}

/**
 * Obtener un evento por su slug
 */
export async function getEventoBySlug(
  slug: string,
  server = false
): Promise<Evento | null> {
  return getDocumentBySlug<Evento>('eventos', slug, server);
}

/**
 * Obtener un evento por su ID
 */
export async function getEventoById(
  eventoId: string,
  server = false
): Promise<Evento | null> {
  return getDocument<Evento>('eventos', eventoId, server);
}

/**
 * Obtener eventos del mes específico
 */
export async function getEventosDelMes(
  year: number,
  month: number,
  server = false
): Promise<Evento[]> {
  // Primer día del mes
  const fechaInicio = new Date(year, month - 1, 1);
  // Último día del mes
  const fechaFin = new Date(year, month, 0, 23, 59, 59);

  return listDocuments<Evento>(
    'eventos',
    [
      Query.equal('activo', true),
      Query.greaterThanEqual('fechaHora', fechaInicio.toISOString()),
      Query.lessThanEqual('fechaHora', fechaFin.toISOString()),
      Query.orderAsc('fechaHora')
    ],
    server
  );
}

/**
 * Obtener eventos relacionados (mismo tipo)
 */
export async function getEventosRelacionados(
  eventoId: string,
  tipo: string,
  limite: number = 4,
  server = false
): Promise<Evento[]> {
  const now = new Date().toISOString();
  return listDocuments<Evento>(
    'eventos',
    [
      Query.equal('tipo', tipo),
      Query.equal('activo', true),
      Query.greaterThan('fechaHora', now),
      Query.notEqual('$id', eventoId),
      Query.orderAsc('fechaHora'),
      Query.limit(limite)
    ],
    server
  );
}

// =============================================================================
// FUNCIONES DE INSCRIPCIONES
// =============================================================================

/**
 * Inscribir usuario a un evento
 */
export async function inscribirseEvento(
  usuarioId: string,
  eventoId: string,
  server = false
): Promise<InscripcionEvento | null> {
  // Verificar si ya está inscrito
  const inscripcionExistente = await getInscripcionUsuario(usuarioId, eventoId, server);
  if (inscripcionExistente) {
    return inscripcionExistente;
  }

  // Verificar cupo disponible
  const evento = await getEventoById(eventoId, server);
  if (!evento) {
    throw new Error('Evento no encontrado');
  }

  if (evento.capacidad && evento.inscritos >= evento.capacidad) {
    throw new Error('No hay cupos disponibles');
  }

  const ahora = new Date().toISOString();

  // Crear inscripción
  const inscripcion = await createDocument<InscripcionEvento>(
    'inscripciones_eventos',
    {
      eventoId,
      usuarioId,
      fechaInscripcion: ahora,
      asistio: false,
      recordatorioEnviado: false,
      creadoEn: ahora
    },
    [],
    server
  );

  // Incrementar contador de inscritos
  if (inscripcion) {
    await updateDocument<Evento>(
      'eventos',
      eventoId,
      {
        inscritos: (evento.inscritos || 0) + 1,
        actualizadoEn: ahora
      },
      server
    );
  }

  return inscripcion;
}

/**
 * Cancelar inscripción a un evento
 */
export async function cancelarInscripcion(
  usuarioId: string,
  eventoId: string,
  server = false
): Promise<boolean> {
  // Buscar la inscripción
  const inscripcion = await getInscripcionUsuario(usuarioId, eventoId, server);
  if (!inscripcion) {
    return false;
  }

  // Eliminar la inscripción
  const eliminado = await deleteDocument('inscripciones_eventos', inscripcion.$id, server);

  // Decrementar contador de inscritos
  if (eliminado) {
    const evento = await getEventoById(eventoId, server);
    if (evento) {
      await updateDocument<Evento>(
        'eventos',
        eventoId,
        {
          inscritos: Math.max(0, (evento.inscritos || 0) - 1),
          actualizadoEn: new Date().toISOString()
        },
        server
      );
    }
  }

  return eliminado;
}

/**
 * Verificar si un usuario está inscrito a un evento
 */
export async function getInscripcionUsuario(
  usuarioId: string,
  eventoId: string,
  server = false
): Promise<InscripcionEvento | null> {
  const inscripciones = await listDocuments<InscripcionEvento>(
    'inscripciones_eventos',
    [
      Query.equal('usuarioId', usuarioId),
      Query.equal('eventoId', eventoId),
      Query.limit(1)
    ],
    server
  );
  return inscripciones.length > 0 ? inscripciones[0] : null;
}

/**
 * Obtener todas las inscripciones de un usuario
 */
export async function getMisInscripciones(
  usuarioId: string,
  server = false
): Promise<InscripcionEvento[]> {
  return listDocuments<InscripcionEvento>(
    'inscripciones_eventos',
    [
      Query.equal('usuarioId', usuarioId),
      Query.orderDesc('fechaInscripcion')
    ],
    server
  );
}

/**
 * Obtener inscripciones del usuario con detalles del evento
 */
export async function getMisInscripcionesConEventos(
  usuarioId: string,
  server = false
): Promise<(InscripcionEvento & { evento: Evento | null })[]> {
  const [inscripciones, eventos] = await Promise.all([
    getMisInscripciones(usuarioId, server),
    listDocuments<Evento>('eventos', [Query.equal('activo', true)], server)
  ]);

  // Crear mapa de eventos por ID
  const eventosMap = new Map<string, Evento>();
  eventos.forEach(e => eventosMap.set(e.$id, e));

  // Combinar inscripciones con eventos
  return inscripciones.map(inscripcion => ({
    ...inscripcion,
    evento: eventosMap.get(inscripcion.eventoId) || null
  }));
}

/**
 * Obtener eventos con el estado de inscripción del usuario
 */
export async function getEventosConInscripcion(
  usuarioId: string,
  filtros: FiltrosEventos = {},
  server = false
): Promise<(Evento & { inscrito: boolean; inscripcion?: InscripcionEvento })[]> {
  const [eventos, inscripciones] = await Promise.all([
    getEventos(filtros, server),
    getMisInscripciones(usuarioId, server)
  ]);

  // Crear mapa de inscripciones por eventoId
  const inscripcionesMap = new Map<string, InscripcionEvento>();
  inscripciones.forEach(i => inscripcionesMap.set(i.eventoId, i));

  // Combinar eventos con estado de inscripción
  return eventos.map(evento => {
    const inscripcion = inscripcionesMap.get(evento.$id);
    return {
      ...evento,
      inscrito: !!inscripcion,
      inscripcion
    };
  });
}

/**
 * Obtener conteo de cupos disponibles
 */
export function getCuposDisponibles(evento: Evento): number | null {
  if (!evento.capacidad) return null;
  return Math.max(0, evento.capacidad - evento.inscritos);
}

/**
 * Verificar si un evento tiene cupos disponibles
 */
export function tieneCuposDisponibles(evento: Evento): boolean {
  if (!evento.capacidad) return true;
  return evento.inscritos < evento.capacidad;
}

/**
 * Verificar si un evento ya pasó
 */
export function eventoPasado(evento: Evento): boolean {
  return new Date(evento.fechaHora) < new Date();
}

/**
 * Verificar si un evento es hoy
 */
export function eventoEsHoy(evento: Evento): boolean {
  const fechaEvento = new Date(evento.fechaHora);
  const hoy = new Date();
  return (
    fechaEvento.getDate() === hoy.getDate() &&
    fechaEvento.getMonth() === hoy.getMonth() &&
    fechaEvento.getFullYear() === hoy.getFullYear()
  );
}

/**
 * Calcular tiempo restante para un evento
 */
export function calcularTiempoRestante(evento: Evento): {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
  total: number;
} | null {
  const fechaEvento = new Date(evento.fechaHora).getTime();
  const ahora = new Date().getTime();
  const diferencia = fechaEvento - ahora;

  if (diferencia <= 0) return null;

  return {
    dias: Math.floor(diferencia / (1000 * 60 * 60 * 24)),
    horas: Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutos: Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60)),
    segundos: Math.floor((diferencia % (1000 * 60)) / 1000),
    total: diferencia
  };
}

// =============================================================================
// FUNCIONES ESPECÍFICAS DE MATERIALES
// =============================================================================

/**
 * Filtros para obtener materiales
 */
export interface FiltrosMateriales {
  categoria?: 'brochure' | 'presentacion' | 'redes' | 'video' | 'guion' | 'casos';
  destacado?: boolean;
  buscar?: string;
  ordenar?: 'recientes' | 'descargas' | 'destacados';
  limite?: number;
}

/**
 * Obtener materiales con filtros opcionales
 */
export async function getMateriales(
  filtros: FiltrosMateriales = {},
  server = false
): Promise<Material[]> {
  const queries: string[] = [
    Query.equal('activo', true)
  ];

  // Filtro por categoría
  if (filtros.categoria) {
    queries.push(Query.equal('categoria', filtros.categoria));
  }

  // Filtro por destacado
  if (filtros.destacado !== undefined) {
    queries.push(Query.equal('destacado', filtros.destacado));
  }

  // Búsqueda por título
  if (filtros.buscar) {
    queries.push(Query.search('nombre', filtros.buscar));
  }

  // Ordenamiento
  switch (filtros.ordenar) {
    case 'recientes':
      queries.push(Query.orderDesc('creadoEn'));
      break;
    case 'descargas':
      queries.push(Query.orderDesc('descargas'));
      break;
    case 'destacados':
    default:
      queries.push(Query.orderDesc('destacado'));
      queries.push(Query.orderDesc('creadoEn'));
      break;
  }

  // Límite
  if (filtros.limite) {
    queries.push(Query.limit(filtros.limite));
  }

  return listDocuments<Material>('materiales', queries, server);
}

/**
 * Obtener un material por su slug
 */
export async function getMaterialBySlug(
  slug: string,
  server = false
): Promise<Material | null> {
  return getDocumentBySlug<Material>('materiales', slug, server);
}

/**
 * Obtener un material por su ID
 */
export async function getMaterialById(
  materialId: string,
  server = false
): Promise<Material | null> {
  return getDocument<Material>('materiales', materialId, server);
}

/**
 * Incrementar contador de descargas de un material
 */
export async function descargarMaterial(
  materialId: string,
  usuarioId: string,
  archivoIndice: number = 0,
  server = false
): Promise<boolean> {
  try {
    const material = await getMaterialById(materialId, server);
    if (!material) return false;

    const ahora = new Date().toISOString();

    // Incrementar contador de descargas
    await updateDocument<Material>(
      'materiales',
      materialId,
      {
        descargas: (material.descargas || 0) + 1,
        actualizadoEn: ahora
      },
      server
    );

    // Registrar la descarga
    await createDocument(
      'descargas_materiales',
      {
        materialId,
        usuarioId,
        archivoIndice,
        fecha: ahora
      },
      [],
      server
    );

    return true;
  } catch (error) {
    console.error('Error al registrar descarga:', error);
    return false;
  }
}

/**
 * Obtener materiales relacionados (misma categoría)
 */
export async function getMaterialesRelacionados(
  materialId: string,
  categoria: string,
  limite: number = 4,
  server = false
): Promise<Material[]> {
  return listDocuments<Material>(
    'materiales',
    [
      Query.equal('categoria', categoria),
      Query.equal('activo', true),
      Query.notEqual('$id', materialId),
      Query.limit(limite)
    ],
    server
  );
}

// =============================================================================
// FUNCIONES DE FAVORITOS DE MATERIALES
// =============================================================================

/**
 * Interfaz para favoritos de materiales
 */
export interface FavoritoMaterial extends Models.Document {
  materialId: string;
  usuarioId: string;
  creadoEn: string;
}

/**
 * Agregar material a favoritos
 */
export async function agregarFavorito(
  materialId: string,
  usuarioId: string,
  server = false
): Promise<FavoritoMaterial | null> {
  // Verificar si ya es favorito
  const yaEsFavorito = await esFavorito(materialId, usuarioId, server);
  if (yaEsFavorito) return null;

  return createDocument<FavoritoMaterial>(
    'favoritos_materiales',
    {
      materialId,
      usuarioId,
      creadoEn: new Date().toISOString()
    },
    [],
    server
  );
}

/**
 * Quitar material de favoritos
 */
export async function quitarFavorito(
  materialId: string,
  usuarioId: string,
  server = false
): Promise<boolean> {
  const favoritos = await listDocuments<FavoritoMaterial>(
    'favoritos_materiales',
    [
      Query.equal('materialId', materialId),
      Query.equal('usuarioId', usuarioId),
      Query.limit(1)
    ],
    server
  );

  if (favoritos.length === 0) return false;

  return deleteDocument('favoritos_materiales', favoritos[0].$id, server);
}

/**
 * Verificar si un material es favorito del usuario
 */
export async function esFavorito(
  materialId: string,
  usuarioId: string,
  server = false
): Promise<boolean> {
  const favoritos = await listDocuments<FavoritoMaterial>(
    'favoritos_materiales',
    [
      Query.equal('materialId', materialId),
      Query.equal('usuarioId', usuarioId),
      Query.limit(1)
    ],
    server
  );
  return favoritos.length > 0;
}

/**
 * Obtener favoritos del usuario
 */
export async function getFavoritosUsuario(
  usuarioId: string,
  server = false
): Promise<FavoritoMaterial[]> {
  return listDocuments<FavoritoMaterial>(
    'favoritos_materiales',
    [
      Query.equal('usuarioId', usuarioId),
      Query.orderDesc('creadoEn')
    ],
    server
  );
}

/**
 * Obtener materiales favoritos del usuario con detalles
 */
export async function getMaterialesFavoritosUsuario(
  usuarioId: string,
  server = false
): Promise<(Material & { favorito: boolean })[]> {
  const [favoritos, materiales] = await Promise.all([
    getFavoritosUsuario(usuarioId, server),
    listDocuments<Material>('materiales', [Query.equal('activo', true)], server)
  ]);

  // Crear set de IDs de materiales favoritos
  const favoritosIds = new Set(favoritos.map(f => f.materialId));

  // Filtrar y combinar materiales
  return materiales
    .filter(m => favoritosIds.has(m.$id))
    .map(material => ({
      ...material,
      favorito: true
    }));
}

/**
 * Obtener materiales con estado de favorito del usuario
 */
export async function getMaterialesConFavorito(
  usuarioId: string,
  filtros: FiltrosMateriales = {},
  server = false
): Promise<(Material & { favorito: boolean })[]> {
  const [materiales, favoritos] = await Promise.all([
    getMateriales(filtros, server),
    getFavoritosUsuario(usuarioId, server)
  ]);

  // Crear set de IDs de materiales favoritos
  const favoritosIds = new Set(favoritos.map(f => f.materialId));

  // Combinar materiales con estado de favorito
  return materiales.map(material => ({
    ...material,
    favorito: favoritosIds.has(material.$id)
  }));
}

// =============================================================================
// FUNCIONES ESPECÍFICAS DE PLANES
// =============================================================================

/**
 * Obtener un plan por su slug
 */
export async function getPlanBySlug(
  slug: string,
  server = false
): Promise<Plan | null> {
  return getDocumentBySlug<Plan>('planes', slug, server);
}

/**
 * Obtener un plan por su ID
 */
export async function getPlanById(
  planId: string,
  server = false
): Promise<Plan | null> {
  return getDocument<Plan>('planes', planId, server);
}

/**
 * Obtener planes con destacado primero
 */
export async function getPlanesOrdenados(
  server = false
): Promise<Plan[]> {
  return listDocuments<Plan>(
    'planes',
    [
      Query.equal('activo', true),
      Query.orderDesc('destacado'),
      Query.orderAsc('orden')
    ],
    server
  );
}

/**
 * Obtener plan destacado/recomendado
 */
export async function getPlanDestacado(
  server = false
): Promise<Plan | null> {
  const planes = await listDocuments<Plan>(
    'planes',
    [
      Query.equal('activo', true),
      Query.equal('destacado', true),
      Query.limit(1)
    ],
    server
  );
  return planes.length > 0 ? planes[0] : null;
}

/**
 * Obtener planes alternativos (excluyendo uno)
 */
export async function getPlanesAlternativos(
  planId: string,
  limite: number = 3,
  server = false
): Promise<Plan[]> {
  return listDocuments<Plan>(
    'planes',
    [
      Query.equal('activo', true),
      Query.notEqual('$id', planId),
      Query.orderAsc('orden'),
      Query.limit(limite)
    ],
    server
  );
}

/**
 * Parsear características del plan (desde JSON string)
 */
export function parseCaracteristicasPlan(caracteristicas: string): string[] {
  try {
    return JSON.parse(caracteristicas);
  } catch {
    return caracteristicas.split('\n').filter(c => c.trim());
  }
}

/**
 * Formatear precio del plan
 */
export function formatearPrecioPlan(precio: number, moneda: string = 'MXN'): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: moneda,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(precio);
}

// =============================================================================
// FUNCIONES ESPECÍFICAS DE DEMOS
// =============================================================================

/**
 * Filtros para obtener demos
 */
export interface FiltrosDemos {
  tipo?: 'grabada' | 'guion';
  buscar?: string;
  ordenar?: 'recientes' | 'vistas' | 'descargas';
  limite?: number;
}

/**
 * Obtener demos con filtros opcionales
 */
export async function getDemos(
  filtros: FiltrosDemos = {},
  server = false
): Promise<Demo[]> {
  const queries: string[] = [
    Query.equal('activo', true)
  ];

  // Filtro por tipo
  if (filtros.tipo) {
    queries.push(Query.equal('tipo', filtros.tipo));
  }

  // Búsqueda por título
  if (filtros.buscar) {
    queries.push(Query.search('titulo', filtros.buscar));
  }

  // Ordenamiento
  switch (filtros.ordenar) {
    case 'recientes':
      queries.push(Query.orderDesc('creadoEn'));
      break;
    case 'vistas':
      queries.push(Query.orderDesc('vistas'));
      break;
    case 'descargas':
    default:
      queries.push(Query.orderDesc('descargas'));
      queries.push(Query.orderDesc('creadoEn'));
      break;
  }

  // Límite
  if (filtros.limite) {
    queries.push(Query.limit(filtros.limite));
  }

  return listDocuments<Demo>('demos', queries, server);
}

/**
 * Obtener un demo por su slug
 */
export async function getDemoBySlug(
  slug: string,
  server = false
): Promise<Demo | null> {
  return getDocumentBySlug<Demo>('demos', slug, server);
}

/**
 * Obtener un demo por su ID
 */
export async function getDemoById(
  demoId: string,
  server = false
): Promise<Demo | null> {
  return getDocument<Demo>('demos', demoId, server);
}

/**
 * Incrementar contador de vistas de un demo
 */
export async function incrementarVistasDemo(
  demoId: string,
  server = false
): Promise<boolean> {
  try {
    const demo = await getDemoById(demoId, server);
    if (!demo) return false;

    await updateDocument<Demo>(
      'demos',
      demoId,
      {
        vistas: (demo.vistas || 0) + 1,
        actualizadoEn: new Date().toISOString()
      },
      server
    );

    return true;
  } catch (error) {
    console.error('Error al incrementar vistas:', error);
    return false;
  }
}

/**
 * Incrementar contador de descargas de un demo
 */
export async function incrementarDescargasDemo(
  demoId: string,
  server = false
): Promise<boolean> {
  try {
    const demo = await getDemoById(demoId, server);
    if (!demo) return false;

    await updateDocument<Demo>(
      'demos',
      demoId,
      {
        descargas: (demo.descargas || 0) + 1,
        actualizadoEn: new Date().toISOString()
      },
      server
    );

    return true;
  } catch (error) {
    console.error('Error al incrementar descargas:', error);
    return false;
  }
}

/**
 * Obtener demos relacionados
 */
export async function getDemosRelacionados(
  demoId: string,
  limite: number = 4,
  server = false
): Promise<Demo[]> {
  const demoActual = await getDemoById(demoId, server);
  
  const queries: string[] = [
    Query.equal('activo', true),
    Query.notEqual('$id', demoId),
    Query.limit(limite)
  ];

  // Si tiene tags, buscar por similitud
  if (demoActual?.tags) {
    // Por ahora solo excluimos el actual, se puede mejorar con búsqueda de tags
  }

  return listDocuments<Demo>('demos', queries, server);
}

/**
 * Interfaz para solicitud de demo en vivo
 */
export interface SolicitudDemoEnVivo {
  demoId: string;
  usuarioId: string;
  nombre: string;
  email: string;
  telefono: string;
  empresa?: string;
  mensaje?: string;
  fechaSolicitud: string;
}

/**
 * Solicitar demo en vivo
 * Nota: Esta función crea una notificación o envía un email
 * En una implementación real, se conectaría con un servicio de email
 */
export async function solicitarDemoEnVivo(
  datos: Omit<SolicitudDemoEnVivo, 'fechaSolicitud'>,
  server = false
): Promise<boolean> {
  try {
    const solicitud: SolicitudDemoEnVivo = {
      ...datos,
      fechaSolicitud: new Date().toISOString()
    };

    // Crear notificación para administradores
    await createDocument(
      'notificaciones',
      {
        usuarioId: 'admin', // En una implementación real, sería para todos los admins
        titulo: 'Nueva solicitud de demo en vivo',
        mensaje: `${datos.nombre} (${datos.email}) ha solicitado una demo en vivo.`,
        tipo: 'sistema',
        leida: false,
        link: `/admin/solicitudes-demo`,
        creadoEn: solicitud.fechaSolicitud
      },
      [],
      server
    );

    // Aquí también se podría enviar un email usando una función de Appwrite
    
    return true;
  } catch (error) {
    console.error('Error al solicitar demo en vivo:', error);
    return false;
  }
}

/**
 * Verificar si un demo es nuevo (creado en los últimos 7 días)
 */
export function esDemoNuevo(demo: Demo): boolean {
  const fechaCreacion = new Date(demo.creadoEn);
  const hace7Dias = new Date();
  hace7Dias.setDate(hace7Dias.getDate() - 7);
  return fechaCreacion > hace7Dias;
}

/**
 * Formatear duración de demo (minutos a formato legible)
 */
export function formatearDuracionDemo(duracionMinutos?: number): string {
  if (!duracionMinutos) return '';
  
  if (duracionMinutos < 60) {
    return `${duracionMinutos} min`;
  }
  
  const horas = Math.floor(duracionMinutos / 60);
  const minutos = duracionMinutos % 60;
  
  if (minutos === 0) {
    return `${horas} h`;
  }
  
  return `${horas} h ${minutos} min`;
}

// =============================================================================
// FUNCIONES DE PERFIL DE USUARIO
// =============================================================================

/**
 * Interfaz para estadísticas del usuario
 */
export interface UserStats {
  videosCompletados: number;
  eventosAsistidos: number;
  materialesDescargados: number;
  tiempoEnPlataforma: number; // en minutos
  progresoGeneral: number; // porcentaje
  certificados: number;
}

/**
 * Interfaz para certificado
 */
export interface Certificado extends Models.Document {
  usuarioId: string;
  tipo: 'video' | 'evento' | 'curso';
  referenciaId: string;
  titulo: string;
  fechaEmision: string;
  codigoVerificacion: string;
}

/**
 * Obtener perfil completo del usuario
 */
export async function getUserProfile(
  usuarioId: string,
  server = false
): Promise<Usuario | null> {
  return getDocument<Usuario>('usuarios', usuarioId, server);
}

/**
 * Actualizar perfil de usuario
 */
export async function updateUserProfile(
  usuarioId: string,
  datos: {
    nombre?: string;
    apellido?: string;
    telefono?: string;
    avatar?: string;
  },
  server = false
): Promise<Usuario | null> {
  const ahora = new Date().toISOString();
  return updateDocument<Usuario>(
    'usuarios',
    usuarioId,
    {
      ...datos,
      actualizadoEn: ahora
    },
    server
  );
}

/**
 * Cambiar contraseña del usuario
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const account = getAccount();
  try {
    await account.updatePassword(newPassword, currentPassword);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al cambiar la contraseña' };
  }
}

/**
 * Obtener estadísticas del usuario
 */
export async function getUserStats(
  usuarioId: string,
  server = false
): Promise<UserStats> {
  try {
    // Obtener progresos de videos
    const progresos = await getAllProgresosUsuario(usuarioId, server);
    const videosCompletados = progresos.filter(p => p.completado).length;
    const tiempoVideos = progresos.reduce((acc, p) => acc + (p.tiempoVisto || 0), 0);

    // Obtener inscripciones a eventos
    const inscripciones = await getMisInscripciones(usuarioId, server);
    const eventosAsistidos = inscripciones.filter(i => i.asistio).length;

    // Obtener descargas de materiales
    const descargas = await listDocuments<{ usuarioId: string }>(
      'descargas_materiales',
      [Query.equal('usuarioId', usuarioId)],
      server
    );
    const materialesDescargados = descargas.length;

    // Obtener certificados
    const certificados = await listDocuments<Certificado>(
      'certificados',
      [Query.equal('usuarioId', usuarioId)],
      server
    );

    // Calcular progreso general (basado en videos completados vs total de videos activos)
    const todosVideos = await listDocuments<Video>(
      'videos',
      [Query.equal('activo', true)],
      server
    );
    const progresoGeneral = todosVideos.length > 0 
      ? Math.round((videosCompletados / todosVideos.length) * 100) 
      : 0;

    return {
      videosCompletados,
      eventosAsistidos,
      materialesDescargados,
      tiempoEnPlataforma: Math.round(tiempoVideos / 60), // convertir a minutos
      progresoGeneral,
      certificados: certificados.length
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas del usuario:', error);
    return {
      videosCompletados: 0,
      eventosAsistidos: 0,
      materialesDescargados: 0,
      tiempoEnPlataforma: 0,
      progresoGeneral: 0,
      certificados: 0
    };
  }
}

/**
 * Subir foto de perfil
 */
export async function uploadProfilePhoto(
  file: File,
  usuarioId: string,
  server = false
): Promise<{ success: boolean; url?: string; error?: string }> {
  const storage = getStorage(server);
  try {
    const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || 'archivos';
    const result = await storage.createFile(
      bucketId,
      ID.unique(),
      file
    );
    
    // Construir URL del archivo
    const endpoint = APPWRITE_ENDPOINT;
    const projectId = APPWRITE_PROJECT_ID;
    const url = `${endpoint}/storage/buckets/${bucketId}/files/${result.$id}/view?project=${projectId}`;
    
    // Actualizar el avatar del usuario
    await updateUserProfile(usuarioId, { avatar: url }, server);
    
    return { success: true, url };
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al subir la imagen' };
  }
}

/**
 * Obtener certificados del usuario
 */
export async function getUserCertificados(
  usuarioId: string,
  server = false
): Promise<Certificado[]> {
  return listDocuments<Certificado>(
    'certificados',
    [
      Query.equal('usuarioId', usuarioId),
      Query.orderDesc('fechaEmision')
    ],
    server
  );
}

// =============================================================================
// FUNCIONES DE ADMINISTRACIÓN - USUARIOS
// =============================================================================

/**
 * Filtros para listar usuarios
 */
export interface FiltrosUsuarios {
  rol?: 'SOCIO' | 'ASESOR' | 'ADMIN';
  activo?: boolean;
  buscar?: string;
  ordenar?: 'recientes' | 'nombre' | 'email';
  limite?: number;
  offset?: number;
}

/**
 * Obtener todos los usuarios con filtros
 */
export async function getAllUsers(
  filtros: FiltrosUsuarios = {},
  server = true
): Promise<{ usuarios: Usuario[]; total: number }> {
  const queries: string[] = [];

  if (filtros.rol) {
    queries.push(Query.equal('rol', filtros.rol));
  }

  if (filtros.activo !== undefined) {
    queries.push(Query.equal('activo', filtros.activo));
  }

  if (filtros.buscar) {
    queries.push(Query.search('nombre', filtros.buscar));
  }

  // Ordenamiento
  switch (filtros.ordenar) {
    case 'nombre':
      queries.push(Query.orderAsc('nombre'));
      break;
    case 'email':
      queries.push(Query.orderAsc('email'));
      break;
    case 'recientes':
    default:
      queries.push(Query.orderDesc('creadoEn'));
      break;
  }

  if (filtros.limite) {
    queries.push(Query.limit(filtros.limite));
  }

  if (filtros.offset) {
    queries.push(Query.offset(filtros.offset));
  }

  const databases = getDatabases(server);
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      'usuarios',
      queries
    );
    return {
      usuarios: response.documents as Usuario[],
      total: response.total
    };
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    return { usuarios: [], total: 0 };
  }
}

/**
 * Obtener usuario por ID (admin)
 */
export async function getUserById(
  id: string,
  server = true
): Promise<Usuario | null> {
  return getDocument<Usuario>('usuarios', id, server);
}

/**
 * Crear usuario (admin)
 */
export async function createUser(
  datos: {
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string;
    rol: 'SOCIO' | 'ASESOR' | 'ADMIN';
    activo?: boolean;
  },
  server = true
): Promise<Usuario | null> {
  const ahora = new Date().toISOString();
  return createDocument<Usuario>(
    'usuarios',
    {
      ...datos,
      activo: datos.activo ?? true,
      emailVerificado: false,
      creadoEn: ahora,
      actualizadoEn: ahora
    },
    [],
    server
  );
}

/**
 * Actualizar usuario (admin)
 */
export async function updateUser(
  id: string,
  datos: Partial<{
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    rol: 'SOCIO' | 'ASESOR' | 'ADMIN';
    activo: boolean;
  }>,
  server = true
): Promise<Usuario | null> {
  const ahora = new Date().toISOString();
  return updateDocument<Usuario>(
    'usuarios',
    id,
    {
      ...datos,
      actualizadoEn: ahora
    },
    server
  );
}

/**
 * Eliminar usuario (admin)
 */
export async function deleteUser(
  id: string,
  server = true
): Promise<boolean> {
  return deleteDocument('usuarios', id, server);
}

/**
 * Activar/desactivar usuario
 */
export async function toggleUserStatus(
  id: string,
  activo: boolean,
  server = true
): Promise<Usuario | null> {
  const ahora = new Date().toISOString();
  return updateDocument<Usuario>(
    'usuarios',
    id,
    {
      activo,
      actualizadoEn: ahora
    },
    server
  );
}

// =============================================================================
// FUNCIONES DE ADMINISTRACIÓN - VIDEOS
// =============================================================================

/**
 * Crear video (admin)
 */
export async function createVideo(
  datos: {
    categoriaId: string;
    titulo: string;
    slug: string;
    descripcion: string;
    videoUrl: string;
    videoPlataforma: 'youtube' | 'vimeo' | 'appwrite';
    videoId: string;
    thumbnailUrl?: string;
    duracion: number;
    orden?: number;
    materialApoyo?: string;
    destacado?: boolean;
    activo?: boolean;
  },
  server = true
): Promise<Video | null> {
  const ahora = new Date().toISOString();
  return createDocument<Video>(
    'videos',
    {
      ...datos,
      orden: datos.orden ?? 0,
      destacado: datos.destacado ?? false,
      activo: datos.activo ?? true,
      creadoEn: ahora,
      actualizadoEn: ahora
    },
    [],
    server
  );
}

/**
 * Actualizar video (admin)
 */
export async function updateVideo(
  id: string,
  datos: Partial<{
    categoriaId: string;
    titulo: string;
    slug: string;
    descripcion: string;
    videoUrl: string;
    videoPlataforma: 'youtube' | 'vimeo' | 'appwrite';
    videoId: string;
    thumbnailUrl: string;
    duracion: number;
    orden: number;
    materialApoyo: string;
    destacado: boolean;
    activo: boolean;
  }>,
  server = true
): Promise<Video | null> {
  const ahora = new Date().toISOString();
  return updateDocument<Video>(
    'videos',
    id,
    {
      ...datos,
      actualizadoEn: ahora
    },
    server
  );
}

/**
 * Eliminar video (admin)
 */
export async function deleteVideo(
  id: string,
  server = true
): Promise<boolean> {
  return deleteDocument('videos', id, server);
}

/**
 * Activar/desactivar video
 */
export async function toggleVideoStatus(
  id: string,
  activo: boolean,
  server = true
): Promise<Video | null> {
  const ahora = new Date().toISOString();
  return updateDocument<Video>(
    'videos',
    id,
    {
      activo,
      actualizadoEn: ahora
    },
    server
  );
}

/**
 * Obtener todos los videos (admin) sin filtro de activo
 */
export async function getAllVideosAdmin(
  filtros: {
    categoriaId?: string;
    destacado?: boolean;
    activo?: boolean;
    buscar?: string;
    ordenar?: 'recientes' | 'orden' | 'titulo';
    limite?: number;
    offset?: number;
  } = {},
  server = true
): Promise<{ videos: Video[]; total: number }> {
  const queries: string[] = [];

  if (filtros.categoriaId) {
    queries.push(Query.equal('categoriaId', filtros.categoriaId));
  }

  if (filtros.destacado !== undefined) {
    queries.push(Query.equal('destacado', filtros.destacado));
  }

  if (filtros.activo !== undefined) {
    queries.push(Query.equal('activo', filtros.activo));
  }

  if (filtros.buscar) {
    queries.push(Query.search('titulo', filtros.buscar));
  }

  switch (filtros.ordenar) {
    case 'orden':
      queries.push(Query.orderAsc('orden'));
      break;
    case 'titulo':
      queries.push(Query.orderAsc('titulo'));
      break;
    case 'recientes':
    default:
      queries.push(Query.orderDesc('creadoEn'));
      break;
  }

  if (filtros.limite) {
    queries.push(Query.limit(filtros.limite));
  }

  if (filtros.offset) {
    queries.push(Query.offset(filtros.offset));
  }

  const databases = getDatabases(server);
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      'videos',
      queries
    );
    return {
      videos: response.documents as Video[],
      total: response.total
    };
  } catch (error) {
    console.error('Error obteniendo videos:', error);
    return { videos: [], total: 0 };
  }
}

// =============================================================================
// FUNCIONES DE ADMINISTRACIÓN - EVENTOS
// =============================================================================

/**
 * Crear evento (admin)
 */
export async function createEvento(
  datos: {
    titulo: string;
    slug: string;
    descripcion: string;
    tipo: 'presentacion' | 'demo' | 'entrenamiento' | 'qa' | 'masterclass';
    fechaHora: string;
    duracion: number;
    modalidad: 'virtual' | 'presencial';
    lugar?: string;
    enlaceVirtual?: string;
    plataformaVirtual?: 'zoom' | 'meet' | 'teams';
    capacidad?: number;
    imagen?: string;
    instructorNombre: string;
    instructorCargo?: string;
    instructorFoto?: string;
    activo?: boolean;
  },
  server = true
): Promise<Evento | null> {
  const ahora = new Date().toISOString();
  return createDocument<Evento>(
    'eventos',
    {
      ...datos,
      inscritos: 0,
      grabacionDisponible: false,
      activo: datos.activo ?? true,
      creadoEn: ahora,
      actualizadoEn: ahora
    },
    [],
    server
  );
}

/**
 * Actualizar evento (admin)
 */
export async function updateEventoAdmin(
  id: string,
  datos: Partial<{
    titulo: string;
    slug: string;
    descripcion: string;
    tipo: 'presentacion' | 'demo' | 'entrenamiento' | 'qa' | 'masterclass';
    fechaHora: string;
    duracion: number;
    modalidad: 'virtual' | 'presencial';
    lugar: string;
    enlaceVirtual: string;
    plataformaVirtual: 'zoom' | 'meet' | 'teams';
    capacidad: number;
    imagen: string;
    instructorNombre: string;
    instructorCargo: string;
    instructorFoto: string;
    grabacionUrl: string;
    grabacionDisponible: boolean;
    activo: boolean;
  }>,
  server = true
): Promise<Evento | null> {
  const ahora = new Date().toISOString();
  return updateDocument<Evento>(
    'eventos',
    id,
    {
      ...datos,
      actualizadoEn: ahora
    },
    server
  );
}

/**
 * Eliminar evento (admin)
 */
export async function deleteEvento(
  id: string,
  server = true
): Promise<boolean> {
  return deleteDocument('eventos', id, server);
}

/**
 * Obtener todos los eventos (admin) sin filtro de activo
 */
export async function getAllEventosAdmin(
  filtros: {
    tipo?: 'presentacion' | 'demo' | 'entrenamiento' | 'qa' | 'masterclass';
    modalidad?: 'virtual' | 'presencial';
    activo?: boolean;
    pasados?: boolean;
    proximos?: boolean;
    buscar?: string;
    ordenar?: 'fechaAsc' | 'fechaDesc' | 'recientes';
    limite?: number;
    offset?: number;
  } = {},
  server = true
): Promise<{ eventos: Evento[]; total: number }> {
  const queries: string[] = [];

  if (filtros.tipo) {
    queries.push(Query.equal('tipo', filtros.tipo));
  }

  if (filtros.modalidad) {
    queries.push(Query.equal('modalidad', filtros.modalidad));
  }

  if (filtros.activo !== undefined) {
    queries.push(Query.equal('activo', filtros.activo));
  }

  const now = new Date().toISOString();
  if (filtros.proximos) {
    queries.push(Query.greaterThan('fechaHora', now));
  } else if (filtros.pasados) {
    queries.push(Query.lessThan('fechaHora', now));
  }

  if (filtros.buscar) {
    queries.push(Query.search('titulo', filtros.buscar));
  }

  switch (filtros.ordenar) {
    case 'fechaAsc':
      queries.push(Query.orderAsc('fechaHora'));
      break;
    case 'fechaDesc':
      queries.push(Query.orderDesc('fechaHora'));
      break;
    case 'recientes':
    default:
      queries.push(Query.orderDesc('creadoEn'));
      break;
  }

  if (filtros.limite) {
    queries.push(Query.limit(filtros.limite));
  }

  if (filtros.offset) {
    queries.push(Query.offset(filtros.offset));
  }

  const databases = getDatabases(server);
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      'eventos',
      queries
    );
    return {
      eventos: response.documents as Evento[],
      total: response.total
    };
  } catch (error) {
    console.error('Error obteniendo eventos:', error);
    return { eventos: [], total: 0 };
  }
}

// =============================================================================
// FUNCIONES DE ADMINISTRACIÓN - MATERIALES
// =============================================================================

/**
 * Crear material (admin)
 */
export async function createMaterial(
  datos: {
    nombre: string;
    slug: string;
    descripcion: string;
    categoria: 'brochure' | 'presentacion' | 'redes' | 'video' | 'guion' | 'casos';
    tags?: string;
    archivos: string;
    thumbnail?: string;
    destacado?: boolean;
    activo?: boolean;
  },
  server = true
): Promise<Material | null> {
  const ahora = new Date().toISOString();
  return createDocument<Material>(
    'materiales',
    {
      ...datos,
      descargas: 0,
      destacado: datos.destacado ?? false,
      activo: datos.activo ?? true,
      creadoEn: ahora,
      actualizadoEn: ahora
    },
    [],
    server
  );
}

/**
 * Actualizar material (admin)
 */
export async function updateMaterialAdmin(
  id: string,
  datos: Partial<{
    nombre: string;
    slug: string;
    descripcion: string;
    categoria: 'brochure' | 'presentacion' | 'redes' | 'video' | 'guion' | 'casos';
    tags: string;
    archivos: string;
    thumbnail: string;
    destacado: boolean;
    activo: boolean;
  }>,
  server = true
): Promise<Material | null> {
  const ahora = new Date().toISOString();
  return updateDocument<Material>(
    'materiales',
    id,
    {
      ...datos,
      actualizadoEn: ahora
    },
    server
  );
}

/**
 * Eliminar material (admin)
 */
export async function deleteMaterial(
  id: string,
  server = true
): Promise<boolean> {
  return deleteDocument('materiales', id, server);
}

/**
 * Obtener todos los materiales (admin) sin filtro de activo
 */
export async function getAllMaterialesAdmin(
  filtros: {
    categoria?: 'brochure' | 'presentacion' | 'redes' | 'video' | 'guion' | 'casos';
    destacado?: boolean;
    activo?: boolean;
    buscar?: string;
    ordenar?: 'recientes' | 'descargas' | 'nombre';
    limite?: number;
    offset?: number;
  } = {},
  server = true
): Promise<{ materiales: Material[]; total: number }> {
  const queries: string[] = [];

  if (filtros.categoria) {
    queries.push(Query.equal('categoria', filtros.categoria));
  }

  if (filtros.destacado !== undefined) {
    queries.push(Query.equal('destacado', filtros.destacado));
  }

  if (filtros.activo !== undefined) {
    queries.push(Query.equal('activo', filtros.activo));
  }

  if (filtros.buscar) {
    queries.push(Query.search('nombre', filtros.buscar));
  }

  switch (filtros.ordenar) {
    case 'descargas':
      queries.push(Query.orderDesc('descargas'));
      break;
    case 'nombre':
      queries.push(Query.orderAsc('nombre'));
      break;
    case 'recientes':
    default:
      queries.push(Query.orderDesc('creadoEn'));
      break;
  }

  if (filtros.limite) {
    queries.push(Query.limit(filtros.limite));
  }

  if (filtros.offset) {
    queries.push(Query.offset(filtros.offset));
  }

  const databases = getDatabases(server);
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      'materiales',
      queries
    );
    return {
      materiales: response.documents as Material[],
      total: response.total
    };
  } catch (error) {
    console.error('Error obteniendo materiales:', error);
    return { materiales: [], total: 0 };
  }
}

// =============================================================================
// FUNCIONES DE ADMINISTRACIÓN - ESTADÍSTICAS
// =============================================================================

/**
 * Interfaz para estadísticas generales del admin
 */
export interface AdminStats {
  totalUsuarios: number;
  usuariosActivos: number;
  usuariosNuevosEsteMes: number;
  totalVideos: number;
  videosActivos: number;
  totalEventos: number;
  eventosProximos: number;
  totalMateriales: number;
  materialesDestacados: number;
  reproduccionesTotales: number;
  descargasTotales: number;
}

/**
 * Obtener estadísticas generales para el dashboard de admin
 */
export async function getAdminStats(server = true): Promise<AdminStats> {
  try {
    const [
      usuarios,
      videos,
      eventos,
      materiales,
      progresos,
      descargas
    ] = await Promise.all([
      getAllUsers({}, server),
      getAllVideosAdmin({}, server),
      getAllEventosAdmin({}, server),
      getAllMaterialesAdmin({}, server),
      listDocuments<ProgresoVideo>('progreso_videos', [], server),
      listDocuments<{ usuarioId: string }>('descargas_materiales', [], server)
    ]);

    const now = new Date();
    const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1);

    const usuariosNuevosEsteMes = usuarios.usuarios.filter(
      u => new Date(u.creadoEn) >= inicioMes
    ).length;

    const eventosProximos = eventos.eventos.filter(
      e => new Date(e.fechaHora) > now
    ).length;

    return {
      totalUsuarios: usuarios.total,
      usuariosActivos: usuarios.usuarios.filter(u => u.activo).length,
      usuariosNuevosEsteMes,
      totalVideos: videos.total,
      videosActivos: videos.videos.filter(v => v.activo).length,
      totalEventos: eventos.total,
      eventosProximos,
      totalMateriales: materiales.total,
      materialesDestacados: materiales.materiales.filter(m => m.destacado).length,
      reproduccionesTotales: progresos.length,
      descargasTotales: descargas.length
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas de admin:', error);
    return {
      totalUsuarios: 0,
      usuariosActivos: 0,
      usuariosNuevosEsteMes: 0,
      totalVideos: 0,
      videosActivos: 0,
      totalEventos: 0,
      eventosProximos: 0,
      totalMateriales: 0,
      materialesDestacados: 0,
      reproduccionesTotales: 0,
      descargasTotales: 0
    };
  }
}

/**
 * Interfaz para datos de usuarios por mes
 */
export interface UsuariosPorMes {
  mes: string;
  cantidad: number;
}

/**
 * Obtener usuarios registrados por mes
 */
export async function getUserStatsByMonth(
  meses: number = 12,
  server = true
): Promise<UsuariosPorMes[]> {
  try {
    const usuarios = await getAllUsers({ limite: 1000 }, server);
    const resultado: UsuariosPorMes[] = [];
    const now = new Date();

    for (let i = meses - 1; i >= 0; i--) {
      const fecha = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mesStr = fecha.toLocaleString('es-ES', { month: 'short', year: 'numeric' });
      
      const inicioMes = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
      const finMes = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);

      const cantidad = usuarios.usuarios.filter(u => {
        const fechaCreacion = new Date(u.creadoEn);
        return fechaCreacion >= inicioMes && fechaCreacion <= finMes;
      }).length;

      resultado.push({ mes: mesStr, cantidad });
    }

    return resultado;
  } catch (error) {
    console.error('Error obteniendo usuarios por mes:', error);
    return [];
  }
}

/**
 * Interfaz para video con vistas
 */
export interface VideoConVistas extends Video {
  vistas: number;
}

/**
 * Obtener videos más vistos
 */
export async function getMostViewedVideos(
  limite: number = 10,
  server = true
): Promise<VideoConVistas[]> {
  try {
    const [videos, progresos] = await Promise.all([
      listDocuments<Video>('videos', [Query.equal('activo', true)], server),
      listDocuments<ProgresoVideo>('progreso_videos', [], server)
    ]);

    // Contar vistas por video
    const vistasPorVideo = new Map<string, number>();
    progresos.forEach(p => {
      const count = vistasPorVideo.get(p.videoId) || 0;
      vistasPorVideo.set(p.videoId, count + 1);
    });

    // Combinar videos con sus vistas y ordenar
    const videosConVistas: VideoConVistas[] = videos.map(video => ({
      ...video,
      vistas: vistasPorVideo.get(video.$id) || 0
    }));

    return videosConVistas
      .sort((a, b) => b.vistas - a.vistas)
      .slice(0, limite);
  } catch (error) {
    console.error('Error obteniendo videos más vistos:', error);
    return [];
  }
}

/**
 * Interfaz para material con descargas
 */
export interface MaterialConDescargas extends Material {
  totalDescargas: number;
}

/**
 * Obtener materiales más descargados
 */
export async function getMostDownloadedMaterials(
  limite: number = 10,
  server = true
): Promise<MaterialConDescargas[]> {
  try {
    const materiales = await listDocuments<Material>(
      'materiales',
      [Query.equal('activo', true), Query.orderDesc('descargas'), Query.limit(limite)],
      server
    );

    return materiales.map(m => ({
      ...m,
      totalDescargas: m.descargas
    }));
  } catch (error) {
    console.error('Error obteniendo materiales más descargados:', error);
    return [];
  }
}

/**
 * Interfaz para evento con inscripciones
 */
export interface EventoConInscripciones extends Evento {
  totalInscripciones: number;
}

/**
 * Obtener eventos con más inscripciones
 */
export async function getMostPopularEvents(
  limite: number = 10,
  server = true
): Promise<EventoConInscripciones[]> {
  try {
    const eventos = await listDocuments<Evento>(
      'eventos',
      [Query.equal('activo', true), Query.orderDesc('inscritos'), Query.limit(limite)],
      server
    );

    return eventos.map(e => ({
      ...e,
      totalInscripciones: e.inscritos
    }));
  } catch (error) {
    console.error('Error obteniendo eventos populares:', error);
    return [];
  }
}

/**
 * Generar slug a partir de un título
 */
export function generateSlug(titulo: string): string {
  return titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
    .replace(/\s+/g, '-') // Reemplazar espacios por guiones
    .replace(/-+/g, '-') // Remover guiones duplicados
    .replace(/^-+|-+$/g, ''); // Remover guiones al inicio y final
}

/**
 * Exportar datos a CSV
 */
export function exportToCSV(
  datos: Record<string, any>[],
  columnas: { key: string; label: string }[],
  nombreArchivo: string
): void {
  const headers = columnas.map(c => c.label).join(',');
  const rows = datos.map(item => 
    columnas.map(c => {
      const valor = item[c.key];
      // Escapar comillas y envolver en comillas si contiene comas
      if (typeof valor === 'string' && (valor.includes(',') || valor.includes('"'))) {
        return `"${valor.replace(/"/g, '""')}"`;
      }
      return valor ?? '';
    }).join(',')
  );

  const csv = [headers, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${nombreArchivo}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
}

// =============================================================================
// EXPORTACIONES
// =============================================================================

export { ID, Permission, Role, Query };
export default getClient;
