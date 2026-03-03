/**
 * Gestión de Videos - Admin
 * CRUD completo con filtros, búsqueda y paginación
 */

'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Download,
  Loader2,
  Play,
  ExternalLink,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { AdminTable, StatusBadge, Column, Action } from '@/components/admin/AdminTable';
import { AdminModal, FieldConfig } from '@/components/admin/AdminModal';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  getAllVideosAdmin,
  createVideo,
  updateVideo,
  deleteVideo,
  toggleVideoStatus,
  getCategorias,
  Video,
  Categoria,
  generateSlug,
  exportToCSV,
} from '@/lib/appwrite/client';

// Utilidad para combinar clases
const cn = (...inputs: (string | undefined | null | boolean)[]) => {
  return twMerge(clsx(inputs));
});

// Formatear duración
const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Columnas de la tabla
const columns: Column<Video>[] = [
  {
    key: 'thumbnailUrl',
    label: '',
    className: 'w-24',
    render: (video) => (
      <div className="relative h-14 w-20 overflow-hidden rounded-lg bg-gray-100">
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.titulo}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Play className="h-6 w-6 text-gray-400" />
          </div>
        )}
        <div className="absolute bottom-1 right-1 rounded bg-black/70 px-1 text-xs text-white">
          {formatDuration(video.duracion)}
        </div>
      </div>
    ),
  },
  {
    key: 'titulo',
    label: 'Título',
    sortable: true,
    render: (video) => (
      <div>
        <p className="font-medium text-gray-900">{video.titulo}</p>
        <p className="text-xs text-gray-500 truncate max-w-xs">{video.descripcion}</p>
      </div>
    ),
  },
  {
    key: 'videoPlataforma',
    label: 'Plataforma',
    render: (video) => (
      <Badge variant="outline">
        {video.videoPlataforma}
      </Badge>
    ),
  },
  {
    key: 'destacado',
    label: 'Destacado',
    sortable: true,
    render: (video) => (
      video.destacado ? (
        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
      ) : (
        <Star className="h-5 w-5 text-gray-300" />
      )
    ),
  },
  {
    key: 'activo',
    label: 'Estado',
    sortable: true,
    render: (video) => <StatusBadge status={video.activo} />,
  },
  {
    key: 'orden',
    label: 'Orden',
    sortable: true,
    render: (video) => (
      <span className="text-gray-500">{video.orden}</span>
    ),
  },
];

