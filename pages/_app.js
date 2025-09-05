import '../styles/index.css';
import '../styles/syris-premium.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        /* CSS Fixes for Auto-selecting Button Issue */
        .assessment-container .answer-button {
          width: 100% !important;
          padding: var(--s3) !important;
          margin-bottom: var(--s2) !important;
          background: var(--white) !important;
          border: 1px solid var(--ink-10) !important;
          text-align: left !important;
          cursor: pointer !important;
          transition: all var(--duration) var(--ease) !important;
          font-size: 1rem !important;
          color: var(--ink-80) !important;
          display: flex !important;
          align-items: baseline !important;
        }

        .assessment-container .answer-button:hover:not(.selected) {
          border-color: var(--ink-20) !important;
          background: var(--ink-5) !important;
          color: var(--ink-80) !important;
        }

        .assessment-container .answer-button.selected {
          border-color: var(--ink) !important;
          background: var(--white) !important;
          color: var(--ink) !important;
        }

        .assessment-container .answer-label {
          font-family: var(--font-mono) !important;
          font-size: 0.875rem !important;
          font-weight: 400 !important;
          color: var(--ink-40) !important;
          margin-right: var(--s2) !important;
          min-width: 20px !important;
        }

        .assessment-container .answer-button.selected .answer-label {
          color: var(--ink) !important;
        }

        /* Remove any unwanted focus or active states */
        .assessment-container .answer-button:focus {
          outline: none !important;
        }

        .assessment-container .answer-button:active {
          transform: none !important;
        }

        /* Ensure no global button styles interfere */
        .assessment-container .answer-button:not(:hover):not(.selected) {
          background: var(--white) !important;
          border-color: var(--ink-10) !important;
          color: var(--ink-80) !important;
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}