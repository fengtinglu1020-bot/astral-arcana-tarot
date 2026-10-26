# AI Use Process

## Team members

Tinglu Feng, Ella Zhou, and Nantong Fu

## What we asked AI to help with

We asked AI to help plan and build an English-language, multi-page tarot website. We specified a four-step user flow: ask a question, choose a three-card or five-card spread, draw the cards, and receive an interpretation that connects the question to the cards. We also requested a black-and-silver minimalist astrology style and classic tarot content.

## What AI produced

AI proposed the page structure, created the HTML structure and CSS visual system, organized a complete 78-card deck, wrote the card-drawing interaction, and drafted a secure server route for personalized interpretations. It also suggested responsive layouts, accessible form labels, status messages, and a clear disclaimer.

## What we kept

We kept the multi-page flow, the three-card Past–Present–Future spread, the five-card Situation–Challenge–Subconscious–Guidance–Outcome spread, the black-and-silver palette, a hands-on card selection and reveal interaction, and personalized readings based on the question and card positions.

## What we changed or refined

We chose original silver line-art symbols instead of copying a modern commercial tarot deck. We changed the first random-draw prototype into a full 78-card face-down table so the visitor personally chooses every card. We added a local reflection mode so the website remains usable if the AI service is unavailable. We also required the API key to remain on the server and added language explaining that tarot is for reflection rather than prediction or professional advice.

## What we learned

We learned how semantic page structure and CSS Grid can create a responsive multi-page experience, how session storage can carry data between pages, how random selection can avoid duplicate cards, and why API keys must never appear in browser code or a public GitHub repository.
