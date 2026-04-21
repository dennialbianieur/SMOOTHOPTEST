import { expect, test } from "@playwright/test";

test("homepage shows the build track", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /Build fast, ship calm/i }),
  ).toBeVisible();
  await expect(page.getByText(/Supabase-ready/i)).toBeVisible();
});
