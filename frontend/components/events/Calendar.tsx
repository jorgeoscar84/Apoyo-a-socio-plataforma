/**
 * Componente Calendar
 * Calendario mensual interactivo para mostrar eventos
 */

'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Evento } from '@/lib/appwrite/client';

// Utilidad para combinar clases
const cn = (...inputs: (string | undefined | null | boolean)[]) => {
  return twMerge(clsx(inputs));
};

// Nombres de días de la semana
const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

// Nombres de los meses
const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// Props del componente
export interface CalendarProps {
  eventos?: Evento[];
  mes?: number;
  year?: number;
  onDiaClick?: (fecha: Date, eventosDelDia: Evento[]) => void;
  onEventoClick?: (evento: Evento) => void;
  onMesChange?: (mes: number, year: number) => void;
  eventosInscritos?: Set<string>;
  className?: string;
}

/**
 * Obtiene los días del mes para mostrar en el calendario
 */
function getDiasDelMes(year: number, mes: number): (Date | null)[] {
  const primerDia = new Date(year, mes, 1);
  const ultimoDia = new Date(year, mes + 1, 0);
  
  const dias: (Date | null)[] = [];
  
  // Agregar días vacíos al inicio (para alinear con el día de la semana)
  const diaSemanaInicio = primerDia.getDay();
  for (let i = 0; i < diaSemanaInicio; i++) {
    dias.push(null);
  }
  
  // Agregar los días del mes
  for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
    dias.push(new Date(year, mes, dia));
  }
  
  // Agregar días vacíos al final para completar la última semana
  const diasRestantes = 7 - (dias.length % 7);
  if (diasRestantes < 7) {
    for (let i = 0; i < diasRestantes; i++) {
      dias.push(null);
    }
  }
  
  return dias;
}

/**
 * Obtiene los eventos de un día específico
 */
function getEventosDelDia(eventos: Evento[], fecha: Date): Evento[] {
  return eventos.filter(evento => {
    const fechaEvento = new Date(evento.fechaHora);
    return (
      fechaEvento.getDate() === fecha.getDate() &&
      fechaEvento.getMonth() === fecha.getMonth() &&
      fechaEvento.getFullYear() === fecha.getFullYear()
    );
  });
}

/**
 * Verifica si una fecha es hoy
 */
function esHoy(fecha: Date): boolean {
  const hoy = new Date();
  return (
    fecha.getDate() === hoy.getDate() &&
    fecha.getMonth() === hoy.getMonth() &&
    fecha.getFullYear() === hoy.getFullYear()
  );
}

/**
 * Verifica si una fecha tiene eventos
 */
function tieneEventos(eventos: Evento[], fecha: Date): boolean {
  return getEventosDelDia(eventos, fecha).length > 0;
}

/**
 * Obtiene el color según el tipo de evento
 */
function getColorTipoEvento(tipo: string): string {
  const colores: Record<string, string> = {
    presentacion: 'bg-blue-500',
    demo: 'bg-purple-500',
    entrenamiento: 'bg-green-500',
    qa: 'bg-orange-500',
    masterclass: 'bg-pink-500'
  };
  return colores[tipo] || 'bg-gray-500';
}

/**
 * Componente principal Calendar
 */
