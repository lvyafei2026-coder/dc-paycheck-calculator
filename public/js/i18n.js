const SUPPORTED_LANGS = ['en','zh','zh-TW','ja','ko','de','ru','es'];
const DEFAULT_LANG = 'en';
const PATH_TO_LANG = { '/zh/':'zh', '/zh-tw/':'zh-TW', '/ja/':'ja', '/ko/':'ko', '/de/':'de', '/ru/':'ru', '/es/':'es' };
const LANG_TO_PATH = { 'en':'/', 'zh':'/zh/', 'zh-TW':'/zh-tw/', 'ja':'/ja/', 'ko':'/ko/', 'de':'/de/', 'ru':'/ru/', 'es':'/es/' };

let currentLang = DEFAULT_LANG;
let translations = {};
const cache = {};

function detectPageLang() {
  if (window.__FORCE_LANG__ && SUPPORTED_LANGS.includes(window.__FORCE_LANG__)) return window.__FORCE_LANG__;
  const path = window.location.pathname.replace(/\/$/, '') + '/';
  return PATH_TO_LANG[path] || DEFAULT_LANG;
}

async function loadLocale(lang) {
  if (cache[lang]) return cache[lang];
  const res = await fetch('/locales/' + lang + '.json');
  if (!res.ok) throw new Error('Failed: ' + lang);
  const data = await res.json();
  cache[lang] = data;
  return data;
}

function applyTranslations(t) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] === undefined) return;
    // A value that carries markup must be written as HTML, or the emphasis is lost.
    if (/<\/?(?:strong|em|b|i|br)\b/i.test(t[key])) el.innerHTML = t[key];
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
  window.location.href = LANG_TO_PATH[lang] || '/';
}

document.addEventListener('DOMContentLoaded', initPage);