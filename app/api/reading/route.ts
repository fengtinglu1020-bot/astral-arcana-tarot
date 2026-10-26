import { NextResponse } from "next/server";
import type { DrawnCard } from "@/lib/tarot-data";

type ReadingRequest = { question?: unknown; cards?: unknown };

type CardDomain = "Wands" | "Cups" | "Swords" | "Pentacles" | "Major Arcana";
type QuestionLens = {
  area: string;
  contrast: string;
  priority: string;
  actions: Record<CardDomain, { upright: string; reversed: string }>;
};

const questionLenses: Record<string, QuestionLens> = {
  study: {
    area: "your studies and this academic period",
    contrast: "trying to do everything at once",
    priority: "a repeatable routine, clear priorities, and protected attention",
    actions: {
      Wands: { upright: "direct your energy into one meaningful assignment or skill at a time", reversed: "stop relying on last-minute bursts of motivation and reduce competing commitments" },
      Cups: { upright: "connect the work to genuine interest and accept useful support", reversed: "notice when mood, comparison, or discouragement is deciding your study habits for you" },
      Swords: { upright: "define the real question, make a clear plan, and ask for clarification early", reversed: "reduce information overload, verify assumptions, and give your mind fewer places to scatter" },
      Pentacles: { upright: "build progress through a practical schedule, small milestones, and consistent practice", reversed: "repair the part of your routine, workload, or use of resources that is not sustainable" },
      "Major Arcana": { upright: "treat this semester as a meaningful stage of growth rather than only a set of grades", reversed: "identify the larger fear or resistance that is quietly disrupting your progress" },
    },
  },
  work: {
    area: "your work, career, or professional direction",
    contrast: "chasing an immediate answer or external approval",
    priority: "evidence, sustainable progress, and choices that strengthen your position",
    actions: {
      Wands: { upright: "take initiative on the opportunity that has real momentum", reversed: "narrow your effort before ambition turns into overextension" },
      Cups: { upright: "weigh whether the work feels aligned and whether the relationships around it are supportive", reversed: "separate temporary disappointment from the facts of the opportunity" },
      Swords: { upright: "state your goal clearly, gather missing information, and have the necessary conversation", reversed: "question mixed messages and do not make a decision from anxiety or incomplete information" },
      Pentacles: { upright: "focus on skills, resources, compensation, and the next concrete milestone", reversed: "check for weak foundations, unrealistic timelines, or effort that is not being valued" },
      "Major Arcana": { upright: "recognize that this choice may shape a larger professional chapter", reversed: "look closely at the belief about success or security that is keeping you stuck" },
    },
  },
  relationship: {
    area: "this relationship or emotional connection",
    contrast: "guessing what the other person thinks or forcing certainty",
    priority: "honest communication, reciprocity, and boundaries you can actually maintain",
    actions: {
      Wands: { upright: "bring warmth and directness into the connection without rushing it", reversed: "notice where intensity, impatience, or inconsistent effort is creating friction" },
      Cups: { upright: "make room for sincere feeling, empathy, and mutual care", reversed: "name the unmet need or emotional imbalance instead of hoping it will disappear" },
      Swords: { upright: "have the clear conversation and listen to the answer that is actually given", reversed: "untangle assumptions, avoidance, or words that have not matched actions" },
      Pentacles: { upright: "look at reliability and the small behaviors that build trust", reversed: "question whether the connection has enough practical stability and equal investment" },
      "Major Arcana": { upright: "treat the connection as a lesson in values and choice, not just chemistry", reversed: "notice the deeper pattern you may be repeating in this relationship" },
    },
  },
  decision: {
    area: "the choice in front of you",
    contrast: "searching for a perfect, risk-free option",
    priority: "the trade-off you can accept and the next piece of evidence you can obtain",
    actions: {
      Wands: { upright: "test the option that creates constructive energy and forward movement", reversed: "pause the option driven mainly by urgency, ego, or fear of missing out" },
      Cups: { upright: "include your values and emotional truth in the decision", reversed: "separate intuition from wishful thinking or fear of disappointing someone" },
      Swords: { upright: "compare the facts, consequences, and conversations each option requires", reversed: "resolve missing information and mental noise before committing" },
      Pentacles: { upright: "choose the path with workable resources and a stable next step", reversed: "check the hidden cost, fragile foundation, or unrealistic expectation" },
      "Major Arcana": { upright: "recognize the larger value or identity this decision asks you to choose", reversed: "identify what you are resisting before calling the situation impossible" },
    },
  },
  general: {
    area: "the situation you asked about",
    contrast: "trying to force a complete answer immediately",
    priority: "the pattern you can verify and the part of the situation you can influence",
    actions: {
      Wands: { upright: "put energy behind the step that creates real movement", reversed: "reduce scattered effort and notice where urgency is replacing direction" },
      Cups: { upright: "include emotional truth and supportive relationships in your response", reversed: "separate a passing feeling or fantasy from what the situation is showing you" },
      Swords: { upright: "seek clarity through facts, language, and an honest conversation", reversed: "challenge confusion, assumptions, or a story that is increasing your anxiety" },
      Pentacles: { upright: "ground the issue in practical resources, habits, and a manageable next step", reversed: "repair the unstable or unsustainable part of the situation first" },
      "Major Arcana": { upright: "consider the larger lesson and value at stake", reversed: "notice the deeper resistance or repeated pattern beneath the immediate problem" },
    },
  },
};

