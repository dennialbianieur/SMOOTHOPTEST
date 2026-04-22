import "server-only";
import { RawTool } from "../types";

type HNHit = {
  title?: string;
  url?: string;
  objectID: string;
  story_text?: string;
  num_comments?: number;
};

type AlgoliaResponse = {
  hits?: HNHit[];
};

export async function fetchHackerNews(): Promise<RawTool[]> {
  try {
    const sevenDaysAgo = Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60;
    const apiUrl =
      `https://hn.algolia.com/api/v1/search` +
      `?query=show+hn+ai+tool` +
      `&tags=show_hn` +
      `&hitsPerPage=15` +
      `&numericFilters=created_at_i>${sevenDaysAgo}`;

    const res = await fetch(apiUrl, {
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      throw new Error(`HN Algolia API responded with ${res.status}`);
    }

    const json = (await res.json()) as AlgoliaResponse;
    const hits = json?.hits ?? [];

    return hits.map((hit) => ({
      name: (hit.title ?? "").replace(/^Show HN:\s*/i, ""),
      url:
        hit.url ||
        `https://news.ycombinator.com/item?id=${hit.objectID}`,
      description: (hit.story_text ?? "").slice(0, 200),
      source: "hackernews" as const,
      comments: hit.num_comments,
    }));
  } catch (err) {
    console.error("[fetchHackerNews] error:", err);
    return [];
  }
}
