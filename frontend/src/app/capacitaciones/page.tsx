/**
 * Página de Lista de Capacitaciones
 * Muestra todos los videos de capacitación con filtros y búsqueda
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  VideoCard,
  VideoCardSkeleton,
  VideoGrid,
  VideoEmptyState,
} from '@/components/video/VideoCard';
import {
  getVideosConProgreso,
  getCategoriasConVideos,
  Video,
  Categoria,
  ProgresoVideo,
} from '@/lib/appwrite/client';
import { Search, Filter, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

// Metadata para SEO
export const metadata: Metadata = {
  title: 'Capacitaciones | Plataforma de Capacitación',
  description: 'Accede a todos los videos de capacitación organizados por categorías.',
};

// Tipos
interface VideoConProgreso extends Video {
  progreso?: ProgresoVideo;
}

interface CategoriaConVideos extends Categoria {
  cantidadVideos: number;
}

// Opciones de ordenamiento
const ORDENAMIENTO_OPTIONS = [
  { value: 'orden', label: 'Orden predeterminado' },
  { value: 'recientes', label: 'Más recientes' },
  { value: 'destacados', label: 'Destacados' },
];

// Componente de Breadcrumb
function Breadcrumb() {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
      <Link href="/dashboard" className="hover:text-primary transition-colors">
        Inicio
      </Link>
      <ChevronRight className="w-4 h-4" />
      <span className="text-gray-900 font-medium">Capacitaciones</span>
    </nav>
  );
}

// Componente de Filtros
interface FiltrosProps {
  categorias: CategoriaConVideos[];
  categoriaSeleccionada: string;
  ordenamiento: string;
  busqueda: string;
  onCategoriaChange: (value: string) => void;
  onOrdenamientoChange: (value: string) => void;
  onBusquedaChange: (value: string) => void;
  totalVideos: number;
  videosFiltrados: number;
}

function Filtros({
  categorias,
  categoriaSeleccionada,
  ordenamiento,
  busqueda,
  onCategoriaChange,
  onOrdenamientoChange,
  onBusquedaChange,
  totalVideos,
  videosFiltrados,
}: FiltrosProps) {
  const categoriaOptions = [
    { value: '', label: 'Todas las categorías' },
    ...categorias.map((cat) => ({
      value: cat.$id,
      label: `${cat.nombre} (${cat.cantidadVideos})`,
    })),
  ];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Barra de búsqueda */}
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Buscar videos por título..."
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            className="w-full"
          />
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-56">
            <Select
              options={categoriaOptions}
              value={categoriaSeleccionada}
              onValueChange={onCategoriaChange}
              placeholder="Categoría"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={ORDENAMIENTO_OPTIONS}
              value={ordenamiento}
              onValueChange={onOrdenamientoChange}
              placeholder="Ordenar por"
            />
          </div>
        </div>
      </div>

      {/* Contador de resultados */}
      {(busqueda || categoriaSeleccionada) && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Mostrando {videosFiltrados} de {totalVideos} videos
            {busqueda && ` para "${busqueda}"`}
            {categoriaSeleccionada && (
              <Badge variant="primary" size="sm" className="ml-2">
                {categorias.find((c) => c.$id === categoriaSeleccionada)?.nombre}
              </Badge>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

// Componente de Tabs de Categorías
interface CategoryTabsProps {
  categorias: CategoriaConVideos[];
  categoriaSeleccionada: string;
  onCategoriaChange: (categoriaId: string) => void;
}

function CategoryTabs({
  categorias,
  categoriaSeleccionada,
  onCategoriaChange,
}: CategoryTabsProps) {
  return (
    <div className="mb-6 overflow-x-auto">
      <div className="flex space-x-2 pb-2">
        <button
          onClick={() => onCategoriaChange('')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            !categoriaSeleccionada
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todos
        </button>
        {categorias.map((categoria) => (
          <button
            key={categoria.$id}
            onClick={() => onCategoriaChange(categoria.$id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              categoriaSeleccionada === categoria.$id
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {categoria.nombre}
            <span className="ml-1.5 text-xs opacity-75">
              ({categoria.cantidadVideos})
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Componente de Estadísticas Rápidas
interface StatsProps {
  totalVideos: number;
  videosCompletados: number;
  enProgreso: number;
}

function Stats({ totalVideos, videosCompletados, enProgreso }: StatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-lg p-4 border border-gray-100 text-center">
        <p className="text-2xl font-bold text-gray-900">{totalVideos}</p>
        <p className="text-sm text-gray-500">Videos totales</p>
      </div>
      <div className="bg-white rounded-lg p-4 border border-gray-100 text-center">
        <p className="text-2xl font-bold text-green-600">{videosCompletados}</p>
        <p className="text-sm text-gray-500">Completados</p>
      </div>
      <div className="bg-white rounded-lg p-4 border border-gray-100 text-center">
        <p className="text-2xl font-bold text-blue-600">{enProgreso}</p>
        <p className="text-sm text-gray-500">En progreso</p>
      </div>
    </div>
  );
}

// Página principal
export default function CapacitacionesPage() {
  const { user, isLoading: authLoading } = useAuth();
  
  // Estados
  const [videos, setVideos] = useState<VideoConProgreso[]>([]);
  const [categorias, setCategorias] = useState<CategoriaConVideos[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [ordenamiento, setOrdenamiento] = useState('orden');
  const [debouncedBusqueda, setDebouncedBusqueda] = useState('');

  // Debounce para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedBusqueda(busqueda);
    }, 300);
    return () => clearTimeout(timer);
  }, [busqueda]);

  // Cargar datos
  useEffect(() => {
    async function loadData() {
      if (!user?.$id) return;
      
      setLoading(true);
      try {
        const [videosData, categoriasData] = await Promise.all([
          getVideosConProgreso(user.$id, {}),
          getCategoriasConVideos(),
        ]);
        setVideos(videosData);
        setCategorias(categoriasData);
      } catch (error) {
        console.error('Error loading capacitaciones:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user?.$id]);

  // Filtrar y ordenar videos
  const videosFiltrados = videos.filter((video) => {
    // Filtro por categoría
    if (categoriaSeleccionada && video.categoriaId !== categoriaSeleccionada) {
      return false;
    }
    // Filtro por búsqueda
    if (
      debouncedBusqueda &&
      !video.titulo.toLowerCase().includes(debouncedBusqueda.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Ordenar videos
  const videosOrdenados = [...videosFiltrados].sort((a, b) => {
    switch (ordenamiento) {
      case 'recientes':
        return new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime();
      case 'destacados':
        if (a.destacado && !b.destacado) return -1;
        if (!a.destacado && b.destacado) return 1;
        return a.orden - b.orden;
      case 'orden':
      default:
        return a.orden - b.orden;
    }
  });

  // Calcular estadísticas
  const videosCompletados = videos.filter((v) => v.progreso?.completado).length;
  const enProgreso = videos.filter(
    (v) => v.progreso && !v.progreso.completado && v.progreso.progreso > 0
  ).length;

  // Obtener categoría de un video
  const getCategoria = (categoriaId: string) => {
    return categorias.find((c) => c.$id === categoriaId);
  };

  // Manejar cambio de categoría desde tabs
  const handleCategoriaTabChange = useCallback((categoriaId: string) => {
    setCategoriaSeleccionada(categoriaId);
  }, []);

  // Manejar cambio de categoría desde dropdown
  const handleCategoriaSelectChange = useCallback((value: string) => {
    setCategoriaSeleccionada(value);
  }, []);

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
        {/* Header */}
        <div className="mb-6">
          <Breadcrumb />
          <h1 className="text-2xl font-bold text-gray-900">Capacitaciones</h1>
          <p className="text-gray-600 mt-1">
            Accede a todos los videos de capacitación y mejora tus habilidades
          </p>
        </div>

        {/* Estadísticas */}
        {!loading && videos.length > 0 && (
          <Stats
            totalVideos={videos.length}
            videosCompletados={videosCompletados}
            enProgreso={enProgreso}
          />
        )}

        {/* Tabs de categorías (visible en desktop) */}
        {!loading && categorias.length > 0 && (
          <div className="hidden md:block">
            <CategoryTabs
              categorias={categorias}
              categoriaSeleccionada={categoriaSeleccionada}
              onCategoriaChange={handleCategoriaTabChange}
            />
          </div>
        )}

        {/* Filtros */}
        <Filtros
          categorias={categorias}
          categoriaSeleccionada={categoriaSeleccionada}
          ordenamiento={ordenamiento}
          busqueda={busqueda}
          onCategoriaChange={handleCategoriaSelectChange}
          onOrdenamientoChange={setOrdenamiento}
          onBusquedaChange={setBusqueda}
          totalVideos={videos.length}
          videosFiltrados={videosFiltrados.length}
        />

        {/* Lista de videos */}
        {loading ? (
          <VideoGrid>
            {Array.from({ length: 6 }).map((_, i) => (
              <VideoCardSkeleton key={i} />
            ))}
          </VideoGrid>
        ) : videosOrdenados.length > 0 ? (
          <VideoGrid>
            {videosOrdenados.map((video) => (
              <VideoCard
                key={video.$id}
                video={video}
                progreso={video.progreso}
                categoria={getCategoria(video.categoriaId)}
                showProgress={true}
                showCategory={true}
              />
            ))}
          </VideoGrid>
        ) : (
          <VideoEmptyState
            searchTerm={debouncedBusqueda}
            categoria={
              categoriaSeleccionada
                ? categorias.find((c) => c.$id === categoriaSeleccionada)?.nombre
                : undefined
            }
          />
        )}
      </div>
    </Sidebar>
  );
}
