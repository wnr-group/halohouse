import { test as base, expect, Page, Request } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const TARGET = process.env.E2E_TARGET === 'preview' ? 'preview' : 'dev';
const ROOT = path.resolve(__dirname, '../..');
const OUT = path.join(ROOT, 'screenshots', 'workshop', process.env.E2E_OUT || '');
const WS_URL = '/workshop/';
const FORM_ENDPOINT = 'https://formsubmit.co/ajax/halohousechennai@gmail.com';

fs.mkdirSync(OUT, { recursive: true });

// Preview-target runs must not overwrite the dev-target evidence files.
const fname = (n: string) => (TARGET === 'preview' ? `preview-${n}` : n);
const shot = (page: Page, name: string, fullPage = false) =>
  page.screenshot({ path: path.join(OUT, fname(name)), fullPage });
const writeReport = (name: string, data: unknown) =>
  fs.writeFileSync(path.join(OUT, fname(name)), typeof data === 'string' ? data : JSON.stringify(data, null, 2));

const sha = (f: string) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const listFiles = (dir: string, base = dir): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? listFiles(path.join(dir, e.name), base) : [path.relative(base, path.join(dir, e.name)).replace(/\\/g, '/')]);

type Rec = { test: string; kind: string; origin: string; text: string; url?: string };
const consoleLog: Rec[] = [];
const networkLog: { test: string; url: string; status: number | 'FAILED'; type: string; local: boolean }[] = [];

// Auto fixture: every page gets console/network capture and the two external-effect guards.
type Pixel = string[] & { calls: () => Promise<any[][]> };
type Capture = { hits: string[]; posts: any[] };
// Auto fixture: runs for EVERY test. Console/network capture plus the two external-effect guards.
const test = base.extend<{ capture: Capture; pixel: Pixel; formPosts: any[] }>({
  capture: [async ({ page, baseURL }, use, info) => {
    const hits: string[] = [], posts: any[] = [];
    const origin = new URL(baseURL!).origin;
    page.on('console', (m) => {
      if (m.type() !== 'error' && m.type() !== 'warning') return;
      const u = m.location().url || '';
      const host = u ? new URL(u).origin : '';
      consoleLog.push({ test: info.title, kind: m.type(), url: u, text: m.text(),
        origin: !u ? 'unknown' : host === origin ? 'first-party (localhost)' : 'third-party' });
    });
    page.on('pageerror', (e) => consoleLog.push({ test: info.title, kind: 'pageerror', origin: 'uncaught exception', text: String(e) }));
    page.on('requestfinished', async (r: Request) => {
      const res = await r.response().catch(() => null); if (!res) return;
      networkLog.push({ test: info.title, url: r.url(), status: res.status(), type: r.resourceType(), local: r.url().startsWith(origin) });
    });
    page.on('requestfailed', (r) => networkLog.push({ test: info.title, url: r.url(), status: 'FAILED', type: r.resourceType(), local: r.url().startsWith(origin) }));
    page.on('request', (r) => { if (/facebook\.com\/tr/.test(r.url())) hits.push(new URL(r.url()).searchParams.get('ev') || 'unknown'); });
    // Do not pollute the live Meta pixel with test traffic: event-delivery hits are recorded, then aborted.
    await page.route(/facebook\.com\/tr/, (route) => route.abort());
    // Do not email the client's real inbox: the form POST is recorded and answered locally.
    await page.route(FORM_ENDPOINT, async (route) => {
      posts.push(JSON.parse(route.request().postData() || '{}'));
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":"true"}' });
    });
    await use({ hits, posts });
  }, { auto: true }],
  // Opt-in: wraps window.fbq in a Proxy to record the page's own fbq() calls. Only used where needed because
  // it changes the identity of window.fbq (see the Meta Pixel "conflicting versions" note in the QA report).
  pixel: async ({ page, capture }, use) => {
    await page.addInitScript(() => {
      const log: any[][] = ((window as any).__fbqCalls = []);
      let real: any;
      Object.defineProperty(window, 'fbq', { configurable: true,
        get: () => real,
        set: (v) => { real = typeof v === 'function' ? new Proxy(v, { apply(t, th, a) { log.push([...a]); return Reflect.apply(t, th, a); } }) : v; } });
    });
    const hits = capture.hits as Pixel;
    hits.calls = () => page.evaluate(() => (window as any).__fbqCalls ?? []);
    await use(hits);
  },
  formPosts: async ({ capture }, use) => { await use(capture.posts); },
});

