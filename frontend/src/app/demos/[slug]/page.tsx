'use client';

/**
 * Página de Detalle de Demo
 * 
 * Ruta: /demos/[slug]
 * 
 * Funcionalidades:
 * - Video de demo embebido
 * - Información: título, descripción, duración
 * - Guion de venta descargable (PDF)
 * - Checklist de puntos clave
 * - Formulario para solicitar demo en vivo
 * - Demos relacionados
 */

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import {
  getDemoBySlug,
  getDemosRelacionados,
  incrementarVistasDemo,
  incrementarDescargasDemo,
  solicitarDemoEnVivo,
  Demo,
  formatearDuracionDemo
} from '@/lib/appwrite/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import DemoCard from '@/components/demos/DemoCard';
import {
  Play,
  Download,
  FileText,
  Video,
  Clock,
  Eye,
  Calendar,
  ChevronRight,
  ArrowLeft,
  Check,
  Send,
  MessageCircle,
  Phone
} from 'lucide-react';

// =============================================================================
// TIPOS
// =============================================================================

interface PageProps {
  params: Promise<{ slug: string }>;
}

// =============================================================================
// CONFIGURACIÓN DE TIPOS DE DEMO
// =============================================================================

const tipoDemoConfig = {
  grabada: { 
    label: 'Demo Grabada', 
    icon: Video, 
    color: 'bg-purple-100 text-purple-700' 
  },
  guion: { 
    label: 'Guion de Venta', 
    icon: FileText, 
    color: 'bg-emerald-100 text-emerald-700' 
  },
};

// =============================================================================
// FUNCIONES AUXILIARES
// =============================================================================

function parseTags(tagsJson?: string): string[] {
  if (!tagsJson) return [];
  try {
    return JSON.parse(tagsJson);
  } catch {
    return tagsJson.split(',').map(t => t.trim()).filter(Boolean);
  }
}

function formatearFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Obtener ID de video de YouTube desde URL
 */
function getYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

/**
 * Obtener ID de video de Vimeo desde URL
 */
