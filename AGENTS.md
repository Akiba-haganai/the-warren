# AGENTS.md — Git & Deployment Rules

## Git & Deployment Rules
- NEVER run `git push` to `main` or `master` without explicit user confirmation in the current session.
- Always work on a feature branch per phase or feature (e.g., `feature/podcast-player-overhaul`), and stop after committing locally.
- Only push when the user explicitly instructs "push this" or "ship it".
- Do not assume a completed phase means it should go live — multi-phase features stay on a feature branch until the user explicitly approves merging and pushing to main.
