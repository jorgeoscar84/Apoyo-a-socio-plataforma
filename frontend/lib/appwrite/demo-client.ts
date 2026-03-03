/**
 * Wrapper del Cliente de Appwrite con Soporte para Modo Demo
 * 
 * Este módulo extiende el cliente de Appwrite para soportar modo demostración.
 * Cuando IS_DEMO es true, las funciones devuelven datos mock en lugar de
 * hacer llamadas reales a Appwrite.
 */

import {
  IS_DEMO,
  DEMO_USER,
  DEMO_SOCIO_USER,
  simulateNetworkDelay
} from '../config/demo-config';

import {
  mockVideos,
  mockEventos,
  mockMateriales,
  mockPlanes,
  mockDemos,
  mockCategorias,
  mockUsuarios,
  mockInscripciones,
  mockProgreso,
  mockEstadisticas,
  getMockVideoBySlug,
  getMockEventoBySlug,
  getMockMaterialBySlug,
  getMockPlanBySlug,
  getMockDemoBySlug,
  getMockVideoById,
  getMockEventoById,
  getMockMaterialById,
  isUsuarioInscrito,
  type MockVideo,
  type MockEvento,
  type MockMaterial,
  type MockPlan,
  type MockDemo,
  type MockCategoria,
  type MockUsuario,
  type MockInscripcion,
  type MockProgreso
} from '../data/mock-data';

// Re-exportar todo desde el cliente original
export * from './client';

// Importar tipos específicos
import type {
  Video,
  Evento,
  Material,
  Plan,
  Demo,
  Categoria,
  Usuario,
  ProgresoVideo,
  InscripcionEvento,
  FiltrosEventos,
  FiltrosMateriales,
  FiltrosDemos,
  AdminStats,
  UserStats
} from './client';

// =============================================================================
// FUNCIONES DE AUTENTICACIÓN EN MODO DEMO
// =============================================================================

/**
 * Login en modo demo - siempre exitoso
 */
export async function demoLogin(email: string, password: string) {
  await simulateNetworkDelay();
  
  // Determinar qué usuario demo usar basado en el email
  const isAdmin = email.toLowerCase().includes('admin') || email.toLowerCase().includes('demo');
  const user = isAdmin ? DEMO_USER : DEMO_SOCIO_USER;
  
  return {
    success: true,
    session: {
      $id: 'demo-session-' + Date.now(),
      userId: user.$id,
      email: user.email
    },
    user
  };
}

/**
 * Logout en modo demo - siempre exitoso
 */
export async function demoLogout() {
  await simulateNetworkDelay();
  return { success: true };
}

/**
 * Obtener usuario actual en modo demo
 */
export async function demoGetCurrentUser() {
  await simulateNetworkDelay();
  return {
    success: true,
    user: DEMO_USER
  };
}

// =============================================================================
// FUNCIONES DE VIDEOS EN MODO DEMO
// =============================================================================

/**
 * Convertir mock video a tipo Video
 */
function mockVideoToVideo(mock: MockVideo): Video {
  return {
    $id: mock.$id,
    categoriaId: mock.categoriaId,
    titulo: mock.titulo,
    slug: mock.slug,
    descripcion: mock.descripcion,
    videoUrl: mock.url,
    videoPlataforma: 'youtube' as const,
    videoId: mock.$id,
    thumbnailUrl: mock.thumbnail,
    duracion: mock.duracion,
    orden: 0,
    materialApoyo: '',
    destacado: mock.featured,
    activo: mock.publicado,
    creadoEn: mock.createdAt,
    actualizadoEn: mock.updatedAt
  } as Video;
}

/**
 * Obtener videos en modo demo
 */
