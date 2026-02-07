'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { demoGoal, demoGoalInputs } from '@/lib/demoData';
import { saveGoal, saveGoalInputs, saveProfile, saveTransactions } from '@/lib/storage';

export default function ConnectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDemo = async () => {
    setLoading(true);
    const res = await fetch('/api/v1/nessie/connect', { method: 'POST' });
    const data = await res.json();
    saveProfile(data.profile);
    saveTransactions(data.transactions);
    saveGoal(demoGoal);
    saveGoalInputs(demoGoalInputs);
    router.push('/goal');
  };

  return (
    <main className="page fade-in">
      <h1 className="hero-title">Connect your data</h1>
      <p className="subtitle">Use simulated Nessie data or enter a demo dataset instantly.</p>

      <div className="grid grid-2">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Connect Nessie (Demo)</h3>
          <p className="subtitle">We load secure, simulated accounts and transactions.</p>
          <button className="button" onClick={handleDemo} disabled={loading}>
            {loading ? 'Loading demo...' : 'Load demo dataset'}
          </button>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Manual setup</h3>
          <p className="subtitle">Keep it simple: add your income and recurring bills later.</p>
          <button className="button secondary" onClick={() => router.push('/goal')}>Skip for now</button>
        </div>
      </div>
    </main>
  );
}