function getVimeoId(url: string): string | null {
  const regex = /vimeo\.com\/(\d+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

export default function DemoDetallePage({ params }: PageProps) {
  const { slug } = use(params);
  const { user } = useAuth();
  
  // Estados
  const [demo, setDemo] = useState<Demo | null>(null);
  const [demosRelacionados, setDemosRelacionados] = useState<Demo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFormulario, setShowFormulario] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    empresa: '',
    mensaje: ''
  });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  /**
   * Cargar demo
   */
  useEffect(() => {
    const cargarDemo = async () => {
      setLoading(true);
      setError(null);

      try {
        const demoData = await getDemoBySlug(slug);
        
        if (!demoData) {
          setError('Demo no encontrada');
          return;
        }

        setDemo(demoData);

        // Incrementar vistas
        if (user?.$id) {
          await incrementarVistasDemo(demoData.$id);
        }

        // Cargar demos relacionados
        const relacionados = await getDemosRelacionados(demoData.$id, 4);
        setDemosRelacionados(relacionados);
      } catch (err) {
        console.error('Error al cargar demo:', err);
        setError('No se pudo cargar la demo');
      } finally {
        setLoading(false);
      }
    };

    cargarDemo();
  }, [slug, user?.$id]);

  /**
   * Manejar descarga de guion
   */
  const handleDescargarGuion = async () => {
    if (!demo?.guionUrl || !user?.$id) return;

    try {
      await incrementarDescargasDemo(demo.$id);
      window.open(demo.guionUrl, '_blank');
    } catch (err) {
      console.error('Error al descargar:', err);
    }
  };

  /**
   * Manejar descarga de checklist
   */
  const handleDescargarChecklist = async () => {
    if (!demo?.checklistUrl || !user?.$id) return;

    try {
      await incrementarDescargasDemo(demo.$id);
      window.open(demo.checklistUrl, '_blank');
    } catch (err) {
      console.error('Error al descargar:', err);
    }
  };

  /**
   * Manejar envío de formulario
   */
  const handleSubmitFormulario = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!demo || !user?.$id) return;
    
    setEnviando(true);
    
    try {
      await solicitarDemoEnVivo({
        demoId: demo.$id,
        usuarioId: user.$id,
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        empresa: formData.empresa,
        mensaje: formData.mensaje
      });
      
      setEnviado(true);
    } catch (err) {
      console.error('Error al enviar solicitud:', err);
    } finally {
      setEnviando(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="aspect-video bg-gray-200 rounded-xl mb-6" />
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
              <div className="space-y-4">
                <div className="h-40 bg-gray-200 rounded-xl" />
                <div className="h-40 bg-gray-200 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !demo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'Demo no encontrada'}
          </h2>
          <p className="text-gray-500 mb-6">
            La demo que buscas no está disponible o no existe.
          </p>
          <Link href="/demos">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a demos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Datos derivados
  const tags = parseTags(demo.tags);
  const tipoInfo = tipoDemoConfig[demo.tipo] || tipoDemoConfig.grabada;
  const TipoIcon = tipoInfo.icon;
  const duracion = formatearDuracionDemo(demo.duracion);
  const youtubeId = demo.videoUrl ? getYouTubeId(demo.videoUrl) : null;
  const vimeoId = demo.videoUrl ? getVimeoId(demo.videoUrl) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Inicio
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link href="/demos" className="text-gray-500 hover:text-gray-700">
              Demos
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{demo.titulo}</span>
          </nav>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video embebido */}
            <Card className="overflow-hidden">
              {youtubeId ? (
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title={demo.titulo}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : vimeoId ? (
                <div className="aspect-video">
                  <iframe
                    src={`https://player.vimeo.com/video/${vimeoId}`}
                    title={demo.titulo}
                    className="w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : demo.thumbnail ? (
                <div className="aspect-video relative">
                  <img
                    src={demo.thumbnail}
                    alt={demo.titulo}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Play className="w-16 h-16 mx-auto mb-4" />
                      <p>Video no disponible</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center bg-gray-100">
                  <TipoIcon className="w-20 h-20 text-gray-400" />
                </div>
              )}
            </Card>

            {/* Información */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={tipoInfo.color}>
                    <TipoIcon className="w-3 h-3 mr-1" />
                    {tipoInfo.label}
                  </Badge>
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                  {demo.titulo}
                </h1>
                
                <p className="text-gray-600 mb-4">
                  {demo.descripcion}
                </p>

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Metadatos */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Duración</p>
                    <p className="text-sm font-medium flex items-center gap-1 mt-1">
                      <Clock className="w-4 h-4" />
                      {duracion || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Vistas</p>
                    <p className="text-sm font-medium flex items-center gap-1 mt-1">
                      <Eye className="w-4 h-4" />
                      {demo.vistas || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Descargas</p>
                    <p className="text-sm font-medium flex items-center gap-1 mt-1">
                      <Download className="w-4 h-4" />
                      {demo.descargas || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Fecha</p>
                    <p className="text-sm font-medium flex items-center gap-1 mt-1">
                      <Calendar className="w-4 h-4" />
                      {formatearFecha(demo.creadoEn)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Demos relacionados */}
            {demosRelacionados.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Demos relacionados
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {demosRelacionados.map((relacionado) => (
                    <DemoCard key={relacionado.$id} demo={relacionado} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Archivos descargables */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Material de apoyo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Guion */}
                {demo.guionUrl && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleDescargarGuion}
                  >
                    <FileText className="w-4 h-4 mr-3 text-emerald-600" />
                    <span className="flex-1 text-left">Guion de venta</span>
                    <Download className="w-4 h-4" />
                  </Button>
                )}

                {/* Checklist */}
                {demo.checklistUrl && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleDescargarChecklist}
                  >
                    <Check className="w-4 h-4 mr-3 text-blue-600" />
                    <span className="flex-1 text-left">Checklist</span>
                    <Download className="w-4 h-4" />
                  </Button>
                )}

                {/* Mensaje si no hay archivos */}
                {!demo.guionUrl && !demo.checklistUrl && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No hay materiales descargables para esta demo
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Formulario para demo en vivo */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Solicitar demo en vivo</CardTitle>
              </CardHeader>
              <CardContent>
                {enviado ? (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Check className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      ¡Solicitud enviada!
                    </h4>
                    <p className="text-sm text-gray-500">
                      Nos pondremos en contacto contigo pronto.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitFormulario} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre *
                      </label>
                      <Input
                        required
                        value={formData.nombre}
                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="tu@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono
                      </label>
                      <Input
                        type="tel"
                        value={formData.telefono}
                        onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                        placeholder="+52 55 1234 5678"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mensaje (opcional)
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={formData.mensaje}
                        onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
                        placeholder="¿Qué te gustaría ver en la demo?"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      disabled={enviando}
                    >
                      {enviando ? (
                        'Enviando...'
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Solicitar demo
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Contacto directo */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h4 className="font-semibold text-gray-900">¿Prefieres llamarnos?</h4>
                <div className="space-y-3">
                  <a 
                    href="tel:+525555555555"
                    className="flex items-center gap-3 text-gray-600 hover:text-gray-900"
                  >
                    <Phone className="w-5 h-5 text-purple-500" />
                    +52 55 5555 5555
                  </a>
                  <a 
                    href="https://wa.me/525555555555"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-600 hover:text-gray-900"
                  >
                    <MessageCircle className="w-5 h-5 text-green-500" />
                    WhatsApp
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
