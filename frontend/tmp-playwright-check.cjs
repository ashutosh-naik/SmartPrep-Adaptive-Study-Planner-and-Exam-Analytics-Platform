const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const events = [];
  page.on('console', (msg) => events.push({ type: 'console', text: msg.text() }));
  page.on('pageerror', (err) => events.push({ type: 'pageerror', text: err.message, stack: err.stack }));
  page.on('requestfailed', (req) => events.push({ type: 'requestfailed', text: `${req.method()} ${req.url()} :: ${req.failure()?.errorText}` }));
  await page.goto('http://127.0.0.1:5173/login', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1500);
  const htmlLen = await page.evaluate(() => document.getElementById('root')?.innerHTML?.length || 0);
  console.log('ROOT_HTML_LENGTH=' + htmlLen);
  console.log('EVENTS=' + JSON.stringify(events, null, 2));
  await browser.close();
})();
