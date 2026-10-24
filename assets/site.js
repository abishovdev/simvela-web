// Simvela sayt: dil seçimi + bütün ölkə və regional paketlərin kataloqu.
// Data statik JSON-lardır (/data/p/XX.json, /data/r/XXX.json); səhifə yüklənəndə yalnız indeks (HTML daxilində) var.
(function () {
  'use strict';
  var raw = document.getElementById('sv-data');
  if (!raw) return;
  var D = JSON.parse(raw.textContent);
  var T = D.t, L = D.lang, loc = L + '-u-nu-latn';

  // ── dil seçimi ───────────────────────────────────────────
  var select = document.getElementById('lang');
  if (select) {
    select.addEventListener('change', function () {
      try { localStorage.setItem('lang', select.value); } catch (e) {}
      location.href = select.value === 'en' ? '/' : '/' + select.value + '/';
    });
  }
  document.querySelectorAll('.langs a').forEach(function (a) {
    a.addEventListener('click', function () {
      try { localStorage.setItem('lang', a.getAttribute('data-lang')); } catch (e) {}
    });
  });

  // ── tema (default işıqlı; tünd rejim yalnız istifadəçi seçəndə) ──
  var themeBtn = document.getElementById('theme');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var root = document.documentElement, dark = root.getAttribute('data-theme') !== 'dark';
      if (dark) root.setAttribute('data-theme', 'dark'); else root.removeAttribute('data-theme');
      try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
    });
  }

  // ── paylaşma çubuğu (seçilmiş ölkə/region üçün real səhifə linki) ──
  var SH = D.share;
  function shareBar(kind, code, name, minPrice) {
    var slug = (kind === 'c' ? SH.slugs : SH.rslugs)[code];
    if (!slug) return null;
    var url = SH.origin + SH.prefix + '/esim/' + slug + '/';
    var vars = { name: name, price: '$' + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(minPrice) };
    var fillv = function (str) { return str.replace(/\{(\w+)\}/g, function (_, k) { return vars[k] || ''; }); };
    var text = fillv(SH.labels.shareText), u = encodeURIComponent(url), tx = encodeURIComponent(text);
    var title = name + ' eSIM';
    var targets = [
      ['X', 'XLogo', 'https://twitter.com/intent/tweet?url=' + u + '&text=' + tx],
      ['Facebook', 'FacebookLogo', 'https://www.facebook.com/sharer/sharer.php?u=' + u],
      ['Reddit', 'RedditLogo', 'https://www.reddit.com/submit?url=' + u + '&title=' + encodeURIComponent(title)],
      ['WhatsApp', 'WhatsappLogo', 'https://wa.me/?text=' + encodeURIComponent(text + ' ' + url)],
      ['Telegram', 'TelegramLogo', 'https://t.me/share/url?url=' + u + '&text=' + tx],
    ];
    function svg(name) {
      var ns = 'http://www.w3.org/2000/svg', s = document.createElementNS(ns, 'svg');
      s.setAttribute('viewBox', '0 0 256 256'); s.setAttribute('class', 'ic'); s.setAttribute('aria-hidden', 'true');
      var p = document.createElementNS(ns, 'path'); p.setAttribute('d', SH.icons[name]); p.setAttribute('fill', 'currentColor'); s.appendChild(p); return s;
    }
    var box = el('div', 'share');
    box.appendChild(el('span', 'share-l', SH.labels.share));
    targets.forEach(function (t) {
      var a = el('a', 'sh'); a.href = t[2]; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.title = t[0]; a.setAttribute('aria-label', t[0]); a.appendChild(svg(t[1])); box.appendChild(a);
    });
    var ok = el('span', 'share-ok'); ok.setAttribute('role', 'status'); ok.setAttribute('aria-live', 'polite');
    var cp = el('button', 'sh'); cp.type = 'button'; cp.title = SH.labels.copy; cp.setAttribute('aria-label', SH.labels.copy); cp.appendChild(svg('Link'));
    cp.addEventListener('click', function () {
      var done = function () { ok.textContent = SH.labels.copied; setTimeout(function () { ok.textContent = ''; }, 2400); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, function () {});
    });
    box.appendChild(cp);
    if (navigator.share) {
      var nv = el('button', 'sh'); nv.type = 'button'; nv.title = SH.labels.native; nv.setAttribute('aria-label', SH.labels.native); nv.appendChild(svg('ShareNetwork'));
      nv.addEventListener('click', function () { navigator.share({ title: title, text: text, url: url }).catch(function () {}); });
      box.appendChild(nv);
    }
    box.appendChild(ok);
    var link = el('a', 'plink', url.replace(/^https?:\/\//, '')); link.href = url;
    box.appendChild(link);
    return box;
  }

  // ── yardımçılar ──────────────────────────────────────────
  var fmtGb = new Intl.NumberFormat(loc, { style: 'unit', unit: 'gigabyte', unitDisplay: 'short', maximumFractionDigits: 2 });
  var fmtDay = new Intl.NumberFormat(loc, { style: 'unit', unit: 'day', unitDisplay: 'long' });
  var fmtUsd = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  var collator = new Intl.Collator(L);
  var money = function (n) { return '$' + fmtUsd.format(n); };
  var fill = function (s, n) { return s.replace('{n}', n).replace('{price}', n); };
  var norm = function (s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); };
  var cache = {};
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function getJson(url) {
    if (cache[url]) return Promise.resolve(cache[url]);
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    }).then(function (j) { cache[url] = j; return j; });
  }

  // paket cədvəli (ilk limit sətir, sonra "hamısını göstər")
  function planTable(rows, limit) {
    var wrap = el('div', 'plans');
    var table = el('table');
    var thead = el('thead'), hr = el('tr');
    [[T.thPlan, ''], [T.thData, ''], [T.thValid, ''], [T.thNet, 'net'], [T.thPrice, 'num']].forEach(function (h) {
      var th = el('th', h[1], h[0]); th.scope = 'col'; hr.appendChild(th);
    });
    thead.appendChild(hr); table.appendChild(thead);
    var tbody = el('tbody');
    rows.forEach(function (r, i) {
      var tr = el('tr');
      if (limit && i >= limit) tr.hidden = true;
      var tdn = el('td', 'pn', r[0]);
      if (r[5]) { var g = el('span', 'reg', '\u25CF'); g.title = T.regTitle; g.setAttribute('aria-label', T.regTitle); tdn.appendChild(g); }
      tr.appendChild(tdn);
      tr.appendChild(el('td', '', fmtGb.format(r[1])));
      tr.appendChild(el('td', '', fmtDay.format(r[2])));
      tr.appendChild(el('td', 'net', r[4]));
      tr.appendChild(el('td', 'num', money(r[3])));
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);
    if (limit && rows.length > limit) {
      var btn = el('button', 'more', fill(T.more, rows.length));
      btn.type = 'button';
      var open = false;
      btn.addEventListener('click', function () {
        open = !open;
        tbody.querySelectorAll('tr').forEach(function (tr, i) { if (i >= limit) tr.hidden = !open; });
        btn.textContent = open ? T.less : fill(T.more, rows.length);
      });
      wrap.appendChild(btn);
    }
    return wrap;
  }

  // ── görünüşlər (Ölkələr / Regionlar) ─────────────────────
  var views = { c: document.getElementById('view-c'), r: document.getElementById('view-r') };
  var tabs = document.querySelectorAll('.seg [role=tab]');
  function showView(v) {
    Object.keys(views).forEach(function (k) { views[k].hidden = k !== v; });
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-view') === v;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    if (v === 'r' && !regionSelected) selectRegion(D.regions[0][0]);
  }
  tabs.forEach(function (t) {
    t.addEventListener('click', function () { showView(t.getAttribute('data-view')); });
  });

  // ── ölkələr ──────────────────────────────────────────────
  var clist = document.getElementById('clist');
  var cdetail = document.getElementById('cdetail');
  var q = document.getElementById('q');
  var cempty = document.getElementById('cempty');
  var items = [];

  D.countries
    .map(function (c) { return { cc: c[0], min: c[1], n: c[2], name: D.names[c[0]] }; })
    .sort(function (a, b) { return collator.compare(a.name, b.name); })
    .forEach(function (c) {
      var li = el('li'); var b = el('button', 'citem'); b.type = 'button'; b.setAttribute('data-cc', c.cc);
      b.appendChild(el('span', 'cn', c.name));
      b.appendChild(el('span', 'cp', money(c.min)));
      li.appendChild(b); clist.appendChild(li);
      items.push({ li: li, btn: b, hay: norm(c.name + ' ' + (D.en[c.cc] || '') + ' ' + c.cc) });
    });

  q.addEventListener('input', function () {
    var v = norm(q.value.trim()), shown = 0;
    items.forEach(function (it) {
      var ok = !v || it.hay.indexOf(v) > -1;
      it.li.hidden = !ok; if (ok) shown++;
    });
    cempty.hidden = shown > 0;
  });
  clist.addEventListener('click', function (e) {
    var b = e.target.closest('.citem'); if (b) selectCountry(b.getAttribute('data-cc'), true);
  });

  var current = null;
  function selectCountry(cc, fromUser, silent) {
    if (!D.names[cc]) return;
    current = cc;
    items.forEach(function (it) { it.btn.setAttribute('aria-pressed', it.btn.getAttribute('data-cc') === cc ? 'true' : 'false'); });
    cdetail.replaceChildren(el('p', 'hint', T.loading));
    getJson('/data/p/' + cc + '.json').then(function (rows) {
      if (current !== cc) return;
      var head = el('div', 'dhead');
      head.appendChild(el('h3', '', D.names[cc]));
      head.appendChild(el('span', 'badge', fill(T.plansN, rows.length)));
      if (rows.some(function (r) { return r[5]; })) {
        var lg = el('span', 'legend'); lg.appendChild(el('span', 'reg', '\u25CF')); lg.appendChild(document.createTextNode(' ' + T.regTitle)); head.appendChild(lg);
      }
      var minP = Math.min.apply(null, rows.map(function (r) { return r[3]; }));
      var bar = shareBar('c', cc, D.names[cc], minP);
      cdetail.replaceChildren.apply(cdetail, [head].concat(bar ? [bar] : [], [planTable(rows, 8)]));
    }).catch(function () { cdetail.replaceChildren(el('p', 'hint', T.err)); });
    if (!silent) { try { history.replaceState(null, '', '#c-' + cc); } catch (e) {} }
    if (fromUser && window.matchMedia('(max-width: 900px)').matches) {
      cdetail.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // ── regionlar ────────────────────────────────────────────
  var rlist = document.getElementById('rlist');
  var rdetail = document.getElementById('rdetail');
  var regionSelected = false;
  D.regions.forEach(function (r) {
    var li = el('li'); var b = el('button', 'citem ritem'); b.type = 'button'; b.setAttribute('data-r', r[0]);
    var left = el('span', 'cn', r[1]);
    var sub = el('small', '', fill(T.plansN, r[3]));
    left.appendChild(sub);
    b.appendChild(left);
    b.appendChild(el('span', 'cp', T.from.replace('{price}', money(r[2]))));
    li.appendChild(b); rlist.appendChild(li);
  });
  rlist.addEventListener('click', function (e) {
    var b = e.target.closest('.ritem'); if (b) selectRegion(b.getAttribute('data-r'), true);
  });
  var currentR = null;
  function selectRegion(code, fromUser) {
    var meta = D.regions.filter(function (r) { return r[0] === code; })[0];
    if (!meta) return;
    regionSelected = true; currentR = code;
    rlist.querySelectorAll('.ritem').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-r') === code ? 'true' : 'false'); });
    rdetail.replaceChildren(el('p', 'hint', T.loading));
    getJson('/data/r/' + code + '.json').then(function (data) {
      if (currentR !== code) return;
      var out = [el('div', 'dhead', null)];
      var rbar = shareBar('r', code, meta[1], meta[2]);
      out[0].appendChild(el('h3', '', meta[1]));
      out[0].appendChild(el('span', 'badge', fill(T.plansN, meta[3])));
      if (rbar) out.push(rbar);
      data.groups.forEach(function (g) {
        var box = el('div', 'group');
        var gh = el('div', 'ghead');
        gh.appendChild(el('b', '', fill(T.incl, g.countries.length)));
        gh.appendChild(el('span', 'gfrom', T.from.replace('{price}', money(g.min))));
        var tog = el('button', 'link', T.showC); tog.type = 'button'; tog.setAttribute('aria-expanded', 'false');
        gh.appendChild(tog);
        box.appendChild(gh);
        var chips = el('ul', 'ccodes'); chips.hidden = true;
        g.countries.map(function (c) { return D.names[c] || c; }).sort(collator.compare).forEach(function (n) {
          chips.appendChild(el('li', '', n));
        });
        tog.addEventListener('click', function () {
          var open = chips.hidden; chips.hidden = !open;
          tog.textContent = open ? T.hideC : T.showC; tog.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        box.appendChild(chips);
        box.appendChild(planTable(g.plans, 5));
        out.push(box);
      });
      rdetail.replaceChildren.apply(rdetail, out);
    }).catch(function () { rdetail.replaceChildren(el('p', 'hint', T.err)); });
    try { history.replaceState(null, '', '#r-' + code); } catch (e) {}
    if (fromUser && window.matchMedia('(max-width: 900px)').matches) {
      rdetail.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // ── populyar kartlar ─────────────────────────────────────
  document.querySelectorAll('.tile').forEach(function (b) {
    b.addEventListener('click', function () {
      showView('c');
      selectCountry(b.getAttribute('data-cc'));
      var target = document.getElementById('browse');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ── başlanğıc vəziyyət (hash və ya ilk populyar ölkə) ───
  var m = /^#(c|r)-([A-Za-z]{2,3})$/.exec(location.hash);
  if (m && m[1] === 'r') { showView('r'); selectRegion(m[2].toUpperCase()); }
  else if (m) { selectCountry(m[2].toUpperCase()); }
  else { selectCountry('FR', false, true); }
})();
