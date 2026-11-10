# Capsicum · Campus POS Dashboard

Admin dashboard for the Capsicum Culinary Studio campus deli POS. Tracks card
transactions from each campus terminal, with payments, volume and menu analytics.

## Pages

- **Dashboard** — today's KPIs vs. the same time last week, hourly sales, campus breakdown, and a filterable, paginated transaction history with CSV export
- **Metrics** — payments, volume and product analytics for the last 7 days, 30 days or all time
- **User Management** — cashiers and supervisors, with approval flow for new accounts
- **Brand Management** — campuses, terminals and per-campus trading

## Demo data

All data is generated in `src/data/mockTransactions.ts` from a seeded random
generator, so it's identical on every load. It covers the 45 days up to
**Tuesday 10 November 2026, 10:00** (Mon–Fri 07:00–16:00, Saturday mornings,
closed Sundays).

The demo "current time" lives in `src/lib/demoClock.ts`:

```ts
export const DEMO_NOW = new Date(2026, 10, 10, 10, 0, 0);
```

Change it to `new Date()` to have the data always end at the real current time.

The deli menu and campuses are in `src/data/menu.ts` (shared with the POS).

## Branding

- Theme tokens are in `src/index.css` — neutral ink/white surfaces with Capsicum red (`--brand`) used as an accent only
- Logos: `src/assets/capsicum-logo-dark.png` (for light backgrounds), `capsicum-logo-light.png` (for dark backgrounds), `capsicum-pepper.png` (icon)
- Light and dark mode via the toggle in the top bar

## Running locally

```powershell
npm install
npm run dev
```

Then open http://localhost:8080.

## Stack

Vite · React · TypeScript · Tailwind CSS · shadcn/ui · Recharts · date-fns
