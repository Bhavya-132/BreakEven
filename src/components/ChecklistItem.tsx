export default function ChecklistItem({ text }: { text: string }) {
  return (
    <li style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ width: 10, height: 10, borderRadius: 999, background: 'var(--accent)' }} />
      <span>{text}</span>
    </li>
  );
}
