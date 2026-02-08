'use client';

import React from 'react';
import { Task } from '@/lib/types';
import Button from '../ui/Button';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
  isLoading?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
  isLoading = false,
}) => {
  return (
    <div
      className={`bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 ${
        task.completed ? 'opacity-60' : ''
      }`}
    >
      <div className="flex-grow">
        <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-text'}`}>
          {task.title}
        </h3>
        <p className={`text-sm ${task.completed ? 'line-through text-gray-400' : 'text-text-light'}`}>
          {task.description}
        </p>
      </div>
      <div className="flex space-x-2">
        <Button
          variant="ghost"
          size="small"
          onClick={() => onToggleComplete(task.id, !task.completed)}
          disabled={isLoading}
          aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {task.completed ? 'Undo' : 'Complete'}
        </Button>
        <Button
          variant="secondary"
          size="small"
          onClick={() => onEdit(task)}
          disabled={isLoading}
          aria-label={`Edit task ${task.title}`}
        >
          Edit
        </Button>
        <Button
          variant="danger"
          size="small"
          onClick={() => onDelete(task.id)}
          disabled={isLoading}
          aria-label={`Delete task ${task.title}`}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default TaskCard;
