export default function ProgressBar({ currentIndex = 0, total = 20 }) {
  const current = Math.min(currentIndex + 1, total);
  const pct = Math.round((current / total) * 100);

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ marginBottom: 6, fontWeight: 600 }}>
        {`question ${current} of ${total}`}
      </div>
      <div style={{ height: 6, background: '#eee' }}>
        <div style={{ height: '100%', width: `${pct}%` }} />
      </div>
    </div>
  );
}
