// Hər ölkə və region üçün ayrı statik səhifə:  /esim/turkey/  (ingiliscə),  /az/esim/turkey/  və s.
// Məqsəd: sosial şəbəkələrdə (Facebook, X, Reddit, WhatsApp, Telegram…) paylaşanda link-önizləmə həmin ölkəyə
// aid olsun — platformaların robotları JavaScript işlətmir, ona görə məzmun SERVERDƏ (build zamanı) yazılır.
import fs from 'node:fs';
import path from 'node:path';

export const PAGE_LANGS = ['en', 'az', 'tr', 'ru'];

export const P = {
  en: {
    title: '{name} eSIM — plans from {price} | Simvela',
    desc: '{name} travel eSIM: {n} plans from {price}. Install in minutes, no roaming bills. Buy in the Simvela app.',
    h1: '{name} eSIM',
    lead: 'Stay online in {name}. Choose a data plan, install the eSIM before you fly and switch it on when you land.',
    leadR: 'One eSIM for {name}. Choose a plan, install it before you fly and switch it on when you arrive.',
    share: 'Share', copy: 'Copy link', copied: 'Link copied', native: 'Share…',
    shareText: 'Travelling to {name}? eSIM plans from {price}:',
    ig: 'For Instagram and TikTok, copy the link and add it to your bio or story.',
    plansTitle: '{name} eSIM plans',
    plansSub: 'Every plan we offer. Prices are in US dollars; the app shows the final price before you pay.',
    showAll: 'Show all {n} plans', regional: 'Regional plan (also covers other countries)',
    covers: 'Covers {n} countries', popular: 'Other popular destinations', regions: 'Regional plans',
    crumbHome: 'Home', crumbEsim: 'eSIM',
  },
  az: {
    title: '{name} eSIM — başlanğıc qiymət {price} | Simvela',
    desc: '{name} üçün səyahət eSIM-i: {n} paket, başlanğıc qiymət {price}. Dəqiqələr içində quraşdırma, roaminq xərci yoxdur. Simvela tətbiqindən al.',
    h1: '{name} eSIM',
    lead: '{name} ölkəsində internetsiz qalma. Data paketini seç, uçuşdan əvvəl eSIM-i quraşdır, çatanda aktiv et.',
    leadR: '{name} üçün tək eSIM. Paket seç, uçuşdan əvvəl quraşdır, çatanda aktiv et.',
    share: 'Paylaş', copy: 'Linki kopyala', copied: 'Link kopyalandı', native: 'Paylaş…',
    shareText: '{name} səfərini planlayırsan? eSIM paketləri, başlanğıc qiymət {price}:',
    ig: 'Instagram və TikTok üçün linki kopyala, bio-ya və ya story-yə əlavə et.',
    plansTitle: '{name} eSIM paketləri',
    plansSub: 'Təklif etdiyimiz bütün paketlər. Qiymətlər ABŞ dolları ilədir; yekun qiyməti ödəməzdən əvvəl tətbiq göstərir.',
    showAll: 'Bütün {n} paketi göstər', regional: 'Regional paket (başqa ölkələri də əhatə edir)',
    covers: '{n} ölkəni əhatə edir', popular: 'Digər məşhur istiqamətlər', regions: 'Regional paketlər',
    crumbHome: 'Ana səhifə', crumbEsim: 'eSIM',
  },
  tr: {
    title: '{name} eSIM — başlangıç fiyatı {price} | Simvela',
    desc: '{name} için seyahat eSIM\'i: {n} paket, başlangıç fiyatı {price}. Dakikalar içinde kurulum, dolaşım faturası yok. Simvela uygulamasından al.',
    h1: '{name} eSIM',
    lead: '{name} seyahatinde internetsiz kalma. Bir veri paketi seç, uçmadan önce eSIM\'i kur, indiğinde aç.',
    leadR: '{name} için tek eSIM. Bir paket seç, uçmadan önce kur, vardığında aç.',
    share: 'Paylaş', copy: 'Bağlantıyı kopyala', copied: 'Bağlantı kopyalandı', native: 'Paylaş…',
    shareText: '{name} seyahati mi planlıyorsun? eSIM paketleri, başlangıç fiyatı {price}:',
    ig: 'Instagram ve TikTok için bağlantıyı kopyalayıp biyografine veya hikâyene ekle.',
    plansTitle: '{name} eSIM paketleri',
    plansSub: 'Sunduğumuz tüm paketler. Fiyatlar ABD doları cinsindendir; nihai fiyatı uygulama ödemeden önce gösterir.',
    showAll: 'Tüm {n} paketi göster', regional: 'Bölgesel paket (başka ülkeleri de kapsar)',
    covers: '{n} ülkeyi kapsar', popular: 'Diğer popüler destinasyonlar', regions: 'Bölgesel paketler',
    crumbHome: 'Ana sayfa', crumbEsim: 'eSIM',
  },
  ru: {
    title: 'eSIM {name} — тарифы от {price} | Simvela',
    desc: 'eSIM для поездок: {name}, тарифов: {n}, от {price}. Настройка за минуты, без счетов за роуминг. Покупка в приложении Simvela.',
    h1: 'eSIM {name}',
    lead: 'Оставайся на связи: {name}. Выбери пакет данных, установи eSIM до вылета и включи по прилёте.',
    leadR: 'Одна eSIM для региона: {name}. Выбери тариф, установи до вылета и включи по прилёте.',
    share: 'Поделиться', copy: 'Копировать ссылку', copied: 'Ссылка скопирована', native: 'Поделиться…',
    shareText: 'Едешь в {name}? Тарифы eSIM от {price}:',
    ig: 'Для Instagram и TikTok скопируй ссылку и добавь её в описание профиля или сторис.',
    plansTitle: 'Тарифы eSIM: {name}',
    plansSub: 'Все наши тарифы. Цены в долларах США; итоговую цену приложение показывает перед оплатой.',
    showAll: 'Показать все тарифы ({n})', regional: 'Региональный тариф (покрывает и другие страны)',
    covers: 'Охватывает стран: {n}', popular: 'Другие популярные направления', regions: 'Региональные тарифы',
    crumbHome: 'Главная', crumbEsim: 'eSIM',
  },
};

