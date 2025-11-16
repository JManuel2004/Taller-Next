'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout, Card, CardHeader, CardTitle, CardContent, Button, LoadingSpinner } from '@/components';
import { projectService, taskService } from '@/services';
import { Project, Task } from '@/types';
import { useAuth } from '@/context';

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  'in-progress': 'En Progreso',
  completed: 'Completado',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
};

const taskStatusLabels: Record<string, string> = {
  pending: 'Pendiente',
  'in-progress': 'En Progreso',
  completed: 'Completada',
  cancelled: 'Cancelada',
};

const taskStatusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

const priorityLabels: Record<string, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
};

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-orange-100 text-orange-700',
  high: 'bg-red-100 text-red-700',
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const projectId = params.id as string;

  useEffect(() => {
    if (!authLoading && user && projectId) {
      loadProject();
    }
  }, [authLoading, user, projectId]);

  const loadProject = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await projectService.getById(projectId);
      setProject(data);
      
      // Cargar tareas del proyecto
      const tasks = await taskService.getByProject(projectId);
      setProjectTasks(tasks);
    } catch (err) {
      console.error('Error loading project:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el proyecto';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
          <Button onClick={() => router.push('/login')} variant="primary">
            Ir a Login
          </Button>
        </div>
      </div>
    );
  }

  const title = 'Detalle del Proyecto';
  const subtitle = project?.title || '';

  return (
    <DashboardLayout title={title} subtitle={subtitle}>
      <div className="mb-4">
        <Button variant="secondary" size="sm" onClick={() => router.push('/projects')}>
          ← Volver a Proyectos
        </Button>
      </div>

      {error && (
        <Card className="mb-6 bg-red-50 border-red-300">
          <div className="p-4">
            <p className="text-red-700 font-medium mb-2">Error al cargar el proyecto</p>
            <p className="text-red-600 text-sm">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={loadProject}
              className="mt-3"
            >
              Reintentar
            </Button>
          </div>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : project ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl">{project.title}</CardTitle>
                <span
                  className={`
                    px-3 py-1 text-sm font-semibold rounded-full
                    ${statusColors[project.status] || statusColors.pending}
                  `}
                >
                  {statusLabels[project.status] || project.status}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {project.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Creado</p>
                  <p className="text-gray-900">
                    {new Date(project.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Última actualización</p>
                  <p className="text-gray-900">
                    {new Date(project.updatedAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              {project.user && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-1">Propietario</p>
                  <p className="text-gray-900">{project.user.fullname || project.user.email}</p>
                </div>
              )}

              {projectTasks && projectTasks.length > 0 ? (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Tareas ({projectTasks.length})
                    </h3>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => router.push(`/projects/${projectId}/tasks`)}
                    >
                      Ver todas las tareas
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {projectTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className="p-4 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => router.push(`/tasks/${task.id}`)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium text-gray-900">{task.title}</p>
                          <div className="flex gap-2">
                            <span
                              className={`
                                px-2 py-1 text-xs font-semibold rounded-full
                                ${taskStatusColors[task.status] || taskStatusColors.pending}
                              `}
                            >
                              {taskStatusLabels[task.status] || task.status}
                            </span>
                            <span
                              className={`
                                px-2 py-1 text-xs font-semibold rounded-full
                                ${priorityColors[task.priority] || priorityColors.medium}
                              `}
                            >
                              {priorityLabels[task.priority] || task.priority}
                            </span>
                          </div>
                        </div>
                        
                        {task.description && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-1">{task.description}</p>
                        )}
                        
                        <div className="flex gap-4 text-xs text-gray-500">
                          {task.assignedTo && (
                            <span>Asignado a: {task.assignedTo.fullname}</span>
                          )}
                          {task.dueDate && (
                            <span>
                              Vence: {new Date(task.dueDate).toLocaleDateString('es-ES')}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    {projectTasks.length > 3 && (
                      <div className="text-center pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/projects/${projectId}/tasks`)}
                        >
                          Ver {projectTasks.length - 3} tarea{projectTasks.length - 3 !== 1 ? 's' : ''} más
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded border border-gray-200">
                  <p className="text-gray-600 mb-3">Este proyecto no tiene tareas aún</p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => router.push(`/projects/${projectId}/tasks`)}
                  >
                    Crear primera tarea
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Proyecto no encontrado</p>
            <Button onClick={() => router.push('/projects')} variant="primary">
              Volver a Proyectos
            </Button>
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
}