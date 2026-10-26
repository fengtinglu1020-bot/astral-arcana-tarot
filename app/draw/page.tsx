"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { ReadingProgress } from "@/components/reading-progress";
import { TarotCardView } from "@/components/tarot-card";
import { spreadPositions, tarotDeck, type DrawnCard, type TarotCard } from "@/lib/tarot-data";
import { loadQuestion, loadSpread, saveCards } from "@/lib/reading-storage";

type SelectedCard = {
  deckIndex: number;
  reversedCard: boolean;
};

function shuffleDeck(): TarotCard[] {
  const cards = [...tarotDeck];
  for (let index = cards.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [cards[index], cards[randomIndex]] = [cards[randomIndex], cards[index]];
  }
  return cards;
}

export default function DrawPage() {
  const [spread, setSpread] = useState<3 | 5>(3);
  const [deck, setDeck] = useState<TarotCard[]>([]);
  const [selected, setSelected] = useState<SelectedCard[]>([]);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const storedSpread = loadSpread();
    if (!loadQuestion() || !storedSpread) {
      window.location.replace("/question");
      return;
    }
    setSpread(storedSpread);
    setDeck(shuffleDeck());
  }, []);

  const chosenCards = useMemo<DrawnCard[]>(
    () => selected.map((choice, index) => ({
      ...deck[choice.deckIndex],
      position: spreadPositions[spread][index],
      reversedCard: choice.reversedCard,
    })).filter((card): card is DrawnCard => Boolean(card.id)),
    [deck, selected, spread],
  );

  function chooseCard(deckIndex: number) {
    if (revealed) return;
    setSelected((current) => {
      const existingIndex = current.findIndex((choice) => choice.deckIndex === deckIndex);
      if (existingIndex >= 0) return current.filter((_, index) => index !== existingIndex);
      if (current.length >= spread) return current;
      return [...current, { deckIndex, reversedCard: Math.random() < 0.28 }];
    });
  }

  function resetDeck() {
    setDeck(shuffleDeck());
    setSelected([]);
    setRevealed(false);
  }

  function revealCards() {
    if (chosenCards.length !== spread) return;
    saveCards(chosenCards);
    setRevealed(true);
  }

  function continueReading() {
    saveCards(chosenCards);
    window.location.assign("/reading");
  }

  return (
    <SiteShell>
      <main className="flow-page draw-page">
        <ReadingProgress current={3} />
        <section className="flow-panel wide-panel">
          <div className="eyebrow"><span>✦</span> Step three <span>✦</span></div>
          <h1>{revealed ? <>Your cards have<br /><em>found you.</em></> : <>Choose with<br /><em>your intuition.</em></>}</h1>

          {revealed ? (
            <>
              <p className="section-lead">Your chosen cards are revealed in the order you selected them.</p>
              <div className={`drawn-cards drawn-${spread}`}>
                {chosenCards.map((card, index) => (
                  <div key={card.id} className="draw-slot">
                    <span className="position-label">{card.position}</span>
                    <TarotCardView card={card} index={index} />
                  </div>
                ))}
              </div>
              <div className="draw-actions">
                <button className="button button-primary" onClick={continueReading}>Interpret my cards <ArrowRight size={17} /></button>
                <button className="button button-ghost" onClick={resetDeck}><RotateCcw size={15} /> Choose again</button>
              </div>
            </>
          ) : (
            <>
              <p className="section-lead">All 78 cards have been shuffled and placed face down. Select {spread} cards, one at a time.</p>

              <div className="selection-summary" aria-live="polite">
                <div>
                  <span className="selection-count">{selected.length} / {spread}</span>
                  <p>{selected.length === spread ? "Your spread is complete. Reveal when you are ready." : `Choose ${spread - selected.length} more ${spread - selected.length === 1 ? "card" : "cards"}.`}</p>
                </div>
                <div className={`selection-slots slots-${spread}`} aria-label="Selected card order">
                  {spreadPositions[spread].map((position, index) => (
                    <div className={`selection-slot ${selected[index] ? "filled" : ""}`} key={position}>
                      <span>{selected[index] ? index + 1 : "✦"}</span>
                      <small>{position}</small>
                    </div>
                  ))}
                </div>
              </div>

              <div className="deck-panel">
                <div className="deck-heading">
                  <span>THE COMPLETE DECK · 78 CARDS</span>
                  <span>Click a selected card again to return it</span>
                </div>
                <div className="full-deck-grid">
                  {deck.map((card, deckIndex) => {
                    const selectedOrder = selected.findIndex((choice) => choice.deckIndex === deckIndex);
                    const isSelected = selectedOrder >= 0;
                    return (
                      <button
                        type="button"
                        className={`deck-card-button ${isSelected ? "selected" : ""}`}
                        key={card.id}
                        onClick={() => chooseCard(deckIndex)}
                        aria-pressed={isSelected}
                        aria-label={`Face-down card ${deckIndex + 1}${isSelected ? `, selected as card ${selectedOrder + 1}` : ""}`}
                      >
                        <span className="deck-card-frame" aria-hidden="true"><i>☾</i></span>
                        {isSelected && <strong className="selection-marker" aria-hidden="true">{selectedOrder + 1}</strong>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="draw-actions sticky-draw-actions">
                <button className="button button-primary" onClick={revealCards} disabled={selected.length !== spread}><Sparkles size={15} /> Reveal my {spread} cards</button>
                <button className="button button-ghost" onClick={resetDeck} disabled={!deck.length}><RotateCcw size={15} /> Shuffle again</button>
              </div>
            </>
          )}
        </section>
      </main>
    </SiteShell>
  );
}
