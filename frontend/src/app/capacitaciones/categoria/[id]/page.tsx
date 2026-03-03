/**
 * Página de Categoría de Capacitaciones
 * Muestra videos filtrados por una categoría específica
 */

'use client';

import { useEffect, useState, useParams } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import { Badge } from '@/components/ui/badge';
import {
  VideoCard,
  VideoCardSkeleton,
  VideoGrid,
  VideoEmptyState,
} from '@/components/video/VideoCard';
import {
  getVideosConProgreso,
  getCategoriaById,
  Video,
  Categoria,
  ProgresoVideo,
} from '@/lib/appwrite/client';
import { ChevronRight, ArrowLeft, FolderOpen } from 'lucide-react';
import Link from 'next/link';

// Tipos
interface VideoConProgreso extends Video {
  progreso?: ProgresoVideo;
}

// Componente de Breadcrumb
function Breadcrumb({ categoria }: { categoria: Categoria | null }) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
      <Link href="/dashboard" className="hover:text-primary transition-colors">
        Inicio
      </Link>
      <ChevronRight className="w-4 h-4" />
      <Link href="/capacitaciones" className="hover:text-primary transition-colors">
        Capacitaciones
      </Link>
      <ChevronRight className="w-4 h-4" />
      <span className="text-gray-900 font-medium">
        {categoria?.nombre || 'Categoría'}
      </span>
    </nav>
  );
}

// Componente de Header de Categoría
interface CategoryHeaderProps {
  categoria: Categoria;
  totalVideos: number;
  videosCompletados: number;
}

function CategoryHeader({
  categoria,
  totalVideos,
  videosCompletados,
}: CategoryHeaderProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-start gap-4">
        {/* Icono */}
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          {categoria.icono ? (
            <span className="text-2xl">{categoria.icono}</span>
          ) : (
            <FolderOpen className="w-7 h-7 text-primary" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{categoria.nombre}</h1>
          {categoria.descripcion && (
            <p className="text-gray-600 mt-1">{categoria.descripcion}</p>
          )}
          <div className="flex items-center gap-4 mt-3">
            <Badge variant="default" size="sm">
              {totalVideos} {totalVideos === 1 ? 'video' : 'videos'}
            </Badge>
            {videosCompletados > 0 && (
              <Badge variant="success" size="sm">
                {videosCompletados} completado{videosCompletados !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Barra de progreso */}
      {totalVideos > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>Progreso de la categoría</span>
            <span className="font-medium">
              {Math.round((videosCompletados / totalVideos) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.round((videosCompletados / totalVideos) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Componente de botón volver
function BackButton() {
  return (
    <Link
      href="/capacitaciones"
      className="inline-flex items-center text-gray-600 hover:text-primary transition-colors mb-4"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Volver a todas las capacitaciones
    </Link>
  );
}

// Componente de Error
function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
        <FolderOpen className="w-10 h-10 text-red-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Error al cargar la categoría
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

// Página principal
export default function CategoriaPage() {
  const params = useParams();
  const categoriaId = params.id as string;
  const { user, isLoading: authLoading } = useAuth();

  // Estados
  const [videos, setVideos] = useState<VideoConProgreso[]>([]);
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos
  useEffect(() => {
    async function loadData() {
      if (!user?.$id || !categoriaId) return;

      setLoading(true);
      setError(null);

      try {
        // Cargar categoría
        const categoriaData = await getCategoriaById(categoriaId);
        if (!categoriaData) {
          setError('No se encontró la categoría solicitada.');
          setLoading(false);
          return;
        }
        setCategoria(categoriaData);

        // Cargar videos de la categoría
        const videosData = await getVideosConProgreso(user.$id, {
          categoriaId: categoriaId,
        });
        setVideos(videosData);
      } catch (err) {
        console.error('Error loading categoria:', err);
        setError('Hubo un problema al cargar la categoría. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user?.$id, categoriaId]);

  // Calcular estadísticas
  const videosCompletados = videos.filter((v) => v.progreso?.completado).length;

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
        <BackButton />

        {/* Breadcrumb */}
        {!loading && !error && categoria && (
          <Breadcrumb categoria={categoria} />
        )}

        {/* Loading state */}
        {loading ? (
          <>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gray-200" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            </div>
            <VideoGrid>
              {Array.from({ length: 6 }).map((_, i) => (
                <VideoCardSkeleton key={i} />
              ))}
            </VideoGrid>
          </>
        ) : error ? (
          <ErrorState message={error} />
        ) : categoria ? (
          <>
            {/* Header de categoría */}
            <CategoryHeader
              categoria={categoria}
              totalVideos={videos.length}
              videosCompletados={videosCompletados}
            />

            {/* Lista de videos */}
            {videos.length > 0 ? (
              <VideoGrid>
                {videos.map((video) => (
                  <VideoCard
                    key={video.$id}
                    video={video}
                    progreso={video.progreso}
                    categoria={categoria}
                    showProgress={true}
                    showCategory={false}
                  />
                ))}
              </VideoGrid>
            ) : (
              <VideoEmptyState categoria={categoria.nombre} />
            )}
          </>
        ) : null}
      </div>
    </Sidebar>
  );
}