function detectQuestionLens(question: string): QuestionLens {
  const text = question.toLowerCase();
  if (/school|class|course|college|university|semester|exam|test|grade|study|assignment|project|learn/.test(text)) return questionLenses.study;
  if (/job|career|work|intern|interview|company|business|promotion|manager|salary|client/.test(text)) return questionLenses.work;
  if (/relationship|love|partner|dating|boyfriend|girlfriend|friend|family|marriage|crush|they feel|he feel|she feel/.test(text)) return questionLenses.relationship;
  if (/should i|which|choose|choice|decision|option|whether|or not|move to|stay or|leave or/.test(text)) return questionLenses.decision;
  return questionLenses.general;
}

function detectIntent(question: string) {
  const text = question.toLowerCase();
  if (/^why\b|why (?:is|does|do|did|am|are|was|were)/.test(text)) return "The spread is most useful here as an explanation of the pattern, not a single cause.";
  if (/\bwill\b|what will|future|going to/.test(text)) return "The cards cannot settle the future, but they can show the pattern your current choices are strengthening.";
  if (/focus|priority|prioritize|concentrate|pay attention/.test(text)) return "The answer is not to add more; it is to identify what deserves sustained attention and what can be set aside.";
  if (/should i|which|choose|choice|decision|whether/.test(text)) return "The cards do not choose for you; they clarify the trade-off and the conditions each choice needs.";
  if (/^how\b|how (?:can|do|should)/.test(text)) return "Read the spread as a sequence: what is already shaping the issue, what needs attention now, and what becomes possible next.";
  return "The cards are most useful here as a guide to where your attention and effort may matter most.";
}

function cardDomain(card: DrawnCard): CardDomain {
  return card.arcana === "Major Arcana" ? "Major Arcana" : (card.suit ?? "Major Arcana");
}

function cardSentence(card: DrawnCard, lens: QuestionLens) {
  const orientation = card.reversedCard ? "reversed" : "upright";
  const meaning = card.reversedCard ? card.reversed : card.upright;
  const application = lens.actions[cardDomain(card)][orientation];
  const positionRoles: Record<string, string> = {
    Past: "As the background to the question",
    Present: "At the point of greatest leverage now",
    Future: "As the direction the current pattern could develop toward",
    "Current situation": "At the heart of the situation",
    Challenge: "As the obstacle that needs an honest response",
    "Subconscious influence": "As the assumption or feeling working below the surface",
    Guidance: "As the clearest advice in the spread",
    "Possible outcome": "As a possible direction rather than a prediction",
  };
  const role = positionRoles[card.position] ?? `In the ${card.position} position`;
  return `${role}, ${card.name} ${orientation} highlights ${meaning}. Applied to ${lens.area}, it asks you to ${application}.`;
}

