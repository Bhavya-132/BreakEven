'use client';

import { useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CategoryDeltaRow from '@/components/CategoryDeltaRow';
import ChecklistItem from '@/components/ChecklistItem';
import { loadPlans } from '@/lib/storage';
import type { Plan, PlanType } from '@/lib/types';

export default function PlanPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const defaultType = (searchParams.get('type') as PlanType) || 'FAST';
  const [active, setActive] = useState<PlanType>(defaultType);

  const plans = useMemo(() => loadPlans(), []);
  const plan = plans.find((item) => item.type === active) as Plan | undefined;

  if (!plan) {
    return (
      <main className="page fade-in">
        <h1 className="hero-title">Plan details</h1>
        <p className="subtitle">No plan found yet. Generate plans from the dashboard.</p>
        <button className="button" onClick={() => router.push('/dashboard')}>Back to dashboard</button>
      </main>
    );
  }

  return (
    <main className="page fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <h1 className="hero-title" style={{ marginBottom: 0 }}>Plan detail</h1>
        <div className="tab-bar">
          {(['FAST', 'STEADY'] as PlanType[]).map((type) => (
            <button
              key={type}
              className={active === type ? 'active' : ''}
              onClick={() => setActive(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-2" style={{ marginTop: 24 }}>
        <div className="card">
          <span className="pill">Timeline</span>
          <h3 style={{ margin: '12px 0 6px', fontFamily: 'Fraunces, serif' }}>
            {plan.monthsToGoal ? `${plan.monthsToGoal} months` : 'No timeline yet'}
          </h3>
          <p className="subtitle">Monthly savings: ${plan.savedPerMonth}</p>
          <p style={{ margin: 0, color: 'var(--muted)' }}>Income boost step: +${plan.incomeBoost} / month</p>
        </div>
        <div className="card">
          <span className="pill">AI summary</span>
          <p className="subtitle" style={{ marginTop: 12 }}>{plan.aiSummary}</p>
          {plan.monthsToGoal === null && (
            <p style={{ margin: '8px 0 0', color: 'var(--muted)' }}>
              You are currently in a deficit of ${plan.deficit} per month.
            </p>
          )}
        </div>
      </div>

      <section style={{ marginTop: 32 }}>
        <h2 className="section-title">Do this week</h2>
        <div className="card">
          <ul className="list">
            {plan.weeklyChecklist.map((item) => (
              <ChecklistItem key={item} text={item} />
            ))}
          </ul>
        </div>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2 className="section-title">Category changes</h2>
        <div className="card">
          <div className="list">
            {plan.deltasByCategory.map((delta) => (
              <CategoryDeltaRow key={delta.category} delta={delta} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
