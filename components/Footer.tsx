'use client';

import { useTodos } from '@/lib/useTodos';

export default function Footer() {
  const { activeCount, totalCount } = useTodos();

  if (totalCount === 0) return null;

  return (
    <div className="footer" id="footer">
      {activeCount === 1 ? '1 item left' : `${activeCount} items left`}
    </div>
  );
}
