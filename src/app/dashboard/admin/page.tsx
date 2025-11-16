'use client';

import { useRouter } from 'next/navigation';
import { DashboardLayout, Card, CardHeader, CardTitle, CardContent, Button } from '@/components';
import { useAuth } from '@/context';

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <DashboardLayout 
      title="Panel de Administración" 
      subtitle="Gestiona usuarios, proyectos y tareas"
    >
      {/* User Info Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{user?.fullname}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-2">Email: {user?.email}</p>
          <p className="font-medium text-gray-900">Rol: Superadministrador</p>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card padding="sm">
          <p className="text-sm text-gray-600 mb-2">Total Usuarios</p>
          <p className="text-2xl font-bold text-gray-900">--</p>
        </Card>

        <Card padding="sm">
          <p className="text-sm text-gray-600 mb-2">Total Proyectos</p>
          <p className="text-2xl font-bold text-gray-900">--</p>
        </Card>

        <Card padding="sm">
          <p className="text-sm text-gray-600 mb-2">Total Tareas</p>
          <p className="text-2xl font-bold text-gray-900">--</p>
        </Card>

        <Card padding="sm">
          <p className="text-sm text-gray-600 mb-2">Tareas Completadas</p>
          <p className="text-2xl font-bold text-gray-900">--</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Button
              variant="outline"
              onClick={() => router.push('/users')}
              className="h-auto p-4 text-left flex flex-col items-start"
            >
              <span className="font-bold mb-2">Gestionar Usuarios</span>
              <span className="text-sm font-normal">Crear, editar y eliminar usuarios</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push('/projects')}
              className="h-auto p-4 text-left flex flex-col items-start"
            >
              <span className="font-bold mb-2">Ver Todos los Proyectos</span>
              <span className="text-sm font-normal">Administrar proyectos de todos los usuarios</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push('/tasks')}
              className="h-auto p-4 text-left flex flex-col items-start"
            >
              <span className="font-bold mb-2">Ver Todas las Tareas</span>
              <span className="text-sm font-normal">Administrar tareas de todos los proyectos</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
