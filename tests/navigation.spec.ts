import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 1280, height: 720 } });

test.describe('Desktop Navigation', () => {
  test('Work dropdown shows 5 case study links', async ({ page }) => {
    await page.goto('/');
    const trigger = page.locator('.dropdown-trigger');
    await trigger.hover();
    const links = page.locator('.dropdown-menu .dropdown-link');
    await expect(links).toHaveCount(5);

    const expectedLinks = [
      { text: 'Unifying an Investigative Platform', href: '/projects/unified-platform' },
      { text: 'ClearCase', href: '/projects/clearcase' },
      { text: 'GriefShare', href: '/projects/griefshare' },
      { text: 'LeadSuite', href: '/projects/leadsuite' },
      { text: 'Deposify', href: '/projects/deposify' },
    ];

    for (let i = 0; i < expectedLinks.length; i++) {
      await expect(links.nth(i)).toHaveText(expectedLinks[i].text);
      await expect(links.nth(i)).toHaveAttribute('href', expectedLinks[i].href);
    }
  });

  test('Work dropdown link navigates to case study', async ({ page }) => {
    await page.goto('/');
    const trigger = page.locator('.dropdown-trigger');
    await trigger.hover();
    await page.locator('.dropdown-link[href="/projects/clearcase"]').click();
    await expect(page).toHaveURL('/projects/clearcase');
  });

  test('logo links home from any page', async ({ page }) => {
    await page.goto('/about');
    await page.locator('.logo').click();
    await expect(page).toHaveURL('/');
  });
});

test.describe('ProjectNav chain', () => {
  const chain = [
    { slug: 'unified-platform', prev: 'deposify', next: 'clearcase' },
    { slug: 'clearcase', prev: 'unified-platform', next: 'griefshare' },
    { slug: 'griefshare', prev: 'clearcase', next: 'leadsuite' },
    { slug: 'leadsuite', prev: 'griefshare', next: 'deposify' },
    { slug: 'deposify', prev: 'leadsuite', next: 'unified-platform' },
  ];

  for (const { slug, prev, next } of chain) {
    test(`${slug} has correct prev/next links`, async ({ page }) => {
      await page.goto(`/projects/${slug}`);
      const prevLink = page.locator('.project-nav-link.prev');
      const nextLink = page.locator('.project-nav-link.next');
      await expect(prevLink).toHaveAttribute('href', `/projects/${prev}`);
      await expect(nextLink).toHaveAttribute('href', `/projects/${next}`);
    });
  }
});

test.describe('ViewTransitions', () => {
  test('content swaps on navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.hero-title')).toBeVisible();
    await page.locator('.logo').click(); // navigate home to home (re-init)
    await expect(page.locator('.hero-title')).toBeVisible();
  });
});
