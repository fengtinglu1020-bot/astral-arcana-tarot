import type { DrawnCard } from "@/lib/tarot-data";

export function TarotCardView({ card, hidden = false, index = 0 }: { card?: DrawnCard; hidden?: boolean; index?: number }) {
  if (hidden || !card) {
    return (
      <div className="tarot-card card-back" aria-label="Face-down tarot card" style={{ "--card-delay": `${index * 80}ms` } as React.CSSProperties}>
        <div className="card-back-inner"><span>✦</span><i>☾</i><span>✦</span></div>
      </div>
    );
  }

  return (
    <article className={`tarot-card card-face ${card.reversedCard ? "is-reversed" : ""}`} style={{ "--card-delay": `${index * 90}ms` } as React.CSSProperties}>
      <div className="card-frame">
        <span className="card-number">{card.numeral}</span>
        <div className="card-symbol" aria-hidden="true">{card.symbol}</div>
        <div className="orbit orbit-one" aria-hidden="true" />
        <div className="orbit orbit-two" aria-hidden="true" />
        <span className="card-arcana">{card.arcana}</span>
      </div>
      <div className="card-label">
        <strong>{card.name}</strong>
        <span>{card.reversedCard ? "Reversed" : "Upright"}</span>
      </div>
    </article>
  );
}
