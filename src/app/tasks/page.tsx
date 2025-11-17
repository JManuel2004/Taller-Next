'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout, TaskCard, TaskForm, Modal, Button, LoadingSpinner, Card, ConfirmDialog } from '@/components';
import { taskService, projectService } from '@/services';
import { Task, CreateTaskRequest, UpdateTaskRequest, Project } from '@/types';
import { useAuth } from '@/context';

export default function TasksPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadTasks = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      console.error('Error loading tasks:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar tareas';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadProjects = React.useCallback(async () => {
    try {
      const data = await projectService.getAll();
      setProjects(data);
    } catch (err) {
      console.error('Error loading projects:', err);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user) {
      loadTasks();
      loadProjects();
    }
  }, [authLoading, user?.id]);

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
      await loadTasks();
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
      if (editingTask) {
        await taskService.update(editingTask.id, data as UpdateTaskRequest);
      } else {
        await taskService.create(data as CreateTaskRequest);
      }
      setIsModalOpen(false);
      setEditingTask(null);
      await loadTasks();
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

  const title = user?.role === 'superadmin' ? 'Todas las Tareas' : 'Mis Tareas';
  const subtitle = user?.role === 'superadmin' 
    ? 'Administra tareas de todos los proyectos' 
    : 'Gestiona las tareas de tus proyectos';

  return (
    <DashboardLayout title={title} subtitle={subtitle}>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Tareas</h2>
        <Button onClick={handleCreate} variant="primary">
          Nueva Tarea
        </Button>
      </div>

      {error && (
        <Card className="mb-6 bg-red-50 border-red-300">
          <div className="p-4">
            <p className="text-red-700 font-medium mb-2">Error al cargar tareas</p>
            <p className="text-red-600 text-sm">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={loadTasks}
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
      ) : tasks.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No hay tareas aún</p>
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
          projects={projects}
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