const fs = require('fs');
const path = require('path');

// ============================================================
// 共享 HTML 模板
// ============================================================
function buildIndexHtml(forceLang, htmlLang, canonicalPath) {
  const forceLine = forceLang
    ? `<script>window.__FORCE_LANG__ = '${forceLang}';<\/script>\n`
    : '';
  const canonical = `https://toolara.dev${canonicalPath}`;

  return `<!DOCTYPE html>
<html lang="${htmlLang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>DC Paycheck Calculator — Estimate Your Take-Home Pay in Washington, D.C.</title>
<meta name="description" content="Free Washington D.C. paycheck calculator. Estimate your take-home pay after federal income tax, FICA, and D.C. state tax. Updated for 2026 tax brackets.">
<meta name="keywords" content="dc paycheck calculator, washington dc salary calculator, dc take home pay, dc income tax calculator, district of columbia payroll calculator">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<meta name="theme-color" content="#064e3b">

<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="en" href="https://toolara.dev/dc-paycheck-calculator/">
<link rel="alternate" hreflang="zh-Hans" href="https://toolara.dev/dc-paycheck-calculator/zh/">
<link rel="alternate" hreflang="zh-Hant" href="https://toolara.dev/dc-paycheck-calculator/zh-tw/">
<link rel="alternate" hreflang="ja" href="https://toolara.dev/dc-paycheck-calculator/ja/">
<link rel="alternate" hreflang="ko" href="https://toolara.dev/dc-paycheck-calculator/ko/">
<link rel="alternate" hreflang="de" href="https://toolara.dev/dc-paycheck-calculator/de/">
<link rel="alternate" hreflang="ru" href="https://toolara.dev/dc-paycheck-calculator/ru/">
<link rel="alternate" hreflang="es" href="https://toolara.dev/dc-paycheck-calculator/es/">
<link rel="alternate" hreflang="x-default" href="https://toolara.dev/dc-paycheck-calculator/">

<meta property="og:type" content="website">
<meta property="og:title" content="DC Paycheck Calculator — Estimate Your Take-Home Pay">
<meta property="og:description" content="Free Washington D.C. paycheck calculator. Estimate your take-home pay after federal and D.C. taxes.">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "DC Paycheck Calculator",
  "url": "${canonical}",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Any",
  "description": "Free Washington D.C. paycheck calculator to estimate take-home pay after federal income tax, FICA, and D.C. state tax.",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
}
<\/script>

${forceLine}<link rel="stylesheet" href="/dc-paycheck-calculator/css/style.css">
</head>
<body>

<header class="hero">
  <div class="lang-switch">
    <select id="langSelect" onchange="setLang(this.value)" aria-label="Language">
      <option value="en">English</option>
      <option value="zh">简体中文</option>
      <option value="zh-TW">繁體中文</option>
      <option value="ja">日本語</option>
      <option value="ko">한국어</option>
      <option value="de">Deutsch</option>
      <option value="ru">Русский</option>
      <option value="es">Español</option>
    </select>
  </div>
  <div class="hero-inner">
    <div class="hero-badge">🏛️ Washington, D.C.</div>
    <h1 data-i18n="title">DC Paycheck Calculator</h1>
    <p data-i18n="subtitle">Estimate your take-home pay after federal income tax, FICA, and District of Columbia taxes. Updated for 2026.</p>
  </div>
</header>

<main class="wrap">
  <section class="card">
    <h2 class="visually-hidden" data-i18n="calcHeading">Calculator</h2>
    <div class="row">
      <div>
        <label for="salary" data-i18n="salaryLabel">Annual gross salary ($)</label>
        <input type="number" id="salary" min="0" step="1000" placeholder="85000" inputmode="decimal">
      </div>
      <div>
        <label for="frequency" data-i18n="freqLabel">Pay frequency</label>
        <select id="frequency">
          <option value="26" data-i18n="freqBiweekly">Bi-weekly (26)</option>
          <option value="24" data-i18n="freqSemimonthly">Semi-monthly (24)</option>
          <option value="12" data-i18n="freqMonthly">Monthly (12)</option>
          <option value="52" data-i18n="freqWeekly">Weekly (52)</option>
        </select>
      </div>
    </div>
    <label for="filing" data-i18n="filingLabel">Filing status</label>
    <select id="filing">
      <option value="single" data-i18n="filingSingle">Single</option>
      <option value="married" data-i18n="filingMarried">Married filing jointly</option>
    </select>
    <button class="calc" type="button" onclick="calculate()" data-i18n="calcBtn">Calculate take-home pay</button>

    <div id="result" role="region" aria-live="polite">
      <div class="result-label" data-i18n="resultLabel">Estimated take-home pay</div>
      <div class="net-pay"><span id="netPay">—</span></div>
      <div class="freq-note" id="freqNote"></div>

      <div class="breakdown">
        <div class="bd-row"><span data-i18n="bdGross">Gross annual</span><strong id="bdGross">—</strong></div>
        <div class="bd-row"><span data-i18n="bdFederal">Federal income tax</span><strong id="bdFederal">—</strong></div>
        <div class="bd-row"><span data-i18n="bdFica">FICA (Social Security + Medicare)</span><strong id="bdFica">—</strong></div>
        <div class="bd-row"><span data-i18n="bdDc">D.C. state tax</span><strong id="bdDc">—</strong></div>
        <div class="bd-row"><span data-i18n="bdNet">Net annual</span><strong id="bdNet">—</strong></div>
        <div class="bd-row"><span data-i18n="bdEff">Effective tax rate</span><strong id="bdEff">—</strong></div>
      </div>
      <div class="result-disclaimer" data-i18n="resultDisclaimer">Estimate only. Actual withholding may vary based on deductions, credits, and employer benefits.</div>
    </div>
  </section>

  <section>
    <h2 data-i18n="whatIsTitle">What this calculator does</h2>
    <p data-i18n="whatIsText">This tool estimates your take-home pay in Washington, D.C. by subtracting federal income tax, FICA contributions (Social Security and Medicare), and D.C. state income tax from your gross salary. It uses the 2026 federal tax brackets, the standard deduction, and the District of Columbia's current progressive tax rates.</p>
  </section>

  <section>
    <h2 data-i18n="bracketsTitle">2026 Tax brackets at a glance</h2>
    <h3 data-i18n="federalTitle">Federal income tax (single)</h3>
    <table>
      <thead><tr><th data-i18n="thRate">Rate</th><th data-i18n="thIncome">Taxable income</th></tr></thead>
      <tbody>
        <tr><td>10%</td><td>$0 – $11,600</td></tr>
        <tr><td>12%</td><td>$11,600 – $47,150</td></tr>
        <tr><td>22%</td><td>$47,150 – $100,525</td></tr>
        <tr><td>24%</td><td>$100,525 – $191,950</td></tr>
        <tr><td>32%</td><td>$191,950 – $243,725</td></tr>
        <tr><td>35%</td><td>$243,725 – $609,350</td></tr>
        <tr><td>37%</td><td>Over $609,350</td></tr>
      </tbody>
    </table>

    <h3 data-i18n="dcTitle">D.C. state income tax</h3>
    <table>
      <thead><tr><th data-i18n="thRate">Rate</th><th data-i18n="thIncome">Taxable income</th></tr></thead>
      <tbody>
        <tr><td>4%</td><td>$0 – $10,000</td></tr>
        <tr><td>6%</td><td>$10,000 – $40,000</td></tr>
        <tr><td>6.5%</td><td>$40,000 – $60,000</td></tr>
        <tr><td>8.5%</td><td>$60,000 – $350,000</td></tr>
        <tr><td>9.25%</td><td>$350,000 – $1,000,000</td></tr>
        <tr><td>10.75%</td><td>Over $1,000,000</td></tr>
      </tbody>
    </table>

    <h3 data-i18n="ficaTitle">FICA contributions</h3>
    <ul>
      <li data-i18n="ficaSs"><strong>Social Security:</strong> 6.2% on wages up to $168,600</li>
      <li data-i18n="ficaMc"><strong>Medicare:</strong> 1.45% on all wages, plus 0.9% additional tax above $200,000 (single) or $250,000 (married)</li>
    </ul>
  </section>

  <section>
    <h2 data-i18n="howToTitle">How to use this calculator</h2>
    <ol>
      <li data-i18n="howTo1">Enter your annual gross salary before any deductions.</li>
      <li data-i18n="howTo2">Choose your pay frequency — most D.C. employers pay bi-weekly (26 paychecks per year).</li>
      <li data-i18n="howTo3">Select your filing status. Married couples filing jointly receive a higher standard deduction.</li>
      <li data-i18n="howTo4">Click "Calculate take-home pay" to see your net income per paycheck and annually.</li>
    </ol>
  </section>

  <section>
    <h2 data-i18n="faqTitle">Frequently asked questions</h2>
    <h3 data-i18n="faq1q">Does D.C. have state income tax?</h3>
    <p data-i18n="faq1a">Yes. The District of Columbia levies its own income tax, with rates ranging from 4% to 10.75%. D.C. residents pay federal income tax and D.C. income tax, but no state tax to Maryland or Virginia.</p>

    <h3 data-i18n="faq2q">What is FICA?</h3>
    <p data-i18n="faq2a">FICA stands for the Federal Insurance Contributions Act. It funds Social Security (6.2% up to the wage base limit) and Medicare (1.45% on all wages). Your employer matches these contributions, but only your portion is deducted from your paycheck.</p>

    <h3 data-i18n="faq3q">Why is my actual paycheck different from this estimate?</h3>
    <p data-i18n="faq3a">This calculator uses standard deductions and assumes no additional withholdings. Your actual paycheck may be lower due to 401(k) contributions, health insurance premiums, HSA/FSA contributions, or additional withholding you elected on your W-4.</p>

    <h3 data-i18n="faq4q">Are these numbers for 2026?</h3>
    <p data-i18n="faq4a">Yes, the tax brackets and FICA wage limits reflect the 2026 tax year. Tax laws change annually — always confirm with the IRS or a tax professional before making financial decisions.</p>

    <div class="disclaimer" data-i18n="disclaimer"><strong>Disclaimer:</strong> This calculator provides estimates for educational purposes only. It is not tax advice. Consult a qualified tax professional for your specific situation.</div>
  </section>
</main>

<footer class="footer" data-i18n="footer">Runs entirely in your browser. No data is collected or stored.</footer>

<script src="/dc-paycheck-calculator/js/i18n.js"><\/script>
<script src="/dc-paycheck-calculator/js/calculator.js"><\/script>
</body>
</html>`;
}

