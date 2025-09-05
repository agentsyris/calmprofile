import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>calm.profile – syrıs.</title>
        <meta name="description" content="systematic calm for modern teams. 20 questions. quantified insights. $48k annual roi." />
        <meta property="og:title" content="calm.profile - workstyle assessment" />
        <meta property="og:description" content="average outcome: 12.5 hours saved/week · $48k annual roi" />
        <meta property="og:type" content="website" />
      </Head>
      
      <div className="intro-container">
        <div className="intro-card">
          <span className="hierarchy-badge">calm.profile → calm.stack → calm.os</span>
          
          <h1 className="brand-title">
            syr<span className="dotless-i">ı</span>s<span className="brand-dot">.</span>
          </h1>
          
          <p className="brand-subtitle">
            systematic calm for modern teams
          </p>
          
          <div className="intro-metric">
            average outcome: <strong>12.5 hours saved/week</strong> · <strong>$48k annual roi</strong>
          </div>
          
          <p style={{ marginBottom: '48px', color: 'var(--ink-60)' }}>
            20 questions. 3 minutes. quantified insights into your workstyle archetype.
          </p>
          
          <Link href="/assessment" className="cta-button">
            begin assessment
          </Link>
        </div>
      </div>
    </>
  );
}

// Static generation for SEO
export async function getStaticProps() {
  return {
    props: {
      title: 'calm.profile - syrıs.',
      description: 'systematic calm for modern teams. 20 questions. $48k annual roi.'
    }
  };
}