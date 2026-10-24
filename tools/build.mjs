// Sayt generatoru:  node tools/fetch-catalog.mjs   (data/ yeniləmək üçün)
//                   node tools/build.mjs            (səhifələri qurmaq üçün)
// Çıxış: / (ingiliscə, x-default) və /<dil>/ qovluqları. Hüquqi səhifələr (/privacy/ və s.) toxunulmaz qalır.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LANGS, T } from './i18n.mjs';
import { UI, POPULAR } from './i18n-ui.mjs';
import { REF } from './i18n-ref.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const icons = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/icons.json'), 'utf8'));
const index = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/index.json'), 'utf8'));
const regionFiles = Object.fromEntries(
  index.regions.map(([code]) => [code, JSON.parse(fs.readFileSync(path.join(ROOT, 'data/r', `${code}.json`), 'utf8'))]),
);

const SITE = 'https://simvela.app';
const DARK = { en: 'Dark mode', az: 'Tünd rejim', tr: 'Karanlık mod', ru: 'Тёмная тема', de: 'Dunkelmodus', fr: 'Mode sombre', it: 'Modalità scura', es: 'Modo oscuro', pt: 'Modo escuro', ar: 'الوضع الداكن', hi: 'डार्क मोड', ja: 'ダークモード', ko: '다크 모드', zh: '深色模式' };
const IOS_URL = 'https://apps.apple.com/app/id6794697043';
const ANDROID_URL = 'https://play.google.com/store/apps/details?id=az.simvela.app';
const SOCIAL = [
  { name: 'Instagram', icon: 'InstagramLogo', url: 'https://www.instagram.com/simvela.esim/' },
  { name: 'TikTok', icon: 'TiktokLogo', url: 'https://www.tiktok.com/@simvela' },
  { name: 'Threads', icon: 'ThreadsLogo', url: 'https://www.threads.com/@simvela.esim' },
  { name: 'Facebook', icon: 'FacebookLogo', url: 'https://www.facebook.com/profile.php?id=61592551805876' },
];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const icon = (name, cls = '') =>
  `<svg class="ic ${cls}" viewBox="0 0 256 256" aria-hidden="true" focusable="false"><path d="${icons[name].join(' ')}" fill="currentColor"/></svg>`;
const pageUrl = (code) => (code === 'en' ? `${SITE}/` : `${SITE}/${code}/`);
const pageHref = (code) => (code === 'en' ? '/' : `/${code}/`);
const usd = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const money = (n) => '$' + usd.format(n);

// Saytda göstərilən bütün ölkə kodları: kataloq + regional paketlərin əhatə siyahıları
const allCodes = new Set(index.countries.map((c) => c[0]));
for (const r of Object.values(regionFiles)) for (const g of r.groups) g.countries.forEach((c) => allCodes.add(c));
const minByCode = Object.fromEntries(index.countries.map(([c, min, n]) => [c, { min, n }]));

