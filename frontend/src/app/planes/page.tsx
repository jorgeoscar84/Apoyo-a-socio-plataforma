'use client';

/**
 * Página de Lista de Planes
 * 
 * Ruta: /planes
 * 
 * Funcionalidades:
 * - Cards de planes con estilo distintivo
 * - Highlight del plan destacado/recomendado
 * - Comparador de planes (tabla)
 * - Botón de "Más información" o contacto
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getPlanesOrdenados,
  getPlanDestacado,
  Plan,
  parseCaracteristicasPlan,
  formatearPrecioPlan
} from '@/lib/appwrite/client';
import PlanCard, { PlanCardSkeleton } from '@/components/plans/PlanCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Check,
  X,
  ArrowRight,
  Table,
  LayoutGrid,
  Phone,
  Mail,
  MessageCircle,
  HelpCircle
} from 'lucide-react';

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

export default function PlanesPage() {
  // Estados
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [planDestacado, setPlanDestacado] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vistaComparador, setVistaComparador] = useState(false);
  const [showContacto, setShowContacto] = useState(false);

  /**
   * Cargar planes
   */
  useEffect(() => {
    const cargarPlanes = async () => {
      setLoading(true);
      setError(null);

      try {
        const [planesData, destacado] = await Promise.all([
          getPlanesOrdenados(),
          getPlanDestacado()
        ]);

        setPlanes(planesData);
        setPlanDestacado(destacado);
      } catch (err) {
        console.error('Error al cargar planes:', err);
        setError('No se pudieron cargar los planes. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    cargarPlanes();
  }, []);

  /**
   * Obtener todas las características únicas para el comparador
   */
  const obtenerTodasCaracteristicas = (): string[] => {
    const todasCaracteristicas = new Set<string>();
    
    planes.forEach(plan => {
      const caracteristicas = parseCaracteristicasPlan(plan.caracteristicas);
      caracteristicas.forEach(c => todasCaracteristicas.add(c));
    });

    return Array.from(todasCaracteristicas);
  };

  /**
   * Verificar si un plan tiene una característica
   */
  const tieneCaracteristica = (plan: Plan, caracteristica: string): boolean => {
    const caracteristicasPlan = parseCaracteristicasPlan(plan.caracteristicas);
    return caracteristicasPlan.some(c => 
      c.toLowerCase().includes(caracteristica.toLowerCase()) ||
      caracteristica.toLowerCase().includes(c.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Badge className="bg-white/20 text-white mb-4">
              Planes y Precios
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Encuentra el plan perfecto para tu negocio
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Descubre nuestras soluciones diseñadas para impulsar el crecimiento de tu empresa
            </p>

            {/* Toggle de vista */}
            <div className="flex items-center justify-center gap-2">
              <Button
                variant={!vistaComparador ? 'secondary' : 'ghost'}
                onClick={() => setVistaComparador(false)}
                className="gap-2"
              >
                <LayoutGrid className="w-4 h-4" />
                Cards
              </Button>
              <Button
                variant={vistaComparador ? 'secondary' : 'ghost'}
                onClick={() => setVistaComparador(true)}
                className="gap-2"
              >
                <Table className="w-4 h-4" />
                Comparar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="mt-2"
            >
              Intentar de nuevo
            </Button>
          </div>
        )}

        {/* Vista de Cards */}
        {!vistaComparador && (
          <>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                {Array.from({ length: 3 }).map((_, i) => (
                  <PlanCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                {planes.map((plan) => (
                  <PlanCard
                    key={plan.$id}
                    plan={plan}
                    destacado={plan.$id === planDestacado?.$id}
                    onContacto={() => setShowContacto(true)}
                  />
                ))}
              </div>
            )}

            {/* Sección de ayuda */}
            <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  ¿Necesitas ayuda para elegir?
                </h2>
                <p className="text-gray-500">
                  Nuestro equipo está listo para ayudarte a encontrar el plan ideal
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 rounded-xl bg-gray-50">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Llámanos</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Habla directamente con un asesor
                  </p>
                  <a href="tel:+525555555555" className="text-blue-600 font-medium">
                    +52 55 5555 5555
                  </a>
                </div>

                <div className="text-center p-6 rounded-xl bg-gray-50">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">WhatsApp</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Chatea con nosotros al instante
                  </p>
                  <a 
                    href="https://wa.me/525555555555" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 font-medium"
                  >
                    Enviar mensaje
                  </a>
                </div>

                <div className="text-center p-6 rounded-xl bg-gray-50">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Escríbenos y te respondemos pronto
                  </p>
                  <a href="mailto:ventas@ejemplo.com" className="text-purple-600 font-medium">
                    ventas@ejemplo.com
                  </a>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Vista de Comparador */}
        {vistaComparador && !loading && planes.length > 0 && (
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header de la tabla */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Comparar planes
                  </h3>
                  <p className="text-sm text-gray-500">
                    Encuentra las diferencias entre cada plan
                  </p>
                </div>
                {planes.slice(0, 3).map((plan) => {
                  const colorPlan = plan.color || '#3B82F6';
                  const esDestacado = plan.$id === planDestacado?.$id;
                  
                  return (
                    <div 
                      key={plan.$id}
                      className={`p-4 rounded-t-xl text-center ${esDestacado ? 'scale-105' : ''}`}
                      style={{
                        background: `linear-gradient(135deg, ${colorPlan} 0%, ${colorPlan}CC 100%)`
                      }}
                    >
                      {plan.badge && (
                        <Badge className="bg-white/20 text-white mb-2">
                          {plan.badge}
                        </Badge>
                      )}
                      <h4 className="text-xl font-bold text-white">{plan.nombre}</h4>
                      <p className="text-3xl font-bold text-white mt-2">
                        {formatearPrecioPlan(plan.precio, plan.moneda)}
                      </p>
                      <Link href={`/planes/${plan.slug}`}>
                        <Button 
                          className="mt-4 bg-white text-gray-900 hover:bg-gray-100"
                        >
                          Ver detalles
                        </Button>
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Características */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {obtenerTodasCaracteristicas().map((caracteristica, index) => (
                  <div 
                    key={index}
                    className={`grid grid-cols-4 gap-4 ${
                      index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    }`}
                  >
                    <div className="p-4 font-medium text-gray-700">
                      {caracteristica}
                    </div>
                    {planes.slice(0, 3).map((plan) => (
                      <div 
                        key={plan.$id}
                        className="p-4 flex items-center justify-center"
                      >
                        {tieneCaracteristica(plan, caracteristica) ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300" />
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Preguntas frecuentes
            </h2>
            <p className="text-gray-500">
              Respuestas a las dudas más comunes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                pregunta: '¿Puedo cambiar de plan en cualquier momento?',
                respuesta: 'Sí, puedes actualizar o cambiar tu plan en cualquier momento. El cambio se reflejará en tu próxima factura.'
              },
              {
                pregunta: '¿Hay contratos de permanencia?',
                respuesta: 'No, todos nuestros planes son sin permanencia. Puedes cancelar cuando lo desees.'
              },
              {
                pregunta: '¿Incluye soporte técnico?',
                respuesta: 'Todos los planes incluyen soporte técnico por email. Los planes superiores incluyen soporte prioritario y por teléfono.'
              },
              {
                pregunta: '¿Ofrecen descuentos por pago anual?',
                respuesta: 'Sí, al pagar anualmente recibes un descuento del 20% sobre el precio mensual.'
              }
            ].map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <HelpCircle className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {faq.pregunta}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {faq.respuesta}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para empezar?
          </h2>
          <p className="text-gray-300 mb-8">
            Únete a miles de empresas que ya confían en nosotros
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contacto">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                Solicitar demo gratuita
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/material">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Ver materiales
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
