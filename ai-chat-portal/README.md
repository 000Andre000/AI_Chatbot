# AI Chat Portal (LM Studio) — Starter ZIP

This repository is a starter full-stack project for the **AI Chat Portal** assignment.
It uses:
- Backend: Django REST Framework (REST-only)
- AI: LM Studio (local) — configured to `http://localhost:1234` by default
- Frontend: React (Vite) + Tailwind CSS

## What I included
- `backend/` : Django project with `chat` app (models, serializers, views, LM Studio adapter)
- `frontend/` : Vite + React + Tailwind frontend skeleton
- `sample_data/conversations.json` : sample conversations
- `.env.example` with LM Studio URL and DB placeholders

## How to run (backend)
1. Install Python dependencies:
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```
2. Configure `.env` (copy `.env.example` and edit).
3. Make sure Postgres is running and DATABASE settings match `.env`.
4. Run migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
5. Start Django server:
   ```bash
   python manage.py runserver
   ```

LM Studio: run locally (https://lmstudio.ai/) and ensure it exposes an HTTP endpoint compatible with the adapter (default `http://localhost:1234/v1/chat/completions`).

## How to run (frontend)
1. Install Node:
2. In `frontend/`:
   ```bash
   npm install
   npm run dev
   ```
3. Visit the UI (typically http://localhost:5173)

## Notes
- The `ai.py` file in `backend/chat` contains a simple LM Studio HTTP adapter.
- The `conversations/query/` endpoint is a placeholder — replace with embeddings + semantic search integration (pgvector/FAISS) for full functionality.
- No API keys are included. Use `.env` to configure LM Studio base URL if different from default.

Good luck — the structure is ready for you to extend and polish for the assignment submission.