const slugify = (s) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const prefixOf = (l) => (l === 'en' ? '' : `/${l}`);
export const entityPath = (l, slug) => `${prefixOf(l)}/esim/${slug}/`;
const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');

// Katalogdakı rəsmi ingilis adları ("Turkey 500MB/Day" → "Turkey"); tapılmasa Intl adı.
export function buildNames(ctx) {
  const { ROOT, index, UI } = ctx;
  const dn = new Intl.DisplayNames(['en'], { type: 'region' });
  const used = new Map();
  const out = { countries: {}, regions: {} };
  for (const [cc] of index.countries) {
    const rows = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/p', `${cc}.json`), 'utf8'));
    const native = rows.find((r) => !r[5]);
    let name = native ? native[0].replace(/\s+\d.*$/, '').replace(/\s*\(.*\)$/, '').trim() : '';
    if (!name || name.length < 2) name = dn.of(cc);
    name = name.charAt(0).toUpperCase() + name.slice(1);
    let slug = slugify(name);
    if (used.has(slug)) slug = `${slug}-${cc.toLowerCase()}`;
    used.set(slug, cc);
    out.countries[cc] = { name, slug };
  }
  const R = { EUR: 'europe', ASI: 'asia', NOR: 'north-america', MID: 'middle-east', GUL: 'gulf-states', CAR: 'caribbean', BAL: 'balkans', GLO: 'global' };
  for (const [code] of index.regions) out.regions[code] = { name: UI.en.regions[code] ?? code, slug: R[code] ?? slugify(code) };
  fs.writeFileSync(path.join(ROOT, 'data/names.json'), JSON.stringify(out));
  return out;
}

export function shareLinks(url, text, title) {
  const u = encodeURIComponent(url), tx = encodeURIComponent(text);
  return [
    ['X', 'XLogo', `https://twitter.com/intent/tweet?url=${u}&text=${tx}`],
    ['Facebook', 'FacebookLogo', `https://www.facebook.com/sharer/sharer.php?u=${u}`],
    ['Reddit', 'RedditLogo', `https://www.reddit.com/submit?url=${u}&title=${encodeURIComponent(title)}`],
    ['WhatsApp', 'WhatsappLogo', `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`],
    ['Telegram', 'TelegramLogo', `https://t.me/share/url?url=${u}&text=${tx}`],
  ];
}

