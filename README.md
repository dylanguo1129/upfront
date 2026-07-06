# Upfront

Canada's premium-cabin award-travel workspace. **Fly up front for the price of the back.**

A fully static, client-side app: the two real engines (award search + Canadian card recommendation) and the earn-to-burn orchestration all run **in your browser**. No backend, no tracking, no data leaves your machine.

**Live:** https://dylanguo1129.github.io/upfront/

## What it does

- **Search** — award-seat search across alliances and programs, with a 0 to 100 deal score, miles, taxes, and a cash comparison. (Seatwise engine.)
- **Cards** — plan the exact Canadian cards to reach a program, browse the 70-card catalogue, and trace how bank points transfer to airlines. Commission-blind. (Next Best Card engine.)
- **Plan** — the full earn-to-burn pipeline: pick the best bookable, fundable award, back-solve the card plan, price the value, and clear an adversarial GO / NO-GO gate.

## Accounts and security

Create an account to use the workspace. Passwords are hashed in the browser with **PBKDF2 (SHA-256, 210,000 iterations)** and a random 16-byte salt, and are never stored in plain text. Accounts and saved engagements live in this browser's `localStorage` only. This is a client-side demo auth, appropriate for a static site; a production deployment would move accounts to a real backend.

## Honest notes

Award availability is **simulated**, modelled on real 2026 award charts and release behaviour. Nothing here books a real ticket. Every dollar and point shown is computed by the engines, not estimated.

## Tech

Zero build step. Plain ES modules: `engine/` holds the ported engines (pure JS, data inlined), `index.html` is the app and the auth layer. Deployed on GitHub Pages from `main`.
