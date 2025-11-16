'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout, Card, CardHeader, CardTitle, CardContent, Button, LoadingSpinner } from '@/components';
import { taskService } from '@/services';
import { Task } from '@/types';
import { useAuth } from '@/context';

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  'in-progress': 'En Progreso',
  completed: 'Completada',
  cancelled: 'Cancelada',
};

const statusColors: Record<string, string> = {
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

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const taskId = params.id as string;

  useEffect(() => {
    if (!authLoading && user && taskId) {
      loadTask();
    }
  }, [authLoading, user, taskId]);

  const loadTask = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await taskService.getById(taskId);
      setTask(data);
    } catch (err) {
      console.error('Error loading task:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar la tarea';
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

  const title = 'Detalle de la Tarea';
  const subtitle = task?.title || '';

  return (
    <DashboardLayout title={title} subtitle={subtitle}>
      <div className="mb-4 flex gap-2">
        <Button variant="secondary" size="sm" onClick={() => router.push('/tasks')}>
          ← Volver a Tareas
        </Button>
        {task?.projectId && (
          <Button variant="outline" size="sm" onClick={() => router.push(`/projects/${task.projectId}`)}>
            Ver Proyecto
          </Button>
        )}
      </div>

      {error && (
        <Card className="mb-6 bg-red-50 border-red-300">
          <div className="p-4">
            <p className="text-red-700 font-medium mb-2">Error al cargar la tarea</p>
            <p className="text-red-600 text-sm">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={loadTask}
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
      ) : task ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl">{task.title}</CardTitle>
                <div className="flex gap-2">
                  <span
                    className={`
                      px-3 py-1 text-sm font-semibold rounded-full
                      ${statusColors[task.status] || statusColors.pending}
                    `}
                  >
                    {statusLabels[task.status] || task.status}
                  </span>
                  <span
                    className={`
                      px-3 py-1 text-sm font-semibold rounded-full
                      ${priorityColors[task.priority] || priorityColors.medium}
                    `}
                  >
                    {priorityLabels[task.priority] || task.priority}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {task.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {task.project && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Proyecto</p>
                    <button
                      onClick={() => router.push(`/projects/${task.projectId}`)}
                      className="text-gray-900 font-medium hover:underline text-left"
                    >
                      {task.project.title}
                    </button>
                  </div>
                )}

                {task.assignedTo && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Asignado a</p>
                    <p className="text-gray-900">{task.assignedTo.fullname}</p>
                    <p className="text-sm text-gray-600">{task.assignedTo.email}</p>
                  </div>
                )}

                {task.dueDate && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Fecha límite</p>
                    <p className="text-gray-900">
                      {new Date(task.dueDate).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    {(() => {
                      const daysUntilDue = Math.ceil(
                        (new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                      );
                      const isOverdue = daysUntilDue < 0;
                      const isUrgent = daysUntilDue <= 3 && daysUntilDue >= 0;

                      if (isOverdue) {
                        return (
                          <p className="text-sm text-red-600 font-medium mt-1">
                            Vencida hace {Math.abs(daysUntilDue)} día{Math.abs(daysUntilDue) !== 1 ? 's' : ''}
                          </p>
                        );
                      }
                      if (isUrgent) {
                        return (
                          <p className="text-sm text-orange-600 font-medium mt-1">
                            Vence en {daysUntilDue} día{daysUntilDue !== 1 ? 's' : ''}
                          </p>
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600 mb-1">Estado</p>
                  <p className="text-gray-900">{statusLabels[task.status]}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Prioridad</p>
                  <p className="text-gray-900">{priorityLabels[task.priority]}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Creada</p>
                  <p className="text-gray-900">
                    {new Date(task.createdAt).toLocaleDateString('es-ES', {
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
                    {new Date(task.updatedAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                {task.projectId && (
                  <Button
                    variant="secondary"
                    onClick={() => router.push(`/projects/${task.projectId}`)}
                  >
                    Ver Proyecto
                  </Button>
                )}
                <Button
                  variant="primary"
                  onClick={() => router.push('/tasks')}
                >
                  Volver a Tareas
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Tarea no encontrada</p>
            <Button onClick={() => router.push('/tasks')} variant="primary">
              Volver a Tareas
            </Button>
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
}