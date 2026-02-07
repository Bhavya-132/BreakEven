'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PlanCard from '@/components/PlanCard';
import ProgressBar from '@/components/ProgressBar';
import { loadGoal, loadGoalInputs, loadPlans, loadProfile, loadSnapshot, loadTransactions, savePlans, saveSnapshot } from '@/lib/storage';
import type { Plan } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const snapshot = loadSnapshot();
  const profile = loadProfile();
  const goal = loadGoal();
  const goalInputs = loadGoalInputs();

  useEffect(() => {
    setPlans(loadPlans());
  }, []);

  const generatePlans = async () => {
    if (!profile || !goal || !goalInputs) {
      router.push('/connect');
      return;
    }
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
  };

  if (!profile || !goal || !goalInputs) {
    return (
      <main className="page fade-in">
        <h1 className="hero-title">Dashboard</h1>
        <p className="subtitle">Connect demo data to generate your plan.</p>
        <button className="button" onClick={() => router.push('/connect')}>Connect demo data</button>
      </main>
    );
  }

  const progress = Math.round((goalInputs.currentBuffer / goal.targetAmount) * 100);

  return (
    <main className="page fade-in">
      <h1 className="hero-title">Dashboard</h1>

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
          <button className="button" onClick={generatePlans}>Generate plans</button>
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
