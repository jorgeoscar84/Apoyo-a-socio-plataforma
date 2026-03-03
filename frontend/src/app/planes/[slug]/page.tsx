'use client';

/**
 * Página de Detalle de Plan
 * 
 * Ruta: /planes/[slug]
 * 
 * Funcionalidades:
 * - Información detallada del plan
 * - Lista de características con iconos
 * - Sección de contacto/solicitud
 * - Planes alternativos
 */

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  getPlanBySlug,
  getPlanesAlternativos,
  Plan,
  parseCaracteristicasPlan,
  formatearPrecioPlan
} from '@/lib/appwrite/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Check,
  ArrowLeft,
  ChevronRight,
  Star,
  Phone,
  Mail,
  MessageCircle,
  Download,
  Clock,
  Users,
  Shield,
  Zap,
  Send
} from 'lucide-react';

// =============================================================================
// TIPOS
// =============================================================================

interface PageProps {
  params: Promise<{ slug: string }>;
}

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

export default function PlanDetallePage({ params }: PageProps) {
  const { slug } = use(params);
  
  // Estados
  const [plan, setPlan] = useState<Plan | null>(null);
  const [planesAlternativos, setPlanesAlternativos] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
   * Cargar plan
   */
  useEffect(() => {
    const cargarPlan = async () => {
      setLoading(true);
      setError(null);

      try {
        const planData = await getPlanBySlug(slug);
        
        if (!planData) {
          setError('Plan no encontrado');
          return;
        }

        setPlan(planData);

        // Cargar planes alternativos
        const alternativos = await getPlanesAlternativos(planData.$id, 3);
        setPlanesAlternativos(alternativos);
      } catch (err) {
        console.error('Error al cargar plan:', err);
        setError('No se pudo cargar el plan');
      } finally {
        setLoading(false);
      }
    };

    cargarPlan();
  }, [slug]);

  /**
   * Manejar envío de formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!plan) return;
    
    setEnviando(true);
    
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setEnviando(false);
    setEnviado(true);
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
                <div className="bg-white rounded-xl p-8">
                  <div className="h-10 bg-gray-200 rounded w-1/2 mb-4" />
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-8" />
                  <div className="space-y-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-6">
                  <div className="h-40 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'Plan no encontrado'}
          </h2>
          <p className="text-gray-500 mb-6">
            El plan que buscas no está disponible o no existe.
          </p>
          <Link href="/planes">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Ver todos los planes
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Datos derivados
  const caracteristicas = parseCaracteristicasPlan(plan.caracteristicas);
  const precioFormateado = formatearPrecioPlan(plan.precio, plan.moneda);
  const colorPlan = plan.color || '#3B82F6';

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
            <Link href="/planes" className="text-gray-500 hover:text-gray-700">
              Planes
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{plan.nombre}</span>
          </nav>
        </div>
      </div>

      {/* Header del plan */}
      <div 
        className="text-white"
        style={{
          background: `linear-gradient(135deg, ${colorPlan} 0%, ${ajustarColor(colorPlan, -30)} 100%)`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              {plan.badge && (
                <Badge className="bg-white/20 text-white mb-4">
                  <Star className="w-3 h-3 mr-1" />
                  {plan.badge}
                </Badge>
              )}
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {plan.nombre}
              </h1>
              <p className="text-lg opacity-90 max-w-xl">
                {plan.descripcion}
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-5xl font-bold">{precioFormateado}</p>
              {plan.moneda === 'MXN' && (
                <p className="text-sm opacity-80 mt-1">Precio en MXN</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Características */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Características incluidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {caracteristicas.map((caracteristica, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
                    >
                      <div 
                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${colorPlan}20` }}
                      >
                        <Check 
                          className="w-4 h-4" 
                          style={{ color: colorPlan }}
                        />
                      </div>
                      <span className="text-gray-700">{caracteristica}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Beneficios destacados */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">¿Por qué elegir este plan?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${colorPlan}15` }}
                      >
                        <Zap className="w-6 h-6" style={{ color: colorPlan }} />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Implementación rápida</h4>
                      <p className="text-sm text-gray-500">
                        Comienza a usar el software en menos de 24 horas
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${colorPlan}15` }}
                      >
                        <Users className="w-6 h-6" style={{ color: colorPlan }} />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Soporte dedicado</h4>
                      <p className="text-sm text-gray-500">
                        Equipo de soporte disponible para ayudarte
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${colorPlan}15` }}
                      >
                        <Clock className="w-6 h-6" style={{ color: colorPlan }} />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Actualizaciones constantes</h4>
                      <p className="text-sm text-gray-500">
                        Nuevas funciones y mejoras cada mes
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${colorPlan}15` }}
                      >
                        <Shield className="w-6 h-6" style={{ color: colorPlan }} />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Seguridad garantizada</h4>
                      <p className="text-sm text-gray-500">
                        Tus datos protegidos con los más altos estándares
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Brochure descargable */}
            {plan.pdfBrochure && (
              <Card className="border-dashed">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-16 h-16 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${colorPlan}15` }}
                    >
                      <Download className="w-8 h-8" style={{ color: colorPlan }} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        Descarga el brochure del plan
                      </h4>
                      <p className="text-sm text-gray-500">
                        Conoce todos los detalles en formato PDF
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => window.open(plan.pdfBrochure, '_blank')}
                      style={{ borderColor: colorPlan, color: colorPlan }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Descargar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Formulario de contacto */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Solicitar información</CardTitle>
              </CardHeader>
              <CardContent>
                {enviado ? (
                  <div className="text-center py-8">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: `${colorPlan}15` }}
                    >
                      <Check className="w-8 h-8" style={{ color: colorPlan }} />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      ¡Solicitud enviada!
                    </h4>
                    <p className="text-sm text-gray-500">
                      Nos pondremos en contacto contigo pronto.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
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
                        Empresa
                      </label>
                      <Input
                        value={formData.empresa}
                        onChange={(e) => setFormData({...formData, empresa: e.target.value})}
                        placeholder="Nombre de tu empresa"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mensaje
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.mensaje}
                        onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
                        placeholder="¿En qué podemos ayudarte?"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      style={{ backgroundColor: colorPlan }}
                      disabled={enviando}
                    >
                      {enviando ? (
                        'Enviando...'
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Enviar solicitud
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
                    <Phone className="w-5 h-5" style={{ color: colorPlan }} />
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
                  <a 
                    href="mailto:ventas@ejemplo.com"
                    className="flex items-center gap-3 text-gray-600 hover:text-gray-900"
                  >
                    <Mail className="w-5 h-5 text-purple-500" />
                    ventas@ejemplo.com
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Planes alternativos */}
        {planesAlternativos.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Otros planes que podrían interesarte
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {planesAlternativos.map((planAlt) => {
                const precioAlt = formatearPrecioPlan(planAlt.precio, planAlt.moneda);
                const colorAlt = planAlt.color || '#3B82F6';
                
                return (
                  <Link key={planAlt.$id} href={`/planes/${planAlt.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                      <div 
                        className="h-2"
                        style={{ backgroundColor: colorAlt }}
                      />
                      <CardContent className="p-6">
                        {planAlt.badge && (
                          <Badge 
                            variant="outline"
                            className="mb-2"
                            style={{ borderColor: colorAlt, color: colorAlt }}
                          >
                            {planAlt.badge}
                          </Badge>
                        )}
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {planAlt.nombre}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                          {planAlt.descripcion}
                        </p>
                        <p className="text-2xl font-bold" style={{ color: colorAlt }}>
                          {precioAlt}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// FUNCIONES AUXILIARES
// =============================================================================

/**
 * Ajustar luminosidad de un color hex
 */
function ajustarColor(hex: string, porcentaje: number): string {
  hex = hex.replace('#', '');
  
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  const ajustar = (valor: number) => {
    const ajustado = valor + (porcentaje * 255 / 100);
    return Math.min(255, Math.max(0, ajustado));
  };
  
  const toHex = (valor: number) => {
    const hex = Math.round(ajustar(valor)).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
