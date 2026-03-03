'use client';

/**
 * Página de Lista de Demos
 * 
 * Ruta: /demos
 * 
 * Funcionalidades:
 * - Grid de demos (cards con thumbnail de video)
 * - Filtros por tipo y categoría
 * - Búsqueda
 * - Indicador de demos nuevos
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import {
  getDemos,
  Demo,
  FiltrosDemos,
  esDemoNuevo
} from '@/lib/appwrite/client';
import DemoCard, { DemoCardSkeleton } from '@/components/demos/DemoCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  Grid,
  List,
  Sparkles,
  Video,
  FileText,
  X
} from 'lucide-react';

// =============================================================================
// CONFIGURACIÓN DE TIPOS
// =============================================================================

const tiposDemo = [
  { id: 'grabada', label: 'Demos Grabadas', icon: Video },
  { id: 'guion', label: 'Guiones de Venta', icon: FileText },
];

const opcionesOrdenamiento = [
  { id: 'descargas', label: 'Más descargados' },
  { id: 'recientes', label: 'Más recientes' },
  { id: 'vistas', label: 'Más vistos' },
];

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

export default function DemosPage() {
  const { user } = useAuth();
  
  // Estados
  const [demos, setDemos] = useState<Demo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [tipoSeleccionado, setTipoSeleccionado] = useState<string | null>(null);
  const [ordenamiento, setOrdenamiento] = useState<string>('recientes');
  
  // Vista
  const [vistaGrid, setVistaGrid] = useState(true);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  /**
   * Cargar demos
   */
  const cargarDemos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const filtros: FiltrosDemos = {
        ordenar: ordenamiento as FiltrosDemos['ordenar'],
      };

      if (tipoSeleccionado) {
        filtros.tipo = tipoSeleccionado as FiltrosDemos['tipo'];
      }

      if (busqueda) {
        filtros.buscar = busqueda;
      }

      const demosData = await getDemos(filtros);
      setDemos(demosData);
    } catch (err) {
      console.error('Error al cargar demos:', err);
      setError('No se pudieron cargar las demos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [ordenamiento, tipoSeleccionado, busqueda]);

  /**
   * Efecto para cargar demos
   */
  useEffect(() => {
    cargarDemos();
  }, [cargarDemos]);

  /**
   * Limpiar filtros
   */
  const limpiarFiltros = () => {
    setBusqueda('');
    setTipoSeleccionado(null);
    setOrdenamiento('recientes');
  };

  /**
   * Verificar si hay filtros activos
   */
  const hayFiltrosActivos = busqueda || tipoSeleccionado;

  /**
   * Obtener demos nuevos
   */
  const demosNuevos = demos.filter(d => esDemoNuevo(d));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Badge className="bg-white/20 text-white mb-4">
              Centro de Demos
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Demos y Guiones de Venta
            </h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Aprende a presentar nuestros productos con demos profesionales y guiones de venta efectivos
            </p>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Búsqueda */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar demos..."
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
            <div className="hidden sm:flex items-center gap-2">
              {tiposDemo.map((tipo) => (
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
              className="hidden sm:block px-4 py-2 border rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                className={`p-2 ${vistaGrid ? 'bg-purple-500 text-white' : 'bg-white text-gray-600'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setVistaGrid(false)}
                className={`p-2 ${!vistaGrid ? 'bg-purple-500 text-white' : 'bg-white text-gray-600'}`}
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
                  <p className="text-sm font-medium text-gray-700 mb-2">Tipo de demo</p>
                  <div className="flex flex-wrap gap-2">
                    {tiposDemo.map((tipo) => (
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
              onClick={cargarDemos}
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
                Tipo: {tiposDemo.find(t => t.id === tipoSeleccionado)?.label}
                <button onClick={() => setTipoSeleccionado(null)}>
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

        {/* Sección de demos nuevos (solo si no hay filtros) */}
        {!hayFiltrosActivos && demosNuevos.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-green-500" />
              <h2 className="text-xl font-semibold text-gray-900">
                Demos Nuevos
              </h2>
              <Badge className="bg-green-500 text-white">
                {demosNuevos.length}
              </Badge>
            </div>
            <div className={
              vistaGrid
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }>
              {demosNuevos.slice(0, 4).map((demo) => (
                <DemoCard key={demo.$id} demo={demo} />
              ))}
            </div>
          </div>
        )}

        {/* Contador de resultados */}
        {!loading && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              {demos.length} {demos.length === 1 ? 'demo encontrada' : 'demos encontradas'}
            </p>
          </div>
        )}

        {/* Grid de demos */}
        {loading ? (
          <div className={
            vistaGrid
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {Array.from({ length: 8 }).map((_, i) => (
              <DemoCardSkeleton key={i} />
            ))}
          </div>
        ) : demos.length === 0 ? (
          <div className="text-center py-16">
            <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron demos
            </h3>
            <p className="text-gray-500 mb-6">
              {hayFiltrosActivos
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'No hay demos disponibles en este momento'}
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
            {demos.map((demo) => (
              <DemoCard key={demo.$id} demo={demo} />
            ))}
          </div>
        )}

        {/* CTA para solicitar demo en vivo */}
        <div className="mt-16 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ¿Necesitas una demo personalizada?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Agenda una sesión en vivo con uno de nuestros expertos y resuelve todas tus dudas
          </p>
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
            Solicitar demo en vivo
          </Button>
        </div>
      </div>
    </div>
  );
}
