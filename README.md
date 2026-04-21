# smooothop

Hackathon starter ottimizzato per Codex: Next.js 16 full-stack, Supabase-ready, Vercel-ready, test base e workflow pensato per iterare velocemente senza perdere qualita.

## Stack scelto

- Next.js 16 con App Router e Route Handlers
- React 19 + TypeScript strict
- Tailwind CSS 4
- Supabase via `@supabase/supabase-js` e `@supabase/ssr`
- Deploy target: locale o Vercel
- Testing: Vitest + Testing Library + Playwright
- Env validation: `@t3-oss/env-nextjs` + `zod`

## Comandi utili

```bash
npm run dev
npm run check
npm run test
npm run test:e2e
npm run build
```

## Variabili ambiente

Copia `.env.example` in `.env.local` e riempi i valori necessari.

```bash
cp .env.example .env.local
```

Variabili principali:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Il progetto parte anche senza Supabase configurato, ma mostrera lo stato come incompleto e i client Supabase lanceranno un errore esplicito se invocati senza env valide.

## Workflow consigliato per hackathon

1. Parti da un vertical slice end-to-end.
2. Valida l'idea in homepage o `README` prima di aprire troppe feature.
3. Tieni backend leggero: Route Handlers o Server Actions, niente microservizi prematuri.
4. Usa Supabase per auth, db e storage solo quando servono davvero.
5. Esegui `npm run check` spesso e `npm run test:e2e` sui flussi principali prima del deploy.

## Struttura chiave

- `src/app` UI, route handlers e pagine
- `src/lib/env.ts` env validation centralizzata
- `src/lib/supabase/*` helper browser/server/admin
- `src/components` componenti riusabili
- `src/test` setup test
- `playwright.config.ts` E2E base
- `AGENTS.md` ruoli consigliati e workflow per Codex

## Skill installate

- `supabase`
- `next-best-practices`

Riavvia Codex per renderle disponibili in nuove sessioni.
