'use client';

import { useState } from 'react';
import { PRIORITIES, type Priority } from '@/lib/types';
import { useTodos } from '@/lib/useTodos';

const PRIORITY_LABELS: Record<Priority, string> = {
  high: 'H',
  medium: 'M',
  low: 'L',
};

export default function TodoInput() {
  const [text, setText] = useState('');
  const { addTask, selectedPriority, setSelectedPriority } = useTodos();

  const submit = () => {
    if (addTask(text)) {
      setText('');
    }
  };

  return (
    <div className="input-row">
      <input
        type="text"
        id="taskInput"
        placeholder="What needs to be done?"
        autoComplete="off"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') submit();
        }}
      />
      <div className="priority-selector" id="inputPriority">
        {PRIORITIES.map((priority) => (
          <button
            className={`priority-pill${selectedPriority === priority ? ' selected' : ''}`}
            data-priority={priority}
            key={priority}
            type="button"
            onClick={() => setSelectedPriority(priority)}
          >
            {PRIORITY_LABELS[priority]}
          </button>
        ))}
      </div>
      <button className="btn-add" id="addBtn" type="button" onClick={submit}>
        Add Task
      </button>
    </div>
  );
}
