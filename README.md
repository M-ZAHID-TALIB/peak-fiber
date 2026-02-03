# Peak Fiber 🚀

**Peak Fiber** is a lightweight ISP management dashboard and API used for development, demos, and early-stage testing. It includes a FastAPI backend and a React + Vite frontend with example seed data and helpful developer tools.

---

## 🔍 Highlights

- FastAPI backend (REST endpoints & DB seeding)
- React + Vite frontend (component-based UI)
- Seeded demo data for staff, inventory, connections, expenses, and more
- Simple single-file SQLite DB for local development

---

## Quick start ⚡

> These steps assume you are on Windows (PowerShell); adjust commands for macOS/Linux.

### Backend (FastAPI)

1. Create & activate a virtual environment:

   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```

2. Install Python dependencies (or use your `requirements.txt`):

   ```powershell
   pip install -r backend/requirements.txt
   # or
   pip install fastapi uvicorn sqlalchemy passlib
   ```

3. Run the backend:

   ```powershell
   uvicorn backend.main:app --reload --port 8000
   ```

4. Useful local endpoints:
   - API root: http://localhost:8000/
   - Reset & seed DB: http://localhost:8000/api/reset-db

---

### Frontend (React + Vite)

1. Install and start the dev server:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

2. Open the URL shown by Vite (usually http://localhost:5173).

---

## Configuration & Environment

- Database: `peakfiber.db` (SQLite) by default. Change DB settings in `backend/database.py` if needed.
- Secrets: add any production secrets or API keys using environment variables (recommended) instead of committing them.

---

## Key files & structure 🔧

- `backend/` — FastAPI app, models, seeds, and DB helpers
- `frontend/` — React + Vite app and UI components
- `README.md` — This file

---

## Common commands

- Start backend: `uvicorn backend.main:app --reload --port 8000`
- Start frontend: `cd frontend && npm run dev`
- Reset DB and re-seed (dev): `GET /api/reset-db`

---

## API (examples)

- GET `/api/dashboard/summary` — basic metrics
- GET `/api/staff` — list staff
- POST `/api/staff` — create staff
- GET `/api/inventory/{category}` — inventory by category

(See `backend/main.py` for the full list of endpoints.)

---

## Contributing 🤝

- Please open issues or pull requests for fixes and improvements.
- Add tests where possible and keep changes small and focused.
- Consider adding a `CONTRIBUTING.md` and `CODE_OF_CONDUCT.md` for larger contributions.

---

## License

Add a `LICENSE` file to the repository root (e.g., `MIT`, `Apache-2.0`, or `GPL-3.0`). Once you pick a license I can add it and update this README with a license badge.

---

## Contact

For questions or help, open an issue or reach out to the project maintainer.

---

Thank you for using Peak Fiber — enjoy! ✅
