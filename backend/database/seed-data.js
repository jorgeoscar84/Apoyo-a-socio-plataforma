/**
 * Script de Carga de Datos de Prueba
 * Plataforma de Capacitación y Apoyo para Socios
 * 
 * Este script carga datos de prueba en la base de datos de Appwrite.
 * Útil para desarrollo y testing.
 * 
 * Uso: node seed-data.js
 */

const { Client, Databases, ID, Permission, Role } = require('node-appwrite');

// Configuración de Appwrite - CAMBIAR ESTOS VALORES
const ENDPOINT = 'http://localhost/v1';
const PROJECT_ID = 'tu_project_id';
const API_KEY = 'tu_api_key';
const DATABASE_ID = 'plataforma_capacitacion';

// Inicializar cliente
const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

// =============================================================================
// DATOS DE PRUEBA
// =============================================================================

// Categorías de videos y materiales
const categoriasData = [
    {
        nombre: 'Uso de Plataforma',
        slug: 'uso-plataforma',
        descripcion: 'Aprende a utilizar todas las funcionalidades de la plataforma de software contable',
        icono: 'smartphone',
        orden: 1,
        activo: true
    },
    {
        nombre: 'Producto',
        slug: 'producto',
        descripcion: 'Conoce en detalle las características y funcionalidades del producto',
        icono: 'laptop',
        orden: 2,
        activo: true
    },
    {
        nombre: 'Capacitación Comercial',
        slug: 'capacitacion-comercial',
        descripcion: 'Desarrolla tus habilidades de venta y negociación',
        icono: 'dollar-sign',
        orden: 3,
        activo: true
    },
    {
        nombre: 'Liderazgo',
        slug: 'liderazgo',
        descripcion: 'Conviértete en un líder efectivo y motiva a tu equipo',
        icono: 'crown',
        orden: 4,
        activo: true
    },
    {
        nombre: 'Herramientas de Ventas',
        slug: 'herramientas-ventas',
        descripcion: 'Domina las herramientas y recursos para cerrar más ventas',
        icono: 'briefcase',
        orden: 5,
        activo: true
    }
];

