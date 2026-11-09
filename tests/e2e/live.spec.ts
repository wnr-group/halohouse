import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// READ-ONLY checks against the deployed site (E2E_TARGET=live). Only GET navigation; no form submission, no payment,
// and facebook.com/tr is aborted so the live Meta pixel receives nothing from this run.
const OUT = path.join(path.resolve(__dirname, '../..'), 'screenshots', 'workshop', process.env.E2E_OUT || '');
fs.mkdirSync(OUT, { recursive: true });
const report = (n: string, d: unknown) => fs.writeFileSync(path.join(OUT, `${n}__live.json`), JSON.stringify(d, null, 2));

test.beforeEach(async ({ page }) => { await page.route(/facebook\.com\/tr/, (r) => r.abort()); });

test('AC-12 live: /workshop/ serves the workshop page (not the React SPA) and /workshop redirects to /workshop/', async ({ page, request }) => {
  const probes: Record<string, unknown> = {};
  for (const p of ['/workshop', '/workshop/', '/workshop/index.html', '/workshop/img/methini-1.jpg', '/workshop/media/clip1.mp4', '/workshop/media/hero.mp4']) {
    const r = await request.get(p, { maxRedirects: 0, headers: { Range: 'bytes=0-1023' } });
    probes[p] = { status: r.status(), type: r.headers()['content-type'], location: r.headers()['location'] ?? null, bytes: (await r.body()).length };
  }
  await page.goto('/workshop/', { waitUntil: 'load' });
  const title = await page.title();
  const isWorkshop = /Modelling Workshop/.test(title);
  const hasReactRoot = (await page.locator('#root').count()) > 0;
  report('AC-12-live-route', { finalUrl: page.url(), title, isWorkshop, hasReactRoot, probes });
  await page.screenshot({ path: path.join(OUT, `AC-12-vercel-live-route${isWorkshop ? '' : '-SPA-FALLBACK-NOT-DEPLOYED'}__live.png`) });
  expect(isWorkshop, `live /workshop/ title was "${title}" (React root present: ${hasReactRoot})`).toBe(true);
  expect((probes['/workshop/img/methini-1.jpg'] as any).status).toBeLessThan(400);
});

test('AC-08 live: existing Halo House routes still render', async ({ page }) => {
  test.setTimeout(180_000);
  const res: Record<string, unknown> = {};
  await page.goto('/', { waitUntil: 'load' });
  await expect.poll(() => page.locator('#root > *').count()).toBeGreaterThan(0);
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(OUT, 'AC-08-halohouse-regression__live.png') });
  for (const r of ['/portfolio', '/services', '/about', '/contact']) {
    await page.goto(r, { waitUntil: 'domcontentloaded' });
    await expect.poll(() => page.locator('#root > *').count(), { message: `${r} empty` }).toBeGreaterThan(0);
    res[r] = { finalPath: new URL(page.url()).pathname, rootChars: (await page.locator('#root').innerText()).length };
    expect(new URL(page.url()).pathname).toBe(r);
  }
  report('AC-08-live-routes', res);
});
