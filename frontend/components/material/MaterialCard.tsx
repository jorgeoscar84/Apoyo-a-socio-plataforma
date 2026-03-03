'use client';

/**
 * MaterialCard - Componente de tarjeta para materiales POP
 * 
 * Muestra información resumida de un material con:
 * - Thumbnail
 * - Título y descripción
 * - Badge de tipo (brochure, presentación, etc.)
 * - Tamaño del archivo
 * - Botón de descarga
 * - Indicador de favorito
 */

import { useState } from 'react';
import Link from 'next/link';
import { 
  Download, 
  Heart, 
  FileText, 
  Presentation, 
  Video, 
  Image as ImageIcon, 
  File, 
  Share2,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Material } from '@/lib/appwrite/client';
import { agregarFavorito, quitarFavorito, descargarMaterial } from '@/lib/appwrite/client';

// =============================================================================
// TIPOS
// =============================================================================

interface MaterialCardProps {
  material: Material;
  usuarioId?: string;
  favoritoInicial?: boolean;
  onFavoritoChange?: (materialId: string, esFavorito: boolean) => void;
  onDescarga?: (materialId: string) => void;
  showActions?: boolean;
  className?: string;
}

// =============================================================================
// CONFIGURACIÓN DE TIPOS DE MATERIAL
// =============================================================================

const tipoConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  brochure: { 
    label: 'Brochure', 
    icon: FileText, 
    color: 'bg-blue-100 text-blue-700 border-blue-200' 
  },
  presentacion: { 
    label: 'Presentación', 
    icon: Presentation, 
    color: 'bg-orange-100 text-orange-700 border-orange-200' 
  },
  redes: { 
    label: 'Redes Sociales', 
    icon: Share2, 
    color: 'bg-pink-100 text-pink-700 border-pink-200' 
  },
  video: { 
    label: 'Video', 
    icon: Video, 
    color: 'bg-purple-100 text-purple-700 border-purple-200' 
  },
  guion: { 
    label: 'Guion', 
    icon: FileText, 
    color: 'bg-green-100 text-green-700 border-green-200' 
  },
  casos: { 
    label: 'Casos de Éxito', 
    icon: File, 
    color: 'bg-amber-100 text-amber-700 border-amber-200' 
  },
};

// =============================================================================
// FUNCIONES AUXILIARES
// =============================================================================

/**
 * Parsear archivos del material desde JSON
 */
function parseArchivos(archivosJson: string): Array<{ nombre: string; formato: string; tamano: number; url: string; thumbnail?: string }> {
  try {
    return JSON.parse(archivosJson);
  } catch {
    return [];
  }
}

/**
 * Formatear tamaño de archivo
 */
