/**
 * Página de Perfil de Usuario
 * Muestra información del usuario, estadísticas, certificados y configuración
 */

'use client';

import * as React from 'react';
import { Metadata } from 'next';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Play,
  CalendarDays,
  Download,
  Clock,
  Award,
  Settings,
  Bell,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { useAuth, withAuth } from '@/lib/context/AuthContext';
import { getUserStats, getUserCertificados, UserStats, Certificado } from '@/lib/appwrite/client';
import { Card, CardHeader, CardTitle, CardContent, SimpleCard } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { StatsCard, CircularProgress, ProgressBar } from '@/components/profile/StatsCard';

// Utilidad para combinar clases
const cn = (...inputs: (string | undefined | null | boolean)[]) => {
  return twMerge(clsx(inputs));
});

// Componente de tabs
type TabId = 'perfil' | 'estadisticas' | 'certificados' | 'configuracion';

interface TabItem {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

const tabs: TabItem[] = [
  { id: 'perfil', label: 'Mi Perfil', icon: User },
  { id: 'estadisticas', label: 'Estadísticas', icon: Play },
  { id: 'certificados', label: 'Certificados', icon: Award },
  { id: 'configuracion', label: 'Configuración', icon: Settings },
];

// Componente de configuración de notificaciones
const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = React.useState({
    emailEventos: true,
    emailMateriales: false,
    emailNoticias: true,
    pushEventos: true,
    pushMateriales: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Preferencias de Notificaciones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Notificaciones por Email */}
          <div>
            <h4 className="mb-3 text-sm font-medium text-gray-700">Notificaciones por Email</h4>
            <div className="space-y-3">
              {[
                { key: 'emailEventos', label: 'Recordatorios de eventos', desc: 'Recibe recordatorios antes de eventos inscritos' },
                { key: 'emailMateriales', label: 'Nuevos materiales', desc: 'Avisa cuando se publiquen nuevos materiales' },
                { key: 'emailNoticias', label: 'Noticias y actualizaciones', desc: 'Información importante sobre la plataforma' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => handleToggle(item.key as keyof typeof settings)}
                    className={cn(
                      'relative h-6 w-11 rounded-full transition-colors',
                      settings[item.key as keyof typeof settings]
                        ? 'bg-primary'
                        : 'bg-gray-300'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-1 h-4 w-4 rounded-full bg-white transition-transform',
                        settings[item.key as keyof typeof settings]
                          ? 'right-1'
                          : 'left-1'
                      )}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notificaciones Push */}
          <div>
            <h4 className="mb-3 text-sm font-medium text-gray-700">Notificaciones Push</h4>
            <div className="space-y-3">
              {[
                { key: 'pushEventos', label: 'Eventos', desc: 'Notificaciones instantáneas sobre eventos' },
                { key: 'pushMateriales', label: 'Materiales', desc: 'Alertas de nuevos materiales disponibles' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => handleToggle(item.key as keyof typeof settings)}
                    className={cn(
                      'relative h-6 w-11 rounded-full transition-colors',
                      settings[item.key as keyof typeof settings]
                        ? 'bg-primary'
                        : 'bg-gray-300'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-1 h-4 w-4 rounded-full bg-white transition-transform',
                        settings[item.key as keyof typeof settings]
                          ? 'right-1'
                          : 'left-1'
                      )}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Componente de lista de certificados
const CertificadosList: React.FC<{ certificados: Certificado[]; isLoading: boolean }> = ({
  certificados,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (certificados.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Award className="h-16 w-16 text-gray-300" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">Sin certificados aún</h3>
        <p className="mt-2 text-gray-500">
          Completa cursos y eventos para obtener certificados
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {certificados.map((cert) => (
        <Card key={cert.$id} className="group hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{cert.titulo}</h4>
                <p className="mt-1 text-sm text-gray-500">
                  {new Date(cert.fechaEmision).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <Badge
                  variant={cert.tipo === 'curso' ? 'primary' : cert.tipo === 'evento' ? 'secondary' : 'default'}
                  className="mt-2"
                >
                  {cert.tipo}
                </Badge>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Descargar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Componente principal de la página
const PerfilPage: React.FC = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [activeTab, setActiveTab] = React.useState<TabId>('perfil');
  const [stats, setStats] = React.useState<UserStats | null>(null);
  const [certificados, setCertificados] = React.useState<Certificado[]>([]);
  const [isLoadingStats, setIsLoadingStats] = React.useState(true);
  const [isLoadingCertificados, setIsLoadingCertificados] = React.useState(true);

  // Cargar estadísticas
  React.useEffect(() => {
    if (user?.$id) {
      setIsLoadingStats(true);
      getUserStats(user.$id)
        .then(setStats)
        .catch(console.error)
        .finally(() => setIsLoadingStats(false));
    }
  }, [user?.$id]);

  // Cargar certificados
  React.useEffect(() => {
    if (user?.$id) {
      setIsLoadingCertificados(true);
      getUserCertificados(user.$id)
        .then(setCertificados)
        .catch(console.error)
        .finally(() => setIsLoadingCertificados(false));
    }
  }, [user?.$id]);

  // Loading state
  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // No autenticado
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con información del usuario */}
      <div className="bg-primary text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            {/* Avatar */}
            <div className="relative">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.nombre} ${user.apellido}`}
                  className="h-24 w-24 rounded-full border-4 border-white/20 object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/20 bg-white/10">
                  <User className="h-12 w-12" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold">
                {user.nombre} {user.apellido}
              </h1>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-sm text-white/80 sm:justify-start">
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </span>
                {user.telefono && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {user.telefono}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Miembro desde {new Date(user.creadoEn).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="mt-3">
                <Badge
                  variant={user.rol === 'ADMIN' ? 'destructive' : user.rol === 'ASESOR' ? 'secondary' : 'default'}
                  className="bg-white/20 text-white"
                >
                  {user.rol}
                </Badge>
              </div>
            </div>

            {/* Progreso general */}
            <div className="ml-auto hidden sm:block">
              <CircularProgress
                value={stats?.progresoGeneral || 0}
                label="Progreso"
                color="stroke-white"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-8 flex overflow-x-auto border-b border-white/20">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 whitespace-nowrap px-6 py-3 text-sm font-medium transition-colors border-b-2',
                  activeTab === tab.id
                    ? 'border-white text-white'
                    : 'border-transparent text-white/60 hover:text-white'
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="container mx-auto px-4 py-8">
        {/* Tab: Perfil */}
        {activeTab === 'perfil' && (
          <ProfileForm usuario={user} />
        )}

        {/* Tab: Estadísticas */}
        {activeTab === 'estadisticas' && (
          <div className="space-y-6">
            {/* Tarjetas de estadísticas */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Videos Completados"
                value={stats?.videosCompletados || 0}
                icon={Play}
                color="blue"
              />
              <StatsCard
                title="Eventos Asistidos"
                value={stats?.eventosAsistidos || 0}
                icon={CalendarDays}
                color="green"
              />
              <StatsCard
                title="Materiales Descargados"
                value={stats?.materialsDescargados || stats?.materialesDescargados || 0}
                icon={Download}
                color="purple"
              />
              <StatsCard
                title="Tiempo en Plataforma"
                value={stats?.tiempoEnPlataforma || 0}
                suffix=" min"
                icon={Clock}
                color="yellow"
              />
            </div>

            {/* Progreso detallado */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Progreso de Capacitación</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center gap-6 py-4">
                    <CircularProgress
                      value={stats?.progresoGeneral || 0}
                      size={160}
                      strokeWidth={12}
                      label="General"
                    />
                    <div className="w-full space-y-4">
                      <ProgressBar
                        value={stats?.videosCompletados || 0}
                        max={50}
                        label="Videos vistos"
                        color="blue"
                        showLabel
                      />
                      <ProgressBar
                        value={stats?.eventosAsistidos || 0}
                        max={20}
                        label="Eventos asistidos"
                        color="green"
                        showLabel
                      />
                      <ProgressBar
                        value={stats?.certificados || 0}
                        max={10}
                        label="Certificados obtenidos"
                        color="yellow"
                        showLabel
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actividad Reciente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { icon: Play, text: 'Completaste "Introducción a la plataforma"', time: 'Hace 2 horas', color: 'blue' },
                      { icon: CalendarDays, text: 'Te inscribiste a "Masterclass de Ventas"', time: 'Ayer', color: 'green' },
                      { icon: Download, text: 'Descargaste "Brochure Corporativo"', time: 'Hace 3 días', color: 'purple' },
                      { icon: Award, text: 'Obtuviste certificado de "Ventas Avanzadas"', time: 'Hace 1 semana', color: 'yellow' },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-lg',
                          activity.color === 'blue' && 'bg-blue-100',
                          activity.color === 'green' && 'bg-green-100',
                          activity.color === 'purple' && 'bg-purple-100',
                          activity.color === 'yellow' && 'bg-yellow-100'
                        )}>
                          <activity.icon className={cn(
                            'h-5 w-5',
                            activity.color === 'blue' && 'text-blue-600',
                            activity.color === 'green' && 'text-green-600',
                            activity.color === 'purple' && 'text-purple-600',
                            activity.color === 'yellow' && 'text-yellow-600'
                          )} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.text}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Tab: Certificados */}
        {activeTab === 'certificados' && (
          <Card>
            <CardHeader>
              <CardTitle>Mis Certificados</CardTitle>
            </CardHeader>
            <CardContent>
              <CertificadosList
                certificados={certificados}
                isLoading={isLoadingCertificados}
              />
            </CardContent>
          </Card>
        )}

        {/* Tab: Configuración */}
        {activeTab === 'configuracion' && (
          <NotificationSettings />
        )}
      </div>
    </div>
  );
};

export default withAuth(PerfilPage);
