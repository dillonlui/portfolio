import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

test.describe('Mobile Responsive', () => {
  test('hamburger menu toggles', async ({ page }) => {
    await page.goto('/');
    const menuBtn = page.locator('.mobile-menu-btn');
    await expect(menuBtn).toBeVisible();

    // Nav links hidden initially on mobile
    const navLinks = page.locator('.nav-links');
    await expect(navLinks).not.toHaveClass(/is-open/);

    // Open menu
    await menuBtn.click();
    await expect(menuBtn).toHaveAttribute('aria-expanded', 'true');
    await expect(navLinks).toHaveClass(/is-open/);

    // Close menu
    await menuBtn.click();
    await expect(menuBtn).toHaveAttribute('aria-expanded', 'false');
    await expect(navLinks).not.toHaveClass(/is-open/);
  });

  test('Work dropdown works in mobile menu', async ({ page }) => {
    await page.goto('/');
    await page.locator('.mobile-menu-btn').click();
    await expect(page.locator('.nav-links')).toHaveClass(/is-open/);

    const dropdown = page.locator('.dropdown-trigger');
    await dropdown.click();

    const links = page.locator('.dropdown-menu .dropdown-link');
    await expect(links.first()).toBeVisible();
    const count = await links.count();
    expect(count).toBe(5);
  });

  test('hero title visible', async ({ page }) => {
    await page.goto('/');
    const heroTitle = page.locator('.hero-title');
    await expect(heroTitle).toBeVisible();
  });
});
