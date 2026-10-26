"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, RefreshCw, Sparkles } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { ReadingProgress } from "@/components/reading-progress";
import { TarotCardView } from "@/components/tarot-card";
import type { DrawnCard } from "@/lib/tarot-data";
import { clearReading, loadCards, loadQuestion } from "@/lib/reading-storage";

type ReadingResponse = { reading: string; mode: "ai" | "local" };

export default function ReadingPage() {
  const started = useRef(false);
  const [question, setQuestion] = useState("");
  const [cards, setCards] = useState<DrawnCard[]>([]);
  const [reading, setReading] = useState("");
  const [mode, setMode] = useState<"ai" | "local">("local");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const requestReading = useCallback(async (nextQuestion: string, nextCards: DrawnCard[]) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: nextQuestion, cards: nextCards }),
      });
      if (!response.ok) throw new Error("The interpretation could not be created.");
      const data = await response.json() as ReadingResponse;
      setReading(data.reading);
      setMode(data.mode);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const nextQuestion = loadQuestion();
    const nextCards = loadCards();
    if (!nextQuestion || !nextCards.length) { window.location.replace("/question"); return; }
    setQuestion(nextQuestion);
    setCards(nextCards);
    requestReading(nextQuestion, nextCards);
  }, [requestReading]);

  function startOver() {
    clearReading();
    window.location.assign("/question");
  }

  return (
    <SiteShell>
      <main className="flow-page reading-page">
        <ReadingProgress current={4} />
        <section className="flow-panel wide-panel">
          <div className="eyebrow"><span>✦</span> Your reading <span>✦</span></div>
          <h1>The cards reflect<br /><em>a path forward.</em></h1>
          <blockquote className="question-quote">“{question}”</blockquote>

          <div className={`reading-cards reading-cards-${cards.length}`}>
            {cards.map((card, index) => (
              <div className="reading-card-item" key={card.id}>
                <span className="position-label">{card.position}</span>
                <TarotCardView card={card} index={index} />
                <p>{card.reversedCard ? card.reversed : card.upright}</p>
              </div>
            ))}
          </div>

          <section className="interpretation" aria-live="polite">
            <div className="interpretation-heading">
              <div><Sparkles size={19} /><h2>Personalized interpretation</h2></div>
              {!loading && <span className={`mode-badge mode-${mode}`}>{mode === "ai" ? "AI generated" : "Rule-based fallback"}</span>}
            </div>
            {loading && (
              <div className="reading-loader"><span /><span /><span /><p>Connecting the symbols in your spread…</p></div>
            )}
            {error && (
              <div className="reading-error">
                <p>{error}</p>
                <button className="button button-ghost" onClick={() => requestReading(question, cards)}><RefreshCw size={15} /> Try again</button>
              </div>
            )}
            {!loading && !error && (
              <div className="reading-prose">
                {reading.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              </div>
            )}
          </section>

          <div className="reflection-note"><strong>Remember</strong><span>Tarot offers a reflective lens, not a fixed prediction. Keep what feels useful and leave the rest.</span></div>
          <button className="button button-primary button-centered" onClick={startOver}>Begin another reading <ArrowRight size={17} /></button>
        </section>
      </main>
    </SiteShell>
  );
}
