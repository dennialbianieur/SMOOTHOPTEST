import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
  Preview,
} from "@react-email/components";
import type { Newsletter } from "../lib/types";

// Color palette (inline styles only):
const colors = {
  bg: "#ffffff",
  text: "#111111",
  muted: "#666666",
  accent: "#2563eb",
  border: "#e5e7eb",
  tagBg: "#f3f4f6",
};

// Source badge labels
const SOURCE_LABELS = { product_hunt: "PH", github: "GH", hackernews: "HN" };

export default function NewsletterEmail({
  newsletter,
}: {
  newsletter: Newsletter;
}) {
  return (
    <Html>
      <Head />
      <Preview>{newsletter.preview_text}</Preview>
      <Body
        style={{ backgroundColor: colors.bg, fontFamily: "system-ui, sans-serif" }}
      >
        <Container
          style={{ maxWidth: "600px", margin: "0 auto", padding: "32px 16px" }}
        >
          {/* Header */}
          <Section>
            <Text
              style={{
                fontFamily: "monospace",
                fontSize: "20px",
                fontWeight: "bold",
                color: colors.text,
                margin: "0 0 4px",
              }}
            >
              AI Tools Weekly
            </Text>
            <Text
              style={{
                color: colors.muted,
                fontSize: "13px",
                margin: "0 0 24px",
              }}
            >
              {newsletter.week}
            </Text>
          </Section>

          {/* Curator note */}
          <Section>
            <Text
              style={{
                color: colors.muted,
                fontStyle: "italic",
                fontSize: "14px",
                margin: "0 0 24px",
              }}
            >
              {newsletter.curator_note}
            </Text>
          </Section>

          <Hr style={{ borderColor: colors.border, margin: "0 0 24px" }} />

          {/* Tool cards */}
          {newsletter.tools.map((tool) => (
            <Section
              key={tool.rank}
              style={{
                marginBottom: "24px",
                padding: "16px",
                border: `1px solid ${colors.border}`,
                borderRadius: "8px",
              }}
            >
              {/* Rank + Name + Source badge */}
              <Text
                style={{
                  margin: "0 0 4px",
                  fontSize: "15px",
                  fontWeight: "bold",
                  color: colors.text,
                }}
              >
                #{tool.rank} {tool.name}
                <span
                  style={{
                    marginLeft: "8px",
                    fontSize: "11px",
                    color: colors.muted,
                    fontFamily: "monospace",
                  }}
                >
                  [{SOURCE_LABELS[tool.source]}]
                </span>
              </Text>

              {/* Tagline */}
              <Text
                style={{
                  color: colors.muted,
                  fontSize: "13px",
                  margin: "0 0 8px",
                }}
              >
                {tool.tagline}
              </Text>

              {/* Tags */}
              <Section style={{ margin: "0 0 8px" }}>
                {tool.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      display: "inline-block",
                      marginRight: "4px",
                      backgroundColor: colors.tagBg,
                      color: colors.muted,
                      fontSize: "11px",
                      padding: "2px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </Section>

              {/* Score bar (final score as percentage width) */}
              <Section style={{ margin: "0 0 8px" }}>
                <Text
                  style={{
                    fontSize: "11px",
                    color: colors.muted,
                    margin: "0 0 2px",
                  }}
                >
                  Score: {tool.scores.final.toFixed(1)}/10
                </Text>
                <div
                  style={{
                    backgroundColor: colors.border,
                    borderRadius: "4px",
                    height: "4px",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: colors.accent,
                      borderRadius: "4px",
                      height: "4px",
                      width: `${(tool.scores.final / 10) * 100}%`,
                    }}
                  />
                </div>
              </Section>

              {/* Review */}
              <Text
                style={{
                  fontSize: "14px",
                  color: colors.text,
                  margin: "0 0 8px",
                  lineHeight: "1.5",
                }}
              >
                {tool.review}
              </Text>

              {/* View link */}
              <Link
                href={tool.url}
                style={{ color: colors.accent, fontSize: "13px" }}
              >
                View →
              </Link>
            </Section>
          ))}

          <Hr style={{ borderColor: colors.border, margin: "24px 0" }} />

          {/* Footer */}
          <Section>
            <Text
              style={{
                color: colors.muted,
                fontSize: "12px",
                textAlign: "center",
              }}
            >
              You&apos;re receiving this because you subscribed.{" "}
              <Link
                href="https://example.com/unsubscribe"
                style={{ color: colors.muted }}
              >
                Unsubscribe
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
