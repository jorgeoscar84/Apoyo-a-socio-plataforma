/**
 * Mock Data para Modo Demo
 * 
 * Este archivo contiene todos los datos de prueba para el modo demostración.
 * Los datos son realistas y permiten mostrar toda la funcionalidad de la plataforma.
 */

import { simulateNetworkDelay, shouldSimulateError } from '../config/demo-config';

// ============================================
// TIPOS
// ============================================

export interface MockVideo {
  $id: string;
  titulo: string;
  slug: string;
  descripcion: string;
  url: string;
  thumbnail: string;
  duracion: number; // en segundos
  categoria: string;
  categoriaId: string;
  instructor: string;
  nivel: 'principiante' | 'intermedio' | 'avanzado';
  tags: string[];
  vistas: number;
  likes: number;
  publicado: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MockEvento {
  $id: string;
  titulo: string;
  slug: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  lugar: string;
  modalidad: 'presencial' | 'virtual' | 'hibrido';
  capacidad: number;
  inscritos: number;
  imagen: string;
  categoria: string;
  instructor: string;
  precio: number;
  estado: 'proximo' | 'en_curso' | 'finalizado' | 'cancelado';
  destacado: boolean;
  requisitos: string[];
  temario: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MockMaterial {
  $id: string;
  titulo: string;
  slug: string;
  descripcion: string;
  tipo: 'pdf' | 'documento' | 'plantilla' | 'guia' | 'checklist';
  archivo: string;
  archivoNombre: string;
  tamano: number; // en bytes
  categoria: string;
  categoriaId: string;
  descargas: number;
  tags: string[];
  autor: string;
  publicado: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MockPlan {
  $id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  precio: number;
  duracion: number; // en días
  caracteristicas: string[];
  videosIncluidos: string[];
  eventosIncluidos: string[];
  materialesIncluidos: string[];
  destacado: boolean;
  popular: boolean;
  activo: boolean;
  imagen: string;
  createdAt: string;
  updatedAt: string;
}

export interface MockDemo {
  $id: string;
  titulo: string;
  slug: string;
  descripcion: string;
  categoria: string;
  imagen: string;
  videoUrl: string;
  duracion: number;
  nivel: 'principiante' | 'intermedio' | 'avanzado';
  instructor: string;
  tags: string[];
  vistas: number;
  likes: number;
  publicado: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MockCategoria {
  $id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  icono: string;
  color: string;
  orden: number;
  activo: boolean;
}

export interface MockUsuario {
  $id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: 'ADMIN' | 'SOCIO';
  telefono?: string;
  activo: boolean;
  emailVerified: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MockInscripcion {
  $id: string;
  eventoId: string;
  usuarioId: string;
  estado: 'confirmada' | 'pendiente' | 'cancelada';
  fechaInscripcion: string;
  codigoQr?: string;
}

export interface MockProgreso {
  $id: string;
  videoId: string;
  usuarioId: string;
  progreso: number; // 0-100
  completado: boolean;
  ultimaVista: string;
  tiempoVisto: number; // en segundos
}

// ============================================
// CATEGORÍAS
// ============================================

export const mockCategorias: MockCategoria[] = [
  {
    $id: 'cat-1',
    nombre: 'Ventas',
    slug: 'ventas',
    descripcion: 'Técnicas y estrategias de ventas',
    icono: 'shopping-cart',
    color: '#3B82F6',
    orden: 1,
    activo: true
  },
  {
    $id: 'cat-2',
    nombre: 'Marketing Digital',
    slug: 'marketing-digital',
    descripcion: 'Marketing en plataformas digitales',
    icono: 'megaphone',
    color: '#10B981',
    orden: 2,
    activo: true
  },
  {
    $id: 'cat-3',
    nombre: 'Liderazgo',
    slug: 'liderazgo',
    descripcion: 'Habilidades de liderazgo y gestión',
    icono: 'users',
    color: '#8B5CF6',
    orden: 3,
    activo: true
  },
  {
    $id: 'cat-4',
    nombre: 'Finanzas',
    slug: 'finanzas',
    descripcion: 'Gestión financiera personal y empresarial',
    icono: 'dollar-sign',
    color: '#F59E0B',
    orden: 4,
    activo: true
  },
  {
    $id: 'cat-5',
    nombre: 'Productividad',
    slug: 'productividad',
    descripcion: 'Herramientas y técnicas de productividad',
    icono: 'zap',
    color: '#EF4444',
    orden: 5,
    activo: true
  }
];

// ============================================
// VIDEOS
// ============================================

export const mockVideos: MockVideo[] = [
  {
    $id: 'video-1',
    titulo: 'Técnicas de Cierre de Ventas Efectivas',
    slug: 'tecnicas-cierre-ventas-efectivas',
    descripcion: 'Aprende las mejores técnicas para cerrar ventas con éxito. Este curso cubre desde el primer contacto hasta el cierre final, incluyendo cómo manejar objeciones y crear urgencia.',
    url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
    thumbnail: 'https://picsum.photos/seed/video1/640/360',
    duracion: 1800, // 30 min
    categoria: 'Ventas',
    categoriaId: 'cat-1',
    instructor: 'María García',
    nivel: 'intermedio',
    tags: ['ventas', 'cierre', 'negociación', 'objeciones'],
    vistas: 1250,
    likes: 89,
    publicado: true,
    featured: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    $id: 'video-2',
    titulo: 'Marketing en Redes Sociales 2024',
    slug: 'marketing-redes-sociales-2024',
    descripcion: 'Descubre las últimas tendencias en marketing digital para redes sociales. Aprende a crear contenido viral y a medir el ROI de tus campañas.',
    url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
    thumbnail: 'https://picsum.photos/seed/video2/640/360',
    duracion: 2700, // 45 min
    categoria: 'Marketing Digital',
    categoriaId: 'cat-2',
    instructor: 'Carlos Rodríguez',
    nivel: 'principiante',
    tags: ['marketing', 'redes sociales', 'instagram', 'facebook', 'tiktok'],
    vistas: 2340,
    likes: 156,
    publicado: true,
    featured: true,
    createdAt: '2024-02-01T14:00:00Z',
    updatedAt: '2024-02-01T14:00:00Z'
  },
  {
    $id: 'video-3',
    titulo: 'Liderazgo Transformacional',
    slug: 'liderazgo-transformacional',
    descripcion: 'Desarrolla tus habilidades de liderazgo para inspirar y motivar a tu equipo. Aprende sobre comunicación efectiva, delegación y gestión del cambio.',
    url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
    thumbnail: 'https://picsum.photos/seed/video3/640/360',
    duracion: 3600, // 60 min
    categoria: 'Liderazgo',
    categoriaId: 'cat-3',
    instructor: 'Ana Martínez',
    nivel: 'avanzado',
    tags: ['liderazgo', 'gestión', 'equipos', 'comunicación'],
    vistas: 890,
    likes: 67,
    publicado: true,
    featured: false,
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-01-20T09:00:00Z'
  },
  {
    $id: 'video-4',
    titulo: 'Gestión Financiera para Emprendedores',
    slug: 'gestion-financiera-emprendedores',
    descripcion: 'Aprende a manejar las finanzas de tu negocio. Desde la creación de un presupuesto hasta el análisis de estados financieros.',
    url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
    thumbnail: 'https://picsum.photos/seed/video4/640/360',
    duracion: 2400, // 40 min
    categoria: 'Finanzas',
    categoriaId: 'cat-4',
    instructor: 'Pedro Sánchez',
    nivel: 'principiante',
    tags: ['finanzas', 'emprendimiento', 'presupuesto', 'inversión'],
    vistas: 1567,
    likes: 112,
    publicado: true,
    featured: true,
    createdAt: '2024-02-10T11:00:00Z',
    updatedAt: '2024-02-10T11:00:00Z'
  },
  {
    $id: 'video-5',
    titulo: 'Productividad con Metodología GTD',
    slug: 'productividad-metodologia-gtd',
    descripcion: 'Implementa Getting Things Done en tu día a día. Organiza tus tareas, reduce el estrés y aumenta tu productividad personal y profesional.',
    url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
    thumbnail: 'https://picsum.photos/seed/video5/640/360',
    duracion: 2100, // 35 min
    categoria: 'Productividad',
    categoriaId: 'cat-5',
    instructor: 'Laura López',
    nivel: 'intermedio',
    tags: ['productividad', 'GTD', 'organización', 'tiempo'],
    vistas: 945,
    likes: 78,
    publicado: true,
    featured: false,
    createdAt: '2024-02-15T16:00:00Z',
    updatedAt: '2024-02-15T16:00:00Z'
  },
  {
    $id: 'video-6',
    titulo: 'Negociación Avanzada',
    slug: 'negociacion-avanzada',
    descripcion: 'Técnicas avanzadas de negociación para situaciones complejas. Aprende a negociar con confianza y obtener resultados ganador-ganador.',
    url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
    thumbnail: 'https://picsum.photos/seed/video6/640/360',
    duracion: 3000, // 50 min
    categoria: 'Ventas',
    categoriaId: 'cat-1',
    instructor: 'Roberto Fernández',
    nivel: 'avanzado',
    tags: ['negociación', 'ventas', 'acuerdos'],
    vistas: 678,
    likes: 54,
    publicado: true,
    featured: false,
    createdAt: '2024-02-20T10:00:00Z',
    updatedAt: '2024-02-20T10:00:00Z'
  },
  {
    $id: 'video-7',
    titulo: 'SEO para Principiantes',
    slug: 'seo-principiantes',
    descripcion: 'Introducción al posicionamiento en buscadores. Aprende los fundamentos del SEO y cómo aplicarlos en tu sitio web.',
    url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
    thumbnail: 'https://picsum.photos/seed/video7/640/360',
    duracion: 2400, // 40 min
    categoria: 'Marketing Digital',
    categoriaId: 'cat-2',
    instructor: 'Diego Mendoza',
    nivel: 'principiante',
    tags: ['SEO', 'marketing', 'google', 'posicionamiento'],
    vistas: 1890,
    likes: 134,
    publicado: true,
    featured: false,
    createdAt: '2024-02-25T08:00:00Z',
    updatedAt: '2024-02-25T08:00:00Z'
  },
  {
    $id: 'video-8',
    titulo: 'Inteligencia Emocional en el Trabajo',
    slug: 'inteligencia-emocional-trabajo',
    descripcion: 'Desarrolla tu inteligencia emocional para mejorar tus relaciones laborales y tu desempeño profesional.',
    url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
    thumbnail: 'https://picsum.photos/seed/video8/640/360',
    duracion: 2700, // 45 min
    categoria: 'Liderazgo',
    categoriaId: 'cat-3',
    instructor: 'Carmen Ruiz',
    nivel: 'intermedio',
    tags: ['inteligencia emocional', 'liderazgo', 'soft skills'],
    vistas: 1123,
    likes: 95,
    publicado: true,
    featured: false,
    createdAt: '2024-03-01T12:00:00Z',
    updatedAt: '2024-03-01T12:00:00Z'
  }
];

// ============================================
// EVENTOS
// ============================================

export const mockEventos: MockEvento[] = [
  {
    $id: 'evento-1',
    titulo: 'Workshop de Ventas 2024',
    slug: 'workshop-ventas-2024',
    descripcion: 'Un día completo de aprendizaje sobre las últimas técnicas de ventas. Incluye sesiones prácticas, networking y certificado de participación.',
    fechaInicio: '2024-04-15T09:00:00Z',
    fechaFin: '2024-04-15T18:00:00Z',
    lugar: 'Hotel Hilton Quito',
    modalidad: 'presencial',
    capacidad: 100,
    inscritos: 75,
    imagen: 'https://picsum.photos/seed/evento1/800/400',
    categoria: 'Ventas',
    instructor: 'María García',
    precio: 99.99,
    estado: 'proximo',
    destacado: true,
    requisitos: [
      'Conocimientos básicos de ventas',
      'Laptop o tablet para ejercicios prácticos'
    ],
    temario: [
      'Introducción a las ventas modernas',
      'Psicología del comprador',
      'Técnicas de cierre',
      'Role-playing y práctica'
    ],
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z'
  },
  {
    $id: 'evento-2',
    titulo: 'Webinar: Marketing Digital Trends',
    slug: 'webinar-marketing-digital-trends',
    descripcion: 'Descubre las tendencias de marketing digital que dominarán este año. Sesión virtual gratuita con expertos del sector.',
    fechaInicio: '2024-03-20T15:00:00Z',
    fechaFin: '2024-03-20T17:00:00Z',
    lugar: 'Zoom',
    modalidad: 'virtual',
    capacidad: 500,
    inscritos: 342,
    imagen: 'https://picsum.photos/seed/evento2/800/400',
    categoria: 'Marketing Digital',
    instructor: 'Carlos Rodríguez',
    precio: 0,
    estado: 'proximo',
    destacado: true,
    requisitos: [
      'Conexión a internet estable',
      'Cuenta de Zoom (gratuita)'
    ],
    temario: [
      'IA en marketing',
      'Video marketing',
      'Social commerce',
      'Medición y analytics'
    ],
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-01T09:00:00Z'
  },
  {
    $id: 'evento-3',
    titulo: 'Bootcamp de Liderazgo',
    slug: 'bootcamp-liderazgo',
    descripcion: 'Tres días intensivos para desarrollar tus habilidades de liderazgo. Incluye alojamiento y materiales.',
    fechaInicio: '2024-05-01T08:00:00Z',
    fechaFin: '2024-05-03T18:00:00Z',
    lugar: 'Resort Puerto López',
    modalidad: 'presencial',
    capacidad: 50,
    inscritos: 42,
    imagen: 'https://picsum.photos/seed/evento3/800/400',
    categoria: 'Liderazgo',
    instructor: 'Ana Martínez',
    precio: 499.99,
    estado: 'proximo',
    destacado: true,
    requisitos: [
      'Experiencia en gestión de equipos',
      'Carta de motivación'
    ],
    temario: [
      'Autoconocimiento y liderazgo',
      'Comunicación efectiva',
      'Gestión de conflictos',
      'Coaching y feedback'
    ],
    createdAt: '2024-02-15T11:00:00Z',
    updatedAt: '2024-02-15T11:00:00Z'
  },
  {
    $id: 'evento-4',
    titulo: 'Seminario de Finanzas Personales',
    slug: 'seminario-finanzas-personales',
    descripcion: 'Aprende a manejar tu dinero de forma inteligente. Inversión, ahorro y planificación financiera.',
    fechaInicio: '2024-02-10T10:00:00Z',
    fechaFin: '2024-02-10T14:00:00Z',
    lugar: 'Centro de Convenciones Guayaquil',
    modalidad: 'presencial',
    capacidad: 200,
    inscritos: 198,
    imagen: 'https://picsum.photos/seed/evento4/800/400',
    categoria: 'Finanzas',
    instructor: 'Pedro Sánchez',
    precio: 49.99,
    estado: 'finalizado',
    destacado: false,
    requisitos: [],
    temario: [
      'Presupuesto personal',
      'Inversión básica',
      'Planificación de retiro'
    ],
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-05T08:00:00Z'
  },
  {
    $id: 'evento-5',
    titulo: 'Masterclass: Productividad Extrema',
    slug: 'masterclass-productividad-extrema',
    descripcion: 'Aprende las técnicas que usan los ejecutivos más productivos del mundo. Sesión virtual interactiva.',
    fechaInicio: '2024-03-10T10:00:00Z',
    fechaFin: '2024-03-10T12:00:00Z',
    lugar: 'Google Meet',
    modalidad: 'virtual',
    capacidad: 300,
    inscritos: 287,
    imagen: 'https://picsum.photos/seed/evento5/800/400',
    categoria: 'Productividad',
    instructor: 'Laura López',
    precio: 29.99,
    estado: 'en_curso',
    destacado: false,
    requisitos: [],
    temario: [
      'Time blocking',
      'Eisenhower Matrix',
      'Herramientas digitales'
    ],
    createdAt: '2024-02-20T14:00:00Z',
    updatedAt: '2024-02-20T14:00:00Z'
  }
];

// ============================================
// MATERIALES
// ============================================

export const mockMateriales: MockMaterial[] = [
  {
    $id: 'material-1',
    titulo: 'Guía Completa de Ventas',
    slug: 'guia-completa-ventas',
    descripcion: 'PDF con todas las técnicas de ventas cubiertas en nuestros cursos. Incluye plantillas y ejemplos prácticos.',
    tipo: 'guia',
    archivo: 'https://example.com/guia-ventas.pdf',
    archivoNombre: 'guia-ventas.pdf',
    tamano: 2500000, // 2.5 MB
    categoria: 'Ventas',
    categoriaId: 'cat-1',
    descargas: 456,
    tags: ['ventas', 'guía', 'técnicas'],
    autor: 'María García',
    publicado: true,
    featured: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    $id: 'material-2',
    titulo: 'Plantilla de Plan de Marketing',
    slug: 'plantilla-plan-marketing',
    descripcion: 'Plantilla editable para crear tu plan de marketing digital. Formato Google Docs compatible con Word.',
    tipo: 'plantilla',
    archivo: 'https://example.com/plantilla-marketing.docx',
    archivoNombre: 'plantilla-marketing.docx',
    tamano: 500000, // 500 KB
    categoria: 'Marketing Digital',
    categoriaId: 'cat-2',
    descargas: 789,
    tags: ['marketing', 'plantilla', 'plan'],
    autor: 'Carlos Rodríguez',
    publicado: true,
    featured: true,
    createdAt: '2024-02-01T14:00:00Z',
    updatedAt: '2024-02-01T14:00:00Z'
  },
  {
    $id: 'material-3',
    titulo: 'Checklist de Liderazgo Efectivo',
    slug: 'checklist-liderazgo-efectivo',
    descripcion: 'Lista de verificación diaria para líderes. Mejora tu gestión con prácticas probadas.',
    tipo: 'checklist',
    archivo: 'https://example.com/checklist-liderazgo.pdf',
    archivoNombre: 'checklist-liderazgo.pdf',
    tamano: 150000, // 150 KB
    categoria: 'Liderazgo',
    categoriaId: 'cat-3',
    descargas: 321,
    tags: ['liderazgo', 'checklist', 'gestión'],
    autor: 'Ana Martínez',
    publicado: true,
    featured: false,
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-01-20T09:00:00Z'
  },
  {
    $id: 'material-4',
    titulo: 'Calculadora de Finanzas Personales',
    slug: 'calculadora-finanzas-personales',
    descripcion: 'Herramienta Excel para calcular presupuestos, ahorros e inversiones.',
    tipo: 'plantilla',
    archivo: 'https://example.com/calculadora-finanzas.xlsx',
    archivoNombre: 'calculadora-finanzas.xlsx',
    tamano: 800000, // 800 KB
    categoria: 'Finanzas',
    categoriaId: 'cat-4',
    descargas: 567,
    tags: ['finanzas', 'excel', 'presupuesto'],
    autor: 'Pedro Sánchez',
    publicado: true,
    featured: true,
    createdAt: '2024-02-10T11:00:00Z',
    updatedAt: '2024-02-10T11:00:00Z'
  },
  {
    $id: 'material-5',
    titulo: 'Guía de Productividad GTD',
    slug: 'guia-productividad-gtd',
    descripcion: 'Manual completo para implementar Getting Things Done. Incluye ejemplos y casos de estudio.',
    tipo: 'guia',
    archivo: 'https://example.com/guia-gtd.pdf',
    archivoNombre: 'guia-gtd.pdf',
    tamano: 3500000, // 3.5 MB
    categoria: 'Productividad',
    categoriaId: 'cat-5',
    descargas: 234,
    tags: ['productividad', 'GTD', 'guía'],
    autor: 'Laura López',
    publicado: true,
    featured: false,
    createdAt: '2024-02-15T16:00:00Z',
    updatedAt: '2024-02-15T16:00:00Z'
  },
  {
    $id: 'material-6',
    titulo: 'Manual de Negociación',
    slug: 'manual-negociacion',
    descripcion: 'Técnicas avanzadas de negociación con ejemplos reales y ejercicios prácticos.',
    tipo: 'documento',
    archivo: 'https://example.com/manual-negociacion.pdf',
    archivoNombre: 'manual-negociacion.pdf',
    tamano: 4200000, // 4.2 MB
    categoria: 'Ventas',
    categoriaId: 'cat-1',
    descargas: 189,
    tags: ['negociación', 'ventas', 'manual'],
    autor: 'Roberto Fernández',
    publicado: true,
    featured: false,
    createdAt: '2024-02-20T10:00:00Z',
    updatedAt: '2024-02-20T10:00:00Z'
  },
  {
    $id: 'material-7',
    titulo: 'SEO Checklist 2024',
    slug: 'seo-checklist-2024',
    descripcion: 'Lista completa de verificación SEO para optimizar tu sitio web.',
    tipo: 'checklist',
    archivo: 'https://example.com/seo-checklist.pdf',
    archivoNombre: 'seo-checklist.pdf',
    tamano: 200000, // 200 KB
    categoria: 'Marketing Digital',
    categoriaId: 'cat-2',
    descargas: 678,
    tags: ['SEO', 'checklist', 'optimización'],
    autor: 'Diego Mendoza',
    publicado: true,
    featured: true,
    createdAt: '2024-02-25T08:00:00Z',
    updatedAt: '2024-02-25T08:00:00Z'
  },
  {
    $id: 'material-8',
    titulo: 'Plantilla de Evaluación de Liderazgo',
    slug: 'plantilla-evaluacion-liderazgo',
    descripcion: 'Formulario para evaluar habilidades de liderazgo y crear planes de desarrollo.',
    tipo: 'plantilla',
    archivo: 'https://example.com/evaluacion-liderazgo.docx',
    archivoNombre: 'evaluacion-liderazgo.docx',
    tamano: 350000, // 350 KB
    categoria: 'Liderazgo',
    categoriaId: 'cat-3',
    descargas: 145,
    tags: ['liderazgo', 'evaluación', 'desarrollo'],
    autor: 'Carmen Ruiz',
    publicado: true,
    featured: false,
    createdAt: '2024-03-01T12:00:00Z',
    updatedAt: '2024-03-01T12:00:00Z'
  }
];

// ============================================
// PLANES
// ============================================

export const mockPlanes: MockPlan[] = [
  {
    $id: 'plan-1',
    nombre: 'Plan Básico',
    slug: 'plan-basico',
    descripcion: 'Acceso a contenido fundamental para comenzar tu desarrollo profesional.',
    precio: 29.99,
    duracion: 30,
    caracteristicas: [
      'Acceso a 10 videos básicos',
      '3 materiales descargables',
      'Soporte por email',
      'Certificado de finalización'
    ],
    videosIncluidos: ['video-1', 'video-4', 'video-7'],
    eventosIncluidos: ['evento-2'],
    materialesIncluidos: ['material-1', 'material-3', 'material-7'],
    destacado: false,
    popular: false,
    activo: true,
    imagen: 'https://picsum.photos/seed/plan1/400/300',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    $id: 'plan-2',
    nombre: 'Plan Profesional',
    slug: 'plan-profesional',
    descripcion: 'El plan más popular. Acceso completo a todo el contenido de la plataforma.',
    precio: 79.99,
    duracion: 30,
    caracteristicas: [
      'Acceso ilimitado a todos los videos',
      'Todos los materiales descargables',
      'Soporte prioritario',
      'Acceso a eventos virtuales',
      'Certificados de todos los cursos',
      'Comunidad exclusiva'
    ],
    videosIncluidos: ['video-1', 'video-2', 'video-3', 'video-4', 'video-5', 'video-6', 'video-7', 'video-8'],
    eventosIncluidos: ['evento-1', 'evento-2', 'evento-5'],
    materialesIncluidos: ['material-1', 'material-2', 'material-3', 'material-4', 'material-5', 'material-6', 'material-7', 'material-8'],
    destacado: true,
    popular: true,
    activo: true,
    imagen: 'https://picsum.photos/seed/plan2/400/300',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    $id: 'plan-3',
    nombre: 'Plan Empresarial',
    slug: 'plan-empresarial',
    descripcion: 'Para equipos y empresas que buscan desarrollar a sus colaboradores.',
    precio: 299.99,
    duracion: 90,
    caracteristicas: [
      'Hasta 10 usuarios',
      'Acceso ilimitado a todo el contenido',
      'Eventos presenciales incluidos',
      'Soporte dedicado 24/7',
      'Reportes de progreso',
      'Personalización de contenido',
      'Capacitaciones privadas'
    ],
    videosIncluidos: ['video-1', 'video-2', 'video-3', 'video-4', 'video-5', 'video-6', 'video-7', 'video-8'],
    eventosIncluidos: ['evento-1', 'evento-2', 'evento-3', 'evento-4', 'evento-5'],
    materialesIncluidos: ['material-1', 'material-2', 'material-3', 'material-4', 'material-5', 'material-6', 'material-7', 'material-8'],
    destacado: true,
    popular: false,
    activo: true,
    imagen: 'https://picsum.photos/seed/plan3/400/300',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    $id: 'plan-4',
    nombre: 'Plan Anual',
    slug: 'plan-anual',
    descripcion: 'Ahorra con nuestro plan anual. Acceso completo por 12 meses.',
    precio: 799.99,
    duracion: 365,
    caracteristicas: [
      'Todo lo del Plan Profesional',
      '2 meses gratis',
      'Acceso anticipado a nuevo contenido',
      'Sesiones de mentoría mensuales',
      'Descuentos exclusivos en eventos'
    ],
    videosIncluidos: ['video-1', 'video-2', 'video-3', 'video-4', 'video-5', 'video-6', 'video-7', 'video-8'],
    eventosIncluidos: ['evento-1', 'evento-2', 'evento-3', 'evento-4', 'evento-5'],
    materialesIncluidos: ['material-1', 'material-2', 'material-3', 'material-4', 'material-5', 'material-6', 'material-7', 'material-8'],
    destacado: false,
    popular: false,
    activo: true,
    imagen: 'https://picsum.photos/seed/plan4/400/300',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// ============================================
// DEMOS
// ============================================

export const mockDemos: MockDemo[] = [
  {
    $id: 'demo-1',
    titulo: 'Demo: Sistema de Ventas CRM',
    slug: 'demo-sistema-ventas-crm',
    descripcion: 'Mira cómo funciona nuestro sistema de gestión de ventas integrado. Aprende a usar las herramientas que te ayudarán a cerrar más tratos.',
    categoria: 'Ventas',
    imagen: 'https://picsum.photos/seed/demo1/640/360',
    videoUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
    duracion: 600, // 10 min
    nivel: 'principiante',
    instructor: 'María García',
    tags: ['CRM', 'ventas', 'demo', 'software'],
    vistas: 567,
    likes: 45,
    publicado: true,
    featured: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    $id: 'demo-2',
    titulo: 'Demo: Herramientas de Marketing Automation',
    slug: 'demo-marketing-automation',
    descripcion: 'Descubre las herramientas de automatización de marketing más potentes del mercado. Campañas automatizadas, email marketing y más.',
    categoria: 'Marketing Digital',
    imagen: 'https://picsum.photos/seed/demo2/640/360',
    videoUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
    duracion: 900, // 15 min
    nivel: 'intermedio',
    instructor: 'Carlos Rodríguez',
    tags: ['marketing automation', 'email', 'demo'],
    vistas: 789,
    likes: 67,
    publicado: true,
    featured: true,
    createdAt: '2024-02-01T14:00:00Z',
    updatedAt: '2024-02-01T14:00:00Z'
  },
  {
    $id: 'demo-3',
    titulo: 'Demo: Dashboard de Liderazgo',
    slug: 'demo-dashboard-liderazgo',
    descripcion: 'Visualiza cómo un dashboard de liderazgo puede ayudarte a gestionar tu equipo de forma más efectiva.',
    categoria: 'Liderazgo',
    imagen: 'https://picsum.photos/seed/demo3/640/360',
    videoUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
    duracion: 720, // 12 min
    nivel: 'avanzado',
    instructor: 'Ana Martínez',
    tags: ['dashboard', 'liderazgo', 'gestión', 'KPIs'],
    vistas: 345,
    likes: 28,
    publicado: true,
    featured: false,
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-01-20T09:00:00Z'
  },
  {
    $id: 'demo-4',
    titulo: 'Demo: App de Finanzas Personales',
    slug: 'demo-app-finanzas-personales',
    descripcion: 'Explora nuestra aplicación de gestión financiera personal. Controla tus gastos, inversiones y ahorros.',
    categoria: 'Finanzas',
    imagen: 'https://picsum.photos/seed/demo4/640/360',
    videoUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
    duracion: 840, // 14 min
    nivel: 'principiante',
    instructor: 'Pedro Sánchez',
    tags: ['finanzas', 'app', 'presupuesto', 'demo'],
    vistas: 456,
    likes: 38,
    publicado: true,
    featured: false,
    createdAt: '2024-02-10T11:00:00Z',
    updatedAt: '2024-02-10T11:00:00Z'
  },
  {
    $id: 'demo-5',
    titulo: 'Demo: Suite de Productividad',
    slug: 'demo-suite-productividad',
    descripcion: 'Conoce las herramientas de productividad que transformarán tu forma de trabajar. Gestión de tareas, calendario y colaboración.',
    categoria: 'Productividad',
    imagen: 'https://picsum.photos/seed/demo5/640/360',
    videoUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
    duracion: 780, // 13 min
    nivel: 'intermedio',
    instructor: 'Laura López',
    tags: ['productividad', 'tareas', 'colaboración'],
    vistas: 234,
    likes: 19,
    publicado: true,
    featured: false,
    createdAt: '2024-02-15T16:00:00Z',
    updatedAt: '2024-02-15T16:00:00Z'
  }
];

// ============================================
// USUARIOS
// ============================================

export const mockUsuarios: MockUsuario[] = [
  {
    $id: 'user-1',
    email: 'admin@plataforma.com',
    nombre: 'Admin',
    apellido: 'Principal',
    rol: 'ADMIN',
    telefono: '+593 999 999 001',
    activo: true,
    emailVerified: true,
    avatar: 'https://picsum.photos/seed/user1/200/200',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    $id: 'user-2',
    email: 'maria.garcia@plataforma.com',
    nombre: 'María',
    apellido: 'García',
    rol: 'ADMIN',
    telefono: '+593 999 999 002',
    activo: true,
    emailVerified: true,
    avatar: 'https://picsum.photos/seed/user2/200/200',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  },
  {
    $id: 'user-3',
    email: 'carlos.rodriguez@plataforma.com',
    nombre: 'Carlos',
    apellido: 'Rodríguez',
    rol: 'ADMIN',
    telefono: '+593 999 999 003',
    activo: true,
    emailVerified: true,
    avatar: 'https://picsum.photos/seed/user3/200/200',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    $id: 'user-4',
    email: 'juan.perez@email.com',
    nombre: 'Juan',
    apellido: 'Pérez',
    rol: 'SOCIO',
    telefono: '+593 987 654 321',
    activo: true,
    emailVerified: true,
    avatar: 'https://picsum.photos/seed/user4/200/200',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z'
  },
  {
    $id: 'user-5',
    email: 'ana.lopez@email.com',
    nombre: 'Ana',
    apellido: 'López',
    rol: 'SOCIO',
    telefono: '+593 987 654 322',
    activo: true,
    emailVerified: true,
    avatar: 'https://picsum.photos/seed/user5/200/200',
    createdAt: '2024-02-05T00:00:00Z',
    updatedAt: '2024-02-05T00:00:00Z'
  },
  {
    $id: 'user-6',
    email: 'pedro.martinez@email.com',
    nombre: 'Pedro',
    apellido: 'Martínez',
    rol: 'SOCIO',
    telefono: '+593 987 654 323',
    activo: false,
    emailVerified: false,
    avatar: 'https://picsum.photos/seed/user6/200/200',
    createdAt: '2024-02-10T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z'
  }
];

// ============================================
// INSCRIPCIONES
// ============================================

export const mockInscripciones: MockInscripcion[] = [
  {
    $id: 'insc-1',
    eventoId: 'evento-1',
    usuarioId: 'demo-user-123',
    estado: 'confirmada',
    fechaInscripcion: '2024-02-01T10:00:00Z',
    codigoQr: 'QR-EVENTO1-DEMO'
  },
  {
    $id: 'insc-2',
    eventoId: 'evento-2',
    usuarioId: 'demo-user-123',
    estado: 'confirmada',
    fechaInscripcion: '2024-02-05T14:00:00Z',
    codigoQr: 'QR-EVENTO2-DEMO'
  },
  {
    $id: 'insc-3',
    eventoId: 'evento-3',
    usuarioId: 'demo-user-123',
    estado: 'pendiente',
    fechaInscripcion: '2024-02-10T09:00:00Z'
  }
];

// ============================================
// PROGRESO
// ============================================

export const mockProgreso: MockProgreso[] = [
  {
    $id: 'prog-1',
    videoId: 'video-1',
    usuarioId: 'demo-user-123',
    progreso: 75,
    completado: false,
    ultimaVista: '2024-03-01T15:00:00Z',
    tiempoVisto: 1350
  },
  {
    $id: 'prog-2',
    videoId: 'video-2',
    usuarioId: 'demo-user-123',
    progreso: 100,
    completado: true,
    ultimaVista: '2024-02-28T10:00:00Z',
    tiempoVisto: 2700
  },
  {
    $id: 'prog-3',
    videoId: 'video-4',
    usuarioId: 'demo-user-123',
    progreso: 50,
    completado: false,
    ultimaVista: '2024-03-02T11:00:00Z',
    tiempoVisto: 1200
  }
];

// ============================================
// ESTADÍSTICAS
// ============================================

export const mockEstadisticas = {
  usuarios: {
    total: 1250,
    activos: 980,
    nuevos: 45,
    crecimiento: 12.5
  },
  videos: {
    total: 85,
    vistas: 45670,
    promedioVistas: 537,
    completados: 23450
  },
  eventos: {
    total: 24,
    proximos: 5,
    inscritos: 890,
    tasaAsistencia: 78
  },
  materiales: {
    total: 120,
    descargas: 12450,
    populares: ['material-2', 'material-4', 'material-7']
  },
  ingresos: {
    mesActual: 15670.50,
    mesAnterior: 12340.00,
    crecimiento: 27
  }
};

// ============================================
// HELPERS
// ============================================

/**
 * Wrapper para simular llamadas a API con datos mock
 */
export async function withMockDelay<T>(data: T): Promise<T> {
  await simulateNetworkDelay();
  
  if (shouldSimulateError()) {
    throw new Error('Error simulado en modo demo');
  }
  
  return data;
}

/**
 * Obtener videos con filtros opcionales
 */
export async function getMockVideos(filters?: {
  categoria?: string;
  nivel?: string;
  featured?: boolean;
  limit?: number;
}): Promise<MockVideo[]> {
  let result = [...mockVideos];
  
  if (filters?.categoria) {
    result = result.filter(v => v.categoria.toLowerCase() === filters.categoria?.toLowerCase());
  }
  
  if (filters?.nivel) {
    result = result.filter(v => v.nivel === filters.nivel);
  }
  
  if (filters?.featured !== undefined) {
    result = result.filter(v => v.featured === filters.featured);
  }
  
  if (filters?.limit) {
    result = result.slice(0, filters.limit);
  }
  
  return withMockDelay(result);
}

/**
 * Obtener eventos con filtros opcionales
 */
export async function getMockEventos(filters?: {
  categoria?: string;
  estado?: string;
  modalidad?: string;
  destacado?: boolean;
  limit?: number;
}): Promise<MockEvento[]> {
  let result = [...mockEventos];
  
  if (filters?.categoria) {
    result = result.filter(e => e.categoria.toLowerCase() === filters.categoria?.toLowerCase());
  }
  
  if (filters?.estado) {
    result = result.filter(e => e.estado === filters.estado);
  }
  
  if (filters?.modalidad) {
    result = result.filter(e => e.modalidad === filters.modalidad);
  }
  
  if (filters?.destacado !== undefined) {
    result = result.filter(e => e.destacado === filters.destacado);
  }
  
  if (filters?.limit) {
    result = result.slice(0, filters.limit);
  }
  
  return withMockDelay(result);
}

/**
 * Obtener materiales con filtros opcionales
 */
export async function getMockMateriales(filters?: {
  categoria?: string;
  tipo?: string;
  featured?: boolean;
  limit?: number;
}): Promise<MockMaterial[]> {
  let result = [...mockMateriales];
  
  if (filters?.categoria) {
    result = result.filter(m => m.categoria.toLowerCase() === filters.categoria?.toLowerCase());
  }
  
  if (filters?.tipo) {
    result = result.filter(m => m.tipo === filters.tipo);
  }
  
  if (filters?.featured !== undefined) {
    result = result.filter(m => m.featured === filters.featured);
  }
  
  if (filters?.limit) {
    result = result.slice(0, filters.limit);
  }
  
  return withMockDelay(result);
}

/**
 * Obtener item por slug
 */
export function getMockVideoBySlug(slug: string): MockVideo | undefined {
  return mockVideos.find(v => v.slug === slug);
}

export function getMockEventoBySlug(slug: string): MockEvento | undefined {
  return mockEventos.find(e => e.slug === slug);
}

export function getMockMaterialBySlug(slug: string): MockMaterial | undefined {
  return mockMateriales.find(m => m.slug === slug);
}

export function getMockPlanBySlug(slug: string): MockPlan | undefined {
  return mockPlanes.find(p => p.slug === slug);
}

export function getMockDemoBySlug(slug: string): MockDemo | undefined {
  return mockDemos.find(d => d.slug === slug);
}

/**
 * Obtener item por ID
 */
export function getMockVideoById(id: string): MockVideo | undefined {
  return mockVideos.find(v => v.$id === id);
}

export function getMockEventoById(id: string): MockEvento | undefined {
  return mockEventos.find(e => e.$id === id);
}

export function getMockMaterialById(id: string): MockMaterial | undefined {
  return mockMateriales.find(m => m.$id === id);
}

/**
 * Obtener categorías
 */
export async function getMockCategorias(): Promise<MockCategoria[]> {
  return withMockDelay([...mockCategorias]);
}

/**
 * Obtener planes
 */
export async function getMockPlanes(): Promise<MockPlan[]> {
  return withMockDelay([...mockPlanes]);
}

/**
 * Obtener demos
 */
export async function getMockDemos(): Promise<MockDemo[]> {
  return withMockDelay([...mockDemos]);
}

/**
 * Obtener usuarios
 */
export async function getMockUsuarios(): Promise<MockUsuario[]> {
  return withMockDelay([...mockUsuarios]);
}

/**
 * Obtener inscripciones de un usuario
 */
export async function getMockInscripcionesByUsuario(usuarioId: string): Promise<MockInscripcion[]> {
  const result = mockInscripciones.filter(i => i.usuarioId === usuarioId);
  return withMockDelay(result);
}

/**
 * Obtener progreso de videos de un usuario
 */
export async function getMockProgresoByUsuario(usuarioId: string): Promise<MockProgreso[]> {
  const result = mockProgreso.filter(p => p.usuarioId === usuarioId);
  return withMockDelay(result);
}

/**
 * Verificar si usuario está inscrito en evento
 */
export function isUsuarioInscrito(usuarioId: string, eventoId: string): boolean {
  return mockInscripciones.some(i => i.usuarioId === usuarioId && i.eventoId === eventoId && i.estado !== 'cancelada');
}

/**
 * Obtener estadísticas
 */
export async function getMockEstadisticas(): Promise<typeof mockEstadisticas> {
  return withMockDelay(mockEstadisticas);
}

export default {
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
  getMockEstadisticas
};
