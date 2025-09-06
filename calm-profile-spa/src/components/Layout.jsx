import React from "react";
export default function Layout({ children }) {
  return (
    <>
      <nav>
        <div className="nav-container">
          <a href="/" className="logo-link">
            <img src="/syris-logo.svg" alt="syrıs." className="nav-logo" />
          </a>
        </div>
      </nav>
      {children}
      <footer>
        <div className="footer-content">
          syrıs<span className="dot">.</span> – systematic solutions for modern
          chaos
        </div>
      </footer>
    </>
  );
}
