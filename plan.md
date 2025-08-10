## Project Plan – Social Anti‑Fake News System (Vue + Vite + Tailwind, Vercel)

### Observations (from the provided project brief)
- Build a Social Anti‑Fake News system where users can:
  - Submit news and see a list of news items with filters (all/fake/non‑fake).
  - View details for a news item with full description and an image URL.
  - See comments and votes with pagination.
  - Vote fake/not‑fake and add a comment (and optional image URL).
- No POST to a server; new votes/comments must persist only within the SPA session (use browser storage).
- Provide enough mock data to meaningfully test pagination.
- Use proper layout, responsiveness, routing, Tailwind, and (per rubric) Pinia for shared state.
- Deploy to Vercel and provide README with team details, deployed URL, and demo video link.

### Assumptions
- No backend/database; persistence is limited to `localStorage` (clears on reload if desired by rubric wording).
- We will include a simple mock dataset locally (JSON import) large enough for pagination (≥ 50 news items, comments per item).
- Framework stack: Vue 3 + Vite, Vue Router, Pinia, Tailwind CSS. JavaScript (not TypeScript) for speed of delivery.
- Image fields are URLs; no file uploads.

### Goals and Non‑Goals
- Goals: Fully functional SPA with list, detail, voting, comments, filters, pagination, responsive UI, and Vercel deployment.
- Non‑Goals: Authentication, server‑side persistence, moderation workflows, advanced analytics.

### High‑Level Architecture
- App shell: Vue 3 app bootstrapped by Vite.
- State: Pinia store `useNewsStore` manages news, votes, comments, filters, pagination, and `localStorage` sync.
- Routing (Vue Router):
  - `/` – Home (list, filters, page size, pagination)
  - `/news/:id` – Details (full content, image, votes/comments list with pagination)
  - `/news/:id/vote` – Vote & comment form
- UI: Tailwind CSS for layout, responsive design, and utility classes.
- Data: `mock/news.json` (news list with summaries), `mock/comments.json` (seed comments), `mock/votes.json` (seed votes). Store merges seeds with ephemeral user session updates from `localStorage`.

### Data Model (in app state)
- News
  - id: string
  - title: string
  - summary: string
  - content: string
  - isFake: boolean (derived from vote tallies or pre‑seeded status for initial view)
  - reporterName: string
  - reportedAt: ISO string
  - imageUrl: string
- Vote
  - id: string
  - newsId: string
  - isFake: boolean
  - createdAt: ISO string
- Comment
  - id: string
  - newsId: string
  - text: string
  - imageUrl?: string
  - createdAt: ISO string

### Pinia Store Design (`useNewsStore`)
- state
  - news: News[]
  - votesByNewsId: Record<string, Vote[]>
  - commentsByNewsId: Record<string, Comment[]>
  - listFilter: 'all' | 'fake' | 'nonfake'
  - listPage: number
  - listPageSize: number (e.g., [5, 10, 20])
  - detailCommentsPageByNews: Record<string, number>
  - detailCommentsPageSize: number (e.g., 5 or 10)
- getters
  - filteredNews
  - pagedNews
  - voteCountsByNewsId (returns { fakeCount, nonFakeCount })
  - computedStatusByNewsId (fake/non‑fake based on votes threshold or majority)
- actions
  - loadSeeds()
  - hydrateFromLocalStorage()
  - persistToLocalStorage()
  - setFilter(filter)
  - setPage(page), setPageSize(size)
  - addVoteAndOptionalComment({ newsId, isFake, text?, imageUrl? })
  - getCommentsPage(newsId, page)

### Pages & Components
- Home (`/`)
  - Components: `NewsFilter`, `PageSizeSelect`, `NewsCard`, `Pagination`
  - Features: filter (all/fake/non‑fake), page size selector, responsive cards, status badge, reporter & timestamp
- Details (`/news/:id`)
  - Components: `NewsHeader`, `StatusBadge`, `ImagePreview`, `VoteSummary`, `CommentList`, `Pagination`, `LinkToVote`
  - Features: full content, image URL preview, votes summary, comments with pagination
- Vote (`/news/:id/vote`)
  - Components: `VoteForm`
  - Features: choose fake/non‑fake, optional comment & image URL, submit; on submit update store and redirect to details

### UI/UX & Accessibility
- Responsive layout with Tailwind; ensure keyboard accessible controls, labeled inputs, and visible focus rings.
- Clear badges for status (fake/non‑fake), empty states, and toast/snackbar on successful vote.
- Provide a simple loading/skeleton environment (even though data is local) to meet rubric.

### Pagination Strategy
- Home list: client‑side paginate `filteredNews` with `listPage` and `listPageSize`.
- Comments: per‑news pagination using `detailCommentsPageByNews[newsId]`.

### Filtering Strategy
- `listFilter` values:
  - `all`: include all news
  - `fake`: items where majority votes mark fake (or pre‑seeded isFake true when no votes)
  - `nonfake`: inverse
- Status badge derived from votes if any; otherwise from seeded `isFake`.

### Storage (no POST)
- Use `localStorage` keys (e.g., `afn.v1.votes`, `afn.v1.comments`) to persist user session additions.
- On app init: `loadSeeds()` then `hydrateFromLocalStorage()` and compute view models.

### Mock Data Plan
- `mock/news.json`: ≥ 50 news items (varied reporters, dates, and topics) to ensure pagination coverage.
- `mock/comments.json`: 5–20 comments per item across dataset to exercise comment pagination.
- `mock/votes.json`: a spread to create both fake and non‑fake distributions.

### Routing & Navigation
- Top‑level nav allows Home; from `NewsCard` → Details; from Details → Vote.
- Sub‑routing satisfies rubric item about sub routing.

### Tailwind Setup
- Install Tailwind via PostCSS config; add `content` paths for Vue components.
- Use utility classes for all layout; include dark‑mode friendly colors if desired.

### Deployment (Vercel)
- Build command: `npm run build` (Vite)
- Output dir: `dist`
- Framework preset: Vite
- Configure project through Vercel dashboard or `vercel` CLI.

### QA Checklist (mapped to rubric)
- Mock data sufficient for list & comment pagination.
- Layout responsive and consistent across pages; resembles lab’s Event app skeleton.
- List shows required fields; page size control works; pagination works.
- Filters for fake/non‑fake work correctly.
- Details show full content, image preview, status, reporter, timestamp.
- Comments & votes list with pagination; new submissions appear immediately.
- Voting page updates Pinia and the counts; optional comment/image supported.
- Tailwind used project‑wide; basic loading/skeleton provided.
- Deployed to Vercel; README includes team, video, and deployed URL.

### Execution Timeline (suggested)
1) Scaffold & tooling (Vite, Tailwind, Router, Pinia) – 0.5 day
2) Data models & Pinia store with seeds and `localStorage` – 0.5 day
3) Home page (list, filter, pagination, page size) – 0.5–1 day
4) Details page (content, votes summary, comments pagination) – 0.5–1 day
5) Vote page (form + store integration) – 0.5 day
6) Polish (loading skeletons, accessibility, responsive QA) – 0.5 day
7) Deploy to Vercel, write README, record demo – 0.5 day