test.afterAll(() => {
  const lines = [`Console errors/warnings — target=${TARGET}`, `Total entries: ${consoleLog.length}`, ''];
  for (const r of consoleLog) lines.push(`[${r.kind}] [${r.origin}] (${r.test})\n   ${r.text}${r.url ? `\n   source: ${r.url}` : ''}`);
  if (!consoleLog.length) lines.push('No console errors, warnings or uncaught exceptions were observed.');
  writeReport('console-errors.txt', lines.join('\n'));
  writeReport('network-report.json', {
    target: TARGET,
    totalRequests: networkLog.length,
    localFailures: networkLog.filter((n) => n.local && (n.status === 'FAILED' || (n.status as number) >= 400)),
    thirdPartyFailures: networkLog.filter((n) => !n.local && (n.status === 'FAILED' || (n.status as number) >= 400)),
    requests: networkLog,
  });
});

async function overflow(page: Page) {
  return page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth,
    offenders: [...document.querySelectorAll('body *')].filter((e) => e.getBoundingClientRect().right > window.innerWidth + 1)
      .slice(0, 5).map((e) => `${e.tagName.toLowerCase()}.${(e as HTMLElement).className}`),
  }));
}

// ---------------------------------------------------------------- AC-01 filesystem
test.describe('AC-01/AC-09 filesystem integrity', () => {
  test('public/workshop is a byte-identical copy of the extracted workshop/ folder', async () => {
    const a = listFiles(path.join(ROOT, 'workshop')), b = listFiles(path.join(ROOT, 'public', 'workshop'));
    expect(b.sort(), 'file lists differ').toEqual(a.sort());
    for (const f of a) expect(sha(path.join(ROOT, 'public/workshop', f)), `hash mismatch: ${f}`).toBe(sha(path.join(ROOT, 'workshop', f)));
    writeReport('filesystem-integrity.txt', `files: ${a.length}\n` + a.map((f) => `${sha(path.join(ROOT, 'public/workshop', f)).slice(0, 12)}  ${f}`).join('\n'));
  });

  test('production build output contains the complete workshop', async () => {
    test.skip(TARGET !== 'preview', 'build output is verified in the preview run');
    const src = listFiles(path.join(ROOT, 'public', 'workshop')), dst = listFiles(path.join(ROOT, 'build', 'workshop'));
    expect(dst.sort()).toEqual(src.sort());
    for (const f of src) expect(sha(path.join(ROOT, 'build/workshop', f)), `hash mismatch in build: ${f}`).toBe(sha(path.join(ROOT, 'public/workshop', f)));
    writeReport('build-output-verification.txt', `build/workshop files: ${dst.length}, all hashes match public/workshop\n` + dst.join('\n'));
  });
});

// ---------------------------------------------------------------- E2E-01 / 02
test.describe('E2E-01/02 direct access & refresh', () => {
  test('E2E-01 direct URL serves the workshop page, not the React app', async ({ page }) => {
    const res = await page.goto(WS_URL);
    expect(res!.status()).toBe(200);
    expect(res!.headers()['content-type']).toContain('text/html');
    await expect(page).toHaveTitle(/2-Day Hands-On Modelling Workshop in Chennai/);
    await expect(page.locator('h1')).toContainText('Always dreamt of modelling');
    await expect(page.locator('#root'), 'React mount node must not exist on the static page').toHaveCount(0);
    expect(await page.locator('body').innerText()).toContain('Only 10 seats');
    // Served bytes must be exactly the file in public/workshop (no injection / rewriting).
    const served = await (await page.request.get(WS_URL)).text();
    const onDisk = fs.readFileSync(path.join(ROOT, 'public/workshop/index.html'), 'utf8');
    expect(served.replace(/\r\n/g, '\n')).toBe(onDisk.replace(/\r\n/g, '\n'));
    await shot(page, '01-direct-url-access.png');
    if (TARGET === 'preview') await page.screenshot({ path: path.join(OUT, '09-production-preview.png') });
  });

  test('E2E-02 refresh keeps the same page and URL', async ({ page }) => {
    await page.goto(WS_URL);
    const res = await page.reload();
    expect(res!.status()).toBe(200);
    expect(new URL(page.url()).pathname).toBe(WS_URL);
    await expect(page).toHaveTitle(/Modelling Workshop/);
    await expect(page.locator('h1')).toBeVisible();
    await shot(page, '02-refresh-verification.png');
  });

  test('routing variants are recorded (/workshop, /workshop/index.html)', async ({ page }) => {
    const report: Record<string, unknown> = {};
    for (const p of ['/workshop', '/workshop/index.html', '/workshop/img/logo.jpg', '/workshop/does-not-exist.html', '/portfolio']) {
      const r = await page.goto(p);
      report[p] = { status: r!.status(), finalUrl: new URL(page.url()).pathname, title: await page.title(), isWorkshop: /Modelling Workshop/.test(await page.title()),
        hasReactRoot: (await page.locator('#root').count()) > 0 };
    }
    writeReport('routing-report.json', report);
    expect((report['/workshop/index.html'] as any).isWorkshop).toBe(true);
    expect((report['/portfolio'] as any).hasReactRoot, 'React SPA route must still work').toBe(true);
  });
});

