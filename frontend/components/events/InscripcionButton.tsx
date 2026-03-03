/**
 * Componente InscripcionButton
 * Botón inteligente de inscripción con modal de confirmación
 */

'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  UserPlus,
  UserMinus,
  CheckCircle,
  AlertCircle,
  Loader2,
  Users,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import type { Evento } from '@/lib/appwrite/client';

// Utilidad para combinar clases
const cn = (...inputs: (string | undefined | null | boolean)[]) => {
  return twMerge(clsx(inputs));
};

// Estados del botón
type EstadoBoton =
  | 'inscribirse'
  | 'inscrito'
  | 'cupos-agotados'
  | 'evento-pasado'
  | 'cargando'
  | 'grabacion-disponible';

// Props del componente
export interface InscripcionButtonProps {
  evento: Evento;
  inscrito?: boolean;
  onInscribirse?: (eventoId: string) => Promise<void>;
  onCancelarInscripcion?: (eventoId: string) => Promise<void>;
  onVerGrabacion?: (url: string) => void;
  usuarioId?: string;
  disabled?: boolean;
  className?: string;
  showTexto?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Verifica si un evento ya pasó
 */
function esEventoPasado(evento: Evento): boolean {
  return new Date(evento.fechaHora) < new Date();
}

/**
 * Verifica si hay cupos disponibles
 */
function tieneCupos(evento: Evento): boolean {
  if (!evento.capacidad) return true;
  return evento.inscritos < evento.capacidad;
}

/**
 * Obtiene el estado del botón
 */
function getEstadoBoton(
  evento: Evento,
  inscrito: boolean,
  cargando: boolean
): EstadoBoton {
  if (cargando) return 'cargando';
  if (esEventoPasado(evento)) {
    if (evento.grabacionDisponible && evento.grabacionUrl) {
      return 'grabacion-disponible';
    }
    return 'evento-pasado';
  }
  if (inscrito) return 'inscrito';
  if (!tieneCupos(evento)) return 'cupos-agotados';
  return 'inscribirse';
}

/**
 * Componente principal InscripcionButton
 */
export function InscripcionButton({
  evento,
  inscrito = false,
  onInscribirse,
  onCancelarInscripcion,
  onVerGrabacion,
  usuarioId,
  disabled = false,
  className,
  showTexto = true,
  size = 'md'
}: InscripcionButtonProps): JSX.Element {
  // Estados
  const [cargando, setCargando] = React.useState(false);
  const [mostrarModal, setMostrarModal] = React.useState(false);
  const [mostrarModalCancelar, setMostrarModalCancelar] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  // Determinar estado del botón
  const estado = getEstadoBoton(evento, inscrito, cargando);
  
  // Obtener cupos disponibles
  const cuposDisponibles = evento.capacidad
    ? Math.max(0, evento.capacidad - evento.inscritos)
    : null;
  
  // Manejar click en inscribirse
  const handleInscribirse = () => {
    if (!usuarioId) {
      setError('Debes iniciar sesión para inscribirte');
      return;
    }
    setMostrarModal(true);
  };
  
  // Confirmar inscripción
  const confirmarInscripcion = async () => {
    if (!onInscribirse) return;
    
    setCargando(true);
    setError(null);
    
    try {
      await onInscribirse(evento.$id);
      setMostrarModal(false);
    } catch (err: any) {
      setError(err.message || 'Error al inscribirse');
    } finally {
      setCargando(false);
    }
  };
  
  // Manejar click en cancelar inscripción
  const handleCancelar = () => {
    setMostrarModalCancelar(true);
  };
  
  // Confirmar cancelación
  const confirmarCancelacion = async () => {
    if (!onCancelarInscripcion) return;
    
    setCargando(true);
    setError(null);
    
    try {
      await onCancelarInscripcion(evento.$id);
      setMostrarModalCancelar(false);
    } catch (err: any) {
      setError(err.message || 'Error al cancelar inscripción');
    } finally {
      setCargando(false);
    }
  };
  
  // Manejar ver grabación
  const handleVerGrabacion = () => {
    if (evento.grabacionUrl) {
      if (onVerGrabacion) {
        onVerGrabacion(evento.grabacionUrl);
      } else {
        window.open(evento.grabacionUrl, '_blank');
      }
    }
  };
  
  // Configuración según estado
  const configBoton: Record<
    EstadoBoton,
    {
      texto: string;
      icon: typeof UserPlus;
      variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
      disabled: boolean;
      className: string;
      onClick?: () => void;
    }
  > = {
    'inscribirse': {
      texto: 'Inscribirse',
      icon: UserPlus,
      variant: 'primary',
      disabled: disabled,
      className: 'bg-blue-600 hover:bg-blue-700 text-white',
      onClick: handleInscribirse
    },
    'inscrito': {
      texto: 'Cancelar inscripción',
      icon: CheckCircle,
      variant: 'outline',
      disabled: disabled,
      className: 'border-green-500 text-green-600 hover:bg-green-50',
      onClick: handleCancelar
    },
    'cupos-agotados': {
      texto: 'Cupos agotados',
      icon: AlertCircle,
      variant: 'outline',
      disabled: true,
      className: 'border-gray-300 text-gray-400 cursor-not-allowed'
    },
    'evento-pasado': {
      texto: 'Evento finalizado',
      icon: AlertCircle,
      variant: 'outline',
      disabled: true,
      className: 'border-gray-300 text-gray-400 cursor-not-allowed'
    },
    'grabacion-disponible': {
      texto: 'Ver grabación',
      icon: ExternalLink,
      variant: 'primary',
      disabled: false,
      className: 'bg-purple-600 hover:bg-purple-700 text-white',
      onClick: handleVerGrabacion
    },
    'cargando': {
      texto: 'Procesando...',
      icon: Loader2,
      variant: 'primary',
      disabled: true,
      className: 'bg-gray-400 cursor-wait'
    }
  };
  
  const config = configBoton[estado];
  const Icon = config.icon;
  
  // Tamaños
  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base'
  };
  
