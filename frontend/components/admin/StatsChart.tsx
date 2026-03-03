/**
 * Componente StatsChart
 * Gráficos con Recharts para estadísticas del admin
 */

'use client';

import * as React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from 'recharts';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utilidad para combinar clases
const cn = (...inputs: (string | undefined | null | boolean)[]) => {
  return twMerge(clsx(inputs));
});

// Colores para gráficos
const COLORS = {
  primary: '#6D28D9',
  secondary: '#9333EA',
  blue: '#3B82F6',
  green: '#22C55E',
  yellow: '#EAB308',
  red: '#EF4444',
  purple: '#A855F7',
  pink: '#EC4899',
  indigo: '#6366F1',
  teal: '#14B8A6',
};

const CHART_COLORS = [
  COLORS.primary,
  COLORS.blue,
  COLORS.green,
  COLORS.yellow,
  COLORS.purple,
  COLORS.pink,
  COLORS.indigo,
  COLORS.teal,
];

// Props base
interface BaseChartProps {
  data: Record<string, any>[];
  height?: number;
  className?: string;
  loading?: boolean;
}

// Props para gráfico de barras
export interface BarChartProps extends BaseChartProps {
  dataKey: string;
  xAxisKey?: string;
  color?: string;
  showGrid?: boolean;
  showLegend?: boolean;
}

// Props para gráfico de líneas
export interface LineChartProps extends BaseChartProps {
  lines: { dataKey: string; color?: string; name?: string }[];
  xAxisKey?: string;
  showGrid?: boolean;
  showLegend?: boolean;
}

// Props para gráfico de pie
export interface PieChartProps extends BaseChartProps {
  dataKey: string;
  nameKey?: string;
  innerRadius?: number;
  outerRadius?: number;
  showLabels?: boolean;
}

// Props para gráfico de área
export interface AreaChartProps extends BaseChartProps {
  dataKey: string;
  xAxisKey?: string;
  color?: string;
  showGrid?: boolean;
  showLegend?: boolean;
}

// Componente de loading
const ChartLoading: React.FC<{ height: number }> = ({ height }) => (
  <div
    className="flex animate-pulse items-center justify-center rounded-lg bg-gray-100"
    style={{ height }}
  >
    <div className="h-32 w-32 rounded-full bg-gray-200" />
  </div>
);

// Tooltip personalizado
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-white px-4 py-3 shadow-lg">
        <p className="mb-1 font-medium text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Gráfico de barras
export const StatsBarChart: React.FC<BarChartProps> = ({
  data,
  dataKey,
  xAxisKey = 'name',
  color = COLORS.primary,
  height = 300,
  showGrid = true,
  showLegend = false,
  className,
  loading,
}) => {
  if (loading) return <ChartLoading height={height} />;

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
          <XAxis
            dataKey={xAxisKey}
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend />}
          <Bar
            dataKey={dataKey}
            fill={color}
            radius={[4, 4, 0, 0]}
            name={dataKey}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Gráfico de líneas
export const StatsLineChart: React.FC<LineChartProps> = ({
  data,
  lines,
  xAxisKey = 'name',
  height = 300,
  showGrid = true,
  showLegend = true,
  className,
  loading,
}) => {
  if (loading) return <ChartLoading height={height} />;

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
          <XAxis
            dataKey={xAxisKey}
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend />}
          {lines.map((line, index) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name || line.dataKey}
              stroke={line.color || CHART_COLORS[index % CHART_COLORS.length]}
              strokeWidth={2}
              dot={{ fill: line.color || CHART_COLORS[index % CHART_COLORS.length], strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Gráfico de pie
export const StatsPieChart: React.FC<PieChartProps> = ({
  data,
  dataKey = 'value',
  nameKey = 'name',
  innerRadius = 0,
  outerRadius = 80,
  height = 300,
  showLabels = true,
  className,
  loading,
}) => {
  if (loading) return <ChartLoading height={height} />;

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    if (!showLabels) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#374151"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs"
      >
        {name} ({(percent * 100).toFixed(0)}%)
      </text>
    );
  };

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={showLabels}
            label={renderLabel}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            dataKey={dataKey}
            nameKey={nameKey}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Gráfico de área
export const StatsAreaChart: React.FC<AreaChartProps> = ({
  data,
  dataKey,
  xAxisKey = 'name',
  color = COLORS.primary,
  height = 300,
  showGrid = true,
  showLegend = false,
  className,
  loading,
}) => {
  if (loading) return <ChartLoading height={height} />;

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
          <XAxis
            dataKey={xAxisKey}
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend />}
          <defs>
            <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#color-${dataKey})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Componente de leyenda personalizada para gráficos
export interface ChartLegendItem {
  label: string;
  value: string | number;
  color: string;
  percentage?: number;
}

export interface ChartLegendProps {
  items: ChartLegendItem[];
  className?: string;
}

export const ChartLegend: React.FC<ChartLegendProps> = ({ items, className }) => (
  <div className={cn('space-y-2', className)}>
    {items.map((item, index) => (
      <div key={index} className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-gray-600">{item.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{item.value}</span>
          {item.percentage !== undefined && (
            <span className="text-gray-400">({item.percentage}%)</span>
          )}
        </div>
      </div>
    ))}
  </div>
);

// Exportar colores para uso externo
export { COLORS, CHART_COLORS };
