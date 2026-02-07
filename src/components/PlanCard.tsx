import type { Plan } from '@/lib/types';

export default function PlanCard({
  plan,
  onOpen
}: {
  plan: Plan;
  onOpen: () => void;
}) {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="pill">{plan.type}</span>
        <button className="button secondary" onClick={onOpen}>View plan</button>
      </div>
      <h3 style={{ margin: '16px 0 6px', fontFamily: 'Fraunces, serif' }}>
        {plan.monthsToGoal ? `${plan.monthsToGoal} months` : 'No timeline yet'}
      </h3>
      <p className="subtitle" style={{ marginBottom: 12 }}>
        Save ${plan.savedPerMonth} / month
      </p>
      <p style={{ margin: 0, color: 'var(--muted)' }}>
        Top changes: {plan.topChanges.join(', ')}
      </p>
    </div>
  );
}
