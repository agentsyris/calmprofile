import React from 'react'
export default function IntroSection({ onStart }) {
  return (
    <section className="intro">
      <h1>calm<span className="dot">.</span>profile</h1>
      <p className="intro-sub">behavior-based operational assessment.<br/>identify your workstyle. reduce friction. ship faster.</p>
      <div className="intro-meta">20 behavioral choices · 5 minutes · immediate insights</div>
      <button className="btn" onClick={onStart}>begin assessment →</button>
    </section>
  )
}
