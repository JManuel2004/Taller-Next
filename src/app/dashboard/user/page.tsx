'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout, Card, CardHeader, CardTitle, CardContent, Button, LoadingSpinner } from '@/components';
import { useAuth } from '@/context';
import { taskService, projectService } from '@/services';
import { Task, Project } from '@/types';

export default function UserDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        const [tasksData, projectsData] = await Promise.all([
          taskService.getAll(),
          projectService.getAll(),
        ]);
        
        setTasks(tasksData);
        setProjects(projectsData);
      } catch (err) {
        console.error('Error loading stats:', err);
        setError('Error al cargar estadísticas');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadStats();
    }
  }, [user]);

  // Calcular estadísticas
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;

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

      {/* Error Message */}
      {error && (
        <Card className="mb-6 bg-red-50 border-red-300">
          <div className="p-4">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </Card>
      )}

      {/* Stats Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12 mb-6">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
          <div onClick={() => router.push('/projects')} className="cursor-pointer">
            <Card padding="sm" className="hover:shadow-lg transition-shadow">
              <p className="text-sm text-gray-600 mb-2">Mis Proyectos</p>
              <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
              <p className="text-xs text-gray-500 mt-1">
                {projects.filter(p => p.status === 'in-progress').length} activos
              </p>
            </Card>
          </div>

          <div onClick={() => router.push('/tasks')} className="cursor-pointer">
            <Card padding="sm" className="hover:shadow-lg transition-shadow">
              <p className="text-sm text-gray-600 mb-2">Mis Tareas</p>
              <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
              <p className="text-xs text-gray-500 mt-1">
                {pendingTasks} pendientes • {inProgressTasks} en progreso
              </p>
            </Card>
          </div>

          <Card padding="sm" className="hover:shadow-lg transition-shadow">
            <p className="text-sm text-gray-600 mb-2">Tareas Completadas</p>
            <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
            <p className="text-xs text-gray-500 mt-1">
              {tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}% completado
            </p>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Button
              variant="outline"
              onClick={() => router.push('/projects')}
              className="h-auto p-4 text-left flex flex-col items-start hover:bg-gray-50"
            >
              <span className="font-bold mb-2"> Nuevo Proyecto</span>
              <span className="text-sm font-normal">Crear un nuevo proyecto</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push('/tasks')}
              className="h-auto p-4 text-left flex flex-col items-start hover:bg-gray-50"
            >
              <span className="font-bold mb-2"> Nueva Tarea</span>
              <span className="text-sm font-normal">Agregar una nueva tarea</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push('/projects')}
              className="h-auto p-4 text-left flex flex-col items-start hover:bg-gray-50"
            >
              <span className="font-bold mb-2"> Ver Proyectos</span>
              <span className="text-sm font-normal">Accede a tus proyectos y tareas</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {!isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No hay actividad reciente</p>
                <Button
                  variant="primary"
                  onClick={() => router.push('/tasks')}
                >
                  Crear mi primera tarea
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks
                  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                  .slice(0, 5)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => router.push(`/tasks/${task.id}`)}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{task.title}</p>
                        <p className="text-sm text-gray-600">
                          {task.project?.title || 'Sin proyecto'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`
                            px-2 py-1 text-xs font-semibold rounded-full
                            ${task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : ''}
                            ${task.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                            ${task.status === 'cancelled' ? 'bg-gray-100 text-gray-800' : ''}
                          `}
                        >
                          {task.status === 'pending' ? 'Pendiente' : ''}
                          {task.status === 'in-progress' ? 'En Progreso' : ''}
                          {task.status === 'completed' ? 'Completada' : ''}
                          {task.status === 'cancelled' ? 'Cancelada' : ''}
                        </span>
                        <span
                          className={`
                            px-2 py-1 text-xs font-semibold rounded-full
                            ${task.priority === 'low' ? 'bg-gray-100 text-gray-700' : ''}
                            ${task.priority === 'medium' ? 'bg-orange-100 text-orange-700' : ''}
                            ${task.priority === 'high' ? 'bg-red-100 text-red-700' : ''}
                          `}
                        >
                          {task.priority === 'low' ? 'Baja' : ''}
                          {task.priority === 'medium' ? 'Media' : ''}
                          {task.priority === 'high' ? 'Alta' : ''}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(task.updatedAt).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Próximas tareas (con fecha límite cercana) */}
      {!isLoading && tasks.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Próximas Tareas</CardTitle>
          </CardHeader>
          <CardContent>
            {tasks
              .filter(t => t.dueDate && t.status !== 'completed' && t.status !== 'cancelled')
              .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
              .slice(0, 5).length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                No tienes tareas con fecha límite próxima
              </p>
            ) : (
              <div className="space-y-3">
                {tasks
                  .filter(t => t.dueDate && t.status !== 'completed' && t.status !== 'cancelled')
                  .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
                  .slice(0, 5)
                  .map((task) => {
                    const daysUntilDue = Math.ceil(
                      (new Date(task.dueDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                    );
                    const isOverdue = daysUntilDue < 0;
                    const isUrgent = daysUntilDue <= 3 && daysUntilDue >= 0;

                    return (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => router.push(`/tasks/${task.id}`)}
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{task.title}</p>
                          <p className="text-sm text-gray-600">
                            {task.project?.title || 'Sin proyecto'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`
                              px-2 py-1 text-xs font-semibold rounded-full
                              ${isOverdue ? 'bg-red-100 text-red-800' : ''}
                              ${isUrgent ? 'bg-orange-100 text-orange-800' : ''}
                              ${!isOverdue && !isUrgent ? 'bg-blue-100 text-blue-800' : ''}
                            `}
                          >
                            {isOverdue ? `Vencida hace ${Math.abs(daysUntilDue)} días` : ''}
                            {isUrgent ? `Vence en ${daysUntilDue} día${daysUntilDue !== 1 ? 's' : ''}` : ''}
                            {!isOverdue && !isUrgent ? new Date(task.dueDate!).toLocaleDateString('es-ES') : ''}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}