// Videos de capacitación
const videosData = [
    // Uso de Plataforma
    {
        categoriaId: 'uso-plataforma',
        titulo: 'Introducción a la Plataforma',
        slug: 'intro-plataforma',
        descripcion: 'Conoce los conceptos básicos y la interfaz principal de la plataforma de software contable.',
        videoUrl: 'https://www.youtube.com/watch?v=example1',
        videoPlataforma: 'youtube',
        videoId: 'example1',
        thumbnailUrl: 'https://img.youtube.com/vi/example1/maxresdefault.jpg',
        duracion: 600,
        orden: 1,
        destacado: true,
        activo: true
    },
    {
        categoriaId: 'uso-plataforma',
        titulo: 'Configuración Inicial',
        slug: 'configuracion-inicial',
        descripcion: 'Aprende a configurar tu cuenta y personalizar la plataforma según tus necesidades.',
        videoUrl: 'https://www.youtube.com/watch?v=example2',
        videoPlataforma: 'youtube',
        videoId: 'example2',
        thumbnailUrl: 'https://img.youtube.com/vi/example2/maxresdefault.jpg',
        duracion: 900,
        orden: 2,
        destacado: false,
        activo: true
    },
    {
        categoriaId: 'uso-plataforma',
        titulo: 'Gestión de Usuarios',
        slug: 'gestion-usuarios',
        descripcion: 'Administra los usuarios de tu organización y asigna permisos correctamente.',
        videoUrl: 'https://www.youtube.com/watch?v=example3',
        videoPlataforma: 'youtube',
        videoId: 'example3',
        thumbnailUrl: 'https://img.youtube.com/vi/example3/maxresdefault.jpg',
        duracion: 750,
        orden: 3,
        destacado: false,
        activo: true
    },
    // Producto
    {
        categoriaId: 'producto',
        titulo: 'Características Principales',
        slug: 'caracteristicas-principales',
        descripcion: 'Descubre todas las características que hacen único a nuestro software contable.',
        videoUrl: 'https://www.youtube.com/watch?v=example4',
        videoPlataforma: 'youtube',
        videoId: 'example4',
        thumbnailUrl: 'https://img.youtube.com/vi/example4/maxresdefault.jpg',
        duracion: 1200,
        orden: 1,
        destacado: true,
        activo: true
    },
    {
        categoriaId: 'producto',
        titulo: 'Módulo de Facturación',
        slug: 'modulo-facturacion',
        descripcion: 'Aprende a crear y gestionar facturas de manera eficiente.',
        videoUrl: 'https://www.youtube.com/watch?v=example5',
        videoPlataforma: 'youtube',
        videoId: 'example5',
        thumbnailUrl: 'https://img.youtube.com/vi/example5/maxresdefault.jpg',
        duracion: 1500,
        orden: 2,
        destacado: false,
        activo: true
    },
    // Capacitación Comercial
    {
        categoriaId: 'capacitacion-comercial',
        titulo: 'Técnicas de Venta Efectivas',
        slug: 'tecnicas-venta',
        descripcion: 'Domina las técnicas de venta más efectivas para aumentar tus conversiones.',
        videoUrl: 'https://www.youtube.com/watch?v=example6',
        videoPlataforma: 'youtube',
        videoId: 'example6',
        thumbnailUrl: 'https://img.youtube.com/vi/example6/maxresdefault.jpg',
        duracion: 1800,
        orden: 1,
        destacado: true,
        activo: true
    },
    {
        categoriaId: 'capacitacion-comercial',
        titulo: 'Manejo de Objeciones',
        slug: 'manejo-objeciones',
        descripcion: 'Aprende a responder las objeciones más comunes de los clientes.',
        videoUrl: 'https://www.youtube.com/watch?v=example7',
        videoPlataforma: 'youtube',
        videoId: 'example7',
        thumbnailUrl: 'https://img.youtube.com/vi/example7/maxresdefault.jpg',
        duracion: 1350,
        orden: 2,
        destacado: false,
        activo: true
    },
    // Liderazgo
    {
        categoriaId: 'liderazgo',
        titulo: 'Liderazgo Efectivo',
        slug: 'liderazgo-efectivo',
        descripcion: 'Desarrolla tus habilidades de liderazgo para guiar a tu equipo al éxito.',
        videoUrl: 'https://www.youtube.com/watch?v=example8',
        videoPlataforma: 'youtube',
        videoId: 'example8',
        thumbnailUrl: 'https://img.youtube.com/vi/example8/maxresdefault.jpg',
        duracion: 2100,
        orden: 1,
        destacado: true,
        activo: true
    }
];

// Eventos
const eventosData = [
    {
        titulo: 'Webinar: Novedades del Software 2024',
        slug: 'webinar-novedades-2024',
        descripcion: 'Descubre las nuevas características y mejoras que llegan en la actualización 2024 del software contable.',
        tipo: 'presentacion',
        fechaHora: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días desde ahora
        duracion: 90,
        modalidad: 'virtual',
        enlaceVirtual: 'https://zoom.us/j/example',
        plataformaVirtual: 'zoom',
        capacidad: 500,
        inscritos: 125,
        instructorNombre: 'Carlos Mendoza',
        instructorCargo: 'Director de Producto',
        grabacionDisponible: false,
        activo: true
    },
    {
        titulo: 'Taller Práctico: Facturación Electrónica',
        slug: 'taller-facturacion-electronica',
        descripcion: 'Aprende paso a paso cómo configurar y utilizar el módulo de facturación electrónica.',
        tipo: 'entrenamiento',
        fechaHora: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 días desde ahora
        duracion: 120,
        modalidad: 'virtual',
        enlaceVirtual: 'https://meet.google.com/example',
        plataformaVirtual: 'meet',
        capacidad: 100,
        inscritos: 67,
        instructorNombre: 'María García',
        instructorCargo: 'Especialista en Implementación',
        grabacionDisponible: false,
        activo: true
    },
    {
        titulo: 'Sesión de Q&A: Preguntas Frecuentes',
        slug: 'qa-preguntas-frecuentes',
        descripcion: 'Sesión abierta para resolver todas tus dudas sobre el uso del software.',
        tipo: 'qa',
        fechaHora: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 días desde ahora
        duracion: 60,
        modalidad: 'virtual',
        enlaceVirtual: 'https://zoom.us/j/example2',
        plataformaVirtual: 'zoom',
        capacidad: 200,
        inscritos: 89,
        instructorNombre: 'Ana Rodríguez',
        instructorCargo: 'Soporte Técnico',
        grabacionDisponible: false,
        activo: true
    },
    {
        titulo: 'Masterclass: Estrategias de Venta',
        slug: 'masterclass-estrategias-venta',
        descripcion: 'Aprende las mejores estrategias de venta de la mano de expertos en el tema.',
        tipo: 'masterclass',
        fechaHora: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Hace 7 días (pasado)
        duracion: 150,
        modalidad: 'virtual',
        enlaceVirtual: 'https://zoom.us/j/example3',
        plataformaVirtual: 'zoom',
        capacidad: 300,
        inscritos: 280,
        instructorNombre: 'Roberto Sánchez',
        instructorCargo: 'Director Comercial',
        grabacionUrl: 'https://www.youtube.com/watch?v=recording1',
        grabacionDisponible: true,
        activo: true
    }
];

