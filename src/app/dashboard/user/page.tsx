'use client';

import { useRouter } from 'next/navigation';
import { DashboardLayout, Card, CardHeader, CardTitle, CardContent, Button } from '@/components';
import { useAuth } from '@/context';

export default function UserDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <DashboardLayout 
      title="Mi Dashboard" 
      subtitle="Gestiona tus proyectos y tareas"
    >
      {/* User Info Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{user?.fullname}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-2">Email: {user?.email}</p>
          <p className="font-medium text-gray-900">Rol: Usuario</p>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
        <Card padding="sm">
          <p className="text-sm text-gray-600 mb-2">Mis Proyectos</p>
          <p className="text-2xl font-bold text-gray-900">--</p>
        </Card>

        <Card padding="sm">
          <p className="text-sm text-gray-600 mb-2">Mis Tareas</p>
          <p className="text-2xl font-bold text-gray-900">--</p>
        </Card>

        <Card padding="sm">
          <p className="text-sm text-gray-600 mb-2">Tareas Completadas</p>
          <p className="text-2xl font-bold text-gray-900">--</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Button
              variant="outline"
              onClick={() => router.push('/projects')}
              className="h-auto p-4 text-left flex flex-col items-start"
            >
              <span className="font-bold mb-2">Nuevo Proyecto</span>
              <span className="text-sm font-normal">Crear un nuevo proyecto</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push('/tasks')}
              className="h-auto p-4 text-left flex flex-col items-start"
            >
              <span className="font-bold mb-2">Nueva Tarea</span>
              <span className="text-sm font-normal">Agregar una nueva tarea</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-gray-600">No hay actividad reciente</p>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
