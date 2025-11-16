'use client';

import React from 'react';
import { Project, ProjectStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

const statusColors: Record<ProjectStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
};

const statusLabels: Record<ProjectStatus, string> = {
  pending: 'Pendiente',
  'in-progress': 'En Progreso',
  completed: 'Completado',
};

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{project.title}</CardTitle>
          <span
            className={`
              px-2 py-1 text-xs font-semibold rounded-full
              ${statusColors[project.status]}
            `}
          >
            {statusLabels[project.status]}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {project.description && (
          <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
        )}
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tasks && (
            <span className="text-sm text-gray-500">
              {project.tasks.length} {project.tasks.length === 1 ? 'tarea' : 'tareas'}
            </span>
          )}
          <span className="text-sm text-gray-500">
            Creado: {new Date(project.createdAt).toLocaleDateString('es-ES')}
          </span>
        </div>

        <div className="flex gap-2">
          {onView && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(project.id)}
            >
              Ver
            </Button>
          )}
          {onEdit && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEdit(project)}
            >
              Editar
            </Button>
          )}
          {onDelete && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(project.id)}
            >
              Eliminar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