// Material POP
const materialesData = [
    {
        nombre: 'Brochure Corporativo 2024',
        slug: 'brochure-corporativo-2024',
        descripcion: 'Folleto informativo con todas las características y beneficios del software contable.',
        categoria: 'brochure',
        tags: JSON.stringify(['corporativo', 'presentación', 'ventas']),
        archivos: JSON.stringify([
            { nombre: 'Brochure_2024.pdf', formato: 'pdf', tamano: '2.5 MB', url: '/files/brochure.pdf' }
        ]),
        descargas: 156,
        destacado: true,
        activo: true
    },
    {
        nombre: 'Presentación de Ventas',
        slug: 'presentacion-ventas',
        descripcion: 'Presentación completa para reuniones de ventas con clientes potenciales.',
        categoria: 'presentacion',
        tags: JSON.stringify(['ventas', 'presentación', 'cliente']),
        archivos: JSON.stringify([
            { nombre: 'Presentacion_Ventas.pptx', formato: 'pptx', tamano: '15 MB', url: '/files/presentacion.pptx' }
        ]),
        descargas: 234,
        destacado: true,
        activo: true
    },
    {
        nombre: 'Kit de Redes Sociales',
        slug: 'kit-redes-sociales',
        descripcion: 'Pack completo de imágenes y contenido para redes sociales.',
        categoria: 'redes',
        tags: JSON.stringify(['redes sociales', 'marketing', 'contenido']),
        archivos: JSON.stringify([
            { nombre: 'Posts_Facebook.zip', formato: 'zip', tamano: '45 MB', url: '/files/facebook.zip' },
            { nombre: 'Posts_Instagram.zip', formato: 'zip', tamano: '38 MB', url: '/files/instagram.zip' },
            { nombre: 'Posts_Linkedin.zip', formato: 'zip', tamano: '22 MB', url: '/files/linkedin.zip' }
        ]),
        descargas: 89,
        destacado: false,
        activo: true
    },
    {
        nombre: 'Video Promocional',
        slug: 'video-promocional',
        descripcion: 'Video de 2 minutos presentando los beneficios del software.',
        categoria: 'video',
        tags: JSON.stringify(['promocional', 'video', 'marketing']),
        archivos: JSON.stringify([
            { nombre: 'Video_Promo.mp4', formato: 'mp4', tamano: '120 MB', url: '/files/promo.mp4' }
        ]),
        descargas: 312,
        destacado: true,
        activo: true
    },
    {
        nombre: 'Guion de Demo',
        slug: 'guion-demo',
        descripcion: 'Guion paso a paso para realizar demos efectivas del software.',
        categoria: 'guion',
        tags: JSON.stringify(['demo', 'guion', 'ventas']),
        archivos: JSON.stringify([
            { nombre: 'Guion_Demo.docx', formato: 'docx', tamano: '500 KB', url: '/files/guion.docx' }
        ]),
        descargas: 178,
        destacado: false,
        activo: true
    },
    {
        nombre: 'Casos de Éxito',
        slug: 'casos-exito',
        descripcion: 'Documentos con casos de éxito de clientes que han implementado el software.',
        categoria: 'casos',
        tags: JSON.stringify(['casos de éxito', 'testimonios', 'referencias']),
        archivos: JSON.stringify([
            { nombre: 'Casos_Exito_2024.pdf', formato: 'pdf', tamano: '5 MB', url: '/files/casos.pdf' }
        ]),
        descargas: 145,
        destacado: false,
        activo: true
    }
];

