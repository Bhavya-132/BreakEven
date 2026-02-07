import type { Mode } from '@/lib/types';

const modeDescriptions: Record<Mode, string> = {
  BALANCE: 'Check fairness and rebalance shared spending without conflict.',
  SEPARATE: 'Build a private buffer while staying aligned on shared bills.',
  EXIT: 'Plan a safe exit with a clear savings timeline and checklist.'
};

export default function ModeCard({
  mode,
  selected,
  onSelect
}: {
  mode: Mode;
  selected?: boolean;
  onSelect: (mode: Mode) => void;
}) {
  return (
    <button
      className="card"
      onClick={() => onSelect(mode)}
      style={{
        textAlign: 'left',
        borderColor: selected ? 'var(--accent)' : 'var(--stroke)'
      }}
    >
      <span className="pill">{mode}</span>
      <h3 style={{ marginTop: 16, marginBottom: 8, fontFamily: 'Fraunces, serif' }}>{mode.toLowerCase()}</h3>
      <p className="subtitle" style={{ marginBottom: 0 }}>{modeDescriptions[mode]}</p>
    </button>
  );
}
