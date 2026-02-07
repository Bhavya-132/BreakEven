'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ModeCard from '@/components/ModeCard';
import type { Mode } from '@/lib/types';
import { loadProfile, saveMode, saveProfile } from '@/lib/storage';

const modes: Mode[] = ['BALANCE', 'SEPARATE', 'EXIT'];

export default function ModePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Mode>('SEPARATE');

  const handleNext = () => {
    saveMode(selected);
    const profile = loadProfile();
    if (profile) {
      profile.user.mode = selected;
      saveProfile(profile);
    }
    router.push('/dashboard');
  };

  return (
    <main className="page fade-in">
      <h1 className="hero-title">Choose your mode</h1>
      <p className="subtitle">Pick the focus that matches your current situation.</p>

      <div className="grid grid-3">
        {modes.map((mode) => (
          <ModeCard key={mode} mode={mode} selected={selected === mode} onSelect={setSelected} />
        ))}
      </div>

      <div style={{ marginTop: 24 }}>
        <button className="button" onClick={handleNext}>Continue</button>
      </div>
    </main>
  );
}
