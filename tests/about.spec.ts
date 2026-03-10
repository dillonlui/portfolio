import { test, expect } from '@playwright/test';

test.describe('About page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
  });

  test('profile image loads', async ({ page }) => {
    const img = page.locator('.profile-image');
    await expect(img).toBeVisible();
    await expect(img).toHaveAttribute('src', /((\/_astro\/dillon\..+\.(webp|avif|jpg))|(\/_image\?href=.*dillon))/)
  });

  test('experience timeline has cards', async ({ page }) => {
    const timeline = page.locator('#experience-timeline');
    await expect(timeline).toBeVisible();
    const entries = page.locator('.timeline-entry');
    const count = await entries.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('resume download link present', async ({ page }) => {
    const resumeLink = page.locator('.resume-btn');
    await expect(resumeLink).toBeVisible();
    await expect(resumeLink).toHaveAttribute('target', '_blank');
    const href = await resumeLink.getAttribute('href');
    expect(href).toContain('drive.google.com');
  });

  test('featured project link points to case study', async ({ page }) => {
    const link = page.locator('a.btn[href="/projects/unified-platform"]');
    await link.scrollIntoViewIfNeeded();
    await expect(link).toBeVisible();
  });
});