export function Calendar({
  eventos = [],
  mes: mesProp,
  year: yearProp,
  onDiaClick,
  onEventoClick,
  onMesChange,
  eventosInscritos,
  className
}: CalendarProps): JSX.Element {
  // Estado del mes y año actual
  const hoy = new Date();
  const [mesActual, setMesActual] = React.useState(mesProp ?? hoy.getMonth());
  const [yearActual, setYearActual] = React.useState(yearProp ?? hoy.getFullYear());
  
  // Actualizar mes/año si cambian las props
  React.useEffect(() => {
    if (mesProp !== undefined) setMesActual(mesProp);
    if (yearProp !== undefined) setYearActual(yearProp);
  }, [mesProp, yearProp]);
  
  // Navegar al mes anterior
  const mesAnterior = React.useCallback(() => {
    let nuevoMes = mesActual - 1;
    let nuevoYear = yearActual;
    
    if (nuevoMes < 0) {
      nuevoMes = 11;
      nuevoYear = yearActual - 1;
    }
    
    setMesActual(nuevoMes);
    setYearActual(nuevoYear);
    onMesChange?.(nuevoMes, nuevoYear);
  }, [mesActual, yearActual, onMesChange]);
  
  // Navegar al mes siguiente
  const mesSiguiente = React.useCallback(() => {
    let nuevoMes = mesActual + 1;
    let nuevoYear = yearActual;
    
    if (nuevoMes > 11) {
      nuevoMes = 0;
      nuevoYear = yearActual + 1;
    }
    
    setMesActual(nuevoMes);
    setYearActual(nuevoYear);
    onMesChange?.(nuevoMes, nuevoYear);
  }, [mesActual, yearActual, onMesChange]);
  
  // Ir al mes actual
  const irAMesActual = React.useCallback(() => {
    const ahora = new Date();
    setMesActual(ahora.getMonth());
    setYearActual(ahora.getFullYear());
    onMesChange?.(ahora.getMonth(), ahora.getFullYear());
  }, [onMesChange]);
  
  // Obtener días del mes
  const dias = getDiasDelMes(yearActual, mesActual);
  
  // Manejar click en día
  const handleDiaClick = (fecha: Date) => {
    const eventosDelDia = getEventosDelDia(eventos, fecha);
    onDiaClick?.(fecha, eventosDelDia);
  };
  
  return (
    <div className={cn('bg-white rounded-xl border border-gray-200 p-4', className)}>
      {/* Header del calendario */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {MESES[mesActual]} {yearActual}
        </h2>
        
        <div className="flex items-center gap-1">
          {/* Botón hoy */}
          <Button
            variant="outline"
            size="sm"
            onClick={irAMesActual}
            className="text-xs"
          >
            Hoy
          </Button>
          
          {/* Navegación */}
          <div className="flex items-center gap-1 ml-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={mesAnterior}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={mesSiguiente}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DIAS_SEMANA.map(dia => (
          <div
            key={dia}
            className="text-center text-xs font-medium text-gray-500 py-2"
          >
            {dia}
          </div>
        ))}
      </div>
      
      {/* Grid de días */}
      <div className="grid grid-cols-7 gap-1">
        {dias.map((fecha, index) => {
          if (!fecha) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }
          
          const eventosDelDia = getEventosDelDia(eventos, fecha);
          const tieneEventosDia = eventosDelDia.length > 0;
          const esDiaHoy = esHoy(fecha);
          const esPasado = fecha < new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
          
          return (
            <button
              key={fecha.toISOString()}
              onClick={() => handleDiaClick(fecha)}
              disabled={!tieneEventosDia}
              className={cn(
                'aspect-square p-1 rounded-lg text-sm relative transition-colors',
                'flex flex-col items-center justify-start',
                esDiaHoy && 'bg-blue-50 ring-2 ring-blue-500',
                tieneEventosDia && 'hover:bg-gray-100 cursor-pointer',
                !tieneEventosDia && 'cursor-default text-gray-400',
                esPasado && 'opacity-60'
              )}
            >
              {/* Número del día */}
              <span
                className={cn(
                  'text-sm font-medium',
                  esDiaHoy ? 'text-blue-600' : 'text-gray-700'
                )}
              >
                {fecha.getDate()}
              </span>
              
              {/* Indicadores de eventos */}
              {tieneEventosDia && (
                <div className="flex flex-wrap gap-0.5 mt-1 justify-center max-w-full">
                  {eventosDelDia.slice(0, 3).map(evento => (
                    <div
                      key={evento.$id}
                      className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        getColorTipoEvento(evento.tipo),
                        eventosInscritos?.has(evento.$id) && 'ring-2 ring-offset-1 ring-green-400'
                      )}
                      title={evento.titulo}
                    />
                  ))}
                  {eventosDelDia.length > 3 && (
                    <span className="text-xs text-gray-400">
                      +{eventosDelDia.length - 3}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Leyenda */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Presentación
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            Demo
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Entrenamiento
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            Q&A
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-pink-500" />
            Masterclass
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Componente para mostrar lista de eventos del día seleccionado
 */
export interface EventosDelDiaProps {
  fecha: Date;
  eventos: Evento[];
  onEventoClick?: (evento: Evento) => void;
  eventosInscritos?: Set<string>;
}

export function EventosDelDia({
  fecha,
  eventos,
  onEventoClick,
  eventosInscritos
}: EventosDelDiaProps): JSX.Element | null {
  if (eventos.length === 0) return null;
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mt-4">
      <h3 className="font-semibold text-gray-900 mb-3">
        Eventos del {fecha.toLocaleDateString('es-EC', {
          weekday: 'long',
          day: 'numeric',
          month: 'long'
        })}
      </h3>
      
      <div className="space-y-2">
        {eventos.map(evento => {
          const inscrito = eventosInscritos?.has(evento.$id);
          const fechaEvento = new Date(evento.fechaHora);
          
          return (
            <button
              key={evento.$id}
              onClick={() => onEventoClick?.(evento)}
              className={cn(
                'w-full text-left p-3 rounded-lg border transition-colors',
                'hover:bg-gray-50',
                inscrito
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200'
              )}
            >
              <div className="flex items-start gap-3">
                {/* Indicador de tipo */}
                <div
                  className={cn(
                    'w-1 h-12 rounded-full flex-shrink-0',
                    getColorTipoEvento(evento.tipo)
                  )}
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 truncate">
                      {evento.titulo}
                    </span>
                    {inscrito && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        Inscrito
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>
                      {fechaEvento.toLocaleTimeString('es-EC', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <span className="capitalize">{evento.modalidad}</span>
                    {evento.capacidad && (
                      <span>
                        {evento.inscritos}/{evento.capacidad} inscritos
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;
