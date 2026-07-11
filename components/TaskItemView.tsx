'use client';

import type { Task } from '@/lib/types';
import Checkbox from './Checkbox';
import TaskActions from './TaskActions';

type TaskItemViewProps = {
  task: Task;
  onDelete: () => void;
  onEdit: () => void;
  onToggle: () => void;
};

export default function TaskItemView({ task, onDelete, onEdit, onToggle }: TaskItemViewProps) {
  return (
    <>
      <div className={`priority-dot ${task.priority}`} title={`${task.priority} priority`} />
      <Checkbox checked={task.completed} onToggle={onToggle} />
      <span className="task-text" onDoubleClick={onEdit}>
        {task.text}
      </span>
      <TaskActions onEdit={onEdit} onDelete={onDelete} />
    </>
  );
}
