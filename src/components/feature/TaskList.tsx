'use client';

import React from 'react';
import { Task } from '@/lib/types';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
  isLoading?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete, onToggleComplete, isLoading }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center text-text-light py-8">
        <p>No tasks yet. Add a new task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};

export default TaskList;
