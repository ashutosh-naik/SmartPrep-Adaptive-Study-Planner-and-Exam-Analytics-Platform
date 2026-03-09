const { chromium } = require('playwright');

async function runCase(name, setupScript) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const events = [];
  page.on('console', m => events.push({ type: 'console', text: m.text() }));
  page.on('pageerror', e => events.push({ type: 'pageerror', text: e.message, stack: e.stack }));
  page.on('requestfailed', r => events.push({ type: 'requestfailed', text: `${r.url()} :: ${r.failure()?.errorText}` }));

  await page.goto('http://127.0.0.1:5173', { waitUntil: 'domcontentloaded', timeout: 60000 });
  if (setupScript) {
    await page.evaluate(setupScript);
    await page.reload({ waitUntil: 'networkidle', timeout: 60000 });
  } else {
    await page.waitForLoadState('networkidle');
  }

  const rootLen = await page.evaluate(() => document.getElementById('root')?.innerHTML?.length || 0);
  const path = page.url();
  console.log(`CASE=${name}`);
  console.log(`URL=${path}`);
  console.log(`ROOT_LEN=${rootLen}`);
  console.log(`EVENTS=${JSON.stringify(events, null, 2)}`);
  await browser.close();
}

(async () => {
  await runCase('normal', null);
  await runCase('broken_user_json', () => {
    localStorage.setItem('smartprep_user', '{ bad json');
    localStorage.setItem('smartprep_token', 'abc');
  });
  await runCase('broken_theme', () => {
    localStorage.setItem('smartprep-theme-mode', '???');
  });
})();
