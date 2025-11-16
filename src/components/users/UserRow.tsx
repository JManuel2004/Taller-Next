'use client';

import React from 'react';
import type { User } from '@/types';
import { Button } from '@/components/ui';

interface UserRowProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

export const UserRow: React.FC<UserRowProps> = ({ user, onEdit, onDelete }) => {
  return (
    <tr className="border-b border-gray-200">
      <td className="px-4 py-2 text-sm text-gray-900">{user.fullname}</td>
      <td className="px-4 py-2 text-sm text-gray-600">{user.email}</td>
      <td className="px-4 py-2 text-sm text-gray-600 capitalize">
        {user.role === 'superadmin' ? 'Superadmin' : 'Usuario'}
      </td>
      <td className="px-4 py-2 text-sm">
        <span
          className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
            user.isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {user.isActive ? 'Activo' : 'Inactivo'}
        </span>
      </td>
      <td className="px-4 py-2 text-sm">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onEdit(user)}
          >
            Editar
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => onDelete(user.id)}
          >
            Eliminar
          </Button>
        </div>
      </td>
    </tr>
  );
};
