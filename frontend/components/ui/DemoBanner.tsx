'use client';

import React, { useState, useEffect } from 'react';
import { IS_DEMO, DEMO_MESSAGE } from '@/lib/config/demo-config';

/**
 * DemoBanner Component
 * 
 * Muestra un banner en la parte superior de la pantalla cuando
 * la aplicación está en modo demostración.
 */
export default function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  // No mostrar si no estamos en modo demo
  if (!IS_DEMO) {
    return null;
  }

  // Si fue cerrado, no mostrar
  if (isDismissed) {
    return null;
  }

  return (
    <>
      {/* Estilos para la animación */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        .demo-banner {
          animation: slideDown 0.3s ease-out;
        }
        
        .demo-badge {
          animation: pulse 2s infinite;
        }
      `}</style>

      <div 
        className={`
          demo-banner
          fixed top-0 left-0 right-0 z-[9999]
          bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500
          text-white
          py-2 px-4
          shadow-lg
        `}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Lado izquierdo - Badge y mensaje */}
          <div className="flex items-center gap-3">
            {/* Badge animado */}
            <span className="demo-badge inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm">
              <svg 
                className="w-3.5 h-3.5 mr-1.5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 10V3L4 14h7v7l9-11h-7z" 
                />
              </svg>
              DEMO
            </span>

            {/* Mensaje */}
            <p className="text-sm font-medium">
              {DEMO_MESSAGE}
            </p>
          </div>

          {/* Lado derecho - Info y cerrar */}
          <div className="flex items-center gap-4">
            {/* Info tooltip */}
            <button
              onClick={() => {
                alert(
                  '📌 Modo Demostración\n\n' +
                  '• Los datos mostrados son de prueba\n' +
                  '• Los cambios no se guardarán\n' +
                  '• Para usar la versión real, configura Appwrite\n\n' +
                  'Usuario demo: demo@plataforma.com\n' +
                  'Contraseña: cualquier contraseña'
                );
              }}
              className="text-white/80 hover:text-white transition-colors"
              title="Más información"
            >
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </button>

            {/* Botón cerrar */}
            <button
              onClick={() => setIsDismissed(true)}
              className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
              title="Ocultar banner"
            >
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Spacer para compensar el banner fijo */}
      <div className="h-10" />
    </>
  );
}

/**
 * Versión compacta del banner para usar en espacios reducidos
 */
export function DemoBannerCompact() {
  if (!IS_DEMO) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
      <svg 
        className="w-3.5 h-3.5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M13 10V3L4 14h7v7l9-11h-7z" 
        />
      </svg>
      Modo Demo
    </div>
  );
}

/**
 * Badge pequeño para indicar que algo es demo
 */
export function DemoBadge({ className = '' }: { className?: string }) {
  if (!IS_DEMO) {
    return null;
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 ${className}`}>
      DEMO
    </span>
  );
}

/**
 * Indicador de funcionalidad deshabilitada en modo demo
 */
export function DemoDisabledIndicator({ 
  show = true, 
  message = 'No disponible en modo demo' 
}: { 
  show?: boolean; 
  message?: string;
}) {
  if (!IS_DEMO || !show) {
    return null;
  }

  return (
    <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
      <div className="bg-white rounded-lg shadow-xl p-4 max-w-xs text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-100 flex items-center justify-center">
          <svg 
            className="w-6 h-6 text-amber-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
            />
          </svg>
        </div>
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
}

/**
 * Wrapper para deshabilitar componentes en modo demo
 */
export function DemoDisabledWrapper({ 
  children, 
  disabled = true,
  message = 'Esta funcionalidad no está disponible en modo demo'
}: { 
  children: React.ReactNode;
  disabled?: boolean;
  message?: string;
}) {
  if (!IS_DEMO || !disabled) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
      <DemoDisabledIndicator message={message} />
    </div>
  );
}
