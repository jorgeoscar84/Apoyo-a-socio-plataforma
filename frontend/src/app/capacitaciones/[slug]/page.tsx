/**
 * Página de Video Individual
 * Muestra el reproductor de video con información y materiales de apoyo
 */

'use client';

import { useEffect, useState, useParams, useCallback } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import VideoPlayer, { VideoPlayerSkeleton } from '@/components/video/VideoPlayer';
import { VideoCard, VideoCardSkeleton } from '@/components/video/VideoCard';
import {
  getVideoBySlug,
  getVideosRelacionados,
  getCategoriaById,
  getProgresoVideo,
  updateProgresoVideo,
  getNavegacionVideos,
  Video,
  Categoria,
  ProgresoVideo,
} from '@/lib/appwrite/client';
import {
  ChevronRight,
  ArrowLeft,
  Clock,
  Calendar,
  Download,
  FileText,
  ChevronLeft,
  CheckCircle,
  Play,
} from 'lucide-react';
import Link from 'next/link';

// Tipos
interface MaterialApoyo {
  nombre: string;
  url: string;
  tipo: string;
}

// Función para formatear duración
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes} min`;
}

// Función para formatear fecha
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Componente de Breadcrumb
function Breadcrumb({ video, categoria }: { video: Video; categoria?: Categoria | null }) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6 flex-wrap">
      <Link href="/dashboard" className="hover:text-primary transition-colors">
        Inicio
      </Link>
      <ChevronRight className="w-4 h-4 flex-shrink-0" />
      <Link href="/capacitaciones" className="hover:text-primary transition-colors">
        Capacitaciones
      </Link>
      {categoria && (
        <>
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
          <Link
            href={`/capacitaciones/categoria/${categoria.$id}`}
            className="hover:text-primary transition-colors"
          >
            {categoria.nombre}
          </Link>
        </>
      )}
      <ChevronRight className="w-4 h-4 flex-shrink-0" />
      <span className="text-gray-900 font-medium truncate max-w-[200px]">
        {video.titulo}
      </span>
    </nav>
  );
}

// Componente de Header
interface VideoHeaderProps {
  video: Video;
  categoria?: Categoria | null;
  progreso?: ProgresoVideo | null;
}

function VideoHeader({ video, categoria, progreso }: VideoHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {categoria && (
            <Link
              href={`/capacitaciones/categoria/${categoria.$id}`}
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              {categoria.nombre}
            </Link>
          )}
          <h1 className="text-2xl font-bold text-gray-900 mt-1">{video.titulo}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDuration(video.duracion)}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(video.creadoEn)}
            </span>
            {video.destacado && (
              <Badge variant="primary" size="sm">
                Destacado
              </Badge>
            )}
            {progreso?.completado && (
              <Badge variant="success" size="sm" className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Completado
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Barra de progreso */}
      {progreso && !progreso.completado && progreso.progreso > 0 && (
        <div className="mt-4 bg-gray-100 rounded-lg p-3">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Tu progreso</span>
            <span className="font-medium text-primary">{progreso.progreso}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-full rounded-full transition-all duration-300"
              style={{ width: `${progreso.progreso}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Componente de Descripción
function VideoDescription({ video }: { video: Video }) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Descripción</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 whitespace-pre-line">{video.descripcion}</p>
      </CardContent>
    </Card>
  );
}

// Componente de Materiales de Apoyo
interface MaterialesProps {
  materiales: MaterialApoyo[];
}

