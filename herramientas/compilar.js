#!/usr/bin/env node
/*
 * Sistema de diseño CodeLibri · compilador
 *
 * Lee tokens/tokens.json y las hojas de src/, y deja en dist/ lo que usa un
 * producto: codelibri.css (tokens, base, componentes y armazón en un solo
 * archivo), codelibri.js, el sprite de iconos, las fuentes y los tokens
 * resueltos en JSON para montar la biblioteca de Figma; y los mismos tokens
 * y los iconos como módulos de JavaScript con sus tipos, para los productos
 * en React. También escribe docs/tokens.js, que la documentación usa para
 * pintar la paleta.
 *
 * Sin dependencias: node herramientas/compilar.js
 */
'use strict';

const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const leer = (r) => fs.readFileSync(path.join(RAIZ, r), 'utf8');
const escribir = (r, texto) => {
  const destino = path.join(RAIZ, r);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, texto);
};

const T = JSON.parse(leer('tokens/tokens.json'));
const VERSION = T.version;

/* ── valores ───────────────────────────────────────────────────────── */

/** El valor de una hoja de tokens: una cadena o un objeto con $value. */
const valor = (hoja) => (hoja && typeof hoja === 'object' && '$value' in hoja ? hoja.$value : hoja);

/** Sigue una ruta «a.b.c» dentro de los tokens. */
function buscar(ruta) {
  let n = T;
  for (const parte of ruta.split('.')) {
    if (n == null || !(parte in n)) throw new Error('Referencia rota: {' + ruta + '}');
    n = n[parte];
  }
  return valor(n);
}

/**
 * Convierte las referencias {…} de un valor en variables CSS. La paleta y
 * los alias del acento tienen variable propia; familia y estado son
 * intermedios y se resuelven hasta llegar a la paleta.
 */
function aCss(v) {
  if (Array.isArray(v)) return v.map(aCss);
  return String(v).replace(/\{([^}]+)\}/g, (_, ruta) => {
    const [grupo, ...resto] = ruta.split('.');
    if (grupo === 'paleta') return 'var(--cl-' + resto.join('-') + ')';
    if (grupo === 'acento') return 'var(--cl-a-' + resto.join('-') + ')';
    if (grupo === 'familia' || grupo === 'estado') return aCss(buscar(ruta));
    throw new Error('No sé traducir {' + ruta + '}');
  });
}

/**
 * Lo mismo, pero hasta el valor final: para Figma y para medir contraste.
 * Figma no entiende color-mix(), así que la mezcla con transparente sale
 * ya calculada como rgba().
 */
function resolver(v, acento = 'primary') {
  if (Array.isArray(v)) return v.map((x) => resolver(x, acento));
  const plano = String(v).replace(/\{([^}]+)\}/g, (_, ruta) => {
    const [grupo, ...resto] = ruta.split('.');
    if (grupo === 'acento') {
      const clave = resto.join('.');
      if (/^\d+$/.test(clave)) return resolver(buscar('paleta.' + acento + '.' + clave), acento);
      return resolver(buscar('familia.' + acento + '.' + clave), acento);
    }
    return resolver(buscar(ruta), acento);
  });
  return plano.replace(/color-mix\(in srgb,\s*#([0-9a-f]{6})\s+(\d+(?:\.\d+)?)%,\s*transparent\)/gi, (_, h, pct) => {
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
    return 'rgba(' + r + ',' + g + ',' + b + ',' + (+pct / 100) + ')';
  });
}

/** Las entradas de un grupo, sin las claves de documentación. */
const entradas = (grupo) => Object.entries(grupo).filter(([k]) => !k.startsWith('$'));

/* ── la hoja de tokens ─────────────────────────────────────────────── */

const FAMILIAS = entradas(T.familia).map(([k]) => k);
const decl = (nombre, v) => '  --cl-' + nombre + ':' + v + ';';

