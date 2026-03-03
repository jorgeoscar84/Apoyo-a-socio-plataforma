/**
 * Modo Demo - Exportaciones Centralizadas
 * 
 * Este archivo proporciona acceso conveniente a todas las funcionalidades
 * relacionadas con el modo demo.
 */

// Configuración del modo demo
export {
  IS_DEMO,
  DEMO_MODE,
  DEMO_USER,
  DEMO_SOCIO_USER,
  DEMO_MESSAGE,
  DEMO_DISABLED_MESSAGE,
  DEMO_CONFIG,
  simulateNetworkDelay,
  shouldSimulateError,
  getDemoUser
} from '../config/demo-config';

// Datos mock
export {
  mockCategorias,
  mockVideos,
  mockEventos,
  mockMateriales,
  mockPlanes,
  mockDemos,
  mockUsuarios,
  mockInscripciones,
  mockProgreso,
  mockEstadisticas,
  withMockDelay,
  getMockVideos,
  getMockEventos,
  getMockMateriales,
  getMockVideoBySlug,
  getMockEventoBySlug,
  getMockMaterialBySlug,
  getMockPlanBySlug,
  getMockDemoBySlug,
  getMockVideoById,
  getMockEventoById,
  getMockMaterialById,
  getMockCategorias,
  getMockPlanes,
  getMockDemos,
  getMockUsuarios,
  getMockInscripcionesByUsuario,
  getMockProgresoByUsuario,
  isUsuarioInscrito,
  getMockEstadisticas,
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

// Componentes de UI
export {
  DemoBannerCompact,
  DemoBadge,
  DemoDisabledIndicator,
  DemoDisabledWrapper
} from '../../components/ui/DemoBanner';

export { default as DemoBanner } from '../../components/ui/DemoBanner';