// ---------------------------------------------------------------- E2E-03 assets
test('E2E-03 every local asset the workshop references loads (HTTP 200, non-empty)', async ({ page }) => {
  const seen: { url: string; status: number; type: string; bytes: number }[] = [];
  page.on('response', async (r) => {
    if (!r.url().includes('/workshop/')) return;
    seen.push({ url: r.url(), status: r.status(), type: r.request().resourceType(), bytes: Number(r.headers()['content-length'] ?? 0) });
  });
  await page.goto(WS_URL, { waitUntil: 'load' });
  // Lazy clips: scroll each reel into view so the page's own IntersectionObserver loads it.
  const n = await page.locator('.reel video').count();
  expect(n).toBe(6);
  for (let i = 0; i < n; i++) {
    const v = page.locator('.reel video').nth(i);
    await v.scrollIntoViewIfNeeded();
    await expect.poll(() => v.evaluate((e: HTMLVideoElement) => e.readyState), { message: `clip${i + 1}.mp4 never reached HAVE_CURRENT_DATA`, timeout: 15_000 }).toBeGreaterThanOrEqual(2);
  }
  const hero = page.locator('#heroVid');
  await expect.poll(() => hero.evaluate((e: HTMLVideoElement) => e.readyState)).toBeGreaterThanOrEqual(2);
  const broken = await page.evaluate(() => [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src));
  expect(broken, 'broken <img> elements').toEqual([]);
  // Every file in public/workshop (except index.html / README) should have been requested at least once.
  const expected = listFiles(path.join(ROOT, 'public/workshop')).filter((f) => f !== 'index.html' && f !== 'README.txt' && !/^media\/clip\d\.jpg$/.test(f));
  const got = new Set(seen.map((s) => new URL(s.url).pathname.replace('/workshop/', '')));
  const missing = expected.filter((f) => !got.has(f));
  const bad = seen.filter((s) => s.status >= 400);
  writeReport('network-assets-workshop.json', { expectedFiles: expected, neverRequested: missing, failures: bad, requests: seen });
  expect(bad, 'local requests with status >= 400').toEqual([]);
  expect(missing, 'files that exist but were never requested').toEqual([]);
  await shot(page, '03-assets-loaded.png', true);
});

