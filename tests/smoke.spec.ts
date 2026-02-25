import { test, expect } from '@playwright/test';

const pages = [
  { path: '/', titleIncludes: 'Dillon Lui' },
  { path: '/about', titleIncludes: 'About' },
  { path: '/projects/unified-platform', titleIncludes: 'Unifying an Investigative Platform' },
  { path: '/projects/clearcase', titleIncludes: 'ClearCase' },
  { path: '/projects/griefshare', titleIncludes: 'GriefShare' },
  { path: '/projects/leadsuite', titleIncludes: 'LeadSuite' },
  { path: '/projects/deposify', titleIncludes: 'Deposify' },
];

for (const { path, titleIncludes } of pages) {
  test.describe(`Page: ${path}`, () => {
    test('returns 200 with correct title and structure', async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(new RegExp(titleIncludes));
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('header.header')).toBeVisible();
    });
  });
}
