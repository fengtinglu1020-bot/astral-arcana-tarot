const steps = ["Question", "Spread", "Draw", "Reading"];

export function ReadingProgress({ current }: { current: number }) {
  return (
    <ol className="reading-progress" aria-label={`Step ${current} of 4`}>
      {steps.map((step, index) => {
        const number = index + 1;
        return (
          <li key={step} className={number === current ? "active" : number < current ? "complete" : ""}>
            <span>{number < current ? "✓" : number}</span>
            <em>{step}</em>
          </li>
        );
      })}
    </ol>
  );
}