function hojaTokens() {
  const L = [];
  L.push('/* ═══ TOKENS · generados desde tokens/tokens.json; no se editan aquí ═══ */');
  L.push(':root{');
  for (const [fam, pasos] of entradas(T.paleta)) {
    L.push('  ' + entradas(pasos).map(([p, h]) => '--cl-' + fam + '-' + p + ':' + valor(h) + ';').join(''));
  }
  for (const [nombre, hoja] of entradas(T.degradado)) {
    L.push(decl('grad-' + nombre, 'linear-gradient(90deg,' + aCss(valor(hoja)).join(',') + ')'));
  }
  L.push(decl('fuente', T.tipo.fuente));
  L.push(decl('fuente-mono', T.tipo['fuente-mono']));
  for (const [k, h] of entradas(T.tipo.tamano)) L.push(decl('t-' + k, valor(h)));
  for (const [k, h] of entradas(T.tipo.peso)) L.push(decl('peso-' + k, valor(h)));
  for (const [k, h] of entradas(T.tipo.interlineado)) L.push(decl('lh-' + k, valor(h)));
  for (const [k, h] of entradas(T.tipo.tracking)) L.push(decl('tr-' + k, valor(h)));
  for (const [k, h] of entradas(T.espacio)) L.push(decl('e-' + k, valor(h)));
  for (const [k, h] of entradas(T.radio)) L.push(decl('r-' + k, valor(h)));
  for (const [k, h] of entradas(T.movimiento)) L.push(decl('mov-' + k, valor(h)));
  for (const [k, h] of entradas(T.capa)) L.push(decl('z-' + k, valor(h)));
  for (const [k, h] of entradas(T.armazon)) L.push(decl(k, valor(h)));
  L.push('}');

  /* El acento del producto: alias de la familia elegida. Primary por
     omisión; data-acento en <html> o en el mismo elemento que .cl. */
  for (const fam of FAMILIAS) {
    const sel = fam === 'primary' ? ':root,[data-acento="primary"]' : '[data-acento="' + fam + '"]';
    const pasos = entradas(T.paleta[fam]).map(([p]) => '--cl-a-' + p + ':var(--cl-' + fam + '-' + p + ');').join('');
    const extra = entradas(T.familia[fam]).map(([k, h]) => '--cl-a-' + k + ':' + aCss(valor(h)) + ';').join('');
    L.push(sel + '{' + pasos + extra + '}');
  }

  /* Los dos temas. El claro vale en todo .cl y en cualquier región con
     data-theme="light"; el oscuro, bajo data-theme="dark" en <html>, en el
     propio .cl o en una región suya. */
  const tema = (modo) => entradas(T.tema[modo]).map(([k, h]) => decl(k, aCss(valor(h)))).join('\n');
  L.push('.cl,.cl [data-theme="light"]{\n  color-scheme:light;\n' + tema('claro') + '\n}');
  L.push('[data-theme="dark"] .cl,.cl[data-theme="dark"],.cl [data-theme="dark"]{\n  color-scheme:dark;\n' + tema('oscuro') + '\n}');

  /* Un acento en una zona de la página —la tarjeta de otro producto, por
     ejemplo—: ahí se vuelven a declarar los tokens que dependen del acento,
     para que se resuelvan con los alias de esa zona y no con los de arriba. */
  const soloAcento = (modo) => entradas(T.tema[modo])
    .filter(([k]) => k.startsWith('acento') || k === 'foco')
    .map(([k, h]) => '--cl-' + k + ':' + aCss(valor(h)) + ';').join('');
  L.push('.cl [data-acento]{' + soloAcento('claro') + '}');
  L.push('[data-theme="dark"] .cl [data-acento],.cl [data-theme="dark"] [data-acento],.cl [data-theme="dark"][data-acento]{' + soloAcento('oscuro') + '}');

  /* Familias sueltas: cl-f-primary, cl-f-secondary, cl-f-secondary2. Los
     componentes que admiten familia leen --cl-f-fondo, -linea y -texto. */
  for (const fam of FAMILIAS) {
    L.push('.cl .cl-f-' + fam + '{--cl-f-fondo:var(--cl-f-' + fam + '-fondo);--cl-f-linea:var(--cl-f-' + fam
      + '-linea);--cl-f-texto:var(--cl-f-' + fam + '-texto);--cl-f-solido:var(--cl-' + fam + '-500)}');
  }
  return L.join('\n') + '\n';
}

/* ── iconos ────────────────────────────────────────────────────────── */

const ICONOS = JSON.parse(leer('iconos/iconos.json'));

function sprite() {
  const simbolos = Object.entries(ICONOS).map(([id, i]) =>
    '<symbol id="cl-' + id + '" viewBox="0 0 24 24">' + i.trazo + '</symbol>');
  return '<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1.8"'
    + ' stroke-linecap="round" stroke-linejoin="round">\n' + simbolos.join('\n') + '\n</svg>\n';
}

/* ── tokens resueltos, para Figma y la documentación ───────────────── */