// ---------------------------------------------------------------- E2E-04..07 responsive
const viewports = [
  { id: 'desktop', w: 1440, h: 900 }, { id: 'laptop', w: 1366, h: 768 },
  { id: 'tablet', w: 768, h: 1024 }, { id: 'mobile', w: 390, h: 844 },
];
for (const v of viewports) {
  test(`E2E responsive ${v.id} ${v.w}x${v.h}`, async ({ page }) => {
    await page.setViewportSize({ width: v.w, height: v.h });
    await page.goto(WS_URL, { waitUntil: 'load' });
    await expect(page.locator('header img[alt^="Halo House"]')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.hero .btn[data-cta="hero"]')).toBeVisible();
    const o = await overflow(page);
    expect(o.scrollWidth, `horizontal overflow at ${v.w}px; offenders: ${o.offenders.join(', ')}`).toBeLessThanOrEqual(o.innerWidth);
    const unreadable = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('.sub')!).fontSize));
    expect(unreadable).toBeGreaterThanOrEqual(14);
    const names: Record<string, string[]> = { desktop: ['04-desktop-initial.png'], laptop: ['06-laptop.png'], tablet: ['07-tablet.png'], mobile: ['08-mobile.png'] };
    await shot(page, names[v.id][0]);
    if (v.id === 'desktop') {
      // Scroll through to trigger lazy video posters, then capture full page + key sections.
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); } window.scrollTo(0, 0); });
      await shot(page, '05-desktop-full-page.png', true);
      for (const [sel, name] of [['.mentor', '05b-desktop-mentor-section.png'], ['.reel >> nth=0', '05c-desktop-clips-section.png'], ['footer', '05d-desktop-footer.png']] as const) {
        await page.locator(sel).first().scrollIntoViewIfNeeded(); await shot(page, name);
      }
    }
    if (v.id === 'mobile') {
      await expect(page.locator('#sticky'), 'sticky CTA bar should be present on mobile').toBeVisible();
      await shot(page, '08b-mobile-full-page.png', true);
    }
    // Images actually rendered with real size
    const tiny = await page.evaluate(() => [...document.images].filter((i) => i.offsetParent && i.getBoundingClientRect().width < 2).map((i) => i.src));
    expect(tiny).toEqual([]);
  });
}

