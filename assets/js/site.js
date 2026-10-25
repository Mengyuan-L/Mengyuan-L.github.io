/* site.js: progressive enhancements only; every page works without this file.
   1. The light/dark theme toggle. The inline script in each page's <head> applies a saved choice
      (localStorage.theme) and its theme-color before the first paint, and adds the "js" class that
      reveals the toggle button.
   2. Keyboard focus inside a horizontally scrolling table (.table-wrap): a focused link is scrolled
      fully into view, which browsers skip when the link is already partly visible. */
(function () {
  var root = document.documentElement;
  var query = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  var pageColor = { light: '#ffffff', dark: '#141414' };

  document.addEventListener('focusin', function (e) {
    var wrap = e.target.closest && e.target.closest('.table-wrap');
    if (wrap && wrap !== e.target) e.target.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  });

  // The two theme-color metas follow the system setting; an explicit choice overrides both.
  function setThemeColor(theme) {
    var metas = document.querySelectorAll('meta[name="theme-color"]');
    for (var i = 0; i < metas.length; i++) metas[i].setAttribute('content', pageColor[theme]);
  }

  var saved = root.getAttribute('data-theme');
  if (saved === 'light' || saved === 'dark') setThemeColor(saved);

  var button = document.querySelector('.theme-toggle');
  if (!button) return;
  button.addEventListener('click', function () {
    var current = root.getAttribute('data-theme') || (query && query.matches ? 'dark' : 'light');
    var next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    setThemeColor(next);
    try { localStorage.setItem('theme', next); } catch (e) { /* storage blocked: the choice lasts for this page view */ }
  });
})();