function tokensResueltos() {
  const tema = (modo, acento) => Object.fromEntries(entradas(T.tema[modo]).map(([k, h]) => [k, resolver(valor(h), acento)]));
  return {
    version: VERSION,
    paleta: Object.fromEntries(entradas(T.paleta).map(([f, p]) => [f, Object.fromEntries(entradas(p).map(([k, h]) => [k, valor(h)]))])),
    degradado: Object.fromEntries(entradas(T.degradado).map(([k, h]) => [k, { colores: resolver(valor(h)), nota: h.$description || '' }])),
    familia: Object.fromEntries(FAMILIAS.map((f) => [f, Object.fromEntries(entradas(T.familia[f]).map(([k, h]) => [k, resolver(valor(h))]))])),
    tema: Object.fromEntries(['claro', 'oscuro'].map((modo) => [modo, Object.fromEntries(FAMILIAS.map((f) => [f, tema(modo, f)]))])),
    notas: Object.fromEntries(['claro'].flatMap((modo) => entradas(T.tema[modo]).filter(([, h]) => h && h.$description).map(([k, h]) => [k, h.$description]))),
    tipo: {
      fuente: T.tipo.fuente, 'fuente-mono': T.tipo['fuente-mono'],
      tamano: Object.fromEntries(entradas(T.tipo.tamano).map(([k, h]) => [k, { valor: valor(h), nota: (h && h.$description) || '' }])),
      peso: T.tipo.peso, interlineado: T.tipo.interlineado, tracking: T.tipo.tracking,
    },
    espacio: Object.fromEntries(entradas(T.espacio)),
    radio: Object.fromEntries(entradas(T.radio)),
    movimiento: T.movimiento, capa: T.capa,
    armazon: Object.fromEntries(entradas(T.armazon)),
    iconos: Object.fromEntries(Object.entries(ICONOS).map(([k, i]) => [k, i.nombre])),
  };
}

/* ── tokens para JavaScript ────────────────────────────────────────── */

/* Los productos en React no siempre pueden leer la hoja: Bloques pinta con
   objetos de estilo en línea. Para ellos van los mismos tokens resueltos
   como módulo, con sus tipos, y los iconos con su trazo. Los valores son
   los de tokens.json: un producto que los use no puede separarse de la hoja. */

function tipoTs(v, sangria) {
  if (Array.isArray(v)) return 'readonly string[]';
  if (typeof v === 'number') return 'number';
  if (v === null || typeof v !== 'object') return 'string';
  const dentro = sangria + '  ';
  const campos = Object.entries(v).map(([k, x]) =>
    dentro + 'readonly ' + (/^[a-z_$][\w$]*$/i.test(k) ? k : JSON.stringify(k)) + ': ' + tipoTs(x, dentro) + ';');
  return '{\n' + campos.join('\n') + '\n' + sangria + '}';
}

function moduloTokens(resueltos) {
  const aviso = '/* Sistema de diseño CodeLibri ' + VERSION + ' · generado por herramientas/compilar.js; no se edita. */\n';
  const claves = Object.keys(resueltos);
  const js = aviso + claves.map((k) => 'export const ' + k + ' = ' + JSON.stringify(resueltos[k], null, 2) + ';').join('\n')
    + '\n/** La variable CSS de un token de uso: variable("acento") → "var(--cl-acento)". */\n'
    + 'export const variable = (nombre) => "var(--cl-" + nombre + ")";\n'
    + 'export default { ' + claves.join(', ') + ', variable };\n';
  const dts = aviso + claves.map((k) => 'export declare const ' + k + ': ' + tipoTs(resueltos[k], '') + ';').join('\n')
    + '\nexport declare const variable: (nombre: string) => string;\n'
    + 'declare const tokens: { ' + claves.map((k) => k + ': typeof ' + k).join('; ') + '; variable: typeof variable };\n'
    + 'export default tokens;\n';
  return { js, dts };
}

function moduloIconos() {
  const aviso = '/* Sistema de diseño CodeLibri ' + VERSION + ' · generado por herramientas/compilar.js; no se edita.\n'
    + '   Cada icono: su nombre y el trazo que va dentro de <svg viewBox="0 0 24 24">,\n'
    + '   con fill="none", stroke="currentColor", stroke-width 1.8 y extremos redondos. */\n';
  return {
    js: aviso + 'export const iconos = ' + JSON.stringify(ICONOS, null, 2) + ';\nexport default iconos;\n',
    dts: aviso + 'export type NombreIcono = ' + Object.keys(ICONOS).map((k) => JSON.stringify(k)).join(' | ') + ';\n'
      + 'export declare const iconos: Readonly<Record<NombreIcono, { readonly nombre: string; readonly trazo: string }>>;\n'
      + 'export default iconos;\n',
  };
}

