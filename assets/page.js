// Ölkə/region səhifələri: tema düyməsi, dil seçimi, paylaşma (link kopyalama + telefonun öz paylaşma menyusu).
(function () {
  'use strict';
  var PAGE_LANGS = ['en', 'az', 'tr', 'ru'];

  var themeBtn = document.getElementById('theme');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var root = document.documentElement, dark = root.getAttribute('data-theme') !== 'dark';
      if (dark) root.setAttribute('data-theme', 'dark'); else root.removeAttribute('data-theme');
      try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
    });
  }

  var select = document.getElementById('lang');
  if (select) {
    select.addEventListener('change', function () {
      var l = select.value, slug = select.getAttribute('data-slug');
      try { localStorage.setItem('lang', l); } catch (e) {}
      if (slug && PAGE_LANGS.indexOf(l) > -1) location.href = (l === 'en' ? '' : '/' + l) + '/esim/' + slug + '/';
      else location.href = l === 'en' ? '/' : '/' + l + '/';
    });
  }

  document.querySelectorAll('.share').forEach(function (box) {
    var url = box.getAttribute('data-url'), text = box.getAttribute('data-text'), title = box.getAttribute('data-title');
    var ok = box.querySelector('.share-ok');
    var copy = box.querySelector('[data-copy]');
    var native = box.querySelector('[data-native]');
    function say(msg) { if (ok) { ok.textContent = msg; clearTimeout(say.t); say.t = setTimeout(function () { ok.textContent = ''; }, 2400); } }
    if (copy) {
      copy.addEventListener('click', function () {
        var done = function () { say(box.getAttribute('data-copied')); };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(done, function () { fallback(); });
        } else { fallback(); }
        function fallback() {
          var ta = document.createElement('textarea'); ta.value = url; ta.style.position = 'fixed'; ta.style.opacity = '0';
          document.body.appendChild(ta); ta.select();
          try { document.execCommand('copy'); done(); } catch (e) {}
          document.body.removeChild(ta);
        }
      });
    }
    if (native && navigator.share) {
      native.hidden = false;
      native.addEventListener('click', function () {
        navigator.share({ title: title, text: text, url: url }).catch(function () {});
      });
    }
  });
})();
