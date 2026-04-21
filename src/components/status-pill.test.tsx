import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusPill } from "@/components/status-pill";

describe("StatusPill", () => {
  it("renders the label", () => {
    render(<StatusPill label="Ready" tone="ready" />);

    expect(screen.getByText("Ready")).toBeInTheDocument();
  });
});