const AdminVideosPage: React.FC = () => {
  // Estado
  const [videos, setVideos] = React.useState<Video[]>([]);
  const [categorias, setCategorias] = React.useState<Categoria[]>([]);
  const [total, setTotal] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [categoriaFilter, setCategoriaFilter] = React.useState<string>('');
  const [estadoFilter, setEstadoFilter] = React.useState<string>('');
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  // Modal
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingVideo, setEditingVideo] = React.useState<Video | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [watchedUrl, setWatchedUrl] = React.useState('');

  // Cargar categorías
  React.useEffect(() => {
    getCategorias().then(setCategorias).catch(console.error);
  }, []);

  // Campos del formulario dinámicos
  const getVideoFields = (): FieldConfig[] => [
    {
      name: 'titulo',
      label: 'Título',
      type: 'text',
      required: true,
      placeholder: 'Título del video',
      className: 'sm:col-span-2',
    },
    {
      name: 'slug',
      label: 'Slug (URL)',
      type: 'text',
      required: true,
      placeholder: 'titulo-del-video',
      hint: 'Se genera automáticamente',
      className: 'sm:col-span-2',
    },
    {
      name: 'descripcion',
      label: 'Descripción',
      type: 'textarea',
      required: true,
      placeholder: 'Descripción del video...',
      rows: 3,
      className: 'col-span-full',
    },
    {
      name: 'categoriaId',
      label: 'Categoría',
      type: 'select',
      required: true,
      options: categorias.map((c) => ({ value: c.$id, label: c.nombre })),
    },
    {
      name: 'videoUrl',
      label: 'URL del Video',
      type: 'url',
      required: true,
      placeholder: 'https://youtube.com/watch?v=...',
      className: 'sm:col-span-2',
    },
    {
      name: 'videoPlataforma',
      label: 'Plataforma',
      type: 'select',
      required: true,
      options: [
        { value: 'youtube', label: 'YouTube' },
        { value: 'vimeo', label: 'Vimeo' },
        { value: 'appwrite', label: 'Appwrite Storage' },
      ],
    },
    {
      name: 'videoId',
      label: 'ID del Video',
      type: 'text',
      required: true,
      placeholder: 'ID del video en la plataforma',
      hint: 'Ej: dQw4w9WgXcQ para YouTube',
    },
    {
      name: 'thumbnailUrl',
      label: 'URL Thumbnail',
      type: 'url',
      placeholder: 'https://...',
      className: 'sm:col-span-2',
    },
    {
      name: 'duracion',
      label: 'Duración (segundos)',
      type: 'number',
      required: true,
      placeholder: '300',
      min: 1,
    },
    {
      name: 'orden',
      label: 'Orden',
      type: 'number',
      placeholder: '0',
      min: 0,
    },
    {
      name: 'destacado',
      label: 'Destacado',
      type: 'checkbox',
    },
    {
      name: 'activo',
      label: 'Activo',
      type: 'checkbox',
      defaultValue: true,
    },
  ];

  // Cargar videos
  const loadVideos = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const filtros: any = {
        limite: pageSize,
        offset: (page - 1) * pageSize,
      };

      if (categoriaFilter) filtros.categoriaId = categoriaFilter;
      if (estadoFilter !== '') filtros.activo = estadoFilter === 'activo';
      if (searchTerm) filtros.buscar = searchTerm;

      const result = await getAllVideosAdmin(filtros);
      setVideos(result.videos);
      setTotal(result.total);
    } catch (error) {
      console.error('Error cargando videos:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, categoriaFilter, estadoFilter, searchTerm]);

  React.useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  // Acciones de la tabla
  const actions: Action<Video>[] = [
    {
      label: 'Ver',
      icon: ExternalLink,
      onClick: (video) => {
        window.open(video.videoUrl, '_blank');
      },
    },
    {
      label: 'Editar',
      icon: Edit,
      onClick: (video) => {
        setEditingVideo(video);
        setIsModalOpen(true);
      },
    },
    {
      label: (video) => video.activo ? 'Desactivar' : 'Activar',
      icon: (video) => video.activo ? EyeOff : Eye,
      onClick: async (video) => {
        try {
          await toggleVideoStatus(video.$id, !video.activo);
          loadVideos();
        } catch (error) {
          console.error('Error cambiando estado:', error);
        }
      },
    },
    {
      label: 'Eliminar',
      icon: Trash2,
      variant: 'destructive',
      onClick: async (video) => {
        if (confirm(`¿Estás seguro de eliminar "${video.titulo}"?`)) {
          try {
            await deleteVideo(video.$id);
            loadVideos();
          } catch (error) {
            console.error('Error eliminando video:', error);
          }
        }
      },
    },
  ];

  // Generar slug automáticamente
  const handleTitleChange = (titulo: string) => {
    const slug = generateSlug(titulo);
    // Esto se maneja en el formulario del modal
  };

  // Guardar video
  const handleSaveVideo = async (data: Record<string, any>) => {
    setIsSaving(true);
    try {
      // Generar slug si no existe
      if (!data.slug) {
        data.slug = generateSlug(data.titulo);
      }

      // Convertir campos numéricos
      data.duracion = parseInt(data.duracion) || 0;
      data.orden = parseInt(data.orden) || 0;

      if (editingVideo) {
        await updateVideo(editingVideo.$id, data);
      } else {
        await createVideo(data);
      }
      loadVideos();
    } catch (error) {
      console.error('Error guardando video:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Exportar a CSV
  const handleExport = () => {
    exportToCSV(
      videos.map((v) => ({
        titulo: v.titulo,
        plataforma: v.videoPlataforma,
        duracion: formatDuration(v.duracion),
        destacado: v.destacado ? 'Sí' : 'No',
        estado: v.activo ? 'Activo' : 'Inactivo',
      })),
      [
        { key: 'titulo', label: 'Título' },
        { key: 'plataforma', label: 'Plataforma' },
        { key: 'duracion', label: 'Duración' },
        { key: 'destacado', label: 'Destacado' },
        { key: 'estado', label: 'Estado' },
      ],
      'videos'
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Videos</h1>
            <p className="text-gray-500">
              Administra los videos de capacitación
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport} disabled={videos.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button
              onClick={() => {
                setEditingVideo(null);
                setIsModalOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Video
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por título..."
                  leftIcon={<Search className="h-4 w-4" />}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={categoriaFilter}
                  onChange={(e) => {
                    setCategoriaFilter(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Todas las categorías</option>
                  {categorias.map((c) => (
                    <option key={c.$id} value={c.$id}>{c.nombre}</option>
                  ))}
                </select>
                <select
                  value={estadoFilter}
                  onChange={(e) => {
                    setEstadoFilter(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Todos los estados</option>
                  <option value="activo">Activos</option>
                  <option value="inactivo">Inactivos</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla */}
        <AdminTable
          columns={columns}
          data={videos}
          keyField="$id"
          actions={actions}
          isLoading={isLoading}
          emptyMessage="No se encontraron videos"
          pagination={{
            page,
            pageSize,
            total,
            onPageChange: setPage,
          }}
        />

        {/* Modal de creación/edición */}
        <AdminModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingVideo(null);
          }}
          title={editingVideo ? 'Editar Video' : 'Nuevo Video'}
          description={editingVideo 
            ? 'Modifica los datos del video' 
            : 'Completa los datos para crear un nuevo video'
          }
          fields={getVideoFields()}
          defaultValues={editingVideo ? {
            titulo: editingVideo.titulo,
            slug: editingVideo.slug,
            descripcion: editingVideo.descripcion,
            categoriaId: editingVideo.categoriaId,
            videoUrl: editingVideo.videoUrl,
            videoPlataforma: editingVideo.videoPlataforma,
            videoId: editingVideo.videoId,
            thumbnailUrl: editingVideo.thumbnailUrl || '',
            duracion: editingVideo.duracion,
            orden: editingVideo.orden,
            destacado: editingVideo.destacado,
            activo: editingVideo.activo,
          } : undefined}
          onSubmit={handleSaveVideo}
          isLoading={isSaving}
          submitLabel={editingVideo ? 'Actualizar' : 'Crear'}
          size="xl"
        />
      </div>
    </AdminLayout>
  );
};

export default AdminVideosPage;
