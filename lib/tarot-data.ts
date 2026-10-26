export type TarotCard = {
  id: string;
  name: string;
  numeral: string;
  arcana: "Major Arcana" | "Minor Arcana";
  suit?: "Wands" | "Cups" | "Swords" | "Pentacles";
  symbol: string;
  upright: string;
  reversed: string;
};

export type DrawnCard = TarotCard & {
  position: string;
  reversedCard: boolean;
};

const majors: TarotCard[] = [
  ["the-fool", "The Fool", "0", "✦", "beginnings, curiosity, and a leap of faith", "hesitation, naivety, or an unconsidered risk"],
  ["the-magician", "The Magician", "I", "✧", "skill, initiative, and focused intention", "scattered energy, manipulation, or untapped ability"],
  ["the-high-priestess", "The High Priestess", "II", "☾", "intuition, mystery, and inner knowledge", "ignored intuition, secrecy, or emotional distance"],
  ["the-empress", "The Empress", "III", "♀", "abundance, care, and creative growth", "creative blocks, overgiving, or dependence"],
  ["the-emperor", "The Emperor", "IV", "♄", "structure, leadership, and steady boundaries", "rigidity, control, or a fragile foundation"],
  ["the-hierophant", "The Hierophant", "V", "♃", "tradition, learning, and shared values", "questioning convention or choosing a personal path"],
  ["the-lovers", "The Lovers", "VI", "♊", "alignment, connection, and a meaningful choice", "misalignment, avoidance, or divided priorities"],
  ["the-chariot", "The Chariot", "VII", "☉", "determination, direction, and self-command", "loss of direction, force, or conflicting drives"],
  ["strength", "Strength", "VIII", "♌", "courage, patience, and compassionate confidence", "self-doubt, suppressed emotion, or burnout"],
  ["the-hermit", "The Hermit", "IX", "☿", "reflection, solitude, and a search for truth", "isolation, withdrawal, or refusing guidance"],
  ["wheel-of-fortune", "Wheel of Fortune", "X", "☸", "change, cycles, and a turning point", "resistance to change or a repeating pattern"],
  ["justice", "Justice", "XI", "⚖", "truth, accountability, and fair consequences", "bias, avoidance, or an unresolved imbalance"],
  ["the-hanged-man", "The Hanged Man", "XII", "♆", "pause, surrender, and a new perspective", "stalling, needless sacrifice, or resistance"],
  ["death", "Death", "XIII", "☠", "an ending, release, and transformation", "fear of transition or holding on past its time"],
  ["temperance", "Temperance", "XIV", "△", "balance, integration, and patient adjustment", "excess, friction, or poor timing"],
  ["the-devil", "The Devil", "XV", "♑", "attachment, temptation, and hidden constraints", "reclaiming agency or loosening an unhealthy bond"],
  ["the-tower", "The Tower", "XVI", "⚡", "revelation, disruption, and necessary change", "avoided truth or a slow internal upheaval"],
  ["the-star", "The Star", "XVII", "☆", "hope, renewal, and an authentic direction", "discouragement, disconnection, or lost faith"],
  ["the-moon", "The Moon", "XVIII", "☽", "uncertainty, dreams, and what lies beneath", "clarity emerging or fear losing its hold"],
  ["the-sun", "The Sun", "XIX", "☼", "vitality, confidence, and welcome clarity", "temporary gloom, delay, or muted confidence"],
  ["judgement", "Judgement", "XX", "♬", "awakening, review, and an honest decision", "self-criticism, doubt, or avoiding the call"],
  ["the-world", "The World", "XXI", "◎", "completion, integration, and earned perspective", "unfinished business or a goal nearly reached"],
].map(([id, name, numeral, symbol, upright, reversed]) => ({
  id,
  name,
  numeral,
  symbol,
  upright,
  reversed,
  arcana: "Major Arcana" as const,
}));

const suits = {
  Wands: { symbol: "♜", domain: "ambition, energy, and creative action", shadow: "friction, delay, or scattered effort" },
  Cups: { symbol: "♧", domain: "emotion, relationships, and intuition", shadow: "emotional distance, fantasy, or imbalance" },
  Swords: { symbol: "†", domain: "thought, communication, and difficult truth", shadow: "confusion, conflict, or mental strain" },
  Pentacles: { symbol: "⛤", domain: "work, resources, health, and the material world", shadow: "instability, overfocus on results, or poor planning" },
} as const;

const ranks = [
  { name: "Ace", numeral: "A", light: "a fresh opening and concentrated potential", shadow: "a delayed start or unused opportunity" },
  { name: "Two", numeral: "II", light: "choice, balance, and a developing partnership", shadow: "indecision or an uneven exchange" },
  { name: "Three", numeral: "III", light: "growth, collaboration, and early results", shadow: "misalignment or work that needs revision" },
  { name: "Four", numeral: "IV", light: "stability, rest, and a secure pause", shadow: "stagnation or protection becoming restriction" },
  { name: "Five", numeral: "V", light: "challenge, contrast, and learning through tension", shadow: "lingering conflict or fear of loss" },
  { name: "Six", numeral: "VI", light: "movement, support, and restored harmony", shadow: "unequal support or difficulty moving forward" },
  { name: "Seven", numeral: "VII", light: "assessment, persistence, and a strategic test", shadow: "doubt, avoidance, or a poorly chosen defense" },
  { name: "Eight", numeral: "VIII", light: "momentum, practice, and focused progress", shadow: "rushing, repetition, or blocked movement" },
  { name: "Nine", numeral: "IX", light: "resilience, independence, and nearing completion", shadow: "fatigue, defensiveness, or isolation" },
  { name: "Ten", numeral: "X", light: "completion, consequence, and a cycle at its peak", shadow: "overload or difficulty releasing a finished cycle" },
  { name: "Page", numeral: "P", light: "curiosity, a message, and beginner's attention", shadow: "immaturity, distraction, or mixed signals" },
  { name: "Knight", numeral: "Kn", light: "pursuit, movement, and committed effort", shadow: "impulsiveness, inconsistency, or tunnel vision" },
  { name: "Queen", numeral: "Q", light: "maturity, receptivity, and quiet influence", shadow: "insecurity, overextension, or guarded feeling" },
  { name: "King", numeral: "K", light: "mastery, responsibility, and outward leadership", shadow: "domination, stubbornness, or misused authority" },
];

const minors = Object.entries(suits).flatMap(([suitName, suitInfo]) =>
  ranks.map((rank) => ({
    id: `${rank.name.toLowerCase()}-of-${suitName.toLowerCase()}`,
    name: `${rank.name} of ${suitName}`,
    numeral: rank.numeral,
    arcana: "Minor Arcana" as const,
    suit: suitName as TarotCard["suit"],
    symbol: suitInfo.symbol,
    upright: `${rank.light}, expressed through ${suitInfo.domain}`,
    reversed: `${rank.shadow}, especially around ${suitInfo.shadow}`,
  })),
);

export const tarotDeck: TarotCard[] = [...majors, ...minors];

export const spreadPositions: Record<3 | 5, string[]> = {
  3: ["Past", "Present", "Future"],
  5: ["Current situation", "Challenge", "Subconscious influence", "Guidance", "Possible outcome"],
};

export function drawCards(count: 3 | 5): DrawnCard[] {
  const pool = [...tarotDeck];
  const selected: DrawnCard[] = [];

  for (let index = 0; index < count; index += 1) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    const card = pool.splice(randomIndex, 1)[0];
    selected.push({
      ...card,
      position: spreadPositions[count][index],
      reversedCard: Math.random() < 0.28,
    });
  }

  return selected;
}