// ============================================================
// CSS
// ============================================================
const STYLE_CSS = `:root {
  --bg: #f0fdf4; --card: #ffffff; --text: #0f1c2e; --muted: #64748b;
  --accent: #059669; --accent-dark: #047857; --gold: #d97706;
  --border: #d1fae5; --radius: 14px;
  --shadow: 0 1px 3px rgba(6,78,59,0.06), 0 8px 24px rgba(6,78,59,0.06);
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", Roboto, sans-serif; background: var(--bg); color: var(--text); line-height: 1.65; -webkit-font-smoothing: antialiased; }
.visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

/* ---------- Hero ---------- */
.hero {
  position: relative;
  overflow: hidden;
  color: #fff;
  padding: 64px 20px 96px;
  background:
    radial-gradient(circle at 15% 20%, rgba(217,119,6,0.35) 0%, transparent 45%),
    radial-gradient(circle at 85% 80%, rgba(16,185,129,0.30) 0%, transparent 50%),
    linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%);
}
.hero::before {
  content: "";
  position: absolute; inset: 0;
  background-image:
    radial-gradient(rgba(255,255,255,0.06) 1.5px, transparent 1.5px);
  background-size: 28px 28px;
  opacity: 0.6;
  pointer-events: none;
}
.hero::after {
  content: "";
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at center, transparent 30%, rgba(2,44,34,0.35) 100%);
  pointer-events: none;
}
.hero-inner { max-width: 720px; margin: 0 auto; position: relative; z-index: 2; text-align: center; }
.hero-badge {
  display: inline-block;
  background: rgba(217,119,6,0.20);
  border: 1px solid rgba(217,119,6,0.45);
  color: #fcd34d;
  padding: 5px 14px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  margin-bottom: 18px;
}
.hero h1 { font-size: 2.1rem; margin: 0 0 12px; font-weight: 800; letter-spacing: -0.02em; }
.hero p { margin: 0 auto; opacity: 0.9; font-size: 1rem; max-width: 560px; }

/* ---------- Language switcher ---------- */
.lang-switch { position: absolute; top: 16px; right: 16px; z-index: 3; }
.lang-switch select {
  appearance: none; -webkit-appearance: none;
  background-color: rgba(255,255,255,0.15);
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat; background-position: right 10px center; background-size: 14px;
  border: 1px solid rgba(255,255,255,0.3);
  color: #fff; padding: 7px 32px 7px 12px; border-radius: 8px;
  font-size: 0.85rem; font-family: inherit; cursor: pointer; transition: background-color 0.15s;
}
.lang-switch select:hover { background-color: rgba(255,255,255,0.28); }
.lang-switch select option { color: #0f1c2e; background: #fff; }

/* ---------- Layout ---------- */
.wrap { max-width: 720px; margin: -56px auto 0; padding: 0 20px 64px; position: relative; z-index: 2; }
.card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 28px; margin-bottom: 22px; box-shadow: var(--shadow); }

/* ---------- Form ---------- */
label { display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 6px; }
input, select { width: 100%; padding: 11px 13px; border: 1px solid #cbd5e1; border-radius: 9px; font-size: 1rem; margin-bottom: 18px; background: #fff; color: var(--text); transition: border-color 0.15s, box-shadow 0.15s; font-family: inherit; }
input:focus, select:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(5,150,105,0.15); }
.row { display: flex; gap: 14px; }
.row > div { flex: 1; }
button.calc { width: 100%; padding: 15px; background: var(--accent); color: #fff; border: none; border-radius: 9px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.15s, transform 0.1s; font-family: inherit; }
button.calc:hover { background: var(--accent-dark); }
button.calc:active { transform: scale(0.99); }

/* ---------- Result ---------- */
#result { margin-top: 24px; padding: 24px; border-radius: 14px; background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%); border: 2px solid #059669; display: none; animation: fadeIn 0.35s ease; }
#result.show { display: block; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.result-label { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.07em; font-weight: 700; color: #065f46; margin-bottom: 4px; }
.net-pay { font-size: 3rem; font-weight: 800; color: #064e3b; line-height: 1; letter-spacing: -0.02em; }
.freq-note { font-size: 0.85rem; color: #047857; margin-top: 6px; font-weight: 500; }
.breakdown { margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(5,150,105,0.20); }
.bd-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 0.9rem; color: #065f46; }
.bd-row strong { color: #064e3b; font-weight: 600; }
.result-disclaimer { margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(5,150,105,0.15); font-size: 0.78rem; color: #047857; opacity: 0.85; }

/* ---------- Content ---------- */
h2 { font-size: 1.25rem; margin: 36px 0 12px; letter-spacing: -0.01em; }
h3 { font-size: 1rem; margin: 22px 0 6px; }
p { margin: 0 0 14px; }
ul, ol { margin: 0 0 16px; padding-left: 22px; }
li { margin-bottom: 8px; line-height: 1.65; }
table { width: 100%; border-collapse: collapse; font-size: 0.9rem; margin: 14px 0; }
th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #e2e8f0; }
th { background: #f0fdf4; font-weight: 600; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em; color: #065f46; }
tr:last-child td { border-bottom: none; }
.disclaimer { font-size: 0.85rem; color: var(--muted); border-left: 3px solid #cbd5e1; padding: 4px 0 4px 14px; margin-top: 18px; }
.footer { text-align: center; font-size: 0.8rem; color: var(--muted); padding: 24px 20px 48px; }

@media (max-width: 560px) {
  .hero { padding: 48px 16px 80px; }
  .hero h1 { font-size: 1.5rem; }
  .lang-switch { position: static; display: flex; justify-content: center; margin-bottom: 16px; }
  .wrap { padding: 0 14px 48px; }
  .card { padding: 20px; }
  .row { flex-direction: column; gap: 0; }
  .net-pay { font-size: 2.2rem; }
}`;

