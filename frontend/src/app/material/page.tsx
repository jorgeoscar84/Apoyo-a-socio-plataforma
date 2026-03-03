'use client';

/**
 * Página de Lista de Material POP
 * 
 * Ruta: /material
 * 
 * Funcionalidades:
 * - Grid de materiales (cards)
 * - Filtros por tipo y categoría
 * - Búsqueda por título
 * - Ordenamiento: recientes, más descargados, destacados
 * - Vista de favoritos del usuario
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import {
  getMateriales,
  getMaterialesConFavorito,
  getMaterialesDestacados,
  Material,
  FiltrosMateriales
} from '@/lib/appwrite/client';
import MaterialCard, { MaterialCardSkeleton } from '@/components/material/MaterialCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  Grid,
  List,
  Heart,
  Sparkles,
  FileText,
  Presentation,
  Share2,
  Video,
  File,
  X
} from 'lucide-react';

// =============================================================================
// CONFIGURACIÓN DE TIPOS
// =============================================================================

const tiposMaterial = [
  { id: 'brochure', label: 'Brochures', icon: FileText },
  { id: 'presentacion', label: 'Presentaciones', icon: Presentation },
  { id: 'redes', label: 'Redes Sociales', icon: Share2 },
  { id: 'video', label: 'Videos', icon: Video },
  { id: 'guion', label: 'Guiones', icon: FileText },
  { id: 'casos', label: 'Casos de Éxito', icon: File },
];

const opcionesOrdenamiento = [
  { id: 'destacados', label: 'Destacados' },
  { id: 'recientes', label: 'Más recientes' },
  { id: 'descargas', label: 'Más descargados' },
];

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

export default function MaterialPage() {
  const { user } = useAuth();
  
  // Estados
  const [materiales, setMateriales] = useState<(Material & { favorito: boolean })[]>([]);
  const [materialesDestacados, setMaterialesDestacados] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [tipoSeleccionado, setTipoSeleccionado] = useState<string | null>(null);
  const [ordenamiento, setOrdenamiento] = useState<string>('destacados');
  const [mostrarSoloFavoritos, setMostrarSoloFavoritos] = useState(false);
  
  // Vista
  const [vistaGrid, setVistaGrid] = useState(true);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  /**
   * Cargar materiales
   */
  const cargarMateriales = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const filtros: FiltrosMateriales = {
        ordenar: ordenamiento as FiltrosMateriales['ordenar'],
      };

      if (tipoSeleccionado) {
        filtros.categoria = tipoSeleccionado as FiltrosMateriales['categoria'];
      }

      if (busqueda) {
        filtros.buscar = busqueda;
      }

      // Si el usuario está autenticado, obtener materiales con estado de favorito
      let materialesData: (Material & { favorito: boolean })[];
      
      if (user?.$id) {
        materialesData = await getMaterialesConFavorito(user.$id, filtros);
      } else {
        const materialesNormales = await getMateriales(filtros);
        materialesData = materialesNormales.map(m => ({ ...m, favorito: false }));
      }

      // Filtrar por favoritos si está activo
      if (mostrarSoloFavoritos) {
        materialesData = materialesData.filter(m => m.favorito);
      }

      setMateriales(materialesData);

      // Cargar destacados (solo si no hay filtros activos)
      if (!tipoSeleccionado && !busqueda && !mostrarSoloFavoritos) {
        const destacados = await getMaterialesDestacados();
        setMaterialesDestacados(destacados);
      }
    } catch (err) {
      console.error('Error al cargar materiales:', err);
      setError('No se pudieron cargar los materiales. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [user?.$id, ordenamiento, tipoSeleccionado, busqueda, mostrarSoloFavoritos]);

  /**
   * Efecto para cargar materiales
   */
  useEffect(() => {
    cargarMateriales();
  }, [cargarMateriales]);

  /**
   * Manejar cambio de favorito
   */
  const handleFavoritoChange = (materialId: string, esFavorito: boolean) => {
    setMateriales(prev => 
      prev.map(m => 
        m.$id === materialId ? { ...m, favorito: esFavorito } : m
      )
    );
  };

  /**
   * Limpiar filtros
   */
  const limpiarFiltros = () => {
    setBusqueda('');
    setTipoSeleccionado(null);
    setOrdenamiento('destacados');
    setMostrarSoloFavoritos(false);
  };

  /**
   * Verificar si hay filtros activos
   */
  const hayFiltrosActivos = busqueda || tipoSeleccionado || mostrarSoloFavoritos;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Material POP
              </h1>
              <p className="text-gray-500 mt-1">
                Descarga materiales promocionales, brochures, presentaciones y más
              </p>
            </div>

            {/* Acciones del header */}
            <div className="flex items-center gap-3">
              {user?.$id && (
                <Button
                  variant={mostrarSoloFavoritos ? 'default' : 'outline'}
                  onClick={() => setMostrarSoloFavoritos(!mostrarSoloFavoritos)}
                  className="gap-2"
                >
                  <Heart className={`w-4 h-4 ${mostrarSoloFavoritos ? 'fill-current' : ''}`} />
                  Favoritos
                </Button>
              )}
            </div>
          </div>

          {/* Barra de búsqueda y filtros */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            {/* Búsqueda */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar materiales..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10"
              />
              {busqueda && (
                <button
                  onClick={() => setBusqueda('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Botón de filtros (mobile) */}
            <Button
              variant="outline"
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="sm:hidden gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtros
            </Button>

            {/* Filtros de tipo (desktop) */}
            <div className="hidden sm:flex items-center gap-2 flex-wrap">
              {tiposMaterial.map((tipo) => (
                <Badge
                  key={tipo.id}
                  variant={tipoSeleccionado === tipo.id ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setTipoSeleccionado(
                    tipoSeleccionado === tipo.id ? null : tipo.id
                  )}
                >
                  <tipo.icon className="w-3 h-3 mr-1" />
                  {tipo.label}
                </Badge>
              ))}
            </div>

            {/* Ordenamiento */}
            <select
              value={ordenamiento}
              onChange={(e) => setOrdenamiento(e.target.value)}
              className="hidden sm:block px-4 py-2 border rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {opcionesOrdenamiento.map((op) => (
                <option key={op.id} value={op.id}>
                  {op.label}
                </option>
              ))}
            </select>

            {/* Toggle vista */}
            <div className="hidden sm:flex items-center border rounded-lg overflow-hidden">
              <button
                onClick={() => setVistaGrid(true)}
                className={`p-2 ${vistaGrid ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setVistaGrid(false)}
                className={`p-2 ${!vistaGrid ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filtros mobile */}
          {mostrarFiltros && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg sm:hidden">
              <div className="space-y-4">
                {/* Tipos */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Tipo de material</p>
                  <div className="flex flex-wrap gap-2">
                    {tiposMaterial.map((tipo) => (
                      <Badge
                        key={tipo.id}
                        variant={tipoSeleccionado === tipo.id ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => setTipoSeleccionado(
                          tipoSeleccionado === tipo.id ? null : tipo.id
                        )}
                      >
                        {tipo.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Ordenamiento */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Ordenar por</p>
                  <select
                    value={ordenamiento}
                    onChange={(e) => setOrdenamiento(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg bg-white"
                  >
                    {opcionesOrdenamiento.map((op) => (
                      <option key={op.id} value={op.id}>
                        {op.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
            <Button
              variant="outline"
              onClick={cargarMateriales}
              className="mt-2"
            >
              Intentar de nuevo
            </Button>
          </div>
        )}

        {/* Filtros activos */}
        {hayFiltrosActivos && (
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-gray-500">Filtros activos:</span>
            {busqueda && (
              <Badge variant="secondary" className="gap-1">
                Búsqueda: {busqueda}
                <button onClick={() => setBusqueda('')}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {tipoSeleccionado && (
              <Badge variant="secondary" className="gap-1">
                Tipo: {tiposMaterial.find(t => t.id === tipoSeleccionado)?.label}
                <button onClick={() => setTipoSeleccionado(null)}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {mostrarSoloFavoritos && (
              <Badge variant="secondary" className="gap-1">
                Solo favoritos
                <button onClick={() => setMostrarSoloFavoritos(false)}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={limpiarFiltros}
              className="text-gray-500"
            >
              Limpiar todo
            </Button>
          </div>
        )}

        {/* Sección de destacados (solo si no hay filtros) */}
        {!hayFiltrosActivos && materialesDestacados.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <h2 className="text-xl font-semibold text-gray-900">
                Materiales Destacados
              </h2>
            </div>
            <div className={
              vistaGrid
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }>
              {materialesDestacados.map((material) => (
                <MaterialCard
                  key={material.$id}
                  material={material}
                  usuarioId={user?.$id}
                  favoritoInicial={false}
                  onFavoritoChange={handleFavoritoChange}
                />
              ))}
            </div>
          </div>
        )}

        {/* Contador de resultados */}
        {!loading && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              {materiales.length} {materiales.length === 1 ? 'material encontrado' : 'materiales encontrados'}
            </p>
          </div>
        )}

        {/* Grid de materiales */}
        {loading ? (
          <div className={
            vistaGrid
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {Array.from({ length: 8 }).map((_, i) => (
              <MaterialCardSkeleton key={i} />
            ))}
          </div>
        ) : materiales.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron materiales
            </h3>
            <p className="text-gray-500 mb-6">
              {hayFiltrosActivos
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'No hay materiales disponibles en este momento'}
            </p>
            {hayFiltrosActivos && (
              <Button onClick={limpiarFiltros}>
                Limpiar filtros
              </Button>
            )}
          </div>
        ) : (
          <div className={
            vistaGrid
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {materiales.map((material) => (
              <MaterialCard
                key={material.$id}
                material={material}
                usuarioId={user?.$id}
                favoritoInicial={material.favorito}
                onFavoritoChange={handleFavoritoChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
