'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskStatus, TaskPriority, Project } from '@/types';
import { Input, Textarea, Button } from '@/components/ui';

interface TaskFormProps {
  task?: Task;
  projects: Project[];
  onSubmit: (data: CreateTaskRequest | UpdateTaskRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  task,
  projects,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreateTaskRequest>({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'pending',
    priority: task?.priority || 'medium',
    dueDate: task?.dueDate ? task.dueDate.split('T')[0] : '',
    projectId: task?.projectId || (projects.length > 0 ? projects[0].id : ''),
    assignedToId: task?.assignedToId || '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        projectId: task.projectId || (projects.length > 0 ? projects[0].id : ''),
        assignedToId: task.assignedToId || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: '',
        projectId: projects.length > 0 ? projects[0].id : '',
        assignedToId: '',
      });
    }
    setErrors({});
  }, [task, projects]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (!formData.projectId) {
      newErrors.projectId = 'Debes seleccionar un proyecto';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = { ...formData };
    if (!submitData.dueDate) {
      delete submitData.dueDate;
    }
    if (!submitData.assignedToId) {
      delete submitData.assignedToId;
    }

    await onSubmit(submitData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Título"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        required
        placeholder="Nombre de la tarea"
      />

      <Textarea
        label="Descripción"
        name="description"
        value={formData.description || ''}
        onChange={handleChange}
        error={errors.description}
        rows={4}
        placeholder="Descripción de la tarea (opcional)"
      />

      <div>
        <label
          htmlFor="projectId"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Proyecto *
        </label>
        <select
          id="projectId"
          name="projectId"
          value={formData.projectId}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-gray-500 focus:ring-gray-500"
          required
        >
          <option value="">Selecciona un proyecto</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>
        {errors.projectId && (
          <p className="mt-1 text-sm text-red-600">{errors.projectId}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Estado
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-gray-500 focus:ring-gray-500"
          >
            <option value="pending">Pendiente</option>
            <option value="in-progress">En Progreso</option>
            <option value="completed">Completada</option>
            <option value="cancelled">Cancelada</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Prioridad
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-gray-500 focus:ring-gray-500"
          >
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
        </div>
      </div>

      <Input
        label="Fecha límite"
        name="dueDate"
        type="date"
        value={formData.dueDate || ''}
        onChange={handleChange}
      />

      <div className="flex gap-2 justify-end pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
        >
          {task ? 'Actualizar' : 'Crear'} Tarea
        </Button>
      </div>
    </form>
  );
};