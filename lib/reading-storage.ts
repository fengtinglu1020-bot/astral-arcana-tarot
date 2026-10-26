import type { DrawnCard } from "./tarot-data";

const QUESTION_KEY = "astralArcana.question";
const SPREAD_KEY = "astralArcana.spread";
const CARDS_KEY = "astralArcana.cards";

export function saveQuestion(question: string) {
  sessionStorage.setItem(QUESTION_KEY, question);
}

export function loadQuestion() {
  return sessionStorage.getItem(QUESTION_KEY) ?? "";
}

export function saveSpread(spread: 3 | 5) {
  sessionStorage.setItem(SPREAD_KEY, String(spread));
}

export function loadSpread(): 3 | 5 | null {
  const stored = Number(sessionStorage.getItem(SPREAD_KEY));
  return stored === 3 || stored === 5 ? stored : null;
}

export function saveCards(cards: DrawnCard[]) {
  sessionStorage.setItem(CARDS_KEY, JSON.stringify(cards));
}

export function loadCards(): DrawnCard[] {
  try {
    return JSON.parse(sessionStorage.getItem(CARDS_KEY) ?? "[]") as DrawnCard[];
  } catch {
    return [];
  }
}

export function clearReading() {
  [QUESTION_KEY, SPREAD_KEY, CARDS_KEY].forEach((key) => sessionStorage.removeItem(key));
}