// Server tərəfində yazılan paylaşma çubuğu (JS olmadan da linklər işləyir; kopyala/native düymələrini JS aktivləşdirir)
export function shareBarHtml(ctx, { url, text, title, p, cls = '', ig = true }) {
  const { esc, icon } = ctx;
  return `<div class="share ${cls}" data-url="${esc(url)}" data-text="${esc(text)}" data-title="${esc(title)}" data-copied="${esc(p.copied)}">
  <span class="share-l">${esc(p.share)}</span>
  ${shareLinks(url, text, title).map(([n, ic, href]) => `<a class="sh" href="${esc(href)}" target="_blank" rel="noopener noreferrer" aria-label="${n}" title="${n}">${icon(ic)}</a>`).join('')}
  <button class="sh" type="button" data-copy aria-label="${esc(p.copy)}" title="${esc(p.copy)}">${icon('Link')}</button>
  <button class="sh" type="button" data-native aria-label="${esc(p.native)}" title="${esc(p.native)}" hidden>${icon('ShareNetwork')}</button>
  <span class="share-ok" role="status" aria-live="polite"></span>
  ${ig ? `<p class="share-ig">${esc(p.ig)}</p>` : ''}
</div>`;
}

export function shareButton(ctx, p) {
  const { esc, icon } = ctx;
  return `<button class="themebtn" id="sharebtn" type="button" aria-expanded="false" aria-controls="sharepop" aria-label="${esc(p.share)}" title="${esc(p.share)}">${icon('ShareNetwork')}</button>`;
}

