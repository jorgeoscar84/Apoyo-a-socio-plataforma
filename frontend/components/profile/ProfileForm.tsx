/**
 * Componente ProfileForm
 * Formulario de edición de datos del perfil con validación
 */

'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  User,
  Mail,
  Phone,
  Camera,
  Save,
  Loader2,
  Eye,
  EyeOff,
  Lock,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  updateUserProfile,
  changePassword,
  uploadProfilePhoto,
  Usuario,
} from '@/lib/appwrite/client';
import { useAuth } from '@/lib/context/AuthContext';

// Utilidad para combinar clases
const cn = (...inputs: (string | undefined | null | boolean)[]) => {
  return twMerge(clsx(inputs));
};

// Esquema de validación para el perfil
const profileSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido').readonly(),
  telefono: z.string().optional().refine(
    (val) => !val || /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/.test(val),
    'Teléfono inválido'
  ),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// Esquema de validación para cambio de contraseña
const passwordSchema = z.object({
  currentPassword: z.string().min(8, 'La contraseña actual es requerida'),
  newPassword: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

// Props del componente
export interface ProfileFormProps {
  usuario: Usuario;
  onUpdate?: (usuario: Usuario) => void;
  className?: string;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  usuario,
  onUpdate,
  className,
}) => {
  const { refreshUser } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(usuario.avatar || null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Formulario de perfil
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors, isDirty: isProfileDirty },
    reset: resetProfile,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      telefono: usuario.telefono || '',
    },
  });

  // Formulario de contraseña
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
    watch: watchPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Limpiar mensajes después de 5 segundos
  React.useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  // Manejar envío del formulario de perfil
  const onSubmitProfile = async (data: ProfileFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const updatedUser = await updateUserProfile(usuario.$id, {
        nombre: data.nombre,
        apellido: data.apellido,
        telefono: data.telefono,
      });

      if (updatedUser) {
        setSuccessMessage('Perfil actualizado correctamente');
        onUpdate?.(updatedUser);
        await refreshUser();
        resetProfile(data);
      } else {
        setError('Error al actualizar el perfil');
      }
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar envío del formulario de contraseña
  const onSubmitPassword = async (data: PasswordFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await changePassword(data.currentPassword, data.newPassword);

      if (result.success) {
        setSuccessMessage('Contraseña actualizada correctamente');
        resetPassword();
      } else {
        setError(result.error || 'Error al cambiar la contraseña');
      }
    } catch (err: any) {
      setError(err.message || 'Error al cambiar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar cambio de foto
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no debe superar los 5MB');
      return;
    }

    // Mostrar preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Subir foto
    setIsUploadingPhoto(true);
    setError(null);

    try {
      const result = await uploadProfilePhoto(file, usuario.$id);

      if (result.success && result.url) {
        setSuccessMessage('Foto de perfil actualizada');
        await refreshUser();
      } else {
        setError(result.error || 'Error al subir la foto');
        setPhotoPreview(usuario.avatar || null);
      }
    } catch (err: any) {
      setError(err.message || 'Error al subir la foto');
      setPhotoPreview(usuario.avatar || null);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Quitar foto
  const handleRemovePhoto = async () => {
    setIsUploadingPhoto(true);
    setError(null);

    try {
      const updatedUser = await updateUserProfile(usuario.$id, { avatar: '' });
      if (updatedUser) {
        setPhotoPreview(null);
        setSuccessMessage('Foto de perfil eliminada');
        await refreshUser();
      }
    } catch (err: any) {
      setError(err.message || 'Error al eliminar la foto');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Mensajes de estado */}
      {successMessage && (
        <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Foto de perfil */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Foto de Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Foto de perfil"
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
              )}
              {isUploadingPhoto && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPhoto}
              >
                <Camera className="mr-2 h-4 w-4" />
                Cambiar foto
              </Button>
              {photoPreview && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRemovePhoto}
                  disabled={isUploadingPhoto}
                  className="text-red-600 hover:bg-red-50"
                >
                  <X className="mr-2 h-4 w-4" />
                  Eliminar
                </Button>
              )}
              <p className="text-xs text-gray-500">
                JPG, PNG o GIF. Máximo 5MB.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulario de datos personales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Datos Personales</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Nombre"
                leftIcon={<User className="h-4 w-4" />}
                error={profileErrors.nombre?.message}
                {...registerProfile('nombre')}
              />
              <Input
                label="Apellido"
                leftIcon={<User className="h-4 w-4" />}
                error={profileErrors.apellido?.message}
                {...registerProfile('apellido')}
              />
            </div>

            <Input
              label="Email"
              type="email"
              leftIcon={<Mail className="h-4 w-4" />}
              disabled
              hint="El email no puede ser modificado"
              {...registerProfile('email')}
            />

            <Input
              label="Teléfono"
              type="tel"
              leftIcon={<Phone className="h-4 w-4" />}
              error={profileErrors.telefono?.message}
              {...registerProfile('telefono')}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isLoading || !isProfileDirty}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Guardar cambios
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Formulario de cambio de contraseña */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cambiar Contraseña</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
            <div className="relative">
              <Input
                label="Contraseña actual"
                type={showCurrentPassword ? 'text' : 'password'}
                leftIcon={<Lock className="h-4 w-4" />}
                error={passwordErrors.currentPassword?.message}
                {...registerPassword('currentPassword')}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Nueva contraseña"
                type={showNewPassword ? 'text' : 'password'}
                leftIcon={<Lock className="h-4 w-4" />}
                error={passwordErrors.newPassword?.message}
                {...registerPassword('newPassword')}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Confirmar nueva contraseña"
                type={showConfirmPassword ? 'text' : 'password'}
                leftIcon={<Lock className="h-4 w-4" />}
                error={passwordErrors.confirmPassword?.message}
                {...registerPassword('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-700">La contraseña debe tener:</p>
              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                <li>• Al menos 8 caracteres</li>
                <li>• Al menos una letra mayúscula</li>
                <li>• Al menos un número</li>
              </ul>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Lock className="mr-2 h-4 w-4" />
                )}
                Cambiar contraseña
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileForm;
