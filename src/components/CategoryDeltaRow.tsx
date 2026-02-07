import type { CategoryDelta } from '@/lib/types';

export default function CategoryDeltaRow({ delta }: { delta: CategoryDelta }) {
  return (
    <div className="delta">
      <span>{delta.category}</span>
      <span>
        ${delta.before} → <strong>${delta.after}</strong>
      </span>
    </div>
  );
}
