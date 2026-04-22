import "server-only";
import * as cheerio from "cheerio";
import { RawTool } from "../types";

const AI_KEYWORDS = [
  "ai",
  "llm",
  "gpt",
  "claude",
  "ml",
  "model",
  "agent",
  "rag",
  "embedding",
  "diffusion",
  "neural",
];

export async function fetchGithubTrending(): Promise<RawTool[]> {
  try {
    const res = await fetch(
      "https://github.com/trending?since=weekly&spoken_language_code=en",
      {
        headers: { "User-Agent": "Mozilla/5.0" },
        signal: AbortSignal.timeout(10_000),
      },
    );

    if (!res.ok) {
      throw new Error(`GitHub trending responded with ${res.status}`);
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    const results: RawTool[] = [];

    $("article.Box-row, div[class*='Box-row']").each((_i, el) => {
      const anchor = $(el).find("h2 a, h1 a").first();
      const href = anchor.attr("href") ?? "";
      const name = anchor
        .text()
        .replace(/\s+/g, " ")
        .trim()
        .replace(/^\//, "");

      if (!name || !href) return;

      const url = `https://github.com${href}`;
      const description = $(el).find("p.col-9, p[class*='col-9']").text().trim();

      const starsText = $(el)
        .find('a[href*="stargazers"]')
        .first()
        .text()
        .replace(/,/g, "")
        .trim();
      const stars = parseInt(starsText, 10) || 0;

      const language = $(el)
        .find('span[itemprop="programmingLanguage"]')
        .text()
        .trim();

      const haystack = `${name} ${description}`.toLowerCase();
      const isAI = AI_KEYWORDS.some((kw) => haystack.includes(kw));
      if (!isAI) return;

      results.push({
        name,
        url,
        description: description || "",
        source: "github" as const,
        stars,
        language: language || undefined,
      });
    });

    return results.slice(0, 15);
  } catch (err) {
    console.error("[fetchGithubTrending] error:", err);
    return [];
  }
}
