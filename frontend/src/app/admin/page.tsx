/**
 * Dashboard Admin
 * Página principal del panel de administración
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
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
  ArrowRight,
  Loader2,
  Eye,
  Clock,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/profile/StatsCard';
import { StatsAreaChart, StatsBarChart, CHART_COLORS } from '@/components/admin/StatsChart';
import {
  getAdminStats,
  getMostViewedVideos,
  getMostDownloadedMaterials,
  getUserStatsByMonth,
  AdminStats,
  VideoConVistas,
  MaterialConDescargas,
  UsuariosPorMes,
} from '@/lib/appwrite/client';

// Utilidad para combinar clases
const cn = (...inputs: (string | undefined | null | boolean)[]) => {
  return twMerge(clsx(inputs));
});

// Componente de acceso rápido
interface QuickAccessProps {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
}

const QuickAccess: React.FC<QuickAccessProps> = ({
  title,
  description,
  icon: Icon,
  href,
  color,
}) => (
  <Link
    href={href}
    className="group flex items-center gap-4 rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md"
  >
    <div className={cn('flex h-12 w-12 items-center justify-center rounded-lg', color)}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    <div className="flex-1">
      <h3 className="font-medium text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    <ArrowRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />
  </Link>
);

// Componente de item de lista
interface ListItemProps {
  title: string;
  subtitle?: string;
  value: number;
  icon?: React.ElementType;
}

const ListItem: React.FC<ListItemProps> = ({ title, subtitle, value, icon: Icon }) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex items-center gap-3">
      {Icon && (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
          <Icon className="h-4 w-4 text-gray-600" />
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-gray-900">{title}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
    <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
      {value.toLocaleString()}
      {Icon === Eye && <Eye className="ml-1 h-3 w-3 text-gray-400" />}
      {Icon === Download && <Download className="ml-1 h-3 w-3 text-gray-400" />}
    </div>
  </div>
);

// Página del dashboard
const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = React.useState<AdminStats | null>(null);
  const [videosPopulares, setVideosPopulares] = React.useState<VideoConVistas[]>([]);
  const [materialesPopulares, setMaterialesPopulares] = React.useState<MaterialConDescargas[]>([]);
  const [usuariosPorMes, setUsuariosPorMes] = React.useState<UsuariosPorMes[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Cargar datos
  React.useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [adminStats, videos, materiales, usuarios] = await Promise.all([
          getAdminStats(),
          getMostViewedVideos(5),
          getMostDownloadedMaterials(5),
          getUserStatsByMonth(6),
        ]);

        setStats(adminStats);
        setVideosPopulares(videos);
        setMaterialesPopulares(materiales);
        setUsuariosPorMes(usuarios);
      } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Preparar datos para gráficos
  const chartDataUsuarios = usuariosPorMes.map((item) => ({
    name: item.mes,
    usuarios: item.cantidad,
  }));

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">
            Resumen general de la plataforma de capacitación
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Tarjetas de estadísticas */}
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

            {/* Métricas secundarias */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Usuarios Activos</span>
                  <Badge variant="success">{stats?.usuariosActivos || 0}</Badge>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Nuevos este mes</span>
                  <Badge variant="primary">{stats?.usuariosNuevosEsteMes || 0}</Badge>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Reproducciones</span>
                  <Badge variant="info">{stats?.reproduccionesTotales || 0}</Badge>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Descargas</span>
                  <Badge variant="warning">{stats?.descargasTotales || 0}</Badge>
                </div>
              </Card>
            </div>

            {/* Accesos rápidos */}
            <div>
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Accesos Rápidos</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <QuickAccess
                  title="Usuarios"
                  description="Gestionar usuarios"
                  icon={Users}
                  href="/admin/usuarios"
                  color="bg-primary"
                />
                <QuickAccess
                  title="Videos"
                  description="Gestionar videos"
                  icon={Video}
                  href="/admin/videos"
                  color="bg-blue-500"
                />
                <QuickAccess
                  title="Eventos"
                  description="Gestionar eventos"
                  icon={Calendar}
                  href="/admin/eventos"
                  color="bg-green-500"
                />
                <QuickAccess
                  title="Materiales"
                  description="Gestionar materiales"
                  icon={FileText}
                  href="/admin/materiales"
                  color="bg-yellow-500"
                />
              </div>
            </div>

            {/* Gráficos y listas */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Gráfico de usuarios por mes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Usuarios por Mes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {chartDataUsuarios.length > 0 ? (
                    <StatsAreaChart
                      data={chartDataUsuarios}
                      dataKey="usuarios"
                      xAxisKey="name"
                      color={CHART_COLORS[0]}
                      height={250}
                    />
                  ) : (
                    <div className="flex h-[250px] items-center justify-center text-gray-500">
                      No hay datos disponibles
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Videos más vistos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Play className="h-5 w-5" />
                      Videos Más Vistos
                    </span>
                    <Link href="/admin/videos">
                      <Button variant="ghost" size="sm">
                        Ver todos
                      </Button>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {videosPopulares.length > 0 ? (
                    <div className="divide-y">
                      {videosPopulares.map((video) => (
                        <ListItem
                          key={video.$id}
                          title={video.titulo}
                          subtitle={video.descripcion?.substring(0, 50) + '...'}
                          value={video.vistas}
                          icon={Eye}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-gray-500">
                      No hay datos de videos
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Materiales más descargados */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      Materiales Más Descargados
                    </span>
                    <Link href="/admin/materiales">
                      <Button variant="ghost" size="sm">
                        Ver todos
                      </Button>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {materialesPopulares.length > 0 ? (
                    <div className="divide-y">
                      {materialesPopulares.map((material) => (
                        <ListItem
                          key={material.$id}
                          title={material.nombre}
                          subtitle={material.categoria}
                          value={material.totalDescargas}
                          icon={Download}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-gray-500">
                      No hay datos de materiales
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Última actividad */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Actividad Reciente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: 'Nuevo usuario registrado', time: 'Hace 5 minutos', type: 'user' },
                      { action: 'Video completado', time: 'Hace 10 minutos', type: 'video' },
                      { action: 'Inscripción a evento', time: 'Hace 15 minutos', type: 'event' },
                      { action: 'Material descargado', time: 'Hace 20 minutos', type: 'material' },
                      { action: 'Nuevo usuario registrado', time: 'Hace 30 minutos', type: 'user' },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-full',
                          activity.type === 'user' && 'bg-primary/10',
                          activity.type === 'video' && 'bg-blue-100',
                          activity.type === 'event' && 'bg-green-100',
                          activity.type === 'material' && 'bg-yellow-100'
                        )}>
                          {activity.type === 'user' && <Users className="h-4 w-4 text-primary" />}
                          {activity.type === 'video' && <Play className="h-4 w-4 text-blue-600" />}
                          {activity.type === 'event' && <Calendar className="h-4 w-4 text-green-600" />}
                          {activity.type === 'material' && <FileText className="h-4 w-4 text-yellow-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
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

export default AdminDashboardPage;
