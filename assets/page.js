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

})();
