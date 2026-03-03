/**
 * Gestión de Usuarios - Admin
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
  UserX,
  UserCheck,
  Filter,
  Download,
  Loader2,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { AdminTable, StatusBadge, Column, Action } from '@/components/admin/AdminTable';
import { AdminModal, FieldConfig } from '@/components/admin/AdminModal';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  getAllUsers,
  createUser,
  updateUser,
  toggleUserStatus,
  deleteUser,
  Usuario,
  exportToCSV,
} from '@/lib/appwrite/client';

// Utilidad para combinar clases
const cn = (...inputs: (string | undefined | null | boolean)[]) => {
  return twMerge(clsx(inputs));
});

// Columnas de la tabla
const columns: Column<Usuario>[] = [
  {
    key: 'nombre',
    label: 'Nombre',
    sortable: true,
    render: (user) => (
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.nombre}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <span className="text-sm font-medium text-gray-600">
              {user.nombre.charAt(0)}{user.apellido.charAt(0)}
            </span>
          )}
        </div>
        <div>
          <p className="font-medium text-gray-900">
            {user.nombre} {user.apellido}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: 'email',
    label: 'Email',
    sortable: true,
    render: (user) => (
      <span className="text-gray-600">{user.email}</span>
    ),
  },
  {
    key: 'rol',
    label: 'Rol',
    sortable: true,
    render: (user) => {
      const variants: Record<string, 'default' | 'primary' | 'secondary' | 'destructive'> = {
        ADMIN: 'destructive',
        ASESOR: 'secondary',
        SOCIO: 'default',
      };
      return (
        <Badge variant={variants[user.rol] || 'default'}>
          {user.rol}
        </Badge>
      );
    },
  },
  {
    key: 'activo',
    label: 'Estado',
    sortable: true,
    render: (user) => <StatusBadge status={user.activo} />,
  },
  {
    key: 'creadoEn',
    label: 'Registro',
    sortable: true,
    render: (user) => (
      <span className="text-gray-500 text-sm">
        {new Date(user.creadoEn).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </span>
    ),
  },
];

// Campos del formulario
const userFields: FieldConfig[] = [
  {
    name: 'nombre',
    label: 'Nombre',
    type: 'text',
    required: true,
    placeholder: 'Nombre del usuario',
  },
  {
    name: 'apellido',
    label: 'Apellido',
    type: 'text',
    required: true,
    placeholder: 'Apellido del usuario',
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    placeholder: 'correo@ejemplo.com',
  },
  {
    name: 'telefono',
    label: 'Teléfono',
    type: 'text',
    placeholder: '+52 123 456 7890',
  },
  {
    name: 'rol',
    label: 'Rol',
    type: 'select',
    required: true,
    options: [
      { value: 'SOCIO', label: 'Socio' },
      { value: 'ASESOR', label: 'Asesor' },
      { value: 'ADMIN', label: 'Administrador' },
    ],
  },
  {
    name: 'activo',
    label: 'Usuario activo',
    type: 'checkbox',
    defaultValue: true,
  },
];

const AdminUsuariosPage: React.FC = () => {
  // Estado
  const [usuarios, setUsuarios] = React.useState<Usuario[]>([]);
  const [total, setTotal] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [rolFilter, setRolFilter] = React.useState<string>('');
  const [estadoFilter, setEstadoFilter] = React.useState<string>('');
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  // Modal
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<Usuario | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  // Cargar usuarios
  const loadUsuarios = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const filtros: any = {
        limite: pageSize,
        offset: (page - 1) * pageSize,
        ordenar: 'recientes',
      };

      if (rolFilter) filtros.rol = rolFilter;
      if (estadoFilter !== '') filtros.activo = estadoFilter === 'activo';
      if (searchTerm) filtros.buscar = searchTerm;

      const result = await getAllUsers(filtros);
      setUsuarios(result.usuarios);
      setTotal(result.total);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, rolFilter, estadoFilter, searchTerm]);

  React.useEffect(() => {
    loadUsuarios();
  }, [loadUsuarios]);

  // Acciones de la tabla
  const actions: Action<Usuario>[] = [
    {
      label: 'Ver detalle',
      icon: Eye,
      onClick: (user) => {
        // TODO: Implementar vista de detalle
        console.log('Ver usuario:', user);
      },
    },
    {
      label: 'Editar',
      icon: Edit,
      onClick: (user) => {
        setEditingUser(user);
        setIsModalOpen(true);
      },
    },
    {
      label: (user) => user.activo ? 'Desactivar' : 'Activar',
      icon: (user) => user.activo ? UserX : UserCheck,
      onClick: async (user) => {
        try {
          await toggleUserStatus(user.$id, !user.activo);
          loadUsuarios();
        } catch (error) {
          console.error('Error cambiando estado:', error);
        }
      },
    },
    {
      label: 'Eliminar',
      icon: Trash2,
      variant: 'destructive',
      onClick: async (user) => {
        if (confirm(`¿Estás seguro de eliminar a ${user.nombre} ${user.apellido}?`)) {
          try {
            await deleteUser(user.$id);
            loadUsuarios();
          } catch (error) {
            console.error('Error eliminando usuario:', error);
          }
        }
      },
    },
  ];

  // Guardar usuario
  const handleSaveUser = async (data: Record<string, any>) => {
    setIsSaving(true);
    try {
      if (editingUser) {
        await updateUser(editingUser.$id, data);
      } else {
        await createUser(data as any);
      }
      loadUsuarios();
    } catch (error) {
      console.error('Error guardando usuario:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Exportar a CSV
  const handleExport = () => {
    exportToCSV(
      usuarios.map((u) => ({
        nombre: `${u.nombre} ${u.apellido}`,
        email: u.email,
        rol: u.rol,
        estado: u.activo ? 'Activo' : 'Inactivo',
        registro: new Date(u.creadoEn).toLocaleDateString('es-ES'),
      })),
      [
        { key: 'nombre', label: 'Nombre' },
        { key: 'email', label: 'Email' },
        { key: 'rol', label: 'Rol' },
        { key: 'estado', label: 'Estado' },
        { key: 'registro', label: 'Fecha Registro' },
      ],
      'usuarios'
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
            <p className="text-gray-500">
              Administra los usuarios de la plataforma
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport} disabled={usuarios.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button
              onClick={() => {
                setEditingUser(null);
                setIsModalOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Usuario
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
                  value={rolFilter}
                  onChange={(e) => {
                    setRolFilter(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Todos los roles</option>
                  <option value="SOCIO">Socio</option>
                  <option value="ASESOR">Asesor</option>
                  <option value="ADMIN">Administrador</option>
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
          data={usuarios}
          keyField="$id"
          actions={actions}
          isLoading={isLoading}
          emptyMessage="No se encontraron usuarios"
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
            setEditingUser(null);
          }}
          title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
          description={editingUser 
            ? 'Modifica los datos del usuario' 
            : 'Completa los datos para crear un nuevo usuario'
          }
          fields={userFields}
          defaultValues={editingUser ? {
            nombre: editingUser.nombre,
            apellido: editingUser.apellido,
            email: editingUser.email,
            telefono: editingUser.telefono || '',
            rol: editingUser.rol,
            activo: editingUser.activo,
          } : undefined}
          onSubmit={handleSaveUser}
          isLoading={isSaving}
          submitLabel={editingUser ? 'Actualizar' : 'Crear'}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminUsuariosPage;
