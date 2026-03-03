/**
 * Página de Calendario de Eventos
 * Ruta: /eventos
 */

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  Calendar as CalendarIcon,
  List,
  Filter,
  Search,
  ChevronRight,
  Video,
  MapPin,
  Clock
} from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { EventCard, EventCardSkeleton } from '@/components/events/EventCard';
import { Calendar, EventosDelDia } from '@/components/events/Calendar';
import {
  getEventos,
  getEventosDelMes,
  getMisInscripciones,
  getEventosConInscripcion,
  type Evento,
  type InscripcionEvento
} from '@/lib/appwrite/client';
import { useAuth } from '@/lib/context/AuthContext';

// Utilidad para combinar clases
const cn = (...inputs: (string | undefined | null | boolean)[]) => {
  return twMerge(clsx(inputs));
};

// Tipos de filtros
type FiltroTiempo = 'todos' | 'proximos' | 'pasados' | 'mis-inscripciones';
type FiltroModalidad = 'todos' | 'virtual' | 'presencial';
type VistaTipo = 'calendario' | 'lista';

// Configuración de tipos de evento
const TIPOS_EVENTO = [
  { value: 'todos', label: 'Todos los tipos' },
  { value: 'presentacion', label: 'Presentación' },
  { value: 'demo', label: 'Demo' },
  { value: 'entrenamiento', label: 'Entrenamiento' },
  { value: 'qa', label: 'Q&A' },
  { value: 'masterclass', label: 'Masterclass' }
];

// Breadcrumbs
const BREADCRUMBS = [
  { label: 'Inicio', href: '/' },
  { label: 'Eventos', href: '/eventos' }
];

/**
 * Componente de filtros
 */