export async function demoGetVideos(opciones: {
  categoriaId?: string;
  destacado?: boolean;
  buscar?: string;
  ordenar?: 'recientes' | 'orden' | 'destacados';
  limite?: number;
} = {}): Promise<Video[]> {
  await simulateNetworkDelay();
  
  let result = [...mockVideos];
  
  if (opciones.categoriaId) {
    result = result.filter(v => v.categoriaId === opciones.categoriaId);
  }
  
  if (opciones.destacado !== undefined) {
    result = result.filter(v => v.featured === opciones.destacado);
  }
  
  if (opciones.buscar) {
    const busqueda = opciones.buscar.toLowerCase();
    result = result.filter(v => 
      v.titulo.toLowerCase().includes(busqueda) ||
      v.descripcion.toLowerCase().includes(busqueda)
    );
  }
  
  if (opciones.limite) {
    result = result.slice(0, opciones.limite);
  }
  
  return result.map(mockVideoToVideo);
}

/**
 * Obtener video por slug en modo demo
 */
export async function demoGetVideoBySlug(slug: string): Promise<Video | null> {
  await simulateNetworkDelay();
  const mock = getMockVideoBySlug(slug);
  return mock ? mockVideoToVideo(mock) : null;
}

/**
 * Obtener videos destacados en modo demo
 */
export async function demoGetVideosDestacados(): Promise<Video[]> {
  return demoGetVideos({ destacado: true, limite: 6 });
}

/**
 * Obtener videos por categoría en modo demo
 */
export async function demoGetVideosByCategoria(categoriaId: string): Promise<Video[]> {
  return demoGetVideos({ categoriaId });
}

// =============================================================================
// FUNCIONES DE EVENTOS EN MODO DEMO
// =============================================================================

/**
 * Convertir mock evento a tipo Evento
 */
function mockEventoToEvento(mock: MockEvento): Evento {
  return {
    $id: mock.$id,
    titulo: mock.titulo,
    slug: mock.slug,
    descripcion: mock.descripcion,
    tipo: 'entrenamiento' as const,
    fechaHora: mock.fechaInicio,
    duracion: 60,
    modalidad: mock.modalidad === 'presencial' ? 'presencial' : 'virtual',
    lugar: mock.lugar,
    enlaceVirtual: mock.modalidad !== 'presencial' ? 'https://zoom.us/demo' : undefined,
    plataformaVirtual: 'zoom' as const,
    capacidad: mock.capacidad,
    inscritos: mock.inscritos,
    imagen: mock.imagen,
    instructorNombre: mock.instructor,
    instructorCargo: '',
    instructorFoto: '',
    grabacionUrl: mock.estado === 'finalizado' ? 'https://example.com/recording' : undefined,
    grabacionDisponible: mock.estado === 'finalizado',
    activo: true,
    creadoEn: mock.createdAt,
    actualizadoEn: mock.updatedAt
  } as Evento;
}

/**
 * Obtener eventos en modo demo
 */
export async function demoGetEventos(filtros: FiltrosEventos = {}): Promise<Evento[]> {
  await simulateNetworkDelay();
  
  let result = [...mockEventos];
  
  if (filtros.modalidad) {
    result = result.filter(e => e.modalidad === filtros.modalidad);
  }
  
  if (filtros.proximos) {
    const now = new Date();
    result = result.filter(e => new Date(e.fechaInicio) > now);
  }
  
  if (filtros.pasados) {
    const now = new Date();
    result = result.filter(e => new Date(e.fechaInicio) < now);
  }
  
  if (filtros.buscar) {
    const busqueda = filtros.buscar.toLowerCase();
    result = result.filter(e => 
      e.titulo.toLowerCase().includes(busqueda) ||
      e.descripcion.toLowerCase().includes(busqueda)
    );
  }
  
  if (filtros.limite) {
    result = result.slice(0, filtros.limite);
  }
  
  return result.map(mockEventoToEvento);
}

/**
 * Obtener evento por slug en modo demo
 */
export async function demoGetEventoBySlug(slug: string): Promise<Evento | null> {
  await simulateNetworkDelay();
  const mock = getMockEventoBySlug(slug);
  return mock ? mockEventoToEvento(mock) : null;
}

/**
 * Obtener eventos próximos en modo demo
 */
export async function demoGetEventosProximos(): Promise<Evento[]> {
  return demoGetEventos({ proximos: true, limite: 5 });
}

// =============================================================================
// FUNCIONES DE MATERIALES EN MODO DEMO
// =============================================================================

/**
 * Convertir mock material a tipo Material
 */
