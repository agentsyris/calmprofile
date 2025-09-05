import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function ThankYou() {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const shortId = useMemo(() => sessionId ? sessionId.substring(0, 8) : null, [sessionId]);

  return (
    <main style={{maxWidth: 720, margin: '0 auto', padding: '4rem 1.25rem', fontFamily: "'JetBrains Mono', monospace"}}>
      <div style={{textTransform: 'lowercase', fontSize: 12, letterSpacing: '0.06em', color: '#666', borderBottom: '1px solid #e5e5e5', paddingBottom: 10, marginBottom: 40}}>
        calm<span style={{color:'#00c9a7'}}>.</span>profile — <span style={{color: '#111'}}>confirmed{shortId ? ` [${shortId}]` : ''}</span>
      </div>
      <section style={{marginBottom: 32}}>
        <h1 style={{fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial', fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em', margin: '0 0 8px'}}>
          thank you<span style={{color:'#00c9a7'}}>.</span>
        </h1>
        <p style={{fontSize: 16, lineHeight: 1.7, color: '#111'}}>your calm<span style={{color:'#00c9a7'}}>.</span>profile is confirmed.</p>
        <p style={{fontSize: 14, color: '#666', marginTop: 12}}>12-page diagnostic report → 3–5 days<br/>30-min debrief → schedule below</p>
      </section>
      <section style={{border: '1px solid #eee', background: '#fafafa', minHeight: 320, display: 'grid', placeItems: 'center'}}>
        <div style={{textAlign: 'center'}}>
          <p>[ calendly scheduler ]</p>
          <a href="https://calendly.com/syris/30min" target="_blank" rel="noreferrer" style={{display:'inline-block', marginTop: 14, padding: '8px 14px', background:'#111', color:'#fff', textDecoration:'none'}}>
            schedule →
          </a>
        </div>
      </section>
      <footer style={{marginTop: 32, paddingTop: 16, borderTop: '1px solid #eee'}}>
        <div style={{fontSize: 14}}>syrıs<span style={{color:'#00c9a7'}}>.</span></div>
        <div style={{fontSize: 12, color:'#777', marginTop: 4}}>calm in the chaos of creative work</div>
        <div style={{marginTop: 16}}>
          <span style={{fontSize: 12, color:'#666', marginRight: 8}}>need help?</span>
          <a href="mailto:agent@syris.studio" style={{fontSize: 12, color:'#111', textDecoration:'none', borderBottom:'1px solid #eee'}}>agent@syris.studio</a>
        </div>
        <div style={{marginTop: 16}}>
          <Link to="/" style={{fontSize: 12, color:'#111', textDecoration:'none', borderBottom:'1px solid #eee'}}>← back to start</Link>
        </div>
      </footer>
    </main>
  );
}
