# Astral Arcana

Astral Arcana is an interactive English tarot reflection website created by Tinglu Feng, Ella Zhou, and Nantong Fu.

Live site: https://astral-arcana-tarot.fengtinglu1020.chatgpt.site/

## Features

- Ask any open-ended question.
- Choose a three-card or five-card spread.
- Select cards yourself from a shuffled 78-card face-down deck.
- Reveal upright and reversed cards.
- Receive a question-aware interpretation based on the selected cards.
- Responsive black-and-silver astrology-inspired design.

## Pages

- `/` — landing page
- `/question` — enter a question
- `/spread` — select a spread
- `/draw` — choose cards from the full deck
- `/reading` — view the interpretation
- `/how-it-works` — project explanation and responsible-use note

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

The website works without an API key by using a built-in question-aware interpretation. For AI-generated readings, copy `.env.example` to `.env.local` and add a valid server-side OpenAI API key. Never commit a real API key.

## Technology

Next.js, React, TypeScript, HTML, CSS, and Lucide icons.

## Responsible use

Tarot is presented as a reflection and entertainment tool. The website does not provide medical, legal, financial, diagnostic, or crisis advice.