// Planes
const planesData = [
    {
        nombre: 'Plan Básico',
        slug: 'plan-basico',
        descripcion: 'Ideal para pequeños negocios que inician su gestión contable.',
        precio: 299.00,
        moneda: 'MXN',
        caracteristicas: JSON.stringify([
            'Hasta 500 facturas mensuales',
            '1 usuario',
            'Reportes básicos',
            'Soporte por email',
            'Actualizaciones incluidas'
        ]),
        destacado: false,
        badge: null,
        color: '#6B7280',
        orden: 1,
        activo: true
    },
    {
        nombre: 'Plan Profesional',
        slug: 'plan-profesional',
        descripcion: 'Perfecto para empresas en crecimiento que necesitan más funcionalidades.',
        precio: 599.00,
        moneda: 'MXN',
        caracteristicas: JSON.stringify([
            'Hasta 2,000 facturas mensuales',
            'Hasta 5 usuarios',
            'Reportes avanzados',
            'Soporte prioritario',
            'Multi-sucursal',
            'Integración bancaria',
            'Facturación electrónica'
        ]),
        destacado: true,
        badge: 'Popular',
        color: '#3B82F6',
        orden: 2,
        activo: true
    },
    {
        nombre: 'Plan Empresarial',
        slug: 'plan-empresarial',
        descripcion: 'Solución completa para empresas con necesidades avanzadas.',
        precio: 1299.00,
        moneda: 'MXN',
        caracteristicas: JSON.stringify([
            'Facturas ilimitadas',
            'Usuarios ilimitados',
            'Reportes personalizados',
            'Soporte 24/7',
            'Multi-empresa',
            'API de integración',
            'Auditoría y seguridad',
            'Consultoría incluida'
        ]),
        destacado: false,
        badge: 'Mejor Valor',
        color: '#8B5CF6',
        orden: 3,
        activo: true
    }
];

// Demos
const demosData = [
    {
        titulo: 'Demo General del Software',
        slug: 'demo-general',
        descripcion: 'Recorrido completo por las funcionalidades principales del software contable.',
        tipo: 'grabada',
        videoUrl: 'https://www.youtube.com/watch?v=demo1',
        guionUrl: null,
        checklistUrl: '/files/checklist_demo_general.pdf',
        thumbnail: 'https://img.youtube.com/vi/demo1/maxresdefault.jpg',
        duracion: 45,
        tags: JSON.stringify(['general', 'introducción', 'funcionalidades']),
        vistas: 1250,
        descargas: 89,
        activo: true
    },
    {
        titulo: 'Demo de Facturación',
        slug: 'demo-facturacion',
        descripcion: 'Demostración detallada del módulo de facturación electrónica.',
        tipo: 'grabada',
        videoUrl: 'https://www.youtube.com/watch?v=demo2',
        guionUrl: null,
        checklistUrl: '/files/checklist_demo_facturacion.pdf',
        thumbnail: 'https://img.youtube.com/vi/demo2/maxresdefault.jpg',
        duracion: 30,
        tags: JSON.stringify(['facturación', 'electrónico', 'SAT']),
        vistas: 890,
        descargas: 156,
        activo: true
    },
    {
        titulo: 'Guion de Demo para Ventas',
        slug: 'guion-demo-ventas',
        descripcion: 'Guion completo paso a paso para realizar demos efectivas con clientes.',
        tipo: 'guion',
        videoUrl: null,
        guionUrl: '/files/guion_demo_ventas.pdf',
        checklistUrl: '/files/checklist_ventas.pdf',
        thumbnail: '/images/guion-thumb.png',
        duracion: null,
        tags: JSON.stringify(['ventas', 'guion', 'demo']),
        vistas: 567,
        descargas: 234,
        activo: true
    }
];

