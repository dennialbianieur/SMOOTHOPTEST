import { StatusPill } from "@/components/status-pill";
import { env, hasSupabaseConfig, hasSupabaseServiceRole } from "@/lib/env";

export default function Home() {
  const tracks = [
    "Single Next.js codebase for frontend + backend",
    "Supabase-ready clients for browser, server, and admin work",
    "Vercel-friendly defaults with typed routes and health endpoint",
    "Vitest + Playwright already wired for fast feedback loops",
  ];

  const agentRoles = [
    "Product scout: narrow the idea and lock a winning demo flow.",
    "Frontend builder: turn the demo flow into a sharp UI fast.",
    "Backend builder: own route handlers, server actions, and external APIs.",
    "Data builder: shape Supabase schema, policies, and seed data.",
    "QA deployer: protect the demo with smoke tests, build checks, and deployment polish.",
  ];

  const nextSteps = [
    "Define the one-line pitch and the demo path before building feature two.",
    "Add Supabase env vars and model the first table around the core user action.",
    "Ship one full loop end-to-end, then add delight and automation.",
  ];

  return (
    <main className="grid-fade relative overflow-hidden">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 sm:px-10 lg:px-12">
        <section className="glass-card border-border relative overflow-hidden rounded-[2rem] border px-6 py-8 sm:px-8 lg:px-10">
          <div className="from-accent to-accent-secondary absolute inset-x-0 top-0 h-1 bg-gradient-to-r via-orange-300" />
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              <StatusPill label="Hackathon mode" />
              <StatusPill label="Next 16" tone="ready" />
              <StatusPill
                label={
                  hasSupabaseConfig ? "Supabase-ready" : "Supabase pending"
                }
                tone={hasSupabaseConfig ? "ready" : "pending"}
              />
            </div>
            <span className="border-border bg-card-strong text-muted rounded-full border px-4 py-2 font-mono text-xs">
              {env.NEXT_PUBLIC_APP_URL}
            </span>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-8">
              <div className="space-y-5">
                <p className="text-muted font-mono text-sm tracking-[0.3em] uppercase">
                  smooothop / launchpad
                </p>
                <h1 className="max-w-3xl text-5xl leading-[0.94] font-semibold tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                  Build fast, ship calm, and keep the demo story crisp.
                </h1>
                <p className="text-muted max-w-2xl text-lg leading-8 sm:text-xl">
                  This repo is tuned for vibe coding in Codex: one full-stack
                  app, clean env boundaries, Supabase integration points, and
                  just enough testing to protect the wow moment.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {tracks.map((track) => (
                  <article
                    key={track}
                    className="border-border bg-card-strong rounded-[1.5rem] border p-5"
                  >
                    <p className="text-foreground/90 text-base leading-7">
                      {track}
                    </p>
                  </article>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  className="bg-accent rounded-full px-5 py-3 font-semibold text-white transition-transform hover:-translate-y-0.5"
                  href="https://vercel.com/new"
                  target="_blank"
                  rel="noreferrer"
                >
                  Deploy on Vercel
                </a>
                <a
                  className="border-border bg-card-strong rounded-full border px-5 py-3 font-semibold transition-transform hover:-translate-y-0.5"
                  href="/api/health"
                >
                  Check health route
                </a>
              </div>
            </div>

            <aside className="flex flex-col gap-4">
              <div className="border-border bg-card-strong rounded-[1.75rem] border p-6">
                <p className="text-muted mb-4 font-mono text-xs tracking-[0.28em] uppercase">
                  Environment
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <span>Frontend</span>
                    <StatusPill label="Ready" tone="ready" />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Backend</span>
                    <StatusPill label="Ready" tone="ready" />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Supabase public env</span>
                    <StatusPill
                      label={hasSupabaseConfig ? "Configured" : "Missing"}
                      tone={hasSupabaseConfig ? "ready" : "pending"}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Service role</span>
                    <StatusPill
                      label={hasSupabaseServiceRole ? "Configured" : "Optional"}
                      tone={hasSupabaseServiceRole ? "ready" : "accent"}
                    />
                  </div>
                </div>
              </div>

              <div className="border-border rounded-[1.75rem] border bg-[#13110f] p-6 text-stone-100">
                <p className="mb-4 font-mono text-xs tracking-[0.28em] text-stone-400 uppercase">
                  Quick loop
                </p>
                <pre className="overflow-x-auto font-mono text-sm leading-7 text-stone-200">
                  <code>{`npm run dev
npm run check
npm run test:e2e
npm run build`}</code>
                </pre>
              </div>
            </aside>
          </div>
        </section>

        <section className="grid gap-6 py-8 lg:grid-cols-[1fr_1fr]">
          <article className="glass-card border-border rounded-[2rem] border p-7">
            <p className="text-muted mb-5 font-mono text-xs tracking-[0.28em] uppercase">
              Agent roles
            </p>
            <div className="space-y-4">
              {agentRoles.map((role) => (
                <div
                  key={role}
                  className="border-border bg-card-strong rounded-[1.25rem] border p-4"
                >
                  <p className="text-foreground/90 leading-7">{role}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="glass-card border-border rounded-[2rem] border p-7">
            <p className="text-muted mb-5 font-mono text-xs tracking-[0.28em] uppercase">
              First 90 minutes
            </p>
            <ol className="space-y-4">
              {nextSteps.map((step, index) => (
                <li
                  key={step}
                  className="border-border bg-card-strong rounded-[1.25rem] border p-4"
                >
                  <p className="text-muted mb-2 font-mono text-xs tracking-[0.28em] uppercase">
                    Step 0{index + 1}
                  </p>
                  <p className="text-foreground/90 leading-7">{step}</p>
                </li>
              ))}
            </ol>
          </article>
        </section>
      </div>
    </main>
  );
}
