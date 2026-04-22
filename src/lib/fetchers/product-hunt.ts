import "server-only";
import { RawTool } from "../types";

const QUERY = `{
  posts(order: VOTES, topic: "artificial-intelligence", first: 10) {
    edges {
      node {
        name
        tagline
        url
        votesCount
        commentsCount
        createdAt
        topics { edges { node { name } } }
      }
    }
  }
}`;

export async function fetchProductHunt(): Promise<RawTool[]> {
  if (!process.env.PRODUCT_HUNT_API_TOKEN) {
    console.warn("[fetchProductHunt] PRODUCT_HUNT_API_TOKEN not set, skipping");
    return [];
  }
  try {
    const res = await fetch("https://api.producthunt.com/v2/api/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PRODUCT_HUNT_API_TOKEN}`,
      },
      body: JSON.stringify({ query: QUERY }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      throw new Error(`Product Hunt API responded with ${res.status}`);
    }

    const json = (await res.json()) as {
      data?: {
        posts?: {
          edges?: Array<{
            node: {
              name: string;
              tagline: string;
              url: string;
              votesCount: number;
              commentsCount: number;
              createdAt: string;
              topics: { edges: Array<{ node: { name: string } }> };
            };
          }>;
        };
      };
    };

    const edges = json?.data?.posts?.edges ?? [];

    return edges.map(({ node }) => ({
      name: node.name,
      url: node.url,
      description: node.tagline,
      source: "product_hunt" as const,
      upvotes: node.votesCount,
      comments: node.commentsCount,
      launched_at: node.createdAt,
      topics: node.topics.edges.map((e) => e.node.name),
    }));
  } catch (err) {
    console.error("[fetchProductHunt] error:", err);
    return [];
  }
}
