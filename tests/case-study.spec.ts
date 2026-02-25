import { test, expect } from '@playwright/test';

const caseStudies = [
  {
    slug: 'unified-platform',
    title: 'Unifying an Investigative Platform',
    accent: '#1a1a2e',
    tags: ['B2B SaaS', 'Design Systems', 'Design + Code'],
  },
  {
    slug: 'clearcase',
    title: 'ClearCase',
    accent: '#2c3e50',
    tags: ['B2B SaaS', 'UX Audit', 'Responsive Web'],
  },
  {
    slug: 'griefshare',
    title: 'GriefShare',
    accent: '#1a1a1a',
    tags: ['Online Search', 'UX Research', 'Responsive Web'],
  },
  {
    slug: 'leadsuite',
    title: 'LeadSuite',
    accent: '#1c3557',
    tags: ['B2B SaaS', 'Law Enforcement', 'Information Architecture'],
  },
  {
    slug: 'deposify',
    title: 'Deposify',
    accent: '#1a1a1a',
    tags: ['B2B | B2C | SaaS', 'Product Strategy', 'Responsive Web'],
  },
];

for (const study of caseStudies) {
  test.describe(`Case Study: ${study.title}`, () => {
    test('hero renders with title, image, and tags', async ({ page }) => {
      await page.goto(`/projects/${study.slug}`);

      await expect(page.locator('.hero-title')).toContainText(study.title);
      await expect(page.locator('.hero-image')).toBeVisible();

      const tags = page.locator('.hero-tag');
      const tagTexts = await tags.allTextContents();
      for (const expected of study.tags) {
        expect(tagTexts).toContain(expected);
      }
    });

    test('accent color CSS variable is set', async ({ page }) => {
      await page.goto(`/projects/${study.slug}`);
      const accentColor = await page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue('--color-project-accent').trim()
      );
      expect(accentColor).toBe(study.accent);
    });

    test('has case sections', async ({ page }) => {
      await page.goto(`/projects/${study.slug}`);
      const sections = page.locator('.case-section');
      const count = await sections.count();
      expect(count).toBeGreaterThanOrEqual(1);
    });

    test('ProjectNav and CTAFooter present', async ({ page }) => {
      await page.goto(`/projects/${study.slug}`);
      await expect(page.locator('.project-nav')).toBeVisible();
      await expect(page.locator('.cta-footer')).toBeVisible();
    });

    test('all images have non-empty src', async ({ page }) => {
      await page.goto(`/projects/${study.slug}`);
      await page.waitForLoadState('networkidle');

      const images = page.locator('.case-section img, .case-hero img');
      const count = await images.count();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        const img = images.nth(i);
        const src = await img.getAttribute('src');
        expect(src).toBeTruthy();
      }

      // Verify hero image loaded (always eager)
      const heroImg = page.locator('.hero-image');
      const heroLoaded = await heroImg.evaluate(
        (el: HTMLImageElement) => el.complete && el.naturalWidth > 0
      );
      expect(heroLoaded).toBe(true);
    });
  });
}
