import { ArrowRight, Layers3, Sparkles } from "lucide-react";
import { SiteShell } from "@/components/site-shell";

export default function Home() {
  return (
    <SiteShell>
      <main>
        <section className="hero">
          <div className="eyebrow"><span>✦</span> A quiet space for reflection <span>✦</span></div>
          <p className="hero-kicker">LOOK INWARD. READ THE PATTERN.</p>
          <h1>Clarity, written<br />in the <em>cards.</em></h1>
          <p className="hero-copy">
            Ask what is on your mind, choose a classic spread, and receive a thoughtful interpretation shaped by your question and the cards you draw.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="/question">Begin a reading <ArrowRight size={17} /></a>
            <a className="text-link" href="/how-it-works">See how it works</a>
          </div>
          <div className="hero-deck" aria-hidden="true">
            <div className="mini-card mini-left"><span>☼</span></div>
            <div className="mini-card mini-center"><span>☾</span><i>XVIII</i></div>
            <div className="mini-card mini-right"><span>☆</span></div>
          </div>
        </section>

        <section className="feature-strip" aria-label="Reading features">
          <article><Sparkles /><div><strong>Personalized</strong><span>Your question shapes the interpretation.</span></div></article>
          <article><Layers3 /><div><strong>Two classic spreads</strong><span>Choose three cards or five.</span></div></article>
          <article><span className="feature-glyph">78</span><div><strong>Complete deck</strong><span>Major and Minor Arcana included.</span></div></article>
        </section>
      </main>
    </SiteShell>
  );
}