  return (
    <>
      {/* Botón principal */}
      <div className={cn('flex flex-col gap-2', className)}>
        <Button
          variant={config.variant}
          disabled={config.disabled}
          onClick={config.onClick}
          className={cn(
            sizeClasses[size],
            config.className,
            'font-medium transition-all',
            !showTexto && 'px-2'
          )}
        >
          {estado === 'cargando' ? (
            <Loader2 className={cn('animate-spin', showTexto ? 'mr-2' : '')} />
          ) : (
            <Icon className={cn(showTexto ? 'mr-2' : '')} />
          )}
          {showTexto && config.texto}
        </Button>
        
        {/* Info de cupos */}
        {estado === 'inscribirse' && cuposDisponibles !== null && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Users className="w-3 h-3" />
            <span>
              {cuposDisponibles === 0
                ? 'Sin cupos'
                : `${cuposDisponibles} cupo${cuposDisponibles !== 1 ? 's' : ''} disponible${cuposDisponibles !== 1 ? 's' : ''}`
              }
            </span>
          </div>
        )}
        
        {/* Mensaje de error */}
        {error && (
          <div className="flex items-center gap-1 text-xs text-red-500">
            <AlertCircle className="w-3 h-3" />
            <span>{error}</span>
          </div>
        )}
      </div>
      
      {/* Modal de confirmación de inscripción */}
      <Modal
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        title="Confirmar inscripción"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            ¿Estás seguro de que deseas inscribirte a este evento?
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="font-medium text-gray-900">{evento.titulo}</p>
            <p className="text-sm text-gray-500">
              {new Date(evento.fechaHora).toLocaleDateString('es-EC', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            <p className="text-sm text-gray-500 capitalize">
              {evento.modalidad} • {evento.modalidad === 'virtual' ? evento.plataformaVirtual : evento.lugar}
            </p>
          </div>
          
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setMostrarModal(false)}
              disabled={cargando}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={confirmarInscripcion}
              disabled={cargando}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {cargando ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Inscribiendo...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2" />
                  Confirmar inscripción
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Modal de cancelación */}
      <Modal
        isOpen={mostrarModalCancelar}
        onClose={() => setMostrarModalCancelar(false)}
        title="Cancelar inscripción"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            ¿Estás seguro de que deseas cancelar tu inscripción a este evento?
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-700">
              Si cancelas, tu cupo quedará disponible para otro participante.
            </p>
          </div>
          
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setMostrarModalCancelar(false)}
              disabled={cargando}
            >
              No cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmarCancelacion}
              disabled={cargando}
            >
              {cargando ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Cancelando...
                </>
              ) : (
                <>
                  <UserMinus className="mr-2" />
                  Sí, cancelar inscripción
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default InscripcionButton;
