/**
 * Script de Inicialización de Base de Datos para Appwrite
 * Plataforma de Capacitación y Apoyo para Socios
 * 
 * Este script crea todas las colecciones necesarias en Appwrite.
 * Ejecutar después de configurar Appwrite en el VPS.
 * 
 * Uso: node init-collections.js
 */

const { Client, Databases, ID, Permission, Role } = require('node-appwrite');

// Configuración de Appwrite - CAMBIAR ESTOS VALORES
const ENDPOINT = 'http://localhost/v1'; // URL de tu instancia Appwrite
const PROJECT_ID = 'tu_project_id'; // ID del proyecto
const API_KEY = 'tu_api_key'; // API Key con permisos de servidor

// Inicializar cliente
const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

// ID de la base de datos (crear primero en Appwrite Console)
const DATABASE_ID = 'plataforma_capacitacion';

// =============================================================================
// FUNCIONES AUXILIARES
// =============================================================================

async function createCollection(collectionId, name, attributes, indexes, permissions) {
    try {
        console.log(`Creando colección: ${name}...`);
        
        const collection = await databases.createCollection(
            DATABASE_ID,
            collectionId,
            name,
            permissions,
            false // document security
        );
        
        console.log(`✓ Colección creada: ${name} (${collectionId})`);
        
        // Crear atributos
        for (const attr of attributes) {
            try {
                if (attr.type === 'string') {
                    await databases.createStringAttribute(
                        DATABASE_ID,
                        collectionId,
                        attr.name,
                        attr.size || 255,
                        attr.required || false,
                        attr.default || undefined,
                        attr.array || false
                    );
                } else if (attr.type === 'integer') {
                    await databases.createIntegerAttribute(
                        DATABASE_ID,
                        collectionId,
                        attr.name,
                        attr.required || false,
                        attr.min || undefined,
                        attr.max || undefined,
                        attr.default || undefined,
                        attr.array || false
                    );
                } else if (attr.type === 'float') {
                    await databases.createFloatAttribute(
                        DATABASE_ID,
                        collectionId,
                        attr.name,
                        attr.required || false,
                        attr.min || undefined,
                        attr.max || undefined,
                        attr.default || undefined,
                        attr.array || false
                    );
                } else if (attr.type === 'boolean') {
                    await databases.createBooleanAttribute(
                        DATABASE_ID,
                        collectionId,
                        attr.name,
                        attr.required || false,
                        attr.default || undefined,
                        attr.array || false
                    );
                } else if (attr.type === 'datetime') {
                    await databases.createDatetimeAttribute(
                        DATABASE_ID,
                        collectionId,
                        attr.name,
                        attr.required || false,
                        attr.default || undefined,
                        attr.array || false
                    );
                }
                console.log(`  - Atributo creado: ${attr.name}`);
            } catch (error) {
                console.log(`  ✗ Error creando atributo ${attr.name}: ${error.message}`);
            }
        }
        
        // Crear índices
        for (const idx of indexes) {
            try {
                await databases.createIndex(
                    DATABASE_ID,
                    collectionId,
                    idx.name,
                    idx.type,
                    idx.attributes,
                    idx.orders || []
                );
                console.log(`  - Índice creado: ${idx.name}`);
            } catch (error) {
                console.log(`  ✗ Error creando índice ${idx.name}: ${error.message}`);
            }
        }
        
        return collection;
    } catch (error) {
        console.log(`✗ Error creando colección ${name}: ${error.message}`);
        return null;
    }
}

// =============================================================================
// DEFINICIÓN DE COLECCIONES
// =============================================================================

