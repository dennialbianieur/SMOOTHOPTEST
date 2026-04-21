<!-- BEGIN:nextjs-agent-rules -->

# smooothop Agent Guide

Questo progetto ottimizza la velocita di esecuzione per hackathon, ma non sacrifica chiarezza o basi tecniche.

## Default stack

- Next.js 16 App Router
- React 19
- Route Handlers o Server Actions per il backend
- Supabase per database, auth e storage
- Vercel come target di deploy principale

## Working agreements

- Costruisci vertical slice piccoli e dimostrabili.
- Preferisci una codepath unica full-stack prima di introdurre astrazioni.
- Metti tutta la validazione env in `src/lib/env.ts`.
- Non accedere a Supabase direttamente dai componenti senza passare dai client helper.
- Prima di chiudere una feature, esegui `npm run check`.
- Prima di un demo deploy, esegui almeno `npm run build`.

## Suggested agent roles

1. `product-scout`
   Definisce idea, utente target, proposta di valore, acceptance criteria e demo flow.
2. `frontend-builder`
   Costruisce landing, dashboard, onboarding e stati vuoti con UI chiara e presentabile.
3. `backend-builder`
   Implementa route handlers, server actions, integrazioni esterne e logica applicativa.
4. `data-builder`
   Disegna schema Supabase, RLS, seed data e convenzioni dei dati.
5. `qa-deployer`
   Cura smoke test, Playwright, build, env e deploy Vercel.

## Codex heuristics

- Se una decisione non cambia la demo, scegli l'opzione piu semplice.
- Se una feature non e testabile in 5 minuti, spezzala.
- Se un componente deve leggere dati sensibili, spostalo lato server.
- Se serve una nuova integrazione, crea prima una route di health o smoke.

## Next.js 16 note

Questa non e la Next.js del training statico: alcune API sono cambiate. Usa i pattern App Router moderni, evita Pages Router e tratta `cookies()` e `headers()` come async lato server.

<!-- END:nextjs-agent-rules -->
