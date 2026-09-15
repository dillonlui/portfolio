import { test, expect } from '@playwright/test';

test.describe('Accessibility - reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('homepage content is visible without animation', async ({ page }) => {
    test.skip(test.info().project.name !== 'reduced-motion', 'Reduced-motion assertion only matters in the reduced-motion project.');
    await page.goto('/');
    const selectors = ['.hero-title', '.hero-subtitle', '.hero-blurb', '.hero-cta'];

    for (const selector of selectors) {
      const el = page.locator(selector);
      await expect(el).toBeVisible();
    }
  });

  test('timeline cards are visible without animation', async ({ page }) => {
    test.skip(test.info().project.name !== 'reduced-motion', 'Reduced-motion assertion only matters in the reduced-motion project.');
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

  test('404 page is noindex', async ({ page }) => {
    await page.goto('/404');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  });
});
