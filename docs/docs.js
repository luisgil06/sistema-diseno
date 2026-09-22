/* La documentación: pinta lo que sale de los tokens y el código de cada
   ejemplo. Corre antes que codelibri.js, así los botones de copiar que
   pone aquí quedan enganchados cuando el sistema arranca. */
(function (d) {
  'use strict';
  var T = window.CL_TOKENS;
  var raiz = d.documentElement;
  var $ = function (s) { return d.querySelector(s); };
  var todos = function (s, dentro) { return [].slice.call((dentro || d).querySelectorAll(s)); };
  var ico = function (n, t) { t = t || 20; return '<svg class="cl-ico" width="' + t + '" height="' + t + '" aria-hidden="true"><use href="#cl-' + n + '"/></svg>'; };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };

  /* ── contraste ── */
  function rgb(v) {
    var m = String(v).match(/^#([0-9a-f]{6})$/i);
    if (m) return [0, 2, 4].map(function (i) { return parseInt(m[1].slice(i, i + 2), 16); });
    return null;
  }
  function lum(c) { return c.map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }).reduce(function (s, v, i) { return s + v * [0.2126, 0.7152, 0.0722][i]; }, 0); }
  function ratio(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  var BLANCO = [255, 255, 255], NEGRO = rgb(T.paleta.text['900']);

  /* 1. Los iconos abreviados pasan a su marcado de verdad. */
  todos('i[data-ico]').forEach(function (i) { i.outerHTML = ico(i.getAttribute('data-ico'), i.getAttribute('data-t')); });

  /* 2. El código de cada ejemplo, sin sangría sobrante ni los manejadores
        que solo sirven a la demostración. */
  var n = 0;
  todos('[data-doc-codigo]').forEach(function (ej) {
    var html = ej.innerHTML.replace(/\s+onclick="[^"]*"/g, '').replace(/\s+style="max-width:448px"/g, '');
    var lineas = html.replace(/^\s*\n/, '').replace(/\s+$/, '').split('\n');
    var sangria = Math.min.apply(null, lineas.filter(function (l) { return l.trim(); }).map(function (l) { return l.match(/^\s*/)[0].length; }));
    var limpio = lineas.map(function (l) { return l.slice(sangria); }).join('\n');
    var id = 'codigo-' + (++n);
    ej.insertAdjacentHTML('afterend',
      '<details class="cl-plegable doc-codigo"><summary><b>Ver el código</b></summary><div class="cl-plegable-cuerpo">'
      + '<pre class="cl-codigo" id="' + id + '">' + esc(limpio) + '</pre>'
      + '<button class="cl-boton cl-boton-chico" type="button" data-cl-copiar="#' + id + '">' + ico('copiar', 16) + 'Copiar</button></div></details>');
  });

  /* 3. La paleta, familia por familia, con su contraste. */
  var usados = {};
  Object.keys(T.familia).forEach(function (f) { usados[T.familia[f]['texto-claro']] = true; });
  ['exito', 'advertencia', 'error', 'info'].forEach(function (e) { usados[T.tema.claro.primary[e + '-texto']] = true; });
  var NOMBRES = { primary: 'Primary', secondary: 'Secondary', secondary2: 'Secondary2', success: 'Success', warning: 'Warning', danger: 'Danger', info: 'Info', text: 'Text', white: 'White', black: 'Black' };
  var paleta = $('#doc-paleta');
  if (paleta) paleta.innerHTML = Object.keys(T.paleta).map(function (f) {
    var filas = Object.keys(T.paleta[f]).map(function (p) {
      var hex = T.paleta[f][p], c = rgb(hex), b = ratio(c, BLANCO), k = ratio(c, NEGRO);
      var marca = function (r, l) { return '<span' + (r >= 4.5 ? ' class="doc-ok"' : '') + '>' + l + ' ' + r.toFixed(1) + (r >= 4.5 ? ' ✓' : '') + '</span>'; };
      return '<div class="doc-muestra' + (usados[hex] ? ' doc-texto-marcado' : '') + '"><i style="background:' + hex + '"></i>'
        + '<div><b>' + f + '-' + p + '</b><code>' + hex + '</code></div><div>' + marca(b, 'B') + '<br>' + marca(k, 'N') + '</div></div>';
    }).join('');
    return '<div class="doc-familia"><h4>' + NOMBRES[f] + ' <small>--cl-' + f + '-*</small></h4>' + filas + '</div>';
  }).join('');

  /* 4. Los degradados. */
  var grad = $('#doc-degradados');
  if (grad) grad.innerHTML = Object.keys(T.degradado).map(function (k) {
    return '<div class="doc-degradado"><i style="background:var(--cl-grad-' + k + ')"></i><div><b>--cl-grad-' + k + '</b><span>' + esc(T.degradado[k].nota) + '</span></div></div>';
  }).join('');

  /* 4b. La rampa categórica, pintada como se usa: el color en el texto y en
     el punto, sobre su propio color al 10%. */
  var rampa = $('#doc-rampa');
  if (rampa) {
    var TONOS = ['coral', 'naranja', 'ámbar', 'verde', 'menta', 'cian', 'azul', 'violeta', 'púrpura', 'rosa'];
    rampa.innerHTML = TONOS.map(function (nombre, i) {
      var v = 'var(--cl-cat-' + (i + 1) + ')';
      return '<span style="color:' + v + ';background:color-mix(in srgb,' + v + ' 10%,transparent)">'
        + nombre + ' <code>cat-' + (i + 1) + '</code></span>';
    }).join('');
  }

  /* 5. Los tokens de uso, con el acento que esté puesto. */
  function esColor(v) { return /^(#|rgba?\()/.test(v) || v === 'transparent'; }
  function celda(v) { return '<span class="doc-token">' + (esColor(v) ? '<i style="background:' + v + '"></i>' : '') + '<code>' + esc(v) + '</code></span>'; }
  function pintarTokens() {
    var cuerpo = $('#doc-tokens');
    if (!cuerpo) return;
    var a = raiz.getAttribute('data-acento') || 'primary';
    var claro = T.tema.claro[a], oscuro = T.tema.oscuro[a];
    cuerpo.innerHTML = Object.keys(claro).map(function (k) {
      return '<tr><td><code>--cl-' + k + '</code></td><td>' + celda(claro[k]) + '</td><td>' + celda(oscuro[k]) + '</td><td>' + esc(T.notas[k] || '') + '</td></tr>';
    }).join('');
  }
  pintarTokens();

  /* 6. La escala de espacio. */
  var esp = $('#doc-espacios');
  if (esp) esp.innerHTML = Object.keys(T.espacio).map(function (k) {
    return '<div class="doc-espacio"><code>--cl-e-' + k + ' · ' + T.espacio[k] + '</code><i style="width:' + T.espacio[k] + '"></i></div>';
  }).join('');

  /* 7. Los iconos: un clic copia el marcado. */
  var iconos = $('#doc-iconos');
  if (iconos) iconos.innerHTML = Object.keys(T.iconos).map(function (k) {
    return '<button class="doc-icono" type="button" data-doc-icono="' + k + '" title="' + esc(T.iconos[k]) + '">' + ico(k, 24) + '<small>' + k + '</small></button>';
  }).join('');
  d.addEventListener('click', function (e) {
    var b = e.target.closest('[data-doc-icono]');
    if (!b || !navigator.clipboard) return;
    navigator.clipboard.writeText('<svg class="cl-ico" width="20" height="20" aria-hidden="true"><use href="#cl-' + b.getAttribute('data-doc-icono') + '"/></svg>')
      .then(function () { window.CodeLibri && CodeLibri.aviso('Icono «' + b.getAttribute('data-doc-icono') + '» copiado'); });
  });
  var nIconos = Object.keys(T.iconos).length;
  if ($('#doc-n-iconos')) $('#doc-n-iconos').textContent = nIconos;

  /* 8. Las cifras de la portada y la versión. */
  var cifras = $('#doc-cifras');
  if (cifras) cifras.innerHTML = [
    [Object.keys(T.paleta).length, 'escalas de color'], [2, 'temas'], [Object.keys(T.familia).length, 'acentos'],
    [nIconos, 'iconos'], [Object.keys(T.tema.claro.primary).length, 'tokens de uso']
  ].map(function (c) { return '<li class="cl-pildora"><b>' + c[0] + '</b> ' + c[1] + '</li>'; }).join('');
  todos('.doc-version').forEach(function (s) { s.textContent = T.version; });

  /* 9. El acento de muestra. */
  function pintarAcento() {
    var a = raiz.getAttribute('data-acento') || 'primary';
    todos('[data-doc-acento]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-doc-acento') === a ? 'true' : 'false'); });
  }
  todos('[data-doc-acento]').forEach(function (b) {
    b.addEventListener('click', function () {
      var a = b.getAttribute('data-doc-acento');
      if (a === 'primary') raiz.removeAttribute('data-acento'); else raiz.setAttribute('data-acento', a);
      try { localStorage.setItem('cl-docs-acento', a === 'primary' ? '' : a); } catch (e) {}
      pintarAcento(); pintarTokens();
    });
  });
  pintarAcento();

  /* 10. La sección en la que se está, marcada en la barra lateral. */
  var enlaces = todos('.cl-lat .cl-grupo a[href^="#"]');
  function marcar(id) {
    enlaces.forEach(function (a) {
      if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }
  if ('IntersectionObserver' in window) {
    var visibles = {};
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) { visibles[e.target.id] = e.isIntersecting; });
      var primera = todos('.doc-seccion').filter(function (s) { return visibles[s.id]; })[0];
      if (primera) marcar(primera.id);
    }, { rootMargin: '-80px 0px -55% 0px' });
    todos('.doc-seccion').forEach(function (s) { obs.observe(s); });
  }

  /* 10b. Con ?seccion=id se enseña esa sección sola: para enlazar una
          parte concreta o retratarla. */
  var sola = new URLSearchParams(location.search).get('seccion');
  if (sola && d.getElementById(sola)) {
    todos('.doc-seccion').forEach(function (s) { s.hidden = s.id !== sola; });
    var visible = d.getElementById(sola);
    visible.style.borderTop = '0'; visible.style.paddingTop = '0';
    marcar(sola);
  }

  /* 11. El buscador filtra la barra lateral; Intro lleva a la primera. */
  var q = $('#doc-buscar'), form = $('#doc-buscador');
  var sinAcentos = function (s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
  if (q) q.addEventListener('input', function () {
    var t = sinAcentos(q.value.trim());
    todos('.cl-lat .cl-grupo a').forEach(function (a) { a.hidden = !!t && sinAcentos(a.textContent).indexOf(t) === -1; });
  });
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var a = todos('.cl-lat .cl-grupo a').filter(function (x) { return !x.hidden; })[0];
    if (!a) return;
    var destino = a.getAttribute('href');
    q.value = ''; q.dispatchEvent(new Event('input'));
    if (destino.charAt(0) === '#') location.hash = destino; else location.href = destino;
  });
}(document));
