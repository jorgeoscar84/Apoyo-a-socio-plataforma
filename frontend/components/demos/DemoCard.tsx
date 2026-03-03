'use client';

/**
 * DemoCard - Componente de tarjeta para Demos
 * 
 * Muestra información de una demo con:
 * - Thumbnail de video
 * - Badge de tipo (grabada, guion)
 * - Título, duración, categoría
 * - Indicador de "Nuevo"
 */

import { useState } from 'react';
import Link from 'next/link';
import { 
  Play, 
  Clock, 
  Eye, 
  Download, 
  FileText, 
  Video, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Demo, esDemoNuevo, formatearDuracionDemo } from '@/lib/appwrite/client';

// =============================================================================
// TIPOS
// =============================================================================

interface DemoCardProps {
  demo: Demo;
  onVerDemo?: (demoId: string) => void;
  className?: string;
}

// =============================================================================
// CONFIGURACIÓN DE TIPOS DE DEMO
// =============================================================================

const tipoDemoConfig = {
  grabada: { 
    label: 'Demo Grabada', 
    icon: Video, 
    color: 'bg-purple-100 text-purple-700 border-purple-200' 
  },
  guion: { 
    label: 'Guion de Venta', 
    icon: FileText, 
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200' 
  },
};

// =============================================================================
// COMPONENTE
// =============================================================================

export default function DemoCard({
  demo,
  onVerDemo,
  className = ''
}: DemoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const tipoInfo = tipoDemoConfig[demo.tipo] || tipoDemoConfig.grabada;
  const TipoIcon = tipoInfo.icon;
  const esNuevo = esDemoNuevo(demo);
  const duracion = formatearDuracionDemo(demo.duracion);

  return (
    <Link href={`/demos/${demo.slug}`}>
      <Card 
        className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gray-100 overflow-hidden">
          {demo.thumbnail ? (
            <img
              src={demo.thumbnail}
              alt={demo.titulo}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200">
              <TipoIcon className="w-16 h-16 text-purple-400" />
            </div>
          )}

          {/* Overlay con botón de play */}
          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-purple-600 ml-1" />
            </div>
          </div>

          {/* Badge de tipo */}
          <div className="absolute top-3 left-3">
            <Badge variant="outline" className={tipoInfo.color}>
              <TipoIcon className="w-3 h-3 mr-1" />
              {tipoInfo.label}
            </Badge>
          </div>

          {/* Badge de nuevo */}
          {esNuevo && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-green-500 text-white hover:bg-green-600">
                <Sparkles className="w-3 h-3 mr-1" />
                Nuevo
              </Badge>
            </div>
          )}

          {/* Duración */}
          {duracion && (
            <div className="absolute bottom-3 right-3">
              <div className="bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {duracion}
              </div>
            </div>
          )}
        </div>

        {/* Contenido */}
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors">
            {demo.titulo}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mt-1">
            {demo.descripcion}
          </p>

          {/* Estadísticas */}
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {demo.vistas || 0} vistas
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              {demo.descargas || 0} descargas
            </span>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="p-4 pt-0">
          <Button
            variant="default"
            size="sm"
            className="w-full bg-purple-600 hover:bg-purple-700"
            onClick={(e) => {
              e.preventDefault();
              onVerDemo?.(demo.$id);
            }}
          >
            {demo.tipo === 'grabada' ? (
              <>
                <Play className="w-4 h-4 mr-2" />
                Ver demo
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Ver guion
              </>
            )}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}

// =============================================================================
// VARIANTE: DEMO CARD SIMPLE
// =============================================================================

