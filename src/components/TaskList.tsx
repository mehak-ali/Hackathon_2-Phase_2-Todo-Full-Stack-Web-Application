// frontend/src/components/TaskList.tsx
import React from 'react';
import { Task } from '@/lib/types';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleComplete, onEdit, onDelete, isLoading }) => {
  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  if (tasks.length === 0) {
    return (
      <div className="text-center text-text-light py-8">
        <p className="text-xl font-medium">No tasks yet!</p>
        <p className="text-md">Start by adding a new task above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {pendingTasks.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-text mb-4">Pending Tasks</h2>
          <div className="space-y-4">
            {pendingTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
                isLoading={isLoading}
              />
            ))}
          </div>
        </section>
      )}

      {completedTasks.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-text mb-4">Completed Tasks</h2>
          <div className="space-y-4">
            {completedTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
                isLoading={isLoading}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default TaskList;
