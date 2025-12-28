# BaddieIn

BaddieIn is a tongue-in-cheek “dating scout” that turns LinkedIn searches into collectible trading-card packs. A neon-drenched Vite + React frontend lets you complete a short preference survey, crack open boosted packs of candidates, curate a roster, and even auto-draft slick DMs. A FastAPI backend does the heavy lifting by orchestrating PhantomBuster scrapes, caching results in MongoDB, calling a Hugging Face beauty classifier, and piping everything through Google Gemini for AI-assisted icebreakers.

## Core Features

- **Survey-gated onboarding** – guide users through industry / major / school / gender preferences before unlocking packs.
- **Pack opening experience** – fetches LinkedIn prospects from cached PhantomBuster data, dedupes against the roster, and renders them as rarity-tiered cards.
- **Roster management** – liked cards persist in local storage and stay excluded from future packs; optional delete endpoint cleans cached entries.
- **AI helpers** – Gemini-backed endpoints generate profile summaries, conversation starters, draft DMs (multiple tones), and satirical “probably…” one-liners.
- **Beauty scoring (experimental)** – optional Hugging Face inference endpoint that estimates attractiveness ratings per gender.
- **Social sleuthing stub** – placeholder API for guessing additional socials by name/company/location.

## System Overview

- `client/` – Vite + React 18 SPA with Tailwind styling, animated pack opening, roster, and message composer tabs.
- `server/` – FastAPI app with routes for PhantomBuster launches/cache, AI flows, Hugging Face scoring, and Mongo-backed persistence.
- `docker-compose.yml` – spins up the frontend (Nginx) and backend (Uvicorn) together once credentials are provided.

### Data Flow Highlights

1. Survey answers call `/phantombuster/search-cache`, which reuses MongoDB-cached CSV exports or re-launches PhantomBuster agents when necessary.
2. Responses are normalized into card payloads (name, headline, company, rarity, interests, LinkedIn URL, etc.) and sent back to the client.
3. AI requests hit Gemini (`/api/ai-overview`, `/api/draft-message`, `/api/satirical-insights`) to contextualize cards or generate outreach.
4. Optional `/beauty-score` posts an image to a Hugging Face Space for grading.

## Local Development

### Prerequisites

- Node.js 18+
- Python 3.11+
- Optional: Docker 24+ (for containerized runs)

### Environment Variables

Set these in a `.env` (frontend uses `VITE_` prefixes, backend loads via `python-dotenv` and Docker):

- `GEMINI_API_KEY` – required for AI-powered routes.
- `PHANTOMBUSTER_API_KEY`, `PHANTOMBUSTER_SEARCH_AGENT_ID`, `PHANTOMBUSTER_SESSION_COOKIE` – needed to launch and poll PhantomBuster agents.
- `MONGODB_URI` / `MONGODB_DB` / `MONGODB_COLLECTION` – MongoDB connection used to cache PhantomBuster CSV results.
- Optional tuning knobs: `PHANTOMBUSTER_CATEGORY`, `PHANTOMBUSTER_SEARCH_TYPE`, `PHANTOMBUSTER_CONNECTION_DEGREES`, `PHANTOMBUSTER_LINES_PER_LAUNCH`, `PHANTOMBUSTER_RESULTS_PER_LAUNCH`, `PHANTOMBUSTER_RESULTS_PER_SEARCH`, `PHANTOMBUSTER_ENRICH`, `PHANTOMBUSTER_LINKEDIN_SEARCH_URL`, `PHANTOMBUSTER_IDENTITY_ID`, `PHANTOMBUSTER_USER_AGENT`, `VITE_API_BASE_URL`.

### Frontend

```bash
cd client
npm install
npm run dev
```

The dev server defaults to `http://localhost:5173`. Configure the API host via `VITE_API_BASE_URL` (defaults to `http://localhost:8000`).

### Backend

```bash
cd server
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The FastAPI docs live at `http://127.0.0.1:8000/docs`.

### Docker Compose (optional)

```bash
docker compose up --build
```

Expose the frontend at `http://localhost:3000` (Nginx) and backend at `http://localhost:8000`. Supply the same environment variables in your shell or a `.env` file so both services can authenticate and share configuration.

## Additional Docs

- `PHANTOMBUSTER_SETUP.md` / `PHANTOMBUSTER_QUICK_START.md` – provisioning tips for PhantomBuster.
- `PHANTOMBUSTER_CONFIG_FIX.md` – troubleshooting reference for PhantomBuster agents.
- `DOCKER_INSTRUCTIONS.md` – more detailed container notes.
