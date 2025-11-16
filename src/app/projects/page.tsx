'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout, ProjectCard, ProjectForm, Modal, Button, LoadingSpinner, Card } from '@/components';
import { projectService } from '@/services';
import { Project, CreateProjectRequest, UpdateProjectRequest } from '@/types';
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

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
      return;
    }

    try {
      await projectService.delete(id);
      await loadProjects();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar proyecto');
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          ))}
        </div>
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
    </DashboardLayout>
  );
}