// ============================================================
// i18n.js
// ============================================================
const I18N_JS = `const SUPPORTED_LANGS = ['en','zh','zh-TW','ja','ko','de','ru','es'];
const DEFAULT_LANG = 'en';
const PATH_TO_LANG = { '/zh/':'zh', '/zh-tw/':'zh-TW', '/ja/':'ja', '/ko/':'ko', '/de/':'de', '/ru/':'ru', '/es/':'es' };
const LANG_TO_PATH = { 'en':'/', 'zh':'/zh/', 'zh-TW':'/zh-tw/', 'ja':'/ja/', 'ko':'/ko/', 'de':'/de/', 'ru':'/ru/', 'es':'/es/' };

let currentLang = DEFAULT_LANG;
let translations = {};
const cache = {};

function detectPageLang() {
  if (window.__FORCE_LANG__ && SUPPORTED_LANGS.includes(window.__FORCE_LANG__)) return window.__FORCE_LANG__;
  const path = window.location.pathname;
  const idx = path.indexOf('/dc-paycheck-calculator');
  if (idx === -1) return DEFAULT_LANG;
  const rest = path.slice(idx + '/dc-paycheck-calculator'.length);
  const m = rest.match(/^\\/(zh-tw|zh|ja|ko|de|ru|es)\\//);
  if (m) return PATH_TO_LANG['/' + m[1] + '/'] || DEFAULT_LANG;
  return DEFAULT_LANG;
}

async function loadLocale(lang) {
  if (cache[lang]) return cache[lang];
  const res = await fetch('/dc-paycheck-calculator/locales/' + lang + '.json');
  if (!res.ok) throw new Error('Failed: ' + lang);
  const data = await res.json();
  cache[lang] = data;
  return data;
}

function applyTranslations(t) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] === undefined) return;
    if (key === 'disclaimer') el.innerHTML = t[key];
    else el.textContent = t[key];
  });
}

async function initPage() {
  const lang = detectPageLang();
  try { translations = await loadLocale(lang); }
  catch (err) { console.error(err); return; }
  currentLang = lang;
  document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : lang === 'zh-TW' ? 'zh-Hant' : lang;
  applyTranslations(translations);
  const sel = document.getElementById('langSelect');
  if (sel) sel.value = lang;
  window.__i18n = { t: translations, lang: currentLang };
}

function setLang(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) lang = DEFAULT_LANG;
  const target = (LANG_TO_PATH[lang] || '/').replace(/^\\//, '/dc-paycheck-calculator/');
  window.location.href = target;
}

document.addEventListener('DOMContentLoaded', initPage);`;

// ============================================================
// calculator.js
// ============================================================
const CALCULATOR_JS = `function t() { return (window.__i18n && window.__i18n.t) || {}; }

// 2026 Federal brackets (single)
const FED_SINGLE = [
  [11600, 0.10], [47150, 0.12], [100525, 0.22], [191950, 0.24],
  [243725, 0.32], [609350, 0.35], [Infinity, 0.37]
];
// 2026 Federal brackets (married filing jointly)
const FED_MARRIED = [
  [23200, 0.10], [94300, 0.12], [201050, 0.22], [383900, 0.24],
  [487450, 0.32], [731200, 0.35], [Infinity, 0.37]
];
// D.C. brackets
const DC_BRACKETS = [
  [10000, 0.04], [40000, 0.06], [60000, 0.065], [350000, 0.085],
  [1000000, 0.0925], [Infinity, 0.1075]
];

const STD_DED_SINGLE = 14600;
const STD_DED_MARRIED = 29200;
const SS_WAGE_BASE = 168600;
const SS_RATE = 0.062;
const MC_RATE = 0.0145;
const ADDL_MC_THRESHOLD_SINGLE = 200000;
const ADDL_MC_THRESHOLD_MARRIED = 250000;
const ADDL_MC_RATE = 0.009;

function progressiveTax(income, brackets) {
  let tax = 0, prev = 0;
  for (const [cap, rate] of brackets) {
    if (income <= prev) break;
    const slice = Math.min(income, cap) - prev;
    tax += slice * rate;
    prev = cap;
  }
  return tax;
}

function calculate() {
  const tr = t();
  const gross = parseFloat(document.getElementById('salary').value);
  const freq = parseInt(document.getElementById('frequency').value);
  const filing = document.getElementById('filing').value;

  if (!gross || gross <= 0) {
    alert(tr.alertFill || 'Please enter your annual salary.');
    return;
  }

  const stdDed = filing === 'married' ? STD_DED_MARRIED : STD_DED_SINGLE;
  const fedBrackets = filing === 'married' ? FED_MARRIED : FED_SINGLE;

  const taxableFederal = Math.max(0, gross - stdDed);
  const federal = progressiveTax(taxableFederal, fedBrackets);

  const taxableDC = Math.max(0, gross - stdDed);
  const dc = progressiveTax(taxableDC, DC_BRACKETS);

  // FICA
  const ss = Math.min(gross, SS_WAGE_BASE) * SS_RATE;
  let mc = gross * MC_RATE;
  const addlThreshold = filing === 'married' ? ADDL_MC_THRESHOLD_MARRIED : ADDL_MC_THRESHOLD_SINGLE;
  if (gross > addlThreshold) mc += (gross - addlThreshold) * ADDL_MC_RATE;
  const fica = ss + mc;

  const netAnnual = gross - federal - fica - dc;
  const netPerPeriod = netAnnual / freq;

  const fmt = n => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const freqName = tr['freqName' + freq] || ('per period');

  document.getElementById('netPay').textContent = fmt(netPerPeriod);
  document.getElementById('freqNote').textContent = (tr.freqNote || 'Net pay per period') + ' · ' + freq + ' paychecks/year';
  document.getElementById('bdGross').textContent = fmt(gross);
  document.getElementById('bdFederal').textContent = '-' + fmt(federal);
  document.getElementById('bdFica').textContent = '-' + fmt(fica);
  document.getElementById('bdDc').textContent = '-' + fmt(dc);
  document.getElementById('bdNet').textContent = fmt(netAnnual);
  const effRate = gross > 0 ? ((federal + fica + dc) / gross * 100).toFixed(1) : '0';
  document.getElementById('bdEff').textContent = effRate + '%';

  const result = document.getElementById('result');
  result.classList.add('show');
}

window.calculate = calculate;`;

