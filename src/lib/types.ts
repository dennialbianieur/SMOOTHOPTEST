export type RawTool = {
  name: string;
  url: string;
  description: string;
  source: "product_hunt" | "github" | "hackernews";
  stars?: number;
  upvotes?: number;
  comments?: number;
  language?: string;
  topics?: string[];
  launched_at?: string;
};

export type CuratedTool = {
  rank: number;
  name: string;
  tagline: string;
  url: string;
  source: "product_hunt" | "github" | "hackernews";
  scores: {
    innovation: number;
    utility: number;
    traction: number;
    final: number;
  };
  review: string;
  tags: string[];
};

export type Newsletter = {
  week: string;
  subject: string;
  preview_text: string;
  tools: CuratedTool[];
  curator_note: string;
};
