/**
 * Función Serverless: Inscripción a Eventos
 * Plataforma de Capacitación y Apoyo para Socios
 * 
 * Esta función maneja las inscripciones a eventos.
 * Verifica capacidad disponible y crea la inscripción.
 * 
 * Evento: HTTP POST
 * 
 * Body esperado:
 * {
 *   "eventoId": "string",
 *   "usuarioId": "string"
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
        if (!body.eventoId || !body.usuarioId) {
            return res.json({
                success: false,
                error: 'Faltan campos requeridos: eventoId, usuarioId'
            }, 400);
        }

        // 1. Verificar que el evento existe y está activo
        let evento;
        try {
            evento = await databases.getDocument(DATABASE_ID, 'eventos', body.eventoId);
        } catch (error) {
            return res.json({
                success: false,
                error: 'Evento no encontrado'
            }, 404);
        }

        if (!evento.activo) {
            return res.json({
                success: false,
                error: 'El evento no está activo'
            }, 400);
        }

        // 2. Verificar si ya está inscrito
        const existingInscriptions = await databases.listDocuments(
            DATABASE_ID,
            'inscripciones_eventos',
            [
                Query.equal('eventoId', body.eventoId),
                Query.equal('usuarioId', body.usuarioId)
            ]
        );

        if (existingInscriptions.documents.length > 0) {
            return res.json({
                success: false,
                error: 'Ya estás inscrito en este evento'
            }, 400);
        }

        // 3. Verificar capacidad disponible
        if (evento.capacidad && evento.inscritos >= evento.capacidad) {
            return res.json({
                success: false,
                error: 'El evento ha alcanzado su capacidad máxima'
            }, 400);
        }

        // 4. Crear la inscripción
        const inscripcion = await databases.createDocument(
            DATABASE_ID,
            'inscripciones_eventos',
            ID.unique(),
            {
                eventoId: body.eventoId,
                usuarioId: body.usuarioId,
                fechaInscripcion: new Date().toISOString(),
                asistio: false,
                recordatorioEnviado: false,
                creadoEn: new Date().toISOString()
            },
            [
                Permission.read(Role.user(body.usuarioId)),
                Permission.update(Role.user(body.usuarioId)),
                Permission.delete(Role.user(body.usuarioId))
            ]
        );

        // 5. Actualizar contador de inscritos en el evento
        await databases.updateDocument(
            DATABASE_ID,
            'eventos',
            body.eventoId,
            {
                inscritos: evento.inscritos + 1,
                actualizadoEn: new Date().toISOString()
            }
        );

        console.log(`Inscripción creada: ${inscripcion.$id} - Usuario: ${body.usuarioId} - Evento: ${body.eventoId}`);

        return res.json({
            success: true,
            inscripcion: {
                id: inscripcion.$id,
                eventoId: inscripcion.eventoId,
                fechaInscripcion: inscripcion.fechaInscripcion
            },
            evento: {
                titulo: evento.titulo,
                fechaHora: evento.fechaHora,
                enlaceVirtual: evento.enlaceVirtual
            }
        }, 201);

    } catch (error) {
        console.error('Error al procesar inscripción:', error);
        return res.json({
            success: false,
            error: error.message || 'Error interno del servidor'
        }, 500);
    }
};
