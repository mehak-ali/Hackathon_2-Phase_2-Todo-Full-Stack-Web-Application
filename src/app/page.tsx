'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getTasks, createTask, updateTask, deleteTask } from '@/lib/api';
import { Task } from '@/lib/types';
import TaskList from '@/components/feature/TaskList';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import TaskForm from '@/components/feature/TaskForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function HomePage() { // Renamed from DashboardPage
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getTasks();
      if (response.data) {
        setTasks(response.data);
      } else {
        setError(response.error || 'Failed to fetch tasks.');
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError('An unexpected error occurred while fetching tasks.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (taskData: Partial<Task>) => {
    setIsSubmitting(true);
    setFormError(null);
    try {
      const response = await createTask(taskData);
      if (response.data) {
        setTasks((prevTasks) => [...prevTasks, response.data!]);
        setIsModalOpen(false);
      } else {
        setFormError(response.error || 'Failed to create task.');
      }
    } catch (err) {
      console.error('Failed to create task:', err);
      setFormError('An unexpected error occurred while creating the task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async (taskData: Partial<Task>) => {
    if (!editingTask) return;

    setIsSubmitting(true);
    setFormError(null);
    try {
      const response = await updateTask(editingTask.id, taskData);
      if (response.data) {
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === response.data!.id ? response.data! : task))
        );
        setIsModalOpen(false);
        setEditingTask(undefined);
      } else {
        setFormError(response.error || 'Failed to update task.');
      }
    } catch (err) {
      console.error('Failed to update task:', err);
      setFormError('An unexpected error occurred while updating the task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    setIsLoading(true); // Show global loading for delete operation
    setError(null);
    try {
      const response = await deleteTask(id);
      if (response.status === 200 || response.status === 204) { // Assuming 200 or 204 for successful delete
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      } else {
        setError(response.error || 'Failed to delete task.');
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError('An unexpected error occurred while deleting the task.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    // Optimistic update
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, completed: completed } : task))
    );

    try {
      const response = await updateTask(id, { completed });
      if (!response.data) {
        // Revert on error
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === id ? { ...task, completed: !completed } : task))
        );
        setError(response.error || 'Failed to update task status.');
      }
    } catch (err) {
      console.error('Failed to toggle task complete status:', err);
      // Revert on error
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? { ...task, completed: !completed } : task))
      );
      setError('An unexpected error occurred while updating task status.');
    }
  };

  const openCreateModal = () => {
    setEditingTask(undefined);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setFormError(null);
    setIsModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsModalOpen(false);
    setEditingTask(undefined);
    setFormError(null);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-text">My Tasks</h1>
        <Button onClick={openCreateModal}>Add New Task</Button>
      </div>

      {isLoading && !error ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <ErrorMessage message={error} />
        </div>
      ) : (
        <TaskList
          tasks={tasks}
          onEdit={openEditModal}
          onDelete={handleDeleteTask}
          onToggleComplete={handleToggleComplete}
          isLoading={isSubmitting} // Pass submitting state to TaskCards for individual disable
        />
      )}

      <Modal isOpen={isModalOpen} onClose={closeTaskModal} title={editingTask ? 'Edit Task' : 'Create New Task'}>
        <TaskForm
          initialTask={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          isLoading={isSubmitting}
          errorMessage={formError || undefined}
          onCancel={closeTaskModal}
        />
      </Modal>
    </div>
  );
}