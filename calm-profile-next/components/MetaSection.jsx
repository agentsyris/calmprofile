import React from 'react'
export default function MetaSection({ metadata, onUpdateMetadata, onSubmit, onPrevious, isValid }) {
  return (
    <section className="meta-section active">
      <h2>organizational context</h2>
      <div className="meta-question">
        <label className="meta-label" htmlFor="teamSize">team size</label>
        <select className="meta-select" id="teamSize" value={metadata.team_size} onChange={(e)=>onUpdateMetadata('team_size', e.target.value)} required>
          <option value="">select</option>
          <option value="solo">solo practitioner</option><option value="2-5">2-5 people</option><option value="6-15">6-15 people</option><option value="16-50">16-50 people</option><option value="50+">50+ people</option>
        </select>
      </div>
      <div className="meta-question">
        <label className="meta-label" htmlFor="meetings">weekly meeting load</label>
        <select className="meta-select" id="meetings" value={metadata.meetings} onChange={(e)=>onUpdateMetadata('meetings', e.target.value)} required>
          <option value="">select</option>
          <option value="0-2">minimal (0-2)</option><option value="3-6">light (3-6)</option><option value="7-10">moderate (7-10)</option><option value="11-15">heavy (11-15)</option><option value="16+">extreme (16+)</option>
        </select>
      </div>
      <div className="meta-question">
        <label className="meta-label" htmlFor="platform">primary ecosystem</label>
        <select className="meta-select" id="platform" value={metadata.platform} onChange={(e)=>onUpdateMetadata('platform', e.target.value)} required>
          <option value="">select</option>
          <option value="microsoft">microsoft 365</option><option value="google">google workspace</option><option value="slack">slack ecosystem</option><option value="other">custom stack</option>
        </select>
      </div>
      <div className="nav-buttons">
        <button className="btn btn-secondary" onClick={onPrevious}>← back</button>
        <button className="btn" onClick={onSubmit} disabled={!isValid}>calculate →</button>
      </div>
    </section>
  )
}
