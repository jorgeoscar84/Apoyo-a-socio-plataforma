/**
 * Función Serverless: Enviar Recordatorio de Evento
 * Plataforma de Capacitación y Apoyo para Socios
 * 
 * Esta función envía recordatorios a usuarios inscritos a eventos.
 * Programar como cron job para ejecutar diariamente.
 * 
 * Evento: Cron / HTTP GET
 * 
 * Envía recordatorios para eventos que ocurren en las próximas 24 horas.
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
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        
        // 1. Buscar eventos en las próximas 24 horas
        const eventos = await databases.listDocuments(
            DATABASE_ID,
            'eventos',
            [
                Query.greaterThan('fechaHora', now.toISOString()),
                Query.lessThan('fechaHora', tomorrow.toISOString()),
                Query.equal('activo', true)
            ]
        );

        if (eventos.documents.length === 0) {
            console.log('No hay eventos en las próximas 24 horas');
            return res.json({
                success: true,
                message: 'No hay eventos próximos',
                recordatoriosEnviados: 0
            }, 200);
        }

        console.log(`Encontrados ${eventos.documents.length} eventos próximos`);

        let recordatoriosEnviados = 0;
        let errores = [];

        // 2. Para cada evento, buscar inscripciones pendientes de recordatorio
        for (const evento of eventos.documents) {
            const inscripciones = await databases.listDocuments(
                DATABASE_ID,
                'inscripciones_eventos',
                [
                    Query.equal('eventoId', evento.$id),
                    Query.equal('recordatorioEnviado', false)
                ]
            );

            console.log(`Evento "${evento.titulo}": ${inscripciones.documents.length} inscripciones pendientes`);

            // 3. Enviar recordatorio a cada inscrito
            for (const inscripcion of inscripciones.documents) {
                try {
                    // Aquí iría la lógica de envío de email
                    // Por ahora solo creamos una notificación en la base de datos
                    
                    await databases.createDocument(
                        DATABASE_ID,
                        'notificaciones',
                        require('node-appwrite').ID.unique(),
                        {
                            usuarioId: inscripcion.usuarioId,
                            titulo: `Recordatorio: ${evento.titulo}`,
                            mensaje: `El evento "${evento.titulo}" comenzará pronto. ¡No olvides asistir!`,
                            tipo: 'evento',
                            leida: false,
                            link: `/eventos/${evento.slug}`,
                            creadoEn: new Date().toISOString()
                        }
                    );

                    // Marcar recordatorio como enviado
                    await databases.updateDocument(
                        DATABASE_ID,
                        'inscripciones_eventos',
                        inscripcion.$id,
                        {
                            recordatorioEnviado: true
                        }
                    );

                    recordatoriosEnviados++;
                    console.log(`Recordatorio enviado a usuario ${inscripcion.usuarioId} para evento ${evento.titulo}`);

                } catch (error) {
                    console.error(`Error enviando recordatorio: ${error.message}`);
                    errores.push({
                        inscripcionId: inscripcion.$id,
                        error: error.message
                    });
                }
            }
        }

        return res.json({
            success: true,
            message: `Recordatorios enviados: ${recordatoriosEnviados}`,
            eventosProximos: eventos.documents.length,
            recordatoriosEnviados: recordatoriosEnviados,
            errores: errores.length > 0 ? errores : undefined
        }, 200);

    } catch (error) {
        console.error('Error al enviar recordatorios:', error);
        return res.json({
            success: false,
            error: error.message || 'Error interno del servidor'
        }, 500);
    }
};
