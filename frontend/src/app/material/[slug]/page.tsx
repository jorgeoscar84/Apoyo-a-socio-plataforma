'use client';

/**
 * Página de Detalle de Material
 * 
 * Ruta: /material/[slug]
 * 
 * Funcionalidades:
 * - Información del material
 * - Vista previa (si es imagen o PDF)
 * - Botón de descarga (con tracking)
 * - Agregar/quitar de favoritos
 * - Materiales relacionados
 */

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import {
  getMaterialBySlug,
  getMaterialesRelacionados,
  descargarMaterial,
  agregarFavorito,
  quitarFavorito,
  esFavorito,
  Material
} from '@/lib/appwrite/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MaterialCard from '@/components/material/MaterialCard';
import {
  Download,
  Heart,
  Share2,
  ArrowLeft,
  FileText,
  Presentation,
  Video,
  Image as ImageIcon,
  File,
  Calendar,
  Eye,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

// =============================================================================
// TIPOS
// =============================================================================

interface PageProps {
  params: Promise<{ slug: string }>;
}

// =============================================================================
// CONFIGURACIÓN DE TIPOS DE MATERIAL
// =============================================================================

const tipoConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  brochure: { 
    label: 'Brochure', 
    icon: FileText, 
    color: 'bg-blue-100 text-blue-700' 
  },
  presentacion: { 
    label: 'Presentación', 
    icon: Presentation, 
    color: 'bg-orange-100 text-orange-700' 
  },
  redes: { 
    label: 'Redes Sociales', 
    icon: Share2, 
    color: 'bg-pink-100 text-pink-700' 
  },
  video: { 
    label: 'Video', 
    icon: Video, 
    color: 'bg-purple-100 text-purple-700' 
  },
  guion: { 
    label: 'Guion', 
    icon: FileText, 
    color: 'bg-green-100 text-green-700' 
  },
  casos: { 
    label: 'Casos de Éxito', 
    icon: File, 
    color: 'bg-amber-100 text-amber-700' 
  },
};

// =============================================================================
// FUNCIONES AUXILIARES
// =============================================================================

function parseArchivos(archivosJson: string): Array<{ nombre: string; formato: string; tamano: number; url: string; thumbnail?: string }> {
  try {
    return JSON.parse(archivosJson);
  } catch {
    return [];
  }
}

function parseTags(tagsJson?: string): string[] {
  if (!tagsJson) return [];
  try {
    return JSON.parse(tagsJson);
  } catch {
    return tagsJson.split(',').map(t => t.trim()).filter(Boolean);
  }
}