// ---------------------------------------------------------------- E2E-08 interactions
test.describe('E2E-08 interactive elements', () => {
  test('every [data-cta] button opens the booking modal; X, Escape and backdrop close it', async ({ page, pixel }) => {
    await page.goto(WS_URL);
    const ctas = await page.locator('[data-cta]').evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.cta));
    expect(ctas.sort()).toEqual(['book', 'final', 'gallery', 'hero', 'sticky']);
    await expect(page.locator('#modal')).not.toHaveClass(/open/);
    await shot(page, '11-modal-closed-initial.png');
    for (const c of ctas) {
      const btn = page.locator(`[data-cta="${c}"]`);
      if (c === 'sticky') continue; // sticky bar is mobile-only (display:none on desktop); covered by the mobile test below
      await btn.scrollIntoViewIfNeeded();
      await btn.click();
      await expect(page.locator('#modal'), `CTA "${c}" did not open modal`).toHaveClass(/open/);
      await expect(page.locator('#step1')).toBeVisible();
      if (c === 'hero') await shot(page, '12-modal-open-from-hero-cta.png');
      await page.keyboard.press('Escape');
      await expect(page.locator('#modal')).not.toHaveClass(/open/);
    }
    await page.locator('[data-cta="hero"]').click();
    await page.locator('#closeModal').click();
    await expect(page.locator('#modal')).not.toHaveClass(/open/);
    await page.locator('[data-cta="hero"]').click();
    await page.locator('.backdrop').click({ position: { x: 5, y: 5 } });
    await expect(page.locator('#modal')).not.toHaveClass(/open/);
    await expect(page.locator('body')).not.toHaveClass(/locked/);
    const calls = await pixel.calls();
    expect(calls.filter((c) => c[0] === 'trackCustom' && c[1] === 'BookCTAClick').map((c) => c[2].position)).toEqual(expect.arrayContaining(['hero', 'final']));
  });

  test('form validation, 3-step booking flow, payment links and WhatsApp hand-off (external calls intercepted)', async ({ page, context, pixel, formPosts }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto(WS_URL);
    // Links that would leave the page / open native apps: prevent default in capture phase; the page's own handlers still run.
    await page.evaluate(() => document.addEventListener('click', (e) => {
      if ((e.target as Element).closest('#gpayBtn,#phonepeBtn,#upiBtn,#waBtn')) e.preventDefault();
    }, true));
    await page.locator('[data-cta="hero"]').click();
    // empty submit -> every field flagged
    await page.locator('#btn1').click();
    await expect(page.locator('.field.bad')).toHaveCount(5);
    await expect(page.locator('#agreeLbl')).toHaveClass(/bad/);
    await expect(page.locator('#step2')).toBeHidden();
    await shot(page, '13-form-validation-errors.png');
    // bad phone / email specifically
    await page.fill('#name', 'QA Test'); await page.fill('#phone', '1234567890'); await page.fill('#email', 'not-an-email');
    await page.selectOption('#gender', 'Female'); await page.fill('#age', '25'); await page.locator('#agree').check();
    await page.locator('#btn1').click();
    await expect(page.locator('#phone').locator('xpath=ancestor::div[contains(@class,"field")]')).toHaveClass(/bad/);
    await expect(page.locator('#email').locator('xpath=ancestor::div[contains(@class,"field")]')).toHaveClass(/bad/);
    // valid data (obviously fake test values)
    await page.fill('#phone', '+91 98765 43210'); await page.fill('#email', 'qa.test@example.com');
    await shot(page, '14-form-filled.png');
    await page.locator('#btn1').click();
    await expect(page.locator('#step2')).toBeVisible();
    expect(formPosts, 'form should POST exactly once to FormSubmit endpoint (intercepted)').toHaveLength(1);
    const ref = (await page.locator('#refTxt').innerText()).trim();
    expect(ref).toMatch(/^HH-\d{4}$/);
    expect(formPosts[0]['Booking ID']).toBe(ref);
    expect(formPosts[0]['WhatsApp']).toBe('+91 9876543210');
    const lead = (await pixel.calls()).find((c) => c[0] === 'track' && c[1] === 'Lead');
    expect(lead, 'page did not call fbq(track, Lead)').toBeTruthy();
    expect(lead![2]).toMatchObject({ value: 999, currency: 'INR' });
    expect(lead![3]).toEqual({ eventID: ref });
    await shot(page, '15-step2-payment.png');
    // payment links
    const upi = await page.locator('#upiBtn').getAttribute('href');
    expect(upi).toContain('upi://pay?pa=halogaminghouse%40ybl');
    expect(upi).toContain('am=999.00');
    expect(upi).toContain(encodeURIComponent(ref));
    expect(await page.locator('#gpayBtn').getAttribute('href')).toContain('package=com.google.android.apps.nbu.paisa.user');
    expect(await page.locator('#phonepeBtn').getAttribute('href')).toContain('package=com.phonepe.app');
    // .mobile-only links are display:none at desktop width; dispatch the click so the page's own handlers run (mobile visibility is covered separately).
    await page.locator('#upiBtn').dispatchEvent('click');
    await page.locator('#gpayBtn').dispatchEvent('click');
    await expect.poll(async () => (await pixel.calls()).filter((c) => c[1] === 'InitiateCheckout').length).toBeGreaterThanOrEqual(2);
    await page.locator('#copyUpi').click();
    await expect(page.locator('#copyUpi')).toHaveText('✓ UPI ID copied');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('halogaminghouse@ybl');
    await expect(page.locator('#copyUpi')).toHaveText('Copy UPI ID', { timeout: 5000 });
    await expect(page.locator('img.qr')).toBeVisible();
    // step 3
    await page.locator('#paidBtn').click();
    await expect(page.locator('#step3')).toBeVisible();
    const wa = await page.locator('#waBtn').getAttribute('href');
    expect(wa).toMatch(/^https:\/\/wa\.me\/918754706742\?text=/);
    expect(decodeURIComponent(wa!)).toContain(`Booking ID: ${ref}`);
    await page.locator('#waBtn').click();
    await expect.poll(async () => (await pixel.calls()).some((c) => c[1] === 'Contact')).toBe(true);
    await shot(page, '16-step3-whatsapp.png');
    await page.locator('#backPay').click();
    await expect(page.locator('#step2')).toBeVisible();
    writeReport('pixel-events-attempted.json', { note: 'fbq() calls issued by the page (captured via Proxy). facebook.com/tr requests are aborted by the test; this shows the page fired events, NOT that Meta received them.',
      fbqCalls: await pixel.calls(), tradRequestsObserved: [...pixel] });
  });

  test('booking auto-closes after the deadline (clock set to 14 Nov 2026 IST)', async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-11-14T00:00:00+05:30'));
    await page.goto(WS_URL);
    await expect(page.locator('#cdWrap')).toContainText('Online booking closed');
    await page.locator('[data-cta="hero"]').click();
    await expect(page.locator('#closedBox')).toBeVisible();
    await expect(page.locator('#step1')).toBeHidden();
    await shot(page, '17-booking-closed-state.png');
  });

  test('countdown ticks while booking is open', async ({ page }) => {
    await page.goto(WS_URL);
    await expect(page.locator('#cd')).toContainText('DAYS');
    const a = await page.locator('#cd div').nth(3).innerText();
    await expect.poll(async () => page.locator('#cd div').nth(3).innerText(), { timeout: 5000 }).not.toBe(a);
  });

  test('FAQ <details> toggle, and static links (tel / WhatsApp / Maps / Instagram) have correct targets', async ({ page }) => {
    await page.goto(WS_URL);
    const details = page.locator('details');
    const count = await details.count();
    expect(count).toBeGreaterThan(0);
    await details.first().scrollIntoViewIfNeeded();
    await shot(page, '18-faq-before.png');
    await details.first().locator('summary').click();
    await expect(details.first()).toHaveAttribute('open', '');
    await shot(page, '19-faq-opened.png');
    await details.first().locator('summary').click();
    await expect(details.first()).not.toHaveAttribute('open', '');
    expect(await page.locator('a[href^="tel:"]').first().getAttribute('href')).toBe('tel:+918754706742');
    const ext = await page.locator('a[target="_blank"]').evaluateAll((as) => as.map((a) => ({ href: (a as HTMLAnchorElement).href, rel: (a as HTMLAnchorElement).rel })));
    expect(ext.length).toBeGreaterThan(0);
    for (const l of ext.filter((l) => !l.href.endsWith('#'))) expect(l.rel, `${l.href} lacks noopener`).toContain('noopener');
    const hrefs = ext.map((e) => e.href).join(' ');
    for (const h of ['wa.me/918754706742', 'maps.app.goo.gl', 'instagram.com/halohouse._', 'instagram.com/methini.g_06']) expect(hrefs).toContain(h);
    writeReport('external-links-not-followed.json', { note: 'attributes verified only; external destinations were not navigated to', links: ext });
  });

  test('hero video plays and lazy reels load/pause with scroll', async ({ page }) => {
    await page.goto(WS_URL);
    const hero = page.locator('#heroVid');
    await expect.poll(() => hero.evaluate((v: HTMLVideoElement) => !v.paused && v.currentTime > 0), { timeout: 15_000, message: 'hero video not playing' }).toBe(true);
    const reel = page.locator('.reel video').first();
    expect(await reel.evaluate((v: HTMLVideoElement) => v.getAttribute('src'))).toBeNull(); // lazy: not loaded yet
    await reel.scrollIntoViewIfNeeded();
    await expect.poll(() => reel.evaluate((v: HTMLVideoElement) => !v.paused && v.currentTime > 0), { timeout: 15_000 }).toBe(true);
    await shot(page, '20-reel-playing.png');
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect.poll(() => reel.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  });

  test('mobile: sticky CTA opens modal and pay-app buttons are shown on step 2', async ({ page, formPosts }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(WS_URL);
    await page.evaluate(() => window.scrollTo(0, 800));
    const sticky = page.locator('#sticky .btn');
    await expect(sticky).toBeVisible();
    await shot(page, '21-mobile-sticky-cta.png');
    await sticky.click();
    await expect(page.locator('#modal')).toHaveClass(/open/);
    await page.fill('#name', 'QA Test'); await page.fill('#phone', '9876543210'); await page.fill('#email', 'qa.test@example.com');
    await page.selectOption('#gender', 'Other'); await page.fill('#age', '30'); await page.locator('#agree').check();
    await page.locator('#btn1').click();
    await expect(page.locator('#step2')).toBeVisible();
    await expect(page.locator('#gpayBtn')).toBeVisible();
    await expect(page.locator('#phonepeBtn')).toBeVisible();
    await shot(page, '22-mobile-payment-step.png');
    expect(formPosts).toHaveLength(1);
  });

  test('phone and age validation: inline errors, blocks Step 2, nothing posted', async ({ page, formPosts }) => {
    await page.goto(WS_URL);
    await page.locator('[data-cta="hero"]').click();
    const field = (id: string) => page.locator(`#${id}`).locator('xpath=ancestor::div[contains(@class,"field")]');
    const fillRest = async () => {
      await page.fill('#name', 'QA Test'); await page.fill('#email', 'qa.test@example.com');
      await page.selectOption('#gender', 'Female');
      if (!(await page.locator('#agree').isChecked())) await page.locator('#agree').check();
    };
    await fillRest();

    const badPhones = ['', '12345678901234567', '987654321', 'abcdefghij', '98765abcde', '98765#43210', '1234567890', '+91 98765 4321', '09876543210'];
    for (const p of badPhones) {
      await page.fill('#phone', p); await page.fill('#age', '25');
      await page.locator('#btn1').click();
      await expect(field('phone'), `phone "${p}" should be rejected`).toHaveClass(/bad/);
      await expect(field('phone').locator('.err')).not.toBeEmpty();
      await expect(page.locator('#step2'), `phone "${p}" must not reach Step 2`).toBeHidden();
    }
    // specific messages
    await page.fill('#phone', '12345678901234567'); await page.locator('#btn1').click();
    await expect(field('phone').locator('.err')).toContainText('10 digits');
    await page.fill('#phone', 'abc'); await page.locator('#btn1').click();
    await expect(field('phone').locator('.err')).toContainText('digits only');

    const badAges = ['', '0', '-5', '22.5', '4', '91', '150', '1e1'];
    for (const a of badAges) {
      await page.fill('#phone', '9876543210'); await page.fill('#age', a);
      await page.locator('#btn1').click();
      await expect(field('age'), `age "${a}" should be rejected`).toHaveClass(/bad/);
      await expect(field('age').locator('.err')).not.toBeEmpty();
      await expect(page.locator('#step2'), `age "${a}" must not reach Step 2`).toBeHidden();
    }
    expect(formPosts, 'no booking may be posted for invalid input').toHaveLength(0);

    // live (browser input) feedback: the error clears as soon as the value becomes valid
    await page.fill('#age', '22.5'); await page.locator('#btn1').click();
    await expect(field('age')).toHaveClass(/bad/);
    await page.fill('#age', '22');
    await expect(field('age')).not.toHaveClass(/bad/);

    // valid values go through: bare 10 digits, +91 prefix, 91 prefix; ages at both range limits
    for (const [p, a] of [['9876543210', '5'], ['+91 98765 43210', '90'], ['919876543210', '22']]) {
      await page.fill('#phone', p); await page.fill('#age', a);
      await page.locator('#btn1').click();
      await expect(page.locator('#step2'), `phone "${p}" age "${a}" should be accepted`).toBeVisible();
      expect(formPosts[formPosts.length - 1]['WhatsApp']).toBe('+91 9876543210');
      await page.evaluate(() => { document.getElementById('step2')!.classList.add('hidden'); document.getElementById('step1')!.classList.remove('hidden'); });
    }
    expect(formPosts).toHaveLength(3);
  });
});