function patternSentence(cards: DrawnCard[]) {
  const suitCounts = cards.reduce<Record<string, number>>((counts, card) => {
    const domain = cardDomain(card);
    counts[domain] = (counts[domain] ?? 0) + 1;
    return counts;
  }, {});
  const [dominant, count] = Object.entries(suitCounts).sort((a, b) => b[1] - a[1])[0] ?? ["", 0];
  const reversals = cards.filter((card) => card.reversedCard).length;
  const domainMessage: Record<string, string> = {
    Wands: "The repeated Wands make energy, motivation, and follow-through central to the answer.",
    Cups: "The repeated Cups make feelings, connection, and emotional honesty central to the answer.",
    Swords: "The repeated Swords make communication, assumptions, and mental clarity central to the answer.",
    Pentacles: "The repeated Pentacles make routines, resources, and practical stability central to the answer.",
    "Major Arcana": "The Major Arcana emphasis suggests that the question touches a broader personal turning point, not only a temporary problem.",
  };
  const emphasis = count >= 2 ? domainMessage[dominant] : "Because the cards span different domains, the answer asks you to connect thought, feeling, and practical action.";
  const reversalNote = reversals >= Math.ceil(cards.length / 2)
    ? "The number of reversed cards points to an internal blockage or course correction rather than simple external bad luck."
    : reversals === 0
      ? "With no reversals, the spread emphasizes using energy that is already available rather than waiting for a dramatic change."
      : "The mix of upright and reversed cards shows both an available strength and a place where adjustment is needed.";
  return `${emphasis} ${reversalNote}`;
}

function categoryTemplateReading(question: string, cards: DrawnCard[]) {
  const lens = detectQuestionLens(question);
  const first = cards[0];
  const center = cards[Math.floor(cards.length / 2)];
  const last = cards[cards.length - 1];
  const splitIndex = cards.length === 5 ? 3 : 2;
  const firstGroup = cards.slice(0, splitIndex).map((card) => cardSentence(card, lens)).join(" ");
  const finalGroup = cards.slice(splitIndex).map((card) => cardSentence(card, lens)).join(" ");
  const firstMeaning = first.reversedCard ? first.reversed : first.upright;
  const lastMeaning = last.reversedCard ? last.reversed : last.upright;
  const progression = `The movement from ${first.name} (${firstMeaning}) toward ${last.name} (${lastMeaning}) makes ${center.name} the hinge point: it shows what could support or interrupt that shift.`;
  const decisive = cards.find((card) => /Guidance/i.test(card.position)) ?? center;
  const decisiveAction = lens.actions[cardDomain(decisive)][decisive.reversedCard ? "reversed" : "upright"];

  return [
    `The clearest answer to “${question}” is to move away from ${lens.contrast} and toward ${lens.priority}. ${detectIntent(question)} ${progression} ${patternSentence(cards)}`,
    firstGroup,
    `${finalGroup}${finalGroup ? " " : ""}Taken together, the spread does not ask you to solve everything now. Its practical advice is to ${decisiveAction}. Choose one visible action you can complete within the next seven days, then judge the situation by what that action reveals—not by fear or wishful thinking.`,
    `Reflection prompt: Imagine ${decisive.name} responding directly to your question. What would it ask you to stop, continue, or do differently this week?`,
  ].join("\n\n");
}

type QuestionShape = "yes-no" | "choice" | "why" | "how" | "focus" | "open";

function questionShape(question: string): QuestionShape {
  const text = question.trim().toLowerCase();
  if (/^(can|could|will|would|is|are|am|does|do|did|has|have|should)\b/.test(text)) return "yes-no";
  if (/\b(or|versus|vs\.?|choose|choice|which option|whether)\b/.test(text)) return "choice";
  if (/^why\b/.test(text)) return "why";
  if (/^how\b/.test(text)) return "how";
  if (/focus|priority|prioritize|pay attention|most important/.test(text)) return "focus";
  return "open";
}

function domainPhrase(card: DrawnCard) {
  if (card.arcana === "Major Arcana") return "the larger turning point and the personal pattern behind it";
  const domains: Record<string, string> = {
    Wands: "momentum, initiative, effort, and follow-through",
    Cups: "morale, emotional investment, trust, and relationships among the people involved",
    Swords: "facts, strategy, communication, and mental clarity",
    Pentacles: "preparation, resources, consistency, and real-world conditions",
  };
  return domains[card.suit ?? ""] ?? "the conditions surrounding the question";
}

