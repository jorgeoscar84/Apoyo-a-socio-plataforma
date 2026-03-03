/**
 * Componente AdminLayout
 * Layout con sidebar para el panel de administración
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  LayoutDashboard,
  Users,
  Video,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  User,
  Bell,
} from 'lucide-react';
import { useAuth, withRole } from '@/lib/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Utilidad para combinar clases
const cn = (...inputs: (string | undefined | null | boolean)[]) => {
  return twMerge(clsx(inputs));
});

// Items del menú de administración
const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin',
  },
  {
    id: 'usuarios',
    label: 'Usuarios',
    icon: Users,
    href: '/admin/usuarios',
  },
  {
    id: 'videos',
    label: 'Videos',
    icon: Video,
    href: '/admin/videos',
  },
  {
    id: 'eventos',
    label: 'Eventos',
    icon: Calendar,
    href: '/admin/eventos',
  },
  {
    id: 'materiales',
    label: 'Materiales',
    icon: FileText,
    href: '/admin/materiales',
  },
  {
    id: 'estadisticas',
    label: 'Estadísticas',
    icon: BarChart3,
    href: '/admin/estadisticas',
  },
];

// Props del componente
export interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Cerrar menú móvil al cambiar de ruta
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Verificar si un item está activo
  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname?.startsWith(href);
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col bg-gray-900 text-white transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-20',
          'hidden lg:flex'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-gray-800 px-4">
          {sidebarOpen && (
            <Link href="/admin" className="text-xl font-bold text-primary">
              Admin Panel
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-2 hover:bg-gray-800"
          >
            <ChevronLeft
              className={cn(
                'h-5 w-5 transition-transform',
                !sidebarOpen && 'rotate-180'
              )}
            />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-primary text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Usuario */}
        <div className="border-t border-gray-800 p-4">
          <div className={cn('flex items-center gap-3', !sidebarOpen && 'justify-center')}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.nombre}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <User className="h-5 w-5" />
              )}
            </div>
            {sidebarOpen && (
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">
                  {user?.nombre} {user?.apellido}
                </p>
                <p className="truncate text-xs text-gray-400">{user?.email}</p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button
              onClick={handleLogout}
              className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          )}
        </div>
      </aside>

      {/* Sidebar - Mobile */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-gray-900 text-white">
            {/* Logo */}
            <div className="flex h-16 items-center justify-between border-b border-gray-800 px-4">
              <Link href="/admin" className="text-xl font-bold text-primary">
                Admin Panel
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-2 hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navegación */}
            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-1 px-3">
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive(item.href)
                          ? 'bg-primary text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Usuario */}
            <div className="border-t border-gray-800 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.nombre}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium">
                    {user?.nombre} {user?.apellido}
                  </p>
                  <p className="truncate text-xs text-gray-400">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Contenido principal */}
      <div
        className={cn(
          'flex flex-1 flex-col transition-all duration-300',
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm lg:px-6">
          {/* Botón menú móvil */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Breadcrumb */}
          <nav className="hidden lg:flex" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link href="/admin" className="text-gray-500 hover:text-gray-700">
                  Admin
                </Link>
              </li>
              {pathname !== '/admin' && (
                <>
                  <li className="text-gray-400">/</li>
                  <li className="font-medium text-gray-900">
                    {menuItems.find((item) => isActive(item.href))?.label || 'Página'}
                  </li>
                </>
              )}
            </ol>
          </nav>

          {/* Acciones del header */}
          <div className="flex items-center gap-3">
            {/* Notificaciones */}
            <button className="relative rounded-lg p-2 hover:bg-gray-100">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* Perfil */}
            <Link
              href="/perfil"
              className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.nombre}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-4 w-4 text-gray-600" />
                )}
              </div>
              <span className="hidden text-sm font-medium text-gray-700 md:block">
                {user?.nombre}
              </span>
            </Link>
          </div>
        </header>

        {/* Contenido de la página */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t bg-white py-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Plataforma de Capacitación. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
};

// Exportar con protección de rol
export default withRole(AdminLayout, ['ASESOR', 'ADMIN']);
