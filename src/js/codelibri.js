/*!
 * Sistema de diseño CodeLibri __VERSION__ · guion
 * (c) CodeLibri — Elisa Espinoza Castillo y Luis E. Maldonado Gil
 *
 * Se engancha solo por atributos data-cl-*; no hace falta escribir código
 * en cada página. Lo que guarda —tema, barra plegada— se queda en este
 * navegador, bajo la clave de data-cl-clave en <html> («cl» si no hay).
 *
 *   data-cl-tema                 interruptor de tema (role="switch")
 *   data-cl-abrir-lat            abre la barra lateral como cajón
 *   data-cl-velo                 la capa detrás del cajón
 *   data-cl-plegar               pliega y despliega la barra a iconos
 *   data-cl-menu                 botón de un menú (aria-controls → el menú)
 *   data-cl-abrir="id"           abre la ventana modal con ese id
 *   data-cl-cerrar               dentro de una ventana, la cierra
 *   data-cl-carrusel             la fila que se desplaza
 *   data-cl-mover="-1" / "1"     sus flechas, dentro de la misma .cl-seccion
 *   data-cl-buscar               el campo al que lleva la tecla «/»
 *   data-cl-copiar="#selector"   copia el texto de ese elemento
 *
 * Y desde fuera: CodeLibri.aviso("Guardado"), CodeLibri.abrir("id"),
 * CodeLibri.cerrar(), CodeLibri.tema("dark").
 */
