/**
 * Página de Detalle de Evento
 * Ruta: /eventos/[slug]
 */

'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Users,
  User,
  ArrowLeft,
  ChevronRight,
  Share2,
  Play,
  FileText,
  Download,
  ExternalLink
} from 'lucide-react';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EventCard, EventCardSkeleton } from '@/components/events/EventCard';
import { InscripcionButton } from '@/components/events/InscripcionButton';
import {
  getEventoBySlug,
  getEventosRelacionados,
  getInscripcionUsuario,
  inscribirseEvento,
  cancelarInscripcion,
  eventoPasado,
  calcularTiempoRestante,
  type Evento
} from '@/lib/appwrite/client';
import { useAuth } from '@/lib/context/AuthContext';
import { useToast } from '@/components/ui/toast';

// Utilidad para combinar clases
const cn = (...inputs: (string | undefined | null | boolean)[]) => {
  return twMerge(clsx(inputs));
};

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

// Configuración de plataformas virtuales
const PLATAFORMAS_CONFIG: Record<string, { label: string }> = {
  zoom: { label: 'Zoom' },
  meet: { label: 'Google Meet' },
  teams: { label: 'Microsoft Teams' }
};

/**
 * Componente de Countdown
 */
function Countdown({ evento }: { evento: Evento }): JSX.Element | null {
  const [tiempoRestante, setTiempoRestante] = React.useState(
    calcularTiempoRestante(evento)
  );
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTiempoRestante(calcularTiempoRestante(evento));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [evento]);
  
  if (!tiempoRestante) return null;
  
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
      <h3 className="text-lg font-medium mb-4 text-center">
        El evento comienza en:
      </h3>
      <div className="grid grid-cols-4 gap-4 text-center">
        <div className="bg-white/20 rounded-lg p-3">
          <div className="text-3xl font-bold">
            {tiempoRestante.dias.toString().padStart(2, '0')}
          </div>
          <div className="text-xs uppercase tracking-wide opacity-80">
            Días
          </div>
        </div>
        <div className="bg-white/20 rounded-lg p-3">
          <div className="text-3xl font-bold">
            {tiempoRestante.horas.toString().padStart(2, '0')}
          </div>
          <div className="text-xs uppercase tracking-wide opacity-80">
            Horas
          </div>
        </div>
        <div className="bg-white/20 rounded-lg p-3">
          <div className="text-3xl font-bold">
            {tiempoRestante.minutos.toString().padStart(2, '0')}
          </div>
          <div className="text-xs uppercase tracking-wide opacity-80">
            Minutos
          </div>
        </div>
        <div className="bg-white/20 rounded-lg p-3">
          <div className="text-3xl font-bold">
            {tiempoRestante.segundos.toString().padStart(2, '0')}
          </div>
          <div className="text-xs uppercase tracking-wide opacity-80">
            Segundos
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Componente de reproductor de video
 */
