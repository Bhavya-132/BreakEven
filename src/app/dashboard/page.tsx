'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PlanCard from '@/components/PlanCard';
import ProgressBar from '@/components/ProgressBar';
import { loadGoal, loadGoalInputs, loadPlans, loadProfile, loadSnapshot, loadTransactions, savePlans, saveSnapshot } from '@/lib/storage';
import type { Plan } from '@/lib/types';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

function buildTrend(base: number) {
  const seed = Math.max(100, base || 300);
  return [seed * 0.7, seed * 0.75, seed * 0.72, seed * 0.8, seed * 0.78, seed * 1.05].map((v) =>
    Math.round(v)
  );
}

function toSvgPath(values: number[]) {
  const max = Math.max(...values, 1);
  const height = 120;
  const width = 320;
  const step = width / (values.length - 1);
  return values
    .map((v, i) => {
      const x = i * step;
      const y = height - (v / max) * height;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');
}

export default function DashboardPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const snapshot = loadSnapshot();
  const profile = loadProfile();
  const goal = loadGoal();
  const goalInputs = loadGoalInputs();

  useEffect(() => {
    setPlans(loadPlans());
  }, []);

  const generatePlans = async () => {
    if (!profile || !goal || !goalInputs) {
      router.push('/goal');
      return;
    }
    setLoading(true);
    const transactions = loadTransactions();
    const res = await fetch('/api/v1/plan/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, goal, goalInputs, transactions })
    });
    const data = await res.json();
    savePlans(data.plans);
    if (data.snapshot) saveSnapshot(data.snapshot);
    setPlans(data.plans);
    setLoading(false);
    router.push('/plan?type=FAST');
  };

  if (!profile || !goal || !goalInputs) {
    return (
      <main className="page fade-in">
        <h1 className="hero-title">Dashboard</h1>
        <p className="subtitle">Set your goal inputs to generate your plan.</p>
        <button className="button" onClick={() => router.push('/goal')}>Go to goal setup</button>
      </main>
    );
  }

  const progress = Math.round((goalInputs.currentBuffer / goal.targetAmount) * 100);

  return (
    <main className="page fade-in">
      <h1 className="hero-title">Dashboard</h1>

      {snapshot && (
        <section>
          <h2 className="section-title">Your financial snapshot</h2>
          <div className="grid grid-3">
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>Monthly income</strong>
                <span className="pill">INC</span>
              </div>
              <h3 style={{ margin: '12px 0 0', fontFamily: 'Fraunces, serif' }}>${snapshot.incomeMonthly}</h3>
            </div>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>Fixed expenses</strong>
                <span className="pill">FIX</span>
              </div>
              <h3 style={{ margin: '12px 0 0', fontFamily: 'Fraunces, serif' }}>${snapshot.fixedSpend}</h3>
            </div>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>Variable expenses</strong>
                <span className="pill">VAR</span>
              </div>
              <h3 style={{ margin: '12px 0 0', fontFamily: 'Fraunces, serif' }}>${snapshot.variableSpend}</h3>
            </div>
          </div>
          <div className="grid grid-2" style={{ marginTop: 20 }}>
            <div className="card">
              <strong>Monthly savings capacity</strong>
              <p className="subtitle">Current month savings capacity</p>
              <h3 style={{ margin: '12px 0 6px', fontFamily: 'Fraunces, serif' }}>${snapshot.baselineSavings}</h3>
              <p style={{ margin: 0, color: 'var(--muted)' }}>Deficit: ${snapshot.deficit}</p>
              <div style={{ marginTop: 16 }}>
                <p className="subtitle">Progress to target</p>
                <ProgressBar value={progress} />
              </div>
            </div>
            <div className="card">
              <strong>Savings trend</strong>
              <p className="subtitle">Last 6 months overview</p>
              {(() => {
                const values = buildTrend(snapshot.baselineSavings);
                const path = toSvgPath(values);
                const max = Math.max(...values, 1);
                return (
                  <svg width="100%" height="150" viewBox="0 0 320 140" style={{ marginTop: 12 }}>
                    <path d={path} fill="none" stroke="var(--accent-2)" strokeWidth="3" />
                    {values.map((v, i) => {
                      const x = (320 / (values.length - 1)) * i;
                      const y = 120 - (v / max) * 120;
                      return <circle key={i} cx={x} cy={y} r="4" fill="var(--accent-2)" />;
                    })}
                    {months.map((label, i) => (
                      <text key={label} x={(320 / (values.length - 1)) * i} y="135" textAnchor="middle" fontSize="10" fill="var(--muted)">
                        {label}
                      </text>
                    ))}
                  </svg>
                );
              })()}
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-2">
        <div className="card">
          <span className="pill">Goal</span>
          <h3 style={{ margin: '12px 0 6px', fontFamily: 'Fraunces, serif' }}>${goal.targetAmount}</h3>
          <p className="subtitle">Current buffer: ${goalInputs.currentBuffer}</p>
          <ProgressBar value={progress} />
        </div>
        <div className="card">
          <span className="pill">Next steps</span>
          <p className="subtitle">Generate fast + steady plans from your latest spending data.</p>
          <button className="button" onClick={generatePlans} disabled={loading}>
            {loading ? 'Generating...' : 'Generate plans'}
          </button>
        </div>
      </div>

      <section style={{ marginTop: 32 }}>
        <div className="card">
          <span className="pill">Mode focus</span>
          <h3 style={{ margin: '12px 0 6px', fontFamily: 'Fraunces, serif' }}>{profile.user.mode}</h3>
          <p className="subtitle" style={{ marginBottom: 12 }}>
            For Balance or Separate, keep a simple fairness snapshot up to date.
          </p>
          <button className="button secondary" onClick={() => router.push('/balance')}>Open balance view</button>
        </div>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2 className="section-title">Your plans</h2>
        <div className="grid grid-2">
          {plans.length === 0 ? (
            <div className="card">
              <p className="subtitle">No plans yet. Generate plans to see timelines and changes.</p>
            </div>
          ) : (
            plans.map((plan) => (
              <PlanCard
                key={plan.planId}
                plan={plan}
                onOpen={() => router.push(`/plan?type=${plan.type}`)}
              />
            ))
          )}
        </div>
      </section>

      {snapshot && (
        <section style={{ marginTop: 40 }}>
          <h2 className="section-title">Monthly snapshot</h2>
          <div className="grid grid-3">
            <div className="card">
              <span className="pill">Income</span>
              <h3 style={{ margin: '12px 0 6px', fontFamily: 'Fraunces, serif' }}>${snapshot.incomeMonthly}</h3>
              <p className="subtitle">Fixed + subscriptions: ${snapshot.fixedSpend + snapshot.subsSpend}</p>
            </div>
            <div className="card">
              <span className="pill">Variable spend</span>
              <h3 style={{ margin: '12px 0 6px', fontFamily: 'Fraunces, serif' }}>${snapshot.variableSpend}</h3>
              <p className="subtitle">Total spend: ${snapshot.totalSpend}</p>
            </div>
            <div className="card">
              <span className="pill">Baseline</span>
              <h3 style={{ margin: '12px 0 6px', fontFamily: 'Fraunces, serif' }}>${snapshot.baselineSavings}</h3>
              <p className="subtitle">Deficit: ${snapshot.deficit}</p>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
