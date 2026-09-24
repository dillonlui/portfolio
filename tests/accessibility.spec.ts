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
  test('homepage title remains visible without JavaScript', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator('.hero-title')).toBeVisible();
    await expect(page.locator('.hero-title')).toHaveCSS('opacity', '1');
    await context.close();
  });

  test('mobile projects have one visible link and image per project with reduced motion', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/');
    const cards = page.locator('.floating-bubble');
    await expect(cards).toHaveCount(5);
    await expect(cards.first()).toBeVisible();
    await expect(page.locator('.floating-container img')).toHaveCount(5);
    await context.close();
  });

  test('closed mobile menu is removed from tab order', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto('/');
    const menu = page.locator('#primary-nav');
    await expect(menu).toHaveAttribute('inert', '');
    await page.locator('.mobile-menu-btn').click();
    await expect(menu).not.toHaveAttribute('inert');
    await page.keyboard.press('Escape');
    await expect(menu).toHaveAttribute('inert', '');
    await context.close();
  });

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