export function DemoCardSimple({
  demo,
  className = ''
}: {
  demo: Demo;
  className?: string;
}) {
  const tipoInfo = tipoDemoConfig[demo.tipo] || tipoDemoConfig.grabada;
  const TipoIcon = tipoInfo.icon;
  const esNuevo = esDemoNuevo(demo);

  return (
    <Link href={`/demos/${demo.slug}`}>
      <div className={`flex items-center gap-4 p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors ${className}`}>
        {/* Miniatura */}
        <div className="relative w-24 h-16 flex-shrink-0 rounded overflow-hidden">
          {demo.thumbnail ? (
            <img
              src={demo.thumbnail}
              alt={demo.titulo}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${tipoInfo.color}`}>
              <TipoIcon className="w-6 h-6" />
            </div>
          )}
          
          {/* Indicador de play */}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <Play className="w-6 h-6 text-white" />
          </div>

          {/* Badge nuevo */}
          {esNuevo && (
            <div className="absolute top-1 right-1">
              <span className="w-2 h-2 bg-green-500 rounded-full block" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{demo.titulo}</h4>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">{tipoInfo.label}</Badge>
            {demo.duracion && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatearDuracionDemo(demo.duracion)}
              </span>
            )}
          </div>
        </div>

        {/* Vistas */}
        <div className="text-xs text-gray-400 flex items-center gap-1">
          <Eye className="w-3 h-3" />
          {demo.vistas || 0}
        </div>
      </div>
    </Link>
  );
}

// =============================================================================
// VARIANTE: DEMO CARD COMPACTA
// =============================================================================

export function DemoCardCompact({
  demo,
  onVerDemo,
  className = ''
}: {
  demo: Demo;
  onVerDemo?: (demoId: string) => void;
  className?: string;
}) {
  const tipoInfo = tipoDemoConfig[demo.tipo] || tipoDemoConfig.grabada;
  const TipoIcon = tipoInfo.icon;
  const esNuevo = esDemoNuevo(demo);

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors ${className}`}>
      <Link href={`/demos/${demo.slug}`} className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${tipoInfo.color}`}>
          <TipoIcon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium text-gray-900 truncate">{demo.titulo}</h4>
            {esNuevo && (
              <Badge className="bg-green-500 text-white text-xs py-0">Nuevo</Badge>
            )}
          </div>
          <p className="text-xs text-gray-500">{tipoInfo.label}</p>
        </div>
      </Link>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onVerDemo?.(demo.$id)}
      >
        <Play className="w-4 h-4" />
      </Button>
    </div>
  );
}

// =============================================================================
// VARIANTE: DEMO CARD HORIZONTAL (para destacar)
// =============================================================================

export function DemoCardHorizontal({
  demo,
  onVerDemo,
  className = ''
}: {
  demo: Demo;
  onVerDemo?: (demoId: string) => void;
  className?: string;
}) {
  const tipoInfo = tipoDemoConfig[demo.tipo] || tipoDemoConfig.grabada;
  const TipoIcon = tipoInfo.icon;
  const esNuevo = esDemoNuevo(demo);
  const duracion = formatearDuracionDemo(demo.duracion);

  return (
    <div className={`flex flex-col md:flex-row gap-6 p-6 rounded-xl border bg-white hover:shadow-lg transition-all ${className}`}>
      {/* Thumbnail */}
      <Link href={`/demos/${demo.slug}`} className="relative md:w-80 flex-shrink-0">
        <div className="relative aspect-video rounded-lg overflow-hidden">
          {demo.thumbnail ? (
            <img
              src={demo.thumbnail}
              alt={demo.titulo}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200">
              <TipoIcon className="w-16 h-16 text-purple-400" />
            </div>
          )}

          {/* Play button overlay */}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
              <Play className="w-7 h-7 text-purple-600 ml-1" />
            </div>
          </div>

          {/* Duración */}
          {duracion && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {duracion}
            </div>
          )}
        </div>
      </Link>

      {/* Contenido */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className={tipoInfo.color}>
            <TipoIcon className="w-3 h-3 mr-1" />
            {tipoInfo.label}
          </Badge>
          {esNuevo && (
            <Badge className="bg-green-500 text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              Nuevo
            </Badge>
          )}
        </div>

        <Link href={`/demos/${demo.slug}`}>
          <h3 className="text-xl font-semibold text-gray-900 hover:text-purple-600 transition-colors mb-2">
            {demo.titulo}
          </h3>
        </Link>
        
        <p className="text-gray-600 flex-1 mb-4">
          {demo.descripcion}
        </p>

        {/* Estadísticas */}
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {demo.vistas || 0} vistas
          </span>
          <span className="flex items-center gap-1">
            <Download className="w-4 h-4" />
            {demo.descargas || 0} descargas
          </span>
        </div>

        {/* Acciones */}
        <div className="flex gap-3">
          <Button
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => onVerDemo?.(demo.$id)}
          >
            {demo.tipo === 'grabada' ? (
              <>
                <Play className="w-4 h-4 mr-2" />
                Ver demo
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Ver guion
              </>
            )}
          </Button>
          <Link href={`/demos/${demo.slug}`}>
            <Button variant="outline">
              Más detalles
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// SKELETON PARA LOADING
// =============================================================================

export function DemoCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video bg-gray-200 animate-pulse" />
      <CardContent className="p-4">
        <div className="h-5 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-1" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="h-9 bg-gray-200 rounded animate-pulse w-full" />
      </CardFooter>
    </Card>
  );
}
