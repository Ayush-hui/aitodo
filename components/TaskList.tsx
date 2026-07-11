'use client';

import { Fragment } from 'react';
import { useTodos } from '@/lib/useTodos';
import type { Priority } from '@/lib/types';
import EditRow from './EditRow';
import EmptyState from './EmptyState';
import SectionHeader from './SectionHeader';
import TaskItemView from './TaskItemView';

export default function TaskList() {
  const {
    cancelEdit,
    commitEdit,
    editingId,
    filteredTasks,
    filterSections,
    removeTask,
    startEdit,
    toggleTask,
  } = useTodos();

  if (filteredTasks.length === 0) {
    return <EmptyState />;
  }

  let lastPriority: Priority | null = null;

  return (
    <ul className="task-list" id="taskList">
      {filteredTasks.map((task) => {
        const showHeader = filterSections && task.priority !== lastPriority;
        if (showHeader) {
          lastPriority = task.priority;
        }

        return (
          <Fragment key={task.id}>
            {showHeader ? <SectionHeader priority={task.priority} /> : null}
            <li
              className={`task-item${task.completed ? ' completed' : ''}${
                editingId === task.id ? ' editing' : ''
              }`}
              data-id={task.id}
            >
              {editingId === task.id ? (
                <EditRow
                  task={task}
                  onCancel={cancelEdit}
                  onCommit={(text, priority) => commitEdit(task.id, text, priority)}
                />
              ) : (
                <TaskItemView
                  task={task}
                  onDelete={() => removeTask(task.id)}
                  onEdit={() => startEdit(task.id)}
                  onToggle={() => toggleTask(task.id)}
                />
              )}
            </li>
          </Fragment>
        );
      })}
    </ul>
  );
}
