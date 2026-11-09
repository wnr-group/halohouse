import { test as base, expect, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Final-verification suite: AC-numbered evidence. Screenshot names carry the environment (__dev / __preview)
// so a screenshot from one environment can never be mistaken for another.
const TARGET = process.env.E2E_TARGET === 'preview' ? 'preview' : 'dev';
const ROOT = path.resolve(__dirname, '../..');
const OUT = path.join(ROOT, 'screenshots', 'workshop', process.env.E2E_OUT || '');
const WS = '/workshop/';
fs.mkdirSync(OUT, { recursive: true });
const shot = (page: Page, name: string, fullPage = false) =>
  page.screenshot({ path: path.join(OUT, `${name}__${TARGET}.png`), fullPage });
const report = (name: string, data: unknown) =>
  fs.writeFileSync(path.join(OUT, `${name}__${TARGET}.json`), JSON.stringify(data, null, 2));

// No real emails and no events to the live Meta pixel from tests.
const test = base.extend<{ guard: { posts: number } }>({
  guard: [async ({ page }, use) => {
    const g = { posts: 0 };
    await page.route(/facebook\.com\/tr/, (r) => r.abort());
    await page.route(/formsubmit\.co/, (r) => { g.posts++; return r.fulfill({ status: 200, contentType: 'application/json', body: '{"success":"true"}' }); });
    await use(g);
  }, { auto: true }],
});

const settle = (page: Page) =>
  page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 70)); } window.scrollTo(0, 0); });