// Noticias
const noticiasData = [
    {
        titulo: 'Nueva Actualización: Versión 2024.2',
        slug: 'nueva-actualizacion-2024-2',
        contenido: `Estamos emocionados de anunciar la liberación de la versión 2024.2 de nuestro software contable. Esta actualización incluye importantes mejoras y nuevas funcionalidades:

**Nuevas Funcionalidades:**
- Módulo de reportes personalizados
- Integración con nuevos bancos
- Mejoras en la facturación electrónica
- Nueva interfaz de usuario

**Correcciones:**
- Solución de errores en conciliación bancaria
- Mejoras en rendimiento general
- Correcciones de seguridad

La actualización se aplicará automáticamente en los próximos días. Si tienes alguna pregunta, no dudes en contactar a nuestro equipo de soporte.`,
        imagen: '/images/update-2024.jpg',
        destacada: true,
        activa: true,
        fechaPublicacion: new Date().toISOString()
    },
    {
        titulo: 'Webinar: Tendencias en Contabilidad 2024',
        slug: 'webinar-tendencias-2024',
        contenido: `Te invitamos a nuestro próximo webinar donde hablaremos sobre las principales tendencias en contabilidad para el año 2024.

**Temas a tratar:**
- Automatización de procesos contables
- Inteligencia artificial en la contabilidad
- Cumplimiento fiscal digital
- Mejores prácticas de seguridad

**Fecha:** 15 de Marzo, 2024
**Hora:** 10:00 AM (Hora de Ciudad de México)
**Duración:** 90 minutos

Inscríbete ahora en la sección de eventos.`,
        imagen: '/images/webinar-2024.jpg',
        destacada: false,
        activa: true,
        fechaPublicacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        titulo: 'Tips: Mejora tu Productividad con Estos Atajos',
        slug: 'tips-atajos-productividad',
        contenido: `Conoce los atajos de teclado más útiles para aumentar tu productividad en el software:

**Atajos Generales:**
- Ctrl + N: Nuevo documento
- Ctrl + G: Guardar
- Ctrl + B: Buscar
- Ctrl + P: Imprimir

**Atajos de Navegación:**
- Alt + 1: Ir al Dashboard
- Alt + 2: Ir a Facturas
- Alt + 3: Ir a Reportes

Guarda esta lista para tenerla siempre a mano.`,
        imagen: '/images/shortcuts.jpg',
        destacada: false,
        activa: true,
        fechaPublicacion: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }
];

// =============================================================================
// FUNCIONES DE CARGA
// =============================================================================

async function createDocument(collectionId, data) {
    try {
        const now = new Date().toISOString();
        const documentData = {
            ...data,
            creadoEn: now,
            actualizadoEn: now
        };
        
        const doc = await databases.createDocument(
            DATABASE_ID,
            collectionId,
            ID.unique(),
            documentData,
            [
                Permission.read(Role.any()),
                Permission.update(Role.any()),
                Permission.delete(Role.any())
            ]
        );
        return doc;
    } catch (error) {
        console.error(`Error creando documento en ${collectionId}:`, error.message);
        return null;
    }
}

async function seedCategorias() {
    console.log('\n📁 Creando categorías...');
    let count = 0;
    
    // Primero crear todas las categorías
    const categoriaIds = {};
    for (const data of categoriasData) {
        const doc = await createDocument('categorias', data);
        if (doc) {
            categoriaIds[data.slug] = doc.$id;
            count++;
            console.log(`   ✓ ${data.nombre}`);
        }
    }
    
    console.log(`   Total: ${count}/${categoriasData.length} categorías creadas`);
    return categoriaIds;
}

async function seedVideos(categoriaIds) {
    console.log('\n🎬 Creando videos...');
    let count = 0;
    
    for (const data of videosData) {
        // Buscar el ID de la categoría por slug
        const categoriaSlug = data.categoriaId;
        const categoriaRealId = categoriaIds[categoriaSlug];
        
        if (!categoriaRealId) {
            console.log(`   ✗ Categoría no encontrada: ${categoriaSlug}`);
            continue;
        }
        
        const videoData = {
            ...data,
            categoriaId: categoriaRealId
        };
        
        const doc = await createDocument('videos', videoData);
        if (doc) {
            count++;
            console.log(`   ✓ ${data.titulo}`);
        }
    }
    
    console.log(`   Total: ${count}/${videosData.length} videos creados`);
}

async function seedEventos() {
    console.log('\n📅 Creando eventos...');
    let count = 0;
    
    for (const data of eventosData) {
        const doc = await createDocument('eventos', data);
        if (doc) {
            count++;
            console.log(`   ✓ ${data.titulo}`);
        }
    }
    
    console.log(`   Total: ${count}/${eventosData.length} eventos creados`);
}