function FiltrosEventos({
  filtroTiempo,
  setFiltroTiempo,
  filtroModalidad,
  setFiltroModalidad,
  filtroTipo,
  setFiltroTipo,
  busqueda,
  setBusqueda,
  totalEventos
}: {
  filtroTiempo: FiltroTiempo;
  setFiltroTiempo: (f: FiltroTiempo) => void;
  filtroModalidad: FiltroModalidad;
  setFiltroModalidad: (f: FiltroModalidad) => void;
  filtroTipo: string;
  setFiltroTipo: (f: string) => void;
  busqueda: string;
  setBusqueda: (b: string) => void;
  totalEventos: number;
}) {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar eventos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Filtros */}
          <div className="flex flex-wrap gap-2">
            {/* Filtro de tiempo */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              {[
                { value: 'todos', label: 'Todos' },
                { value: 'proximos', label: 'Próximos' },
                { value: 'pasados', label: 'Pasados' }
              ].map(filtro => (
                <button
                  key={filtro.value}
                  onClick={() => setFiltroTiempo(filtro.value as FiltroTiempo)}
                  className={cn(
                    'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                    filtroTiempo === filtro.value
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  {filtro.label}
                </button>
              ))}
            </div>
            
            {/* Filtro de modalidad */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              {[
                { value: 'todos', label: 'Todas' },
                { value: 'virtual', label: 'Virtual' },
                { value: 'presencial', label: 'Presencial' }
              ].map(filtro => (
                <button
                  key={filtro.value}
                  onClick={() => setFiltroModalidad(filtro.value as FiltroModalidad)}
                  className={cn(
                    'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                    filtroModalidad === filtro.value
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  {filtro.label}
                </button>
              ))}
            </div>
            
            {/* Filtro de tipo */}
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {TIPOS_EVENTO.map(tipo => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Mis inscripciones */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={() => setFiltroTiempo(
              filtroTiempo === 'mis-inscripciones' ? 'todos' : 'mis-inscripciones'
            )}
            className={cn(
              'text-sm font-medium transition-colors',
              filtroTiempo === 'mis-inscripciones'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            Mis inscripciones
          </button>
          
          <span className="text-sm text-gray-500">
            {totalEventos} evento{totalEventos !== 1 ? 's' : ''} encontrado{totalEventos !== 1 ? 's' : ''}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Componente de cambio de vista
 */
function ToggleVista({
  vista,
  setVista
}: {
  vista: VistaTipo;
  setVista: (v: VistaTipo) => void;
}) {
  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
      <button
        onClick={() => setVista('calendario')}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
          vista === 'calendario'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        )}
      >
        <CalendarIcon className="w-4 h-4" />
        Calendario
      </button>
      <button
        onClick={() => setVista('lista')}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
          vista === 'lista'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        )}
      >
        <List className="w-4 h-4" />
        Lista
      </button>
    </div>
  );
}

/**
 * Página principal de eventos
 */
export default function EventosPage(): JSX.Element {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  
  // Estados
  const [eventos, setEventos] = React.useState<Evento[]>([]);
  const [inscripciones, setInscripciones] = React.useState<InscripcionEvento[]>([]);
  const [cargando, setCargando] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  // Filtros
  const [filtroTiempo, setFiltroTiempo] = React.useState<FiltroTiempo>('proximos');
  const [filtroModalidad, setFiltroModalidad] = React.useState<FiltroModalidad>('todos');
  const [filtroTipo, setFiltroTipo] = React.useState('todos');
  const [busqueda, setBusqueda] = React.useState('');
  const [debouncedBusqueda, setDebouncedBusqueda] = React.useState('');
  
  // Vista
  const [vista, setVista] = React.useState<VistaTipo>('calendario');
  
  // Mes actual para calendario
  const [mesActual, setMesActual] = React.useState(new Date().getMonth());
  const [yearActual, setYearActual] = React.useState(new Date().getFullYear());
  
  // Día seleccionado en calendario
  const [diaSeleccionado, setDiaSeleccionado] = React.useState<Date | null>(null);
  const [eventosDelDia, setEventosDelDia] = React.useState<Evento[]>([]);
  
  // Debounce de búsqueda
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedBusqueda(busqueda);
    }, 300);
    return () => clearTimeout(timer);
  }, [busqueda]);
  
  // Cargar eventos
  React.useEffect(() => {
    const cargarEventos = async () => {
      setCargando(true);
      setError(null);
      
      try {
        // Si es "mis inscripciones", cargar inscripciones primero
        let inscripcionesUsuario: InscripcionEvento[] = [];
        if (filtroTiempo === 'mis-inscripciones' && user) {
          inscripcionesUsuario = await getMisInscripciones(user.$id);
          setInscripciones(inscripcionesUsuario);
        }
        
        // Construir filtros
        const filtros: any = {};
        
        if (filtroTiempo === 'proximos') {
          filtros.proximos = true;
          filtros.ordenar = 'fechaAsc';
        } else if (filtroTiempo === 'pasados') {
          filtros.pasados = true;
          filtros.ordenar = 'fechaDesc';
        } else if (filtroTiempo === 'mis-inscripciones') {
          // Obtener eventos de las inscripciones
          if (inscripcionesUsuario.length === 0) {
            setEventos([]);
            setCargando(false);
            return;
          }
          // Cargar todos y filtrar
          filtros.ordenar = 'fechaAsc';
        } else {
          filtros.ordenar = 'fechaAsc';
        }
        
        if (filtroModalidad !== 'todos') {
          filtros.modalidad = filtroModalidad;
        }
        
        if (filtroTipo !== 'todos') {
          filtros.tipo = filtroTipo;
        }
        
        if (debouncedBusqueda) {
          filtros.buscar = debouncedBusqueda;
        }
        
        let eventosCargados = await getEventos(filtros);
        
        // Filtrar por inscripciones si es necesario
        if (filtroTiempo === 'mis-inscripciones' && inscripcionesUsuario.length > 0) {
          const idsInscritos = new Set(inscripcionesUsuario.map(i => i.eventoId));
          eventosCargados = eventosCargados.filter(e => idsInscritos.has(e.$id));
        }
        
        setEventos(eventosCargados);
      } catch (err: any) {
        console.error('Error al cargar eventos:', err);
        setError(err.message || 'Error al cargar los eventos');
      } finally {
        setCargando(false);
      }
    };
    
    // Solo cargar si no está cargando auth
    if (!authLoading) {
      cargarEventos();
    }
  }, [filtroTiempo, filtroModalidad, filtroTipo, debouncedBusqueda, user, authLoading]);
  
  // Cargar inscripciones del usuario para marcar eventos inscritos
  React.useEffect(() => {
    const cargarInscripciones = async () => {
      if (user) {
        try {
          const inscripcionesData = await getMisInscripciones(user.$id);
          setInscripciones(inscripcionesData);
        } catch (err) {
          console.error('Error al cargar inscripciones:', err);
        }
      }
    };
    
    if (!authLoading) {
      cargarInscripciones();
    }
  }, [user, authLoading]);
  
  // Set de IDs de eventos inscritos
  const eventosInscritos = React.useMemo(() => {
    return new Set(inscripciones.map(i => i.eventoId));
  }, [inscripciones]);
  
  // Manejar click en día del calendario
  const handleDiaClick = (fecha: Date, eventos: Evento[]) => {
    setDiaSeleccionado(fecha);
    setEventosDelDia(eventos);
  };
  
  // Manejar click en evento
  const handleEventoClick = (evento: Evento) => {
    router.push(`/eventos/${evento.slug}`);
  };
  
  // Manejar cambio de mes
  const handleMesChange = async (mes: number, year: number) => {
    setMesActual(mes);
    setYearActual(year);
    
    // Cargar eventos del mes si estamos en vista calendario
    try {
      const eventosMes = await getEventosDelMes(year, mes + 1);
      setEventos(eventosMes);
    } catch (err) {
      console.error('Error al cargar eventos del mes:', err);
    }
  };
  
  // Filtrar eventos para mostrar
  const eventosFiltrados = React.useMemo(() => {
    return eventos;
  }, [eventos]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm mb-4">
            {BREADCRUMBS.map((crumb, index) => (
              <React.Fragment key={crumb.href}>
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
                <Link
                  href={crumb.href}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {crumb.label}
                </Link>
              </React.Fragment>
            ))}
          </nav>
          
          {/* Título */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Calendario de Eventos
              </h1>
              <p className="mt-1 text-gray-500">
                Descubre y regístrate a eventos presenciales y virtuales
              </p>
            </div>
            
            {/* Toggle vista */}
            <ToggleVista vista={vista} setVista={setVista} />
          </div>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filtros */}
        <FiltrosEventos
          filtroTiempo={filtroTiempo}
          setFiltroTiempo={setFiltroTiempo}
          filtroModalidad={filtroModalidad}
          setFiltroModalidad={setFiltroModalidad}
          filtroTipo={filtroTipo}
          setFiltroTipo={setFiltroTipo}
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          totalEventos={eventosFiltrados.length}
        />
        
        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
        
        {/* Vista Calendario */}
        {vista === 'calendario' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Calendar
                eventos={eventos}
                mes={mesActual}
                year={yearActual}
                onDiaClick={handleDiaClick}
                onEventoClick={handleEventoClick}
                onMesChange={handleMesChange}
                eventosInscritos={eventosInscritos}
              />
              
              {/* Eventos del día seleccionado */}
              {diaSeleccionado && eventosDelDia.length > 0 && (
                <EventosDelDia
                  fecha={diaSeleccionado}
                  eventos={eventosDelDia}
                  onEventoClick={handleEventoClick}
                  eventosInscritos={eventosInscritos}
                />
              )}
            </div>
            
            {/* Sidebar con próximos eventos */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Próximos eventos</CardTitle>
                </CardHeader>
                <CardContent>
                  {cargando ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                          <div className="h-3 bg-gray-200 rounded w-1/2" />
                        </div>
                      ))}
                    </div>
                  ) : eventos.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                      No hay eventos programados
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {eventos
                        .filter(e => new Date(e.fechaHora) >= new Date())
                        .slice(0, 5)
                        .map(evento => (
                          <Link
                            key={evento.$id}
                            href={`/eventos/${evento.slug}`}
                            className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <div className={cn(
                                'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                                evento.modalidad === 'virtual' ? 'bg-cyan-100' : 'bg-amber-100'
                              )}>
                                {evento.modalidad === 'virtual' ? (
                                  <Video className="w-5 h-5 text-cyan-600" />
                                ) : (
                                  <MapPin className="w-5 h-5 text-amber-600" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">
                                  {evento.titulo}
                                </p>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(evento.fechaHora).toLocaleDateString('es-EC', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                              {eventosInscritos.has(evento.$id) && (
                                <Badge className="bg-green-100 text-green-700 text-xs">
                                  Inscrito
                                </Badge>
                              )}
                            </div>
                          </Link>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Link a mis inscripciones */}
              <Card className="mt-4">
                <CardContent className="p-4">
                  <Link
                    href="/eventos/mis-inscripciones"
                    className="flex items-center justify-between text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <span>Ver mis inscripciones</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {/* Vista Lista */}
        {vista === 'lista' && (
          <>
            {cargando ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <EventCardSkeleton key={i} />
                ))}
              </div>
            ) : eventosFiltrados.length === 0 ? (
              <Card className="p-8 text-center">
                <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron eventos
                </h3>
                <p className="text-gray-500 mb-4">
                  {filtroTiempo === 'mis-inscripciones'
                    ? 'No tienes inscripciones a eventos'
                    : 'Intenta con otros filtros de búsqueda'
                  }
                </p>
                {filtroTiempo === 'mis-inscripciones' && (
                  <Button
                    variant="primary"
                    onClick={() => setFiltroTiempo('proximos')}
                  >
                    Ver próximos eventos
                  </Button>
                )}
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventosFiltrados.map(evento => (
                  <EventCard
                    key={evento.$id}
                    evento={evento}
                    inscrito={eventosInscritos.has(evento.$id)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
