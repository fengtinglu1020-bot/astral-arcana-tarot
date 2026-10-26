"use client";

import { Menu, MoonStar, X } from "lucide-react";
import { useState } from "react";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="site-shell">
      <div className="star-field" aria-hidden="true" />
      <header className="site-header">
        <a className="brand" href="/" aria-label="Astral Arcana home">
          <span className="brand-mark"><MoonStar size={18} strokeWidth={1.5} /></span>
          <span>ASTRAL ARCANA</span>
        </a>
        <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav className={open ? "nav-links nav-open" : "nav-links"} aria-label="Main navigation">
          <a href="/question">New reading</a>
          <a href="/how-it-works">How it works</a>
        </nav>
      </header>
      {children}
      <footer className="site-footer">
        <p>Created by Tinglu Feng, Ella Zhou, and Nantong Fu</p>
        <p>For reflection and entertainment—not professional advice.</p>
      </footer>
    </div>
  );
}