// ============================================================
// 多语言翻译
// ============================================================
const LOCALES = {
  'en': {
    title: "DC Paycheck Calculator",
    subtitle: "Estimate your take-home pay after federal income tax, FICA, and District of Columbia taxes. Updated for 2026.",
    calcHeading: "Calculator",
    salaryLabel: "Annual gross salary ($)",
    freqLabel: "Pay frequency",
    freqBiweekly: "Bi-weekly (26)", freqSemimonthly: "Semi-monthly (24)",
    freqMonthly: "Monthly (12)", freqWeekly: "Weekly (52)",
    filingLabel: "Filing status",
    filingSingle: "Single", filingMarried: "Married filing jointly",
    calcBtn: "Calculate take-home pay",
    resultLabel: "Estimated take-home pay",
    freqNote: "Net pay per period",
    bdGross: "Gross annual", bdFederal: "Federal income tax",
    bdFica: "FICA (Social Security + Medicare)", bdDc: "D.C. state tax",
    bdNet: "Net annual", bdEff: "Effective tax rate",
    resultDisclaimer: "Estimate only. Actual withholding may vary based on deductions, credits, and employer benefits.",
    whatIsTitle: "What this calculator does",
    whatIsText: "This tool estimates your take-home pay in Washington, D.C. by subtracting federal income tax, FICA contributions (Social Security and Medicare), and D.C. state income tax from your gross salary. It uses the 2026 federal tax brackets, the standard deduction, and the District of Columbia's current progressive tax rates.",
    bracketsTitle: "2026 Tax brackets at a glance",
    federalTitle: "Federal income tax (single)",
    dcTitle: "D.C. state income tax",
    ficaTitle: "FICA contributions",
    ficaSs: "Social Security: 6.2% on wages up to $168,600",
    ficaMc: "Medicare: 1.45% on all wages, plus 0.9% additional tax above $200,000 (single) or $250,000 (married)",
    thRate: "Rate", thIncome: "Taxable income",
    howToTitle: "How to use this calculator",
    howTo1: "Enter your annual gross salary before any deductions.",
    howTo2: "Choose your pay frequency — most D.C. employers pay bi-weekly (26 paychecks per year).",
    howTo3: "Select your filing status. Married couples filing jointly receive a higher standard deduction.",
    howTo4: "Click \"Calculate take-home pay\" to see your net income per paycheck and annually.",
    faqTitle: "Frequently asked questions",
    faq1q: "Does D.C. have state income tax?",
    faq1a: "Yes. The District of Columbia levies its own income tax, with rates ranging from 4% to 10.75%. D.C. residents pay federal income tax and D.C. income tax, but no state tax to Maryland or Virginia.",
    faq2q: "What is FICA?",
    faq2a: "FICA stands for the Federal Insurance Contributions Act. It funds Social Security (6.2% up to the wage base limit) and Medicare (1.45% on all wages). Your employer matches these contributions, but only your portion is deducted from your paycheck.",
    faq3q: "Why is my actual paycheck different from this estimate?",
    faq3a: "This calculator uses standard deductions and assumes no additional withholdings. Your actual paycheck may be lower due to 401(k) contributions, health insurance premiums, HSA/FSA contributions, or additional withholding you elected on your W-4.",
    faq4q: "Are these numbers for 2026?",
    faq4a: "Yes, the tax brackets and FICA wage limits reflect the 2026 tax year. Tax laws change annually — always confirm with the IRS or a tax professional before making financial decisions.",
    disclaimer: "<strong>Disclaimer:</strong> This calculator provides estimates for educational purposes only. It is not tax advice. Consult a qualified tax professional for your specific situation.",
    footer: "Runs entirely in your browser. No data is collected or stored.",
    alertFill: "Please enter your annual salary."
  },
  'zh': {
    title: "华盛顿特区薪资计算器",
    subtitle: "估算扣除联邦所得税、FICA 和华盛顿特区州税后的实际到手薪资。已更新至 2026 年税率。",
    calcHeading: "计算器",
    salaryLabel: "年税前薪资（美元）",
    freqLabel: "发薪频率",
    freqBiweekly: "双周（26 次）", freqSemimonthly: "半月（24 次）",
    freqMonthly: "月度（12 次）", freqWeekly: "每周（52 次）",
    filingLabel: "申报状态",
    filingSingle: "单身", filingMarried: "已婚合并申报",
    calcBtn: "计算到手薪资",
    resultLabel: "预估到手薪资",
    freqNote: "每期税后净收入",
    bdGross: "税前年薪", bdFederal: "联邦所得税",
    bdFica: "FICA（社保 + 医保）", bdDc: "华盛顿特区州税",
    bdNet: "税后年薪", bdEff: "实际税率",
    resultDisclaimer: "仅为估算值。实际扣缴会因扣除项、抵免和雇主福利而不同。",
    whatIsTitle: "这个计算器做什么",
    whatIsText: "本工具通过从税前薪资中扣除联邦所得税、FICA 缴款（社保与医保）以及华盛顿特区州所得税，来估算您在华盛顿特区的实际到手薪资。计算使用 2026 年联邦税率表、标准扣除额以及特区现行累进税率。",
    bracketsTitle: "2026 年税率表一览",
    federalTitle: "联邦所得税（单身）",
    dcTitle: "华盛顿特区州所得税",
    ficaTitle: "FICA 缴款",
    ficaSs: "社保：工资在 168,600 美元以内按 6.2% 征收",
    ficaMc: "医保：全部工资按 1.45% 征收，单身超过 200,000 美元（已婚 250,000 美元）部分额外加征 0.9%",
    thRate: "税率", thIncome: "应税收入",
    howToTitle: "如何使用本计算器",
    howTo1: "输入任何扣除前的年税前薪资。",
    howTo2: "选择发薪频率——多数特区雇主采用双周发薪（每年 26 次）。",
    howTo3: "选择申报状态。已婚合并申报可享受更高的标准扣除额。",
    howTo4: "点击“计算到手薪资”，查看每期净收入和年度净收入。",
    faqTitle: "常见问题",
    faq1q: "华盛顿特区有州所得税吗？",
    faq1a: "有。华盛顿特区征收自己的所得税，税率从 4% 到 10.75% 不等。特区居民需缴纳联邦所得税和特区所得税，但无需向马里兰州或弗吉尼亚州缴纳州税。",
    faq2q: "什么是 FICA？",
    faq2a: "FICA 是《联邦保险缴款法》的缩写，用于资助社会保障（工资上限内 6.2%）和医疗保险（全部工资 1.45%）。雇主会等额匹配这些缴款，但只有您自己那部分会从工资中扣除。",
    faq3q: "为什么实际工资与估算不同？",
    faq3a: "本计算器使用标准扣除额，且假设没有额外预扣。实际工资可能因 401(k) 缴款、健康保险费、HSA/FSA 缴款或您在 W-4 上选择的额外预扣而更低。",
    faq4q: "这些数字是 2026 年的吗？",
    faq4a: "是的，税率表和 FICA 工资上限均反映 2026 纳税年度。税法每年变化——在做出财务决定前，请务必向 IRS 或税务专业人士确认。",
    disclaimer: "<strong>免责声明：</strong>本计算器仅供教育用途提供估算，不构成税务建议。请咨询合格的税务专业人士以获取针对您具体情况的信息。",
    footer: "完全在您的浏览器中运行。不收集、不存储任何数据。",
    alertFill: "请输入您的年薪资。"
  },
  'zh-TW': {
    title: "華盛頓特區薪資計算器",
    subtitle: "估算扣除聯邦所得稅、FICA 和華盛頓特區州稅後的實際到手薪資。已更新至 2026 年稅率。",
    calcHeading: "計算器",
    salaryLabel: "年稅前薪資（美元）",
    freqLabel: "發薪頻率",
    freqBiweekly: "雙週（26 次）", freqSemimonthly: "半月（24 次）",
    freqMonthly: "月度（12 次）", freqWeekly: "每週（52 次）",
    filingLabel: "申報狀態",
    filingSingle: "單身", filingMarried: "已婚合併申報",
    calcBtn: "計算到手薪資",
    resultLabel: "預估到手薪資",
    freqNote: "每期稅後淨收入",
    bdGross: "稅前年薪", bdFederal: "聯邦所得稅",
    bdFica: "FICA（社保 + 醫保）", bdDc: "華盛頓特區州稅",
    bdNet: "稅後年薪", bdEff: "實際稅率",
    resultDisclaimer: "僅為估算值。實際扣繳會因扣除項、抵免和雇主福利而不同。",
    whatIsTitle: "這個計算器做什麼",
    whatIsText: "本工具透過從稅前薪資中扣除聯邦所得稅、FICA 繳款（社保與醫保）以及華盛頓特區州所得稅，來估算您在華盛頓特區的實際到手薪資。計算使用 2026 年聯邦稅率表、標準扣除額以及特區現行累進稅率。",
    bracketsTitle: "2026 年稅率表一覽",
    federalTitle: "聯邦所得稅（單身）",
    dcTitle: "華盛頓特區州所得稅",
    ficaTitle: "FICA 繳款",
    ficaSs: "社保：薪資在 168,600 美元以內按 6.2% 徵收",
    ficaMc: "醫保：全部薪資按 1.45% 徵收，單身超過 200,000 美元（已婚 250,000 美元）部分額外加徵 0.9%",
    thRate: "稅率", thIncome: "應稅收入",
    howToTitle: "如何使用本計算器",
    howTo1: "輸入任何扣除前的年稅前薪資。",
    howTo2: "選擇發薪頻率——多數特區雇主採用雙週發薪（每年 26 次）。",
    howTo3: "選擇申報狀態。已婚合併申報可享受更高的標準扣除額。",
    howTo4: "點擊「計算到手薪資」，查看每期淨收入和年度淨收入。",
    faqTitle: "常見問題",
    faq1q: "華盛頓特區有所得稅嗎？",
    faq1a: "有。華盛頓特區徵收自己的所得稅，稅率從 4% 到 10.75% 不等。特區居民需繳納聯邦所得稅和特區所得稅，但無需向馬里蘭州或維吉尼亞州繳納州稅。",
    faq2q: "什麼是 FICA？",
    faq2a: "FICA 是《聯邦保險繳款法》的縮寫，用於資助社會保障（薪資上限內 6.2%）和醫療保險（全部薪資 1.45%）。雇主會等額匹配這些繳款，但只有您自己那部分會從薪資中扣除。",
    faq3q: "為什麼實際薪資與估算不同？",
    faq3a: "本計算器使用標準扣除額，且假設沒有額外預扣。實際薪資可能因 401(k) 繳款、健康保險費、HSA/FSA 繳款或您在 W-4 上選擇的額外預扣而更低。",
    faq4q: "這些數字是 2026 年的嗎？",
    faq4a: "是的，稅率表和 FICA 薪資上限均反映 2026 納稅年度。稅法每年變化——在做出財務決定前，請務必向 IRS 或稅務專業人士確認。",
    disclaimer: "<strong>免責聲明：</strong>本計算器僅供教育用途提供估算，不構成稅務建議。請諮詢合格的稅務專業人士以獲取針對您具體情況的資訊。",
    footer: "完全在您的瀏覽器中運行。不收集、不儲存任何資料。",
    alertFill: "請輸入您的年薪资。"
  },
  'ja': {
    title: "ワシントンD.C. 給与計算ツール",
    subtitle: "連邦所得税、FICA、およびワシントンD.C.州税を差し引いた手取り額を推定します。2026年税率対応。",
    calcHeading: "計算ツール",
    salaryLabel: "年収（額面、ドル）",
    freqLabel: "給与支払頻度",
    freqBiweekly: "隔週（年26回）", freqSemimonthly: "月2回（年24回）",
    freqMonthly: "毎月（年12回）", freqWeekly: "毎週（年52回）",
    filingLabel: "申告区分",
    filingSingle: "独身", filingMarried: "夫婦合算申告",
    calcBtn: "手取り額を計算",
    resultLabel: "推定手取り額",
    freqNote: "1回あたりの手取り額",
    bdGross: "年収（額面）", bdFederal: "連邦所得税",
    bdFica: "FICA（社会保障＋メディケア）", bdDc: "D.C.州税",
    bdNet: "年間手取り額", bdEff: "実効税率",
    resultDisclaimer: "あくまで推定値です。実際の源泉徴収は控除、税額控除、雇用主の福利厚生により異なります。",
    whatIsTitle: "この計算ツールについて",
    whatIsText: "このツールは、額面給与から連邦所得税、FICA負担金（社会保障とメディケア）、およびワシントンD.C.州所得税を差し引いて、D.C.での手取り額を推定します。2026年の連邦税率表、標準控除額、およびD.C.の現行累進税率を使用しています。",
    bracketsTitle: "2026年税率表の概要",
    federalTitle: "連邦所得税（独身）",
    dcTitle: "ワシントンD.C.州所得税",
    ficaTitle: "FICA負担金",
    ficaSs: "社会保障：賃金168,600ドルまで6.2%",
    ficaMc: "メディケア：全賃金1.45%、独身200,000ドル（夫婦250,000ドル）超の部分に0.9%の追加税",
    thRate: "税率", thIncome: "課税所得",
    howToTitle: "使い方",
    howTo1: "控除前の年収（額面）を入力します。",
    howTo2: "給与支払頻度を選択します。D.C.の雇用主の多くは隔週払い（年26回）です。",
    howTo3: "申告区分を選択します。夫婦合算申告は標準控除額が高くなります。",
    howTo4: "「手取り額を計算」をクリックすると、1回あたりと年間の手取り額が表示されます。",
    faqTitle: "よくある質問",
    faq1q: "ワシントンD.C.には州所得税がありますか？",
    faq1a: "はい。ワシントンD.C.は独自の所得税を課しており、税率は4%から10.75%です。D.C.住民は連邦所得税とD.C.所得税を支払いますが、メリーランド州やバージニア州に州税を支払う必要はありません。",
    faq2q: "FICAとは何ですか？",
    faq2a: "FICAは連邦保険拠出法の略で、社会保障（賃金上限まで6.2%）とメディケア（全賃金1.45%）を資金提供します。雇用主も同額を負担しますが、給与から差し引かれるのは本人負担分のみです。",
    faq3q: "実際の給与と推定額が異なるのはなぜですか？",
    faq3a: "この計算ツールは標準控除を使用し、追加の源泉徴収がないと仮定しています。実際の給与は、401(k)拠出、健康保険料、HSA/FSA拠出、またはW-4で選択した追加源泉徴収により低くなる場合があります。",
    faq4q: "これらの数字は2026年のものですか？",
    faq4a: "はい、税率表とFICA賃金上限は2026課税年度を反映しています。税法は毎年変更されるため、財務上の決定を行う前にIRSまたは税務専門家に確認してください。",
    disclaimer: "<strong>免責事項：</strong>この計算ツールは教育目的の推定値を提供するものであり、税務アドバイスではありません。具体的な状況については、資格を持つ税務専門家にご相談ください。",
    footer: "すべてブラウザ内で実行されます。データの収集・保存は行いません。",
    alertFill: "年収を入力してください。"
  },
  'ko': {
    title: "워싱턴 D.C. 급여 계산기",
    subtitle: "연방 소득세, FICA, 워싱턴 D.C. 주세를 공제한 실수령액을 추정합니다. 2026년 세율 반영.",
    calcHeading: "계산기",
    salaryLabel: "연봉 (세전, 달러)",
    freqLabel: "급여 지급 주기",
    freqBiweekly: "격주 (연 26회)", freqSemimonthly: "월 2회 (연 24회)",
    freqMonthly: "매월 (연 12회)", freqWeekly: "매주 (연 52회)",
    filingLabel: "신고 상태",
    filingSingle: "미혼", filingMarried: "부부 공동 신고",
    calcBtn: "실수령액 계산",
    resultLabel: "예상 실수령액",
    freqNote: "회당 실수령액",
    bdGross: "세전 연봉", bdFederal: "연방 소득세",
    bdFica: "FICA (사회보장 + 메디케어)", bdDc: "D.C. 주세",
    bdNet: "세후 연봉", bdEff: "실효 세율",
    resultDisclaimer: "추정치입니다. 실제 원천징수는 공제, 세액공제, 고용주 복지에 따라 달라질 수 있습니다.",
    whatIsTitle: "이 계산기의 기능",
    whatIsText: "이 도구는 세전 급여에서 연방 소득세, FICA 기여금(사회보장 및 메디케어), 워싱턴 D.C. 주 소득세를 공제하여 D.C.에서의 실수령액을 추정합니다. 2026년 연방 세율표, 표준 공제, D.C.의 현행 누진 세율을 사용합니다.",
    bracketsTitle: "2026년 세율표 개요",
    federalTitle: "연방 소득세 (미혼)",
    dcTitle: "워싱턴 D.C. 주 소득세",
    ficaTitle: "FICA 기여금",
    ficaSs: "사회보장: 임금 168,600달러까지 6.2%",
    ficaMc: "메디케어: 전 임금 1.45%, 미혼 200,000달러(부부 250,000달러) 초과분에 0.9% 추가세",
    thRate: "세율", thIncome: "과세 소득",
    howToTitle: "사용 방법",
    howTo1: "공제 전 연봉(세전)을 입력합니다.",
    howTo2: "급여 지급 주기를 선택합니다. D.C. 고용주의 대부분은 격주 지급(연 26회)입니다.",
    howTo3: "신고 상태를 선택합니다. 부부 공동 신고는 표준 공제가 더 높습니다.",
    howTo4: "\"실수령액 계산\"을 클릭하면 회당 및 연간 실수령액을 확인할 수 있습니다.",
    faqTitle: "자주 묻는 질문",
    faq1q: "워싱턴 D.C.에 주 소득세가 있나요?",
    faq1a: "네. 워싱턴 D.C.는 자체 소득세를 부과하며 세율은 4%에서 10.75%입니다. D.C. 거주자는 연방 소득세와 D.C. 소득세를 납부하지만 메릴랜드나 버지니아에 주세를 납부할 필요는 없습니다.",
    faq2q: "FICA란 무엇인가요?",
    faq2a: "FICA는 연방 보험 기여법의 약자로 사회보장(임금 상한까지 6.2%)과 메디케어(전 임금 1.45%)를 지원합니다. 고용주도 동일 금액을 부담하지만 급여에서 공제되는 것은 본인 부담분만입니다.",
    faq3q: "실제 급여가 추정치와 다른 이유는?",
    faq3a: "이 계산기는 표준 공제를 사용하며 추가 원천징수가 없다고 가정합니다. 실제 급여는 401(k) 기여, 건강 보험료, HSA/FSA 기여 또는 W-4에서 선택한 추가 원천징수로 인해 더 낮을 수 있습니다.",
    faq4q: "이 수치는 2026년 기준인가요?",
    faq4a: "네, 세율표와 FICA 임금 상한은 2026 과세 연도를 반영합니다. 세법은 매년 변경되므로 재정 결정을 내리기 전에 IRS 또는 세무 전문가에게 확인하세요.",
    disclaimer: "<strong>면책 조항:</strong> 이 계산기는 교육 목적의 추정치를 제공하며 세무 조언이 아닙니다. 구체적인 상황은 자격을 갖춘 세무 전문가와 상담하세요.",
    footer: "전적으로 브라우저에서 실행됩니다. 데이터를 수집하거나 저장하지 않습니다.",
    alertFill: "연봉을 입력하세요."
  },
  'de': {
    title: "DC-Gehaltsrechner",
    subtitle: "Schätzen Sie Ihr Nettoeinkommen nach Bundessteuer, FICA und District of Columbia Steuern. Aktualisiert für 2026.",
    calcHeading: "Rechner",
    salaryLabel: "Bruttojahresgehalt ($)",
    freqLabel: "Zahlungsrhythmus",
    freqBiweekly: "Zweiwöchentlich (26)", freqSemimonthly: "Halbmonatlich (24)",
    freqMonthly: "Monatlich (12)", freqWeekly: "Wöchentlich (52)",
    filingLabel: "Steuerstatus",
    filingSingle: "Ledig", filingMarried: "Verheiratet, gemeinsame Veranlagung",
    calcBtn: "Nettoeinkommen berechnen",
    resultLabel: "Geschätztes Nettoeinkommen",
    freqNote: "Netto pro Zahlung",
    bdGross: "Bruttojahresgehalt", bdFederal: "Bundeseinkommensteuer",
    bdFica: "FICA (Sozialversicherung + Medicare)", bdDc: "D.C. Steuern",
    bdNet: "Nettojahresgehalt", bdEff: "Effektiver Steuersatz",
    resultDisclaimer: "Nur eine Schätzung. Der tatsächliche Abzug kann je nach Abzügen, Gutschriften und Arbeitgeberleistungen variieren.",
    whatIsTitle: "Was dieser Rechner macht",
    whatIsText: "Dieses Tool schätzt Ihr Nettoeinkommen in Washington, D.C., indem es Bundeseinkommensteuer, FICA-Beiträge (Sozialversicherung und Medicare) und D.C.-Einkommensteuer von Ihrem Bruttogehalt abzieht. Es verwendet die Bundessteuersätze 2026, den Standardabzug und die aktuellen progressiven Steuersätze des District of Columbia.",
    bracketsTitle: "Steuersätze 2026 im Überblick",
    federalTitle: "Bundeseinkommensteuer (Ledig)",
    dcTitle: "D.C. Einkommensteuer",
    ficaTitle: "FICA-Beiträge",
    ficaSs: "Sozialversicherung: 6,2% auf Löhne bis 168.600 $",
    ficaMc: "Medicare: 1,45% auf alle Löhne, plus 0,9% Zusatzsteuer über 200.000 $ (Ledig) bzw. 250.000 $ (Verheiratet)",
    thRate: "Satz", thIncome: "Zu versteuerndes Einkommen",
    howToTitle: "Verwendung",
    howTo1: "Geben Sie Ihr Bruttojahresgehalt vor Abzügen ein.",
    howTo2: "Wählen Sie Ihren Zahlungsrhythmus – die meisten D.C.-Arbeitgeber zahlen zweiwöchentlich (26 Gehälter pro Jahr).",
    howTo3: "Wählen Sie Ihren Steuerstatus. Verheiratete mit gemeinsamer Veranlagung erhalten einen höheren Standardabzug.",
    howTo4: "Klicken Sie auf \"Nettoeinkommen berechnen\", um Ihr Netto pro Gehalt und jährlich zu sehen.",
    faqTitle: "Häufig gestellte Fragen",
    faq1q: "Hat D.C. eine Einkommensteuer?",
    faq1a: "Ja. Der District of Columbia erhebt eine eigene Einkommensteuer mit Sätzen von 4% bis 10,75%. D.C.-Einwohner zahlen Bundes- und D.C.-Einkommensteuer, aber keine Staatssteuer an Maryland oder Virginia.",
    faq2q: "Was ist FICA?",
    faq2a: "FICA steht für Federal Insurance Contributions Act. Es finanziert Sozialversicherung (6,2% bis zur Lohnobergrenze) und Medicare (1,45% auf alle Löhne). Ihr Arbeitgeber zahlt denselben Betrag, aber nur Ihr Anteil wird vom Gehalt abgezogen.",
    faq3q: "Warum unterscheidet sich mein tatsächliches Gehalt von dieser Schätzung?",
    faq3a: "Dieser Rechner verwendet Standardabzüge und geht von keinen zusätzlichen Einbehalten aus. Ihr tatsächliches Gehalt kann aufgrund von 401(k)-Beiträgen, Krankenversicherungsprämien, HSA/FSA-Beiträgen oder zusätzlichen Einbehalten auf Ihrer W-4 niedriger ausfallen.",
    faq4q: "Sind diese Zahlen für 2026?",
    faq4a: "Ja, die Steuersätze und FICA-Lohngrenzen spiegeln das Steuerjahr 2026 wider. Steuergesetze ändern sich jährlich – bestätigen Sie dies immer beim IRS oder einem Steuerberater, bevor Sie finanzielle Entscheidungen treffen.",
    disclaimer: "<strong>Haftungsausschluss:</strong> Dieser Rechner bietet Schätzungen nur zu Bildungszwecken. Er ist keine Steuerberatung. Konsultieren Sie einen qualifizierten Steuerberater für Ihre spezifische Situation.",
    footer: "Läuft vollständig in Ihrem Browser. Es werden keine Daten gesammelt oder gespeichert.",
    alertFill: "Bitte geben Sie Ihr Jahresgehalt ein."
  },
  'ru': {
    title: "Калькулятор зарплаты Вашингтона, D.C.",
    subtitle: "Рассчитайте чистую зарплату после федерального налога, FICA и налога округа Колумбия. Обновлено для 2026 года.",
    calcHeading: "Калькулятор",
    salaryLabel: "Годовая зарплата до вычетов ($)",
    freqLabel: "Частота выплат",
    freqBiweekly: "Раз в две недели (26)", freqSemimonthly: "Дважды в месяц (24)",
    freqMonthly: "Ежемесячно (12)", freqWeekly: "Еженедельно (52)",
    filingLabel: "Налоговый статус",
    filingSingle: "Одинокий", filingMarried: "Супруги, совместная декларация",
    calcBtn: "Рассчитать чистую зарплату",
    resultLabel: "Расчётная чистая зарплата",
    freqNote: "Чистая выплата за период",
    bdGross: "Годовая до вычетов", bdFederal: "Федеральный налог",
    bdFica: "FICA (соцстрах + Medicare)", bdDc: "Налог округа Колумбия",
    bdNet: "Годовая чистая", bdEff: "Эффективная ставка",
    resultDisclaimer: "Только оценка. Фактические удержания зависят от вычетов, льгот и пособий работодателя.",
    whatIsTitle: "Что делает этот калькулятор",
    whatIsText: "Этот инструмент оценивает вашу чистую зарплату в Вашингтоне, округ Колумбия, вычитая федеральный подоходный налог, взносы FICA (социальное страхование и Medicare) и подоходный налог округа Колумбия из вашей валовой зарплаты. Используются федеральные налоговые ставки 2026 года, стандартный вычет и действующие прогрессивные ставки округа.",
    bracketsTitle: "Налоговые ставки 2026 года",
    federalTitle: "Федеральный подоходный налог (одинокий)",
    dcTitle: "Подоходный налог округа Колумбия",
    ficaTitle: "Взносы FICA",
    ficaSs: "Социальное страхование: 6,2% с заработка до $168 600",
    ficaMc: "Medicare: 1,45% со всего заработка плюс 0,9% сверх $200 000 (одинокий) или $250 000 (супруги)",
    thRate: "Ставка", thIncome: "Налогооблагаемый доход",
    howToTitle: "Как пользоваться",
    howTo1: "Введите годовую зарплату до вычетов.",
    howTo2: "Выберите частоту выплат — большинство работодателей округа платят раз в две недели (26 выплат в год).",
    howTo3: "Выберите налоговый статус. Супруги с совместной декларацией получают больший стандартный вычет.",
    howTo4: "Нажмите «Рассчитать чистую зарплату», чтобы увидеть чистый доход за период и за год.",
    faqTitle: "Часто задаваемые вопросы",
    faq1q: "Есть ли в округе Колумбия подоходный налог?",
    faq1a: "Да. Округ Колумбия взимает собственный подоходный налог по ставкам от 4% до 10,75%. Жители округа платят федеральный налог и налог округа, но не платят налоги Мэриленду или Вирджинии.",
    faq2q: "Что такое FICA?",
    faq2a: "FICA — это Закон о федеральных страховых взносах. Он финансирует социальное страхование (6,2% до предела заработка) и Medicare (1,45% со всего заработка). Работодатель платит столько же, но из зарплаты удерживается только ваша часть.",
    faq3q: "Почему моя фактическая зарплата отличается от оценки?",
    faq3a: "Этот калькулятор использует стандартные вычеты и предполагает отсутствие дополнительных удержаний. Фактическая зарплата может быть ниже из-за взносов в 401(k), страховых взносов, взносов HSA/FSA или дополнительных удержаний, указанных в W-4.",
    faq4q: "Эти цифры для 2026 года?",
    faq4a: "Да, налоговые ставки и пределы FICA отражают 2026 налоговый год. Налоговое законодательство меняется ежегодно — всегда уточняйте у IRS или налогового консультанта перед принятием финансовых решений.",
    disclaimer: "<strong>Отказ от ответственности:</strong> Этот калькулятор предоставляет оценки только в образовательных целях. Это не налоговая консультация. Обратитесь к квалифицированному налоговому специалисту для вашей конкретной ситуации.",
    footer: "Полностью работает в вашем браузере. Данные не собираются и не хранятся.",
    alertFill: "Пожалуйста, введите годовую зарплату."
  },
  'es': {
    title: "Calculadora de Nómina de DC",
    subtitle: "Estime su salario neto después del impuesto federal, FICA y los impuestos del Distrito de Columbia. Actualizado para 2026.",
    calcHeading: "Calculadora",
    salaryLabel: "Salario bruto anual ($)",
    freqLabel: "Frecuencia de pago",
    freqBiweekly: "Quincenal (26)", freqSemimonthly: "Dos veces al mes (24)",
    freqMonthly: "Mensual (12)", freqWeekly: "Semanal (52)",
    filingLabel: "Estado de declaración",
    filingSingle: "Soltero", filingMarried: "Casado, declaración conjunta",
    calcBtn: "Calcular salario neto",
    resultLabel: "Salario neto estimado",
    freqNote: "Pago neto por período",
    bdGross: "Bruto anual", bdFederal: "Impuesto federal",
    bdFica: "FICA (Seguro Social + Medicare)", bdDc: "Impuesto de D.C.",
    bdNet: "Neto anual", bdEff: "Tasa efectiva de impuestos",
    resultDisclaimer: "Solo una estimación. La retención real puede variar según deducciones, créditos y beneficios del empleador.",
    whatIsTitle: "Qué hace esta calculadora",
    whatIsText: "Esta herramienta estima su salario neto en Washington, D.C., restando el impuesto federal sobre la renta, las contribuciones FICA (Seguro Social y Medicare) y el impuesto sobre la renta del Distrito de Columbia de su salario bruto. Utiliza los tramos impositivos federales de 2026, la deducción estándar y las tasas progresivas actuales del Distrito de Columbia.",
    bracketsTitle: "Tramos impositivos de 2026",
    federalTitle: "Impuesto federal (soltero)",
    dcTitle: "Impuesto del Distrito de Columbia",
    ficaTitle: "Contribuciones FICA",
    ficaSs: "Seguro Social: 6,2% sobre salarios hasta $168,600",
    ficaMc: "Medicare: 1,45% sobre todos los salarios, más 0,9% adicional sobre $200,000 (soltero) o $250,000 (casado)",
    thRate: "Tasa", thIncome: "Ingreso gravable",
    howToTitle: "Cómo usar esta calculadora",
    howTo1: "Ingrese su salario bruto anual antes de deducciones.",
    howTo2: "Elija su frecuencia de pago — la mayoría de los empleadores en D.C. pagan quincenalmente (26 pagos al año).",
    howTo3: "Seleccione su estado de declaración. Las parejas casadas que declaran conjuntamente reciben una deducción estándar mayor.",
    howTo4: "Haga clic en \"Calcular salario neto\" para ver su ingreso neto por período y anual.",
    faqTitle: "Preguntas frecuentes",
    faq1q: "¿Tiene D.C. impuesto sobre la renta estatal?",
    faq1a: "Sí. El Distrito de Columbia cobra su propio impuesto sobre la renta, con tasas del 4% al 10,75%. Los residentes de D.C. pagan impuesto federal y de D.C., pero no pagan impuestos estatales a Maryland o Virginia.",
    faq2q: "¿Qué es FICA?",
    faq2a: "FICA son las siglas de la Ley Federal de Contribuciones al Seguro. Financia el Seguro Social (6,2% hasta el límite salarial) y Medicare (1,45% sobre todos los salarios). Su empleador iguala estas contribuciones, pero solo su parte se deduce de su cheque de pago.",
    faq3q: "¿Por qué mi cheque real difiere de esta estimación?",
    faq3a: "Esta calculadora utiliza deducciones estándar y asume que no hay retenciones adicionales. Su cheque real puede ser menor debido a contribuciones al 401(k), primas de seguro de salud, contribuciones HSA/FSA o retenciones adicionales que eligió en su W-4.",
    faq4q: "¿Son estas cifras para 2026?",
    faq4a: "Sí, los tramos impositivos y los límites salariales de FICA reflejan el año fiscal 2026. Las leyes fiscales cambian anualmente — siempre confirme con el IRS o un profesional de impuestos antes de tomar decisiones financieras.",
    disclaimer: "<strong>Aviso legal:</strong> Esta calculadora proporciona estimaciones solo con fines educativos. No es asesoramiento fiscal. Consulte a un profesional de impuestos calificado para su situación específica.",
    footer: "Se ejecuta completamente en su navegador. No se recopilan ni almacenan datos.",
    alertFill: "Por favor ingrese su salario anual."
  }
};

