'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout, ProjectForm, Modal, Button, LoadingSpinner, Card, TaskForm, ConfirmDialog } from '@/components';
import { projectService, taskService } from '@/services';
import { Project, CreateProjectRequest, UpdateProjectRequest, CreateTaskRequest, UpdateTaskRequest } from '@/types';
import { useAuth } from '@/context';

export default function ProjectsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 6; // paginación cliente
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedProjectForTask, setSelectedProjectForTask] = useState<Project | null>(null);

  const loadProjects = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await projectService.getAll();
      setProjects(data);
    } catch (err) {
      console.error('Error loading projects:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar proyectos';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user) {
      loadProjects();
    }
  }, [authLoading, user?.id]);

  const handleCreate = () => {
    setEditingProject(null);
    setError('');
    setIsModalOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
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
      await projectService.delete(confirmId);
      await loadProjects();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar proyecto';
      setError(message);
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setConfirmId(null);
    }
  };

  const handleView = (id: string) => {
    router.push(`/projects/${id}`);
  };

  const handleSubmit = async (data: CreateProjectRequest | UpdateProjectRequest) => {
    try {
      setIsSubmitting(true);
      setError('');
      if (editingProject) {
        await projectService.update(editingProject.id, data as UpdateProjectRequest);
      } else {
        await projectService.create(data as CreateProjectRequest);
      }
      setIsModalOpen(false);
      setEditingProject(null);
      await loadProjects();
    } catch (err) {
      console.error('Error saving project:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar el proyecto';
      // Mostrar el error en la página en lugar de lanzarlo
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setError(''); 
  };

  const handleAddTaskClick = (project: Project) => {
    setSelectedProjectForTask(project);
    setIsTaskModalOpen(true);
  };

  const handleTaskModalClose = () => {
    setIsTaskModalOpen(false);
    setSelectedProjectForTask(null);
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

  const title = user?.role === 'superadmin' ? 'Todos los Proyectos' : 'Mis Proyectos';
  const subtitle = user?.role === 'superadmin' 
    ? 'Administra proyectos de todos los usuarios' 
    : 'Gestiona tus proyectos';

  return (
    <DashboardLayout title={title} subtitle={subtitle}>
      {/* Header con botón de crear */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Proyectos</h2>
        <Button onClick={handleCreate} variant="primary">
          Nuevo Proyecto
        </Button>
      </div>

      {/* Error */}
      {error && (
        <Card className="mb-6 bg-red-50 border-red-300">
          <div className="p-4">
            <p className="text-red-700 font-medium mb-2">Error al cargar proyectos</p>
            <p className="text-red-600 text-sm">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={loadProjects}
              className="mt-3"
            >
              Reintentar
            </Button>
          </div>
        </Card>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No hay proyectos aún</p>
            <Button onClick={handleCreate} variant="primary">
              Crear Primer Proyecto
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.slice((page - 1) * perPage, page * perPage).map((project) => {
              const statusColors: Record<string, string> = {
                pending: 'bg-yellow-100 text-yellow-800',
                'in-progress': 'bg-blue-100 text-blue-800',
                completed: 'bg-green-100 text-green-800',
              };
              const statusLabels: Record<string, string> = {
                pending: 'Pendiente',
                'in-progress': 'En Progreso',
                completed: 'Completado',
              };

              return (
                <Card key={project.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg text-gray-900">{project.title}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[project.status] || 'bg-gray-100 text-gray-800'}`}>
                      {statusLabels[project.status] || project.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => router.push(`/projects/${project.id}/tasks`)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Ver Tareas
                    </Button>
                    <Button
                      onClick={() => handleAddTaskClick(project)}
                      variant="primary"
                      size="sm"
                      className="w-full"
                    >
                      Añadir Tarea
                    </Button>
                    <Button
                      onClick={() => handleEdit(project)}
                      variant="secondary"
                      size="sm"
                      className="w-full"
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDelete(project.id)}
                      variant="danger"
                      size="sm"
                      className="w-full"
                    >
                      Eliminar
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Paginación cliente */}
          {projects.length > perPage && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Mostrando {Math.min(projects.length, (page - 1) * perPage + 1)} - {Math.min(page * perPage, projects.length)} de {projects.length}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                  Anterior
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page * perPage >= projects.length}>
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal de creación/edición */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCancel}
        title={editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
        size="md"
      >
        {error && (
          <div className="mb-4 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
        <ProjectForm
          project={editingProject || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isSubmitting}
        />
      </Modal>
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Eliminar proyecto"
        message="¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onClose={() => setIsConfirmOpen(false)}
        isLoading={isDeleting}
      />

      {/* Modal de creación de tarea desde proyecto */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={handleTaskModalClose}
        title={`Nueva Tarea - ${selectedProjectForTask?.title || ''}`}
        size="lg"
      >
        <TaskForm
          projects={selectedProjectForTask ? [selectedProjectForTask] : []}
          onSubmit={async (data) => {
            try {
              setIsSubmitting(true);
              setError('');
              await taskService.create(data as CreateTaskRequest);
              setIsTaskModalOpen(false);
              setSelectedProjectForTask(null);
            } catch (err) {
              const errorMessage = err instanceof Error ? err.message : 'Error al crear la tarea';
              setError(errorMessage);
            } finally {
              setIsSubmitting(false);
            }
          }}
          onCancel={handleTaskModalClose}
          isLoading={isSubmitting}
        />
      </Modal>
    </DashboardLayout>
  );
}