function domainLabel(card: DrawnCard) {
  if (card.arcana === "Major Arcana") return "the larger turning point";
  const labels: Record<string, string> = {
    Wands: "momentum and follow-through",
    Cups: "morale, trust, and teamwork",
    Swords: "facts, strategy, and communication",
    Pentacles: "preparation, resources, and consistency",
  };
  return labels[card.suit ?? ""] ?? "the real conditions surrounding the question";
}

function positionRole(position: string) {
  const roles: Record<string, string> = {
    Past: "describes the background influencing the situation, not the final result",
    Present: "shows the factor with the most influence right now",
    Future: "shows a possible direction if the current pattern continues, not a guaranteed outcome",
    "Current situation": "describes the situation as it currently stands",
    Challenge: "identifies the main obstacle or uncertainty",
    "Subconscious influence": "points to an assumption, fear, or motivation operating below the surface",
    Guidance: "offers the clearest response available within the spread",
    "Possible outcome": "describes a possible result if the other cards are not addressed",
  };
  return roles[position] ?? "adds context to the question";
}

function questionAwareCardSentence(card: DrawnCard) {
  const orientation = card.reversedCard ? "reversed" : "upright";
  const meaning = card.reversedCard ? card.reversed : card.upright;
  const condition = card.reversedCard
    ? `It suggests that ${domainPhrase(card)} may be blocked, inconsistent, unclear, or easy to misread.`
    : `It treats ${domainPhrase(card)} as an active influence or available strength.`;
  return `${card.position}: ${card.name} ${orientation} ${positionRole(card.position)}. Its relevant meaning here is ${meaning}. ${condition}`;
}

function yesNoLean(cards: DrawnCard[]) {
  const score = cards.reduce((total, card) => {
    const outcomeWeight = /Future|Possible outcome/i.test(card.position) ? 2 : 1;
    return total + (card.reversedCard ? -outcomeWeight : outcomeWeight);
  }, 0);
  if (score >= 4) return "cautiously supportive, but not certain";
  if (score >= 1) return "mixed but slightly supportive";
  if (score === 0) return "evenly balanced and genuinely uncertain";
  if (score <= -4) return "not supportive of a confident yes under the current conditions";
  return "mixed but leaning uncertain or obstructed";
}

function directAnswer(question: string, cards: DrawnCard[]) {
  const shape = questionShape(question);
  const center = cards[Math.floor(cards.length / 2)];
  const guidance = cards.find((card) => /Guidance/i.test(card.position)) ?? center;
  const relevantMeaning = guidance.reversedCard ? guidance.reversed : guidance.upright;
  const orientation = guidance.reversedCard ? "reversed" : "upright";
  if (shape === "yes-no") {
    const outcome = cards.find((card) => /Future|Possible outcome/i.test(card.position)) ?? cards[cards.length - 1];
    return `Direct answer: the spread is ${yesNoLean(cards)} in response to “${question}” ${outcome.name} ${outcome.reversedCard ? "reversed" : "upright"} in ${outcome.position} carries extra weight in that assessment. Tarot cannot verify a future event, so this is a reading of the current pattern—not a factual forecast.`;
  }
  if (shape === "choice") return `Direct answer: the spread does not choose for you, but it identifies ${relevantMeaning} through ${guidance.name} ${orientation} as the condition that should guide this choice.`;
  if (shape === "why") return `Direct answer: ${guidance.name} ${orientation} points to ${relevantMeaning} as the most important pattern behind the question.`;
  if (shape === "how") return `Direct answer: the strongest lever in “${question}” is ${relevantMeaning}, shown by ${guidance.name} ${orientation}.`;
  if (shape === "focus") return `Direct answer: ${guidance.name} ${orientation} directs your attention toward ${relevantMeaning} in response to the question.`;
  return `Direct answer: the central issue in “${question}” is ${relevantMeaning}, represented by ${guidance.name} ${orientation}.`;
}

function evidenceSentence(question: string, cards: DrawnCard[]) {
  const domains = [...new Set(cards.map((card) => domainLabel(card)))];
  const timeBound = /tomorrow|today|tonight|this (?:week|month|year)|next (?:week|month|year)|\b20\d{2}\b/.test(question.toLowerCase());
  const evidence = domains.slice(0, 2).join(" and ");
  if (questionShape(question) === "yes-no") {
    return `Before treating the reading as a yes or no, check the real-world evidence around ${evidence}.${timeBound ? " Because the question is time-bound, current information and actual performance matter more than the cards." : " Let new evidence change your confidence rather than forcing the spread into certainty."}`;
  }
  return `A useful next step is to look for one observable fact about ${evidence}. Use that fact to test the interpretation instead of accepting it only because it sounds meaningful.`;
}