function mockMaterialToMaterial(mock: MockMaterial): Material {
  return {
    $id: mock.$id,
    nombre: mock.titulo,
    slug: mock.slug,
    descripcion: mock.descripcion,
    categoria: mock.tipo as any,
    tags: mock.tags.join(','),
    archivos: mock.archivo,
    thumbnail: mock.archivo,
    descargas: mock.descargas,
    destacado: mock.featured,
    activo: mock.publicado,
    creadoEn: mock.createdAt,
    actualizadoEn: mock.updatedAt
  } as Material;
}

/**
 * Obtener materiales en modo demo
 */
export async function demoGetMateriales(filtros: FiltrosMateriales = {}): Promise<Material[]> {
  await simulateNetworkDelay();
  
  let result = [...mockMateriales];
  
  // Nota: Los tipos de categoría en mock data son diferentes a los de Appwrite
  // En modo demo, simplemente omitimos este filtro o hacemos un mapeo
  // if (filtros.categoria) {
  //   result = result.filter(m => m.tipo === filtros.categoria);
  // }
  
  if (filtros.destacado !== undefined) {
    result = result.filter(m => m.featured === filtros.destacado);
  }
  
  if (filtros.buscar) {
    const busqueda = filtros.buscar.toLowerCase();
    result = result.filter(m => 
      m.titulo.toLowerCase().includes(busqueda) ||
      m.descripcion.toLowerCase().includes(busqueda)
    );
  }
  
  if (filtros.limite) {
    result = result.slice(0, filtros.limite);
  }
  
  return result.map(mockMaterialToMaterial);
}

/**
 * Obtener material por slug en modo demo
 */
export async function demoGetMaterialBySlug(slug: string): Promise<Material | null> {
  await simulateNetworkDelay();
  const mock = getMockMaterialBySlug(slug);
  return mock ? mockMaterialToMaterial(mock) : null;
}

/**
 * Obtener materiales destacados en modo demo
 */
export async function demoGetMaterialesDestacados(): Promise<Material[]> {
  return demoGetMateriales({ destacado: true, limite: 6 });
}

// =============================================================================
// FUNCIONES DE PLANES EN MODO DEMO
// =============================================================================

/**
 * Convertir mock plan a tipo Plan
 */
function mockPlanToPlan(mock: MockPlan): Plan {
  return {
    $id: mock.$id,
    nombre: mock.nombre,
    slug: mock.slug,
    descripcion: mock.descripcion,
    precio: mock.precio,
    moneda: 'USD',
    caracteristicas: JSON.stringify(mock.caracteristicas),
    destacado: mock.destacado,
    badge: mock.popular ? 'Más Popular' : undefined,
    color: mock.destacado ? '#3B82F6' : undefined,
    imagen: mock.imagen,
    pdfBrochure: '',
    orden: 0,
    activo: mock.activo,
    creadoEn: mock.createdAt,
    actualizadoEn: mock.updatedAt
  } as Plan;
}

/**
 * Obtener planes en modo demo
 */
export async function demoGetPlanes(): Promise<Plan[]> {
  await simulateNetworkDelay();
  return mockPlanes.map(mockPlanToPlan);
}

/**
 * Obtener plan por slug en modo demo
 */
export async function demoGetPlanBySlug(slug: string): Promise<Plan | null> {
  await simulateNetworkDelay();
  const mock = getMockPlanBySlug(slug);
  return mock ? mockPlanToPlan(mock) : null;
}

// =============================================================================
// FUNCIONES DE DEMOS EN MODO DEMO
// =============================================================================

/**
 * Convertir mock demo a tipo Demo
 */
function mockDemoToDemo(mock: MockDemo): Demo {
  return {
    $id: mock.$id,
    titulo: mock.titulo,
    slug: mock.slug,
    descripcion: mock.descripcion,
    tipo: 'grabada' as const,
    videoUrl: mock.videoUrl,
    guionUrl: '',
    checklistUrl: '',
    thumbnail: mock.imagen,
    duracion: mock.duracion,
    tags: mock.tags.join(','),
    vistas: mock.vistas,
    descargas: 0,
    activo: mock.publicado,
    creadoEn: mock.createdAt,
    actualizadoEn: mock.updatedAt
  } as Demo;
}

