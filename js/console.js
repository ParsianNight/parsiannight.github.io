/* Interactive HTTP console in the hero.
   Each endpoint button "sends" a request and renders its response.
   Without JS the static /whoami response in the HTML stays visible. */
(function () {
  'use strict';

  var EMAIL = 'spaceboy20@wearehackerone.com';

  var routes = {
    '/whoami': {
      status: '200 OK',
      body: {
        role: 'Security Engineer, Meta',
        focus: ['AI security', 'web', 'SAST'],
        hackerone: { rank: 'top 400', valid_reports: '250+', companies: '52+', world_cup: '2nd place' }
      }
    },
    '/work': {
      status: '200 OK',
      body: {
        now: 'Security Engineer, Applied AI @ Meta',
        before: ['Security Engineer, Central Security @ Meta', 'Penetration Tester @ Confidencial.io'],
        working_on: ['model capability evals for web security', 'model escapes', 'Muse security']
      }
    },
    '/findings': {
      status: '200 OK',
      body: {
        valid: '250+',
        reported_to: ['Google', 'Amazon', 'GitHub', 'Databricks', 'Adobe', 'Nintendo', '...46 more'],
        favourite_classes: ['account takeover', 'IDOR', 'PII exposure']
      }
    },
    '/cv': {
      status: '403 Forbidden',
      body: {
        error: 'CV available on request',
        contact: EMAIL
      }
    }
  };

  var consoleEl = document.getElementById('console');
  if (!consoleEl) return;

  var reqPath = document.getElementById('req-path');
  var statusEl = document.getElementById('res-status');
  var bodyEl = document.getElementById('res-body');
  var timeEl = document.getElementById('res-time');
  var buttons = consoleEl.querySelectorAll('[data-path]');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pending = null;

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Pretty-print JSON with key/string colouring
  function highlight(obj) {
    return esc(JSON.stringify(obj, null, 2))
      .replace(/"([^"]+)":/g, '<span class="k">"$1"</span>:')
      .replace(/: "([^"]*)"/g, ': <span class="s">"$1"</span>')
      .replace(/^(\s+)"([^"]*)"(,?)$/gm, '$1<span class="s">"$2"</span>$3');
  }

  function send(path) {
    var route = routes[path];
    if (!route) return;

    buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.path === path)); });
    reqPath.textContent = path;
    consoleEl.classList.add('is-loading');
    statusEl.innerHTML = '<span class="d">Sending…</span>';
    bodyEl.innerHTML = '';
    timeEl.textContent = '';

    clearTimeout(pending);
    var latency = reduceMotion ? 0 : 280 + Math.round(Math.random() * 220);
    pending = setTimeout(function () {
      var ok = route.status.indexOf('2') === 0;
      statusEl.innerHTML = 'HTTP/2 <span class="' + (ok ? 'ok' : 'err') + '">' + esc(route.status) + '</span>';
      bodyEl.innerHTML = highlight(route.body);
      timeEl.textContent = (latency || 1) + ' ms';
      consoleEl.classList.remove('is-loading');
      bodyEl.classList.remove('unroll');
      void bodyEl.offsetWidth; // restart the reveal
      bodyEl.classList.add('unroll');
    }, latency);
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () { send(b.dataset.path); });
  });
})();
