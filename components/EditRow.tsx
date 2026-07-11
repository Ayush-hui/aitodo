'use client';

import { useEffect, useRef, useState } from 'react';
import { PRIORITIES, type Priority, type Task } from '@/lib/types';

type EditRowProps = {
  task: Task;
  onCancel: () => void;
  onCommit: (text: string, priority: Priority) => void;
};

const PRIORITY_LABELS: Record<Priority, string> = {
  high: 'H',
  medium: 'M',
  low: 'L',
};

export default function EditRow({ task, onCancel, onCommit }: EditRowProps) {
  const [text, setText] = useState(task.text);
  const [priority, setPriority] = useState<Priority>(task.priority);
  const inputRef = useRef<HTMLInputElement>(null);
  const textRef = useRef(text);
  const priorityRef = useRef(priority);
  const committedRef = useRef(false);

  useEffect(() => {
    textRef.current = text;
  }, [text]);

  useEffect(() => {
    priorityRef.current = priority;
  }, [priority]);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    input.focus();
    input.selectionStart = input.value.length;
  }, []);

  const commit = () => {
    if (committedRef.current) return;

    committedRef.current = true;
    onCommit(textRef.current.trim(), priorityRef.current);
  };

  return (
    <div className="edit-row">
      <input
        className="task-edit-input"
        type="text"
        value={text}
        ref={inputRef}
        onBlur={() => {
          window.setTimeout(() => {
            commit();
          }, 150);
        }}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            commit();
          }

          if (event.key === 'Escape') {
            event.preventDefault();
            committedRef.current = true;
            onCancel();
          }
        }}
      />
      <div className="priority-selector" data-edit-priority={priority}>
        {PRIORITIES.map((item) => (
          <button
            className={`priority-pill${priority === item ? ' selected' : ''}`}
            data-priority={item}
            key={item}
            type="button"
            onClick={() => {
              priorityRef.current = item;
              setPriority(item);
            }}
          >
            {PRIORITY_LABELS[item]}
          </button>
        ))}
      </div>
    </div>
  );
}
