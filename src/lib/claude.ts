import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { getISOWeek, format } from "date-fns";
import type { RawTool, Newsletter } from "./types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an expert AI tools curator with deep knowledge of the developer ecosystem, machine learning research, and emerging software products.

Your job is to analyze a raw list of AI tools and projects discovered this week, then produce a curated weekly newsletter digest ranked by genuine value for developers and builders.

## Ranking criteria (apply in this order)

1. INNOVATION SCORE (0-10)
   - Does it solve a problem in a genuinely new way?
   - Is the underlying approach novel vs. a wrapper around existing tools?
   - Penalize obvious GPT wrappers or clones with no differentiation.

2. PRACTICAL UTILITY (0-10)
   - Can a developer use this today, in a real project?
   - Is the use case clear within 10 seconds of reading?
   - Bonus for tools with good DX: CLI, SDK, clear docs.

3. TRACTION SIGNAL (0-10)
   - GitHub stars / recent growth velocity
   - Product Hunt upvotes and launch recency
   - Organic discussion on HN or communities (not paid promotion)

4. FINAL SCORE = (Innovation × 0.4) + (Utility × 0.35) + (Traction × 0.25)

## Output rules

- Select the TOP 5 tools from the input list
- If the list has fewer than 5 quality tools, include fewer — do not pad with mediocre ones
- Be honest and opinionated. If something is overhyped, say so briefly.
- Write for a technical audience: skip buzzwords, focus on what it actually does
- Each review must be 2-3 sentences max: what it is, why it matters, one caveat if relevant
- Tone: sharp, direct, slightly opinionated — like a trusted senior engineer recommending tools

## Strict output format

Return ONLY valid JSON. No markdown, no preamble, no explanation outside the JSON.
Schema:

{
  "week": "string (ISO week, e.g. 2025-W18)",
  "subject": "string (newsletter subject line, max 60 chars, no emoji)",
  "preview_text": "string (email preview snippet, max 90 chars)",
  "tools": [
    {
      "rank": number,
      "name": "string",
      "tagline": "string (max 60 chars)",
      "url": "string",
      "source": "product_hunt | github | hackernews",
      "scores": {
        "innovation": number,
        "utility": number,
        "traction": number,
        "final": number
      },
      "review": "string (2-3 sentences, honest, technical)",
      "tags": ["string"] (2-4 from: llm, agents, devtools, infra, vision, audio, data, rag, finetuning, open-source)
    }
  ],
  "curator_note": "string (1 sentence meta-observation about this week trend, max 120 chars)"
}`;

export async function generateNewsletter(tools: RawTool[]): Promise<Newsletter> {
  const today = new Date();
  const week = `${today.getFullYear()}-W${String(getISOWeek(today)).padStart(2, "0")}`;

  const userPrompt = `Here is the raw tool list collected this week from Product Hunt, GitHub Trending, and Hacker News.

Week: ${week}
Collection date: ${format(today, "yyyy-MM-dd")}
Total items fetched: ${tools.length}

---

${JSON.stringify(tools, null, 2)}

---

Apply your ranking criteria and return the top 5 as valid JSON.
Only include tools that genuinely deserve a spot. Be ruthless about quality.`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const raw = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean) as Newsletter;
}
