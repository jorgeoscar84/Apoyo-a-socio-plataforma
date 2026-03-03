/**
 * Componente VideoCard
 * Tarjeta de video reutilizable para mostrar información de capacitaciones
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Play, Clock, CheckCircle, Star } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Video, ProgresoVideo, Categoria } from '@/lib/appwrite/client';
import { Badge } from '@/components/ui/badge';

// Utilidad para combinar clases
const cn = (...inputs: (string | undefined | null | boolean)[]) => {
  return twMerge(clsx(inputs));
};

// Tipos
export interface VideoCardProps {
  video: Video;
  progreso?: ProgresoVideo;
  categoria?: Categoria;
  showProgress?: boolean;
  showCategory?: boolean;
  className?: string;
}

// Función para formatear duración
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Componente de barra de progreso
function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
      <div
        className="bg-primary h-full rounded-full transition-all duration-300"
        style={{ width: `${Math.min(progress, 100)}%` }}
      />
    </div>
  );
}

// Skeleton loader
export function VideoCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
      <div className="aspect-video bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}

// Componente principal
export const VideoCard = React.forwardRef<HTMLAnchorElement, VideoCardProps>(
  (
    {
      video,
      progreso,
      categoria,
      showProgress = true,
      showCategory = true,
      className,
    },
    ref
  ) => {
    const isCompletado = progreso?.completado || false;
    const progressPercent = progreso?.progreso || 0;

    return (
      <Link
        ref={ref}
        href={`/capacitaciones/${video.slug}`}
        className={cn(
          'group block bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100',
          'hover:shadow-md hover:border-gray-200 transition-all duration-200',
          className
        )}
      >
        {/* Thumbnail Container */}
        <div className="relative aspect-video bg-gray-100">
          {/* Thumbnail Image */}
          {video.thumbnailUrl ? (
            <img
              src={video.thumbnailUrl}
              alt={video.titulo}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <Play className="w-12 h-12 text-gray-400" />
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100">
              <Play className="w-6 h-6 text-primary ml-1" />
            </div>
          </div>

          {/* Duration Badge */}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDuration(video.duracion)}
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {video.destacado && (
              <Badge variant="primary" size="sm" className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                Destacado
              </Badge>
            )}
            {isCompletado && (
              <Badge variant="success" size="sm" className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Completado
              </Badge>
            )}
          </div>

          {/* Progress indicator overlay */}
          {showProgress && progressPercent > 0 && !isCompletado && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300">
              <div
                className="h-full bg-primary"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          {showCategory && categoria && (
            <span className="text-xs font-medium text-primary mb-1 block">
              {categoria.nombre}
            </span>
          )}

          {/* Title */}
          <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-2 mb-2">
            {video.titulo}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {video.descripcion}
          </p>

          {/* Progress Bar */}
          {showProgress && progressPercent > 0 && !isCompletado && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Progreso</span>
                <span>{progressPercent}%</span>
              </div>
              <ProgressBar progress={progressPercent} />
            </div>
          )}
        </div>
      </Link>
    );
  }
);

VideoCard.displayName = 'VideoCard';

// Componente de grid de videos
export interface VideoGridProps {
  children: React.ReactNode;
  className?: string;
}

export function VideoGrid({ children, className }: VideoGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
        className
      )}
    >
      {children}
    </div>
  );
}

// Componente de lista de videos vacía
export function VideoEmptyState({
  searchTerm,
  categoria,
}: {
  searchTerm?: string;
  categoria?: string;
}) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-12 px-4">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Play className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No se encontraron videos
      </h3>
      <p className="text-gray-500 text-center max-w-md">
        {searchTerm
          ? `No hay videos que coincidan con "${searchTerm}"`
          : categoria
          ? `No hay videos disponibles en la categoría "${categoria}"`
          : 'No hay videos disponibles en este momento'}
      </p>
    </div>
  );
}

export default VideoCard;
