'use client';

/**
 * PlanCard - Componente de tarjeta para Planes
 * 
 * Muestra información de un plan con:
 * - Nombre y precio
 * - Lista de características
 * - Badge de destacado/popular
 * - Gradiente/color distintivo
 * - Botón de acción
 */

import Link from 'next/link';
import { Check, Star, ArrowRight, Download } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plan, parseCaracteristicasPlan, formatearPrecioPlan } from '@/lib/appwrite/client';

// =============================================================================
// TIPOS
// =============================================================================

interface PlanCardProps {
  plan: Plan;
  destacado?: boolean;
  onContacto?: (planId: string) => void;
  className?: string;
}

// =============================================================================
// COMPONENTE
// =============================================================================

export default function PlanCard({
  plan,
  destacado = false,
  onContacto,
  className = ''
}: PlanCardProps) {
  const caracteristicas = parseCaracteristicasPlan(plan.caracteristicas);
  const precioFormateado = formatearPrecioPlan(plan.precio, plan.moneda);
  
  // Determinar si mostrar como destacado
  const esDestacado = destacado || plan.destacado;
  
  // Color del plan (usar el color personalizado o default)
  const colorPlan = plan.color || '#3B82F6';
  
  return (
    <Link href={`/planes/${plan.slug}`}>
      <Card 
        className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full flex flex-col ${
          esDestacado 
            ? 'border-2 shadow-lg scale-105 z-10' 
            : 'border hover:border-gray-300'
        } ${className}`}
        style={{
          borderColor: esDestacado ? colorPlan : undefined
        }}
      >
        {/* Badge de destacado */}
        {plan.badge && (
          <div 
            className="absolute top-0 right-0 px-4 py-1 text-white text-xs font-semibold rounded-bl-lg"
            style={{ backgroundColor: colorPlan }}
          >
            {plan.badge}
          </div>
        )}

        {/* Header con gradiente */}
        <div 
          className="relative p-6 text-white"
          style={{
            background: `linear-gradient(135deg, ${colorPlan} 0%, ${ajustarColor(colorPlan, -30)} 100%)`
          }}
        >
          {/* Icono/imagen del plan */}
          {plan.imagen && (
            <div className="absolute top-4 right-4 opacity-20">
              <img 
                src={plan.imagen} 
                alt={plan.nombre}
                className="w-16 h-16 object-contain"
              />
            </div>
          )}
          
          <h3 className="text-xl font-bold mb-2">{plan.nombre}</h3>
          
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold">{precioFormateado}</span>
            {plan.moneda === 'MXN' && (
              <span className="text-sm opacity-80">MXN</span>
            )}
          </div>
          
          <p className="text-sm opacity-80 mt-2 line-clamp-2">
            {plan.descripcion}
          </p>
        </div>

        {/* Contenido */}
        <CardContent className="flex-1 p-6">
          <ul className="space-y-3">
            {caracteristicas.slice(0, 6).map((caracteristica, index) => (
              <li key={index} className="flex items-start gap-3">
                <div 
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                  style={{ backgroundColor: `${colorPlan}20` }}
                >
                  <Check 
                    className="w-3 h-3" 
                    style={{ color: colorPlan }}
                  />
                </div>
                <span className="text-sm text-gray-600">{caracteristica}</span>
              </li>
            ))}
            {caracteristicas.length > 6 && (
              <li className="text-sm text-gray-400">
                +{caracteristicas.length - 6} características más
              </li>
            )}
          </ul>
        </CardContent>

        {/* Footer */}
        <CardFooter className="p-6 pt-0">
          <Button 
            className="w-full group"
            style={{
              backgroundColor: colorPlan,
              hover: { backgroundColor: ajustarColor(colorPlan, -20) }
            }}
            onClick={(e) => {
              e.preventDefault();
              onContacto?.(plan.$id);
            }}
          >
            Más información
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardFooter>

        {/* Indicador de popular */}
        {esDestacado && (
          <div className="absolute top-4 left-4">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
          </div>
        )}
      </Card>
    </Link>
  );
}

// =============================================================================
// FUNCIONES AUXILIARES
// =============================================================================

/**
 * Ajustar luminosidad de un color hex
 */
function ajustarColor(hex: string, porcentaje: number): string {
  // Remover # si existe
  hex = hex.replace('#', '');
  
  // Convertir a RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Ajustar
  const ajustar = (valor: number) => {
    const ajustado = valor + (porcentaje * 255 / 100);
    return Math.min(255, Math.max(0, ajustado));
  };
  
  // Convertir de vuelta a hex
  const toHex = (valor: number) => {
    const hex = Math.round(ajustar(valor)).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// =============================================================================
// VARIANTE: PLAN CARD SIMPLE
// =============================================================================

export function PlanCardSimple({
  plan,
  className = ''
}: {
  plan: Plan;
  className?: string;
}) {
  const precioFormateado = formatearPrecioPlan(plan.precio, plan.moneda);
  const colorPlan = plan.color || '#3B82F6';

  return (
    <Link href={`/planes/${plan.slug}`}>
      <div 
        className={`flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors ${className}`}
        style={{ borderLeftColor: colorPlan, borderLeftWidth: '4px' }}
      >
        <div>
          <h4 className="font-semibold text-gray-900">{plan.nombre}</h4>
          {plan.badge && (
            <Badge 
              variant="outline" 
              className="mt-1 text-xs"
              style={{ borderColor: colorPlan, color: colorPlan }}
            >
              {plan.badge}
            </Badge>
          )}
        </div>
        <div className="text-right">
          <p className="text-xl font-bold" style={{ color: colorPlan }}>
            {precioFormateado}
          </p>
        </div>
      </div>
    </Link>
  );
}

// =============================================================================
// VARIANTE: PLAN CARD COMPACTO
// =============================================================================

export function PlanCardCompact({
  plan,
  selected = false,
  onSelect,
  className = ''
}: {
  plan: Plan;
  selected?: boolean;
  onSelect?: () => void;
  className?: string;
}) {
  const precioFormateado = formatearPrecioPlan(plan.precio, plan.moneda);
  const colorPlan = plan.color || '#3B82F6';

  return (
    <div 
      className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
        selected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-gray-300 bg-white'
      } ${className}`}
      onClick={onSelect}
    >
      <div 
        className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
        style={{ 
          borderColor: selected ? colorPlan : '#D1D5DB',
          backgroundColor: selected ? colorPlan : 'transparent'
        }}
      >
        {selected && <Check className="w-2 h-2 text-white" />}
      </div>
      
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{plan.nombre}</h4>
        <p className="text-xs text-gray-500">{plan.descripcion}</p>
      </div>
      
      <p className="font-bold" style={{ color: colorPlan }}>
        {precioFormateado}
      </p>
    </div>
  );
}