const collections = [
    {
        id: 'usuarios',
        name: 'Usuarios',
        attributes: [
            { name: 'nombre', type: 'string', size: 255, required: true },
            { name: 'apellido', type: 'string', size: 255, required: true },
            { name: 'email', type: 'string', size: 255, required: true },
            { name: 'telefono', type: 'string', size: 50, required: false },
            { name: 'avatar', type: 'string', size: 500, required: false },
            { name: 'rol', type: 'string', size: 50, required: true, default: 'SOCIO' },
            { name: 'activo', type: 'boolean', required: true, default: true },
            { name: 'emailVerificado', type: 'boolean', required: true, default: false },
            { name: 'ultimoAcceso', type: 'datetime', required: false },
            { name: 'creadoEn', type: 'datetime', required: true },
            { name: 'actualizadoEn', type: 'datetime', required: true }
        ],
        indexes: [
            { name: 'idx_email', type: 'unique', attributes: ['email'] },
            { name: 'idx_rol', type: 'key', attributes: ['rol'] },
            { name: 'idx_activo', type: 'key', attributes: ['activo'] }
        ]
    },
    {
        id: 'categorias',
        name: 'Categorías',
        attributes: [
            { name: 'nombre', type: 'string', size: 255, required: true },
            { name: 'slug', type: 'string', size: 255, required: true },
            { name: 'descripcion', type: 'string', size: 1000, required: false },
            { name: 'icono', type: 'string', size: 100, required: false },
            { name: 'imagen', type: 'string', size: 500, required: false },
            { name: 'orden', type: 'integer', required: true, default: 0 },
            { name: 'padreId', type: 'string', size: 255, required: false },
            { name: 'activo', type: 'boolean', required: true, default: true },
            { name: 'creadoEn', type: 'datetime', required: true },
            { name: 'actualizadoEn', type: 'datetime', required: true }
        ],
        indexes: [
            { name: 'idx_slug', type: 'unique', attributes: ['slug'] },
            { name: 'idx_padreId', type: 'key', attributes: ['padreId'] },
            { name: 'idx_activo', type: 'key', attributes: ['activo'] }
        ]
    },
    {
        id: 'videos',
        name: 'Videos de Capacitación',
        attributes: [
            { name: 'categoriaId', type: 'string', size: 255, required: true },
            { name: 'titulo', type: 'string', size: 500, required: true },
            { name: 'slug', type: 'string', size: 255, required: true },
            { name: 'descripcion', type: 'string', size: 5000, required: true },
            { name: 'videoUrl', type: 'string', size: 1000, required: true },
            { name: 'videoPlataforma', type: 'string', size: 50, required: true },
            { name: 'videoId', type: 'string', size: 255, required: true },
            { name: 'thumbnailUrl', type: 'string', size: 1000, required: false },
            { name: 'duracion', type: 'integer', required: true },
            { name: 'orden', type: 'integer', required: true, default: 0 },
            { name: 'materialApoyo', type: 'string', size: 10000, required: false },
            { name: 'destacado', type: 'boolean', required: true, default: false },
            { name: 'activo', type: 'boolean', required: true, default: true },
            { name: 'creadoEn', type: 'datetime', required: true },
            { name: 'actualizadoEn', type: 'datetime', required: true }
        ],
        indexes: [
            { name: 'idx_slug', type: 'unique', attributes: ['slug'] },
            { name: 'idx_categoriaId', type: 'key', attributes: ['categoriaId'] },
            { name: 'idx_activo', type: 'key', attributes: ['activo'] },
            { name: 'idx_destacado', type: 'key', attributes: ['destacado'] }
        ]
    },
    {
        id: 'progreso_videos',
        name: 'Progreso de Videos',
        attributes: [
            { name: 'usuarioId', type: 'string', size: 255, required: true },
            { name: 'videoId', type: 'string', size: 255, required: true },
            { name: 'progreso', type: 'integer', required: true, min: 0, max: 100, default: 0 },
            { name: 'completado', type: 'boolean', required: true, default: false },
            { name: 'tiempoVisto', type: 'integer', required: true, default: 0 },
            { name: 'ultimaVista', type: 'datetime', required: false },
            { name: 'creadoEn', type: 'datetime', required: true },
            { name: 'actualizadoEn', type: 'datetime', required: true }
        ],
        indexes: [
            { name: 'idx_usuario_video', type: 'unique', attributes: ['usuarioId', 'videoId'] },
            { name: 'idx_usuarioId', type: 'key', attributes: ['usuarioId'] },
            { name: 'idx_videoId', type: 'key', attributes: ['videoId'] },
            { name: 'idx_completado', type: 'key', attributes: ['completado'] }
        ]
    },
    {
        id: 'eventos',
        name: 'Eventos',
        attributes: [
            { name: 'titulo', type: 'string', size: 500, required: true },
            { name: 'slug', type: 'string', size: 255, required: true },
            { name: 'descripcion', type: 'string', size: 5000, required: true },
            { name: 'tipo', type: 'string', size: 50, required: true },
            { name: 'fechaHora', type: 'datetime', required: true },
            { name: 'duracion', type: 'integer', required: true },
            { name: 'modalidad', type: 'string', size: 50, required: true },
            { name: 'lugar', type: 'string', size: 500, required: false },
            { name: 'enlaceVirtual', type: 'string', size: 1000, required: false },
            { name: 'plataformaVirtual', type: 'string', size: 50, required: false },
            { name: 'capacidad', type: 'integer', required: false },
            { name: 'inscritos', type: 'integer', required: true, default: 0 },
            { name: 'imagen', type: 'string', size: 1000, required: false },
            { name: 'instructorNombre', type: 'string', size: 255, required: true },
            { name: 'instructorCargo', type: 'string', size: 255, required: false },
            { name: 'instructorFoto', type: 'string', size: 1000, required: false },
            { name: 'grabacionUrl', type: 'string', size: 1000, required: false },
            { name: 'grabacionDisponible', type: 'boolean', required: true, default: false },
            { name: 'activo', type: 'boolean', required: true, default: true },
            { name: 'creadoEn', type: 'datetime', required: true },
            { name: 'actualizadoEn', type: 'datetime', required: true }
        ],
        indexes: [
            { name: 'idx_slug', type: 'unique', attributes: ['slug'] },
            { name: 'idx_tipo', type: 'key', attributes: ['tipo'] },
            { name: 'idx_fechaHora', type: 'key', attributes: ['fechaHora'] },
            { name: 'idx_activo', type: 'key', attributes: ['activo'] }
        ]
    },
    {
        id: 'inscripciones_eventos',
        name: 'Inscripciones a Eventos',
        attributes: [
            { name: 'eventoId', type: 'string', size: 255, required: true },
            { name: 'usuarioId', type: 'string', size: 255, required: true },
            { name: 'fechaInscripcion', type: 'datetime', required: true },
            { name: 'asistio', type: 'boolean', required: true, default: false },
            { name: 'recordatorioEnviado', type: 'boolean', required: true, default: false },
            { name: 'creadoEn', type: 'datetime', required: true }
        ],
        indexes: [
            { name: 'idx_evento_usuario', type: 'unique', attributes: ['eventoId', 'usuarioId'] },
            { name: 'idx_eventoId', type: 'key', attributes: ['eventoId'] },
            { name: 'idx_usuarioId', type: 'key', attributes: ['usuarioId'] }
        ]
    },
    {
        id: 'materiales',
        name: 'Material POP',
        attributes: [
            { name: 'nombre', type: 'string', size: 500, required: true },
            { name: 'slug', type: 'string', size: 255, required: true },
            { name: 'descripcion', type: 'string', size: 5000, required: true },
            { name: 'categoria', type: 'string', size: 50, required: true },
            { name: 'tags', type: 'string', size: 5000, required: false },
            { name: 'archivos', type: 'string', size: 20000, required: true },
            { name: 'thumbnail', type: 'string', size: 1000, required: false },
            { name: 'descargas', type: 'integer', required: true, default: 0 },
            { name: 'destacado', type: 'boolean', required: true, default: false },
            { name: 'activo', type: 'boolean', required: true, default: true },
            { name: 'creadoEn', type: 'datetime', required: true },
            { name: 'actualizadoEn', type: 'datetime', required: true }
        ],
        indexes: [
            { name: 'idx_slug', type: 'unique', attributes: ['slug'] },
            { name: 'idx_categoria', type: 'key', attributes: ['categoria'] },
            { name: 'idx_destacado', type: 'key', attributes: ['destacado'] },
            { name: 'idx_activo', type: 'key', attributes: ['activo'] }
        ]
    },
    {
        id: 'descargas_materiales',
        name: 'Descargas de Materiales',
        attributes: [
            { name: 'materialId', type: 'string', size: 255, required: true },
            { name: 'usuarioId', type: 'string', size: 255, required: true },
            { name: 'archivoIndice', type: 'integer', required: true },
            { name: 'fecha', type: 'datetime', required: true }
        ],
        indexes: [
            { name: 'idx_materialId', type: 'key', attributes: ['materialId'] },
            { name: 'idx_usuarioId', type: 'key', attributes: ['usuarioId'] }
        ]
    },
    {
        id: 'favoritos_materiales',
        name: 'Favoritos de Materiales',
        attributes: [
            { name: 'materialId', type: 'string', size: 255, required: true },
            { name: 'usuarioId', type: 'string', size: 255, required: true },
            { name: 'creadoEn', type: 'datetime', required: true }
        ],
        indexes: [
            { name: 'idx_material_usuario', type: 'unique', attributes: ['materialId', 'usuarioId'] }
        ]
    },
    {
        id: 'planes',
        name: 'Planes del Software',
        attributes: [
            { name: 'nombre', type: 'string', size: 255, required: true },
            { name: 'slug', type: 'string', size: 255, required: true },
            { name: 'descripcion', type: 'string', size: 5000, required: true },
            { name: 'precio', type: 'float', required: true },
            { name: 'moneda', type: 'string', size: 10, required: true, default: 'MXN' },
            { name: 'caracteristicas', type: 'string', size: 10000, required: true },
            { name: 'destacado', type: 'boolean', required: true, default: false },
            { name: 'badge', type: 'string', size: 100, required: false },
            { name: 'color', type: 'string', size: 20, required: false },
            { name: 'imagen', type: 'string', size: 1000, required: false },
            { name: 'pdfBrochure', type: 'string', size: 1000, required: false },
            { name: 'orden', type: 'integer', required: true, default: 0 },
            { name: 'activo', type: 'boolean', required: true, default: true },
            { name: 'creadoEn', type: 'datetime', required: true },
            { name: 'actualizadoEn', type: 'datetime', required: true }
        ],
        indexes: [
            { name: 'idx_slug', type: 'unique', attributes: ['slug'] },
            { name: 'idx_activo', type: 'key', attributes: ['activo'] },
            { name: 'idx_orden', type: 'key', attributes: ['orden'] }
        ]
    },
    {
        id: 'demos',
        name: 'Demos del Producto',
        attributes: [
            { name: 'titulo', type: 'string', size: 500, required: true },
            { name: 'slug', type: 'string', size: 255, required: true },
            { name: 'descripcion', type: 'string', size: 5000, required: true },
            { name: 'tipo', type: 'string', size: 50, required: true },
            { name: 'videoUrl', type: 'string', size: 1000, required: false },
            { name: 'guionUrl', type: 'string', size: 1000, required: false },
            { name: 'checklistUrl', type: 'string', size: 1000, required: false },
            { name: 'thumbnail', type: 'string', size: 1000, required: false },
            { name: 'duracion', type: 'integer', required: false },
            { name: 'tags', type: 'string', size: 5000, required: false },
            { name: 'vistas', type: 'integer', required: true, default: 0 },
            { name: 'descargas', type: 'integer', required: true, default: 0 },
            { name: 'activo', type: 'boolean', required: true, default: true },
            { name: 'creadoEn', type: 'datetime', required: true },
            { name: 'actualizadoEn', type: 'datetime', required: true }
        ],
        indexes: [
            { name: 'idx_slug', type: 'unique', attributes: ['slug'] },
            { name: 'idx_tipo', type: 'key', attributes: ['tipo'] },
            { name: 'idx_activo', type: 'key', attributes: ['activo'] }
        ]
    },
    {
        id: 'noticias',
        name: 'Noticias',
        attributes: [
            { name: 'titulo', type: 'string', size: 500, required: true },
            { name: 'slug', type: 'string', size: 255, required: true },
            { name: 'contenido', type: 'string', size: 50000, required: true },
            { name: 'imagen', type: 'string', size: 1000, required: false },
            { name: 'destacada', type: 'boolean', required: true, default: false },
            { name: 'activa', type: 'boolean', required: true, default: true },
            { name: 'fechaPublicacion', type: 'datetime', required: true },
            { name: 'creadoEn', type: 'datetime', required: true },
            { name: 'actualizadoEn', type: 'datetime', required: true }
        ],
        indexes: [
            { name: 'idx_slug', type: 'unique', attributes: ['slug'] },
            { name: 'idx_destacada', type: 'key', attributes: ['destacada'] },
            { name: 'idx_activa', type: 'key', attributes: ['activa'] },
            { name: 'idx_fechaPublicacion', type: 'key', attributes: ['fechaPublicacion'] }
        ]
    },
    {
        id: 'notificaciones',
        name: 'Notificaciones',
        attributes: [
            { name: 'usuarioId', type: 'string', size: 255, required: true },
            { name: 'titulo', type: 'string', size: 255, required: true },
            { name: 'mensaje', type: 'string', size: 1000, required: true },
            { name: 'tipo', type: 'string', size: 50, required: true },
            { name: 'leida', type: 'boolean', required: true, default: false },
            { name: 'link', type: 'string', size: 1000, required: false },
            { name: 'creadoEn', type: 'datetime', required: true }
        ],
        indexes: [
            { name: 'idx_usuarioId', type: 'key', attributes: ['usuarioId'] },
            { name: 'idx_leida', type: 'key', attributes: ['leida'] },
            { name: 'idx_creadoEn', type: 'key', attributes: ['creadoEn'] }
        ]
    },
    {
        id: 'configuracion',
        name: 'Configuración del Sistema',
        attributes: [
            { name: 'clave', type: 'string', size: 255, required: true },
            { name: 'valor', type: 'string', size: 5000, required: true },
            { name: 'descripcion', type: 'string', size: 1000, required: false },
            { name: 'actualizadoEn', type: 'datetime', required: true }
        ],
        indexes: [
            { name: 'idx_clave', type: 'unique', attributes: ['clave'] }
        ]
    }
];

// =============================================================================
// FUNCIÓN PRINCIPAL
// =============================================================================

async function initDatabase() {
    console.log('='.repeat(60));
    console.log('INICIALIZACIÓN DE BASE DE DATOS - APPWRITE');
    console.log('Plataforma de Capacitación y Apoyo para Socios');
    console.log('='.repeat(60));
    console.log('');
    
    // Permisos por defecto (solo lectura para cualquier usuario)
    const defaultPermissions = [
        Permission.read(Role.any())
    ];
    
    // Crear cada colección
    for (const collection of collections) {
        await createCollection(
            collection.id,
            collection.name,
            collection.attributes,
            collection.indexes,
            defaultPermissions
        );
        console.log('');
    }
    
    console.log('='.repeat(60));
    console.log('INICIALIZACIÓN COMPLETADA');
    console.log('='.repeat(60));
    console.log('');
    console.log('NOTAS IMPORTANTES:');
    console.log('1. Configurar los permisos específicos en Appwrite Console');
    console.log('2. Crear los buckets de almacenamiento necesarios');
    console.log('3. Configurar las funciones serverless');
    console.log('4. Cargar datos de prueba');
    console.log('');
}

// Ejecutar
initDatabase().catch(console.error);
