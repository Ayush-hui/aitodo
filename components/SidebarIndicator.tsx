'use client';

import { useMemo } from 'react';
import { useTodos } from '@/lib/useTodos';

export default function SidebarIndicator() {
  const { activeCount } = useTodos();

  const style = useMemo(() => {
    if (activeCount === 0) {
      return { backgroundColor: '#2a2a2a', boxShadow: 'none' };
    }

    if (activeCount === 1) {
      return {
        backgroundColor: 'rgba(52, 211, 153, 0.6)',
        boxShadow: '0 0 12px 2px rgba(52, 211, 153, 0.15)',
      };
    }

    if (activeCount === 2) {
      return {
        backgroundColor: 'rgba(251, 146, 60, 0.6)',
        boxShadow: '0 0 12px 2px rgba(251, 146, 60, 0.15)',
      };
    }

    if (activeCount === 3) {
      return {
        backgroundColor: 'rgba(248, 113, 113, 0.6)',
        boxShadow: '0 0 12px 2px rgba(248, 113, 113, 0.15)',
      };
    }

    if (activeCount === 4) {
      return {
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        boxShadow: '0 0 16px 3px rgba(239, 68, 68, 0.2)',
      };
    }

    return {
      backgroundColor: 'rgba(168, 139, 250, 0.6)',
      boxShadow: '0 0 16px 3px rgba(168, 139, 250, 0.2)',
    };
  }, [activeCount]);

  return <div className="sidebar-indicator" id="sidebarIndicator" style={style} />;
}
