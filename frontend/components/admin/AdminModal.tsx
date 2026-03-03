/**
 * Componente AdminModal
 * Modal de creación/edición con formulario dinámico
 */

'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2, X } from 'lucide-react';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Utilidad para combinar clases
const cn = (...inputs: (string | undefined | null | boolean)[]) => {
  return twMerge(clsx(inputs));
});

// Tipos de campos
export type FieldType = 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'date' | 'url';

// Configuración de campo
export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  options?: { value: string; label: string }[];
  validation?: z.ZodType<any>;
  defaultValue?: any;
  className?: string;
  rows?: number; // para textarea
  min?: number;
  max?: number;
  step?: number;
}

// Props del componente
export interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  fields: FieldConfig[];
  defaultValues?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => Promise<void> | void;
  isLoading?: boolean;
  submitLabel?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

// Generar esquema Zod dinámicamente
function generateSchema(fields: FieldConfig[]): z.ZodObject<any> {
  const shape: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    let schema: z.ZodTypeAny;

    switch (field.type) {
      case 'email':
        schema = z.string().email('Email inválido');
        break;
      case 'number':
        schema = z.number();
        if (field.min !== undefined) schema = (schema as z.ZodNumber).min(field.min);
        if (field.max !== undefined) schema = (schema as z.ZodNumber).max(field.max);
        break;
      case 'url':
        schema = z.string().url('URL inválida');
        break;
      case 'checkbox':
        schema = z.boolean();
        break;
      case 'date':
        schema = z.string().regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/, 'Fecha inválida');
        break;
      default:
        schema = z.string();
        if (field.type === 'textarea' && field.rows) {
          // Sin validación especial
        }
    }

    // Usar validación personalizada si existe
    if (field.validation) {
      schema = field.validation;
    }

    // Marcar como opcional si no es requerido
    if (!field.required) {
      schema = schema.optional().nullable();
    } else if (field.type !== 'checkbox') {
      // Para campos requeridos que no son checkbox
      if (schema instanceof z.ZodString) {
        schema = schema.min(1, `${field.label} es requerido`);
      }
    }

    shape[field.name] = schema;
  });

  return z.object(shape);
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  fields,
  defaultValues,
  onSubmit,
  isLoading = false,
  submitLabel = 'Guardar',
  size = 'lg',
}) => {
  // Generar esquema y formulario
  const schema = React.useMemo(() => generateSchema(fields), [fields]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    watch,
    setValue,
  } = useForm<Record<string, any>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || {},
  });

  // Resetear formulario cuando cambian los valores por defecto
  React.useEffect(() => {
    if (isOpen && defaultValues) {
      reset(defaultValues);
    } else if (isOpen) {
      reset({});
    }
  }, [isOpen, defaultValues, reset]);

  // Manejar envío
  const handleFormSubmit = async (data: Record<string, any>) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  // Renderizar campo
  const renderField = (field: FieldConfig) => {
    const error = errors[field.name]?.message as string | undefined;

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.name} className={cn('col-span-full', field.className)}>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              {...register(field.name)}
              placeholder={field.placeholder}
              disabled={field.disabled || isLoading}
              rows={field.rows || 4}
              className={cn(
                'w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors',
                'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0',
                'disabled:cursor-not-allowed disabled:opacity-50',
                error
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-primary focus:ring-primary'
              )}
            />
            {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
            {field.hint && !error && <p className="mt-1.5 text-sm text-gray-500">{field.hint}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className={field.className}>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              {...register(field.name)}
              disabled={field.disabled || isLoading}
              className={cn(
                'w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-offset-0',
                'disabled:cursor-not-allowed disabled:opacity-50',
                error
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-primary focus:ring-primary'
              )}
            >
              <option value="">Seleccionar...</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
            {field.hint && !error && <p className="mt-1.5 text-sm text-gray-500">{field.hint}</p>}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.name} className={cn('flex items-center gap-2', field.className)}>
            <input
              type="checkbox"
              {...register(field.name)}
              disabled={field.disabled || isLoading}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label className="text-sm font-medium text-gray-700">
              {field.label}
            </label>
            {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'date':
        return (
          <div key={field.name} className={field.className}>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="datetime-local"
              {...register(field.name)}
              disabled={field.disabled || isLoading}
              className={cn(
                'w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-offset-0',
                'disabled:cursor-not-allowed disabled:opacity-50',
                error
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-primary focus:ring-primary'
              )}
            />
            {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
            {field.hint && !error && <p className="mt-1.5 text-sm text-gray-500">{field.hint}</p>}
          </div>
        );

      case 'number':
        return (
          <div key={field.name} className={field.className}>
            <Input
              label={field.label}
              type="number"
              placeholder={field.placeholder}
              hint={field.hint}
              error={error}
              disabled={field.disabled || isLoading}
              step={field.step}
              {...register(field.name, { valueAsNumber: true })}
            />
          </div>
        );

      default:
        return (
          <div key={field.name} className={field.className}>
            <Input
              label={field.label}
              type={field.type}
              placeholder={field.placeholder}
              hint={field.hint}
              error={error}
              disabled={field.disabled || isLoading}
              {...register(field.name)}
            />
          </div>
        );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size}>
      <ModalHeader>
        <ModalTitle>{title}</ModalTitle>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </ModalHeader>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <ModalBody>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map(renderField)}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !isDirty}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default AdminModal;