function VideoPlayer({ url }: { url: string }): JSX.Element {
  // Detectar plataforma de video
  const getEmbedUrl = (videoUrl: string): string | null => {
    // YouTube
    const youtubeMatch = videoUrl.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    
    // Vimeo
    const vimeoMatch = videoUrl.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    
    return null;
  };
  
  const embedUrl = getEmbedUrl(url);
  
  if (!embedUrl) {
    return (
      <div className="bg-gray-100 rounded-xl p-8 text-center">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <ExternalLink className="w-4 h-4" />
          Ver grabación externa
        </a>
      </div>
    );
  }
  
  return (
    <div className="aspect-video rounded-xl overflow-hidden bg-black">
      <iframe
        src={embedUrl}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

/**
 * Página de detalle de evento
 */
export default function EventoDetallePage(): JSX.Element {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  
  // Estados
  const [evento, setEvento] = React.useState<Evento | null>(null);
  const [eventosRelacionados, setEventosRelacionados] = React.useState<Evento[]>([]);
  const [inscrito, setInscrito] = React.useState(false);
  const [cargando, setCargando] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  // Cargar evento
  React.useEffect(() => {
    const cargarEvento = async () => {
      if (!slug) return;
      
      setCargando(true);
      setError(null);
      
      try {
        const eventoData = await getEventoBySlug(slug);
        
        if (!eventoData) {
          setError('Evento no encontrado');
          return;
        }
        
        setEvento(eventoData);
        
        // Cargar eventos relacionados
        const relacionados = await getEventosRelacionados(
          eventoData.$id,
          eventoData.tipo
        );
        setEventosRelacionados(relacionados);
        
        // Verificar inscripción si hay usuario
        if (user) {
          const inscripcion = await getInscripcionUsuario(user.$id, eventoData.$id);
          setInscrito(!!inscripcion);
        }
      } catch (err: any) {
        console.error('Error al cargar evento:', err);
        setError(err.message || 'Error al cargar el evento');
      } finally {
        setCargando(false);
      }
    };
    
    if (!authLoading) {
      cargarEvento();
    }
  }, [slug, user, authLoading]);
  
  // Manejar inscripción
  const handleInscribirse = async (eventoId: string) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Debes iniciar sesión para inscribirte',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      await inscribirseEvento(user.$id, eventoId);
      setInscrito(true);
      
      // Actualizar contador de inscritos en el estado local
      if (evento) {
        setEvento({
          ...evento,
          inscritos: evento.inscritos + 1
        });
      }
      
      toast({
        title: '¡Inscripción exitosa!',
        description: 'Te has inscrito correctamente al evento',
        variant: 'default'
      });
    } catch (err: any) {
      throw err;
    }
  };
  
  // Manejar cancelación
  const handleCancelarInscripcion = async (eventoId: string) => {
    if (!user) return;
    
    try {
      await cancelarInscripcion(user.$id, eventoId);
      setInscrito(false);
      
      // Actualizar contador de inscritos en el estado local
      if (evento) {
        setEvento({
          ...evento,
          inscritos: Math.max(0, evento.inscritos - 1)
        });
      }
      
      toast({
        title: 'Inscripción cancelada',
        description: 'Tu inscripción ha sido cancelada',
        variant: 'default'
      });
    } catch (err: any) {
      throw err;
    }
  };
  
  // Compartir evento
  const handleCompartir = async () => {
    if (!evento) return;
    
    const url = window.location.href;
    const title = evento.titulo;
    
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        // Usuario canceló o error
      }
    } else {
      // Copiar al portapapeles
      await navigator.clipboard.writeText(url);
      toast({
        title: 'Enlace copiado',
        description: 'El enlace ha sido copiado al portapapeles',
        variant: 'default'
      });
    }
  };
  
  // Loading state
  if (cargando || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Skeleton */}
          <div className="animate-pulse">
            <div className="h-6 w-48 bg-gray-200 rounded mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="aspect-video bg-gray-200 rounded-xl" />
                <div className="h-8 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-1/2 bg-gray-200 rounded" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 w-2/3 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-48 bg-gray-200 rounded-xl" />
                <div className="h-32 bg-gray-200 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error || !evento) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md p-8 text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-4">
            {error || 'Evento no encontrado'}
          </h1>
          <p className="text-gray-500 mb-6">
            El evento que buscas no existe o ha sido eliminado.
          </p>
          <Button onClick={() => router.push('/eventos')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a eventos
          </Button>
        </Card>
      </div>
    );
  }
  
  // Configuración
  const tipoConfig = TIPO_EVENTO_CONFIG[evento.tipo] || TIPO_EVENTO_CONFIG.presentacion;
  const modalidadConfig = MODALIDAD_CONFIG[evento.modalidad] || MODALIDAD_CONFIG.virtual;
  const ModalidadIcon = modalidadConfig.icon;
  const esPasado = eventoPasado(evento);
  
  // Fecha formateada
  const fechaFormateada = new Date(evento.fechaHora).toLocaleDateString('es-EC', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  // Hora formateada
  const horaInicio = new Date(evento.fechaHora).toLocaleTimeString('es-EC', {
    hour: '2-digit',
    minute: '2-digit'
  });
  const horaFin = new Date(
    new Date(evento.fechaHora).getTime() + evento.duracion * 60000
  ).toLocaleTimeString('es-EC', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Breadcrumbs
  const breadcrumbs = [
    { label: 'Inicio', href: '/' },
    { label: 'Eventos', href: '/eventos' },
    { label: evento.titulo, href: `/eventos/${evento.slug}` }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con imagen */}
      <div className="relative h-64 md:h-80 bg-gray-900">
        {evento.imagen && (
          <Image
            src={evento.imagen}
            alt={evento.titulo}
            fill
            className="object-cover opacity-50"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Breadcrumbs */}
        <div className="absolute top-4 left-4 right-4">
          <nav className="flex items-center gap-2 text-sm text-white/80">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.href}>
                {index > 0 && (
                  <ChevronRight className="w-4 h-4" />
                )}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-white font-medium truncate max-w-xs">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="hover:text-white transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>
        
        {/* Título y badges */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={tipoConfig.color}>
                {tipoConfig.label}
              </Badge>
              <Badge className="bg-white/20 text-white">
                <ModalidadIcon className="w-3 h-3 mr-1" />
                {modalidadConfig.label}
              </Badge>
              {esPasado && evento.grabacionDisponible && (
                <Badge className="bg-purple-500 text-white">
                  <Play className="w-3 h-3 mr-1" />
                  Grabación disponible
                </Badge>
              )}
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-white">
              {evento.titulo}
            </h1>
          </div>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video de grabación si está disponible */}
            {esPasado && evento.grabacionDisponible && evento.grabacionUrl && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Grabación del evento
                </h2>
                <VideoPlayer url={evento.grabacionUrl} />
              </div>
            )}
            
            {/* Countdown si es próximo */}
            {!esPasado && <Countdown evento={evento} />}
            
            {/* Información del evento */}
            <Card>
              <CardHeader>
                <CardTitle>Acerca del evento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 whitespace-pre-line">
                    {evento.descripcion}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Detalles */}
            <Card>
              <CardHeader>
                <CardTitle>Detalles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Fecha */}
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Fecha</p>
                      <p className="text-sm text-gray-500 capitalize">
                        {fechaFormateada}
                      </p>
                    </div>
                  </div>
                  
                  {/* Hora */}
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Hora</p>
                      <p className="text-sm text-gray-500">
                        {horaInicio} - {horaFin} ({evento.duracion} minutos)
                      </p>
                    </div>
                  </div>
                  
                  {/* Ubicación/Plataforma */}
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <ModalidadIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {evento.modalidad === 'virtual' ? 'Plataforma' : 'Ubicación'}
                      </p>
                      {evento.modalidad === 'virtual' ? (
                        <p className="text-sm text-gray-500">
                          {evento.plataformaVirtual
                            ? PLATAFORMAS_CONFIG[evento.plataformaVirtual]?.label || evento.plataformaVirtual
                            : 'En línea'
                          }
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500">
                          {evento.lugar || 'Por confirmar'}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Cupos */}
                  {evento.capacidad && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Cupos</p>
                        <p className="text-sm text-gray-500">
                          {evento.inscritos}/{evento.capacidad} inscritos
                          {' • '}
                          {evento.capacidad - evento.inscritos > 0
                            ? `${evento.capacidad - evento.inscritos} disponibles`
                            : 'Agotados'
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Link de streaming si es virtual y está inscrito */}
                {evento.modalidad === 'virtual' && evento.enlaceVirtual && inscrito && !esPasado && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-900 mb-2">
                      Enlace del evento:
                    </p>
                    <a
                      href={evento.enlaceVirtual}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Unirse al evento
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Instructor */}
            <Card>
              <CardHeader>
                <CardTitle>Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  {evento.instructorFoto ? (
                    <Image
                      src={evento.instructorFoto}
                      alt={evento.instructorNombre}
                      width={64}
                      height={64}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">
                      {evento.instructorNombre}
                    </p>
                    {evento.instructorCargo && (
                      <p className="text-sm text-gray-500">
                        {evento.instructorCargo}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Eventos relacionados */}
            {eventosRelacionados.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Eventos relacionados
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {eventosRelacionados.map(evento => (
                    <EventCard key={evento.$id} evento={evento} />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Card de inscripción */}
            <Card className="sticky top-4">
              <CardContent className="p-6">
                {/* Precio (gratis) */}
                <div className="text-center mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    Gratis
                  </span>
                </div>
                
                {/* Botón de inscripción */}
                <InscripcionButton
                  evento={evento}
                  inscrito={inscrito}
                  usuarioId={user?.$id}
                  onInscribirse={handleInscribirse}
                  onCancelarInscripcion={handleCancelarInscripcion}
                  size="lg"
                  className="w-full"
                />
                
                {/* Compartir */}
                <Button
                  variant="outline"
                  onClick={handleCompartir}
                  className="w-full mt-3"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartir evento
                </Button>
                
                {/* Info adicional */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Tipo</span>
                    <span className="font-medium">{tipoConfig.label}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Modalidad</span>
                    <span className="font-medium">{modalidadConfig.label}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Duración</span>
                    <span className="font-medium">{evento.duracion} minutos</span>
                  </div>
                  {evento.capacidad && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Inscritos</span>
                      <span className="font-medium">
                        {evento.inscritos}/{evento.capacidad}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Materiales del evento (si hay) */}
            {/* TODO: Agregar sección de materiales cuando esté disponible */}
          </div>
        </div>
      </div>
    </div>
  );
}
