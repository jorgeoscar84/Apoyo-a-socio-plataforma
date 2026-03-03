/**
 * Componente Badge
 * Etiquetas de estado/colores reutilizables
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utilidad para combinar clases
const cn = (...inputs: (string | undefined | null | boolean)[]) => {
  return twMerge(clsx(inputs));
};

const badgeVariants = cva({
  base: 'inline-flex items-center justify-center rounded-full font-medium transition-colors',
  variants: {
    variant: {
      default: 'bg-gray-100 text-gray-800',
      primary: 'bg-primary-light text-primary-dark',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      info: 'bg-blue-100 text-blue-800',
    },
    size: {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, icon, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {icon && <span className="mr-1">{icon}</span>}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// Componentes pre-configurados para estados comunes
export const StatusBadge = {
  Active: ({ children }: { children?: React.ReactNode }) => (
    <Badge variant="success">{children || 'Activo'}</Badge>
  ),
  Inactive: ({ children }: { children?: React.ReactNode }) => (
    <Badge variant="default">{children || 'Inactivo'}</Badge>
  ),
  Pending: ({ children }: { children?: React.ReactNode }) => (
    <Badge variant="warning">{children || 'Pendiente'}</Badge>
  ),
  Error: ({ children }: { children?: React.ReactNode }) => (
    <Badge variant="error">{children || 'Error'}</Badge>
  ),
  Completed: ({ children }: { children?: React.ReactNode }) => (
    <Badge variant="success">{children || 'Completado'}</Badge>
  ),
  Live: ({ children }: { children?: React.ReactNode }) => (
    <Badge variant="error">{children || 'En vivo'}</Badge>
  ),
  Upcoming: ({ children }: { children?: React.ReactNode }) => (
    <Badge variant="info">{children || 'Próximo'}</Badge>
  ),
  Draft: ({ children }: { children?: React.ReactNode }) => (
    <Badge variant="default">{children || 'Borrador'}</Badge>
  ),
};
