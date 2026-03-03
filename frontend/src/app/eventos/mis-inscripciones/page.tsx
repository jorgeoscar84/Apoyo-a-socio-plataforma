/**
 * Página de Mis Inscripciones
 * Ruta: /eventos/mis-inscripciones
 */

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  ChevronRight,
  CalendarX,
  UserMinus,
  CheckCircle,
  XCircle,
  Play,
  AlertCircle
} from 'lucide-react';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import {
  getMisInscripcionesConEventos,
  cancelarInscripcion,
  type Evento,
  type InscripcionEvento
} from '@/lib/appwrite/client';
import { useAuth } from '@/lib/context/AuthContext';
import { useToast } from '@/components/ui/toast';

// Utilidad para combinar clases
const cn = (...inputs: (string | undefined | null | boolean)[]) => {
  return twMerge(clsx(inputs));
};

// Breadcrumbs
const BREADCRUMBS = [
  { label: 'Inicio', href: '/' },
  { label: 'Eventos', href: '/eventos' },
  { label: 'Mis Inscripciones', href: '/eventos/mis-inscripciones' }
];

// Configuración de tipos de evento
const TIPO_EVENTO_CONFIG: Record<string, { label: string; color: string }> = {
  presentacion: { label: 'Presentación', color: 'bg-blue-100 text-blue-700' },
  demo: { label: 'Demo', color: 'bg-purple-100 text-purple-700' },
  entrenamiento: { label: 'Entrenamiento', color: 'bg-green-100 text-green-700' },
  qa: { label: 'Q&A', color: 'bg-orange-100 text-orange-700' },
  masterclass: { label: 'Masterclass', color: 'bg-pink-100 text-pink-700' }
};

// Configuración de modalidades
const MODALIDAD_CONFIG: Record<string, { label: string; icon: typeof Video }> = {
  virtual: { label: 'Virtual', icon: Video },
  presencial: { label: 'Presencial', icon: MapPin }
};

/**
 * Tarjeta de inscripción
 */