async function seedMateriales() {
    console.log('\n📦 Creando materiales POP...');
    let count = 0;
    
    for (const data of materialesData) {
        const doc = await createDocument('materiales', data);
        if (doc) {
            count++;
            console.log(`   ✓ ${data.nombre}`);
        }
    }
    
    console.log(`   Total: ${count}/${materialesData.length} materiales creados`);
}

async function seedPlanes() {
    console.log('\n📊 Creando planes...');
    let count = 0;
    
    for (const data of planesData) {
        const doc = await createDocument('planes', data);
        if (doc) {
            count++;
            console.log(`   ✓ ${data.nombre}`);
        }
    }
    
    console.log(`   Total: ${count}/${planesData.length} planes creados`);
}

async function seedDemos() {
    console.log('\n🎥 Creando demos...');
    let count = 0;
    
    for (const data of demosData) {
        const doc = await createDocument('demos', data);
        if (doc) {
            count++;
            console.log(`   ✓ ${data.titulo}`);
        }
    }
    
    console.log(`   Total: ${count}/${demosData.length} demos creados`);
}

async function seedNoticias() {
    console.log('\n📰 Creando noticias...');
    let count = 0;
    
    for (const data of noticiasData) {
        const doc = await createDocument('noticias', data);
        if (doc) {
            count++;
            console.log(`   ✓ ${data.titulo}`);
        }
    }
    
    console.log(`   Total: ${count}/${noticiasData.length} noticias creadas`);
}

async function seedConfiguracion() {
    console.log('\n⚙️ Creando configuración...');
    
    const configData = [
        { clave: 'site_name', valor: 'Plataforma de Capacitación', descripcion: 'Nombre del sitio' },
        { clave: 'contact_email', valor: 'soporte@tudominio.com', descripcion: 'Email de contacto' },
        { clave: 'maintenance_mode', valor: 'false', descripcion: 'Modo de mantenimiento' },
        { clave: 'max_upload_size', valor: '52428800', descripcion: 'Tamaño máximo de carga en bytes (50MB)' },
        { clave: 'default_language', valor: 'es', descripcion: 'Idioma por defecto' }
    ];
    
    let count = 0;
    for (const data of configData) {
        const doc = await createDocument('configuracion', {
            ...data,
            actualizadoEn: new Date().toISOString()
        });
        if (doc) {
            count++;
            console.log(`   ✓ ${data.clave}`);
        }
    }
    
    console.log(`   Total: ${count}/${configData.length} configuraciones creadas`);
}

// =============================================================================
// FUNCIÓN PRINCIPAL
// =============================================================================

async function seedDatabase() {
    console.log('='.repeat(60));
    console.log('CARGA DE DATOS DE PRUEBA');
    console.log('Plataforma de Capacitación y Apoyo para Socios');
    console.log('='.repeat(60));
    console.log('\n⚠️  ADVERTENCIA: Este script creará datos de prueba');
    console.log('   Asegúrate de que la base de datos esté vacía o no te importe duplicar datos\n');
    
    try {
        // Crear categorías primero (necesarias para los videos)
        const categoriaIds = await seedCategorias();
        
        // Crear el resto de datos
        await seedVideos(categoriaIds);
        await seedEventos();
        await seedMateriales();
        await seedPlanes();
        await seedDemos();
        await seedNoticias();
        await seedConfiguracion();
        
        console.log('\n' + '='.repeat(60));
        console.log('✅ CARGA DE DATOS COMPLETADA');
        console.log('='.repeat(60));
        console.log('\n📊 Resumen:');
        console.log(`   - ${categoriasData.length} categorías`);
        console.log(`   - ${videosData.length} videos`);
        console.log(`   - ${eventosData.length} eventos`);
        console.log(`   - ${materialesData.length} materiales POP`);
        console.log(`   - ${planesData.length} planes`);
        console.log(`   - ${demosData.length} demos`);
        console.log(`   - ${noticiasData.length} noticias`);
        console.log('\n💡 Próximos pasos:');
        console.log('   1. Verificar los datos en Appwrite Console');
        console.log('   2. Crear usuarios de prueba');
        console.log('   3. Probar la aplicación frontend\n');
        
    } catch (error) {
        console.error('\n❌ Error durante la carga de datos:', error.message);
        process.exit(1);
    }
}

// Ejecutar
seedDatabase().catch(console.error);
