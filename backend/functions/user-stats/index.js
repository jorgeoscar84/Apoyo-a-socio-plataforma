/**
 * Función Serverless: Obtener Estadísticas del Usuario
 * Plataforma de Capacitación y Apoyo para Socios
 * 
 * Esta función obtiene las estadísticas completas de un usuario:
 * - Progreso en videos
 * - Eventos inscritos
 * - Materiales descargados
 * - Favoritos
 * 
 * Evento: HTTP GET
 * Query params: ?usuarioId=xxx
 */

const { Client, Databases, Query } = require('node-appwrite');

module.exports = async function (req, res) {
    const client = new Client()
        .setEndpoint(process.env.APPWRITE_ENDPOINT || 'http://localhost/v1')
        .setProject(process.env.APPWRITE_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);
    const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'plataforma_capacitacion';

    try {
        // Obtener usuarioId de query params
        const usuarioId = req.query?.usuarioId || req.variables?.usuarioId;
        
        if (!usuarioId) {
            return res.json({
                success: false,
                error: 'Parámetro requerido: usuarioId'
            }, 400);
        }

        // 1. Obtener progreso de videos
        const progresoVideos = await databases.listDocuments(
            DATABASE_ID,
            'progreso_videos',
            [
                Query.equal('usuarioId', usuarioId),
                Query.limit(100)
            ]
        );

        const videosCompletados = progresoVideos.documents.filter(p => p.completado).length;
        const videosEnProgreso = progresoVideos.documents.filter(p => !p.completado && p.progreso > 0).length;
        const tiempoTotalVisto = progresoVideos.documents.reduce((acc, p) => acc + (p.tiempoVisto || 0), 0);

        // 2. Obtener inscripciones a eventos
        const inscripciones = await databases.listDocuments(
            DATABASE_ID,
            'inscripciones_eventos',
            [
                Query.equal('usuarioId', usuarioId),
                Query.limit(100)
            ]
        );

        const eventosInscritos = inscripciones.documents.length;
        const eventosAsistidos = inscripciones.documents.filter(i => i.asistio).length;

        // 3. Obtener descargas de materiales
        const descargas = await databases.listDocuments(
            DATABASE_ID,
            'descargas_materiales',
            [
                Query.equal('usuarioId', usuarioId),
                Query.limit(100)
            ]
        );

        const materialesDescargados = descargas.documents.length;

        // 4. Obtener favoritos
        const favoritos = await databases.listDocuments(
            DATABASE_ID,
            'favoritos_materiales',
            [
                Query.equal('usuarioId', usuarioId),
                Query.limit(100)
            ]
        );

        const materialesFavoritos = favoritos.documents.length;

        // 5. Obtener notificaciones no leídas
        const notificaciones = await databases.listDocuments(
            DATABASE_ID,
            'notificaciones',
            [
                Query.equal('usuarioId', usuarioId),
                Query.equal('leida', false),
                Query.limit(100)
            ]
        );

        const notificacionesNoLeidas = notificaciones.documents.length;

        // 6. Calcular próximos eventos
        const now = new Date().toISOString();
        const proximosEventos = [];

        for (const inscripcion of inscripciones.documents) {
            try {
                const evento = await databases.getDocument(
                    DATABASE_ID,
                    'eventos',
                    inscripcion.eventoId
                );
                
                if (evento.fechaHora > now && evento.activo) {
                    proximosEventos.push({
                        id: evento.$id,
                        titulo: evento.titulo,
                        fechaHora: evento.fechaHora,
                        modalidad: evento.modalidad
                    });
                }
            } catch (e) {
                // Evento no encontrado, ignorar
            }
        }

        // Ordenar por fecha
        proximosEventos.sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora));

        // 7. Calcular nivel de actividad
        let nivelActividad = 'bajo';
        const actividadScore = videosCompletados + eventosAsistidos + materialesDescargados;
        
        if (actividadScore > 20) {
            nivelActividad = 'experto';
        } else if (actividadScore > 10) {
            nivelActividad = 'avanzado';
        } else if (actividadScore > 5) {
            nivelActividad = 'intermedio';
        }

        // 8. Construir respuesta
        const stats = {
            usuario: {
                id: usuarioId
            },
            capacitacion: {
                videosCompletados,
                videosEnProgreso,
                videosTotal: progresoVideos.documents.length,
                tiempoTotalVisto,
                tiempoFormateado: formatearTiempo(tiempoTotalVisto),
                progresoPromedio: progresoVideos.documents.length > 0 
                    ? Math.round(progresoVideos.documents.reduce((acc, p) => acc + p.progreso, 0) / progresoVideos.documents.length)
                    : 0
            },
            eventos: {
                inscritos: eventosInscritos,
                asistidos: eventosAsistidos,
                proximos: proximosEventos.slice(0, 3)
            },
            materiales: {
                descargados: materialesDescargados,
                favoritos: materialesFavoritos
            },
            notificaciones: {
                noLeidas: notificacionesNoLeidas
            },
            actividad: {
                nivel: nivelActividad,
                score: actividadScore
            }
        };

        return res.json({
            success: true,
            stats
        }, 200);

    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        return res.json({
            success: false,
            error: error.message || 'Error interno del servidor'
        }, 500);
    }
};

// Función auxiliar para formatear tiempo
function formatearTiempo(segundos) {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    
    if (horas > 0) {
        return `${horas}h ${minutos}min`;
    }
    return `${minutos} minutos`;
}
