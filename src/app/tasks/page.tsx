// frontend/src/app/tasks/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getTasks, createTask, updateTask, deleteTask } from '@/lib/api'; // Import specific task API functions
import { getAuthToken, logout } from '@/lib/auth';
import { Task } from '@/lib/types';
import Header from '@/components/Header';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import TaskList from '@/components/TaskList';
import Modal from '@/components/Modal';
import TaskForm from '@/components/TaskForm';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const router = useRouter();

  useEffect(() => {
    // If SKIP_AUTH is true, bypass authentication and fetch tasks directly
    if (process.env.NEXT_PUBLIC_SKIP_AUTH === 'true') {
      fetchTasks();
      return;
    }
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }
    fetchTasks();
  }, [router]);

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getTasks(); // Use the getTasks wrapper
      if (response.data) {
        setTasks(response.data);
      } else if (response.error === 'Authentication required') {
        logout();
      } else {
        setError(response.error || 'Failed to fetch tasks.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tasks.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (title: string, description: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await createTask({ title, description, completed: false }); // Use the createTask wrapper
      if (response.data) {
        setIsModalOpen(false);
        await fetchTasks();
      } else {
        setError(response.error || 'Failed to create task.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create task.');
    } finally {
      setIsLoading(false);
    }
  };


  const handleEditTask = async (title: string, description: string) => {
    if (!editingTask) return;
    try {
      setIsLoading(true);
      setError(null);
      const response = await updateTask(editingTask.id, { title, description, completed: editingTask.completed }); // Use the updateTask wrapper
      if (response.data) {
        setIsModalOpen(false);
        setEditingTask(null);
        await fetchTasks();
      } else {
        setError(response.error || 'Failed to update task.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update task.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const response = await deleteTask(id); // Use the deleteTask wrapper
      if (response.data) {
        await fetchTasks();
      } else {
        setError(response.error || 'Failed to delete task.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete task.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      setError(null);
      // Optimistic update
      setTasks(currentTasks =>
        currentTasks.map(task =>
          task.id === id ? { ...task, completed: !completed } : task
        )
      );
      const response = await updateTask(id, { completed: !completed }); // Use the updateTask wrapper
      if (!response.data) {
        setError(response.error || 'Failed to update task status.');
        // Revert optimistic update on error
        setTasks(currentTasks =>
          currentTasks.map(task =>
            task.id === id ? { ...task, completed: completed } : task
          )
        );
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update task status.');
      // Revert optimistic update on error
      setTasks(currentTasks =>
        currentTasks.map(task =>
          task.id === id ? { ...task, completed: completed } : task
        )
      );
    }
  };

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  return (
    <>
      <Header
        appName="TodoApp"
        userEmail={getAuthToken() ? 'user@example.com' : null} // Placeholder for user email
        onLogout={logout}
      />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-text-dark">My Todos</h1>
          <Button onClick={handleOpenCreateModal}>Add New Task</Button>
        </div>

        <ErrorMessage message={error} className="mb-4" />

        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteTask}
            isLoading={isLoading}
          />
        )}
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
      >
        <TaskForm
          initialTask={editingTask}
          onSubmit={editingTask ? handleEditTask : handleCreateTask}
          onCancel={handleCloseModal}
          isLoading={isLoading}
          submitButtonText={editingTask ? 'Update Task' : 'Create Task'}
        />
      </Modal>
    </>
  );
}