// ============================================================
// 生成文件
// ============================================================
const files = {};

// HTML 页面
files['index.html'] = buildIndexHtml(null, 'en', '/dc-paycheck-calculator/');
files['zh/index.html'] = buildIndexHtml('zh', 'zh-Hans', '/dc-paycheck-calculator/zh/');
files['zh-tw/index.html'] = buildIndexHtml('zh-TW', 'zh-Hant', '/dc-paycheck-calculator/zh-tw/');
files['ja/index.html'] = buildIndexHtml('ja', 'ja', '/dc-paycheck-calculator/ja/');
files['ko/index.html'] = buildIndexHtml('ko', 'ko', '/dc-paycheck-calculator/ko/');
files['de/index.html'] = buildIndexHtml('de', 'de', '/dc-paycheck-calculator/de/');
files['ru/index.html'] = buildIndexHtml('ru', 'ru', '/dc-paycheck-calculator/ru/');
files['es/index.html'] = buildIndexHtml('es', 'es', '/dc-paycheck-calculator/es/');

// CSS / JS
files['css/style.css'] = STYLE_CSS;
files['js/i18n.js'] = I18N_JS;
files['js/calculator.js'] = CALCULATOR_JS;

// Locales
for (const [lang, data] of Object.entries(LOCALES)) {
  files[`locales/${lang}.json`] = JSON.stringify(data, null, 2);
}

