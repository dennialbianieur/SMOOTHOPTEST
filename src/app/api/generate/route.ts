import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { generateNewsletter } from "@/lib/claude";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { RawTool } from "@/lib/types";

export async function POST(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const tools =
    body !== null && typeof body === "object" && "tools" in body
      ? (body as Record<string, unknown>).tools
      : undefined;

  if (!Array.isArray(tools) || tools.length === 0) {
    return NextResponse.json(
      { error: "tools array is required and must be non-empty" },
      { status: 400 },
    );
  }

  try {
    const newsletter = await generateNewsletter(tools as RawTool[]);

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("newsletters")
      .insert({
        week: newsletter.week,
        subject: newsletter.subject,
        tools_json: newsletter,
        sent_at: null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[generate] DB error:", error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }

    return NextResponse.json({ newsletter, id: data.id as string });
  } catch (err) {
    console.error("[generate] unexpected error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
