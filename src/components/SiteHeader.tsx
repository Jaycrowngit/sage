"use client";

import Link from "next/link";
import { useState } from "react";
import { BrandLogo } from "./BrandLogo";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="site-header"
      onKeyDown={(event) => {
        if (event.key === "Escape") setMenuOpen(false);
      }}
    >
      <BrandLogo href="/#home" />
      <nav
        className={`main-nav${menuOpen ? " is-open" : ""}`}
        aria-label="Main navigation"
        id="site-navigation"
      >
        <Link href="/" onClick={() => setMenuOpen(false)}>
          Home
        </Link>
        <Link href="/sessions" onClick={() => setMenuOpen(false)}>
          Sessions
        </Link>
        <Link href="/approach" onClick={() => setMenuOpen(false)}>
          Our approach
        </Link>
        <Link href="/stories" onClick={() => setMenuOpen(false)}>
          Student testimonials
        </Link>
        <Link href="/founder" onClick={() => setMenuOpen(false)}>
          Our tutor
        </Link>
        <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
          Student Portal
        </Link>
      </nav>
      <Link className="header-cta" href="/register">
        Get started
      </Link>
      <button
        aria-controls="site-navigation"
        aria-expanded={menuOpen}
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        className={`menu-toggle${menuOpen ? " is-open" : ""}`}
        onClick={() => setMenuOpen((open) => !open)}
        type="button"
      >
        <span />
        <span />
        <span />
      </button>
      <button
        aria-label="Close navigation menu"
        className={`menu-backdrop${menuOpen ? " is-open" : ""}`}
        onClick={() => setMenuOpen(false)}
        tabIndex={menuOpen ? 0 : -1}
        type="button"
      />
    </header>
  );
}
