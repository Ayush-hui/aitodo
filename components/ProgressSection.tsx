'use client';

import { useTodos } from '@/lib/useTodos';

export default function ProgressSection() {
  const { completedCount, totalCount } = useTodos();

  if (totalCount === 0) return null;

  const percent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="progress-section" id="progressSection">
      <div className="progress-label">Completed</div>
      <div className="progress-bar-outer">
        <div
          className={`progress-bar-fill${percent === 100 ? ' complete' : ''}`}
          id="progressFill"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="progress-info">
        <span className="progress-fraction" id="progressFraction">
          {completedCount}/{totalCount}
        </span>
        <span className="progress-percent" id="progressPercent">
          {percent}%
        </span>
      </div>
    </div>
  );
}
