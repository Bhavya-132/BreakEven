export default function ProgressBar({ value }: { value: number }) {
  return (
    <div className="progress" aria-label={`Progress ${value}%`}>
      <span style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