export function buildEntities(ctx, names) {
  const { ROOT, SITE, IOS_URL, ANDROID_URL, SOCIAL, esc, icon, money, LANGS, T, UI, POPULAR, index, regionFiles, DARK } = ctx;
  const ogOf = (key) => (fs.existsSync(path.join(ROOT, 'assets/og', `${key}.jpg`)) ? `${SITE}/assets/og/${key}.jpg` : `${SITE}/assets/og.png`);
  const urls = []; // sitemap üçün: {slug, langs}

  function planTable(rows, t, u, fmt) {
    const head = `<thead><tr><th scope="col">${esc(u.thPlan)}</th><th scope="col">${esc(t.thData)}</th><th scope="col">${esc(t.thValid)}</th><th scope="col" class="net">${esc(u.thNet)}</th><th scope="col" class="num">${esc(t.thPrice)}</th></tr></thead>`;
    const body = rows.map((r) =>
      `<tr><td class="pn">${esc(r[0])}${r[5] ? '<span class="reg" title="•">●</span>' : ''}</td><td>${esc(fmt.gb.format(r[1]))}</td><td>${esc(fmt.day.format(r[2]))}</td><td class="net">${esc(r[4])}</td><td class="num">${esc(money(r[3]))}</td></tr>`).join('');
    return `<div class="plans"><table>${head}<tbody>${body}</tbody></table></div>`;
  }

  for (const lang of LANGS.filter((l) => PAGE_LANGS.includes(l.code))) {
    const t = { ...T.en, ...T[lang.code] };
    const u = { ...UI.en, ...UI[lang.code] };
    const p = P[lang.code];
    const loc = `${lang.code}-u-nu-latn`;
    const fmt = {
      gb: new Intl.NumberFormat(loc, { style: 'unit', unit: 'gigabyte', unitDisplay: 'short', maximumFractionDigits: 2 }),
      day: new Intl.NumberFormat(loc, { style: 'unit', unit: 'day', unitDisplay: 'long' }),
    };
    const dnLocal = new Intl.DisplayNames([lang.code], { type: 'region' });
    const localName = (cc) => (lang.code === 'en' ? names.countries[cc].name : (() => { try { return dnLocal.of(cc) ?? names.countries[cc].name; } catch { return names.countries[cc].name; } })());

    const logo = '<img class="lg lg-l" src="/assets/logo-horizontal-dark-text.svg" alt="" width="110" height="36"><img class="lg lg-d" src="/assets/logo-horizontal-light-text.svg" alt="" width="110" height="36">';
    const homeHref = lang.code === 'en' ? '/' : `/${lang.code}/`;

    const entities = [
      ...index.countries.map(([cc, min, n]) => ({ kind: 'c', code: cc, slug: names.countries[cc].slug, name: localName(cc), enName: names.countries[cc].name, min, n })),
      ...index.regions.map(([code, min, n]) => ({ kind: 'r', code, slug: names.regions[code].slug, name: (u.regions[code] ?? names.regions[code].name), enName: names.regions[code].name, min, n })),
    ];

    const popularLinks = POPULAR.filter((cc) => names.countries[cc]).map((cc) =>
      `<li><a href="${entityPath(lang.code, names.countries[cc].slug)}">${esc(localName(cc))}</a></li>`).join('');
    const regionLinks = index.regions.map(([code]) =>
      `<li><a href="${entityPath(lang.code, names.regions[code].slug)}">${esc(u.regions[code] ?? names.regions[code].name)}</a></li>`).join('');

    const langOptions = LANGS.map((l) => `<option value="${l.code}"${l.code === lang.code ? ' selected' : ''}>${esc(l.name)}</option>`).join('');
    const footerLangs = (slug) => LANGS.map((l) => {
      const href = PAGE_LANGS.includes(l.code) ? entityPath(l.code, slug) : (l.code === 'en' ? '/' : `/${l.code}/`);
      return `<a href="${href}" hreflang="${l.code}" lang="${l.code}" data-lang="${l.code}"${l.code === lang.code ? ' aria-current="true"' : ''}>${esc(l.name)}</a>`;
    }).join('');
    const social = SOCIAL.map((s) => `<a href="${s.url}" rel="noopener me" aria-label="${s.name}">${icon(s.icon)}</a>`).join('');
    const stores = `<div class="stores">
      <a class="store" href="${IOS_URL}" rel="noopener">${icon('AppleLogo', 'store-ic')}<span class="store-tx"><small>${esc(t.iosPre)}</small><b>${esc(t.ios)}</b></span></a>
      <a class="store" href="${ANDROID_URL}" rel="noopener">${icon('GooglePlayLogo', 'store-ic')}<span class="store-tx"><small>${esc(t.andPre)}</small><b>${esc(t.and)}</b></span></a></div>`;

    for (const e of entities) {
      const url = `${SITE}${entityPath(lang.code, e.slug)}`;
      const price = money(e.min);
      const vars = { name: e.name, price, n: e.n };
      const title = fill(p.title, vars);
      const desc = fill(p.desc, vars);
      const text = fill(p.shareText, vars);
      const ogKey = e.kind === 'c' ? e.code : `r-${e.code}`;
      const alternates = PAGE_LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${SITE}${entityPath(l, e.slug)}">`).join('\n') +
        `\n<link rel="alternate" hreflang="x-default" href="${SITE}${entityPath('en', e.slug)}">`;

      const shareBar = shareBarHtml(ctx, { url, text, title, p });
      const popBar = shareBarHtml(ctx, { url, text, title, p, ig: false });

      let content = '';
      let ldOffers = { lowPrice: e.min, offerCount: e.n };
      if (e.kind === 'c') {
        const rows = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/p', `${e.code}.json`), 'utf8'));
        const first = rows.slice(0, 12), rest = rows.slice(12);
        const hasReg = rows.some((r) => r[5]);
        content = `<section class="wrap epl"><div class="sec-h"><h2>${esc(fill(p.plansTitle, vars))}</h2><p>${esc(p.plansSub)}</p></div>
  <div class="panelbox">${planTable(first, t, u, fmt)}${rest.length ? `<details class="allplans"><summary>${esc(fill(p.showAll, { n: rows.length }))}</summary>${planTable(rest, t, u, fmt)}</details>` : ''}</div>
  ${hasReg ? `<p class="fine"><span class="reg">●</span> ${esc(p.regional)}</p>` : ''}</section>`;
      } else {
        const data = regionFiles[e.code];
        const dnl = new Intl.DisplayNames([lang.code], { type: 'region' });
        const nameOf = (c) => { try { return dnl.of(c) ?? c; } catch { return c; } };
        const groups = data.groups.map((g) => {
          const chips = g.countries.map(nameOf).sort(new Intl.Collator(lang.code).compare).map((n) => `<li>${esc(n)}</li>`).join('');
          const first = g.plans.slice(0, 6), rest = g.plans.slice(6);
          return `<div class="group"><div class="ghead"><b>${esc(fill(p.covers, { n: g.countries.length }))}</b><span class="gfrom">${esc(t.from.replace('{price}', money(g.min)))}</span></div>
    <details class="cdet"><summary>${esc(u.showC)}</summary><ul class="ccodes">${chips}</ul></details>
    ${planTable(first, t, u, fmt)}${rest.length ? `<details class="allplans"><summary>${esc(fill(p.showAll, { n: g.plans.length }))}</summary>${planTable(rest, t, u, fmt)}</details>` : ''}</div>`;
        }).join('');
        content = `<section class="wrap epl"><div class="sec-h"><h2>${esc(fill(p.plansTitle, vars))}</h2><p>${esc(p.plansSub)}</p></div><div class="panelbox">${groups}</div></section>`;
      }

      const ld = [
        { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: p.crumbHome, item: `${SITE}${homeHref}` },
          { '@type': 'ListItem', position: 2, name: e.name + ' eSIM', item: url },
        ] },
        { '@context': 'https://schema.org', '@type': 'Product', name: `${e.enName} eSIM`, description: desc, brand: { '@type': 'Brand', name: 'Simvela' },
          image: ogOf(ogKey), offers: { '@type': 'AggregateOffer', priceCurrency: 'USD', lowPrice: ldOffers.lowPrice, offerCount: ldOffers.offerCount, url } },
      ];

      const html = `<!doctype html>
<html lang="${lang.code}" dir="${lang.dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
${alternates}
<meta property="og:type" content="website">
<meta property="og:site_name" content="Simvela">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${ogOf(ogKey)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(e.enName)} eSIM — Simvela">
<meta property="og:locale" content="${lang.og}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${ogOf(ogKey)}">
<meta name="theme-color" content="#FFFFFF">
<script>try{if(localStorage.getItem("theme")==="dark")document.documentElement.setAttribute("data-theme","dark")}catch(e){}</script>
<link rel="icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32x32.png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/Onest-ExtraBold.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/site.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body class="epage">
<a class="skip" href="#main">${esc(t.skip)}</a>
<header class="top">
  <div class="wrap top-in">
    <a class="brand" href="${homeHref}" aria-label="Simvela">${logo}</a>
    <div class="top-r">
      ${shareButton(ctx, p)}
      <button class="themebtn" id="theme" type="button" aria-label="${esc(DARK[lang.code] ?? DARK.en)}" title="${esc(DARK[lang.code] ?? DARK.en)}">${icon('Moon', 'i-moon')}${icon('Sun', 'i-sun')}</button>
      <label class="lang"><span class="sr">${esc(t.lang)}</span>${icon('Globe')}<select id="lang" aria-label="${esc(t.lang)}" data-slug="${e.slug}">${langOptions}</select>${icon('CaretDown', 'caret')}</label>
      <a class="btn btn-sm" href="#get">${esc(t.get)}</a>
    </div>
  </div>
  <div class="sharepop" id="sharepop" hidden><div class="wrap">${popBar}</div></div>
</header>
<main id="main">
  <section class="ehero wrap" id="get">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="${homeHref}">${esc(p.crumbHome)}</a>${icon('CaretRight')}<span>${esc(p.crumbEsim)}</span>${icon('CaretRight')}<span aria-current="page">${esc(e.name)}</span></nav>
    <div class="ehero-in">
      <div class="ehero-tx">
        <h1>${esc(fill(p.h1, vars))}</h1>
        <p class="lead">${esc(fill(e.kind === 'c' ? p.lead : p.leadR, vars))}</p>
        <p class="efrom"><b>${esc(t.from.replace('{price}', price))}</b><span>${esc(fill(u.plansN, { n: e.n }))}</span></p>
        ${stores}
        <p class="fine">${esc(t.note)}</p>
        ${shareBar}
      </div>
      ${e.kind === 'c' && fs.existsSync(path.join(ROOT, `assets/img/dest-${e.code}.webp`)) ? `<img class="ehero-ph" src="/assets/img/dest-${e.code}.webp" alt="" width="900" height="600">` : ''}
    </div>
  </section>
  ${content}
  <section class="wrap elinks">
    <h2>${esc(p.popular)}</h2>
    <ul class="plinks">${popularLinks}</ul>
    <h2>${esc(p.regions)}</h2>
    <ul class="plinks">${regionLinks}</ul>
  </section>
</main>
<footer class="foot">
  <div class="wrap foot-in">
    <div class="foot-top">
      <a class="brand" href="${homeHref}" aria-label="Simvela">${logo}</a>
      <nav class="foot-links" aria-label="Legal">
        <a href="/privacy/">${esc(t.privacy)}</a><a href="/terms/">${esc(t.terms)}</a><a href="/delete-account/">${esc(t.del)}</a><a href="mailto:abishovazar@gmail.com">${esc(t.contact)}</a>
      </nav>
      <div class="social"><span>${esc(t.follow)}</span>${social}</div>
    </div>
    <nav class="langs" aria-label="${esc(t.lang)}">${footerLangs(e.slug)}</nav>
    <p class="legal">${esc(t.copy.replace('{year}', '2026'))}</p>
  </div>
</footer>
<script src="/assets/share.js" defer></script>
<script src="/assets/page.js" defer></script>
</body>
</html>
`;
      const out = path.join(ROOT, ...(lang.code === 'en' ? [] : [lang.code]), 'esim', e.slug, 'index.html');
      fs.mkdirSync(path.dirname(out), { recursive: true });
      fs.writeFileSync(out, html);
      if (lang.code === 'en') urls.push(e.slug);
    }
  }
  return urls;
}
