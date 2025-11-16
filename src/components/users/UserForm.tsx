'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { Input, Button } from '@/components/ui';
import type { User, UpdateUserRequest, UserRole } from '@/types';


interface UserFormProps {
  user: User; // ahora es obligatorio
  onSubmit: (data: UpdateUserRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  user,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<{
    fullname: string;
    role: UserRole;
    isActive: boolean;
    password?: string;
  }>({
    fullname: user.fullname,
    role: user.role,
    isActive: user.isActive,
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData({
      fullname: user.fullname,
      role: user.role,
      isActive: user.isActive,
      password: '',
    });
    setErrors({});
  }, [user]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullname.trim()) {
      newErrors.fullname = 'El nombre es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: UpdateUserRequest = {
      fullname: formData.fullname,
      role: formData.role,
      ...(formData.password ? { password: formData.password } : {}),
    };

    await onSubmit(payload);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type , checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email solo lectura */}
      <Input
        label="Email"
        value={user.email}
        disabled
      />

      <Input
        label="Nombre completo"
        name="fullname"
        value={formData.fullname}
        onChange={handleChange}
        error={errors.fullname}
        placeholder="Nombre del usuario"
      />

      <div>
        <label
          htmlFor="role"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Rol
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-gray-500 focus:ring-gray-500"
        >
          <option value="usuario">Usuario</option>
          <option value="superadmin">Superadmin</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isActive"
          name="isActive"
          type="checkbox"
          checked={formData.isActive}
          onChange={handleChange}
          className="h-4 w-4 text-gray-900 border-gray-300"
        />
        <label htmlFor="isActive" className="text-sm text-gray-700">
          Usuario activo
        </label>
      </div>

      {/* Opcional: resetear contraseña */}
      <Input
        label="Nueva contraseña (opcional)"
        name="password"
        type="password"
        value={formData.password ?? ''}
        onChange={handleChange}
        placeholder="Déjalo vacío para no cambiarla"
      />

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Actualizar usuario
        </Button>
      </div>
    </form>
  );
};
