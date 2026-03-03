/**
 * Componente AdminTable
 * Tabla reutilizable con paginación, ordenamiento y acciones
 */

'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Loader2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Utilidad para combinar clases
const cn = (...inputs: (string | undefined | null | boolean)[]) => {
  return twMerge(clsx(inputs));
};

// Tipos
export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

export interface Action<T> {
  label: string;
  icon?: React.ElementType;
  onClick: (item: T) => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  show?: (item: T) => boolean;
}

export interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  actions?: Action<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  // Paginación
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
  };
  // Ordenamiento
  sorting?: {
    field: string;
    direction: 'asc' | 'desc';
    onSort: (field: string) => void;
  };
  // Selección
  selection?: {
    selected: string[];
    onSelectionChange: (selected: string[]) => void;
  };
  className?: string;
}

export function AdminTable<T extends Record<string, any>>({
  columns,
  data,
  keyField,
  actions,
  isLoading = false,
  emptyMessage = 'No hay datos disponibles',
  pagination,
  sorting,
  selection,
  className,
}: AdminTableProps<T>) {
  const [showActionsMenu, setShowActionsMenu] = React.useState<string | null>(null);

  // Calcular total de páginas
  const totalPages = pagination ? Math.ceil(pagination.total / pagination.pageSize) : 1;

  // Manejar ordenamiento
  const handleSort = (field: string) => {
    if (sorting?.onSort) {
      sorting.onSort(field);
    }
  };

  // Renderizar indicador de ordenamiento
  const renderSortIcon = (field: string) => {
    if (!sorting) return null;

    if (sorting.field !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400" />;
    }

    return sorting.direction === 'asc' ? (
      <ArrowUp className="ml-2 h-4 w-4 text-primary" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4 text-primary" />
    );
  };

  // Manejar selección
  const handleSelectAll = (checked: boolean) => {
    if (!selection) return;

    if (checked) {
      selection.onSelectionChange(data.map((item) => item[keyField]));
    } else {
      selection.onSelectionChange([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (!selection) return;

    if (checked) {
      selection.onSelectionChange([...selection.selected, id]);
    } else {
      selection.onSelectionChange(selection.selected.filter((s) => s !== id));
    }
  };

  // Verificar si todos están seleccionados
  const allSelected = selection && data.length > 0 && 
    data.every((item) => selection.selected.includes(item[keyField]));

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('overflow-hidden rounded-lg border bg-white', className)}>
      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              {/* Checkbox de selección */}
              {selection && (
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </th>
              )}
              {/* Columnas */}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 py-3 font-medium text-gray-700',
                    column.sortable && 'cursor-pointer select-none hover:bg-gray-100',
                    column.className
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.label}
                    {column.sortable && renderSortIcon(column.key)}
                  </div>
                </th>
              ))}
              {/* Columna de acciones */}
              {actions && <th className="w-24 px-4 py-3 text-right">Acciones</th>}
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.map((item) => {
              const id = item[keyField];
              const isSelected = selection?.selected.includes(id);

              return (
                <tr
                  key={id}
                  className={cn(
                    'hover:bg-gray-50 transition-colors',
                    isSelected && 'bg-primary/5'
                  )}
                >
                  {/* Checkbox de selección */}
                  {selection && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSelectItem(id, e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </td>
                  )}
                  {/* Celdas */}
                  {columns.map((column) => (
                    <td key={column.key} className={cn('px-4 py-3', column.className)}>
                      {column.render
                        ? column.render(item)
                        : item[column.key]}
                    </td>
                  ))}
                  {/* Acciones */}
                  {actions && (
                    <td className="px-4 py-3 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() => setShowActionsMenu(showActionsMenu === id ? null : id)}
                          className="rounded-lg p-1 hover:bg-gray-100"
                        >
                          <MoreHorizontal className="h-5 w-5 text-gray-500" />
                        </button>
                        {showActionsMenu === id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setShowActionsMenu(null)}
                            />
                            <div className="absolute right-0 z-20 mt-1 w-40 origin-top-right rounded-lg border bg-white py-1 shadow-lg">
                              {actions.map((action, index) => {
                                if (action.show && !action.show(item)) return null;
                                
                                return (
                                  <button
                                    key={index}
                                    onClick={() => {
                                      action.onClick(item);
                                      setShowActionsMenu(null);
                                    }}
                                    className={cn(
                                      'flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-50',
                                      action.variant === 'destructive' && 'text-red-600 hover:bg-red-50'
                                    )}
                                  >
                                    {action.icon && <action.icon className="h-4 w-4" />}
                                    {action.label}
                                  </button>
                                );
                              })}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {pagination && (
        <div className="flex flex-col items-center justify-between gap-4 border-t px-4 py-3 sm:flex-row">
          <div className="text-sm text-gray-500">
            Mostrando {((pagination.page - 1) * pagination.pageSize) + 1} a{' '}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} de{' '}
            {pagination.total} resultados
          </div>
          <div className="flex items-center gap-2">
            {/* Primera página */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(1)}
              disabled={pagination.page === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            {/* Página anterior */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {/* Número de página */}
            <span className="px-4 text-sm font-medium">
              {pagination.page} / {totalPages}
            </span>
            {/* Página siguiente */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            {/* Última página */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(totalPages)}
              disabled={pagination.page === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para mostrar estados/badges comunes
export const StatusBadge: React.FC<{ 
  status: boolean | string; 
  activeLabel?: string;
  inactiveLabel?: string;
}> = ({ 
  status, 
  activeLabel = 'Activo', 
  inactiveLabel = 'Inactivo' 
}) => {
  const isActive = status === true || status === 'active' || status === 'activo';
  
  return (
    <Badge variant={isActive ? 'success' : 'secondary'}>
      {isActive ? activeLabel : inactiveLabel}
    </Badge>
  );
};

export default AdminTable;
