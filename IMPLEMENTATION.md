# Peak Fiber — Implementation & UI Flow (Detailed)

This document maps the user flows, UI behavior, button actions, and relationships between screens in the Peak Fiber project. It references actual components and backend endpoints so you can trace how each user action propagates through the system.

---

## Project entry points

- Frontend entry: `frontend/src/main.jsx` → `App.jsx` (routing, auth gating).
- Backend entry: `backend/main.py` (FastAPI endpoints).

Routing summary (in `App.jsx`):

- Public: `/` (Landing), `/login` (Login)
- Authenticated (Layout + Sidebar): `/dashboard`, `/connections`, `/inventory`, `/staff`, `/areas`, `/queue`, `/expenses`, `/banks`, `/deposits`, `/promises`, `/vouchers`, `/sms-bots`, `/complaints`, `/database-admin`, etc.
- `Inventory` has child route: `/inventory/:category` → `InventoryDetail.jsx`.

Auth gating: `App.jsx` holds `user` state. If `user == null` the app shows Landing & Login; after successful login `setUser()` and app navigates to `/dashboard` and Layout is rendered.

---

## Shared UI primitives

- `Layout.jsx` — top bar and wrapper for authenticated pages; shows `user` info and contains `Sidebar.jsx` navigation.
- `Sidebar.jsx` — static nav items mapping to page routes. Clicking navigates to the corresponding page.
- `Modal.jsx` — universal modal component used across pages for forms and confirmations.

---

## High-level user flow: Landing → Login → Dashboard

1. Landing (`Landing.jsx`)
   - Buttons: `Operations Login` and `Get Started` both navigate to `/login`.
   - Reason: simple marketing/entry point for operations users.

2. Login (`Login.jsx`)
   - Fields: Operator ID, Password, Organization Code.
   - On submit: POST `/api/login` with { username, password, companyCode }.
   - On success: `setUser(data.user)` and navigate to `/dashboard`.
   - Fallback: hardcoded dev credential (`mzahidtalib`) that also navigates to `/dashboard`.

3. Dashboard (`Dashboard.jsx`)
   - Loads `/api/dashboard/summary` to populate summary tiles.
   - Shows module tiles (Connections, Inventory, Staff, etc.). Clicking a tile navigates to that module's route.
   - Reason: single-pane launchpad for operational tasks.

---

## Page-by-page interactions, important buttons, and relationships

Note: all network requests are performed against the backend running at `http://localhost:8000` in dev.

### Connections (`Connections.jsx`)

- On load: GET `/api/connections`, `/api/isps`, `/api/areas`, `/api/staff`.
- Search & Filter: client-side filtering of fetched connections.
- New Connection ("New Connection" button): opens Modal → POST `/api/connections` with connection body.
  - Result: adds connection record; re-fetches lists (UI updates).
- Pay Bill (row action): opens Pay modal → POST `/api/connections/{id}/pay` with { amount, staff_id }.
  - Backend updates expiry (adds 30 days) and, if staff_id supplied, increments staff.cash.
  - UI re-fetches connections + alerts success.
- WhatsApp button: opens `https://wa.me/...` with a templated message.
- Print Receipt (row action): renders printable bill snippet and triggers `window.print()`.

Relationships:

- Payment updates both the Connection (expiry/status) and Staff (cash). That cash can later be reconciled with DepositRequests.

---

### Action Queue (`ActionQueue.jsx`)

- On load: GET `/api/action-queue`.
- Create Task: modal → POST `/api/action-queue`.
- Complete Task: calls POST `/api/action-queue/{id}/complete` with optional `{ serial_number }`:
  - If `serial_number` provided, backend sets the matching `InventoryItem.status = 'IN_USE'` (inventory updated).
  - Task status is set to `Approved`. UI refreshes queue.

Relationship:

- Action Queue links to Inventory (deploying hardware by serial number).

---

### Inventory (`Inventory.jsx`) & Inventory Detail (`InventoryDetail.jsx`)

- Inventory list: GET `/api/inventory/summary` (counts by category).
- Click category → navigate to `/inventory/:category`.
- Inventory Detail load: GET `/api/inventory/{category}` → returns { items, summary }.
- Add Stock: modal → POST `/api/inventory` with { category, name, serial_number, status }.
  - Backend stores item, affects `summary` counts.
- Status options: `IN_STOCK`, `IN_USE`, `FAULTY`, `NON_WORKABLE` (legacy support for `WORKABLE`, `USED`).

Relationships:

- Inventory items are marked `IN_USE` when associated with an ActionQueue completion.

---

### Staff (`Staff.jsx`)

- GET `/api/staff` to list staff members.
- Add Staff: modal → POST `/api/staff` with { name, phone, role, cash }.
- Collect (reset cash) button: POST `/api/staff/{id}/reset-cash` → sets `cash = 0`.

Relationship:

- Staff cash is incremented when connections are paid (Connections page). Staff cash, together with DepositRequests, is used for reconciliations.

---

### Complaints (`Complaints.jsx`)

- GET `/api/complaints` + `/api/staff`.
- Create Ticket: POST `/api/complaints`.
- Assign staff: PUT `/api/complaints/{id}` with `{ assigned_to, status: 'ASSIGNED' }`.
- Confirm fix: PUT `/api/complaints/{id}` with `{ status: 'CLOSED' }`.

Relationship:

- Complaint lifecycle: OPEN → ASSIGNED → CLOSED.
- Assigned staff is chosen from `/api/staff`.

---

### Promises (`Promises.jsx`)