/* ── ensamblado ────────────────────────────────────────────────────── */

const ORDEN = [
  'src/fuentes.css',
  'src/base.css',
  'src/componentes/botones.css',
  'src/componentes/campos.css',
  'src/componentes/interruptor.css',
  'src/componentes/etiquetas.css',
  'src/componentes/tarjetas.css',
  'src/componentes/avisos.css',
  'src/componentes/ventanas.css',
  'src/componentes/navegacion.css',
  'src/componentes/datos.css',
  'src/armazon.css',
  'src/utilidades.css',
];

const cabecera = '/*!\n * Sistema de diseño CodeLibri ' + VERSION + '\n'
  + ' * (c) ' + new Date().getFullYear() + ' CodeLibri — Elisa Espinoza Castillo y Luis E. Maldonado Gil\n'
  + ' * Inter: SIL Open Font License 1.1.\n */\n';

const css = cabecera + hojaTokens() + ORDEN.map((r) => '\n' + leer(r)).join('');
escribir('dist/codelibri.css', css);
escribir('dist/codelibri.js', leer('src/js/codelibri.js').replace(/__VERSION__/g, VERSION));
escribir('dist/codelibri-cabeza.js', leer('src/js/cabeza.js'));
escribir('dist/iconos.svg', sprite());
escribir('dist/iconos.json', JSON.stringify(ICONOS, null, 2) + '\n');
const resueltos = tokensResueltos();
escribir('dist/tokens.json', JSON.stringify(resueltos, null, 2) + '\n');
const modTokens = moduloTokens(resueltos), modIconos = moduloIconos();
escribir('dist/tokens.js', modTokens.js);
escribir('dist/tokens.d.ts', modTokens.dts);
escribir('dist/iconos.js', modIconos.js);
escribir('dist/iconos.d.ts', modIconos.dts);
/* El componente de icono para React: se escribe a mano en src/react/ y
   aquí solo se le pone la versión. */
escribir('dist/react.js', leer('src/react/react.js').replace(/__VERSION__/g, VERSION));
escribir('dist/react.d.ts', leer('src/react/react.d.ts').replace(/__VERSION__/g, VERSION));
escribir('docs/tokens.js', '/* Generado por herramientas/compilar.js */\nwindow.CL_TOKENS = ' + JSON.stringify(resueltos) + ';\n');
/* El sprite, metido en la propia página: así <use href="#cl-…"> funciona
   también abriendo la documentación con doble clic, sin servidor. */
escribir('docs/iconos.js', '/* Generado por herramientas/compilar.js */\ndocument.body.insertAdjacentHTML("afterbegin", '
  + JSON.stringify(sprite().replace('<svg ', '<svg aria-hidden="true" style="display:none" ')) + ');\n');
/* package.json lleva la misma versión que tokens.json: los productos en
   React instalan el sistema como dependencia y npm lee la de ahí. */
{
  const pkg = JSON.parse(leer('package.json'));
  if (pkg.version !== VERSION) {
    pkg.version = VERSION;
    escribir('package.json', JSON.stringify(pkg, null, 2) + '\n');
    console.log('  package.json pasa a ' + VERSION);
  }
}
for (const f of fs.readdirSync(path.join(RAIZ, 'fuentes'))) {
  fs.mkdirSync(path.join(RAIZ, 'dist/fuentes'), { recursive: true });
  fs.copyFileSync(path.join(RAIZ, 'fuentes', f), path.join(RAIZ, 'dist/fuentes', f));
}

const kb = (r) => (fs.statSync(path.join(RAIZ, r)).size / 1024).toFixed(1) + ' KB';
console.log('Sistema de diseño CodeLibri ' + VERSION);
for (const r of ['dist/codelibri.css', 'dist/codelibri.js', 'dist/iconos.svg', 'dist/tokens.json', 'dist/tokens.js', 'dist/iconos.js']) console.log('  ' + r.padEnd(22) + kb(r));
console.log('  ' + Object.keys(ICONOS).length + ' iconos, ' + FAMILIAS.length + ' familias de acento, 2 temas');

/* Y el contraste, siempre: si algo baja de 4.5:1 la compilación falla. */
require('./contraste.js');
