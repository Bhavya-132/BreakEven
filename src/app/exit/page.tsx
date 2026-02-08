'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProgressBar from '@/components/ProgressBar';
import CategoryDeltaRow from '@/components/CategoryDeltaRow';
import { loadGoal, loadGoalInputs, loadPlanUpdate, loadPlans, loadProfile, loadTransactions, savePlans, saveSnapshot } from '@/lib/storage';
import type { Plan, PlanType } from '@/lib/types';

const monthTasks = [
  ['Build buffer', 'Cancel 2 subscriptions', 'Reduce takeout'],
  ['Save', 'Move bills to personal account', 'Research housing'],
  ['Save', 'Pack documents', 'Update emergency contacts'],
  ['Save', 'Plan logistics', 'Secure storage'],
  ['Save', 'Confirm housing plan', 'Finalize timeline'],
  ['Save', 'Complete move checklist', 'Rebuild buffer']
];

export default function ExitModePage() {
  const router = useRouter();
  const goalInputs = loadGoalInputs();
  const [plans, setPlans] = useState<Plan[]>(() => loadPlans());
  const [active, setActive] = useState<PlanType>('FAST');
  const [loading, setLoading] = useState(false);
  const profile = loadProfile();
  const goal = loadGoal();

  const fastPlan = useMemo(() => plans.find((p) => p.type === 'FAST') as Plan | undefined, [plans]);
  const steadyPlan = useMemo(() => plans.find((p) => p.type === 'STEADY') as Plan | undefined, [plans]);
  const plan = useMemo(() => (active === 'FAST' ? fastPlan : steadyPlan), [active, fastPlan, steadyPlan]);
  const update = loadPlanUpdate(active);

  useEffect(() => {
    if (!goalInputs || loading) return;
    if (!profile || !goal) return;
    const needsRefresh =
      plans.length === 0 ||
      plans.every((p) => p.savedPerMonth === 0 && (p.monthsToGoal === null || p.monthsToGoal === undefined));

    if (!needsRefresh) return;

    const transactions = loadTransactions();
    const payload = transactions.length > 0
      ? { profile, goal, goalInputs, transactions }
      : { profile, goal, goalInputs };

    setLoading(true);
    fetch('/api/v1/plan/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.plans) {
          savePlans(data.plans);
          setPlans(data.plans);
        }
        if (data.snapshot) saveSnapshot(data.snapshot);
      })
      .finally(() => setLoading(false));
  }, [goalInputs, plans, loading, profile, goal]);

  if (!goalInputs || (!plan && loading) || (!plan && plans.length === 0)) {
    return (
      <main className="page fade-in">
        <h1 className="hero-title">Exit Mode</h1>
        <p className="subtitle">
          {goalInputs ? 'Generating your plans...' : 'Set your goal and generate plans to unlock Exit Mode.'}
        </p>
        {!goalInputs && (
          <button className="button" onClick={() => router.push('/goal')}>Go to goal setup</button>
        )}
      </main>
    );
  }

  const target = goalInputs.targetAmount;
  const current = goalInputs.currentBuffer;
  const remaining = Math.max(0, target - current);
  const progress = Math.round((current / Math.max(1, target)) * 100);

  const privateTarget = 1000;
  const privateCurrent = Math.min(current, privateTarget);
  const privateProgress = Math.round((privateCurrent / privateTarget) * 100);

  const behindAmount = plan.savedPerMonth > 0 && update && update.savedSoFar < plan.savedPerMonth
    ? Math.round(plan.savedPerMonth - update.savedSoFar)
    : 0;

  const timelineMonths = Math.min(plan.monthsToGoal ?? 6, 6);

  return (
    <main className="page fade-in">
      <div className="exit-grid">
        <section className="card exit-overview">
          <h2 className="section-title" style={{ marginTop: 0 }}>Your Exit Readiness</h2>
          <p className="subtitle">Target: ${target} · Current Buffer: ${current} · Remaining: ${remaining}</p>
          <div className="grid grid-2" style={{ marginTop: 16 }}>
            <div className="card" style={{ boxShadow: 'none' }}>
              <span className="pill">FAST</span>
              <h3 style={{ margin: '12px 0 0', fontFamily: 'Fraunces, serif' }}>
                {fastPlan?.monthsToGoal ?? '—'} months
              </h3>
            </div>
            <div className="card" style={{ boxShadow: 'none' }}>
              <span className="pill">STEADY</span>
              <h3 style={{ margin: '12px 0 0', fontFamily: 'Fraunces, serif' }}>
                {steadyPlan?.monthsToGoal ?? '—'} months
              </h3>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <ProgressBar value={progress} />
          </div>
        </section>

        <section>
          <h2 className="section-title">Plan Comparison</h2>
          <div className="exit-cards">
            {[fastPlan, steadyPlan].filter(Boolean).map((item) => (
              <div
                key={item!.planId}
                className={`card select-card ${active === item!.type ? 'active' : ''}`}
                onClick={() => setActive(item!.type)}
              >
                <span className="pill">{item!.type}</span>
                <h3 style={{ margin: '12px 0 6px', fontFamily: 'Fraunces, serif' }}>${item!.savedPerMonth} / month</h3>
                <p className="subtitle">Timeline: {item!.monthsToGoal ?? '—'} months</p>
                <p style={{ marginBottom: 0, color: 'var(--muted)' }}>
                  Focus: {item!.topChanges.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title">Monthly Action Timeline</h2>
          {behindAmount > 0 && (
            <div className="card" style={{ background: '#f3f7fa', borderColor: '#d5e2ee' }}>
              You’re ${behindAmount} behind this month. We adjusted your next steps to keep your timeline realistic.
            </div>
          )}
          <div className="timeline">
            {Array.from({ length: timelineMonths }).map((_, idx) => (
              <div key={idx} className="card timeline-card">
                <h4>Month {idx + 1}</h4>
                <ul className="list">
                  <li>Save ${plan.savedPerMonth}</li>
                  {monthTasks[idx]?.map((task) => (
                    <li key={task}>{task}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title">Where Your Savings Come From</h2>
          <details className="card">
            <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Category Change Breakdown</summary>
            <div className="delta-grid" style={{ marginTop: 16 }}>
              {plan.deltasByCategory.map((delta) => (
                <CategoryDeltaRow key={delta.category} delta={delta} />
              ))}
            </div>
          </details>
        </section>

        <section>
          <h2 className="section-title">This Week’s Exit Focus</h2>
          <div className="card">
            <ul className="list weekly-checklist">
              {plan.weeklyChecklist.map((item) => (
                <li key={item}>
                  <input type="checkbox" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <h2 className="section-title">Private Safety Buffer</h2>
          <div className="card">
            <p className="subtitle">Target: ${privateTarget} · Current: ${privateCurrent}</p>
            <ProgressBar value={privateProgress} />
            <p style={{ marginTop: 12, color: 'var(--muted)' }}>Stored separately to keep your plan grounded and private.</p>
          </div>
        </section>
      </div>

      <div className="sticky-footer">
        <div>
          <strong>Need Immediate Help?</strong>
          <div style={{ color: 'var(--muted)' }}>National Hotline · Local Resources · Quick Exit</div>
        </div>
        <button
          className="button secondary"
          onClick={() => {
            localStorage.clear();
            router.push('/');
          }}
        >
          Quick Exit
        </button>
      </div>
    </main>
  );
}
