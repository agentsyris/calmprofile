import React, { useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";

export default function ThankYou() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const shortId = useMemo(
    () => (sessionId ? sessionId.substring(0, 8) : null),
    [sessionId]
  );

  return (
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "4rem 1.25rem",
        fontFamily: "'JetBrains Mono', monospace",
        background:
          "linear-gradient(135deg, #fafafa 0%, #f5f5f5 50%, #ffffff 100%)",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* Animated top border */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background:
            "linear-gradient(90deg, #00c9a7 0%, #00a88a 50%, #00c9a7 100%)",
          backgroundSize: "200% 100%",
          animation: "gradientFlow 3s ease-in-out infinite",
        }}
      />

      <div
        style={{
          textTransform: "lowercase",
          fontSize: 12,
          letterSpacing: "0.06em",
          color: "#666",
          borderBottom: "1px solid #e5e5e5",
          paddingBottom: 10,
          marginBottom: 40,
        }}
      >
        calm<span style={{ color: "#00c9a7" }}>.</span>profile —{" "}
        <span style={{ color: "#111" }}>
          confirmed{shortId ? ` [${shortId}]` : ""}
        </span>
      </div>

      <section
        style={{
          marginBottom: 32,
          background: "rgba(255, 255, 255, 0.8)",
          padding: "2rem",
          borderRadius: "12px",
          border: "1px solid rgba(0, 201, 167, 0.1)",
          boxShadow: "0 4px 20px rgba(10, 10, 10, 0.05)",
        }}
      >
        <h1
          style={{
            fontFamily:
              "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial",
            fontSize: 28,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            margin: "0 0 8px",
            background:
              "linear-gradient(135deg, #0a0a0a 0%, #333333 50%, #00c9a7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          thank you<span style={{ color: "#00c9a7" }}>.</span>
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: "#111" }}>
          your calm<span style={{ color: "#00c9a7" }}>.</span>profile is
          confirmed.
        </p>
        <p style={{ fontSize: 14, color: "#666", marginTop: 12 }}>
          12-page diagnostic report → 3–5 days
          <br />
          30-min debrief → schedule below
        </p>
      </section>

      <section
        style={{
          border: "1px solid rgba(0, 201, 167, 0.2)",
          background: "rgba(255, 255, 255, 0.9)",
          minHeight: 320,
          display: "grid",
          placeItems: "center",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(10, 10, 10, 0.05)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#666", fontSize: "14px" }}>
            [ calendly scheduler ]
          </p>
          <a
            href="https://calendly.com/syris/30min"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              marginTop: 14,
              padding: "12px 24px",
              background: "linear-gradient(135deg, #00c9a7 0%, #00a88a 100%)",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: "500",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 16px rgba(0, 201, 167, 0.3)",
            }}
          >
            schedule →
          </a>
        </div>
      </section>

      <footer
        style={{
          marginTop: 32,
          paddingTop: 16,
          borderTop: "1px solid #eee",
          background: "rgba(255, 255, 255, 0.6)",
          padding: "1.5rem",
          borderRadius: "8px",
        }}
      >
        <div style={{ fontSize: 14 }}>
          syrıs<span style={{ color: "#00c9a7" }}>.</span>
        </div>
        <div style={{ fontSize: 12, color: "#777", marginTop: 4 }}>
          calm in the chaos of creative work
        </div>
        <div style={{ marginTop: 16 }}>
          <span style={{ fontSize: 12, color: "#666", marginRight: 8 }}>
            need help?
          </span>
          <a
            href="mailto:agent@syris.studio"
            style={{
              fontSize: 12,
              color: "#111",
              textDecoration: "none",
              borderBottom: "1px solid #eee",
            }}
          >
            agent@syris.studio
          </a>
        </div>
        <div style={{ marginTop: 16 }}>
          <Link
            to="/"
            style={{
              fontSize: 12,
              color: "#111",
              textDecoration: "none",
              borderBottom: "1px solid #eee",
            }}
          >
            ← back to start
          </Link>
        </div>
      </footer>

      <style>{`
        @keyframes gradientFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </main>
  );
}
