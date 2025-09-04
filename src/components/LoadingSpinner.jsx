import React from 'react'
export default function LoadingSpinner({ message }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 0' }}>
      <h2>analyzing your responses<span className="dot">.</span></h2>
      <p style={{ color: 'var(--gray-600)', marginTop: 20 }}>{message}</p>
      <div style={{ marginTop: 40 }}><div className="loading-spinner"/></div>
    </div>
  )
}
