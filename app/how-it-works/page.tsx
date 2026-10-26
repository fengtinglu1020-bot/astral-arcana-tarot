import { ArrowRight, BrainCircuit, CircleHelp, Layers3, Sparkles } from "lucide-react";
import { SiteShell } from "@/components/site-shell";

const steps = [
  { number: "01", title: "Ask a question", copy: "Write an open-ended question about a situation you want to understand. The text stays in your current browser session.", icon: CircleHelp },
  { number: "02", title: "Choose a spread", copy: "Use three cards for a concise past–present–future view, or five cards for a deeper situational reading.", icon: Layers3 },
  { number: "03", title: "Draw the cards", copy: "Cards are selected without replacement from a complete 78-card deck. A small chance of reversal adds nuance.", icon: Sparkles },
  { number: "04", title: "Read the pattern", copy: "The interpretation connects your question, each card’s orientation, and the role of its spread position.", icon: BrainCircuit },
];

export default function HowItWorksPage() {
  return (
    <SiteShell>
      <main className="info-page">
        <section className="info-hero">
          <div className="eyebrow"><span>✦</span> Behind the reading <span>✦</span></div>
          <h1>A simple ritual,<br /><em>clearly explained.</em></h1>
          <p className="section-lead">The experience combines classic tarot structure with a modern, personalized interpretation.</p>
        </section>
        <section className="how-grid">
          {steps.map(({ number, title, copy, icon: Icon }) => (
            <article key={number}>
              <div className="how-icon"><Icon size={22} strokeWidth={1.4} /></div>
              <span>{number}</span>
              <h2>{title}</h2>
              <p>{copy}</p>
            </article>
          ))}
        </section>
        <section className="ethics-panel">
          <div><span className="feature-glyph">✦</span><h2>Designed for reflection</h2></div>
          <p>Astral Arcana does not claim to predict the future. It reframes symbols as prompts for reflection and avoids giving medical, legal, financial, or crisis advice.</p>
        </section>
        <a className="button button-primary button-centered" href="/question">Begin a reading <ArrowRight size={17} /></a>
      </main>
    </SiteShell>
  );
}
