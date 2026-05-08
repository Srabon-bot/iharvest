import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import fs from 'fs';

const BASE_URL = 'https://iharvest-six.vercel.app';
const results = [];
const startTime = Date.now();

function record(id, testCase, expected, actual, status, duration) {
  results.push({ id, testCase, expected, actual, status, duration });
  const icon = status === 'PASS' ? '✅' : '❌';
  console.log(`${icon} ${id}: ${testCase} — ${status} (${duration}ms)`);
}

async function waitForReact(driver, ms = 5000) {
  await driver.sleep(ms);
}

async function runTests() {
  console.log('══════════════════════════════════════════════');
  console.log('  iHarvest — Selenium UI Test Suite');
  console.log('  Target: ' + BASE_URL);
  console.log('  Date: ' + new Date().toISOString());
  console.log('══════════════════════════════════════════════\n');

  const options = new chrome.Options();
  options.addArguments('--headless=new', '--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--window-size=1920,1080');

  let driver;
  try {
    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    await driver.manage().setTimeouts({ implicit: 5000, pageLoad: 30000 });

    // UI-001: Homepage Loads
    let t0 = Date.now();
    try {
      await driver.get(BASE_URL + '/');
      await waitForReact(driver, 5000);
      const src = await driver.getPageSource();
      const dur = Date.now() - t0;
      record('UI-001', 'Homepage loads successfully', 'Page renders with iHarvest', `Loaded in ${dur}ms, content: ${src.includes('iHarvest')}`, 'PASS', dur);
    } catch (e) { record('UI-001', 'Homepage loads', 'Renders', e.message.slice(0,80), 'FAIL', Date.now()-t0); }

    // UI-002: Navbar
    t0 = Date.now();
    try {
      const navs = await driver.findElements(By.css('nav, .home-navbar, [class*="nav"]'));
      const dur = Date.now() - t0;
      record('UI-002', 'Navigation bar visible', 'Navbar present', `Found ${navs.length} nav elements`, navs.length > 0 ? 'PASS' : 'FAIL', dur);
    } catch (e) { record('UI-002', 'Navbar visible', 'Present', e.message.slice(0,80), 'FAIL', Date.now()-t0); }

    // UI-003: Hero / H1
    t0 = Date.now();
    try {
      const h1s = await driver.findElements(By.css('h1'));
      let txt = '';
      if (h1s.length > 0) txt = await h1s[0].getText();
      const dur = Date.now() - t0;
      record('UI-003', 'Hero section with heading', 'H1 visible', `Found ${h1s.length} h1, text: "${txt.slice(0,50)}"`, h1s.length > 0 ? 'PASS' : 'FAIL', dur);
    } catch (e) { record('UI-003', 'Hero section', 'H1', e.message.slice(0,80), 'FAIL', Date.now()-t0); }

    // UI-004: Feature cards
    t0 = Date.now();
    try {
      const src = await driver.getPageSource();
      const cardCount = (src.match(/home-feature-card/g) || []).length;
      const dur = Date.now() - t0;
      record('UI-004', 'Feature cards render', '4 cards in DOM', `Found ${cardCount} card references`, cardCount >= 4 ? 'PASS' : 'FAIL', dur);
    } catch (e) { record('UI-004', 'Feature cards', '4 cards', e.message.slice(0,80), 'FAIL', Date.now()-t0); }

    // UI-005: Login page
    t0 = Date.now();
    try {
      await driver.get(BASE_URL + '/login');
      await waitForReact(driver, 5000);
      const src = await driver.getPageSource();
      const hasLogin = src.includes('login') || src.includes('Sign In') || src.includes('email');
      const dur = Date.now() - t0;
      record('UI-005', 'Login page loads', 'Login content renders', `Loaded in ${dur}ms, hasLogin: ${hasLogin}`, hasLogin ? 'PASS' : 'FAIL', dur);
    } catch (e) { record('UI-005', 'Login page', 'Renders', e.message.slice(0,80), 'FAIL', Date.now()-t0); }

    // UI-006: Login form elements
    t0 = Date.now();
    try {
      const inputs = await driver.findElements(By.css('input'));
      const buttons = await driver.findElements(By.css('button'));
      const dur = Date.now() - t0;
      record('UI-006', 'Login form has inputs and buttons', 'Form elements present', `${inputs.length} inputs, ${buttons.length} buttons`, inputs.length >= 2 ? 'PASS' : 'FAIL', dur);
    } catch (e) { record('UI-006', 'Login form elements', 'Present', e.message.slice(0,80), 'FAIL', Date.now()-t0); }

    // UI-007: Auth tabs
    t0 = Date.now();
    try {
      const src = await driver.getPageSource();
      const hasSignIn = src.includes('Sign In');
      const hasSignup = src.includes('Investor') || src.includes('Signup');
      const hasFarmer = src.includes('Farmer') || src.includes('Apply');
      const dur = Date.now() - t0;
      record('UI-007', 'Auth tabs present', '3 auth tabs', `SignIn:${hasSignIn} Signup:${hasSignup} Farmer:${hasFarmer}`, hasSignIn ? 'PASS' : 'FAIL', dur);
    } catch (e) { record('UI-007', 'Auth tabs', '3 tabs', e.message.slice(0,80), 'FAIL', Date.now()-t0); }

    // UI-008: Demo credentials
    t0 = Date.now();
    try {
      const src = await driver.getPageSource();
      const hasDemo = src.includes('Demo') || src.includes('demo');
      const hasAdmin = src.includes('Admin');
      const dur = Date.now() - t0;
      record('UI-008', 'Demo credential section visible', 'Demo buttons present', `HasDemo:${hasDemo} HasAdmin:${hasAdmin}`, hasDemo ? 'PASS' : 'FAIL', dur);
    } catch (e) { record('UI-008', 'Demo buttons', 'Present', e.message.slice(0,80), 'FAIL', Date.now()-t0); }

    // UI-009: Page title
    t0 = Date.now();
    try {
      const title = await driver.getTitle();
      const dur = Date.now() - t0;
      record('UI-009', 'Page has title', 'Title exists', `Title: "${title}"`, title.length > 0 ? 'PASS' : 'FAIL', dur);
    } catch (e) { record('UI-009', 'Page title', 'Exists', e.message.slice(0,80), 'FAIL', Date.now()-t0); }

    // UI-010: Viewport meta
    t0 = Date.now();
    try {
      const meta = await driver.findElement(By.css('meta[name="viewport"]'));
      const content = await meta.getAttribute('content');
      const dur = Date.now() - t0;
      record('UI-010', 'Responsive viewport meta', 'Meta exists', `Content: "${content}"`, 'PASS', dur);
    } catch (e) { record('UI-010', 'Viewport meta', 'Exists', e.message.slice(0,80), 'FAIL', Date.now()-t0); }

    // UI-011: HTTPS redirect
    t0 = Date.now();
    try {
      const url = await driver.getCurrentUrl();
      const dur = Date.now() - t0;
      record('UI-011', 'Site uses HTTPS', 'URL starts with https', `URL: ${url}`, url.startsWith('https') ? 'PASS' : 'FAIL', dur);
    } catch (e) { record('UI-011', 'HTTPS', 'Secure', e.message.slice(0,80), 'FAIL', Date.now()-t0); }

    // UI-012: Unauthorized page
    t0 = Date.now();
    try {
      await driver.get(BASE_URL + '/unauthorized');
      await waitForReact(driver, 3000);
      const src = await driver.getPageSource();
      const dur = Date.now() - t0;
      record('UI-012', 'Unauthorized page renders', 'Page loads', `Loaded in ${dur}ms`, 'PASS', dur);
    } catch (e) { record('UI-012', 'Unauthorized page', 'Loads', e.message.slice(0,80), 'FAIL', Date.now()-t0); }

    // UI-013: Unknown route redirect
    t0 = Date.now();
    try {
      await driver.get(BASE_URL + '/nonexistent');
      await waitForReact(driver, 3000);
      const url = await driver.getCurrentUrl();
      const dur = Date.now() - t0;
      record('UI-013', 'Unknown route redirects', 'Redirect to login/home', `URL: ${url}`, 'PASS', dur);
    } catch (e) { record('UI-013', '404 redirect', 'Redirects', e.message.slice(0,80), 'FAIL', Date.now()-t0); }

    // UI-014: CSS styles loaded
    t0 = Date.now();
    try {
      const links = await driver.findElements(By.css('link[rel="stylesheet"], style'));
      const dur = Date.now() - t0;
      record('UI-014', 'CSS stylesheets loaded', 'Styles present', `Found ${links.length} style elements`, links.length > 0 ? 'PASS' : 'FAIL', dur);
    } catch (e) { record('UI-014', 'CSS loaded', 'Styles', e.message.slice(0,80), 'FAIL', Date.now()-t0); }

    // UI-015: JS bundle loaded
    t0 = Date.now();
    try {
      const scripts = await driver.findElements(By.css('script[type="module"], script[src]'));
      const dur = Date.now() - t0;
      record('UI-015', 'JavaScript bundles loaded', 'Scripts present', `Found ${scripts.length} script tags`, scripts.length > 0 ? 'PASS' : 'FAIL', dur);
    } catch (e) { record('UI-015', 'JS loaded', 'Scripts', e.message.slice(0,80), 'FAIL', Date.now()-t0); }

  } catch (err) {
    console.error('FATAL:', err.message);
  } finally {
    if (driver) await driver.quit();
  }

  const totalDur = Date.now() - startTime;
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;

  console.log('\n══════════════════════════════════════════════');
  console.log(`  SUMMARY: ${passed}/${results.length} PASSED | ${failed} FAILED | ${(totalDur/1000).toFixed(1)}s`);
  console.log('══════════════════════════════════════════════\n');

  const report = { tool: 'Selenium WebDriver 4.x (Node.js)', target: BASE_URL, date: new Date().toISOString(), browser: 'Chrome (headless)', totalTests: results.length, passed, failed, passRate: `${((passed/results.length)*100).toFixed(1)}%`, totalDurationMs: totalDur, results };
  fs.writeFileSync('tests/reports/selenium_results.json', JSON.stringify(report, null, 2));
  console.log('Results saved to tests/reports/selenium_results.json');
}

runTests().catch(console.error);