// robots.txt
files['robots.txt'] = `User-agent: *
Allow: /

Sitemap: https://toolara.dev/dc-paycheck-calculator/sitemap.xml
`;

// sitemap.xml
files['sitemap.xml'] = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://toolara.dev/dc-paycheck-calculator/</loc>
    <lastmod>2026-09-16</lastmod>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://toolara.dev/dc-paycheck-calculator/"/>
    <xhtml:link rel="alternate" hreflang="zh-Hans" href="https://toolara.dev/dc-paycheck-calculator/zh/"/>
    <xhtml:link rel="alternate" hreflang="zh-Hant" href="https://toolara.dev/dc-paycheck-calculator/zh-tw/"/>
    <xhtml:link rel="alternate" hreflang="ja" href="https://toolara.dev/dc-paycheck-calculator/ja/"/>
    <xhtml:link rel="alternate" hreflang="ko" href="https://toolara.dev/dc-paycheck-calculator/ko/"/>
    <xhtml:link rel="alternate" hreflang="de" href="https://toolara.dev/dc-paycheck-calculator/de/"/>
    <xhtml:link rel="alternate" hreflang="ru" href="https://toolara.dev/dc-paycheck-calculator/ru/"/>
    <xhtml:link rel="alternate" hreflang="es" href="https://toolara.dev/dc-paycheck-calculator/es/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://toolara.dev/dc-paycheck-calculator/"/>
  </url>
  <url><loc>https://toolara.dev/dc-paycheck-calculator/zh/</loc><lastmod>2026-09-16</lastmod><priority>0.8</priority></url>
  <url><loc>https://toolara.dev/dc-paycheck-calculator/zh-tw/</loc><lastmod>2026-09-16</lastmod><priority>0.8</priority></url>
  <url><loc>https://toolara.dev/dc-paycheck-calculator/ja/</loc><lastmod>2026-09-16</lastmod><priority>0.8</priority></url>
  <url><loc>https://toolara.dev/dc-paycheck-calculator/ko/</loc><lastmod>2026-09-16</lastmod><priority>0.8</priority></url>
  <url><loc>https://toolara.dev/dc-paycheck-calculator/de/</loc><lastmod>2026-09-16</lastmod><priority>0.8</priority></url>
  <url><loc>https://toolara.dev/dc-paycheck-calculator/ru/</loc><lastmod>2026-09-16</lastmod><priority>0.8</priority></url>
  <url><loc>https://toolara.dev/dc-paycheck-calculator/es/</loc><lastmod>2026-09-16</lastmod><priority>0.8</priority></url>
</urlset>
`;

// .gitignore
files['.gitignore'] = `node_modules/
.wrangler/
.dev.vars
.DS_Store
*.log
.vscode/
.idea/
dist/
build/
`;

// ============================================================
// 写入
// ============================================================
const root = '.';
let count = 0;
for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(root, filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Created: ' + filePath);
  count++;
}
console.log(`\nDone. ${count} files generated.`);
console.log('\nNext steps:');
console.log('  1. git init');
console.log('  2. git add .');
console.log('  3. git commit -m "Initial: DC paycheck calculator"');
console.log('  4. Create a new GitHub repo named "dc-paycheck-calculator"');
console.log('  5. git remote add origin <your-repo-url>');
console.log('  6. git push -u origin main');
console.log('  7. Deploy to Cloudflare as a new Worker');
console.log('  8. Add route in tool-proxy: toolara.dev/dc-paycheck-calculator/*');