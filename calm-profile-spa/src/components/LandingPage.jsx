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
  const [pulseAnimation, setPulseAnimation] = useState(false);

  const heroRef = useRef(null);
  const sectionRefs = useRef({});

  // Create a startAssessment function that navigates to /assessment
  const startAssessment = () => {
    window.location.href = "/assessment";
  };

  const calculateCost = () => {
    return teamSize * hoursLost * hourlyRate * 52;
  };

  // Pulse animation when calculator updates
  useEffect(() => {
    setPulseAnimation(true);
    const timer = setTimeout(() => setPulseAnimation(false), 600);
    return () => clearTimeout(timer);
  }, [teamSize, hoursLost, hourlyRate]);

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
      {/* 1. Hero Section */}
      <section ref={heroRef} id="hero" className="hero-section">
        <h1 className="hero-headline">
          operational drag costs you 8 hours weekly.
        </h1>
        <h2 className="hero-subhead">
          context switching. tool sprawl. meeting creep. decision loops.
        </h2>
        <p className="hero-solution-text">
          calm.profile maps your exact friction points—and the fix.
        </p>
        <button
          className="hero-cta-button"
          onClick={handleCTAClick}
          aria-label="Take the assessment"
        >
          take the assessment
        </button>
        <p className="hero-small-text">12 minutes. 24 questions. zero fluff.</p>
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
          founders save: 8 hrs/week · 34% overhead cut · $2,400/month recovered
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
        <h3 className="process-title">the method</h3>
        <div className="process-steps">
          <div className="process-step">
            <div className="step-number">1</div>
            <div className="step-text">
              baseline assessment (12 min)
            </div>
          </div>
          <div className="process-step">
            <div className="step-number">2</div>
            <div className="step-text">
              friction map delivered instantly
            </div>
          </div>
          <div className="process-step">
            <div className="step-number">3</div>
            <div className="step-text">
              implementation blueprint ($495)
            </div>
          </div>
          <div className="process-step">
            <div className="step-number">4</div>
            <div className="step-text">
              30-min architect call included
            </div>
          </div>
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
        <h3 className="calculator-title">your annual friction cost</h3>
        <div className="calculator-inputs">
          <div className="input-group">
            <label className="input-label" htmlFor="team-size">
              team size
            </label>
            <input
              id="team-size"
              type="number"
              value={teamSize}
              onChange={(e) => setTeamSize(parseInt(e.target.value) || 0)}
              min="1"
              max="50"
              className="input-field"
              aria-label="Team size"
            />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="hours-lost">
              hours lost
            </label>
            <input
              id="hours-lost"
              type="number"
              value={hoursLost}
              onChange={(e) => setHoursLost(parseInt(e.target.value) || 0)}
              min="1"
              max="40"
              className="input-field"
              aria-label="Hours lost per week"
            />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="hourly-rate">
              hourly rate
            </label>
            <input
              id="hourly-rate"
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(parseInt(e.target.value) || 0)}
              min="20"
              max="200"
              className="input-field"
              aria-label="Hourly rate in dollars"
            />
          </div>
        </div>
        <div className={`calculation-result ${pulseAnimation ? "pulse" : ""}`}>
          <div className="calculation-formula">
            {teamSize} × {hoursLost} × ${hourlyRate} × 52 weeks =
          </div>
          <div className="total-cost">
            ${calculateCost().toLocaleString()}/year in lost productivity
          </div>
        </div>
      </section>

      {/* 5. Sample Report Link and Guarantee */}
      <section
        ref={(el) => {
          sectionRefs.current.cta = el;
        }}
        id="cta"
        className="cta-section"
      >
        <a href="#sample-report" className="sample-report-link">
          see sample report
        </a>

        <p className="guarantee-text">
          full refund if roi &lt; 5x in 90 days. no questions.
        </p>
      </section>

      {/* Sticky CTA */}
      <div className={`sticky-cta ${showStickyCTA ? "" : "hidden"}`}>
        <button
          className="sticky-button"
          onClick={handleCTAClick}
          aria-label="Start free assessment"
        >
          start free assessment
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
