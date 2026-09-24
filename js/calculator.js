function t() { return (window.__i18n && window.__i18n.t) || {}; }
function lang() { return (window.__i18n && window.__i18n.lang) || 'en'; }

// USD amounts and rates follow the page's own language, using the same conventions as
// the tax-bracket tables in the HTML — de "11.600 $", ru "$11 600", es "11.600".
// Kept in sync by _dc-num-apply.mjs, which compares this table against its own.
const NUM_LOCALE = {
  en: { tag: 'en-US', pre: '$', post: '' },
  zh: { tag: 'zh-CN', pre: '$', post: '' },
  'zh-TW': { tag: 'zh-TW', pre: '$', post: '' },
  ja: { tag: 'ja-JP', pre: '$', post: '' },
  ko: { tag: 'ko-KR', pre: '$', post: '' },
  de: { tag: 'de-DE', pre: '', post: ' $' },
  ru: { tag: 'ru-RU', pre: '$', post: '' },
  es: { tag: 'es-ES', pre: '$', post: '' },
};

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

  const c = NUM_LOCALE[lang()] || NUM_LOCALE.en;
  // ru-RU groups with U+00A0; the page text uses a plain space, so flatten it.
  const num = (n, min, max) => new Intl.NumberFormat(c.tag,
    { minimumFractionDigits: min, maximumFractionDigits: max }).format(n).replace(/\u00A0/g, ' ');
  const fmt = n => c.pre + num(n, 2, 2) + c.post;
  const freqName = tr['freqName' + freq] || ('per period');

  document.getElementById('netPay').textContent = fmt(netPerPeriod);
  document.getElementById('freqNote').textContent = (tr.freqNote || 'Net pay per period') + ' · ' +
    (tr.freqCount || '{n} paychecks/year').replace('{n}', freq);
  document.getElementById('bdGross').textContent = fmt(gross);
  document.getElementById('bdFederal').textContent = '-' + fmt(federal);
  document.getElementById('bdFica').textContent = '-' + fmt(fica);
  document.getElementById('bdDc').textContent = '-' + fmt(dc);
  document.getElementById('bdNet').textContent = fmt(netAnnual);
  const effRate = gross > 0 ? num((federal + fica + dc) / gross * 100, 1, 1) : '0';
  document.getElementById('bdEff').textContent = effRate + '%';

  const result = document.getElementById('result');
  result.classList.add('show');
}

window.calculate = calculate;