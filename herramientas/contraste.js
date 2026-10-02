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
    /* Un tinte translúcido (campo, acento-suave, el fondo de un estado o de
       una familia) cambia según lo que tenga debajo, así que se mide encima
       de la superficie y encima del lienzo. Hasta la 0.10.1 solo se medía
       sobre la superficie, y sobre el lienzo texto-3 daba 4.49:1. */
    const BASES = [['superficie', sup], ['fondo', fondo]];
    const parejas = [
      ['texto', 'superficie', color(t.texto), sup],
      ['texto', 'fondo', color(t.texto), fondo],
      ['texto-2', 'superficie', color(t['texto-2']), sup],
      ['texto-2', 'fondo', color(t['texto-2']), fondo],
      ['texto-3', 'superficie', color(t['texto-3']), sup],
      ['texto-3', 'fondo', color(t['texto-3']), fondo],
      ['acento', 'superficie', color(t.acento), sup],
      ['acento', 'fondo', color(t.acento), fondo],
      ['acento-sobre', 'acento-solido', color(t['acento-sobre']), color(t['acento-solido'])],
    ];
    for (const [nb, b] of BASES) {
      parejas.push(['texto-2', 'campo sobre ' + nb, color(t['texto-2']), capa('campo', b)]);
      parejas.push(['texto-3', 'campo sobre ' + nb, color(t['texto-3']), capa('campo', b)]);
      parejas.push(['texto-3', 'flotar sobre ' + nb, color(t['texto-3']), capa('flotar', b)]);
      parejas.push(['acento', 'acento-suave sobre ' + nb, color(t.acento), capa('acento-suave', b)]);
      /* La pastilla activa o la ficha de acento cuando además se pasa por
         encima, y sobre las manchas de color que decoran el lienzo. */
      parejas.push(['acento', 'acento-suave y flotar sobre ' + nb, color(t.acento), capa('acento-suave', capa('flotar', b))]);
    }
    parejas.push(['acento', 'acento-suave sobre la mancha del lienzo', color(t.acento), capa('acento-suave', capa('mancha-1', fondo))]);
    for (const f of ['primary', 'secondary', 'secondary2']) {
      parejas.push(['f-' + f + '-texto', 'superficie', color(t['f-' + f + '-texto']), sup]);
      for (const [nb, b] of BASES) parejas.push(['f-' + f + '-texto', 'f-' + f + '-fondo sobre ' + nb, color(t['f-' + f + '-texto']), capa('f-' + f + '-fondo', b)]);
    }
    for (const e of ['exito', 'advertencia', 'error', 'info']) {
      for (const [nb, b] of BASES) parejas.push([e + '-texto', e + '-fondo sobre ' + nb, color(t[e + '-texto']), capa(e + '-fondo', b)]);
      parejas.push([e + '-texto', 'superficie', color(t[e + '-texto']), sup]);
    }
    /* La rampa categórica va como texto y como filete sobre la superficie, el
       lienzo y su propio color al 10%, que es como se pintan las fichas de un
       filtro. Los tres fondos, medidos; solo con el acento primary, porque la
       rampa no depende del acento y si no se contaría tres veces. */
    if (acento === 'primary') {
      for (let i = 1; i <= 10; i++) {
        const c = color(t['cat-' + i]);
        parejas.push(['cat-' + i, 'superficie', c, sup]);
        parejas.push(['cat-' + i, 'fondo', c, fondo]);
        for (const [nb, b] of BASES) parejas.push(['cat-' + i, 'su propio 10% sobre ' + nb, c, sobre([c[0], c[1], c[2], 0.1], b)]);
        /* El paso vivo no es para texto normal: va en puntos, rayas y fichas
           rellenas. Lo que se mide es el texto que se pone encima. */
        const cat = T.categoria[i];
        parejas.push(['cat-' + i + '-sobre', 'cat-' + i + '-vivo', color(cat.sobre), color(cat.vivo)]);
      }
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
