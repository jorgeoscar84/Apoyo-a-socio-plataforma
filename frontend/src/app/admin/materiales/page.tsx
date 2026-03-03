/**
 * Gestión de Materiales - Admin
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
  Download,
  FileText,
  Star,
  Loader2,
  FileIcon,
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
  getAllMaterialesAdmin,
  createMaterial,
  updateMaterialAdmin,
  deleteMaterial,
  Material,
  generateSlug,
  exportToCSV,
} from '@/lib/appwrite/client';

// Utilidad para combinar clases
const cn = (...inputs: (string | undefined | null | boolean)[]) => {
  return twMerge(clsx(inputs));
});

// Etiquetas de categoría
const categoriaLabels: Record<string, string> = {
  brochure: 'Brochure',
  presentacion: 'Presentación',
  redes: 'Redes Sociales',
  video: 'Video',
  guion: 'Guión',
  casos: 'Casos de Éxito',
};

// Colores de categoría
const categoriaColors: Record<string, string> = {
  brochure: 'bg-blue-100 text-blue-700',
  presentacion: 'bg-purple-100 text-purple-700',
  redes: 'bg-pink-100 text-pink-700',
  video: 'bg-red-100 text-red-700',
  guion: 'bg-yellow-100 text-yellow-700',
  casos: 'bg-green-100 text-green-700',
};

// Columnas de la tabla
const columns: Column<Material>[] = [
  {
    key: 'thumbnail',
    label: '',
    className: 'w-20',
    render: (material) => (
      <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-gray-100">
        {material.thumbnail ? (
          <img
            src={material.thumbnail}
            alt={material.nombre}
            className="h-full w-full rounded-lg object-cover"
          />
        ) : (
          <FileIcon className="h-6 w-6 text-gray-400" />
        )}
      </div>
    ),
  },
  {
    key: 'nombre',
    label: 'Nombre',
    sortable: true,
    render: (material) => (
      <div>
        <p className="font-medium text-gray-900">{material.nombre}</p>
        <p className="text-xs text-gray-500 truncate max-w-xs">{material.descripcion}</p>
      </div>
    ),
  },
  {
    key: 'categoria',
    label: 'Categoría',
    sortable: true,
    render: (material) => (
      <span className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        categoriaColors[material.categoria] || 'bg-gray-100 text-gray-700'
      )}>
        {categoriaLabels[material.categoria] || material.categoria}
      </span>
    ),
  },
  {
    key: 'descargas',
    label: 'Descargas',
    sortable: true,
    render: (material) => (
      <div className="flex items-center gap-1">
        <Download className="h-4 w-4 text-gray-400" />
        <span className="text-gray-900">{material.descargas}</span>
      </div>
    ),
  },
  {
    key: 'destacado',
    label: 'Destacado',
    sortable: true,
    render: (material) => (
      material.destacado ? (
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
    render: (material) => <StatusBadge status={material.activo} />,
  },
];

const AdminMaterialesPage: React.FC = () => {
  // Estado
  const [materiales, setMateriales] = React.useState<Material[]>([]);
  const [total, setTotal] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [categoriaFilter, setCategoriaFilter] = React.useState<string>('');
  const [estadoFilter, setEstadoFilter] = React.useState<string>('');
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  // Modal
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingMaterial, setEditingMaterial] = React.useState<Material | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  // Campos del formulario
  const materialFields: FieldConfig[] = [
    {
      name: 'nombre',
      label: 'Nombre',
      type: 'text',
      required: true,
      placeholder: 'Nombre del material',
      className: 'sm:col-span-2',
    },
    {
      name: 'slug',
      label: 'Slug (URL)',
      type: 'text',
      required: true,
      placeholder: 'nombre-del-material',
      hint: 'Se genera automáticamente',
      className: 'sm:col-span-2',
    },
    {
      name: 'descripcion',
      label: 'Descripción',
      type: 'textarea',
      required: true,
      placeholder: 'Descripción del material...',
      rows: 3,
      className: 'col-span-full',
    },
    {
      name: 'categoria',
      label: 'Categoría',
      type: 'select',
      required: true,
      options: [
        { value: 'brochure', label: 'Brochure' },
        { value: 'presentacion', label: 'Presentación' },
        { value: 'redes', label: 'Redes Sociales' },
        { value: 'video', label: 'Video' },
        { value: 'guion', label: 'Guión' },
        { value: 'casos', label: 'Casos de Éxito' },
      ],
    },
    {
      name: 'tags',
      label: 'Tags (separados por coma)',
      type: 'text',
      placeholder: 'ventas, capacitacion, producto',
      className: 'sm:col-span-2',
    },
    {
      name: 'archivos',
      label: 'URLs de Archivos (JSON)',
      type: 'textarea',
      required: true,
      placeholder: '["https://...", "https://..."]',
      rows: 2,
      hint: 'Array JSON con las URLs de los archivos',
      className: 'col-span-full',
    },
    {
      name: 'thumbnail',
      label: 'URL Thumbnail',
      type: 'url',
      placeholder: 'https://...',
      className: 'sm:col-span-2',
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

  // Cargar materiales
  const loadMateriales = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const filtros: any = {
        limite: pageSize,
        offset: (page - 1) * pageSize,
      };

      if (categoriaFilter) filtros.categoria = categoriaFilter;
      if (estadoFilter !== '') filtros.activo = estadoFilter === 'activo';
      if (searchTerm) filtros.buscar = searchTerm;

      const result = await getAllMaterialesAdmin(filtros);
      setMateriales(result.materiales);
      setTotal(result.total);
    } catch (error) {
      console.error('Error cargando materiales:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, categoriaFilter, estadoFilter, searchTerm]);

  React.useEffect(() => {
    loadMateriales();
  }, [loadMateriales]);

  // Acciones de la tabla
  const actions: Action<Material>[] = [
    {
      label: 'Ver',
      icon: ExternalLink,
      onClick: (material) => {
        try {
          const archivos = JSON.parse(material.archivos);
          if (archivos.length > 0) {
            window.open(archivos[0], '_blank');
          }
        } catch (e) {
          console.error('Error parsing archivos:', e);
        }
      },
    },
    {
      label: 'Editar',
      icon: Edit,
      onClick: (material) => {
        setEditingMaterial(material);
        setIsModalOpen(true);
      },
    },
    {
      label: 'Eliminar',
      icon: Trash2,
      variant: 'destructive',
      onClick: async (material) => {
        if (confirm(`¿Estás seguro de eliminar "${material.nombre}"?`)) {
          try {
            await deleteMaterial(material.$id);
            loadMateriales();
          } catch (error) {
            console.error('Error eliminando material:', error);
          }
        }
      },
    },
  ];

  // Guardar material
  const handleSaveMaterial = async (data: Record<string, any>) => {
    setIsSaving(true);
    try {
      // Generar slug si no existe
      if (!data.slug) {
        data.slug = generateSlug(data.nombre);
      }

      // Validar que archivos sea un JSON válido
      try {
        JSON.parse(data.archivos);
      } catch (e) {
        throw new Error('El campo Archivos debe ser un JSON válido');
      }

      if (editingMaterial) {
        await updateMaterialAdmin(editingMaterial.$id, data);
      } else {
        await createMaterial(data);
      }
      loadMateriales();
    } catch (error) {
      console.error('Error guardando material:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Exportar a CSV
  const handleExport = () => {
    exportToCSV(
      materiales.map((m) => ({
        nombre: m.nombre,
        categoria: categoriaLabels[m.categoria],
        descargas: m.descargas,
        destacado: m.destacado ? 'Sí' : 'No',
        estado: m.activo ? 'Activo' : 'Inactivo',
      })),
      [
        { key: 'nombre', label: 'Nombre' },
        { key: 'categoria', label: 'Categoría' },
        { key: 'descargas', label: 'Descargas' },
        { key: 'destacado', label: 'Destacado' },
        { key: 'estado', label: 'Estado' },
      ],
      'materiales'
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Materiales</h1>
            <p className="text-gray-500">
              Administra los materiales de apoyo
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport} disabled={materiales.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button
              onClick={() => {
                setEditingMaterial(null);
                setIsModalOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Material
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por nombre..."
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
                  {Object.entries(categoriaLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
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
          data={materiales}
          keyField="$id"
          actions={actions}
          isLoading={isLoading}
          emptyMessage="No se encontraron materiales"
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
            setEditingMaterial(null);
          }}
          title={editingMaterial ? 'Editar Material' : 'Nuevo Material'}
          description={editingMaterial 
            ? 'Modifica los datos del material' 
            : 'Completa los datos para crear un nuevo material'
          }
          fields={materialFields}
          defaultValues={editingMaterial ? {
            nombre: editingMaterial.nombre,
            slug: editingMaterial.slug,
            descripcion: editingMaterial.descripcion,
            categoria: editingMaterial.categoria,
            tags: editingMaterial.tags || '',
            archivos: editingMaterial.archivos,
            thumbnail: editingMaterial.thumbnail || '',
            destacado: editingMaterial.destacado,
            activo: editingMaterial.activo,
          } : undefined}
          onSubmit={handleSaveMaterial}
          isLoading={isSaving}
          submitLabel={editingMaterial ? 'Actualizar' : 'Crear'}
          size="xl"
        />
      </div>
    </AdminLayout>
  );
};

export default AdminMaterialesPage;