function localReading(question: string, cards: DrawnCard[]) {
  const center = cards[Math.floor(cards.length / 2)];
  const outcome = cards.find((card) => /Future|Possible outcome/i.test(card.position)) ?? cards[cards.length - 1];
  const firstHalf = cards.slice(0, Math.ceil(cards.length / 2)).map(questionAwareCardSentence).join(" ");
  const secondHalf = cards.slice(Math.ceil(cards.length / 2)).map(questionAwareCardSentence).join(" ");
  const tension = center.reversedCard
    ? `${center.name} reversed at the center makes the main uncertainty hard to ignore.`
    : `${center.name} upright at the center shows where the spread finds its strongest support.`;
  const outcomeNote = `${outcome.name} ${outcome.reversedCard ? "reversed" : "upright"} in ${outcome.position} means the reading ends with ${outcome.reversedCard ? "a warning, delay, or unresolved condition" : "an available possibility"}, not a promise.`;

  return [
    `${directAnswer(question, cards)} ${tension} ${outcomeNote}`,
    firstHalf,
    `${secondHalf}${secondHalf ? " " : ""}${evidenceSentence(question, cards)}`,
    `Reflection prompt: Which real-world fact about ${domainLabel(center)} would most change your answer to this question?`,
  ].join("\n\n");
}

function extractText(payload: any) {
  if (typeof payload?.output_text === "string") return payload.output_text;
  return payload?.output
    ?.flatMap((item: any) => item?.content ?? [])
    ?.filter((content: any) => content?.type === "output_text")
    ?.map((content: any) => content.text)
    ?.join("\n") ?? "";
}

export async function POST(request: Request) {
  let body: ReadingRequest;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const question = typeof body.question === "string" ? body.question.trim().slice(0, 240) : "";
  const cards = Array.isArray(body.cards) ? body.cards.slice(0, 5) as DrawnCard[] : [];
  if (question.length < 8 || ![3, 5].includes(cards.length)) {
    return NextResponse.json({ error: "A question and a complete spread are required." }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ reading: localReading(question, cards), mode: "local" });

  const cardSummary = cards.map((card) =>
    `- ${card.position}: ${card.name} (${card.reversedCard ? "reversed" : "upright"}) — ${card.reversedCard ? card.reversed : card.upright}`,
  ).join("\n");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      signal: controller.signal,
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        store: false,
        instructions: "You are a grounded tarot reflection guide. Write in elegant but plain English. Treat tarot as reflective symbolism, never certainty or supernatural fact. Do not provide medical, legal, financial, diagnostic, or crisis advice, and do not frighten the user. Begin with a direct answer to the user's actual question. Interpret every card only in relation to that question and its spread position; never paste or merely paraphrase generic card definitions. Synthesize relationships among the cards: progression, reinforcement, contradictions, suit patterns, and reversals. Explain why each connection matters to the user's situation. Give one or two concrete, question-specific actions that can be taken within a week. Use exactly 4 short paragraphs: direct answer and overall pattern; card interaction and central tension; practical guidance; one sharply tailored reflection question. Mention every card naturally, but do not turn the reading into a card-by-card list. Do not use markdown headings or bullet points. Avoid vague boilerplate such as 'trust the journey,' 'something already in motion,' or 'name what is in your control.'",
        input: `User question: ${question}\n\nSpread:\n${cardSummary}`,
        max_output_tokens: 850,
      }),
    });
    if (!response.ok) throw new Error(`OpenAI request failed with ${response.status}`);
    const payload = await response.json();
    const reading = extractText(payload).trim();
    if (!reading) throw new Error("OpenAI returned an empty reading");
    return NextResponse.json({ reading, mode: "ai" });
  } catch (error) {
    console.error("AI reading fallback:", error);
    return NextResponse.json({ reading: localReading(question, cards), mode: "local" });
  } finally {
    clearTimeout(timeout);
  }
}
