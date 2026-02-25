import { test, expect } from '@playwright/test';

test.describe('Accessibility - reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('hero title is visible without animation', async ({ page }) => {
    await page.goto('/');
    const heroTitle = page.locator('.hero-title');
    await expect(heroTitle).toBeVisible();
    // Should be visible immediately (not waiting for GSAP animation)
    const opacity = await heroTitle.evaluate((el) =>
      getComputedStyle(el).opacity
    );
    expect(Number(opacity)).toBe(1);
  });

  test('timeline cards are visible without animation', async ({ page }) => {
    await page.goto('/about');
    const firstCard = page.locator('.timeline-card').first();
    await expect(firstCard).toBeVisible();
  });
});

test.describe('Accessibility - general', () => {
  test('all images have alt attributes', async ({ page }) => {
    await page.goto('/projects/griefshare');
    await page.waitForLoadState('networkidle');

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });

  test('mobile menu button has aria attributes', async ({ page }) => {
    await page.goto('/');
    const menuBtn = page.locator('.mobile-menu-btn');
    await expect(menuBtn).toHaveAttribute('aria-label', 'Toggle menu');
    await expect(menuBtn).toHaveAttribute('aria-expanded');
  });

  test('lightbox has dialog role and aria attributes', async ({ page }) => {
    await page.goto('/projects/griefshare');
    const lightbox = page.locator('#case-lightbox');
    await expect(lightbox).toHaveAttribute('role', 'dialog');
    await expect(lightbox).toHaveAttribute('aria-modal', 'true');
    await expect(lightbox).toHaveAttribute('aria-hidden', 'true');
  });

  test('skip link exists and is focusable', async ({ page }) => {
    await page.goto('/');
    const skipLink = page.locator('a.skip-link[href="#main-content"]');
    await expect(skipLink).toBeAttached();
  });
});