function Materiales({ materiales }: MaterialesProps) {
  if (!materiales || materiales.length === 0) return null;

  const getIconByType = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'ppt':
      case 'pptx':
        return '📽️';
      default:
        return '📎';
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Materiales de Apoyo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {materiales.map((material, index) => (
            <a
              key={index}
              href={material.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getIconByType(material.tipo)}</span>
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                    {material.nombre}
                  </p>
                  <p className="text-sm text-gray-500 uppercase">{material.tipo}</p>
                </div>
              </div>
              <Download className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Componente de Navegación entre videos
interface VideoNavegacionProps {
  anterior: Video | null;
  siguiente: Video | null;
}

function VideoNavegacion({ anterior, siguiente }: VideoNavegacionProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-t border-gray-100 mt-6">
      {anterior ? (
        <Link
          href={`/capacitaciones/${anterior.slug}`}
          className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <div>
            <p className="text-xs text-gray-400">Video anterior</p>
            <p className="font-medium line-clamp-1">{anterior.titulo}</p>
          </div>
        </Link>
      ) : (
        <div />
      )}
      {siguiente ? (
        <Link
          href={`/capacitaciones/${siguiente.slug}`}
          className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors group text-right"
        >
          <div>
            <p className="text-xs text-gray-400">Video siguiente</p>
            <p className="font-medium line-clamp-1">{siguiente.titulo}</p>
          </div>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}

// Componente de Videos Relacionados
interface VideosRelacionadosProps {
  videos: Video[];
  categoria: Categoria;
}

function VideosRelacionados({ videos, categoria }: VideosRelacionadosProps) {
  if (videos.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Videos Relacionados</h2>
        <Link
          href={`/capacitaciones/categoria/${categoria.$id}`}
          className="text-sm text-primary hover:text-primary/80 transition-colors"
        >
          Ver todos en {categoria.nombre}
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {videos.slice(0, 4).map((video) => (
          <VideoCard
            key={video.$id}
            video={video}
            categoria={categoria}
            showProgress={false}
            showCategory={false}
          />
        ))}
      </div>
    </div>
  );
}

// Componente de Error
function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
        <Play className="w-10 h-10 text-red-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Error al cargar el video
      </h3>
      <p className="text-gray-500 text-center max-w-md">{message}</p>
      <Link
        href="/capacitaciones"
        className="mt-4 inline-flex items-center text-primary hover:text-primary/80 transition-colors"
      >
        Ver todas las capacitaciones
      </Link>
    </div>
  );
}

// Skeleton loader para la página
function PageSkeleton() {
  return (
    <>
      <div className="mb-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
        <div className="h-8 bg-gray-200 rounded w-2/3 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/4" />
      </div>
      <VideoPlayerSkeleton />
      <div className="mt-6 space-y-4 animate-pulse">
        <div className="h-32 bg-gray-200 rounded" />
        <div className="h-48 bg-gray-200 rounded" />
      </div>
    </>
  );
}

// Página principal
export default function VideoPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { user, isLoading: authLoading } = useAuth();

  // Estados
  const [video, setVideo] = useState<Video | null>(null);
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [progreso, setProgreso] = useState<ProgresoVideo | null>(null);
  const [videosRelacionados, setVideosRelacionados] = useState<Video[]>([]);
  const [navegacion, setNavegacion] = useState<{
    anterior: Video | null;
    siguiente: Video | null;
  }>({ anterior: null, siguiente: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Parsear materiales de apoyo
  const materiales: MaterialApoyo[] = video?.materialApoyo
    ? JSON.parse(video.materialApoyo)
    : [];

  // Cargar datos
  useEffect(() => {
    async function loadData() {
      if (!user?.$id || !slug) return;

      setLoading(true);
      setError(null);

      try {
        // Cargar video por slug
        const videoData = await getVideoBySlug(slug);
        if (!videoData) {
          setError('No se encontró el video solicitado.');
          setLoading(false);
          return;
        }
        setVideo(videoData);

        // Cargar categoría, progreso, relacionados y navegación en paralelo
        const [categoriaData, progresoData, relacionadosData, navegacionData] =
          await Promise.all([
            getCategoriaById(videoData.categoriaId),
            getProgresoVideo(user.$id, videoData.$id),
            getVideosRelacionados(videoData.$id, videoData.categoriaId, 5),
            getNavegacionVideos(videoData),
          ]);

        setCategoria(categoriaData);
        setProgreso(progresoData);
        setVideosRelacionados(relacionadosData);
        setNavegacion(navegacionData);
      } catch (err) {
        console.error('Error loading video:', err);
        setError('Hubo un problema al cargar el video. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user?.$id, slug]);

  // Función para guardar progreso
  const handleProgressSave = useCallback(
    async (currentTime: number, progressPercent: number) => {
      if (!user?.$id || !video) return;

      try {
        const result = await updateProgresoVideo(user.$id, video.$id, {
          progreso: progressPercent,
          tiempoVisto: currentTime,
        });

        if (result) {
          setProgreso(result);
        }
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    },
    [user?.$id, video]
  );

  // Función para cuando termina el video
  const handleVideoEnded = useCallback(() => {
    if (!user?.$id || !video) return;

    updateProgresoVideo(user.$id, video.$id, {
      progreso: 100,
      tiempoVisto: video.duracion,
      completado: true,
    }).then((result) => {
      if (result) {
        setProgreso(result);
      }
    });
  }, [user?.$id, video]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Sidebar>
      <div className="p-6 lg:p-8">
        {/* Back button */}
        <Link
          href="/capacitaciones"
          className="inline-flex items-center text-gray-600 hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a capacitaciones
        </Link>

        {loading ? (
          <PageSkeleton />
        ) : error ? (
          <ErrorState message={error} />
        ) : video ? (
          <>
            {/* Breadcrumb */}
            <Breadcrumb video={video} categoria={categoria} />

            {/* Header */}
            <VideoHeader video={video} categoria={categoria} progreso={progreso} />

            {/* Video Player */}
            <div className="mb-6">
              <VideoPlayer
                videoId={video.videoId}
                platform={video.videoPlataforma}
                videoUrl={video.videoUrl}
                duration={video.duracion}
                title={video.titulo}
                startTime={progreso?.tiempoVisto || 0}
                onProgressSave={handleProgressSave}
                onEnded={handleVideoEnded}
                autoSaveInterval={10}
              />
            </div>

            {/* Navegación entre videos */}
            <VideoNavegacion
              anterior={navegacion.anterior}
              siguiente={navegacion.siguiente}
            />

            {/* Descripción y Materiales */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-2">
                <VideoDescription video={video} />
              </div>
              <div>
                <Materiales materiales={materiales} />
              </div>
            </div>

            {/* Videos Relacionados */}
            {categoria && videosRelacionados.length > 0 && (
              <VideosRelacionados videos={videosRelacionados} categoria={categoria} />
            )}
          </>
        ) : null}
      </div>
    </Sidebar>
  );
}
