import React, { useState, useEffect, useRef } from "react";
import "../styles/landing-v2.css";

/*
 * LandingPage.jsx - Main Landing Page with Refined Copy
 *
 * Testing Checklist:
 * - [ ] Renders without errors
 * - [ ] No horizontal scroll on mobile
 * - [ ] All CTAs trigger startAssessment
 * - [ ] Calculator math is correct
 * - [ ] Works in Safari, Chrome, Firefox
 * - [ ] No console errors
 * - [ ] Loads in under 2 seconds
 */

const LandingPage = () => {
  const [teamSize, setTeamSize] = useState(5);
  const [hoursLost, setHoursLost] = useState(8);
  const [hourlyRate, setHourlyRate] = useState(85);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [visibleSections, setVisibleSections] = useState(
    new Set(["hero", "stats", "process", "calculator", "cta"])
  );
  const [showCalculation, setShowCalculation] = useState(false);

  const heroRef = useRef(null);
  const sectionRefs = useRef({});

  // Create a startAssessment function that navigates to /assessment
  const startAssessment = () => {
    window.location.href = "/assessment";
  };

  const calculateCost = () => {
    return teamSize * hoursLost * hourlyRate * 52;
  };

  // Handle calculate button click
  const handleCalculate = () => {
    setShowCalculation(true);
  };

  // Scroll animations and sticky CTA
  useEffect(() => {
    const handleScroll = () => {
      // Check if hero is scrolled past
      if (heroRef.current) {
        const heroBottom =
          heroRef.current.offsetTop + heroRef.current.offsetHeight;
        setShowStickyCTA(window.scrollY > heroBottom);
      }

      // Keep all sections visible to avoid CSS conflicts
      const newVisibleSections = new Set([
        "hero",
        "stats",
        "process",
        "calculator",
        "cta",
      ]);
      setVisibleSections(newVisibleSections);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll for anchor links
  useEffect(() => {
    const handleClick = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (target) {
        e.preventDefault();
        const targetId = target.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Handle CTA clicks
  const handleCTAClick = (e) => {
    e.preventDefault();
    if (startAssessment) {
      startAssessment();
    }
  };

  return (
    <div className="landing-v2-container">
      {/* Header Section */}
      <div className="header-mark">
        <span className="header-text">calm</span>
        <span className="header-dot">.</span>
        <span className="header-text">profile</span>
        <div className="header-tagline">operational friction diagnostic</div>
      </div>

      {/* 1. Hero Section */}
      <section ref={heroRef} id="hero" className="hero-section">
        <h1 className="hero-headline">
          operational drag costs you 8 hours weekly.
        </h1>
        <h2 className="hero-subhead">
          context switching. tool sprawl. meeting creep. decision loops.
        </h2>
        <p className="hero-solution-text">
          start your calm.sys journey with a strategic assessment.
        </p>
        <button
          className="hero-cta-button"
          onClick={handleCTAClick}
          aria-label="Apply to work with syrıs"
        >
          apply to work with syrıs
        </button>
        <p className="hero-small-text">step 1: calm.profile assessment + strategy session ($495)</p>
      </section>

      {/* 2. Single Stats Line */}
      <section
        ref={(el) => {
          sectionRefs.current.stats = el;
        }}
        id="stats"
        className="stats-section"
      >
        <div className="stats-single-line">
          step 2: calm.stack implementation sprint ($2,950+) • step 3: calm.os transformation (by application)
        </div>
      </section>

      {/* 3. The Method */}
      <section
        ref={(el) => {
          sectionRefs.current.process = el;
        }}
        id="process"
        className="process-section"
      >
        <h3 className="process-title">your calm.sys journey</h3>
        <div className="process-steps">
          <div className="process-step">
            <div className="step-number">1</div>
            <div className="step-text">qualify with calm.profile ($495)<br/>strategic assessment • workstyle analysis • 30-min strategy session</div>
          </div>
          <div className="process-step">
            <div className="step-number">2</div>
            <div className="step-text">implement with calm.stack ($2,950)<br/>2-week sprint • immediate fixes • credit $495 toward cost</div>
          </div>
          <div className="process-step">
            <div className="step-number">3</div>
            <div className="step-text">transform with calm.os ($15k+)<br/>full operational overhaul • 3-month engagement • enterprise-wide impact</div>
          </div>
        </div>
      </section>

      {/* 3.5. Qualifier Section */}
      <section className="qualifier-section">
        <h3 className="qualifier-title">is syrıs right for you?</h3>
        <div className="qualifier-content">
          <p className="qualifier-intro">we work with creative teams who:</p>
          <ul className="qualifier-list">
            <li>have 5-50 employees</li>
            <li>lose 10+ hours/week to operational chaos</li>
            <li>are ready to invest in systematic change</li>
            <li>value expertise over tools</li>
          </ul>
          <p className="qualifier-note">calm.profile helps us determine mutual fit.</p>
        </div>
      </section>

      {/* 4. Simple Calculator */}
      <section
        ref={(el) => {
          sectionRefs.current.calculator = el;
        }}
        id="calculator"
        className="calculator-section"
      >
        <h3 className="calculator-title">investment structure</h3>
        <div className="investment-structure">
          <div className="investment-item">
            <div className="investment-name">calm.profile</div>
            <div className="investment-price">$495</div>
            <div className="investment-note">(credited toward calm.stack)</div>
          </div>
          <div className="investment-item">
            <div className="investment-name">calm.stack</div>
            <div className="investment-price">$2,950</div>
            <div className="investment-note">(includes profile credit)</div>
          </div>
          <div className="investment-item">
            <div className="investment-name">calm.os</div>
            <div className="investment-price">custom pricing</div>
            <div className="investment-note">(by application)</div>
          </div>
        </div>
        <p className="investment-cta">start with calm.profile to explore working together.</p>
      </section>

      {/* 5. Sample Report Link and Guarantee */}
      <section
        ref={(el) => {
          sectionRefs.current.cta = el;
        }}
        id="cta"
        className="cta-section"
      >
        <a href="/sample-report" className="sample-report-link">
          see how we analyze operations
        </a>
        <p className="sample-note">(this is step 1 of 3 in the calm.sys methodology)</p>
      </section>

      {/* Sticky CTA */}
      <div className={`sticky-cta ${showStickyCTA ? "" : "hidden"}`}>
        <button
          className="sticky-button"
          onClick={handleCTAClick}
          aria-label="Apply to work with syrıs"
        >
          apply to work with syrıs
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
