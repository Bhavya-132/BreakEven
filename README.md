# BreakEven

Full-stack Next.js MVP for BreakEven.

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Demo flow

1. Start with demo data.
2. Confirm income + recurring bills.
3. Choose a mode.
4. Generate Fast + Steady plans.
5. Explore the plan detail view.

## API routes

- `POST /api/v1/nessie/connect`
- `GET /api/v1/profile`
- `GET /api/v1/transactions`
- `POST /api/v1/goal`
- `POST /api/v1/plan/generate`
- `GET /api/v1/plan/:planId`
