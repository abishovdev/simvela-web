// Başlıqdakı "Paylaş" düyməsi (açılan panel) + hazır .share çubuqlarının kopyala/native düymələri.
(function () {
  'use strict';
  var btn = document.getElementById('sharebtn'), pop = document.getElementById('sharepop');
  function setOpen(open) {
    if (!btn || !pop) return;
    pop.hidden = !open; btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (btn && pop) {
    btn.addEventListener('click', function (e) { e.stopPropagation(); setOpen(pop.hidden); });
    document.addEventListener('click', function (e) { if (!pop.hidden && !pop.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  }
  document.querySelectorAll('.share').forEach(function (box) {
    var url = box.getAttribute('data-url'), text = box.getAttribute('data-text'), title = box.getAttribute('data-title');
    var ok = box.querySelector('.share-ok'), copy = box.querySelector('[data-copy]'), nat = box.querySelector('[data-native]');
    function say(msg) { if (ok) { ok.textContent = msg; clearTimeout(say.t); say.t = setTimeout(function () { ok.textContent = ''; }, 2400); } }
    if (copy) copy.addEventListener('click', function () {
      var done = function () { say(box.getAttribute('data-copied')); };
      function fallback() {
        var ta = document.createElement('textarea'); ta.value = url; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (e) {}
        document.body.removeChild(ta);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, fallback); else fallback();
    });
    if (nat && navigator.share) {
      nat.hidden = false;
      nat.addEventListener('click', function () { navigator.share({ title: title, text: text, url: url }).catch(function () {}); });
    }
  });
})();
