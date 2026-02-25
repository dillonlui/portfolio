import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('hero section renders correctly', async ({ page }) => {
    await expect(page.locator('.hero-title')).toContainText("Hello, I'm Dillon");
    await expect(page.locator('.hero-subtitle')).toBeVisible();
    const emailLink = page.locator('.hero-cta a[href="mailto:dillonlui@gmail.com"]');
    await expect(emailLink).toBeVisible();
  });

  test('floating canvas has project links', async ({ page }) => {
    // Desktop uses floating bubbles, mobile uses mobile-bubble-card fallback
    const projectLinks = page.locator('a[href^="/projects/"]');
    const count = await projectLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('CTA footer present with email link', async ({ page }) => {
    const ctaFooter = page.locator('.cta-footer');
    await expect(ctaFooter).toBeVisible();
    const emailBtn = ctaFooter.locator('a[href="mailto:dillonlui@gmail.com"]');
    await expect(emailBtn).toBeVisible();
  });
});