// =============================================================================
// VARIANTE: PLAN CARD TABLA (para comparador)
// =============================================================================

export function PlanCardTabla({
  plan,
  caracteristicasTodas,
  esPrimero = false,
  className = ''
}: {
  plan: Plan;
  caracteristicasTodas: string[];
  esPrimero?: boolean;
  className?: string;
}) {
  const caracteristicasPlan = parseCaracteristicasPlan(plan.caracteristicas);
  const precioFormateado = formatearPrecioPlan(plan.precio, plan.moneda);
  const colorPlan = plan.color || '#3B82F6';

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Header */}
      <div 
        className="p-4 text-white text-center rounded-t-lg"
        style={{
          background: `linear-gradient(135deg, ${colorPlan} 0%, ${ajustarColor(colorPlan, -30)} 100%)`
        }}
      >
        <h3 className="font-bold text-lg">{plan.nombre}</h3>
        {plan.badge && (
          <Badge className="mt-1 bg-white/20 text-white">
            {plan.badge}
          </Badge>
        )}
        <p className="text-2xl font-bold mt-2">{precioFormateado}</p>
      </div>

      {/* Características */}
      <div className="border-x border-b rounded-b-lg flex-1">
        {caracteristicasTodas.map((caracteristica, index) => {
          const incluida = caracteristicasPlan.some(c => 
            c.toLowerCase().includes(caracteristica.toLowerCase()) ||
            caracteristica.toLowerCase().includes(c.toLowerCase())
          );
          
          return (
            <div 
              key={index}
              className={`flex items-center justify-center p-3 ${
                index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
              } ${esPrimero ? 'border-r' : ''}`}
            >
              {incluida ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <span className="w-5 h-5 flex items-center justify-center text-gray-300">—</span>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="p-4 border-x border-b rounded-b-lg">
        <Link href={`/planes/${plan.slug}`}>
          <Button 
            variant="outline" 
            className="w-full"
            style={{ borderColor: colorPlan, color: colorPlan }}
          >
            Ver detalles
          </Button>
        </Link>
      </div>
    </div>
  );
}

// =============================================================================
// SKELETON PARA LOADING
// =============================================================================

export function PlanCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="p-6 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse">
        <div className="h-6 bg-gray-400 rounded w-1/2 mb-4" />
        <div className="h-10 bg-gray-400 rounded w-2/3 mb-2" />
        <div className="h-4 bg-gray-400 rounded w-full" />
      </div>
      <CardContent className="flex-1 p-6">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse" />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <div className="h-10 bg-gray-200 rounded w-full animate-pulse" />
      </CardFooter>
    </Card>
  );
}
