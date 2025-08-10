[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/k6kO_4Go)

# Social Anti‑Fake News System

A responsive SPA built with Vue 3, Vite, Tailwind CSS, Pinia, and Vue Router. Users can browse news, filter fake/non‑fake, view details, paginate lists and comments, and submit votes with optional comments and image URLs. Session data is stored client‑side (no server POSTs), per assignment requirements.

## Tech Stack
- Vue 3 + Vite
- Vue Router
- Pinia (state management)
- Tailwind CSS
- Deployed on Vercel

## Features
- News list with filters (all/fake/non‑fake), page size selection, and pagination
- News details with full content, image URL preview, reporter and timestamp
- Vote summary (fake vs non‑fake counts)
- Comment list with pagination
- Vote page: choose fake/non‑fake, add optional comment and image URL
- Mock data seeded locally; session updates persisted in `localStorage`

## Project Setup
```bash
npm install
npm run dev
```

Build for production:
```bash
npm run build
npm run preview
```

## Deployment (Vercel)
- Build command: `npm run build`
- Output directory: `dist`
- Framework preset: Vite

## Directory Structure (key parts)
```
src/
  main.js
  router/
    index.js
  stores/
    news.js
  pages/
    Home.vue
    NewsDetails.vue
    Vote.vue
  components/
    NewsCard.vue
    NewsFilter.vue
    PageSizeSelect.vue
    Pagination.vue
    CommentList.vue
    VoteForm.vue
  mock/
    news.json
    comments.json
    votes.json
```

## Data & Persistence
- Seeds loaded from `src/mock/*.json`
- User votes/comments are merged and saved to `localStorage` keys:
  - `afn.v1.votes`
  - `afn.v1.comments`
- On reload, only seed data is guaranteed; session data can be cleared per assignment note.

## Grading Rubric Mapping (high level)
- Mock data: provided and sufficient for pagination
- Layout/responsiveness: Tailwind across all pages
- List: fields, pagination, page size
- Filters: all/fake/non‑fake
- Details: full data, status, image URL
- Comments & votes: list with pagination; sub‑routing implemented
- Voting: updates Pinia; counts reflect; optional comment/image
- Tailwind: used throughout; loading environment provided
- Deployment: Vercel

## Team
- Group Name: BeastDuo
- Members:
  - 662115012 - Chindanai Jaiman (701)
  - 662115013 - Titpon Tawong (701)

## Links
- Deployed site: <Vercel URL>
- Demo video (2–3 minutes): <Video URL>
- GitHub repository: <Repo URL>

## Notes
- This project intentionally avoids server POST operations and persists user additions only within the browser session, as specified in the assignment.


