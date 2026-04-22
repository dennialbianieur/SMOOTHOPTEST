import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { render } from "@react-email/render";
import { Resend } from "resend";
import NewsletterEmail from "@/emails/NewsletterEmail";
import type { Newsletter } from "@/lib/types";

const BATCH_SIZE = 50;

export async function POST(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const newsletterId =
    body !== null && typeof body === "object" && "newsletterId" in body
      ? (body as Record<string, unknown>).newsletterId
      : undefined;

  if (typeof newsletterId !== "string" || !newsletterId) {
    return NextResponse.json(
      { error: "newsletterId is required" },
      { status: 400 },
    );
  }

  try {
    const supabase = createSupabaseAdminClient();

    // Load newsletter from DB
    const { data: row, error: fetchError } = await supabase
      .from("newsletters")
      .select("*")
      .eq("id", newsletterId)
      .single();

    if (fetchError || !row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const newsletter = row.tools_json as Newsletter;

    // Fetch active subscribers
    const { data: subscribers, error: subError } = await supabase
      .from("subscribers")
      .select("email")
      .eq("active", true);

    if (subError) {
      console.error("[send] subscriber fetch error:", subError);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ ok: true, sent: 0 });
    }

    // Render HTML once
    const html = await render(<NewsletterEmail newsletter={newsletter} />);

    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.RESEND_FROM_EMAIL ?? "";
    const subject = newsletter.subject;

    let sent = 0;

    // Send in batches of BATCH_SIZE (one email per subscriber)
    for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
      const batch = subscribers.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map((sub) =>
          resend.emails.send({
            from,
            to: [sub.email as string],
            subject,
            html,
          }),
        ),
      );
      sent += batch.length;
    }

    // Update newsletter row with sent_at and recipient_count
    const { error: updateError } = await supabase
      .from("newsletters")
      .update({
        sent_at: new Date().toISOString(),
        recipient_count: sent,
      })
      .eq("id", newsletterId);

    if (updateError) {
      console.error("[send] update error:", updateError);
    }

    return NextResponse.json({ ok: true, sent });
  } catch (err) {
    console.error("[send] unexpected error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
