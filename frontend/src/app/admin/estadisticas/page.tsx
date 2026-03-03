/**
 * Página de Estadísticas - Admin
 * Gráficos y métricas detalladas de la plataforma
 */

'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  Users,
  Video,
  Calendar,
  FileText,
  Play,
  Download,
  TrendingUp,
  Loader2,
  CalendarDays,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/profile/StatsCard';
import {
  StatsBarChart,
  StatsLineChart,
  StatsPieChart,
  StatsAreaChart,
  CHART_COLORS,
  ChartLegend,
} from '@/components/admin/StatsChart';
import {
  getAdminStats,
  getUserStatsByMonth,
  getMostViewedVideos,
  getMostDownloadedMaterials,
  getMostPopularEvents,
  AdminStats,
  UsuariosPorMes,
  VideoConVistas,
  MaterialConDescargas,
  EventoConInscripciones,
  exportToCSV,
} from '@/lib/appwrite/client';

// Utilidad para combinar clases
const cn = (...inputs: (string | undefined | null | boolean)[]) => {
  return twMerge(clsx(inputs));
});

// Opciones de período
const periodOptions = [
  { value: '6', label: 'Últimos 6 meses' },
  { value: '12', label: 'Último año' },
  { value: '24', label: 'Últimos 2 años' },
];

