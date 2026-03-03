/**
 * Función Serverless: Envío de Notificaciones
 * Plataforma de Capacitación y Apoyo para Socios
 * 
 * Esta función envía notificaciones a los usuarios.
 * Puede ser llamada por webhooks o programáticamente.
 * 
 * Evento: HTTP POST
 * 
 * Body esperado:
 * {
 *   "usuarioId": "string",
 *   "titulo": "string",
 *   "mensaje": "string",
 *   "tipo": "sistema" | "evento" | "material",
 *   "link": "string (opcional)"
 * }
 */

const { Client, Databases, ID, Permission, Role } = require('node-appwrite');

module.exports = async function (req, res) {
    // Inicializar cliente de Appwrite
    const client = new Client()
        .setEndpoint(process.env.APPWRITE_ENDPOINT || 'http://localhost/v1')
        .setProject(process.env.APPWRITE_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);
    const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'plataforma_capacitacion';

    try {
        // Parsear el body de la request
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        
        // Validar datos requeridos
        if (!body.usuarioId || !body.titulo || !body.mensaje || !body.tipo) {
            return res.json({
                success: false,
                error: 'Faltan campos requeridos: usuarioId, titulo, mensaje, tipo'
            }, 400);
        }

        // Validar tipo de notificación
        const tiposValidos = ['sistema', 'evento', 'material'];
        if (!tiposValidos.includes(body.tipo)) {
            return res.json({
                success: false,
                error: `Tipo inválido. Valores permitidos: ${tiposValidos.join(', ')}`
            }, 400);
        }

        // Crear la notificación
        const notification = await databases.createDocument(
            DATABASE_ID,
            'notificaciones',
            ID.unique(),
            {
                usuarioId: body.usuarioId,
                titulo: body.titulo,
                mensaje: body.mensaje,
                tipo: body.tipo,
                leida: false,
                link: body.link || null,
                creadoEn: new Date().toISOString()
            },
            [
                Permission.read(Role.user(body.usuarioId)),
                Permission.update(Role.user(body.usuarioId))
            ]
        );

        console.log(`Notificación creada: ${notification.$id} para usuario ${body.usuarioId}`);

        return res.json({
            success: true,
            notification: {
                id: notification.$id,
                titulo: notification.titulo,
                mensaje: notification.mensaje,
                tipo: notification.tipo,
                creadoEn: notification.creadoEn
            }
        }, 201);

    } catch (error) {
        console.error('Error al crear notificación:', error);
        return res.json({
            success: false,
            error: error.message || 'Error interno del servidor'
        }, 500);
    }
};