function formatearTamano(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function formatearFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function esImagen(formato: string): boolean {
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(formato.toLowerCase());
}

function esPDF(formato: string): boolean {
  return formato.toLowerCase() === 'pdf';
}

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

export default function MaterialDetallePage({ params }: PageProps) {
  const { slug } = use(params);
  const { user } = useAuth();
  
  // Estados
  const [material, setMaterial] = useState<Material | null>(null);
  const [materialesRelacionados, setMaterialesRelacionados] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorito, setFavorito] = useState(false);
  const [descargando, setDescargando] = useState(false);
  const [archivoPreview, setArchivoPreview] = useState(0);

  /**
   * Cargar material
   */
  useEffect(() => {
    const cargarMaterial = async () => {
      setLoading(true);
      setError(null);

      try {
        const materialData = await getMaterialBySlug(slug);
        
        if (!materialData) {
          setError('Material no encontrado');
          return;
        }

        setMaterial(materialData);

        // Verificar si es favorito
        if (user?.$id) {
          const esFav = await esFavorito(materialData.$id, user.$id);
          setFavorito(esFav);
        }

        // Cargar materiales relacionados
        const relacionados = await getMaterialesRelacionados(
          materialData.$id,
          materialData.categoria,
          4
        );
        setMaterialesRelacionados(relacionados);
      } catch (err) {
        console.error('Error al cargar material:', err);
        setError('No se pudo cargar el material');
      } finally {
        setLoading(false);
      }
    };

    cargarMaterial();
  }, [slug, user?.$id]);

  /**
   * Manejar favorito
   */
  const handleFavorito = async () => {
    if (!user?.$id || !material) return;

    try {
      if (favorito) {
        await quitarFavorito(material.$id, user.$id);
        setFavorito(false);
      } else {
        await agregarFavorito(material.$id, user.$id);
        setFavorito(true);
      }
    } catch (err) {
      console.error('Error al cambiar favorito:', err);
    }
  };

  /**
   * Manejar descarga
   */
  const handleDescarga = async (archivoIndex: number) => {
    if (!user?.$id || !material) return;

    const archivos = parseArchivos(material.archivos);
    if (!archivos[archivoIndex]) return;

    setDescargando(true);
    try {
      // Registrar la descarga
      await descargarMaterial(material.$id, user.$id, archivoIndex);

      // Abrir el archivo
      window.open(archivos[archivoIndex].url, '_blank');
    } catch (err) {
      console.error('Error al descargar:', err);
    } finally {
      setDescargando(false);
    }
  };

  /**
   * Compartir material
   */
  const handleCompartir = async () => {
    if (!material) return;

    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: material.nombre,
          text: material.descripcion,
          url
        });
      } catch (err) {
        console.log('Error al compartir:', err);
      }
    } else {
      // Fallback: copiar al portapapeles
      await navigator.clipboard.writeText(url);
      alert('Enlace copiado al portapapeles');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl p-6">
                  <div className="aspect-video bg-gray-200 rounded-lg mb-6" />
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-6">
                  <div className="h-10 bg-gray-200 rounded mb-4" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !material) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'Material no encontrado'}
          </h2>
          <p className="text-gray-500 mb-6">
            El material que buscas no está disponible o no existe.
          </p>
          <Link href="/material">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a materiales
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Datos derivados
  const archivos = parseArchivos(material.archivos);
  const tags = parseTags(material.tags);
  const tipoInfo = tipoConfig[material.categoria] || tipoConfig.brochure;
  const TipoIcon = tipoInfo.icon;
  const archivoActual = archivos[archivoPreview];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Inicio
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link href="/material" className="text-gray-500 hover:text-gray-700">
              Material POP
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{material.nombre}</span>
          </nav>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vista previa */}
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gray-100 relative">
                {archivoActual ? (
                  <>
                    {esImagen(archivoActual.formato) ? (
                      <img
                        src={archivoActual.url}
                        alt={archivoActual.nombre}
                        className="w-full h-full object-contain"
                      />
                    ) : esPDF(archivoActual.formato) ? (
                      <iframe
                        src={archivoActual.url}
                        className="w-full h-full"
                        title={archivoActual.nombre}
                      />
                    ) : archivoActual.thumbnail ? (
                      <img
                        src={archivoActual.thumbnail}
                        alt={archivoActual.nombre}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <TipoIcon className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">Vista previa no disponible</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <TipoIcon className="w-20 h-20 text-gray-400" />
                  </div>
                )}

                {/* Indicador de archivo si hay múltiples */}
                {archivos.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {archivos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setArchivoPreview(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === archivoPreview
                            ? 'bg-blue-500'
                            : 'bg-white/80 hover:bg-white'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Miniaturas si hay múltiples archivos */}
              {archivos.length > 1 && (
                <div className="p-4 border-t flex gap-2 overflow-x-auto">
                  {archivos.map((archivo, index) => (
                    <button
                      key={index}
                      onClick={() => setArchivoPreview(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === archivoPreview
                          ? 'border-blue-500'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      {archivo.thumbnail ? (
                        <img
                          src={archivo.thumbnail}
                          alt={archivo.nombre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center ${tipoInfo.color}`}>
                          <TipoIcon className="w-8 h-8" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </Card>

            {/* Información del material */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={tipoInfo.color}>
                        <TipoIcon className="w-3 h-3 mr-1" />
                        {tipoInfo.label}
                      </Badge>
                      {material.destacado && (
                        <Badge className="bg-yellow-100 text-yellow-700">
                          Destacado
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-2xl">{material.nombre}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">{material.descripcion}</p>

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Metadatos */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Fecha</p>
                    <p className="text-sm font-medium flex items-center gap-1 mt-1">
                      <Calendar className="w-4 h-4" />
                      {formatearFecha(material.creadoEn)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Descargas</p>
                    <p className="text-sm font-medium flex items-center gap-1 mt-1">
                      <Download className="w-4 h-4" />
                      {material.descargas || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Archivos</p>
                    <p className="text-sm font-medium flex items-center gap-1 mt-1">
                      <File className="w-4 h-4" />
                      {archivos.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Tipo</p>
                    <p className="text-sm font-medium flex items-center gap-1 mt-1">
                      <TipoIcon className="w-4 h-4" />
                      {tipoInfo.label}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Materiales relacionados */}
            {materialesRelacionados.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Materiales relacionados
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {materialesRelacionados.map((relacionado) => (
                    <MaterialCard
                      key={relacionado.$id}
                      material={relacionado}
                      usuarioId={user?.$id}
                      showActions={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Acciones */}
            <Card>
              <CardContent className="p-6 space-y-4">
                {/* Descargar todo */}
                {archivos.length > 0 && (
                  <Button
                    className="w-full"
                    onClick={() => handleDescarga(0)}
                    disabled={descargando}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {descargando ? 'Descargando...' : 'Descargar material'}
                  </Button>
                )}

                {/* Favorito */}
                {user?.$id && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleFavorito}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${favorito ? 'fill-current text-red-500' : ''}`} />
                    {favorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  </Button>
                )}

                {/* Compartir */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleCompartir}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartir
                </Button>
              </CardContent>
            </Card>

            {/* Lista de archivos */}
            {archivos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Archivos disponibles</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {archivos.map((archivo, index) => (
                      <div
                        key={index}
                        className="p-4 flex items-center justify-between hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tipoInfo.color}`}>
                            {esImagen(archivo.formato) ? (
                              <ImageIcon className="w-5 h-5" />
                            ) : esPDF(archivo.formato) ? (
                              <FileText className="w-5 h-5" />
                            ) : (
                              <File className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                              {archivo.nombre}
                            </p>
                            <p className="text-xs text-gray-500">
                              {archivo.formato.toUpperCase()} • {formatearTamano(archivo.tamano)}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDescarga(index)}
                          disabled={descargando}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ayuda */}
            <Card className="bg-blue-50 border-blue-100">
              <CardContent className="p-6">
                <h4 className="font-medium text-blue-900 mb-2">
                  ¿Necesitas ayuda?
                </h4>
                <p className="text-sm text-blue-700 mb-4">
                  Si tienes problemas para descargar o visualizar este material, 
                  contacta con nuestro equipo de soporte.
                </p>
                <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-100">
                  Contactar soporte
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