function InscripcionCard({
  inscripcion,
  evento,
  onCancelar,
  onCancelConfirm
}: {
  inscripcion: InscripcionEvento;
  evento: Evento | null;
  onCancelar: () => void;
  onCancelConfirm: () => void;
}): JSX.Element | null {
  const router = useRouter();
  const [mostrarModal, setMostrarModal] = React.useState(false);
  const [cancelando, setCancelando] = React.useState(false);
  
  if (!evento) return null;
  
  const tipoConfig = TIPO_EVENTO_CONFIG[evento.tipo] || TIPO_EVENTO_CONFIG.presentacion;
  const modalidadConfig = MODALIDAD_CONFIG[evento.modalidad] || MODALIDAD_CONFIG.virtual;
  const ModalidadIcon = modalidadConfig.icon;
  
  const esPasado = new Date(evento.fechaHora) < new Date();
  const fechaInscripcion = new Date(inscripcion.fechaInscripcion).toLocaleDateString('es-EC', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  
  // Fecha y hora del evento
  const fechaEvento = new Date(evento.fechaHora).toLocaleDateString('es-EC', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  const horaInicio = new Date(evento.fechaHora).toLocaleTimeString('es-EC', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Manejar cancelación
  const handleCancelar = async () => {
    setCancelando(true);
    try {
      await onCancelConfirm();
      setMostrarModal(false);
    } catch (err) {
      console.error('Error al cancelar:', err);
    } finally {
      setCancelando(false);
    }
  };
  
  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <div className="flex flex-col md:flex-row">
          {/* Imagen */}
          <div className="relative w-full md:w-48 h-32 md:h-auto flex-shrink-0">
            {evento.imagen ? (
              <Image
                src={evento.imagen}
                alt={evento.titulo}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
            )}
            
            {/* Badge de tipo */}
            <div className="absolute top-2 left-2">
              <Badge className={tipoConfig.color}>
                {tipoConfig.label}
              </Badge>
            </div>
            
            {/* Badge de pasado */}
            {esPasado && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-gray-800 text-white">
                  Finalizado
                </Badge>
              </div>
            )}
          </div>
          
          {/* Contenido */}
          <div className="flex-1 p-4">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                {/* Título */}
                <Link
                  href={`/eventos/${evento.slug}`}
                  className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
                >
                  {evento.titulo}
                </Link>
                
                {/* Información del evento */}
                <div className="mt-2 space-y-1.5 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{fechaEvento}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{horaInicio} ({evento.duracion} min)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ModalidadIcon className="w-4 h-4" />
                    <span className="capitalize">
                      {evento.modalidad === 'virtual'
                        ? `Virtual - ${evento.plataformaVirtual || 'En línea'}`
                        : evento.lugar || 'Presencial'
                      }
                    </span>
                  </div>
                </div>
                
                {/* Estado de inscripción */}
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center gap-1 text-sm">
                    {inscripcion.asistio ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-green-600">Asististe</span>
                      </>
                    ) : esPasado ? (
                      <>
                        <XCircle className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500">No asististe</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        <span className="text-blue-600">Inscrito</span>
                      </>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    Inscrito el {fechaInscripcion}
                  </span>
                </div>
              </div>
              
              {/* Acciones */}
              <div className="flex flex-row md:flex-col gap-2">
                {/* Ver evento */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/eventos/${evento.slug}`)}
                >
                  Ver evento
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
                
                {/* Ver grabación */}
                {esPasado && evento.grabacionDisponible && evento.grabacionUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(evento.grabacionUrl!, '_blank')}
                    className="text-purple-600 border-purple-200 hover:bg-purple-50"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Ver grabación
                  </Button>
                )}
                
                {/* Cancelar inscripción */}
                {!esPasado && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMostrarModal(true)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <UserMinus className="w-4 h-4 mr-1" />
                    Cancelar
                  </Button>
                )}
                
                {/* Unirse al evento */}
                {!esPasado && evento.modalidad === 'virtual' && evento.enlaceVirtual && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => window.open(evento.enlaceVirtual!, '_blank')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Video className="w-4 h-4 mr-1" />
                    Unirse
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Modal de confirmación */}
      <Modal
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        title="Cancelar inscripción"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            ¿Estás seguro de que deseas cancelar tu inscripción a este evento?
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-700">
                <p className="font-medium">Ten en cuenta:</p>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  <li>Tu cupo quedará disponible para otro participante</li>
                  <li>Perderás acceso al enlace del evento</li>
                  <li>Podrás inscribirte nuevamente si hay cupos disponibles</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setMostrarModal(false)}
              disabled={cancelando}
            >
              No cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelar}
              disabled={cancelando}
            >
              {cancelando ? 'Cancelando...' : 'Sí, cancelar inscripción'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

/**
 * Página de Mis Inscripciones
 */
export default function MisInscripcionesPage(): JSX.Element {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  
  // Estados
  const [inscripciones, setInscripciones] = React.useState<(InscripcionEvento & { evento: Evento | null })[]>([]);
  const [cargando, setCargando] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  // Filtros
  const [filtro, setFiltro] = React.useState<'todos' | 'proximos' | 'pasados'>('todos');
  
  // Cargar inscripciones
  React.useEffect(() => {
    const cargarInscripciones = async () => {
      if (!user) {
        router.push('/login?redirect=/eventos/mis-inscripciones');
        return;
      }
      
      setCargando(true);
      setError(null);
      
      try {
        const data = await getMisInscripcionesConEventos(user.$id);
        setInscripciones(data);
      } catch (err: any) {
        console.error('Error al cargar inscripciones:', err);
        setError(err.message || 'Error al cargar las inscripciones');
      } finally {
        setCargando(false);
      }
    };
    
    if (!authLoading) {
      cargarInscripciones();
    }
  }, [user, authLoading, router]);
  
  // Separar inscripciones en próximas y pasadas
  const { proximos, pasados } = React.useMemo(() => {
    const ahora = new Date();
    
    const proximosArr: typeof inscripciones = [];
    const pasadosArr: typeof inscripciones = [];
    
    inscripciones.forEach(ins => {
      if (ins.evento && new Date(ins.evento.fechaHora) >= ahora) {
        proximosArr.push(ins);
      } else {
        pasadosArr.push(ins);
      }
    });
    
    // Ordenar
    proximosArr.sort((a, b) => 
      new Date(a.evento?.fechaHora || 0).getTime() - new Date(b.evento?.fechaHora || 0).getTime()
    );
    pasadosArr.sort((a, b) => 
      new Date(b.evento?.fechaHora || 0).getTime() - new Date(a.evento?.fechaHora || 0).getTime()
    );
    
    return { proximos: proximosArr, pasados: pasadosArr };
  }, [inscripciones]);
  
  // Filtrar según selección
  const inscripcionesFiltradas = React.useMemo(() => {
    switch (filtro) {
      case 'proximos':
        return proximos;
      case 'pasados':
        return pasados;
      default:
        return [...proximos, ...pasados];
    }
  }, [filtro, proximos, pasados]);
  
  // Manejar cancelación
  const handleCancelarInscripcion = async (eventoId: string) => {
    if (!user) return;
    
    try {
      await cancelarInscripcion(user.$id, eventoId);
      
      // Actualizar estado local
      setInscripciones(prev => prev.filter(ins => ins.eventoId !== eventoId));
      
      toast({
        title: 'Inscripción cancelada',
        description: 'Tu inscripción ha sido cancelada exitosamente',
        variant: 'default'
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Error al cancelar la inscripción',
        variant: 'destructive'
      });
      throw err;
    }
  };
  
  // Loading state
  if (authLoading || cargando) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Skeleton */}
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-64 bg-gray-200 rounded mb-8" />
            <div className="flex gap-2 mb-6">
              <div className="h-10 w-24 bg-gray-200 rounded" />
              <div className="h-10 w-24 bg-gray-200 rounded" />
              <div className="h-10 w-24 bg-gray-200 rounded" />
            </div>
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl p-4 mb-4">
                <div className="flex gap-4">
                  <div className="w-48 h-32 bg-gray-200 rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-3/4 bg-gray-200 rounded" />
                    <div className="h-4 w-1/2 bg-gray-200 rounded" />
                    <div className="h-4 w-1/3 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // No autenticado
  if (!user) {
    return null; // Ya se redirigió
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm mb-4">
            {BREADCRUMBS.map((crumb, index) => (
              <React.Fragment key={crumb.href}>
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
                {index === BREADCRUMBS.length - 1 ? (
                  <span className="text-gray-900 font-medium">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </nav>
          
          {/* Título */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Mis Inscripciones
            </h1>
            <p className="mt-1 text-gray-500">
              Gestiona tus inscripciones a eventos
            </p>
          </div>
          
          {/* Filtros */}
          <div className="mt-6 flex gap-2">
            {[
              { value: 'todos', label: 'Todos', count: inscripciones.length },
              { value: 'proximos', label: 'Próximos', count: proximos.length },
              { value: 'pasados', label: 'Pasados', count: pasados.length }
            ].map(f => (
              <button
                key={f.value}
                onClick={() => setFiltro(f.value as typeof filtro)}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                  filtro === f.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {f.label}
                <span className={cn(
                  'ml-2 px-2 py-0.5 rounded-full text-xs',
                  filtro === f.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                )}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Contenido */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
        
        {/* Sin inscripciones */}
        {inscripcionesFiltradas.length === 0 ? (
          <Card className="p-8 text-center">
            <CalendarX className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {filtro === 'proximos'
                ? 'No tienes eventos próximos'
                : filtro === 'pasados'
                  ? 'No tienes eventos pasados'
                  : 'No tienes inscripciones'
              }
            </h2>
            <p className="text-gray-500 mb-6">
              {filtro === 'todos'
                ? 'Explora nuestros eventos disponibles e inscríbete'
                : 'Explora nuevos eventos e inscríbete'
              }
            </p>
            <Button onClick={() => router.push('/eventos')}>
              Ver eventos disponibles
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Sección de próximos */}
            {(filtro === 'todos' || filtro === 'proximos') && proximos.length > 0 && (
              <>
                {filtro === 'todos' && (
                  <h2 className="text-lg font-semibold text-gray-900">
                    Próximos eventos ({proximos.length})
                  </h2>
                )}
                {proximos.map(inscripcion => (
                  <InscripcionCard
                    key={inscripcion.$id}
                    inscripcion={inscripcion}
                    evento={inscripcion.evento}
                    onCancelConfirm={() => handleCancelarInscripcion(inscripcion.eventoId)}
                  />
                ))}
              </>
            )}
            
            {/* Separador */}
            {filtro === 'todos' && proximos.length > 0 && pasados.length > 0 && (
              <div className="my-8 border-t border-gray-200" />
            )}
            
            {/* Sección de pasados */}
            {(filtro === 'todos' || filtro === 'pasados') && pasados.length > 0 && (
              <>
                {filtro === 'todos' && (
                  <h2 className="text-lg font-semibold text-gray-900">
                    Eventos pasados ({pasados.length})
                  </h2>
                )}
                {pasados.map(inscripcion => (
                  <InscripcionCard
                    key={inscripcion.$id}
                    inscripcion={inscripcion}
                    evento={inscripcion.evento}
                    onCancelConfirm={() => handleCancelarInscripcion(inscripcion.eventoId)}
                  />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
