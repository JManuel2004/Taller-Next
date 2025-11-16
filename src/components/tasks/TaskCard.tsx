'use client';

import React from 'react';
import { Task, TaskStatus, TaskPriority } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

const statusColors: Record<TaskStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

const statusLabels: Record<TaskStatus, string> = {
  pending: 'Pendiente',
  'in-progress': 'En Progreso',
  completed: 'Completada',
  cancelled: 'Cancelada',
};

const priorityColors: Record<TaskPriority, string> = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-orange-100 text-orange-700',
  high: 'bg-red-100 text-red-700',
};

const priorityLabels: Record<TaskPriority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg">{task.title}</CardTitle>
          <div className="flex gap-2">
            <span
              className={`
                px-2 py-1 text-xs font-semibold rounded-full
                ${statusColors[task.status]}
              `}
            >
              {statusLabels[task.status]}
            </span>
            <span
              className={`
                px-2 py-1 text-xs font-semibold rounded-full
                ${priorityColors[task.priority]}
              `}
            >
              {priorityLabels[task.priority]}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {task.description && (
          <p className="text-gray-600 mb-3 line-clamp-2 text-sm">{task.description}</p>
        )}
        
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          {task.project && (
            <div>
              <span className="font-medium">Proyecto:</span> {task.project.title}
            </div>
          )}
          
          {task.assignedTo && (
            <div>
              <span className="font-medium">Asignado a:</span> {task.assignedTo.fullname}
            </div>
          )}
          
          {task.dueDate && (
            <div>
              <span className="font-medium">Fecha límite:</span>{' '}
              {new Date(task.dueDate).toLocaleDateString('es-ES')}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {onView && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(task.id)}
            >
              Ver
            </Button>
          )}
          {onEdit && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEdit(task)}
            >
              Editar
            </Button>
          )}
          {onDelete && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(task.id)}
            >
              Eliminar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};