/**
 * Obtener demos en modo demo
 */
export async function demoGetDemos(filtros: FiltrosDemos = {}): Promise<Demo[]> {
  await simulateNetworkDelay();
  
  let result = [...mockDemos];
  
  if (filtros.buscar) {
    const busqueda = filtros.buscar.toLowerCase();
    result = result.filter(d => 
      d.titulo.toLowerCase().includes(busqueda) ||
      d.descripcion.toLowerCase().includes(busqueda)
    );
  }
  
  if (filtros.limite) {
    result = result.slice(0, filtros.limite);
  }
  
  return result.map(mockDemoToDemo);
}

/**
 * Obtener demo por slug en modo demo
 */
export async function demoGetDemoBySlug(slug: string): Promise<Demo | null> {
  await simulateNetworkDelay();
  const mock = getMockDemoBySlug(slug);
  return mock ? mockDemoToDemo(mock) : null;
}

// =============================================================================
// FUNCIONES DE CATEGORÍAS EN MODO DEMO
// =============================================================================

/**
 * Convertir mock categoría a tipo Categoria
 */
function mockCategoriaToCategoria(mock: MockCategoria): Categoria {
  return {
    $id: mock.$id,
    nombre: mock.nombre,
    slug: mock.slug,
    descripcion: mock.descripcion,
    icono: mock.icono,
    imagen: '',
    orden: mock.orden,
    activo: mock.activo,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString()
  } as Categoria;
}

/**
 * Obtener categorías en modo demo
 */
export async function demoGetCategorias(): Promise<Categoria[]> {
  await simulateNetworkDelay();
  return mockCategorias.map(mockCategoriaToCategoria);
}

// =============================================================================
// FUNCIONES DE INSCRIPCIONES EN MODO DEMO
// =============================================================================

/**
 * Obtener inscripciones del usuario en modo demo
 */
export async function demoGetMisInscripciones(usuarioId: string): Promise<InscripcionEvento[]> {
  await simulateNetworkDelay();
  
  return mockInscripciones
    .filter(i => i.usuarioId === usuarioId)
    .map(i => ({
      $id: i.$id,
      eventoId: i.eventoId,
      usuarioId: i.usuarioId,
      fechaInscripcion: i.fechaInscripcion,
      asistio: i.estado === 'confirmada',
      recordatorioEnviado: false,
      creadoEn: i.fechaInscripcion
    } as InscripcionEvento));
}

/**
 * Verificar inscripción en modo demo
 */
export async function demoGetInscripcionUsuario(
  usuarioId: string,
  eventoId: string
): Promise<InscripcionEvento | null> {
  await simulateNetworkDelay();
  
  const inscripcion = mockInscripciones.find(
    i => i.usuarioId === usuarioId && i.eventoId === eventoId && i.estado !== 'cancelada'
  );
  
  if (!inscripcion) return null;
  
  return {
    $id: inscripcion.$id,
    eventoId: inscripcion.eventoId,
    usuarioId: inscripcion.usuarioId,
    fechaInscripcion: inscripcion.fechaInscripcion,
    asistio: inscripcion.estado === 'confirmada',
    recordatorioEnviado: false,
    creadoEn: inscripcion.fechaInscripcion
  } as InscripcionEvento;
}

/**
 * Inscribirse a evento en modo demo
 */
export async function demoInscribirseEvento(
  usuarioId: string,
  eventoId: string
): Promise<InscripcionEvento | null> {
  await simulateNetworkDelay();
  
  // Simular inscripción exitosa
  const now = new Date().toISOString();
  
  return {
    $id: 'insc-new-' + Date.now(),
    eventoId,
    usuarioId,
    fechaInscripcion: now,
    asistio: false,
    recordatorioEnviado: false,
    creadoEn: now
  } as InscripcionEvento;
}

/**
 * Cancelar inscripción en modo demo
 */
export async function demoCancelarInscripcion(
  usuarioId: string,
  eventoId: string
): Promise<boolean> {
  await simulateNetworkDelay();
  return true;
}

// =============================================================================
// FUNCIONES DE PROGRESO EN MODO DEMO
// =============================================================================