test.describe('AC-02 routing & navigation', () => {
  test('AC-02 direct URL, refresh, fresh context', async ({ page, browser, baseURL }) => {
    const r = await page.goto(WS);
    expect(r!.status()).toBe(200);
    await expect(page.locator('h1')).toContainText('Always dreamt of modelling');
    await shot(page, 'AC-02-direct-url-desktop');
    await page.reload();
    expect(new URL(page.url()).pathname).toBe(WS);
    await expect(page.locator('h1')).toBeVisible();
    await shot(page, 'AC-02-direct-url-refresh');
    const ctx = await browser.newContext({ baseURL, viewport: { width: 1440, height: 900 } });
    const p2 = await ctx.newPage();
    await p2.route(/facebook\.com\/tr/, (x) => x.abort());
    expect((await p2.goto(WS))!.status()).toBe(200);
    await expect(p2.locator('h1')).toContainText('Always dreamt of modelling');
    await p2.screenshot({ path: path.join(OUT, `AC-02-fresh-context__${TARGET}.png`) });
    await ctx.close();
  });

  test('AC-02 /workshop (no slash) behaviour recorded; dev must redirect to /workshop/', async ({ page }) => {
    const r = await page.request.get('/workshop', { maxRedirects: 0 });
    const out = { status: r.status(), location: r.headers()['location'] ?? null };
    await page.goto('/workshop');
    const landed = { url: new URL(page.url()).pathname, title: await page.title() };
    report('AC-02-no-slash-routing', { ...out, landed });
    if (TARGET === 'dev') { expect(out.status).toBe(308); expect(out.location).toBe(WS); expect(landed.url).toBe(WS); }
    // preview: vite preview has no redirect rule; the production redirect is vercel.json and is only testable on Vercel (AC-12).
  });

  test('AC-02 workshop <-> Halo House navigation with back/forward', async ({ page }) => {
    await page.goto(WS);
    await page.goto('/about', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#root > *').first()).toBeAttached();
    await page.goBack({ waitUntil: 'domcontentloaded' });
    expect(new URL(page.url()).pathname).toBe(WS);
    await expect(page.locator('h1')).toContainText('Always dreamt of modelling');
    await shot(page, 'AC-02-back-to-workshop');
    await page.goForward({ waitUntil: 'domcontentloaded' });
    expect(new URL(page.url()).pathname).toBe('/about');
    await expect(page.locator('#root > *').first()).toBeAttached();
    await shot(page, 'AC-02-forward-to-halohouse');
  });
});

test('AC-03 standalone: no React root, no app bundle, no app scripts requested', async ({ page }) => {
  const reqs: string[] = [];
  page.on('request', (r) => reqs.push(r.url()));
  await page.goto(WS, { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  expect(await page.locator('#root').count()).toBe(0);
  const scripts = await page.locator('script[src]').evaluateAll((s) => s.map((x) => (x as HTMLScriptElement).src));
  const appBundle = reqs.filter((u) => /\/assets\/index-[\w-]+\.js|\/main\.tsx|@vite\/client|react/i.test(u) && !/facebook/.test(u));
  report('AC-03-standalone', { scripts, appBundleRequests: appBundle });
  // dev serves @vite/client to every page; that is the dev server, not the React app.
  expect(appBundle.filter((u) => !/@vite\/client/.test(u)), 'React app bundle requested by workshop page').toEqual([]);
  await shot(page, 'AC-03-standalone-rendering');
});

test('AC-04 every resource type loads: css, js, fonts, images, video, bg-images, icons; no failures', async ({ page }) => {
  const resp: { url: string; status: number; type: string }[] = [];
  const failed: string[] = [];
  const consoleErr: string[] = [];
  page.on('response', (r) => resp.push({ url: r.url(), status: r.status(), type: r.request().resourceType() }));
  page.on('requestfailed', (r) => { if (!/facebook\.com\/tr/.test(r.url())) failed.push(`${r.url()} ${r.failure()?.errorText}`); });
  page.on('console', (m) => { if (m.type() === 'error') consoleErr.push(m.text()); });
  await page.goto(WS, { waitUntil: 'load' });
  await settle(page);
  for (const v of await page.locator('.reel video').all()) { await v.scrollIntoViewIfNeeded(); await expect.poll(() => v.evaluate((e: HTMLVideoElement) => e.readyState), { timeout: 15_000 }).toBeGreaterThanOrEqual(2); }
  const state = await page.evaluate(async () => {
    await document.fonts.ready;
    const bg = [...document.querySelectorAll('*')].map((e) => getComputedStyle(e).backgroundImage).filter((b) => b.includes('url(')).map((b) => b.match(/url\("?([^")]+)/)![1]);
    return {
      fonts: [...document.fonts].map((f) => `${f.family}:${f.status}`),
      brokenImgs: [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src),
      bgImages: bg, videos: [...document.querySelectorAll('video')].map((v) => ({ src: v.currentSrc, ready: v.readyState })),
      icons: [...document.querySelectorAll('link[rel*=icon]')].map((l) => (l as HTMLLinkElement).href),
      sheets: [...document.styleSheets].length,
    };
  });
  const byType: Record<string, number> = {};
  for (const r of resp) byType[r.type] = (byType[r.type] || 0) + 1;
  const bad = resp.filter((r) => r.status >= 400);
  report('AC-04-assets', { byType, state, failed, badStatuses: bad, consoleErrors: consoleErr, total: resp.length });
  expect(bad, 'HTTP >= 400').toEqual([]);
  expect(failed, 'failed requests').toEqual([]);
  expect(state.brokenImgs).toEqual([]);
  expect(state.fonts.filter((f) => /error/.test(f)), 'fonts in error state').toEqual([]);
  expect(state.fonts.some((f) => /loaded/.test(f)), 'at least one webfont loaded').toBe(true);
  expect(byType['stylesheet'] ?? 0).toBeGreaterThan(0);
  expect(byType['media'] ?? 0, 'video requests').toBeGreaterThan(0);
  expect(consoleErr, 'console errors on workshop').toEqual([]);
  await shot(page, 'AC-04-assets-loaded', true);
});

test('AC-05 visual: original file (file://) vs served page — pixel diff per viewport, plus section screenshots', async ({ page }) => {
  test.setTimeout(180_000);
  const original = 'file:///' + path.join(ROOT, 'workshop', 'index.html').replace(/\\/g, '/');
  const results: Record<string, unknown> = {};
  for (const vp of [{ w: 1440, h: 900 }, { w: 390, h: 844 }]) {
    await page.setViewportSize({ width: vp.w, height: vp.h });
    const grab = async (url: string) => {
      await page.goto(url, { waitUntil: 'load' });
      await settle(page);
      // freeze everything that legitimately changes frame to frame: videos, countdown, animations
      await page.addStyleTag({ content: 'video{visibility:hidden!important} #cd{visibility:hidden!important} *{animation:none!important;transition:none!important}' });
      await page.waitForTimeout(500);
      return page.screenshot({ fullPage: true });
    };
    const a = await grab(original), b = await grab(WS);
    const diff = await page.evaluate(async ([x, y]) => {
      const load = (s: string) => new Promise<HTMLImageElement>((res) => { const i = new Image(); i.onload = () => res(i); i.src = 'data:image/png;base64,' + s; });
      const [ia, ib] = await Promise.all([load(x), load(y)]);
      if (ia.width !== ib.width || ia.height !== ib.height) return { sameSize: false, a: [ia.width, ia.height], b: [ib.width, ib.height], diffPixels: -1, total: 0 };
      const c = (i: HTMLImageElement) => { const k = document.createElement('canvas'); k.width = i.width; k.height = i.height; const g = k.getContext('2d')!; g.drawImage(i, 0, 0); return g.getImageData(0, 0, i.width, i.height).data; };
      const da = c(ia), db = c(ib); let n = 0;
      for (let p = 0; p < da.length; p += 4) if (Math.abs(da[p] - db[p]) > 8 || Math.abs(da[p + 1] - db[p + 1]) > 8 || Math.abs(da[p + 2] - db[p + 2]) > 8) n++;
      return { sameSize: true, a: [ia.width, ia.height], b: [ib.width, ib.height], diffPixels: n, total: da.length / 4 };
    }, [a.toString('base64'), b.toString('base64')]);
    results[`${vp.w}x${vp.h}`] = { ...diff, diffRatio: diff.total ? diff.diffPixels / diff.total : null };
    fs.writeFileSync(path.join(OUT, `AC-05-reference-original-file-${vp.w}x${vp.h}__${TARGET}.png`), a);
    fs.writeFileSync(path.join(OUT, `AC-05-served-${vp.w}x${vp.h}__${TARGET}.png`), b);
  }
  report('AC-05-visual-diff', results);
  for (const [k, v] of Object.entries(results as Record<string, any>)) { expect(v.sameSize, `${k} page height differs from original`).toBe(true); expect(v.diffRatio, `${k} diff ratio`).toBeLessThan(0.001); }
  // section shots at desktop
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(WS, { waitUntil: 'load' });
  await settle(page);
  for (const [sel, name] of [['header', 'header-navigation'], ['.hero', 'hero-section'], ['.mentor', 'mentor-section'], ['.reel >> nth=0', 'clips-section'], ['footer', 'footer'], ['.pricecard', 'pricing-section'], ['#book', 'booking-section'], ['.studio', 'workshop-info-section'], ['.pain', 'problem-section']] as const) {
    const el = page.locator(sel).first();
    await el.scrollIntoViewIfNeeded();
    await el.screenshot({ path: path.join(OUT, `AC-05-${name}__${TARGET}.png`) });
  }
});

test.describe('AC-06 interactions', () => {
  test('AC-06 inventory of interactive elements', async ({ page }) => {
    await page.goto(WS);
    const inv = await page.evaluate(() => ({
      anchors: [...document.querySelectorAll('a')].map((a) => ({ text: a.textContent!.trim().slice(0, 40), href: a.getAttribute('href'), target: a.target })),
      buttons: [...document.querySelectorAll('button,[data-cta],summary')].map((b) => ({ tag: b.tagName, id: b.id, text: b.textContent!.trim().slice(0, 40), cta: (b as HTMLElement).dataset.cta ?? null })),
      inputs: [...document.querySelectorAll('input,select,textarea')].map((i) => ({ id: i.id, type: (i as HTMLInputElement).type, required: (i as HTMLInputElement).required })),
      forms: [...document.forms].map((f) => ({ id: f.id, action: f.action, method: f.method })),
    }));
    report('AC-06-interactive-inventory', inv);
    expect(inv.anchors.length + inv.buttons.length).toBeGreaterThan(5);
  });

  test('AC-06 in-page anchor links scroll to existing targets', async ({ page }) => {
    await page.goto(WS);
    const hashes = await page.locator('a[href^="#"]').evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute('href')!).filter((h) => h.length > 1))]);
    const missing: string[] = [];
    for (const h of hashes) if (!(await page.locator(h).count())) missing.push(h);
    report('AC-06-anchor-targets', { hashes, missing });
    expect(missing).toEqual([]);
    if (hashes.length) {
      await page.locator(`a[href="${hashes[0]}"]`).first().click({ force: true });
      await page.waitForTimeout(600);
      await shot(page, 'AC-06-anchor-navigation');
    }
  });

  test('AC-06 booking CTA, validation, step flow, FAQ (all external calls intercepted)', async ({ page, guard }) => {
    await page.goto(WS);
    await page.locator('[data-cta="hero"]').click();
    await expect(page.locator('#modal')).toHaveClass(/open/);
    await shot(page, 'AC-06-booking-cta');
    await page.locator('#btn1').click();
    await expect(page.locator('.field.bad')).toHaveCount(5);
    await shot(page, 'AC-06-form-validation');
    await page.fill('#name', 'QA Test'); await page.fill('#phone', '9876543210'); await page.fill('#email', 'qa.test@example.com');
    await page.selectOption('#gender', 'Female'); await page.fill('#age', '25'); await page.locator('#agree').check();
    await page.locator('#btn1').click();
    await expect(page.locator('#step2')).toBeVisible();
    expect(guard.posts, 'form POST count (intercepted, nothing sent to FormSubmit)').toBe(1);
    await shot(page, 'AC-06-payment-step');
    await page.locator('#paidBtn').click();
    await expect(page.locator('#step3')).toBeVisible();
    await shot(page, 'AC-06-whatsapp-step');
    await page.keyboard.press('Escape');
    await page.locator('details').first().scrollIntoViewIfNeeded();
    await page.locator('details summary').first().click();
    await expect(page.locator('details').first()).toHaveAttribute('open', '');
    await shot(page, 'AC-06-faq-interaction');
  });
});