function formatearTamano(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Obtener el tamaño total de todos los archivos
 */
function obtenerTamanoTotal(archivos: ReturnType<typeof parseArchivos>): number {
  return archivos.reduce((total, archivo) => total + (archivo.tamano || 0), 0);
}

// =============================================================================
// COMPONENTE
// =============================================================================

export default function MaterialCard({
  material,
  usuarioId,
  favoritoInicial = false,
  onFavoritoChange,
  onDescarga,
  showActions = true,
  className = ''
}: MaterialCardProps) {
  const [favorito, setFavorito] = useState(favoritoInicial);
  const [isLoading, setIsLoading] = useState(false);
  const [descargado, setDescargado] = useState(false);

  const archivos = parseArchivos(material.archivos);
  const tamanoTotal = obtenerTamanoTotal(archivos);
  const tipoInfo = tipoConfig[material.categoria] || tipoConfig.brochure;
  const TipoIcon = tipoInfo.icon;

  /**
   * Manejar click en favorito
   */
  const handleFavorito = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!usuarioId) return;

    setIsLoading(true);
    try {
      if (favorito) {
        const resultado = await quitarFavorito(material.$id, usuarioId);
        if (resultado) {
          setFavorito(false);
          onFavoritoChange?.(material.$id, false);
        }
      } else {
        const resultado = await agregarFavorito(material.$id, usuarioId);
        if (resultado) {
          setFavorito(true);
          onFavoritoChange?.(material.$id, true);
        }
      }
    } catch (error) {
      console.error('Error al cambiar favorito:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Manejar descarga
   */
  const handleDescarga = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!usuarioId || archivos.length === 0) return;

    setIsLoading(true);
    try {
      // Registrar la descarga
      await descargarMaterial(material.$id, usuarioId, 0);
      
      // Marcar como descargado
      setDescargado(true);
      
      // Disparar evento
      onDescarga?.(material.$id);

      // Abrir el primer archivo en nueva pestaña
      if (archivos[0]?.url) {
        window.open(archivos[0].url, '_blank');
      }
    } catch (error) {
      console.error('Error al descargar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link href={`/material/${material.slug}`}>
      <Card 
        className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden ${className}`}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gray-100 overflow-hidden">
          {material.thumbnail ? (
            <img
              src={material.thumbnail}
              alt={material.nombre}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <TipoIcon className="w-16 h-16 text-gray-400" />
            </div>
          )}

          {/* Badge de tipo */}
          <div className="absolute top-3 left-3">
            <Badge variant="outline" className={tipoInfo.color}>
              <TipoIcon className="w-3 h-3 mr-1" />
              {tipoInfo.label}
            </Badge>
          </div>

          {/* Badge de destacado */}
          {material.destacado && (
            <div className="absolute top-3 right-12">
              <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">
                Destacado
              </Badge>
            </div>
          )}

          {/* Botón de favorito */}
          {showActions && usuarioId && (
            <button
              onClick={handleFavorito}
              disabled={isLoading}
              className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
                favorito
                  ? 'bg-red-100 text-red-500'
                  : 'bg-white/80 text-gray-500 hover:bg-white hover:text-red-500'
              } opacity-0 group-hover:opacity-100`}
              aria-label={favorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              <Heart className={`w-4 h-4 ${favorito ? 'fill-current' : ''}`} />
            </button>
          )}

          {/* Overlay con acciones */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <Link 
              href={`/material/${material.slug}`}
              className="p-3 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Contenido */}
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {material.nombre}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mt-1">
            {material.descripcion}
          </p>

          {/* Info adicional */}
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
            {tamanoTotal > 0 && (
              <span className="flex items-center gap-1">
                <File className="w-3 h-3" />
                {formatearTamano(tamanoTotal)}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              {material.descargas || 0} descargas
            </span>
          </div>
        </CardContent>

        {/* Footer con acciones */}
        {showActions && (
          <CardFooter className="p-4 pt-0 gap-2">
            <Button
              variant="default"
              size="sm"
              className="flex-1"
              onClick={handleDescarga}
              disabled={isLoading || archivos.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              {descargado ? 'Descargado' : 'Descargar'}
            </Button>
            {usuarioId && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleFavorito}
                disabled={isLoading}
                className={favorito ? 'text-red-500 border-red-200 hover:bg-red-50' : ''}
              >
                <Heart className={`w-4 h-4 ${favorito ? 'fill-current' : ''}`} />
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}

// =============================================================================
// VARIANTE: MATERIAL CARD SIMPLE (SIN ACCIONES)
// =============================================================================

export function MaterialCardSimple({
  material,
  className = ''
}: {
  material: Material;
  className?: string;
}) {
  const archivos = parseArchivos(material.archivos);
  const tamanoTotal = obtenerTamanoTotal(archivos);
  const tipoInfo = tipoConfig[material.categoria] || tipoConfig.brochure;
  const TipoIcon = tipoInfo.icon;

  return (
    <Link href={`/material/${material.slug}`}>
      <div className={`flex items-center gap-4 p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors ${className}`}>
        {/* Icono */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${tipoInfo.color}`}>
          <TipoIcon className="w-6 h-6" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{material.nombre}</h4>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
            <Badge variant="outline" className="text-xs">{tipoInfo.label}</Badge>
            {tamanoTotal > 0 && <span>{formatearTamano(tamanoTotal)}</span>}
          </div>
        </div>

        {/* Descargas */}
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Download className="w-3 h-3" />
          {material.descargas || 0}
        </div>
      </div>
    </Link>
  );
}

// =============================================================================
// VARIANTE: MATERIAL CARD COMPACTA (PARA SIDEBARS O LISTAS)
// =============================================================================

export function MaterialCardCompact({
  material,
  onDescarga,
  className = ''
}: {
  material: Material;
  onDescarga?: (materialId: string) => void;
  className?: string;
}) {
  const archivos = parseArchivos(material.archivos);
  const tipoInfo = tipoConfig[material.categoria] || tipoConfig.brochure;
  const TipoIcon = tipoInfo.icon;

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors ${className}`}>
      <Link href={`/material/${material.slug}`} className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${tipoInfo.color}`}>
          <TipoIcon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">{material.nombre}</h4>
          <p className="text-xs text-gray-500">{tipoInfo.label}</p>
        </div>
      </Link>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDescarga?.(material.$id)}
        disabled={archivos.length === 0}
      >
        <Download className="w-4 h-4" />
      </Button>
    </div>
  );
}

// =============================================================================
// SKELETON PARA LOADING
// =============================================================================

export function MaterialCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video bg-gray-200 animate-pulse" />
      <CardContent className="p-4">
        <div className="h-5 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-1" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
      </CardContent>
      <CardFooter className="p-4 pt-0 gap-2">
        <div className="h-9 bg-gray-200 rounded animate-pulse flex-1" />
        <div className="h-9 w-9 bg-gray-200 rounded animate-pulse" />
      </CardFooter>
    </Card>
  );
}
