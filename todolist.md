## Todo List – Social Anti‑Fake News System

### Setup
- [x] Init Vite Vue app: `npm create vite@latest afn -- --template vue`
- [x] Add Tailwind CSS (postcss, autoprefixer) and configure `tailwind.config.cjs`
- [x] Add Vue Router and Pinia
- [x] Create base folders: `src/components`, `src/pages`, `src/stores`, `src/mock`

### Mock Data
 - [x] Create `src/mock/news.json` (≥ 50 items)
 - [x] Create `src/mock/comments.json` (seed multiple per news)
 - [x] Create `src/mock/votes.json` (fake & non‑fake spread)

### State (Pinia)
- [x] Implement `useNewsStore` with state, getters, actions described in plan
- [x] `loadSeeds()` reads mock JSON; `hydrateFromLocalStorage()` merges session data
- [x] `persistToLocalStorage()` on vote/comment add
- [x] Vote status computation (majority or fallback to seed)

### Routing
- [x] Define routes: `/`, `/news/:id`, `/news/:id/vote`
- [x] Guard invalid `:id` → redirect to home

### Home Page (`/`)
- [x] `NewsFilter` (all/fake/non‑fake)
- [x] `PageSizeSelect` (5/10/20)
- [x] `NewsCard` shows: title, summary, status, reporter, reportedAt
- [x] `Pagination` controls (prev/next, current page)
- [x] Loading/skeleton while seeds hydrate
- [ ] Responsive layout tests

### Details Page (`/news/:id`)
- [x] `NewsHeader` (title, status, reporter, reportedAt)
- [x] `ImagePreview` (from imageUrl)
- [x] `VoteSummary` (fake vs non‑fake counts)
- [x] `CommentList` with pagination; empty state
- [x] Link/button to Vote page

### Vote Page (`/news/:id/vote`)
- [x] `VoteForm` with radio (fake/non‑fake)
- [x] Optional comment textarea + optional image URL input
- [x] Client validation (URL format optional)
- [x] On submit, update store; show toast; navigate to details

### UX/Styling
- [x] Global layout & header
- [x] Status badges and color system (Tailwind)
- [x] Focus states and accessible labels
- [x] Loading environment (skeleton or spinner)

### Storage & Session
- [x] LocalStorage keys: `afn.v1.votes`, `afn.v1.comments`
- [x] Merge logic on boot; clear strategy simple (no server persistence)

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


