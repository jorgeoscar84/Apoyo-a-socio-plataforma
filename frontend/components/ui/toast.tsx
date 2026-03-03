/**
 * Componente Toast
 * Sistema de notificaciones usando Radix UI Toast
 */

'use client';

import * as React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utilidad para combinar clases
const cn = (...inputs: (string | undefined | null | boolean)[]) => {
  return twMerge(clsx(inputs));
};

const toastVariants = cva({
  base: 'group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-lg border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full',
  variants: {
    variant: {
      default: 'border-gray-200 bg-white text-gray-900',
      success: 'border-green-200 bg-green-50 text-green-900',
      error: 'border-red-200 bg-red-50 text-red-900',
      warning: 'border-yellow-200 bg-yellow-50 text-yellow-900',
      info: 'border-blue-200 bg-blue-50 text-blue-900',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

// Provider
export interface ToastProviderProps {
  children: React.ReactNode;
  swipeDirection?: 'right' | 'left' | 'up' | 'down';
}

export const ToastProvider = ({ children, swipeDirection = 'right' }: ToastProviderProps) => {
  return (
    <ToastPrimitives.Provider swipeDirection={swipeDirection}>
      {children}
      <ToastViewport />
    </ToastPrimitives.Provider>
  );
};

// Viewport
const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

// Icono según variante
const ToastIcon = ({ variant }: { variant: 'default' | 'success' | 'error' | 'warning' | 'info' }) => {
  const icons = {
    default: <Info className="h-5 w-5 text-gray-500" />,
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
  };
  return icons[variant] || icons.default;
};

// Toast Component
export interface ToastProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>,
    VariantProps<typeof toastVariants> {
  title?: string;
  description?: string;
}

export const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  ToastProps
>(({ className, variant, title, description, children, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    >
      <div className="flex items-start gap-3">
        <ToastIcon variant={variant || 'default'} />
        <div className="grid gap-1">
          {title && (
            <ToastPrimitives.Title className="text-sm font-semibold">
              {title}
            </ToastPrimitives.Title>
          )}
          {description && (
            <ToastPrimitives.Description className="text-sm opacity-90">
              {description}
            </ToastPrimitives.Description>
          )}
          {children}
        </div>
      </div>
      <ToastPrimitives.Close className="absolute right-1 top-1 rounded-md p-1 text-gray-500 opacity-0 transition-opacity hover:text-gray-900 focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100">
        <X className="h-4 w-4" />
      </ToastPrimitives.Close>
    </ToastPrimitives.Root>
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

// Contexto para manejar toasts programáticamente
type ToastType = {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
};

type ToastContextType = {
  toasts: ToastType[];
  toast: (toast: Omit<ToastType, 'id'>) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
};

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastContextProvider');
  }
  return context;
};

export const ToastContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = React.useState<ToastType[]>([]);

  const toast = React.useCallback((newToast: Omit<ToastType, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const duration = newToast.duration ?? 5000;
    
    setToasts((prev) => [...prev, { ...newToast, id }]);
    
    // Auto-dismiss
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = React.useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss, dismissAll }}>
      <ToastProvider>
        {children}
        {toasts.map((t) => (
          <Toast
            key={t.id}
            variant={t.variant}
            title={t.title}
            description={t.description}
            onOpenChange={(open) => !open && dismiss(t.id)}
          />
        ))}
      </ToastProvider>
    </ToastContext.Provider>
  );
};

// Funciones helper para diferentes tipos de toast
export const toast = {
  success: (title: string, description?: string) => {
    // Esta función requiere usar useToast hook
    console.log('Toast success:', title, description);
    console.warn('Usa useToast() hook para mostrar toasts programáticamente');
  },
  error: (title: string, description?: string) => {
    console.log('Toast error:', title, description);
    console.warn('Usa useToast() hook para mostrar toasts programáticamente');
  },
  warning: (title: string, description?: string) => {
    console.log('Toast warning:', title, description);
    console.warn('Usa useToast() hook para mostrar toasts programáticamente');
  },
  info: (title: string, description?: string) => {
    console.log('Toast info:', title, description);
    console.warn('Usa useToast() hook para mostrar toasts programáticamente');
  },
};
