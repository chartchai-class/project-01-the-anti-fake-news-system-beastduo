## Todo List – Social Anti‑Fake News System

### Setup
- [ ] Init Vite Vue app: `npm create vite@latest afn -- --template vue`
- [ ] Add Tailwind CSS (postcss, autoprefixer) and configure `tailwind.config.cjs`
- [ ] Add Vue Router and Pinia
- [ ] Create base folders: `src/components`, `src/pages`, `src/stores`, `src/mock`

### Mock Data
- [ ] Create `src/mock/news.json` (≥ 50 items)
- [ ] Create `src/mock/comments.json` (seed multiple per news)
- [ ] Create `src/mock/votes.json` (fake & non‑fake spread)

### State (Pinia)
- [ ] Implement `useNewsStore` with state, getters, actions described in plan
- [ ] `loadSeeds()` reads mock JSON; `hydrateFromLocalStorage()` merges session data
- [ ] `persistToLocalStorage()` on vote/comment add
- [ ] Vote status computation (majority or fallback to seed)

### Routing
- [ ] Define routes: `/`, `/news/:id`, `/news/:id/vote`
- [ ] Guard invalid `:id` → redirect to home

### Home Page (`/`)
- [ ] `NewsFilter` (all/fake/non‑fake)
- [ ] `PageSizeSelect` (5/10/20)
- [ ] `NewsCard` shows: title, summary, status, reporter, reportedAt
- [ ] `Pagination` controls (prev/next, current page)
- [ ] Loading/skeleton while seeds hydrate
- [ ] Responsive layout tests

### Details Page (`/news/:id`)
- [ ] `NewsHeader` (title, status, reporter, reportedAt)
- [ ] `ImagePreview` (from imageUrl)
- [ ] `VoteSummary` (fake vs non‑fake counts)
- [ ] `CommentList` with pagination; empty state
- [ ] Link/button to Vote page

### Vote Page (`/news/:id/vote`)
- [ ] `VoteForm` with radio (fake/non‑fake)
- [ ] Optional comment textarea + optional image URL input
- [ ] Client validation (URL format optional)
- [ ] On submit, update store; show toast; navigate to details

### UX/Styling
- [ ] Global layout & header
- [ ] Status badges and color system (Tailwind)
- [ ] Focus states and accessible labels
- [ ] Loading environment (skeleton or spinner)

### Storage & Session
- [ ] LocalStorage keys: `afn.v1.votes`, `afn.v1.comments`
- [ ] Merge logic on boot; clear strategy simple (no server persistence)

### QA Pass
- [ ] Pagination functions for list and comments
- [ ] Filters work and combine with pagination correctly
- [ ] Vote changes reflect immediately across pages via Pinia
- [ ] Mobile, tablet, desktop responsiveness

### Deployment
- [ ] Add `build` script in `package.json`
- [ ] Verify Vite build locally
- [ ] Deploy to Vercel (framework preset: Vite, output: `dist`)
- [ ] Capture deployed URL

### README & Demo
- [ ] Fill `README.md` with team info (ids, names)
- [ ] Add deployed URL and demo video link (2–3 minutes)
- [ ] Usage instructions and rubric mapping


