'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DashboardLayout,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Modal,
  LoadingSpinner,
} from '@/components';
import { useAuth } from '@/context';
import { userService } from '@/services';
import type { User, UpdateUserRequest } from '@/types';
import { UserForm, UserRow } from '@/components/users';

export default function UsersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const loadUsers = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      console.error('Error loading users:', err);
      const message =
        err instanceof Error ? err.message : 'Error al cargar usuarios';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user?.role === 'superadmin') {
      loadUsers();
    }
  }, [authLoading, user?.id, user?.role, loadUsers]);

  // Estados globales (no admin / no auth)
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No estás autenticado</p>
          <Button variant="primary" onClick={() => router.push('/login')}>
            Ir a Login
          </Button>
        </div>
      </div>
    );
  }

  if (user.role !== 'superadmin') {
    return (
      <DashboardLayout title="Acceso denegado">
        <Card>
          <CardContent>
            <p className="text-gray-700">
              No tienes permisos para gestionar usuarios.
            </p>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const handleEdit = (u: User) => {
    setEditingUser(u);
    setError('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar este usuario?')) return;

    try {
      await userService.delete(id);
      await loadUsers();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al eliminar usuario';
      alert(message);
    }
  };

  const handleSubmit = async (data: UpdateUserRequest) => {
    if (!editingUser) return;

    try {
      setIsSubmitting(true);
      setError('');
      await userService.update(editingUser.id, data);
      setIsModalOpen(false);
      setEditingUser(null);
      await loadUsers();
    } catch (err) {
      console.error('Error saving user:', err);
      const message =
        err instanceof Error ? err.message : 'Error al guardar usuario';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setError('');
  };

  return (
    <DashboardLayout
      title="Gestión de Usuarios"
      subtitle="Editar y eliminar usuarios del sistema"
    >
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Usuarios</h2>
        {/* Ya no hay botón de creación porque el alta va por /register */}
      </div>

      {error && (
        <Card className="mb-4 bg-red-50 border-red-300">
          <CardContent>
            <p className="text-red-700 text-sm font-medium">{error}</p>
            <Button
              className="mt-3"
              size="sm"
              variant="outline"
              onClick={loadUsers}
            >
              Reintentar
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Listado de usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : users.length === 0 ? (
            <p className="text-gray-600">No hay usuarios registrados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-2 font-semibold text-gray-700">
                      Nombre
                    </th>
                    <th className="px-4 py-2 font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="px-4 py-2 font-semibold text-gray-700">
                      Rol
                    </th>
                    <th className="px-4 py-2 font-semibold text-gray-700">
                      Estado
                    </th>
                    <th className="px-4 py-2 font-semibold text-gray-700">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <UserRow
                      key={u.id}
                      user={u}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCancel}
        title="Editar usuario"
        size="md"
      >
        {error && (
          <div className="mb-4 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
        {editingUser && (
          <UserForm
            user={editingUser}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isSubmitting}
          />
        )}
      </Modal>
    </DashboardLayout>
  );
}