const viewports = [
  { id: 'desktop-1440x900', w: 1440, h: 900 }, { id: 'laptop-1366x768', w: 1366, h: 768 }, { id: 'tablet-768x1024', w: 768, h: 1024 },
  { id: 'mobile-390x844', w: 390, h: 844 }, { id: 'mobile-360x800', w: 360, h: 800 },
];
for (const v of viewports) {
  test(`AC-07 responsive ${v.id}`, async ({ page }) => {
    await page.setViewportSize({ width: v.w, height: v.h });
    await page.goto(WS, { waitUntil: 'load' });
    await settle(page);
    const m = await page.evaluate(() => {
      const vis = (e: Element) => (e as HTMLElement).offsetParent !== null || getComputedStyle(e).position === 'fixed';
      const small = [...document.querySelectorAll('a,button,summary,input,select')].filter(vis)
        .map((e) => ({ e, r: e.getBoundingClientRect() })).filter(({ r }) => r.width > 0 && (r.height < 44 || r.width < 44))
        .map(({ e, r }) => `${e.tagName.toLowerCase()}#${e.id}.${(e as HTMLElement).className} ${Math.round(r.width)}x${Math.round(r.height)}`);
      const distorted = [...document.images].filter((i) => i.naturalWidth && vis(i) && !/cover|contain/.test(getComputedStyle(i).objectFit))
        .filter((i) => { const r = i.getBoundingClientRect(); return r.width > 0 && Math.abs(r.width / r.height - i.naturalWidth / i.naturalHeight) / (i.naturalWidth / i.naturalHeight) > 0.02; }).map((i) => i.src);
      const clipped = [...document.querySelectorAll('h1,h2,h3,p,a,button,li')].filter((e) => vis(e) && e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflowX !== 'visible').map((e) => `${e.tagName}:${e.textContent!.trim().slice(0, 30)}`);
      const off = [...document.querySelectorAll('body *')].filter((e) => vis(e) && e.getBoundingClientRect().right > window.innerWidth + 1).slice(0, 5).map((e) => `${e.tagName}.${(e as HTMLElement).className}`);
      return { scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, small, distorted, clipped, off,
        stickyVisible: !!document.querySelector('#sticky') && getComputedStyle(document.querySelector('#sticky')!).display !== 'none' };
    });
    report(`AC-07-metrics-${v.id}`, m);
    expect(m.scrollWidth, `horizontal overflow; offenders ${m.off.join(',')}`).toBeLessThanOrEqual(m.innerWidth);
    expect(m.distorted, 'distorted images').toEqual([]);
    expect(m.clipped, 'clipped text').toEqual([]);
    await expect(page.locator('.hero .btn[data-cta="hero"]')).toBeVisible();
    await expect(page.locator('footer')).toBeAttached();
    await shot(page, `AC-07-${v.id}`);
    await shot(page, `AC-07-${v.id}-full`, true);
    // form usability: modal fits viewport and the submit button can be reached
    await page.locator('[data-cta="hero"]').click();
    await expect(page.locator('#modal')).toHaveClass(/open/);
    await page.locator('#btn1').scrollIntoViewIfNeeded();
    await expect(page.locator('#btn1')).toBeInViewport();
    await shot(page, `AC-07-${v.id}-form`);
  });
}

