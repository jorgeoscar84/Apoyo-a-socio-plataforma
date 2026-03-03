/**
 * Gestión de Eventos - Admin
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
  Users,
  Calendar,
  MapPin,
  Video,
  Download,
  Loader2,
  Clock,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { AdminTable, StatusBadge, Column, Action } from '@/components/admin/AdminTable';
import { AdminModal, FieldConfig } from '@/components/admin/AdminModal';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  getAllEventosAdmin,
  createEvento,
  updateEventoAdmin,
  deleteEvento,
  Evento,
  generateSlug,
  exportToCSV,
} from '@/lib/appwrite/client';

// Utilidad para combinar clases
const cn = (...inputs: (string | undefined | null | boolean)[]) => {
  return twMerge(clsx(inputs));
});

// Formatear fecha
const formatFecha = (fecha: string): string => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Etiquetas de tipo de evento
const tipoLabels: Record<string, string> = {
  presentacion: 'Presentación',
  demo: 'Demo',
  entrenamiento: 'Entrenamiento',
  qa: 'Q&A',
  masterclass: 'Masterclass',
};

// Columnas de la tabla
const columns: Column<Evento>[] = [
  {
    key: 'fechaHora',
    label: 'Fecha',
    sortable: true,
    render: (evento) => (
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-gray-400" />
        <div>
          <p className="text-sm font-medium text-gray-900">
            {new Date(evento.fechaHora).toLocaleDateString('es-ES', {
              month: 'short',
              day: 'numeric',
            })}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(evento.fechaHora).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: 'titulo',
    label: 'Título',
    sortable: true,
    render: (evento) => (
      <div>
        <p className="font-medium text-gray-900">{evento.titulo}</p>
        <p className="text-xs text-gray-500">{tipoLabels[evento.tipo]}</p>
      </div>
    ),
  },
  {
    key: 'modalidad',
    label: 'Modalidad',
    render: (evento) => (
      <Badge variant={evento.modalidad === 'virtual' ? 'info' : 'warning'}>
        {evento.modalidad === 'virtual' ? (
          <Video className="mr-1 h-3 w-3" />
        ) : (
          <MapPin className="mr-1 h-3 w-3" />
        )}
        {evento.modalidad}
      </Badge>
    ),
  },
  {
    key: 'inscritos',
    label: 'Inscritos',
    sortable: true,
    render: (evento) => (
      <div className="flex items-center gap-1">
        <Users className="h-4 w-4 text-gray-400" />
        <span className="text-gray-900">
          {evento.inscritos}
          {evento.capacidad && ` / ${evento.capacidad}`}
        </span>
      </div>
    ),
  },
  {
    key: 'activo',
    label: 'Estado',
    sortable: true,
    render: (evento) => {
      const isPast = new Date(evento.fechaHora) < new Date();
      return (
        <div className="flex flex-col gap-1">
          <StatusBadge status={evento.activo} />
          {isPast && (
            <Badge variant="outline" className="text-xs">Pasado</Badge>
          )}
        </div>
      );
    },
  },
];

const AdminEventosPage: React.FC = () => {
  // Estado
  const [eventos, setEventos] = React.useState<Evento[]>([]);
  const [total, setTotal] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [tipoFilter, setTipoFilter] = React.useState<string>('');
  const [modalidadFilter, setModalidadFilter] = React.useState<string>('');
  const [estadoFilter, setEstadoFilter] = React.useState<string>('');
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  // Modal
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingEvento, setEditingEvento] = React.useState<Evento | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  // Campos del formulario
  const eventoFields: FieldConfig[] = [
    {
      name: 'titulo',
      label: 'Título',
      type: 'text',
      required: true,
      placeholder: 'Título del evento',
      className: 'sm:col-span-2',
    },
    {
      name: 'slug',
      label: 'Slug (URL)',
      type: 'text',
      required: true,
      placeholder: 'titulo-del-evento',
      hint: 'Se genera automáticamente',
      className: 'sm:col-span-2',
    },
    {
      name: 'descripcion',
      label: 'Descripción',
      type: 'textarea',
      required: true,
      placeholder: 'Descripción del evento...',
      rows: 3,
      className: 'col-span-full',
    },
    {
      name: 'tipo',
      label: 'Tipo de Evento',
      type: 'select',
      required: true,
      options: [
        { value: 'presentacion', label: 'Presentación' },
        { value: 'demo', label: 'Demo' },
        { value: 'entrenamiento', label: 'Entrenamiento' },
        { value: 'qa', label: 'Q&A' },
        { value: 'masterclass', label: 'Masterclass' },
      ],
    },
    {
      name: 'fechaHora',
      label: 'Fecha y Hora',
      type: 'date',
      required: true,
    },
    {
      name: 'duracion',
      label: 'Duración (minutos)',
      type: 'number',
      required: true,
      placeholder: '60',
      min: 1,
    },
    {
      name: 'modalidad',
      label: 'Modalidad',
      type: 'select',
      required: true,
      options: [
        { value: 'virtual', label: 'Virtual' },
        { value: 'presencial', label: 'Presencial' },
      ],
    },
    {
      name: 'lugar',
      label: 'Lugar',
      type: 'text',
      placeholder: 'Dirección del lugar',
      className: 'sm:col-span-2',
    },
    {
      name: 'enlaceVirtual',
      label: 'Enlace Virtual',
      type: 'url',
      placeholder: 'https://zoom.us/j/...',
      className: 'sm:col-span-2',
    },
    {
      name: 'plataformaVirtual',
      label: 'Plataforma',
      type: 'select',
      options: [
        { value: 'zoom', label: 'Zoom' },
        { value: 'meet', label: 'Google Meet' },
        { value: 'teams', label: 'Microsoft Teams' },
      ],
    },
    {
      name: 'capacidad',
      label: 'Capacidad Máxima',
      type: 'number',
      placeholder: '0 = sin límite',
      min: 0,
    },
    {
      name: 'instructorNombre',
      label: 'Nombre del Instructor',
      type: 'text',
      required: true,
      placeholder: 'Nombre completo',
    },
    {
      name: 'instructorCargo',
      label: 'Cargo del Instructor',
      type: 'text',
      placeholder: 'Cargo o título',
    },
    {
      name: 'activo',
      label: 'Activo',
      type: 'checkbox',
      defaultValue: true,
    },
  ];

  // Cargar eventos
  const loadEventos = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const filtros: any = {
        limite: pageSize,
        offset: (page - 1) * pageSize,
      };

      if (tipoFilter) filtros.tipo = tipoFilter;
      if (modalidadFilter) filtros.modalidad = modalidadFilter;
      if (estadoFilter === 'proximos') filtros.proximos = true;
      if (estadoFilter === 'pasados') filtros.pasados = true;
      if (searchTerm) filtros.buscar = searchTerm;

      const result = await getAllEventosAdmin(filtros);
      setEventos(result.eventos);
      setTotal(result.total);
    } catch (error) {
      console.error('Error cargando eventos:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, tipoFilter, modalidadFilter, estadoFilter, searchTerm]);

  React.useEffect(() => {
    loadEventos();
  }, [loadEventos]);

  // Acciones de la tabla
  const actions: Action<Evento>[] = [
    {
      label: 'Editar',
      icon: Edit,
      onClick: (evento) => {
        setEditingEvento(evento);
        setIsModalOpen(true);
      },
    },
    {
      label: 'Ver Inscritos',
      icon: Users,
      onClick: (evento) => {
        // TODO: Implementar vista de inscritos
        console.log('Ver inscritos:', evento);
      },
    },
    {
      label: 'Eliminar',
      icon: Trash2,
      variant: 'destructive',
      onClick: async (evento) => {
        if (confirm(`¿Estás seguro de eliminar "${evento.titulo}"?`)) {
          try {
            await deleteEvento(evento.$id);
            loadEventos();
          } catch (error) {
            console.error('Error eliminando evento:', error);
          }
        }
      },
    },
  ];

  // Guardar evento
  const handleSaveEvento = async (data: Record<string, any>) => {
    setIsSaving(true);
    try {
      // Generar slug si no existe
      if (!data.slug) {
        data.slug = generateSlug(data.titulo);
      }

      // Convertir campos numéricos
      data.duracion = parseInt(data.duracion) || 60;
      data.capacidad = data.capacidad ? parseInt(data.capacidad) : null;

      if (editingEvento) {
        await updateEventoAdmin(editingEvento.$id, data);
      } else {
        await createEvento(data);
      }
      loadEventos();
    } catch (error) {
      console.error('Error guardando evento:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Exportar a CSV
  const handleExport = () => {
    exportToCSV(
      eventos.map((e) => ({
        titulo: e.titulo,
        tipo: tipoLabels[e.tipo],
        fecha: formatFecha(e.fechaHora),
        modalidad: e.modalidad,
        inscritos: e.inscritos,
        capacidad: e.capacidad || 'Sin límite',
        estado: e.activo ? 'Activo' : 'Inactivo',
      })),
      [
        { key: 'titulo', label: 'Título' },
        { key: 'tipo', label: 'Tipo' },
        { key: 'fecha', label: 'Fecha' },
        { key: 'modalidad', label: 'Modalidad' },
        { key: 'inscritos', label: 'Inscritos' },
        { key: 'capacidad', label: 'Capacidad' },
        { key: 'estado', label: 'Estado' },
      ],
      'eventos'
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Eventos</h1>
            <p className="text-gray-500">
              Administra los eventos de capacitación
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport} disabled={eventos.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button
              onClick={() => {
                setEditingEvento(null);
                setIsModalOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Evento
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
              <div className="flex flex-wrap gap-2">
                <select
                  value={tipoFilter}
                  onChange={(e) => {
                    setTipoFilter(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Todos los tipos</option>
                  {Object.entries(tipoLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <select
                  value={modalidadFilter}
                  onChange={(e) => {
                    setModalidadFilter(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Todas las modalidades</option>
                  <option value="virtual">Virtual</option>
                  <option value="presencial">Presencial</option>
                </select>
                <select
                  value={estadoFilter}
                  onChange={(e) => {
                    setEstadoFilter(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Todos</option>
                  <option value="proximos">Próximos</option>
                  <option value="pasados">Pasados</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla */}
        <AdminTable
          columns={columns}
          data={eventos}
          keyField="$id"
          actions={actions}
          isLoading={isLoading}
          emptyMessage="No se encontraron eventos"
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
            setEditingEvento(null);
          }}
          title={editingEvento ? 'Editar Evento' : 'Nuevo Evento'}
          description={editingEvento 
            ? 'Modifica los datos del evento' 
            : 'Completa los datos para crear un nuevo evento'
          }
          fields={eventoFields}
          defaultValues={editingEvento ? {
            titulo: editingEvento.titulo,
            slug: editingEvento.slug,
            descripcion: editingEvento.descripcion,
            tipo: editingEvento.tipo,
            fechaHora: editingEvento.fechaHora.substring(0, 16),
            duracion: editingEvento.duracion,
            modalidad: editingEvento.modalidad,
            lugar: editingEvento.lugar || '',
            enlaceVirtual: editingEvento.enlaceVirtual || '',
            plataformaVirtual: editingEvento.plataformaVirtual || '',
            capacidad: editingEvento.capacidad || '',
            instructorNombre: editingEvento.instructorNombre,
            instructorCargo: editingEvento.instructorCargo || '',
            activo: editingEvento.activo,
          } : undefined}
          onSubmit={handleSaveEvento}
          isLoading={isSaving}
          submitLabel={editingEvento ? 'Actualizar' : 'Crear'}
          size="xl"
        />
      </div>
    </AdminLayout>
  );
};

export default AdminEventosPage;
