import { test, expect } from '@playwright/test';

test.describe('Lightbox', () => {
  test.beforeEach(async ({ page }) => {
    // GriefShare has multiple images
    await page.goto('/projects/griefshare');
    await page.waitForLoadState('networkidle');
  });

  test('click image opens lightbox with correct image', async ({ page }) => {
    const firstImage = page.locator('.case-section img.lb-clickable').first();
    await firstImage.scrollIntoViewIfNeeded();
    await firstImage.click();

    const lightbox = page.locator('#case-lightbox');
    await expect(lightbox).toHaveClass(/is-open/);
    await expect(lightbox).toHaveAttribute('aria-hidden', 'false');

    const lbImage = page.locator('.lb-image');
    await expect(lbImage).toBeVisible();

    const counter = page.locator('.lb-counter');
    await expect(counter).toBeVisible();
    await expect(counter).toContainText('/');
  });

  test('keyboard navigation works', async ({ page }) => {
    const firstImage = page.locator('.case-section img.lb-clickable').first();
    await firstImage.scrollIntoViewIfNeeded();
    await firstImage.click();

    await expect(page.locator('#case-lightbox')).toHaveClass(/is-open/);

    const counter = page.locator('.lb-counter');
    const initialText = await counter.textContent();

    // ArrowRight advances
    await page.keyboard.press('ArrowRight');
    const afterRight = await counter.textContent();
    expect(afterRight).not.toBe(initialText);

    // ArrowLeft goes back
    await page.keyboard.press('ArrowLeft');
    const afterLeft = await counter.textContent();
    expect(afterLeft).toBe(initialText);
  });

  test('prev/next buttons work', async ({ page }) => {
    const firstImage = page.locator('.case-section img.lb-clickable').first();
    await firstImage.scrollIntoViewIfNeeded();
    await firstImage.click();

    await expect(page.locator('#case-lightbox')).toHaveClass(/is-open/);

    const counter = page.locator('.lb-counter');
    const initial = await counter.textContent();

    await page.locator('.lb-next').click();
    expect(await counter.textContent()).not.toBe(initial);

    await page.locator('.lb-prev').click();
    expect(await counter.textContent()).toBe(initial);
  });

  test('Escape closes lightbox', async ({ page }) => {
    const firstImage = page.locator('.case-section img.lb-clickable').first();
    await firstImage.scrollIntoViewIfNeeded();
    await firstImage.click();

    await expect(page.locator('#case-lightbox')).toHaveClass(/is-open/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#case-lightbox')).not.toHaveClass(/is-open/);
    await expect(page.locator('#case-lightbox')).toHaveAttribute('aria-hidden', 'true');
  });

  test('overlay click closes lightbox', async ({ page }) => {
    const firstImage = page.locator('.case-section img.lb-clickable').first();
    await firstImage.scrollIntoViewIfNeeded();
    await firstImage.click();

    await expect(page.locator('#case-lightbox')).toHaveClass(/is-open/);

    // Click the overlay background (top-left corner, away from the image)
    await page.locator('#case-lightbox').click({ position: { x: 10, y: 10 } });
    await expect(page.locator('#case-lightbox')).not.toHaveClass(/is-open/);
  });
});
