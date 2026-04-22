import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { fetchProductHunt } from "@/lib/fetchers/product-hunt";
import { fetchGithubTrending } from "@/lib/fetchers/github-trending";
import { fetchHackerNews } from "@/lib/fetchers/hackernews";
import type { RawTool } from "@/lib/types";

export async function POST(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const results = await Promise.allSettled([
    fetchProductHunt(),
    fetchGithubTrending(),
    fetchHackerNews(),
  ]);

  const allTools: RawTool[] = results.flatMap((result) =>
    result.status === "fulfilled" ? result.value : [],
  );

  // Deduplicate by URL, keeping first occurrence
  const seen = new Set<string>();
  const tools = allTools.filter((tool) => {
    if (seen.has(tool.url)) return false;
    seen.add(tool.url);
    return true;
  });

  return NextResponse.json({ tools, count: tools.length });
}