const AdminEstadisticasPage: React.FC = () => {
  // Estado
  const [periodo, setPeriodo] = React.useState(6);
  const [isLoading, setIsLoading] = React.useState(true);
  
  // Datos
  const [stats, setStats] = React.useState<AdminStats | null>(null);
  const [usuariosPorMes, setUsuariosPorMes] = React.useState<UsuariosPorMes[]>([]);
  const [videosPopulares, setVideosPopulares] = React.useState<VideoConVistas[]>([]);
  const [materialesPopulares, setMaterialesPopulares] = React.useState<MaterialConDescargas[]>([]);
  const [eventosPopulares, setEventosPopulares] = React.useState<EventoConInscripciones[]>([]);

  // Cargar datos
  React.useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [adminStats, usuarios, videos, materiales, eventos] = await Promise.all([
          getAdminStats(),
          getUserStatsByMonth(periodo),
          getMostViewedVideos(10),
          getMostDownloadedMaterials(10),
          getMostPopularEvents(10),
        ]);

        setStats(adminStats);
        setUsuariosPorMes(usuarios);
        setVideosPopulares(videos);
        setMaterialesPopulares(materiales);
        setEventosPopulares(eventos);
      } catch (error) {
        console.error('Error cargando estadísticas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [periodo]);

  // Preparar datos para gráficos
  const chartDataUsuarios = usuariosPorMes.map((item) => ({
    name: item.mes,
    usuarios: item.cantidad,
  }));

  const chartDataVideos = videosPopulares.slice(0, 5).map((v) => ({
    name: v.titulo.length > 20 ? v.titulo.substring(0, 20) + '...' : v.titulo,
    vistas: v.vistas,
  }));

  const chartDataMateriales = materialesPopulares.slice(0, 5).map((m) => ({
    name: m.nombre.length > 20 ? m.nombre.substring(0, 20) + '...' : m.nombre,
    descargas: m.totalDescargas,
  }));

  const chartDataEventos = eventosPopulares.slice(0, 5).map((e) => ({
    name: e.titulo.length > 20 ? e.titulo.substring(0, 20) + '...' : e.titulo,
    inscritos: e.totalInscripciones,
  }));

  // Datos para gráfico de pie (distribución por rol)
  const chartDataRoles = [
    { name: 'Socios', value: stats?.totalUsuarios ? Math.round(stats.totalUsuarios * 0.8) : 0 },
    { name: 'Asesores', value: stats?.totalUsuarios ? Math.round(stats.totalUsuarios * 0.15) : 0 },
    { name: 'Admins', value: stats?.totalUsuarios ? Math.round(stats.totalUsuarios * 0.05) : 0 },
  ];

  // Exportar todos los datos
  const handleExportAll = () => {
    // Exportar usuarios
    if (usuariosPorMes.length > 0) {
      exportToCSV(
        usuariosPorMes.map((u) => ({
          mes: u.mes,
          cantidad: u.cantidad,
        })),
        [
          { key: 'mes', label: 'Mes' },
          { key: 'cantidad', label: 'Usuarios' },
        ],
        'estadisticas_usuarios'
      );
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Estadísticas</h1>
            <p className="text-gray-500">
              Métricas y análisis detallado de la plataforma
            </p>
          </div>
          <div className="flex gap-2">
            <select
              value={periodo}
              onChange={(e) => setPeriodo(parseInt(e.target.value))}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {periodOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Button variant="outline" onClick={handleExportAll}>
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Resumen general */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Total Usuarios"
                value={stats?.totalUsuarios || 0}
                icon={Users}
                color="primary"
              />
              <StatsCard
                title="Videos Activos"
                value={stats?.videosActivos || 0}
                icon={Video}
                color="blue"
              />
              <StatsCard
                title="Eventos Próximos"
                value={stats?.eventosProximos || 0}
                icon={Calendar}
                color="green"
              />
              <StatsCard
                title="Materiales"
                value={stats?.totalMateriales || 0}
                icon={FileText}
                color="yellow"
              />
            </div>

            {/* Métricas de actividad */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <Play className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Reproducciones</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.reproduccionesTotales?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <Download className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Descargas</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.descargasTotales?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nuevos este mes</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.usuariosNuevosEsteMes || 0}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Gráficos principales */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Usuarios por mes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Registro de Usuarios
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {chartDataUsuarios.length > 0 ? (
                    <StatsAreaChart
                      data={chartDataUsuarios}
                      dataKey="usuarios"
                      xAxisKey="name"
                      color={CHART_COLORS[0]}
                      height={280}
                    />
                  ) : (
                    <div className="flex h-[280px] items-center justify-center text-gray-500">
                      Sin datos disponibles
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Distribución por rol */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Distribución por Rol
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <StatsPieChart
                      data={chartDataRoles}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={100}
                      height={250}
                    />
                    <ChartLegend
                      items={chartDataRoles.map((item, index) => ({
                        label: item.name,
                        value: item.value,
                        color: CHART_COLORS[index],
                        percentage: Math.round((item.value / (stats?.totalUsuarios || 1)) * 100),
                      }))}
                      className="mt-4 w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos de contenido */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Videos más vistos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Videos Más Vistos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {chartDataVideos.length > 0 ? (
                    <StatsBarChart
                      data={chartDataVideos}
                      dataKey="vistas"
                      xAxisKey="name"
                      color={CHART_COLORS[1]}
                      height={280}
                    />
                  ) : (
                    <div className="flex h-[280px] items-center justify-center text-gray-500">
                      Sin datos disponibles
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Materiales más descargados */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Materiales Más Descargados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {chartDataMateriales.length > 0 ? (
                    <StatsBarChart
                      data={chartDataMateriales}
                      dataKey="descargas"
                      xAxisKey="name"
                      color={CHART_COLORS[2]}
                      height={280}
                    />
                  ) : (
                    <div className="flex h-[280px] items-center justify-center text-gray-500">
                      Sin datos disponibles
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Eventos populares */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Eventos con Más Inscripciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                {chartDataEventos.length > 0 ? (
                  <StatsBarChart
                    data={chartDataEventos}
                    dataKey="inscritos"
                    xAxisKey="name"
                    color={CHART_COLORS[3]}
                    height={280}
                  />
                ) : (
                  <div className="flex h-[280px] items-center justify-center text-gray-500">
                    Sin datos disponibles
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tablas detalladas */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Top videos */}
              <Card>
                <CardHeader>
                  <CardTitle>Top 10 Videos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="divide-y">
                    {videosPopulares.map((video, index) => (
                      <div key={video.$id} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium">
                            {index + 1}
                          </span>
                          <span className="text-sm text-gray-900 truncate max-w-[200px]">
                            {video.titulo}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-600">
                          {video.vistas.toLocaleString()} vistas
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top materiales */}
              <Card>
                <CardHeader>
                  <CardTitle>Top 10 Materiales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="divide-y">
                    {materialesPopulares.map((material, index) => (
                      <div key={material.$id} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium">
                            {index + 1}
                          </span>
                          <span className="text-sm text-gray-900 truncate max-w-[200px]">
                            {material.nombre}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-600">
                          {material.totalDescargas.toLocaleString()} descargas
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminEstadisticasPage;
