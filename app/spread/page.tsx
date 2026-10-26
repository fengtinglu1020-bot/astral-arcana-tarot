"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { ReadingProgress } from "@/components/reading-progress";
import { loadQuestion, saveSpread } from "@/lib/reading-storage";

const spreads = [
  { count: 3 as const, name: "Three-card path", subtitle: "A concise view across time", positions: ["Past", "Present", "Future"] },
  { count: 5 as const, name: "Five-card compass", subtitle: "A deeper view of the situation", positions: ["Situation", "Challenge", "Inner voice", "Guidance", "Outcome"] },
];

export default function SpreadPage() {
  const [selected, setSelected] = useState<3 | 5 | null>(null);
  useEffect(() => { if (!loadQuestion()) window.location.replace("/question"); }, []);

  function continueReading() {
    if (!selected) return;
    saveSpread(selected);
    window.location.assign("/draw");
  }

  return (
    <SiteShell>
      <main className="flow-page">
        <ReadingProgress current={2} />
        <section className="flow-panel">
          <div className="eyebrow"><span>✦</span> Step two <span>✦</span></div>
          <h1>Choose the shape<br />of your <em>reading.</em></h1>
          <p className="section-lead">Each position gives a card a different role in the story.</p>
          <div className="spread-grid">
            {spreads.map((spread) => (
              <button
                key={spread.count}
                className={selected === spread.count ? "spread-option selected" : "spread-option"}
                onClick={() => setSelected(spread.count)}
                aria-pressed={selected === spread.count}
              >
                <span className="spread-count">{spread.count}</span>
                <h2>{spread.name}</h2>
                <p>{spread.subtitle}</p>
                <div className={`spread-preview cards-${spread.count}`} aria-hidden="true">
                  {spread.positions.map((position, index) => <i key={position} style={{ "--i": index } as React.CSSProperties}><b>☾</b></i>)}
                </div>
                <ol>{spread.positions.map((position) => <li key={position}>{position}</li>)}</ol>
              </button>
            ))}
          </div>
          <button className="button button-primary button-centered" disabled={!selected} onClick={continueReading}>
            Continue to the deck <ArrowRight size={17} />
          </button>
        </section>
      </main>
    </SiteShell>
  );
}
