'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CategoryDeltaRow from '@/components/CategoryDeltaRow';
import ChecklistItem from '@/components/ChecklistItem';
import ProgressBar from '@/components/ProgressBar';
import { loadGoalInputs, loadPlanContextKey, loadPlanUpdate, loadPlans, loadProfile, loadGoal, loadTransactions, savePlanContextKey, savePlanUpdate, savePlans, saveSnapshot } from '@/lib/storage';
import type { Plan, PlanType, PlanUpdate } from '@/lib/types';

export default function PlanPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const defaultType = (searchParams.get('type') as PlanType) || 'FAST';
  const [active, setActive] = useState<PlanType>(defaultType);
  const goalInputs = loadGoalInputs();

  const plans = useMemo(() => loadPlans(), []);
  const plan = plans.find((item) => item.type === active) as Plan | undefined;
  const profile = loadProfile();
  const goal = loadGoal();
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState<PlanUpdate>(() => {
    return (
      loadPlanUpdate(active) || {
        planType: active,
        cadence: 'WEEKLY',
        lastUpdate: '',
        savedSoFar: 0
      }
    );
  });
  const [periodSaved, setPeriodSaved] = useState('');

  useEffect(() => {
    const stored = loadPlanUpdate(active);
    setUpdate(
      stored || {
        planType: active,
        cadence: 'WEEKLY',
        lastUpdate: '',
        savedSoFar: 0
      }
    );
  }, [active]);

  useEffect(() => {
    if (!goalInputs || loading || !profile || !goal) return;
    const planKey = JSON.stringify(goalInputs);
    const storedKey = loadPlanContextKey();
    if (storedKey === planKey && plans.length > 0) return;
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
        if (data.plans) savePlans(data.plans);
        if (data.snapshot) saveSnapshot(data.snapshot);
        savePlanContextKey(planKey);
      })
      .finally(() => setLoading(false));
  }, [goalInputs, plans.length, loading, profile, goal]);

  const handleSaveUpdate = () => {
    const amount = periodSaved === '' ? 0 : Number(periodSaved);
    const total = Math.max(0, update.savedSoFar + amount);
    const nextUpdate = {
      planType: active,
      cadence: update.cadence,
      lastUpdate: new Date().toISOString(),
      savedSoFar: total
    };
    savePlanUpdate(nextUpdate);
    setUpdate(nextUpdate);
    setPeriodSaved('');
  };

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

      <section id="update" style={{ marginTop: 32 }}>
        <h2 className="section-title">Update progress</h2>
        <div className="card">
          <div style={{ display: 'grid', gap: 16 }}>
            <label style={{ display: 'grid', gap: 6 }}>
              Update cadence
              <select
                value={update.cadence}
                onChange={(e) => setUpdate((prev) => ({ ...prev, cadence: e.target.value as PlanUpdate['cadence'] }))}
                style={{ padding: 10, borderRadius: 10, border: '1px solid var(--stroke)' }}
              >
                <option value="WEEKLY">Weekly</option>
                <option value="BIWEEKLY">Biweekly</option>
              </select>
            </label>
            <label style={{ display: 'grid', gap: 6 }}>
              Amount saved since last check-in
              <input
                type="number"
                value={periodSaved}
                onChange={(e) => setPeriodSaved(e.target.value)}
                style={{ padding: 10, borderRadius: 10, border: '1px solid var(--stroke)' }}
              />
            </label>
            <button className="button" onClick={handleSaveUpdate}>Save update</button>
          </div>
          <div style={{ marginTop: 20 }}>
            <p className="subtitle" style={{ marginBottom: 8 }}>
              Total saved so far: ${update.savedSoFar}
            </p>
            {goalInputs && (
              <>
                <ProgressBar value={(update.savedSoFar / goalInputs.targetAmount) * 100} />
                <p className="subtitle" style={{ marginTop: 8, marginBottom: 0 }}>
                  Target: ${goalInputs.targetAmount}
                </p>
              </>
            )}
            {update.lastUpdate && (
              <p style={{ marginTop: 8, color: 'var(--muted)' }}>
                Last update: {new Date(update.lastUpdate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
