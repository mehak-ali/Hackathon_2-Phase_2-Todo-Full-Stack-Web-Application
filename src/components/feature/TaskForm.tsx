'use client';

import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ErrorMessage from '../ui/ErrorMessage';
import { Task } from '@/lib/types';

interface TaskFormProps {
  initialTask?: Task;
  onSubmit: (task: Partial<Task>) => void;
  isLoading: boolean;
  errorMessage?: string;
  onCancel?: () => void; // Optional for edit/create modals
}

const TaskForm: React.FC<TaskFormProps> = ({
  initialTask,
  onSubmit,
  isLoading,
  errorMessage,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description);
    }
  }, [initialTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="title"
        label="Title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        disabled={isLoading}
      />
      <Input
        id="description"
        label="Description"
        type="textarea" // Using type="textarea" for styling, but it will render as input.
                        // A more robust solution would be a separate Textarea component.
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isLoading}
      />

      {errorMessage && <ErrorMessage message={errorMessage} className="text-center" />}

      <div className="flex justify-end space-x-2 mt-6">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isLoading} disabled={isLoading}>
          {initialTask ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