/**
 * Obtener progreso de videos del usuario en modo demo
 */
export async function demoGetAllProgresosUsuario(usuarioId: string): Promise<ProgresoVideo[]> {
  await simulateNetworkDelay();
  
  return mockProgreso
    .filter(p => p.usuarioId === usuarioId)
    .map(p => ({
      $id: p.$id,
      usuarioId: p.usuarioId,
      videoId: p.videoId,
      progreso: p.progreso,
      completado: p.completado,
      tiempoVisto: p.tiempoVisto,
      ultimaVista: p.ultimaVista,
      creadoEn: p.ultimaVista,
      actualizadoEn: p.ultimaVista
    } as ProgresoVideo));
}

/**
 * Actualizar progreso de video en modo demo
 */
export async function demoUpdateProgresoVideo(
  usuarioId: string,
  videoId: string,
  datos: { progreso: number; tiempoVisto: number; completado?: boolean }
): Promise<ProgresoVideo | null> {
  await simulateNetworkDelay();
  
  const now = new Date().toISOString();
  const completado = datos.completado ?? datos.progreso >= 90;
  
  return {
    $id: 'prog-' + Date.now(),
    usuarioId,
    videoId,
    progreso: datos.progreso,
    completado,
    tiempoVisto: datos.tiempoVisto,
    ultimaVista: now,
    creadoEn: now,
    actualizadoEn: now
  } as ProgresoVideo;
}

// =============================================================================
// FUNCIONES DE ESTADÍSTICAS EN MODO DEMO
// =============================================================================

/**
 * Obtener estadísticas de admin en modo demo
 */
export async function demoGetAdminStats(): Promise<AdminStats> {
  await simulateNetworkDelay();
  
  return {
    totalUsuarios: mockEstadisticas.usuarios.total,
    usuariosActivos: mockEstadisticas.usuarios.activos,
    usuariosNuevosEsteMes: mockEstadisticas.usuarios.nuevos,
    totalVideos: mockEstadisticas.videos.total,
    videosActivos: mockVideos.filter(v => v.publicado).length,
    totalEventos: mockEstadisticas.eventos.total,
    eventosProximos: mockEstadisticas.eventos.proximos,
    totalMateriales: mockEstadisticas.materiales.total,
    materialesDestacados: mockMateriales.filter(m => m.featured).length,
    reproduccionesTotales: mockEstadisticas.videos.vistas,
    descargasTotales: mockEstadisticas.materiales.descargas
  } as AdminStats;
}

/**
 * Obtener estadísticas del usuario en modo demo
 */
export async function demoGetUserStats(usuarioId: string): Promise<UserStats> {
  await simulateNetworkDelay();
  
  const progresos = mockProgreso.filter(p => p.usuarioId === usuarioId);
  const videosCompletados = progresos.filter(p => p.completado).length;
  const tiempoVideos = progresos.reduce((acc, p) => acc + p.tiempoVisto, 0);
  
  return {
    videosCompletados,
    eventosAsistidos: 2,
    materialesDescargados: 5,
    tiempoEnPlataforma: Math.round(tiempoVideos / 60),
    progresoGeneral: Math.round((videosCompletados / mockVideos.length) * 100),
    certificados: videosCompletados
  } as UserStats;
}

// =============================================================================
// FUNCIONES DE USUARIOS EN MODO DEMO
// =============================================================================

/**
 * Obtener todos los usuarios en modo demo
 */
