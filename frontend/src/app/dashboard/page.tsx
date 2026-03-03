'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import { getVideosDestacados, getEventosProximos, getNoticias, Video, Evento, Noticia } from '@/lib/appwrite/client';
import Link from 'next/link';

// Card Component
function StatCard({ title, value, icon, color }: { title: string; value: string | number; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Video Card Component
function VideoCard({ video }: { video: Video }) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Link href={`/capacitaciones/${video.slug}`} className="group">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="relative aspect-video bg-gray-100">
          {video.thumbnailUrl ? (
            <img
              src={video.thumbnailUrl}
              alt={video.titulo}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video.duracion)}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {video.titulo}
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{video.descripcion}</p>
        </div>
      </div>
    </Link>
  );
}

// Event Card Component
function EventCard({ event }: { event: Evento }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Link href={`/eventos/${event.slug}`} className="block">
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex gap-4">
          <div className="flex-shrink-0 text-center">
            <div className="bg-blue-50 rounded-lg px-3 py-2">
              <span className="text-xs text-blue-600 font-medium block uppercase">
                {formatDate(event.fechaHora).split(' ')[0]}
              </span>
              <span className="text-2xl font-bold text-blue-700">
                {formatDate(event.fechaHora).split(' ')[1]}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{event.titulo}</h3>
            <p className="text-sm text-gray-500 mt-1">
              <span className="inline-flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatTime(event.fechaHora)}
              </span>
              <span className="mx-2">•</span>
              <span className="inline-flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {event.modalidad === 'virtual' ? 'Virtual' : 'Presencial'}
              </span>
            </p>
            <div className="flex items-center mt-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                event.tipo === 'presentacion' ? 'bg-blue-100 text-blue-700' :
                event.tipo === 'demo' ? 'bg-purple-100 text-purple-700' :
                event.tipo === 'entrenamiento' ? 'bg-green-100 text-green-700' :
                event.tipo === 'qa' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {event.tipo.charAt(0).toUpperCase() + event.tipo.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// News Card Component
function NewsCard({ news }: { news: Noticia }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <Link href={`/noticias/${news.slug}`} className="block">
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        {news.imagen && (
          <div className="aspect-video rounded-lg overflow-hidden mb-3">
            <img
              src={news.imagen}
              alt={news.titulo}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <span className="text-xs text-gray-500">{formatDate(news.fechaPublicacion)}</span>
        <h3 className="font-medium text-gray-900 mt-1 line-clamp-2">{news.titulo}</h3>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [videosData, eventosData, noticiasData] = await Promise.all([
          getVideosDestacados(),
          getEventosProximos(),
          getNoticias(),
        ]);
        setVideos(videosData);
        setEventos(eventosData);
        setNoticias(noticiasData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setDataLoading(false);
      }
    }

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Sidebar>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            ¡Bienvenido, {user?.nombre}!
          </h1>
          <p className="text-gray-600 mt-1">
            Aquí tienes un resumen de tu actividad y novedades
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Videos Vistos"
            value={0}
            color="bg-blue-100"
            icon={
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            title="Eventos Inscritos"
            value={0}
            color="bg-green-100"
            icon={
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
          <StatCard
            title="Materiales Descargados"
            value={0}
            color="bg-purple-100"
            icon={
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            }
          />
          <StatCard
            title="Certificados"
            value={0}
            color="bg-yellow-100"
            icon={
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            }
          />
        </div>

        {dataLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Featured Videos */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Videos Destacados</h2>
                  <Link href="/capacitaciones" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Ver todos →
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videos.length > 0 ? (
                    videos.slice(0, 4).map((video) => (
                      <VideoCard key={video.$id} video={video} />
                    ))
                  ) : (
                    <div className="col-span-2 bg-white rounded-xl p-8 text-center border border-gray-100">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-500">No hay videos disponibles</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Upcoming Events */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Próximos Eventos</h2>
                  <Link href="/eventos" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Ver todos →
                  </Link>
                </div>
                <div className="space-y-3">
                  {eventos.length > 0 ? (
                    eventos.slice(0, 3).map((evento) => (
                      <EventCard key={evento.$id} event={evento} />
                    ))
                  ) : (
                    <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-500">No hay eventos próximos</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Progress Card */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                <h3 className="font-semibold text-lg mb-4">Tu Progreso</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Videos completados</span>
                      <span>0%</span>
                    </div>
                    <div className="bg-blue-500 rounded-full h-2">
                      <div className="bg-white rounded-full h-2" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                  <p className="text-blue-100 text-sm">
                    ¡Continúa aprendiendo para desbloquear más contenido!
                  </p>
                </div>
              </div>

              {/* News */}
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Novedades</h2>
                <div className="space-y-3">
                  {noticias.length > 0 ? (
                    noticias.slice(0, 3).map((news) => (
                      <NewsCard key={news.$id} news={news} />
                    ))
                  ) : (
                    <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
                      <p className="text-gray-500 text-sm">No hay novedades</p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
}
