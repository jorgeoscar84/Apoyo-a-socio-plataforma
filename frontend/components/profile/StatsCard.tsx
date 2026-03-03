/**
 * Componente StatsCard
 * Tarjeta de estadística individual con animación de contador
 */

'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LucideIcon } from 'lucide-react';

// Utilidad para combinar clases
const cn = (...inputs: (string | undefined | null | boolean)[]) => {
  return twMerge(clsx(inputs));
};

export interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  suffix?: string;
  prefix?: string;
  color?: 'primary' | 'blue' | 'green' | 'yellow' | 'purple' | 'red';
  animate?: boolean;
  className?: string;
}

// Colores para los iconos
const colorClasses = {
  primary: {
    bg: 'bg-primary/10',
    text: 'text-primary',
  },
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-600',
  },
  yellow: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-600',
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
  },
  red: {
    bg: 'bg-red-100',
    text: 'text-red-600',
  },
};

// Hook para animación de contador
function useCounter(end: number, duration: number = 1000, animate: boolean = true) {
  const [count, setCount] = React.useState(animate ? 0 : end);

  React.useEffect(() => {
    if (!animate) {
      setCount(end);
      return;
    }

    let startTime: number | null = null;
    let animationFrame: number;

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animateCount);
      }
    };

    animationFrame = requestAnimationFrame(animateCount);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, animate]);

  return count;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  suffix = '',
  prefix = '',
  color = 'primary',
  animate = true,
  className,
}) => {
  const count = useCounter(value, 1500, animate);
  const colorClass = colorClasses[color];

  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {prefix}
            {count.toLocaleString()}
            {suffix}
          </p>
        </div>
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-lg',
            colorClass.bg
          )}
        >
          <Icon className={cn('h-6 w-6', colorClass.text)} />
        </div>
      </div>
    </div>
  );
};

// Componente para mostrar progreso circular
export interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  showValue?: boolean;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 10,
  color = 'stroke-primary',
  label,
  showValue = true,
}) => {
  const animatedValue = useCounter(value, 1500, true);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min((animatedValue / max) * 100, 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="fill-none stroke-gray-200"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className={cn('fill-none transition-all duration-1000 ease-out', color)}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
            strokeLinecap: 'round',
          }}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">
            {animatedValue}%
          </span>
          {label && (
            <span className="text-xs text-gray-500">{label}</span>
          )}
        </div>
      )}
    </div>
  );
};

// Componente para barra de progreso
export interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'primary' | 'blue' | 'green' | 'yellow' | 'red';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const progressBarColors = {
  primary: 'bg-primary',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = 'primary',
  showLabel = false,
  label,
  className,
}) => {
  const animatedValue = useCounter(value, 1500, true);
  const percentage = Math.min((animatedValue / max) * 100, 100);

  return (
    <div className={cn('w-full', className)}>
      {(showLabel || label) && (
        <div className="mb-1 flex items-center justify-between">
          <span className="text-sm text-gray-600">{label}</span>
          <span className="text-sm font-medium text-gray-900">{percentage}%</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-1000 ease-out',
            progressBarColors[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default StatsCard;
