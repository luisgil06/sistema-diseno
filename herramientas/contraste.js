#!/usr/bin/env node
/*
 * Mide el contraste de cada pareja de texto y fondo del sistema en los dos
 * temas y con los tres acentos, a partir de dist/tokens.json. Sale con
 * error si alguna baja de 4.5:1, para que un cambio de color no rompa la
 * accesibilidad sin que nadie se entere.
 *
 * No mide el texto blanco sobre los degradados: está en sus 500 por
 * decisión de Luis, con las cifras delante (1.49:1 en el menta).
 */
'use strict';
const fs = require('fs');
const path = require('path');
const T = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'dist', 'tokens.json'), 'utf8'));

function color(v) {
  v = String(v).trim();
  let m = v.match(/^#([0-9a-f]{6})$/i);
  if (m) return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)).concat(1);
  m = v.match(/^rgba?\(([^)]+)\)$/i);
  if (m) { const p = m[1].split(',').map(Number); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; }
  if (v === 'transparent') return [0, 0, 0, 0];
  throw new Error('Color que no sé leer: ' + v);
}
/* a encima de b */
const sobre = (a, b) => { const t = a[3]; return [0, 1, 2].map((i) => a[i] * t + b[i] * (1 - t)).concat(1); };
const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

const MINIMO = 4.5;
let fallos = 0, medidas = 0, peor = { r: 99 };

for (const modo of ['claro', 'oscuro']) {
  for (const acento of Object.keys(T.familia)) {
    const t = T.tema[modo][acento];
    const sup = color(t.superficie), fondo = color(t.fondo);
    const capa = (k, base = sup) => sobre(color(t[k]), base);
    const parejas = [
      ['texto', 'superficie', color(t.texto), sup],
      ['texto', 'fondo', color(t.texto), fondo],
      ['texto-2', 'superficie', color(t['texto-2']), sup],
      ['texto-2', 'fondo', color(t['texto-2']), fondo],
      ['texto-2', 'campo', color(t['texto-2']), capa('campo')],
      ['texto-3', 'superficie', color(t['texto-3']), sup],
      ['acento', 'superficie', color(t.acento), sup],
      ['acento', 'fondo', color(t.acento), fondo],
      ['acento', 'acento-suave', color(t.acento), capa('acento-suave')],
      ['acento-sobre', 'acento-solido', color(t['acento-sobre']), color(t['acento-solido'])],
    ];
    for (const f of ['primary', 'secondary', 'secondary2']) {
      parejas.push(['f-' + f + '-texto', 'superficie', color(t['f-' + f + '-texto']), sup]);
      parejas.push(['f-' + f + '-texto', 'f-' + f + '-fondo', color(t['f-' + f + '-texto']), capa('f-' + f + '-fondo')]);
    }
    for (const e of ['exito', 'advertencia', 'error', 'info']) {
      parejas.push([e + '-texto', e + '-fondo', color(t[e + '-texto']), capa(e + '-fondo')]);
      parejas.push([e + '-texto', 'superficie', color(t[e + '-texto']), sup]);
    }
    for (const [txt, bg, a, b] of parejas) {
      const r = ratio(a, b);
      medidas++;
      if (r < peor.r) peor = { r, donde: modo + ' / ' + acento + ': ' + txt + ' sobre ' + bg };
      if (r < MINIMO) { fallos++; console.log('  FALLA  ' + r.toFixed(2) + ':1  ' + modo + ' / ' + acento + ': ' + txt + ' sobre ' + bg); }
    }
  }
}
console.log('Contraste: ' + medidas + ' parejas medidas; la más justa, ' + peor.r.toFixed(2) + ':1 (' + peor.donde + ').');
if (fallos) { console.log(fallos + ' por debajo de ' + MINIMO + ':1.'); process.exit(1); }
console.log('Todas pasan de ' + MINIMO + ':1.');