- GET `/api/promises`.
- Create Promise: POST `/api/promises` with due_date and comments.
- Settle: POST `/api/promises/{id}/settle` — marks promise as settled.
- WhatsApp reminder uses a templated message (external link).

---

### Vouchers (`Vouchers.jsx`)

- GET `/api/vouchers`.
- Generate batch: POST `/api/vouchers` with { amount, count, isp_name, assigned_to, expiry_date }.
- Vouchers can be copied to clipboard using `navigator.clipboard`.

---

### Deposit Requests (`DepositRequests.jsx`)

- GET `/api/deposit-requests` and `/api/banks`.
- Create request (staff reports deposit to bank): POST `/api/deposit-requests`.
- Approve / Reject: PUT `/api/deposit-requests/{id}/action` with `{ status }`.

Relationship:

- When approved, deposit amounts contribute to reconciled bank totals (displayed in the right-hand summary).

---

### Expenses (`Expenses.jsx`)

- GET `/api/expenses`, GET `/api/staff`.
- Create expense: POST `/api/expenses` with { date, type, amount, comments, staff_name }.
- Dashboard shows aggregated expense totals.

---

### SMS Bots (`SMSBots.jsx`)

- GET `/api/sms-bots`.
- Register bot: POST `/api/sms-bots`.
- UI shows logs, online status, test & sync actions (these are currently UI-level operations or mock calls).

---

### Database Administration (`DatabaseAdmin.jsx`)

- Lists server endpoints for various tables (example `/api/connections`, `/api/staff`, etc.).
- `fetchTableData()` executes GET to selected table endpoint and renders rows.
- Actions: View record (modal), Delete record → DELETE `{endpoint}/{id}`.

Reason: convenience tool to explore & maintain seeded dev data quickly.

---

## Data & Backend mapping (summary)

- Connections: `/api/connections` (GET, POST), `/api/connections/{id}/pay` (POST)
- Users: `/api/users` (GET)
- ISPs: `/api/isps` (GET, POST)
- Inventory: `/api/inventory/{category}` (GET), `/api/inventory` (POST), `/api/inventory/summary` (GET)
- Staff: `/api/staff` (GET, POST), `/api/staff/{id}/reset-cash` (POST)
- Action Queue: `/api/action-queue` (GET, POST), `/api/action-queue/{id}/complete` (POST)
- Complaints, Promises, Vouchers, Deposits, Expenses, Banks, SMS Bots: standard CRUD endpoints exist and are used by the frontend pages.

(See `backend/main.py` for exact handlers.)

---

## Example end-to-end scenario (detailed)

Scenario: new customer signup and first payment

1. Operator logs in → `/login` → POST `/api/login` → navigate to `/dashboard`.
2. Dashboard → Click `Connections` tile → `/connections` loads current ISPs/areas.
3. Click `New Connection` → fill modal → POST `/api/connections`.
4. Operator collects monthly fee → click `Pay` icon → choose staff collector and amount → POST `/api/connections/{id}/pay`:
   - Backend extends expiry_date by 30 days and increments staff.cash.
5. Operator opens `Deposit Requests` → creates `New Request` to deposit staff collections to bank → POST `/api/deposit-requests`.
6. Bank admin `Approve` the deposit → this reconciles deposits in the system and reduces `missing_amount` on dashboard summary.

```mermaid
sequenceDiagram
  participant U as User (Operator)
  participant FE as Frontend (Browser)
  participant BE as Backend (FastAPI)
  participant DB as Database (SQLite)
  participant Bank as BankAdmin

  U->>FE: Login / Navigate to Dashboard
  FE->>BE: POST /api/login {username, password}
  BE-->>FE: 200 OK (user)

  U->>FE: Open Connections → Click "New Connection"
  FE->>BE: POST /api/connections {connection data}
  BE->>DB: INSERT connection
  DB-->>BE: 201 Created
  BE-->>FE: 201 Created (new connection)

  U->>FE: Click "Pay" on connection
  FE->>BE: POST /api/connections/{id}/pay {amount, staff_id}
  BE->>DB: update expiry_date; if staff_id -> update staff.cash
  DB-->>BE: success
  BE-->>FE: 200 OK (payment processed)

  U->>FE: Create deposit request (staff deposits cash to bank)
  FE->>BE: POST /api/deposit-requests {amount, details, bank_id}
  BE->>DB: INSERT deposit_request (status=Pending)
  DB-->>BE: 201 Created
  BE-->>FE: 201 Created (pending)

  Bank->>BE: PUT /api/deposit-requests/{id}/action {status: Approved}
  BE->>DB: update deposit_request.status = Approved
  DB-->>BE: success
  BE-->>FE: deposit status updated; Dashboard recalculated
```

Inventory tie-in (hardware deployment):

- If deployment task requires hardware, create `ActionQueue` task. When completing the task, provide `serial_number` which updates `InventoryItem.status` to `IN_USE`.

---

## Testing & Debugging tips

- Run backend with: `uvicorn backend.main:app --reload --port 8000`.
- Reset and seed dev DB: `GET /api/reset-db` (seeds sample data used by frontend).
- Use `DatabaseAdmin` page to inspect table contents quickly.
- Watch console for fetch errors (frontend will alert on failed network ops).

---

## Where to extend (suggestions)

- Add route-level auth (tokens / sessions) instead of client-side `user` boolean.
- Add optimistic UI states & centralized stores (Context / Redux / Zustand) to reduce repeated fetches.
- Add E2E tests (Cypress / Playwright) for critical flows: login → new connection → payment → deposit.
- Add webhooks or events for deposits/payments to trigger notifications / reconciliation workflows.

---


