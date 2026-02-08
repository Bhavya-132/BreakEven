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
            <Link className="button" href="/goal">Start planning</Link>
            <Link className="button secondary" href="/plan?type=FAST#update">Update progress</Link>
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
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h2 className="section-title" style={{ fontSize: '2rem' }}>Safety & Awareness</h2>
          <p className="subtitle">Understanding the context behind financial planning</p>
        </div>
        <div className="grid grid-3">
          <div className="card soft-card">
            <span className="icon-pill icon-warn">!</span>
            <h4 style={{ marginTop: 16 }}>Why This Matters</h4>
            <p className="subtitle">
              Financial control is often a hidden form of power imbalance. Having your own plan, buffer, and clarity creates options and safety.
            </p>
          </div>
          <div className="card soft-card">
            <span className="icon-pill icon-heart">♥</span>
            <h4 style={{ marginTop: 16 }}>Support is Real</h4>
            <p className="subtitle">
              You’re not alone. Organizations, hotlines, and advocates exist to help. BreakEven is a tool, not a replacement for human support.
            </p>
          </div>
          <div className="card soft-card">
            <span className="icon-pill icon-shield">🛡</span>
            <h4 style={{ marginTop: 16 }}>How BreakEven Helps</h4>
            <p className="subtitle">
              We provide clarity, privacy, and actionable steps. No judgment. No tracking. Just tools to help you make informed decisions.
            </p>
          </div>
        </div>
        <div className="card alert-card" style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <span className="icon-pill icon-heart" style={{ background: '#ffe2e2', color: '#c83e3e' }}>☎</span>
            <div>
              <h4 style={{ margin: '4px 0 8px' }}>If you’re in immediate danger</h4>
              <p className="subtitle" style={{ marginBottom: 8 }}>
                Please reach out to local emergency services or a trusted support organization.
              </p>
              <p style={{ margin: '0 0 6px' }}>
                <strong>National Domestic Violence Hotline:</strong> 1-800-799-7233
              </p>
              <p className="subtitle" style={{ margin: 0 }}>Available 24/7 for confidential support.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