test('AC-08 existing Halo House: home + routes render, no redirect to workshop, client nav works', async ({ page }) => {
  test.setTimeout(240_000);
  const errs: string[] = [];
  page.on('pageerror', (e) => errs.push(String(e)));
  const res: Record<string, unknown> = {};
  await page.goto('/', { waitUntil: 'load' });
  await expect.poll(() => page.locator('#root > *').count()).toBeGreaterThan(0);
  await page.waitForTimeout(2500);
  await shot(page, 'AC-08-halohouse-regression');
  for (const r of ['/portfolio', '/services', '/about', '/careers', '/contact', '/feedback']) {
    await page.goto(r, { waitUntil: 'domcontentloaded' });
    await expect.poll(() => page.locator('#root > *').count(), { message: `${r} empty` }).toBeGreaterThan(0);
    res[r] = { finalPath: new URL(page.url()).pathname, rootChars: (await page.locator('#root').innerText()).length, title: await page.title() };
    expect(new URL(page.url()).pathname).toBe(r);
    if (r === '/portfolio') await shot(page, 'AC-08-halohouse-portfolio-route');
  }
  await page.goto('/', { waitUntil: 'load' });
  await page.locator('a[href="/about"]').first().click({ force: true });
  await expect(page).toHaveURL(/\/about$/);
  await shot(page, 'AC-08-halohouse-client-navigation');
  report('AC-08-routes', { res, uncaughtExceptions: errs });
  expect(errs).toEqual([]);
});

