/**
 * Componente EventCard
 * Tarjeta de evento reutilizable para mostrar información de eventos
 */

'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Users,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardImage, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Evento } from '@/lib/appwrite/client';

// Utilidad para combinar clases
const cn = (...inputs: (string | undefined | null | boolean)[]) => {
  return twMerge(clsx(inputs));
};

// Tipos de evento con colores
const TIPO_EVENTO_CONFIG: Record<string, { label: string; color: string }> = {
  presentacion: { label: 'Presentación', color: 'bg-blue-100 text-blue-700' },
  demo: { label: 'Demo', color: 'bg-purple-100 text-purple-700' },
  entrenamiento: { label: 'Entrenamiento', color: 'bg-green-100 text-green-700' },
  qa: { label: 'Q&A', color: 'bg-orange-100 text-orange-700' },
  masterclass: { label: 'Masterclass', color: 'bg-pink-100 text-pink-700' }
};

// Modalidades con colores
const MODALIDAD_CONFIG: Record<string, { label: string; color: string; icon: typeof Video }> = {
  virtual: { label: 'Virtual', color: 'bg-cyan-100 text-cyan-700', icon: Video },
  presencial: { label: 'Presencial', color: 'bg-amber-100 text-amber-700', icon: MapPin }
};

// Props del componente
export interface EventCardProps {
  evento: Evento;
  inscrito?: boolean;
  mostrarEstado?: boolean;
  className?: string;
}

/**
 * Formatea fecha del evento
 */
function formatearFecha(fechaHora: string): string {
  const fecha = new Date(fechaHora);
  return fecha.toLocaleDateString('es-EC', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Formatea hora del evento
 */
function formatearHora(fechaHora: string, duracion: number): string {
  const fecha = new Date(fechaHora);
  const horaInicio = fecha.toLocaleTimeString('es-EC', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Calcular hora de fin
  const fechaFin = new Date(fecha.getTime() + duracion * 60000);
  const horaFin = fechaFin.toLocaleTimeString('es-EC', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return `${horaInicio} - ${horaFin}`;
}

/**
 * Verifica si un evento ya pasó
 */
function esEventoPasado(evento: Evento): boolean {
  return new Date(evento.fechaHora) < new Date();
}

/**
 * Verifica si hay cupos disponibles
 */
function tieneCupos(evento: Evento): boolean {
  if (!evento.capacidad) return true;
  return evento.inscritos < evento.capacidad;
}

/**
 * Componente Skeleton para estado de carga
 */
export function EventCardSkeleton(): JSX.Element {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="aspect-video bg-gray-200" />
      <CardContent className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-20 bg-gray-200 rounded" />
          <div className="h-5 w-20 bg-gray-200 rounded" />
        </div>
        <div className="h-5 w-3/4 bg-gray-200 rounded" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-1/2 bg-gray-200 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Componente principal EventCard
 */
export function EventCard({
  evento,
  inscrito = false,
  mostrarEstado = true,
  className
}: EventCardProps): JSX.Element {
  const tipoConfig = TIPO_EVENTO_CONFIG[evento.tipo] || TIPO_EVENTO_CONFIG.presentacion;
  const modalidadConfig = MODALIDAD_CONFIG[evento.modalidad] || MODALIDAD_CONFIG.virtual;
  const ModalidadIcon = modalidadConfig.icon;
  
  const esPasado = esEventoPasado(evento);
  const hayCupos = tieneCupos(evento);
  const cuposAgotados = !hayCupos && !esPasado;
  
  // Imagen por defecto si no tiene
  const imagenEvento = evento.imagen || '/images/evento-placeholder.jpg';

  return (
    <Link href={`/eventos/${evento.slug}`}>
      <Card
        className={cn(
          'overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer group',
          className
        )}
      >
        {/* Imagen del evento */}
        <div className="relative aspect-video bg-gray-100 overflow-hidden">
          <Image
            src={imagenEvento}
            alt={evento.titulo}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Overlay con badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {/* Badge de tipo */}
            <Badge className={cn('text-xs font-medium', tipoConfig.color)}>
              {tipoConfig.label}
            </Badge>
            
            {/* Badge de modalidad */}
            <Badge className={cn('text-xs font-medium flex items-center gap-1', modalidadConfig.color)}>
              <ModalidadIcon className="w-3 h-3" />
              {modalidadConfig.label}
            </Badge>
          </div>
          
          {/* Badge de cupos agotados */}
          {cuposAgotados && (
            <div className="absolute top-3 right-3">
              <Badge variant="destructive" className="text-xs font-medium">
                <AlertCircle className="w-3 h-3 mr-1" />
                Agotado
              </Badge>
            </div>
          )}
          
          {/* Badge de inscrito */}
          {inscrito && (
            <div className="absolute bottom-3 right-3">
              <Badge className="bg-green-500 text-white text-xs font-medium">
                <CheckCircle className="w-3 h-3 mr-1" />
                Inscrito
              </Badge>
            </div>
          )}
          
          {/* Badge de evento pasado con grabación */}
          {esPasado && evento.grabacionDisponible && (
            <div className="absolute bottom-3 right-3">
              <Badge className="bg-gray-800 text-white text-xs font-medium">
                <Video className="w-3 h-3 mr-1" />
                Grabación disponible
              </Badge>
            </div>
          )}
        </div>
        
        {/* Contenido */}
        <CardContent className="p-4">
          {/* Título */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
            {evento.titulo}
          </h3>
          
          {/* Descripción corta */}
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {evento.descripcion}
          </p>
          
          {/* Información del evento */}
          <div className="space-y-2 text-sm text-gray-600">
            {/* Fecha */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>{formatearFecha(evento.fechaHora)}</span>
            </div>
            
            {/* Hora */}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>{formatearHora(evento.fechaHora, evento.duracion)}</span>
            </div>
            
            {/* Ubicación/Plataforma */}
            <div className="flex items-center gap-2">
              {evento.modalidad === 'virtual' ? (
                <>
                  <Video className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="capitalize">{evento.plataformaVirtual || 'En línea'}</span>
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="line-clamp-1">{evento.lugar || 'Por confirmar'}</span>
                </>
              )}
            </div>
            
            {/* Cupos disponibles (solo si hay capacidad definida) */}
            {evento.capacidad && !esPasado && mostrarEstado && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className={cn(
                  'font-medium',
                  cuposAgotados ? 'text-red-600' : 'text-gray-600'
                )}>
                  {cuposAgotados 
                    ? 'Sin cupos' 
                    : `${evento.capacidad - evento.inscritos} cupos disponibles`
                  }
                </span>
              </div>
            )}
          </div>
          
          {/* Instructor */}
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
            {evento.instructorFoto ? (
              <Image
                src={evento.instructorFoto}
                alt={evento.instructorNombre}
                width={28}
                height={28}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-500">
                  {evento.instructorNombre.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className="text-sm text-gray-600 truncate">
              {evento.instructorNombre}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default EventCard;
