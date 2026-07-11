'use client';

import { useTodos } from '@/lib/useTodos';
import type { Filter } from '@/lib/types';

const FILTERS: Filter[] = ['all', 'active', 'completed'];

function labelForFilter(filter: Filter): string {
  return filter[0].toUpperCase() + filter.slice(1);
}

export default function Filters() {
  const { currentFilter, completedCount, clearCompleted, setFilter } = useTodos();

  return (
    <nav className="filters" id="filters">
      {FILTERS.map((filter) => (
        <button
          className={`filter-btn${currentFilter === filter ? ' active' : ''}`}
          data-filter={filter}
          key={filter}
          type="button"
          onClick={() => setFilter(filter)}
        >
          {labelForFilter(filter)}
        </button>
      ))}
      <div className="filter-spacer" />
      <button
        className="btn-clear"
        id="clearCompleted"
        type="button"
        disabled={completedCount === 0}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </nav>
  );
}
