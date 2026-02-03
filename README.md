# Peak Fiber

A small ISP management dashboard and API used for development and demos. This repository contains a FastAPI backend and a React + Vite frontend.

---

## Quick start ⚡

### Backend (FastAPI)

1. Create a Python virtual environment and activate it:

   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```

2. Install dependencies (if you have a `requirements.txt`, use that; otherwise install the essentials):

   ```powershell
   pip install fastapi uvicorn sqlalchemy passlib
   ```

3. Run the backend:

   ```powershell
   uvicorn backend.main:app --reload --port 8000
   ```

4. Verify:
   - API root: http://localhost:8000
   - Reset & seed DB: http://localhost:8000/api/reset-db

---

### Frontend (React + Vite)

1. Change into the frontend folder and install:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

2. Open the dev URL displayed by Vite (usually http://localhost:5173).

---

## Consolidated Documentation

The following documentation files were consolidated into this README and removed from the repository to avoid duplication:

- `DATA_SEEDING_PART_2.md` (data seeding for deposits, promises, complaints, SMS bots)
- `DATA_SEEDING_UPDATE.md` (seeding for expenses and action queue)
- `INVENTORY_UPDATE.md` (detailed inventory seeding, API changes, UI notes)
- `STAFF_UPDATE.md` (staff seeding and profile pictures)
- `frontend/README.md` (Vite template notes)

If you need any of the original files restored, they are available in the Git history (if this is a Git repository).

---

## Useful endpoints

- GET / -> health check
- GET /api/dashboard/summary -> quick metrics
- GET /api/reset-db -> reset and re-seed the database (development use)
- See `backend/main.py` for a full list of available endpoints.

---

## Notes

- This repository is intended for development and demo purposes. Use with caution in production.
- For environment-specific setup (databases, secrets) add documentation or env files as needed.

---

Enjoy! ✅
