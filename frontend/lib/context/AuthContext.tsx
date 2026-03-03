'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, login as appwriteLogin, logout as appwriteLogout, Usuario } from '@/lib/appwrite/client';

// Tipos
interface AuthContextType {
  user: Usuario | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}

// Provider
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar usuario al iniciar
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setIsLoading(true);
    try {
      const result = await getCurrentUser();
      if (result.success && result.user) {
        // Obtener datos adicionales del usuario desde la base de datos
        // Por ahora usamos los datos básicos de la cuenta
        setUser({
          $id: result.user.$id,
          nombre: result.user.name?.split(' ')[0] || '',
          apellido: result.user.name?.split(' ').slice(1).join(' ') || '',
          email: result.user.email,
          rol: 'SOCIO', // Por defecto, luego obtener de la base de datos
          activo: true,
          emailVerificado: result.user.emailVerification,
          creadoEn: result.user.registration,
          actualizadoEn: result.user.registration,
        } as Usuario);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error cargando usuario:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await appwriteLogin(email, password);
      if (result.success) {
        await loadUser();
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, error: result.error || 'Error al iniciar sesión' };
      }
    } catch (error: any) {
      setIsLoading(false);
      return { success: false, error: error.message || 'Error al iniciar sesión' };
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await appwriteLogout();
      setUser(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    await loadUser();
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// HOC para proteger rutas
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }
    
    if (!isAuthenticated) {
      // Redirigir a login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return null;
    }
    
    return <Component {...props} />;
  };
}

// HOC para verificar roles
export function withRole<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: ('SOCIO' | 'ASESOR' | 'ADMIN')[]
) {
  return function RoleProtectedComponent(props: P) {
    const { user, isLoading } = useAuth();
    
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }
    
    if (!user || !allowedRoles.includes(user.rol)) {
      // Mostrar página de acceso denegado
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold text-red-600">Acceso Denegado</h1>
          <p className="text-gray-600 mt-2">No tienes permisos para acceder a esta página.</p>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
}

export default AuthContext;
