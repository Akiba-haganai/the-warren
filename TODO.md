# Task TODO

- [x] Update Contact page to the polished, defensive `Contact.tsx` with real email, DM section, and improved form initialization.
- [x] Update CampusShowcase "Learn more" button to point to `https://warren-campus.vercel.app` (external).
- [x] Update MarketShowcase "learn more / visit" behavior to point to `https://warren-market.vercel.app` (external) (no more /contact redirects).

- [x] Replace `src/pages/Products.tsx` with the richer, consistent version (Warren Campus / Warren Connect / Warren Podcasts, plus features & trust cues) while preserving data flow.
- [ ] Replace `src/pages/Ecosystem.tsx` with the AI-removed version including realistic products + statuses.

- [ ] Ensure no `npm run build` is executed; run lightweight `npm test`/`npm run lint` only if already available/fast.

- [ ] Verify imports/types compile by running `npm run typecheck` if present, otherwise `npm run lint`.

