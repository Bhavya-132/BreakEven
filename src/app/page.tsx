import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="page fade-in">
      <div className="hero">
        <div>
          <span className="pill">Relationship finance toolkit</span>
          <h1 className="hero-title">Plan a fairer split. Build a private buffer. Leave with clarity.</h1>
          <p className="subtitle">
            BreakEven turns shared spending into two actionable plans: a fast path and a steady path, with clear steps.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link className="button" href="/connect">Start with demo data</Link>
            <Link className="button secondary" href="/mode">Explore modes</Link>
          </div>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0, fontFamily: 'Fraunces, serif' }}>What you get</h3>
          <ul className="list">
            <li>Fast + Steady savings plans with a timeline</li>
            <li>Category-by-category guidance with plain-English explanations</li>
            <li>Weekly checklist so you always know the next move</li>
          </ul>
        </div>
      </div>

      <section style={{ marginTop: 60 }}>
        <h2 className="section-title">Designed for privacy and control</h2>
        <div className="grid grid-3">
          <div className="card">
            <h4 style={{ marginTop: 0 }}>Balance</h4>
            <p className="subtitle">See if the split is fair and rebalance without blame.</p>
          </div>
          <div className="card">
            <h4 style={{ marginTop: 0 }}>Separate</h4>
            <p className="subtitle">Build a personal buffer while staying aligned on shared bills.</p>
          </div>
          <div className="card">
            <h4 style={{ marginTop: 0 }}>Exit</h4>
            <p className="subtitle">Plan a safe exit timeline with a calm, clear checklist.</p>
          </div>
        </div>
      </section>

      <section style={{ marginTop: 60 }}>
        <h2 className="section-title">Safety & awareness</h2>
        <div className="grid grid-3">
          <div className="card">
            <h4 style={{ marginTop: 0 }}>Why this matters</h4>
            <p className="subtitle">
              Globally, about 1 in 3 women experience physical and/or sexual violence in their lifetime.
            </p>
          </div>
          <div className="card">
            <h4 style={{ marginTop: 0 }}>Support is real</h4>
            <p className="subtitle">
              The National Domestic Violence Hotline receives more than 24,000 calls every month.
            </p>
          </div>
          <div className="card">
            <h4 style={{ marginTop: 0 }}>How BreakEven helps</h4>
            <p className="subtitle">
              If you’re working toward fairness or planning a safe exit, BreakEven turns spending into clear steps and a timeline.
            </p>
          </div>
        </div>
        <div className="notice" style={{ marginTop: 16 }}>
          If you’re in immediate danger, contact local emergency services or a trusted support resource in your area.
        </div>
      </section>

      <section style={{ marginTop: 60 }}>
        <h2 className="section-title">Clean user flow</h2>
        <div className="grid grid-2">
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Step-by-step</h3>
            <ul className="list">
              <li>Connect or load demo spending</li>
              <li>Confirm income + recurring bills</li>
              <li>Pick a mode and set your goal</li>
              <li>Generate Fast + Steady plans</li>
              <li>Follow the weekly checklist</li>
            </ul>
          </div>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Plan generator</h3>
            <p className="subtitle">
              We compute average monthly spending, apply clear cut rules, and return timelines plus category deltas.
            </p>
            <p style={{ margin: 0, color: 'var(--muted)' }}>
              AI is used only for explanations and checklist phrasing, never for the math.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
