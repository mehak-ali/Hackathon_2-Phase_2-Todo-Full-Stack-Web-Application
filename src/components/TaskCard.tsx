// frontend/src/components/TaskCard.tsx
'use client';

import React from 'react';
import { Task } from '@/lib/types'; // Assuming a types file will be created
import Button from './Button';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean; // For optimistic UI updates or specific button loading
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleComplete, onEdit, onDelete, isLoading }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id, !task.completed)}
          className="form-checkbox h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary mr-3 cursor-pointer"
        />
        <span className={`text-lg ${task.completed ? 'line-through text-text-light' : 'text-text'}`}>
          {task.title}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(task)}
          disabled={isLoading}
        >
          Edit
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(task.id)}
          isLoading={isLoading}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default TaskCard;
