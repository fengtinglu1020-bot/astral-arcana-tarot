# Astral Arcana

Astral Arcana is a multi-page tarot reflection website created by Tinglu Feng, Ella Zhou, and Nantong Fu. A visitor asks a question, chooses a three-card or five-card spread, personally selects face-down cards from a shuffled 78-card deck, and receives a personalized interpretation.

## Pages

- `/` introduces the project.
- `/question` collects an open-ended question.
- `/spread` offers three-card and five-card layouts.
- `/draw` lays out the complete shuffled deck face down so visitors can choose cards without replacement; it then reveals the selection and assigns reversals.
- `/reading` displays the spread and requests a personalized interpretation.
- `/how-it-works` explains the interaction and the project’s reflective-use boundary.

## Technology

- HTML structure is authored in React TSX and rendered as semantic HTML.
- CSS in `app/globals.css` controls the black-and-silver visual system, typography, spacing, cards, animation, and responsive layouts.
- TypeScript handles page interaction, session storage, and the full tarot deck.
- A server route calls the OpenAI Responses API when `OPENAI_API_KEY` is configured. It falls back to a local personalized reflection so the full user flow remains usable without a key.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal.

## Environment variables

Copy `.env.example` to a local environment file and add a valid API key. Never commit a real key.

```text
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-5-mini
```

The hosted version stores the API key as a protected server-side secret. The key is never sent to the browser.

## Responsible use

The site presents tarot as a tool for reflection and entertainment. It does not claim to predict the future and does not provide medical, legal, financial, diagnostic, or crisis advice.
