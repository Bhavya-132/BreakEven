'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { demoGoal, demoGoalInputs, demoProfile } from '@/lib/demoData';
import { loadGoal, loadGoalInputs, loadProfile, loadTransactions, saveGoal, saveGoalInputs, savePlans, saveProfile, saveSnapshot } from '@/lib/storage';
import type { Goal, GoalType, DemoProfile, GoalInputs, RecurringBill, Subscription } from '@/lib/types';

const goalOptions: { type: GoalType; label: string; helper: string }[] = [
  { type: 'PRIVATE_BUFFER', label: 'Private buffer', helper: 'Build a personal safety buffer while staying aligned on shared bills.' },
  { type: 'EXIT_BUFFER', label: 'Exit buffer', helper: 'Cover deposit, moving costs, and emergency savings.' },
  { type: 'BALANCE', label: 'Fairness check', helper: 'Find a balanced split and adjust shared bills.' }
];

export default function GoalPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<DemoProfile>(demoProfile);
  const [goal, setGoal] = useState<Goal>(demoGoal);
  const [inputs, setInputs] = useState<GoalInputs>(demoGoalInputs);

  useEffect(() => {
    const storedProfile = loadProfile();
    const storedGoal = loadGoal();
    const storedInputs = loadGoalInputs();
    if (storedProfile) setProfile(storedProfile);
    if (storedGoal) setGoal(storedGoal);
    if (storedInputs) setInputs(storedInputs);
  }, []);

  const updateProfile = (patch: Partial<DemoProfile>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  };

  const handleSave = () => {
    saveProfile(profile);
    saveGoal(goal);
    saveGoalInputs(inputs);
    const transactions = loadTransactions();
    fetch('/api/v1/plan/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, goal, goalInputs: inputs, transactions })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.snapshot) saveSnapshot(data.snapshot);
        if (data.plans) savePlans(data.plans);
      })
      .finally(() => router.push('/mode'));
  };

  const updateBill = (index: number, patch: Partial<RecurringBill>) => {
    setInputs((prev) => {
      const recurringBills = [...prev.recurringBills];
      recurringBills[index] = { ...recurringBills[index], ...patch };
      return { ...prev, recurringBills };
    });
  };

  const updateSubscription = (index: number, patch: Partial<Subscription>) => {
    setInputs((prev) => {
      const subscriptions = [...prev.subscriptions];
      subscriptions[index] = { ...subscriptions[index], ...patch };
      return { ...prev, subscriptions };
    });
  };

  const removeBill = (index: number) => {
    setInputs((prev) => ({
      ...prev,
      recurringBills: prev.recurringBills.filter((_, i) => i !== index)
    }));
  };

  const removeSubscription = (index: number) => {
    setInputs((prev) => ({
      ...prev,
      subscriptions: prev.subscriptions.filter((_, i) => i !== index)
    }));
  };

  return (
    <main className="page fade-in">
      <h1 className="hero-title">Set your goal</h1>
      <p className="subtitle">Confirm income and recurring bills. Keep it light and editable.</p>

      <div className="goal-layout">
        <aside className="side-tabs">
          <a href="#income" className="active">Income</a>
          <a href="#goal">Goal</a>
          <a href="#bills">Bills</a>
          <a href="#subs">Subscriptions</a>
        </aside>
        <div className="goal-content">
          <section id="income">
            <div className="card">
          <h3 style={{ marginTop: 0 }}>Income + household</h3>
          <div style={{ display: 'grid', gap: 18 }}>
            <label style={{ display: 'grid', gap: 6 }}>
              Monthly income
              <input
                type="number"
                value={inputs.incomeMonthly}
                onChange={(e) => setInputs((prev) => ({ ...prev, incomeMonthly: Number(e.target.value) }))}
                style={{ padding: 10, borderRadius: 10, border: '1px solid var(--stroke)' }}
              />
            </label>
            <label style={{ display: 'grid', gap: 6 }}>
              Current buffer
              <input
                type="number"
                value={inputs.currentBuffer}
                onChange={(e) => setInputs((prev) => ({ ...prev, currentBuffer: Number(e.target.value) }))}
                style={{ padding: 10, borderRadius: 10, border: '1px solid var(--stroke)' }}
              />
            </label>
            <label style={{ display: 'grid', gap: 6 }}>
              Partner income (optional)
              <input
                type="number"
                value={profile.partnerIncome ?? 0}
                onChange={(e) => updateProfile({ partnerIncome: Number(e.target.value) || 0 })}
                style={{ padding: 10, borderRadius: 10, border: '1px solid var(--stroke)' }}
              />
            </label>
            <label style={{ display: 'grid', gap: 6 }}>
              People in household
              <input
                type="number"
                min={1}
                value={inputs.numPeople}
                onChange={(e) => setInputs((prev) => ({ ...prev, numPeople: Math.max(1, Number(e.target.value)) }))}
                style={{ padding: 10, borderRadius: 10, border: '1px solid var(--stroke)' }}
              />
            </label>
          </div>
            </div>
          </section>

          <section id="goal">
            <div className="card">
          <h3 style={{ marginTop: 0 }}>Goal details</h3>
          <div className="list" style={{ marginBottom: 20, gap: 16 }}>
            {goalOptions.map((option) => (
              <label key={option.type} style={{ display: 'grid', gap: 6, paddingBottom: 8, borderBottom: '1px dashed var(--stroke)' }}>
                <input
                  type="radio"
                  name="goalType"
                  checked={goal.type === option.type}
                  onChange={() => setGoal((prev) => ({ ...prev, type: option.type }))}
                />
                <strong>{option.label}</strong>
                <span className="subtitle" style={{ margin: 0 }}>{option.helper}</span>
              </label>
            ))}
          </div>
          <label style={{ display: 'grid', gap: 6 }}>
            Target amount
            <input
              type="number"
              value={inputs.targetAmount}
              onChange={(e) => {
                const value = Number(e.target.value);
                setGoal((prev) => ({ ...prev, targetAmount: value }));
                setInputs((prev) => ({ ...prev, targetAmount: value }));
              }}
              style={{ padding: 10, borderRadius: 10, border: '1px solid var(--stroke)' }}
            />
          </label>
            </div>
          </section>

          <section id="bills">
            <div className="card">
          <h3 style={{ marginTop: 0 }}>Recurring bills</h3>
          <div className="list" style={{ gap: 16 }}>
            {inputs.recurringBills.map((bill, index) => (
              <div key={`${bill.name}-${index}`} className="card" style={{ boxShadow: 'none' }}>
                <label style={{ display: 'grid', gap: 6, marginBottom: 12 }}>
                  Name
                  <input
                    value={bill.name}
                    onChange={(e) => updateBill(index, { name: e.target.value })}
                    style={{ padding: 8, borderRadius: 8, border: '1px solid var(--stroke)' }}
                  />
                </label>
                <label style={{ display: 'grid', gap: 6, marginBottom: 12 }}>
                  Amount
                  <input
                    type="number"
                    value={bill.amount}
                    onChange={(e) => updateBill(index, { amount: Number(e.target.value) })}
                    style={{ padding: 8, borderRadius: 8, border: '1px solid var(--stroke)' }}
                  />
                </label>
                <label style={{ display: 'grid', gap: 6, marginBottom: 12 }}>
                  Category
                  <select
                    value={bill.category}
                    onChange={(e) => updateBill(index, { category: e.target.value as RecurringBill['category'] })}
                    style={{ padding: 8, borderRadius: 8, border: '1px solid var(--stroke)' }}
                  >
                    <option value="HOUSING">Housing</option>
                    <option value="UTILITIES">Utilities</option>
                    <option value="DEBT">Debt</option>
                    <option value="INSURANCE">Insurance</option>
                    <option value="OTHER_FIXED">Other fixed</option>
                  </select>
                </label>
                <button className="button secondary" onClick={() => removeBill(index)}>Remove</button>
              </div>
            ))}
          </div>
          <button
            className="button secondary"
            style={{ marginTop: 12 }}
            onClick={() =>
              setInputs((prev) => ({
                ...prev,
                recurringBills: [...prev.recurringBills, { name: 'New bill', amount: 0, category: 'OTHER_FIXED' }]
              }))
            }
          >
            Add bill
          </button>
            </div>
          </section>

          <section id="subs">
            <div className="card">
          <h3 style={{ marginTop: 0 }}>Subscriptions</h3>
          <div className="list" style={{ gap: 16 }}>
            {inputs.subscriptions.map((sub, index) => (
              <div key={`${sub.name}-${index}`} className="card" style={{ boxShadow: 'none' }}>
                <label style={{ display: 'grid', gap: 6, marginBottom: 12 }}>
                  Name
                  <input
                    value={sub.name}
                    onChange={(e) => updateSubscription(index, { name: e.target.value })}
                    style={{ padding: 8, borderRadius: 8, border: '1px solid var(--stroke)' }}
                  />
                </label>
                <label style={{ display: 'grid', gap: 6, marginBottom: 12 }}>
                  Amount
                  <input
                    type="number"
                    value={sub.amount}
                    onChange={(e) => updateSubscription(index, { amount: Number(e.target.value) })}
                    style={{ padding: 8, borderRadius: 8, border: '1px solid var(--stroke)' }}
                  />
                </label>
                <button className="button secondary" onClick={() => removeSubscription(index)}>Remove</button>
              </div>
            ))}
          </div>
          <button
            className="button secondary"
            style={{ marginTop: 12 }}
            onClick={() =>
              setInputs((prev) => ({
                ...prev,
                subscriptions: [...prev.subscriptions, { name: 'New subscription', amount: 0 }]
              }))
            }
          >
            Add subscription
          </button>
            </div>
          </section>
        </div>
      </div>

      <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button className="button" onClick={handleSave}>Save and continue</button>
        <button className="button secondary" onClick={() => router.push('/dashboard')}>Skip to dashboard</button>
      </div>
    </main>
  );
}
