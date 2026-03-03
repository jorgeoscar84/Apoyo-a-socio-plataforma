// Configuración del modo demo
// Este archivo controla cuándo la aplicación funciona en modo demostración

/**
 * Determina si la aplicación está en modo demostración
 * Se activa automáticamente si:
 * 1. NEXT_PUBLIC_DEMO_MODE está configurado como 'true'
 * 2. No hay configuración de NEXT_PUBLIC_APPWRITE_ENDPOINT
 */
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || 
                        !process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
                        process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT === '';

/**
 * Alias para DEMO_MODE
 */
export const IS_DEMO = DEMO_MODE;

/**
 * Usuario demo para sesión falsa
 * Este usuario se usa cuando la aplicación está en modo demo
 */
export const DEMO_USER = {
  $id: 'demo-user-123',
  email: 'demo@plataforma.com',
  name: 'Usuario Demo',
  nombre: 'Usuario',
  apellido: 'Demo',
  rol: 'ADMIN',
  telefono: '+593 999 999 999',
  activo: true,
  emailVerified: true,
  preferences: {
    notifications: true,
    language: 'es',
    theme: 'light'
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

/**
 * Usuario socio para pruebas en modo demo
 */
export const DEMO_SOCIO_USER = {
  $id: 'demo-socio-456',
  email: 'socio@demo.com',
  name: 'Socio Demo',
  nombre: 'Juan',
  apellido: 'Pérez',
  rol: 'SOCIO',
  telefono: '+593 987 654 321',
  activo: true,
  emailVerified: true,
  preferences: {
    notifications: true,
    language: 'es',
    theme: 'light'
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

/**
 * Mensaje a mostrar en modo demo
 */
export const DEMO_MESSAGE = '🚀 Modo Demostración - Los datos mostrados son de prueba';

/**
 * Mensaje para funcionalidades deshabilitadas en modo demo
 */
export const DEMO_DISABLED_MESSAGE = 'Esta funcionalidad no está disponible en modo demostración';

/**
 * Configuración adicional del modo demo
 */
export const DEMO_CONFIG = {
  // Simular delay de red en milisegundos (0 para desactivar)
  networkDelay: 300,
  
  // Mostrar banner de demo
  showBanner: true,
  
  // Permitir edición en modo demo (solo simula, no persiste)
  allowEdit: true,
  
  // Simular errores aleatorios (útil para testing)
  simulateErrors: false,
  
  // Porcentaje de errores a simular (0-100)
  errorRate: 0
};

/**
 * Helper para simular delay de red
 */
export const simulateNetworkDelay = async (): Promise<void> => {
  if (DEMO_CONFIG.networkDelay > 0) {
    await new Promise(resolve => setTimeout(resolve, DEMO_CONFIG.networkDelay));
  }
};

/**
 * Helper para verificar si debemos simular un error
 */
export const shouldSimulateError = (): boolean => {
  if (!DEMO_CONFIG.simulateErrors) return false;
  return Math.random() * 100 < DEMO_CONFIG.errorRate;
};

/**
 * Helper para obtener el usuario demo según el rol
 */
export const getDemoUser = (rol: 'ADMIN' | 'SOCIO' = 'ADMIN') => {
  return rol === 'ADMIN' ? DEMO_USER : DEMO_SOCIO_USER;
};

export default {
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
};
