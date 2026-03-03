/**
 * Función Serverless: Actualizar Progreso de Video
 * Plataforma de Capacitación y Apoyo para Socios
 * 
 * Esta función actualiza el progreso de visualización de un video.
 * Registra el tiempo visto y marca como completado si es necesario.
 * 
 * Evento: HTTP POST
 * 
 * Body esperado:
 * {
 *   "usuarioId": "string",
 *   "videoId": "string",
 *   "progreso": number (0-100),
 *   "tiempoVisto": number (segundos),
 *   "completado": boolean (opcional)
 * }
 */

const { Client, Databases, ID, Permission, Role, Query } = require('node-appwrite');

module.exports = async function (req, res) {
    const client = new Client()
        .setEndpoint(process.env.APPWRITE_ENDPOINT || 'http://localhost/v1')
        .setProject(process.env.APPWRITE_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);
    const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'plataforma_capacitacion';

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        
        // Validar datos requeridos
        if (!body.usuarioId || !body.videoId) {
            return res.json({
                success: false,
                error: 'Faltan campos requeridos: usuarioId, videoId'
            }, 400);
        }

        // Validar progreso
        if (body.progreso !== undefined && (body.progreso < 0 || body.progreso > 100)) {
            return res.json({
                success: false,
                error: 'El progreso debe estar entre 0 y 100'
            }, 400);
        }

        // Buscar registro de progreso existente
        const existingProgress = await databases.listDocuments(
            DATABASE_ID,
            'progreso_videos',
            [
                Query.equal('usuarioId', body.usuarioId),
                Query.equal('videoId', body.videoId)
            ]
        );

        const now = new Date().toISOString();
        let progresoDoc;

        if (existingProgress.documents.length > 0) {
            // Actualizar registro existente
            const existing = existingProgress.documents[0];
            const newTiempoVisto = body.tiempoVisto || existing.tiempoVisto;
            const newProgreso = body.progreso !== undefined ? body.progreso : existing.progreso;
            const completado = body.completado || newProgreso >= 90;

            progresoDoc = await databases.updateDocument(
                DATABASE_ID,
                'progreso_videos',
                existing.$id,
                {
                    progreso: newProgreso,
                    completado: completado,
                    tiempoVisto: newTiempoVisto,
                    ultimaVista: now,
                    actualizadoEn: now
                }
            );

            console.log(`Progreso actualizado: ${progresoDoc.$id} - Video: ${body.videoId} - Progreso: ${newProgreso}%`);

        } else {
            // Crear nuevo registro
            const completado = body.completado || (body.progreso >= 90);

            progresoDoc = await databases.createDocument(
                DATABASE_ID,
                'progreso_videos',
                ID.unique(),
                {
                    usuarioId: body.usuarioId,
                    videoId: body.videoId,
                    progreso: body.progreso || 0,
                    completado: completado,
                    tiempoVisto: body.tiempoVisto || 0,
                    ultimaVista: now,
                    creadoEn: now,
                    actualizadoEn: now
                },
                [
                    Permission.read(Role.user(body.usuarioId)),
                    Permission.update(Role.user(body.usuarioId))
                ]
            );

            console.log(`Nuevo progreso creado: ${progresoDoc.$id} - Video: ${body.videoId}`);
        }

        return res.json({
            success: true,
            progreso: {
                id: progresoDoc.$id,
                progreso: progresoDoc.progreso,
                completado: progresoDoc.completado,
                tiempoVisto: progresoDoc.tiempoVisto,
                ultimaVista: progresoDoc.ultimaVista
            }
        }, 200);

    } catch (error) {
        console.error('Error al actualizar progreso:', error);
        return res.json({
            success: false,
            error: error.message || 'Error interno del servidor'
        }, 500);
    }
};
