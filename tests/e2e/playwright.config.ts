import { defineConfig } from '@playwright/test';
import path from 'path';

// E2E_TARGET=dev (default)  -> `vite` dev server on :3000 (port from vite.config.ts)
// E2E_TARGET=preview        -> `vite preview` on :4173 (requires `npm run build` first)
const target = process.env.E2E_TARGET === 'preview' ? 'preview' : process.env.E2E_TARGET === 'live' ? 'live' : 'dev';
const port = target === 'preview' ? 4173 : 3000;
// E2E_TARGET=live -> read-only run against https://www.halohouse.digital (no local server)
const baseURL = target === 'live' ? (process.env.E2E_LIVE_URL || 'https://www.halohouse.digital') : `http://localhost:${port}`;
const root = path.resolve(__dirname, '../..');
const out = path.join(root, 'screenshots', 'workshop', process.env.E2E_OUT || '');

export default defineConfig({
  testDir: '.',
  testMatch: target === 'live' ? 'live.spec.ts' : /(workshop|final).spec.ts$/,
  outputDir: path.join(out, 'test-results', target),
  fullyParallel: false,
  workers: 1,
  timeout: 90_000,
  reporter: [
    ['list'],
    ['html', { outputFolder: path.join(out, 'playwright-report', target), open: 'never' }],
    ['json', { outputFile: path.join(out, `results-${target}.json`) }],
  ],
  use: {
    baseURL,
    // Real Chrome (not bundled Chromium) so the page's H.264 .mp4 videos can actually play.
    channel: 'chrome',
    // snapshots:false keeps response bodies out of the trace: the React pages stream hundreds of MB of video and
    // full tracing made context teardown exceed the test timeout.
    trace: { mode: 'retain-on-failure', snapshots: false, screenshots: false, sources: false },
    screenshot: 'only-on-failure',
  },
  webServer: target === 'live' ? undefined : {
    command: target === 'preview'
      ? `npx vite preview --port ${port} --strictPort`
      : `npx vite --port ${port} --strictPort`,
    cwd: root,
    url: `http://localhost:${port}/`,
    reuseExistingServer: true,
    timeout: 120_000,
    env: { BROWSER: 'none' }, // vite.config.ts has server.open=true; keep it from opening a window
  },
});
