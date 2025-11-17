'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout, TaskCard, Card, Button, LoadingSpinner, Modal, TaskForm, ConfirmDialog } from '@/components';
import { taskService, projectService } from '@/services';
import { Task, Project, CreateTaskRequest, UpdateTaskRequest } from '@/types';
import { useAuth } from '@/context';

export default function ProjectTasksPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const projectId = params.id as string;

  useEffect(() => {
    if (!authLoading && user && projectId) {
      loadData();
    }
  }, [authLoading, user, projectId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const [projectData, tasksData] = await Promise.all([
        projectService.getById(projectId),
        taskService.getByProject(projectId),
      ]);
      
      setProject(projectData);
      setTasks(tasksData);
    } catch (err) {
      console.error('Error loading data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las tareas';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTask(null);
    setError('');
    setIsModalOpen(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setError('');
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setConfirmId(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!confirmId) return;
    try {
      setIsDeleting(true);
      setError('');
      await taskService.delete(confirmId);
      await loadData();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar tarea';
      setError(message);
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setConfirmId(null);
    }
  };

  const handleView = (id: string) => {
    router.push(`/tasks/${id}`);
  };

  const handleSubmit = async (data: CreateTaskRequest | UpdateTaskRequest) => {
    try {
      setIsSubmitting(true);
      setError('');
      
      // Si estamos creando, aseguramos que el projectId sea el correcto
      const submitData = editingTask 
        ? data 
        : { ...data, projectId };

      if (editingTask) {
        await taskService.update(editingTask.id, submitData as UpdateTaskRequest);
      } else {
        await taskService.create(submitData as CreateTaskRequest);
      }
      
      setIsModalOpen(false);
      setEditingTask(null);
      await loadData();
    } catch (err) {
      console.error('Error saving task:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar la tarea';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setError('');
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

  const title = `Tareas del Proyecto`;
  const subtitle = project?.title || '';

  // Estadísticas de tareas
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;

  return (
    <DashboardLayout title={title} subtitle={subtitle}>
      <div className="mb-6 flex justify-between items-center">
        <Button variant="secondary" size="sm" onClick={() => router.push(`/projects/${projectId}`)}>
          ← Volver al Proyecto
        </Button>
        <Button variant="primary" onClick={handleCreate}>
          Nueva Tarea
        </Button>
      </div>

      {error && (
        <Card className="mb-6 bg-red-50 border-red-300">
          <div className="p-4">
            <p className="text-red-700 font-medium mb-2">Error</p>
            <p className="text-red-600 text-sm">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
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
      ) : (
        <>
          {/* Estadísticas */}
          {tasks.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-6">
              <Card padding="sm">
                <p className="text-sm text-gray-600 mb-1">Total</p>
                <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
              </Card>
              <Card padding="sm">
                <p className="text-sm text-gray-600 mb-1">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingTasks}</p>
              </Card>
              <Card padding="sm">
                <p className="text-sm text-gray-600 mb-1">En Progreso</p>
                <p className="text-2xl font-bold text-blue-600">{inProgressTasks}</p>
              </Card>
              <Card padding="sm">
                <p className="text-sm text-gray-600 mb-1">Completadas</p>
                <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
              </Card>
            </div>
          )}

          {tasks.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">Este proyecto no tiene tareas aún</p>
                <Button onClick={handleCreate} variant="primary">
                  Crear Primera Tarea
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={handleView}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal de creación/edición */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCancel}
        title={editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
        size="lg"
      >
        {error && (
          <div className="mb-4 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
        <TaskForm
          task={editingTask || undefined}
          projects={project ? [project] : []}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isSubmitting}
        />
      </Modal>
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Eliminar tarea"
        message="¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onClose={() => setIsConfirmOpen(false)}
        isLoading={isDeleting}
      />
    </DashboardLayout>
  );
}