test('AC-09 build output served by this server contains the workshop (preview only)', async ({ page }) => {
  test.skip(TARGET !== 'preview', 'build output is served only by the preview target');
  const r = await page.goto(WS);
  expect(r!.status()).toBe(200);
  await expect(page.locator('h1')).toContainText('Always dreamt of modelling');
  expect(fs.existsSync(path.join(ROOT, 'build', 'workshop', 'index.html'))).toBe(true);
  await shot(page, 'AC-09-production-build');
});

test('AC-11 Meta Pixel: source once, init once, one fbevents.js, one pixel id, no duplicate warning (4 levels recorded)', async ({ page }) => {
  const html = fs.readFileSync(path.join(ROOT, 'public/workshop/index.html'), 'utf8');
  const warn: string[] = [];
  const tr: string[] = [];
  page.on('console', (m) => { if (/pixel/i.test(m.text())) warn.push(m.text()); });
  page.on('request', (r) => { if (/facebook\.com\/tr/.test(r.url())) tr.push(r.url().slice(0, 160)); });
  await page.goto(WS, { waitUntil: 'load' });
  await page.waitForTimeout(3000);
  const rt = await page.evaluate(() => ({ loaded: !!(window as any).fbq?.loaded, pixels: Object.keys((window as any).fbq?.instance?.pixelsByID ?? {}), scripts: document.querySelectorAll('script[src*="fbevents.js"]').length }));
  const L = {
    L1_codeExists: /fbq\('init'/.test(html), initCountInSource: (html.match(/fbq\('init'/g) || []).length, pixelIdsInSource: [...new Set(html.match(/fbq\('init',\s*'(\d+)'/g))],
    L2_initializesInBrowser: rt.loaded && rt.pixels.length === 1, runtime: rt,
    L3_browserAttemptedEventRequest: tr.length > 0, trRequestsSeen: tr,
    L4_metaReceived: 'NOT VERIFIED (requires Events Manager; requests are aborted by the test to avoid polluting the live pixel)', warnings: warn,
  };
  report('AC-11-meta-pixel', L);
  expect(L.initCountInSource).toBe(1);
  expect(rt.scripts).toBe(1);
  expect(rt.pixels).toEqual(['2243273103276547']);
  expect(warn.filter((w) => /multiple pixels|conflicting/i.test(w))).toEqual([]);
  await page.goto('/', { waitUntil: 'load' });
  expect(await page.evaluate(() => typeof (window as any).fbq)).toBe('undefined');
  await page.goto(WS);
  await shot(page, 'AC-11-meta-pixel-initialization');
});

test('AC-06/payment: UPI, GPay, PhonePe, WhatsApp targets are well-formed (links inspected, nothing opened or paid)', async ({ page }) => {
  await page.goto(WS);
  await page.locator('[data-cta="hero"]').click();
  for (const [k, v] of Object.entries({ name: 'QA Test', phone: '9876543210', email: 'qa.test@example.com', age: '25' })) await page.fill(`#${k}`, v);
  await page.selectOption('#gender', 'Female'); await page.locator('#agree').check();
  await page.locator('#btn1').click();
  await expect(page.locator('#step2')).toBeVisible();
  const hrefs = { upi: await page.locator('#upiBtn').getAttribute('href'), gpay: await page.locator('#gpayBtn').getAttribute('href'), phonepe: await page.locator('#phonepeBtn').getAttribute('href') };
  await page.locator('#paidBtn').click();
  const wa = await page.locator('#waBtn').getAttribute('href');
  const parsed = Object.fromEntries(Object.entries(hrefs).map(([k, h]) => { const u = new URL(h!); return [k, { scheme: u.protocol, host: u.host, params: Object.fromEntries(u.searchParams) }]; }));
  report('AC-06-payment-link-targets', { hrefs, wa, parsed, physicalDeviceVerification: 'NOT VERIFIED (no phone)' });
  for (const k of ['upi', 'gpay', 'phonepe'] as const) { expect(parsed[k].params['pa']).toBe('halogaminghouse@ybl'); expect(parsed[k].params['am']).toBe('999.00'); expect(parsed[k].params['cu']).toBe('INR'); }
  expect(new URL(wa!).host).toBe('wa.me');
});
