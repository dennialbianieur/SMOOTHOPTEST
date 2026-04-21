import { NextResponse } from "next/server";
import { env, hasSupabaseConfig, hasSupabaseServiceRole } from "@/lib/env";

export async function GET() {
  return NextResponse.json({
    ok: true,
    appUrl: env.NEXT_PUBLIC_APP_URL,
    timestamp: new Date().toISOString(),
    services: {
      frontend: "ready",
      backend: "ready",
      supabasePublicEnv: hasSupabaseConfig ? "configured" : "missing",
      supabaseServiceRole: hasSupabaseServiceRole ? "configured" : "optional",
      deployment: "vercel-ready",
    },
  });
}