(function (w, d) {
  'use strict';

  var raiz = d.documentElement;
  var clave = raiz.getAttribute('data-cl-clave') || 'cl';
  var guardar = function (k, v) { try { localStorage.setItem(clave + '-' + k, v); } catch (e) {} };
  var leer = function (k) { try { return localStorage.getItem(clave + '-' + k); } catch (e) { return null; } };
  var todos = function (sel, dentro) { return [].slice.call((dentro || d).querySelectorAll(sel)); };
  var ancho = w.matchMedia ? w.matchMedia('(min-width:901px)') : null;

  /* ── el foco dentro de un diálogo ──
     Un diálogo que se abre sin llevarse el foco deja a quien navega con
     teclado tabulando por detrás de la capa. Aquí se entra al abrir, el
     tabulador da vueltas dentro y al cerrar vuelve a quien lo abrió. */
  var foco = (function () {
    var pila = [];
    function alcanzables(caja) {
      return todos('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),summary,[tabindex]:not([tabindex="-1"])', caja)
        .filter(function (el) { return el.offsetWidth || el.offsetHeight || el.getClientRects().length; });
    }
    function tabular(e) {
      var actual = pila[pila.length - 1];
      if (e.key !== 'Tab' || !actual) return;
      var lista = alcanzables(actual.caja);
      if (!lista.length) { e.preventDefault(); return; }
      var primero = lista[0], ultimo = lista[lista.length - 1];
      if (e.shiftKey && d.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && d.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    }
    return {
      entrar: function (caja, disparador) {
        if (!pila.length) d.addEventListener('keydown', tabular, true);
        pila.push({ caja: caja, previo: disparador || d.activeElement });
        var lista = alcanzables(caja);
        (lista[0] || caja).focus();
      },
      salir: function () {
        var ultimo = pila.pop();
        if (!pila.length) d.removeEventListener('keydown', tabular, true);
        if (ultimo && ultimo.previo && ultimo.previo.focus) ultimo.previo.focus();
      }
    };
  }());

  /* ── tema ──
     El interruptor dice si el modo oscuro está puesto; un botón con
     data-cl-tema-rotulo anuncia a dónde lleva, no dónde se está. */
  function pintarTema() {
    var oscuro = raiz.getAttribute('data-theme') === 'dark';
    todos('[data-cl-tema]').forEach(function (b) {
      if (b.getAttribute('role') === 'switch') b.setAttribute('aria-checked', oscuro ? 'true' : 'false');
      var r = b.querySelector('[data-cl-tema-rotulo]');
      if (r) r.textContent = oscuro ? 'Modo claro' : 'Modo oscuro';
    });
  }
  function tema(modo) {
    raiz.setAttribute('data-theme', modo);
    guardar('tema', modo);
    pintarTema();
  }

  /* ── barra lateral ── */
  var lat = null, velo = null, abrirLat = null;
  function latAbierta() { return !!lat && lat.classList.contains('cl-abierta'); }
  function latAbre(si) {
    if (!lat || si === latAbierta()) return;
    lat.classList.toggle('cl-abierta', si);
    if (velo) velo.hidden = !si;
    todos('[data-cl-abrir-lat]').forEach(function (b) { b.setAttribute('aria-expanded', si ? 'true' : 'false'); });
    if (si) foco.entrar(lat, abrirLat); else foco.salir();
  }
  function pintarPliegue() {
    var plegada = raiz.classList.contains('cl-lat-plegada');
    todos('[data-cl-plegar]').forEach(function (b) {
      b.setAttribute('aria-expanded', plegada ? 'false' : 'true');
      var s = b.querySelector('span');
      if (s) s.textContent = plegada ? 'Desplegar la barra' : 'Plegar la barra';
      b.title = plegada ? 'Desplegar la barra' : '';
    });
    /* plegada, cada icono dice su nombre al pasar el puntero */
    if (lat) todos('.cl-grupo :is(a,button)', lat).forEach(function (a) {
      var s = a.querySelector('span:not(.cl-avatar)');
      if (!plegada || !s) a.removeAttribute('title'); else a.title = s.textContent;
    });
  }

  /* ── menús ── */
  var menuAbierto = null;
  function menuCierra(devolver) {
    if (!menuAbierto) return;
    var m = menuAbierto; menuAbierto = null;
    var b = d.querySelector('[data-cl-menu][aria-controls="' + m.id + '"]');
    m.hidden = true;
    if (b) { b.setAttribute('aria-expanded', 'false'); if (devolver) b.focus(); }
  }
  function menuAbre(b) {
    var m = d.getElementById(b.getAttribute('aria-controls'));
    if (!m) return;
    if (menuAbierto === m) { menuCierra(); return; }
    menuCierra();
    m.hidden = false; menuAbierto = m;
    b.setAttribute('aria-expanded', 'true');
    var primero = m.querySelector('a[href],button:not([disabled])');
    if (primero) primero.focus();
  }

  /* ── ventanas modales ── */
  var abiertas = [];
  function abrir(id, disparador) {
    var m = d.getElementById(id);
    if (!m) return;
    m.hidden = false;
    w.requestAnimationFrame(function () { m.classList.add('cl-visible'); });
    abiertas.push(m);
    foco.entrar(m.querySelector('.cl-caja') || m, disparador);
  }
  function cerrar() {
    var m = abiertas.pop();
    if (!m) return;
    m.classList.remove('cl-visible');
    setTimeout(function () { m.hidden = true; }, 180);
    foco.salir();
  }

  /* ── aviso flotante ── */
  var flotante = null, reloj = null;
  function aviso(texto, ms) {
    if (!flotante) {
      flotante = d.createElement('div');
      flotante.className = 'cl-flotante';
      flotante.setAttribute('role', 'status');
      flotante.setAttribute('aria-live', 'polite');
      (d.querySelector('.cl') || d.body).appendChild(flotante);
    }
    flotante.textContent = texto;
    flotante.classList.add('cl-visible');
    clearTimeout(reloj);
    reloj = setTimeout(function () { flotante.classList.remove('cl-visible'); }, ms || 2600);
  }

  /* ── carruseles ──
     Las flechas avanzan casi una pantalla; se apagan en los extremos y se
     esconden si todo cabe. */
  function carruseles() {
    todos('[data-cl-carrusel]').forEach(function (c) {
      var seccion = c.closest('.cl-seccion') || c.parentNode;
      var flechas = todos('[data-cl-mover]', seccion);
      function pintar() {
        var max = c.scrollWidth - c.clientWidth - 2;
        seccion.classList.toggle('cl-sin-flechas', max <= 0);
        flechas.forEach(function (f) {
          var atras = f.getAttribute('data-cl-mover') === '-1';
          f.setAttribute('aria-disabled', (atras ? c.scrollLeft <= 2 : c.scrollLeft >= max) ? 'true' : 'false');
        });
      }
      flechas.forEach(function (f) {
        f.addEventListener('click', function () {
          if (f.getAttribute('aria-disabled') === 'true') return;
          c.scrollBy({ left: +f.getAttribute('data-cl-mover') * c.clientWidth * 0.85, behavior: 'smooth' });
        });
      });
      c.addEventListener('scroll', pintar, { passive: true });
      if (w.ResizeObserver) new ResizeObserver(pintar).observe(c);
      pintar();
    });
  }

  /* ── iconos ──
     Con data-cl-iconos="ruta/iconos.svg" en <html>, el sprite se trae una
     vez y se mete en la página: así <use href="#cl-buscar"> funciona igual
     en todos los navegadores, sin depender de referencias entre archivos. */
  function iconos() {
    var ruta = raiz.getAttribute('data-cl-iconos');
    if (!ruta || !w.fetch || d.getElementById('cl-iconos')) return;
    fetch(ruta).then(function (r) { return r.ok ? r.text() : ''; }).then(function (svg) {
      if (!svg || d.getElementById('cl-iconos')) return;
      var caja = d.createElement('div');
      caja.id = 'cl-iconos';
      caja.setAttribute('aria-hidden', 'true');
      caja.style.display = 'none';
      caja.innerHTML = svg;
      d.body.insertBefore(caja, d.body.firstChild);
    });
  }

  function iniciar() {
    iconos();
    pintarTema();
    todos('[data-cl-tema]').forEach(function (b) {
      b.addEventListener('click', function () { tema(raiz.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); });
    });

    abrirLat = d.querySelector('[data-cl-abrir-lat]');
    lat = abrirLat ? d.getElementById(abrirLat.getAttribute('aria-controls')) : d.querySelector('.cl-lat');
    velo = d.querySelector('[data-cl-velo]');
    todos('[data-cl-abrir-lat]').forEach(function (b) { b.addEventListener('click', function () { abrirLat = b; latAbre(true); }); });
    if (velo) velo.addEventListener('click', function () { latAbre(false); });
    /* un enlace a otra parte de la misma página no debe dejar el cajón encima */
    if (lat) lat.addEventListener('click', function (e) { if (e.target.closest('a') && latAbierta()) latAbre(false); });
    if (ancho) {
      var alCambiar = function (m) { if (m.matches) latAbre(false); };
      if (ancho.addEventListener) ancho.addEventListener('change', alCambiar); else if (ancho.addListener) ancho.addListener(alCambiar);
    }
    todos('[data-cl-plegar]').forEach(function (b) {
      b.addEventListener('click', function () {
        var plegada = !raiz.classList.contains('cl-lat-plegada');
        raiz.classList.toggle('cl-lat-plegada', plegada);
        guardar('lat', plegada ? 'plegada' : 'abierta');
        pintarPliegue();
      });
    });
    pintarPliegue();

    todos('[data-cl-menu]').forEach(function (b) {
      b.setAttribute('aria-expanded', 'false');
      b.addEventListener('click', function (e) { e.stopPropagation(); menuAbre(b); });
      var m = d.getElementById(b.getAttribute('aria-controls'));
      /* salir del menú con el tabulador también lo cierra */
      if (m) m.addEventListener('focusout', function (e) {
        if (e.relatedTarget && !m.contains(e.relatedTarget) && e.relatedTarget !== b) menuCierra();
      });
    });
    d.addEventListener('click', function (e) { if (menuAbierto && !menuAbierto.contains(e.target)) menuCierra(); });

    todos('[data-cl-abrir]').forEach(function (b) {
      b.addEventListener('click', function () { abrir(b.getAttribute('data-cl-abrir'), b); });
    });
    todos('.cl-modal').forEach(function (m) {
      m.addEventListener('click', function (e) { if (e.target === m || e.target.closest('[data-cl-cerrar]')) cerrar(); });
    });

    todos('[data-cl-copiar]').forEach(function (b) {
      b.addEventListener('click', function () {
        var origen = d.querySelector(b.getAttribute('data-cl-copiar'));
        if (!origen || !navigator.clipboard) return;
        navigator.clipboard.writeText(origen.innerText.trim()).then(function () { aviso('Copiado'); });
      });
    });

    carruseles();

    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (abiertas.length) { cerrar(); return; }
        if (menuAbierto) { menuCierra(true); return; }
        if (latAbierta()) latAbre(false);
      }
      /* «/» lleva a la búsqueda, salvo que ya se esté escribiendo en algo */
      var t = e.target, tg = t.tagName;
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey && tg !== 'INPUT' && tg !== 'TEXTAREA' && tg !== 'SELECT' && !t.isContentEditable) {
        var q = d.querySelector('[data-cl-buscar]');
        if (q) { e.preventDefault(); q.focus(); }
      }
    });
  }

  w.CodeLibri = { version: '__VERSION__', aviso: aviso, abrir: abrir, cerrar: cerrar, tema: tema, foco: foco, iniciar: iniciar };
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', iniciar); else iniciar();
}(window, document));
