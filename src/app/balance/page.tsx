'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { loadProfile, loadTransactions } from '@/lib/storage';

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export default function BalancePage() {
  const router = useRouter();
  const profile = loadProfile();
  const transactions = loadTransactions();

  const summary = useMemo(() => {
    if (!profile) return null;
    const userIncome = profile.monthlyIncome || 0;
    const partnerIncome = profile.partnerIncome || 0;
    const totalIncome = Math.max(1, userIncome + partnerIncome);
    const userShare = userIncome / totalIncome;
    const partnerShare = partnerIncome / totalIncome;
    const sharedBills = profile.monthlyBills || 0;

    const routingRule = `Pay ${formatPercent(userShare)} of shared bills from your account, ${formatPercent(partnerShare)} from partner.`;

    return {
      userShare,
      partnerShare,
      sharedBills,
      routingRule
    };
  }, [profile, transactions]);

  if (!profile || !summary) {
    return (
      <main className="page fade-in">
        <h1 className="hero-title">Balance & Separate</h1>
        <p className="subtitle">Connect your data to see a fairness snapshot.</p>
        <button className="button" onClick={() => router.push('/connect')}>Connect demo data</button>
      </main>
    );
  }

  return (
    <main className="page fade-in">
      <h1 className="hero-title">Balance & Separate</h1>
      <p className="subtitle">A quick fairness snapshot and suggested routing rule.</p>

      <div className="grid grid-2">
        <div className="card">
          <span className="pill">Split fairness</span>
          <h3 style={{ margin: '12px 0 6px', fontFamily: 'Fraunces, serif' }}>{formatPercent(summary.userShare)} / {formatPercent(summary.partnerShare)}</h3>
          <p className="subtitle">Based on income ratio. Shared bills: ${summary.sharedBills}</p>
        </div>
        <div className="card">
          <span className="pill">Suggested routing</span>
          <p className="subtitle" style={{ marginTop: 12 }}>{summary.routingRule}</p>
          <p style={{ margin: 0, color: 'var(--muted)' }}>Keep shared bills in an “ours” account and transfer the ratio on payday.</p>
        </div>
      </div>
    </main>
  );
}