export async function demoGetAllUsers(filtros: {
  rol?: 'SOCIO' | 'ASESOR' | 'ADMIN';
  activo?: boolean;
  buscar?: string;
  limite?: number;
} = {}): Promise<{ usuarios: Usuario[]; total: number }> {
  await simulateNetworkDelay();
  
  let result = [...mockUsuarios];
  
  if (filtros.rol) {
    result = result.filter(u => u.rol === filtros.rol);
  }
  
  if (filtros.activo !== undefined) {
    result = result.filter(u => u.activo === filtros.activo);
  }
  
  if (filtros.buscar) {
    const busqueda = filtros.buscar.toLowerCase();
    result = result.filter(u => 
      u.nombre.toLowerCase().includes(busqueda) ||
      u.apellido.toLowerCase().includes(busqueda) ||
      u.email.toLowerCase().includes(busqueda)
    );
  }
  
  const total = result.length;
  
  if (filtros.limite) {
    result = result.slice(0, filtros.limite);
  }
  
  const usuarios = result.map(u => ({
    $id: u.$id,
    nombre: u.nombre,
    apellido: u.apellido,
    email: u.email,
    telefono: u.telefono,
    avatar: u.avatar,
    rol: u.rol,
    activo: u.activo,
    emailVerificado: u.emailVerified,
    ultimoAcceso: new Date().toISOString(),
    creadoEn: u.createdAt,
    actualizadoEn: u.updatedAt
  } as Usuario));
  
  return { usuarios, total };
}

/**
 * Obtener perfil de usuario en modo demo
 */
export async function demoGetUserProfile(usuarioId: string): Promise<Usuario | null> {
  await simulateNetworkDelay();
  
  const user = mockUsuarios.find(u => u.$id === usuarioId) || DEMO_USER;
  
  return {
    $id: user.$id,
    nombre: user.nombre || (user as any).name?.split(' ')[0] || 'Usuario',
    apellido: user.apellido || (user as any).name?.split(' ')[1] || 'Demo',
    email: user.email,
    telefono: user.telefono,
    avatar: (user as any).avatar,
    rol: user.rol as 'SOCIO' | 'ASESOR' | 'ADMIN',
    activo: user.activo,
    emailVerificado: (user as any).emailVerified ?? true,
    ultimoAcceso: new Date().toISOString(),
    creadoEn: (user as any).createdAt || new Date().toISOString(),
    actualizadoEn: (user as any).updatedAt || new Date().toISOString()
  } as Usuario;
}

/**
 * Actualizar perfil de usuario en modo demo
 */
export async function demoUpdateUserProfile(
  usuarioId: string,
  datos: { nombre?: string; apellido?: string; telefono?: string; avatar?: string }
): Promise<Usuario | null> {
  await simulateNetworkDelay();
  
  const user = mockUsuarios.find(u => u.$id === usuarioId) || DEMO_USER;
  
  return {
    $id: user.$id,
    nombre: datos.nombre || user.nombre || 'Usuario',
    apellido: datos.apellido || user.apellido || 'Demo',
    email: user.email,
    telefono: datos.telefono || user.telefono,
    avatar: datos.avatar || (user as any).avatar,
    rol: user.rol as 'SOCIO' | 'ASESOR' | 'ADMIN',
    activo: user.activo,
    emailVerificado: (user as any).emailVerified ?? true,
    ultimoAcceso: new Date().toISOString(),
    creadoEn: (user as any).createdAt || new Date().toISOString(),
    actualizadoEn: new Date().toISOString()
  } as Usuario;
}

// =============================================================================
// EXPORTAR HELPERS
// =============================================================================

/**
 * Verificar si estamos en modo demo
 */
export const isDemoMode = (): boolean => IS_DEMO;

/**
 * Obtener usuario demo actual
 */
export const getDemoUser = () => DEMO_USER;

export default {
  isDemoMode,
  getDemoUser,
  demoLogin,
  demoLogout,
  demoGetCurrentUser,
  demoGetVideos,
  demoGetVideoBySlug,
  demoGetVideosDestacados,
  demoGetVideosByCategoria,
  demoGetEventos,
  demoGetEventoBySlug,
  demoGetEventosProximos,
  demoGetMateriales,
  demoGetMaterialBySlug,
  demoGetMaterialesDestacados,
  demoGetPlanes,
  demoGetPlanBySlug,
  demoGetDemos,
  demoGetDemoBySlug,
  demoGetCategorias,
  demoGetMisInscripciones,
  demoGetInscripcionUsuario,
  demoInscribirseEvento,
  demoCancelarInscripcion,
  demoGetAllProgresosUsuario,
  demoUpdateProgresoVideo,
  demoGetAdminStats,
  demoGetUserStats,
  demoGetAllUsers,
  demoGetUserProfile,
  demoUpdateUserProfile
};