function render(lang) {
  const t = { ...T.en, ...T[lang.code] };
  const u = { ...UI.en, ...UI[lang.code] };
  const rf = { ...REF.en, ...REF[lang.code] };
  const regionNames = new Intl.DisplayNames([lang.code], { type: 'region' });
  const enNames = new Intl.DisplayNames(['en'], { type: 'region' });
  const safe = (dn, c) => { try { return dn.of(c) ?? c; } catch { return c; } };
  const names = {}; const enMap = {};
  for (const c of allCodes) { names[c] = safe(regionNames, c); enMap[c] = safe(enNames, c); }
  const name = (cc) => names[cc];
  const fromText = (cc) => t.from.replace('{price}', money(minByCode[cc].min));

  const alternates = LANGS.map((l) => `<link rel="alternate" hreflang="${l.code}" href="${pageUrl(l.code)}">`).join('\n') +
    `\n<link rel="alternate" hreflang="x-default" href="${SITE}/">`;

  const storeBtn = (href, pre, label, ic, cls = '') =>
    `<a class="store ${cls}" href="${href}" rel="noopener">${icon(ic, 'store-ic')}<span class="store-tx"><small>${esc(pre)}</small><b>${esc(label)}</b></span></a>`;
  const stores = (cls = '') =>
    `<div class="stores">${storeBtn(IOS_URL, t.iosPre, t.ios, 'AppleLogo', cls)}${storeBtn(ANDROID_URL, t.andPre, t.and, 'GooglePlayLogo', cls)}</div>`;

  const stripIcons = ['Globe', 'Lightning', 'Wallet', 'ArrowsClockwise'];
  const strip = t.strip.map((s, i) => `<li>${icon(stripIcons[i])}<span>${esc(s)}</span></li>`).join('');
  const how = t.how.map(([h, d], i) =>
    `<li class="step"><span class="step-n" aria-hidden="true">${i + 1}</span><h3>${esc(h)}</h3><p>${esc(d)}</p></li>`).join('');
  const refSteps = rf.steps.map(([h, d], i) =>
    `<li class="step"><span class="step-n" aria-hidden="true">${i + 1}</span><h3>${esc(h)}</h3><p>${esc(d)}</p></li>`).join('');

  const tiles = POPULAR.map((cc) => `<li><button class="tile" type="button" data-cc="${cc}" aria-controls="browse">
  <img src="/assets/img/dest-${cc}.webp" alt="" loading="lazy" decoding="async">
  <span class="tile-tx"><b>${esc(name(cc))}</b><small>${esc(fromText(cc))}</small></span>
</button></li>`).join('');

  const faq = t.faq.map(([q, a]) =>
    `<details><summary><span>${esc(q)}</span>${icon('Plus', 'plus')}</summary><p>${esc(a)}</p></details>`).join('');
  const langOptions = LANGS.map((l) => `<option value="${l.code}"${l.code === lang.code ? ' selected' : ''}>${esc(l.name)}</option>`).join('');
  const langLinks = LANGS.map((l) =>
    `<a href="${pageHref(l.code)}" hreflang="${l.code}" lang="${l.code}" data-lang="${l.code}"${l.code === lang.code ? ' aria-current="true"' : ''}>${esc(l.name)}</a>`).join('');
  const social = SOCIAL.map((s) => `<a href="${s.url}" rel="noopener me" aria-label="${s.name}">${icon(s.icon)}</a>`).join('');
  const logo = '<img class="lg lg-l" src="/assets/logo-horizontal-dark-text.svg" alt="" width="110" height="36"><img class="lg lg-d" src="/assets/logo-horizontal-light-text.svg" alt="" width="110" height="36">';
  const isRoot = lang.code === 'en';

  // Brauzerə ötürülən data: lokallaşmış adlar + ingiliscə adlar (axtarış üçün) + indeks + mətnlər
  const clientData = {
    lang: lang.code,
    names, en: enMap,
    countries: index.countries,
    regions: index.regions.map(([code, min, n, counts]) => [code, u.regions[code] ?? code, min, n, counts]),
    t: {
      from: t.from, thData: t.thData, thValid: t.thValid, thPrice: t.thPrice,
      plansN: u.plansN, thPlan: u.thPlan, thNet: u.thNet, more: u.more, less: u.less,
      regTitle: u.regTitle, incl: u.incl, showC: u.showC, hideC: u.hideC, loading: u.loading, err: u.err, pick: u.pick, regSub: u.regSub,
    },
  };

  const ld = {
    '@context': 'https://schema.org', '@type': 'MobileApplication', name: 'Simvela',
    operatingSystem: 'iOS, Android', applicationCategory: 'TravelApplication', url: SITE + '/',
    description: t.desc, sameAs: SOCIAL.map((s) => s.url),
  };

  return `<!doctype html>
<html lang="${lang.code}" dir="${lang.dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.desc)}">
<link rel="canonical" href="${pageUrl(lang.code)}">
${alternates}
<meta property="og:type" content="website">
<meta property="og:site_name" content="Simvela">
<meta property="og:title" content="${esc(t.title)}">
<meta property="og:description" content="${esc(t.desc)}">
<meta property="og:url" content="${pageUrl(lang.code)}">
<meta property="og:image" content="${SITE}/assets/og.png">
<meta property="og:locale" content="${lang.og}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#FFFFFF">
<script>try{if(localStorage.getItem("theme")==="dark")document.documentElement.setAttribute("data-theme","dark")}catch(e){}</script>
<link rel="icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32x32.png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/Onest-ExtraBold.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/Onest-Regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/site.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>
<a class="skip" href="#main">${esc(t.skip)}</a>
<header class="top">
  <div class="wrap top-in">
    <a class="brand" href="${pageHref(lang.code)}" aria-label="Simvela">${logo}</a>
    <div class="top-r">
      <button class="themebtn" id="theme" type="button" aria-label="${esc(DARK[lang.code] ?? DARK.en)}" title="${esc(DARK[lang.code] ?? DARK.en)}">${icon('Moon', 'i-moon')}${icon('Sun', 'i-sun')}</button>
      <label class="lang"><span class="sr">${esc(t.lang)}</span>${icon('Globe')}<select id="lang" aria-label="${esc(t.lang)}">${langOptions}</select>${icon('CaretDown', 'caret')}</label>
      <a class="btn btn-sm" href="#get">${esc(t.get)}</a>
    </div>
  </div>
</header>

<main id="main">
  <section class="hero wrap" id="get">
    <div class="hero-tx">
      <h1>${esc(t.h1).replace('|', '<wbr>')}</h1>
      <p class="lead">${esc(t.sub)}</p>
      ${stores()}
      <p class="fine">${esc(t.note)}</p>
    </div>
    <div class="hero-ph" aria-hidden="true">
      <img class="ph ph-a" src="/assets/img/dest-FR.webp" alt="" width="1100" height="733" fetchpriority="high">
      <img class="ph ph-b" src="/assets/img/dest-IT.webp" alt="" width="1100" height="736">
      <img class="ph ph-c" src="/assets/img/dest-JP.webp" alt="" width="1100" height="733">
      <span class="tag">${icon('MapPin')}<b>${esc(name('FR'))}</b><i>${esc(fromText('FR'))}</i></span>
    </div>
  </section>

  <section class="strip" aria-label="Simvela"><ul class="wrap">${strip}</ul></section>

  <section class="how wrap">
    <h2>${esc(t.howTitle)}</h2>
    <ol class="steps">${how}</ol>
  </section>

  <section class="dest wrap" id="dest">
    <div class="sec-h"><h2>${esc(u.popTitle)}</h2><p>${esc(u.popSub)}</p></div>
    <ul class="tiles">${tiles}</ul>
  </section>

  <section class="browse" id="browse">
    <div class="wrap">
      <div class="sec-h"><h2>${esc(u.browseTitle)}</h2><p>${esc(u.browseSub)}</p></div>
      <div class="seg" role="tablist" aria-label="${esc(u.browseTitle)}">
        <button type="button" role="tab" id="tab-c" aria-selected="true" aria-controls="view-c" data-view="c">${esc(u.tabCountries)}</button>
        <button type="button" role="tab" id="tab-r" aria-selected="false" aria-controls="view-r" data-view="r" tabindex="-1">${esc(u.tabRegions)}</button>
      </div>

      <div class="view" id="view-c" role="tabpanel" aria-labelledby="tab-c">
        <div class="split">
          <div class="pick">
            <label class="search">${icon('Globe')}<input id="q" type="search" placeholder="${esc(u.searchPh)}" autocomplete="off" aria-label="${esc(u.searchPh)}"></label>
            <ul class="clist" id="clist" role="list"></ul>
            <p class="empty" id="cempty" hidden>${esc(u.noRes)}</p>
          </div>
          <div class="detail" id="cdetail" aria-live="polite"><p class="hint">${esc(u.pick)}</p></div>
        </div>
      </div>

      <div class="view" id="view-r" role="tabpanel" aria-labelledby="tab-r" hidden>
        <div class="split">
          <div class="pick"><ul class="rlist" id="rlist" role="list"></ul></div>
          <div class="detail" id="rdetail" aria-live="polite"><p class="hint">${esc(u.regSub)}</p></div>
        </div>
      </div>
      <p class="fine">${esc(t.plansNote)}</p>
    </div>
  </section>

  <section class="ref wrap" id="invite">
    <div class="ref-in">
      <div class="ref-tx">
        <h2>${esc(rf.title)}</h2>
        <p>${esc(rf.sub)}</p>
        <p class="fine">${esc(rf.fine)}</p>
      </div>
      <ol class="steps steps-v">${refSteps}</ol>
    </div>
  </section>

  <section class="faq wrap">
    <h2>${esc(t.faqTitle)}</h2>
    <div class="faq-list">${faq}</div>
  </section>

  <section class="final wrap">
    <div class="final-in">
      <h2>${esc(t.finalH).replace('|', '<wbr>')}</h2>
      <p>${esc(t.finalSub)}</p>
      ${stores('store-light')}
    </div>
  </section>
</main>

<footer class="foot">
  <div class="wrap foot-in">
    <div class="foot-top">
      <a class="brand" href="${pageHref(lang.code)}" aria-label="Simvela">${logo}</a>
      <nav class="foot-links" aria-label="Legal">
        <a href="/privacy/">${esc(t.privacy)}</a>
        <a href="/terms/">${esc(t.terms)}</a>
        <a href="/delete-account/">${esc(t.del)}</a>
        <a href="mailto:abishovazar@gmail.com">${esc(t.contact)}</a>
      </nav>
      <div class="social"><span>${esc(t.follow)}</span>${social}</div>
    </div>
    <nav class="langs" aria-label="${esc(t.lang)}">${langLinks}</nav>
    <p class="legal">${esc(t.copy.replace('{year}', '2026'))}</p>
  </div>
</footer>
<script id="sv-data" type="application/json">${JSON.stringify(clientData).replace(/</g, '\\u003c')}</script>
${isRoot ? '<script>try{var s=localStorage.getItem("lang");if(s&&s!=="en"&&/^[a-z]{2}$/.test(s)&&location.pathname==="/"&&!location.hash){location.replace("/"+s+"/")}}catch(e){}</script>' : ''}
<script src="/assets/site.js" defer></script>
</body>
</html>
`;
}

for (const lang of LANGS) {
  const html = render(lang);
  const out = lang.code === 'en' ? path.join(ROOT, 'index.html') : path.join(ROOT, lang.code, 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
}

const urls = LANGS.map((l) => `  <url><loc>${pageUrl(l.code)}</loc>${LANGS.map((a) => `<xhtml:link rel="alternate" hreflang="${a.code}" href="${pageUrl(a.code)}"/>`).join('')}</url>`);
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /r/\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log('built', LANGS.length, 'pages');
