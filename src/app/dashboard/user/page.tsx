'use client';

import { useAuth } from '@/context';
import { useRouter } from 'next/navigation';

export default function UserDashboard() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Mi Dashboard</h1>
              <p className="text-sm text-gray-300 mt-1">{user?.fullname}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white text-gray-900 font-medium hover:bg-gray-100"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* User Info Card */}
        <div className="bg-white border border-gray-300 shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{user?.fullname}</h2>
          <p className="text-gray-700 mb-2">Email: {user?.email}</p>
          <p className="font-medium text-gray-900">Rol: Usuario</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
          <div className="bg-white border border-gray-300 shadow-md p-4">
            <p className="text-sm text-gray-600 mb-2">Mis Proyectos</p>
            <p className="text-2xl font-bold text-gray-900">--</p>
          </div>

          <div className="bg-white border border-gray-300 shadow-md p-4">
            <p className="text-sm text-gray-600 mb-2">Mis Tareas</p>
            <p className="text-2xl font-bold text-gray-900">--</p>
          </div>

          <div className="bg-white border border-gray-300 shadow-md p-4">
            <p className="text-sm text-gray-600 mb-2">Tareas Completadas</p>
            <p className="text-2xl font-bold text-gray-900">--</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-300 shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button
              onClick={() => router.push('/projects')}
              className="p-4 border border-gray-300 text-left hover:bg-gray-900 hover:text-white font-medium transition-colors"
            >
              <p className="mb-2 font-bold">Nuevo Proyecto</p>
              <p className="text-sm">Crear un nuevo proyecto</p>
            </button>

            <button
              onClick={() => router.push('/tasks')}
              className="p-4 border border-gray-300 text-left hover:bg-gray-900 hover:text-white font-medium transition-colors"
            >
              <p className="mb-2 font-bold">Nueva Tarea</p>
              <p className="text-sm">Agregar una nueva tarea</p>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-300 shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Actividad Reciente</h3>
          <div className="text-center py-12">
            <p className="text-gray-600">No hay actividad reciente</p>
          </div>
        </div>
      </main>
    </div>
  );
}
