import type { Priority } from '@/lib/types';

export default function SectionHeader({ priority }: { priority: Priority }) {
  return <div className={`section-header ${priority}`}>{priority.toUpperCase()}</div>;
}
