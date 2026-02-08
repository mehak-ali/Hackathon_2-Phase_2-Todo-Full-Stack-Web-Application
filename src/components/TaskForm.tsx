// frontend/src/components/TaskForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Input from './Input';
import Button from './Button';
import { Task } from '@/lib/types';

interface TaskFormProps {
  initialTask?: Task | null;
  onSubmit: (title: string, description: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
  submitButtonText?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({
  initialTask = null,
  onSubmit,
  onCancel,
  isLoading = false,
  submitButtonText = 'Save Task',
}) => {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [titleError, setTitleError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(initialTask?.title || '');
    setDescription(initialTask?.description || '');
    setTitleError(null);
  }, [initialTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError('Task title cannot be empty.');
      return;
    }
    setTitleError(null);
    onSubmit(title, description);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="title"
        label="Title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={titleError}
        required
      />
      <Input
        id="description"
        label="Description (Optional)"
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="flex justify-end space-x-3 mt-6">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {isLoading ? 'Saving...' : submitButtonText}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