// ---------------------------------------------------------------- Meta Pixel
test('AC-11 Meta Pixel (uninstrumented page): one snippet, one init, one fbevents.js, no warnings, absent from the React app', async ({ page, capture }) => {
  const html = fs.readFileSync(path.join(ROOT, 'public/workshop/index.html'), 'utf8');
  expect((html.match(/fbq\('init'/g) || []).length, "fbq('init') count in source").toBe(1);
  expect((html.match(/fbevents\.js/g) || []).length, 'fbevents.js references in source').toBe(1);
  const fbReqs: string[] = [];
  page.on('request', (r) => { if (/fbevents\.js/.test(r.url())) fbReqs.push(r.url()); });
  await page.goto(WS_URL, { waitUntil: 'load' });
  await page.waitForTimeout(2000);
  expect(await page.locator('script[src*="fbevents.js"]').count(), 'fbevents <script> elements in DOM').toBe(1);
  expect(fbReqs.length, 'fbevents.js network requests').toBe(1);
  const runtime = await page.evaluate(() => ({ hasFbq: typeof (window as any).fbq === 'function', loaded: !!(window as any).fbq?.loaded, pixels: Object.keys((window as any).fbq?.instance?.pixelsByID ?? {}) }));
  expect(runtime.hasFbq).toBe(true);
  expect(runtime.loaded, 'fbevents.js did not finish loading').toBe(true);
  expect(runtime.pixels, 'exactly one pixel ID registered').toEqual(['2243273103276547']);
  expect(consoleLog.filter((c) => /Multiple pixels/.test(c.text) && c.test.includes('uninstrumented')), 'Meta duplicate-pixel warning').toEqual([]);
  await page.goto('/', { waitUntil: 'load' });
  expect(await page.evaluate(() => typeof (window as any).fbq), 'React app must not carry a pixel').toBe('undefined');
  expect(await page.locator('script[src*="fbevents.js"]').count()).toBe(0);
  writeReport('meta-pixel-verification.json', {
    codeExistsOnce: true, fbeventsRequests: fbReqs, runtime, duplicateWarningObserved: false, tradRequestsObserved: [...capture.hits],
    deliveryVerified: false,
    note: 'Pixel code exists once, fbevents.js loads once and the pixel ID initialises once. facebook.com/tr requests are aborted by the test to avoid polluting the live pixel (no facebook.com/tr requests were observed from localhost; the reason was not established). External event delivery is NOT verified.' });
});

test('AC-11 Meta Pixel (fbq call log): init once, PageView once', async ({ page, pixel }) => {
  await page.goto(WS_URL, { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  const calls = await pixel.calls();
  expect(calls.filter((c) => c[0] === 'init'), 'fbq(init) runtime calls').toEqual([['init', '2243273103276547']]);
  expect(calls.filter((c) => c[0] === 'track' && c[1] === 'PageView'), 'PageView calls').toHaveLength(1);
});

// ---------------------------------------------------------------- AC-08 existing site
test.describe('AC-08 existing Halo House regression', () => {
  test('home page renders, nav works, routes load, assets load', async ({ page }) => {
    test.setTimeout(240_000); // dev server serves ~700 MB of unminified media/3D assets
    const localFail: string[] = [];
    page.on('response', (r) => { if (r.url().startsWith(new URL(page.url() === 'about:blank' ? 'http://localhost' : page.url()).origin) && r.status() >= 400) localFail.push(`${r.status()} ${r.url()}`); });
    const errs: string[] = [];
    page.on('pageerror', (e) => errs.push(String(e)));
    const res = await page.goto('/', { waitUntil: 'load' });
    expect(res!.status()).toBe(200);
    await expect(page).toHaveTitle(/Podcast Studio for Creators/);
    await expect.poll(() => page.locator('#root > *').count(), { message: 'React root empty' }).toBeGreaterThan(0);
    await page.waitForTimeout(2500); // allow hero/3D to settle
    expect((await page.locator('#root').innerText()).length).toBeGreaterThan(50);
    await shot(page, '10-existing-halohouse-regression.png');
    await shot(page, '10b-existing-halohouse-full-page.png', true);
    const navLinks = await page.locator('a[href^="/"]').evaluateAll((as) => [...new Set(as.map((a) => (a as HTMLAnchorElement).getAttribute('href')))]);
    expect(navLinks.length, 'no internal nav links found').toBeGreaterThan(0);
    const results: Record<string, unknown> = { navLinksFound: navLinks };
    for (const r of ['/portfolio', '/services', '/about', '/careers', '/contact', '/book-session', '/feedback']) {
      const rr = await page.goto(r, { waitUntil: 'domcontentloaded' });
      await expect.poll(() => page.locator('#root > *').count(), { message: `${r} rendered nothing` }).toBeGreaterThan(0);
      results[r] = { status: rr!.status(), title: await page.title(), rootChars: (await page.locator('#root').innerText()).length };
    }
    // client-side navigation via the real nav
    await page.goto('/', { waitUntil: 'load' });
    const aboutLink = page.locator('a[href="/about"]').first();
    if (await aboutLink.count()) {
      await aboutLink.click({ force: true });
      await expect(page).toHaveURL(/\/about$/);
      results['clientNavToAbout'] = 'ok';
    }
    // workshop still reachable after React navigation, and vice versa
    await page.goto(WS_URL);
    await expect(page.locator('h1')).toContainText('Always dreamt of modelling');
    await page.goto('/');
    await expect(page.locator('#root > *').first()).toBeAttached();
    results['uncaughtExceptions'] = errs;
    results['localHttpErrors'] = localFail;
    writeReport('existing-site-regression.json', results);
    expect(errs, 'uncaught exceptions on the existing site').toEqual([]);
    expect(localFail.filter((f) => !f.includes('/workshop/does-not-exist')), 'local 4xx/5xx').toEqual([]);
  });
});
