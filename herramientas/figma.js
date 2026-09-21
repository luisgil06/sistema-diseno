#!/usr/bin/env node
/*
 * Sistema de diseño CodeLibri · de los tokens a Figma
 *
 * El código manda: la biblioteca de Figma se arma a partir de
 * tokens/tokens.json (con sus referencias) y dist/tokens.json (resuelto).
 * Este guion no toca Figma; escribe en figma/scripts/ los guiones que se
 * ejecutan dentro del archivo con la API de complementos, uno por paso.
 * Cada guion busca por nombre antes de crear, así que se puede volver a
 * correr para sincronizar sin duplicar nada.
 *
 *   node herramientas/compilar.js     (primero: deja dist/tokens.json)
 *   node herramientas/figma.js
 *
 * Colecciones:
 *   Paleta   un modo      los 91 pasos de las diez escalas; ocultos en los selectores
 *   Acento   tres modos   primary, secondary, secondary2: lo que --cl-a-* vale en cada uno
 *   Tema     dos modos    Claro y Oscuro: los tokens de uso; apuntan a Acento y Paleta
 *                         cuando el código usa una referencia, y llevan el valor
 *                         cuando el código lo escribe literal
 *   Tipo     un modo      familia, tamaños y pesos
 *   Forma    un modo      espacio, radios y medidas del armazón
 *
 * Lo que no pasa a Figma: movimiento y capas (no hay variables de ese tipo)
 * y el clamp() de display y título (va su tamaño mayor).
 */
'use strict';

const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const leer = (r) => JSON.parse(fs.readFileSync(path.join(RAIZ, r), 'utf8'));
const escribir = (r, texto) => {
  const destino = path.join(RAIZ, r);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, texto);
};

const F = leer('tokens/tokens.json');
const R = leer('dist/tokens.json');
const ACENTOS = ['primary', 'secondary', 'secondary2'];
const TEMAS = { claro: 'Claro', oscuro: 'Oscuro' };

const valor = (t) => (t && typeof t === 'object' && '$value' in t ? t.$value : t);
const nota = (t) => (t && typeof t === 'object' && t.$description) || '';
const alias = (coleccion, nombre) => ({ a: `${coleccion}:${nombre}` });

/* Una referencia {paleta.x.y} o {familia.x.y} → alias a la Paleta, o el literal. */
function aPaleta(ref) {
  let v = ref;
  for (let i = 0; i < 4 && typeof v === 'string'; i++) {
    const m = v.match(/^\{([\w.-]+)\}$/);
    if (!m) break;
    const partes = m[1].split('.');
    if (partes[0] === 'paleta') return alias('Paleta', `${partes[1]}/${partes[2]}`);
    let nodo = F;
    for (const p of partes) nodo = nodo && nodo[p];
    v = valor(nodo);
  }
  if (typeof v === 'string' && /^(#|rgba?\(|transparent)/.test(v)) return v;
  throw new Error(`Referencia sin resolver: ${ref}`);
}

/* ── Paleta ───────────────────────────────────────────────────────── */
const paleta = [];
for (const [familia, pasos] of Object.entries(R.paleta)) {
  for (const [paso, hex] of Object.entries(pasos)) {
    paleta.push({ n: `${familia}/${paso}`, t: 'COLOR', v: [hex], s: [], w: `var(--cl-${familia}-${paso})` });
  }
}

/* ── Acento ───────────────────────────────────────────────────────── */
/* Los translúcidos del acento dependen del acento y del tema a la vez; en
   Figma un alias no lleva transparencia, así que viven aquí, uno por tema,
   y el Tema los elige según su modo. */
const TRANSLUCIDOS = {
  'acento-suave': 'suave',
  'acento-linea': 'linea',
  foco: 'foco',
};
const acento = [];
for (const paso of Object.keys(F.paleta.primary).filter((k) => /^\d+$/.test(k))) {
  acento.push({ n: `a/${paso}`, t: 'COLOR', v: ACENTOS.map((f) => alias('Paleta', `${f}/${paso}`)), s: [], w: `var(--cl-a-${paso})` });
}
for (const clave of ['texto-claro', 'texto-oscuro', 'sobre']) {
  acento.push({
    n: `a/${clave}`, t: 'COLOR', v: ACENTOS.map((f) => aPaleta(F.familia[f][clave])), s: [], w: `var(--cl-a-${clave})`,
    d: clave === 'sobre' ? 'Texto sobre el paso 500 del acento.' : `El paso de texto del acento en el tema ${clave.endsWith('claro') ? 'claro' : 'oscuro'}.`,
  });
}
for (const [token, corto] of Object.entries(TRANSLUCIDOS)) {
  for (const tema of Object.keys(TEMAS)) {
    const fuente = valor(F.tema[tema][token]);
    acento.push({
      n: `a/${corto}-${tema}`, t: 'COLOR', v: ACENTOS.map((f) => R.tema[tema][f][token]), s: [],
      w: fuente.replace(/\{acento\.(\w+)\}/g, 'var(--cl-a-$1)'),
      d: `Lo que --cl-${token} vale en el tema ${tema}.`,
    });
  }
}

/* ── Tema ─────────────────────────────────────────────────────────── */
const GRUPOS = [
  ['superficie', ['fondo', 'superficie', 'vidrio', 'campo', 'flotar', 'mancha-1', 'mancha-2', 'velo', 'velo-modal']],
  ['linea', ['superficie-linea', 'vidrio-linea', 'linea', 'linea-2']],
  ['texto', ['texto', 'texto-2', 'texto-3']],
  ['acento', ['acento', 'acento-solido', 'acento-suave', 'acento-linea', 'acento-sobre', 'foco']],
  ['control', ['riel', 'perilla', 'barra', 'barra-viva']],
];
const RELLENO = ['FRAME_FILL', 'SHAPE_FILL'];
const FILETE = ['STROKE_COLOR'];
const LETRA = ['TEXT_FILL', 'STROKE_COLOR'];
function ambito(token) {
  if (token === 'acento-solido') return [...RELLENO, 'STROKE_COLOR'];
  if (token === 'foco') return ['STROKE_COLOR', 'EFFECT_COLOR'];
  if (/^(texto|acento|acento-sobre)$|-texto(-\d)?$|^texto-\d$/.test(token)) return LETRA;
  if (/linea(-2)?$/.test(token)) return FILETE;
  return RELLENO;
}
function valorTema(token, tema) {
  const crudo = valor(F.tema[tema][token]);
  if (TRANSLUCIDOS[token]) return alias('Acento', `a/${TRANSLUCIDOS[token]}-${tema}`);
  const ref = typeof crudo === 'string' && crudo.match(/^\{(acento)\.([\w-]+)\}$/);
  if (ref) return alias('Acento', `a/${ref[2]}`);
  if (typeof crudo === 'string' && /^\{[\w.-]+\}$/.test(crudo)) return aPaleta(crudo);
  return R.tema[tema].primary[token]; // literal o color-mix de la paleta: el valor resuelto
}
const tema = [];
const agrupados = new Set(GRUPOS.flatMap(([, t]) => t));
const conGrupo = [...GRUPOS];
const resto = Object.keys(F.tema.claro).filter((k) => !k.startsWith('$') && !k.startsWith('sombra') && !agrupados.has(k));
conGrupo.push(['familia', resto.filter((k) => k.startsWith('f-'))]);
conGrupo.push(['estado', resto.filter((k) => !k.startsWith('f-'))]);
for (const [grupo, tokens] of conGrupo) {
  for (const token of tokens) {
    tema.push({
      n: `${grupo}/${token}`, t: 'COLOR', v: Object.keys(TEMAS).map((t) => valorTema(token, t)),
      s: ambito(token), w: `var(--cl-${token})`, d: nota(F.tema.claro[token]),
    });
  }
}

/* Las sombras son estilos de efecto. Lo que cambia entre temas (el color,
   y en sombra-2 también la caída) se enlaza a variables del Tema. */
function sombra(texto) {
  const m = texto.trim().match(/^(-?[\d.]+)(?:px)?\s+(-?[\d.]+)(?:px)?\s+(-?[\d.]+)(?:px)?(?:\s+(-?[\d.]+)(?:px)?)?\s+(rgba?\([^)]*\)|#\w+)$/);
  if (!m) throw new Error(`Sombra ilegible: ${texto}`);
  return { x: +m[1], y: +m[2], desenfoque: +m[3], extension: +(m[4] || 0), color: m[5] };
}
const estilosSombra = [];
const nombresSombra = { 'sombra-1': 'Sombra/1 · reposo', 'sombra-2': 'Sombra/2 · al apuntar', 'sombra-3': 'Sombra/3 · flotante', 'sombra-marca': 'Sombra/Marca', 'sombra-marca-2': 'Sombra/Marca · al apuntar' };
for (const token of Object.keys(nombresSombra)) {
  const c = sombra(R.tema.claro.primary[token]);
  const o = sombra(R.tema.oscuro.primary[token]);
  const partes = {};
  for (const parte of ['x', 'y', 'desenfoque', 'extension', 'color']) {
    if (c[parte] === o[parte]) { partes[parte] = c[parte]; continue; }
    const n = `sombra/${token}-${parte}`;
    tema.push({
      n, t: parte === 'color' ? 'COLOR' : 'FLOAT', v: [c[parte], o[parte]],
      s: parte === 'color' ? ['EFFECT_COLOR'] : ['EFFECT_FLOAT'], w: `var(--cl-${token})`,
      d: `Parte de --cl-${token} que cambia con el tema.`,
    });
    partes[parte] = { v: `Tema:${n}` };
  }
  estilosSombra.push({ n: nombresSombra[token], d: `${nota(F.tema.claro[token])} var(--cl-${token})`.trim(), ...partes });
}
/* El anillo de foco de los campos: 0 0 0 3px var(--cl-foco). */
estilosSombra.push({ n: 'Foco/Campo', d: 'El anillo de foco de campos y controles: 0 0 0 3px var(--cl-foco).', x: 0, y: 0, desenfoque: 0, extension: 3, color: { v: 'Tema:acento/foco' } });

/* ── Tipo ─────────────────────────────────────────────────────────── */
const PESOS = { 400: 'Regular', 500: 'Medium', 600: 'Semi Bold', 700: 'Bold', 800: 'Extra Bold' };
const px = (s) => {
  const clamp = String(s).match(/clamp\([^,]+,[^,]+,\s*([\d.]+)px\)/);
  return clamp ? +clamp[1] : parseFloat(s);
};
const tipo = [
  { n: 'fuente/fuente', t: 'STRING', v: ['Inter'], s: ['FONT_FAMILY'], w: 'var(--cl-fuente)' },
  { n: 'fuente/fuente-mono', t: 'STRING', v: ['Cascadia Code'], s: ['FONT_FAMILY'], w: 'var(--cl-fuente-mono)' },
];
for (const [k, t] of Object.entries(F.tipo.tamano)) {
  if (k.startsWith('$')) continue;
  const crudo = valor(t);
  const d = [nota(t), /clamp/.test(crudo) ? `En código: ${crudo}; aquí, el tamaño mayor.` : ''].filter(Boolean).join(' ');
  tipo.push({ n: `tamano/${k}`, t: 'FLOAT', v: [px(crudo)], s: ['FONT_SIZE'], w: `var(--cl-t-${k})`, d });
}
for (const [k, t] of Object.entries(F.tipo.peso)) {
  if (k.startsWith('$')) continue;
  tipo.push({ n: `peso/${k}`, t: 'STRING', v: [PESOS[valor(t)]], s: ['FONT_STYLE'], w: `var(--cl-peso-${k})`, d: `${valor(t)}` });
}

/* ── Forma ────────────────────────────────────────────────────────── */
const forma = [];
for (const [k, t] of Object.entries(F.espacio)) if (!k.startsWith('$')) forma.push({ n: `espacio/${k}`, t: 'FLOAT', v: [px(valor(t))], s: ['GAP'], w: `var(--cl-e-${k})` });
for (const [k, t] of Object.entries(F.radio)) if (!k.startsWith('$')) forma.push({ n: `radio/${k}`, t: 'FLOAT', v: [px(valor(t))], s: ['CORNER_RADIUS'], w: `var(--cl-r-${k})` });
for (const [k, t] of Object.entries(F.armazon)) if (!k.startsWith('$')) forma.push({ n: `armazon/${k}`, t: 'FLOAT', v: [px(valor(t))], s: ['WIDTH_HEIGHT'], w: `var(--cl-${k})`, d: nota(t) });

/* ── Estilos de texto ─────────────────────────────────────────────── */
/* Las combinaciones de la hoja (src/base.css y los componentes). lh en
   múltiplos, tr en em: Figma los recibe en porcentaje. */
const lh = (k) => +valor(F.tipo.interlineado[k]);
const tr = (k) => parseFloat(valor(F.tipo.tracking[k])); // "-.035em" → -0.035
const estilosTexto = [
  { n: 'Titular/Display', tam: 'display', peso: 'extra', lh: lh('apretado'), tr: tr('display'), d: '.cl-display' },
  { n: 'Titular/Título', tam: 'titulo', peso: 'extra', lh: 1.15, tr: tr('titulo'), d: 'h1, .cl-titulo' },
  { n: 'Titular/Encabezado', tam: 'encabezado', peso: 'extra', lh: 1.15, tr: tr('titulo'), d: '.cl-encabezado' },
  { n: 'Titular/Sección', tam: 'seccion', peso: 'negrita', lh: 1.25, tr: tr('seccion'), d: 'h2, .cl-titulo-seccion' },
  { n: 'Titular/Subsección', tam: 'subseccion', peso: 'negrita', lh: 1.3, tr: tr('tarjeta'), d: 'h3, .cl-titulo-sub' },
  { n: 'Titular/Tarjeta', tam: 'tarjeta', peso: 'negrita', lh: lh('compacto'), tr: tr('tarjeta'), d: '.cl-tarjeta-titulo' },
  { n: 'Titular/Menor', tam: 'ui', peso: 'negrita', lh: 1.35, tr: 0, d: 'h4, .cl-titulo-menor' },
  { n: 'Texto/Entrada', tam: 'subseccion', peso: 'normal', lh: lh('holgado'), tr: 0, d: '.cl-entrada' },
  { n: 'Texto/Cuerpo', tam: 'cuerpo', peso: 'normal', lh: lh('normal'), tr: 0, d: 'El texto de lectura: .cl' },
  { n: 'Texto/Interfaz', tam: 'ui', peso: 'normal', lh: lh('normal'), tr: 0, d: 'Controles y texto de interfaz' },
  { n: 'Texto/Interfaz fuerte', tam: 'ui', peso: 'semi', lh: lh('compacto'), tr: 0, d: 'Títulos de menú, de índice y de la tarjeta de la barra lateral' },
  { n: 'Texto/Chico', tam: 'chico', peso: 'normal', lh: lh('normal'), tr: 0, d: '.cl-nota y resúmenes de tarjeta' },
  { n: 'Texto/Nota', tam: 'nota', peso: 'normal', lh: 1.45, tr: 0, d: 'Metadatos, pies, ayudas' },
  { n: 'Texto/Nota media', tam: 'nota', peso: 'medio', lh: lh('compacto'), tr: 0, d: 'Migas, rótulo de campo, control segmentado' },
  { n: 'Texto/Mini', tam: 'mini', peso: 'normal', lh: lh('compacto'), tr: 0, d: '.cl-mini' },
  { n: 'Texto/Micro', tam: 'micro', peso: 'normal', lh: 1.45, tr: 0, d: 'La ayuda bajo un campo' },
  { n: 'Rótulo/Rótulo', tam: 'rotulo', peso: 'negrita', lh: 1.2, tr: tr('rotulo'), mayus: true, d: '.cl-rotulo: grupos, cabeceras de tabla' },
  { n: 'Rótulo/Etiqueta', tam: 'etiqueta', peso: 'negrita', lh: 1.2, tr: tr('rotulo'), mayus: true, d: '.cl-etiqueta' },
  { n: 'Rótulo/Insignia', tam: 'etiqueta', peso: 'negrita', lh: 1.2, tr: 0.08, mayus: true, d: '.cl-insignia' },
  { n: 'Control/Botón', tam: 'ui', peso: 'semi', lh: 1, tr: 0, d: '.cl-boton' },
  { n: 'Control/Botón chico', tam: 'nota', peso: 'semi', lh: 1, tr: 0, d: '.cl-boton-chico' },
  { n: 'Control/Botón grande', tam: 'cuerpo', peso: 'semi', lh: 1, tr: 0, d: '.cl-boton-grande' },
  { n: 'Cifra/Dato clave', tam: 30, peso: 'extra', lh: 1.1, tr: -0.03, d: '.cl-dato-clave b' },
  { n: 'Código/Código', fam: 'fuente-mono', tam: 'mini', peso: 'normal', lh: lh('normal'), tr: 0, d: '.cl-mono, .cl-codigo' },
];

/* ── Degradados ───────────────────────────────────────────────────── */
/* linear-gradient(90deg, …) con los pasos 500: de izquierda a derecha. */
const PASO_DEGRADADO = { '#15eeca': 'secondary/500', '#6c55f6': 'primary/500', '#ff448c': 'secondary2/500' };
const degradados = Object.entries(R.degradado).map(([k, g]) => ({
  n: `Degradado/${k[0].toUpperCase()}${k.slice(1)}`,
  d: `${g.nota} var(--cl-grad-${k})`,
  paradas: g.colores.map((c) => PASO_DEGRADADO[c.toLowerCase()] || c),
}));

/* ── Guiones ──────────────────────────────────────────────────────── */
const PLANTILLA_VARIABLES = `
const D = __DATOS__;
const color = (s) => {
  if (s === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
  if (s[0] === '#') { const h = s.slice(1); return { r: parseInt(h.slice(0, 2), 16) / 255, g: parseInt(h.slice(2, 4), 16) / 255, b: parseInt(h.slice(4, 6), 16) / 255, a: 1 }; }
  const p = s.match(/[\\d.]+/g).map(Number);
  return { r: p[0] / 255, g: p[1] / 255, b: p[2] / 255, a: p.length > 3 ? p[3] : 1 };
};
const colecciones = await figma.variables.getLocalVariableCollectionsAsync();
let col = colecciones.find((c) => c.name === D.coleccion);
const creada = !col;
if (!col) col = figma.variables.createVariableCollection(D.coleccion);
const modos = [];
for (const [i, nombre] of D.modos.entries()) {
  let m = col.modes.find((x) => x.name === nombre);
  if (!m && i === 0 && creada) { col.renameMode(col.modes[0].modeId, nombre); m = col.modes[0]; }
  if (!m) m = { modeId: col.addMode(nombre), name: nombre };
  modos.push(m.modeId);
}
const todas = await figma.variables.getLocalVariablesAsync();
const nombreCol = Object.fromEntries(colecciones.map((c) => [c.id, c.name]));
nombreCol[col.id] = D.coleccion;
const porClave = Object.fromEntries(todas.map((v) => [nombreCol[v.variableCollectionId] + ':' + v.name, v]));
const convertir = (x, tipo) => {
  if (x && typeof x === 'object' && x.a) {
    const destino = porClave[x.a];
    if (!destino) throw new Error('Falta la variable ' + x.a);
    return figma.variables.createVariableAlias(destino);
  }
  return tipo === 'COLOR' ? color(x) : x;
};
const hechas = [], actualizadas = [];
for (const d of D.variables) {
  let v = porClave[D.coleccion + ':' + d.n];
  if (v) actualizadas.push(d.n); else { v = figma.variables.createVariable(d.n, col, d.t); hechas.push(d.n); }
  d.v.forEach((x, i) => v.setValueForMode(modos[i], convertir(x, d.t)));
  v.scopes = d.s;
  v.setVariableCodeSyntax('WEB', d.w);
  v.description = d.d || '';
  porClave[D.coleccion + ':' + d.n] = v;
}
return { coleccion: col.name, id: col.id, modos: col.modes.map((m) => m.name + '=' + m.modeId), creadas: hechas.length, actualizadas: actualizadas.length, total: D.variables.length };
`;

const PLANTILLA_ESTILOS = `
const D = __DATOS__;
const color = (s) => {
  if (s[0] === '#') { const h = s.slice(1); return { r: parseInt(h.slice(0, 2), 16) / 255, g: parseInt(h.slice(2, 4), 16) / 255, b: parseInt(h.slice(4, 6), 16) / 255, a: 1 }; }
  const p = s.match(/[\\d.]+/g).map(Number);
  return { r: p[0] / 255, g: p[1] / 255, b: p[2] / 255, a: p.length > 3 ? p[3] : 1 };
};
const colecciones = await figma.variables.getLocalVariableCollectionsAsync();
const nombreCol = Object.fromEntries(colecciones.map((c) => [c.id, c.name]));
const todas = await figma.variables.getLocalVariablesAsync();
const porClave = Object.fromEntries(todas.map((v) => [nombreCol[v.variableCollectionId] + ':' + v.name, v]));
const variable = (k) => { const v = porClave[k]; if (!v) throw new Error('Falta la variable ' + k); return v; };
const primero = (v) => v.valuesByMode[Object.keys(v.valuesByMode)[0]];
const hecho = { texto: [], efecto: [], relleno: [] };

/* Texto */
const [textos, efectos, rellenos] = await Promise.all([figma.getLocalTextStylesAsync(), figma.getLocalEffectStylesAsync(), figma.getLocalPaintStylesAsync()]);
const familias = { fuente: 'Inter', 'fuente-mono': 'Cascadia Code' };
const PESOS = { normal: 'Regular', medio: 'Medium', semi: 'Semi Bold', negrita: 'Bold', extra: 'Extra Bold' };
for (const e of D.texto) {
  const fam = e.fam || 'fuente';
  const fuente = { family: familias[fam], style: PESOS[e.peso] };
  await figma.loadFontAsync(fuente);
  let s = textos.find((x) => x.name === e.n);
  if (!s) { s = figma.createTextStyle(); s.name = e.n; }
  s.fontName = fuente;
  s.fontSize = typeof e.tam === 'number' ? e.tam : primero(variable('Tipo:tamano/' + e.tam));
  s.lineHeight = { value: Math.round(e.lh * 1000) / 10, unit: 'PERCENT' };
  s.letterSpacing = { value: Math.round(e.tr * 1000) / 10, unit: 'PERCENT' };
  s.textCase = e.mayus ? 'UPPER' : 'ORIGINAL';
  s.description = e.d || '';
  s.setBoundVariable('fontFamily', variable('Tipo:fuente/' + fam));
  if (typeof e.tam !== 'number') s.setBoundVariable('fontSize', variable('Tipo:tamano/' + e.tam));
  if (fam === 'fuente') s.setBoundVariable('fontStyle', variable('Tipo:peso/' + e.peso));
  hecho.texto.push(s.name + '=' + s.id);
}

/* Efecto */
for (const e of D.sombras) {
  let s = efectos.find((x) => x.name === e.n);
  if (!s) { s = figma.createEffectStyle(); s.name = e.n; }
  const lit = (p) => (p && typeof p === 'object' ? null : p);
  let ef = {
    type: 'DROP_SHADOW', visible: true, blendMode: 'NORMAL', showShadowBehindNode: false,
    offset: { x: lit(e.x) ?? 0, y: lit(e.y) ?? 0 }, radius: lit(e.desenfoque) ?? 0, spread: lit(e.extension) ?? 0,
    color: typeof e.color === 'string' ? color(e.color) : { r: 0, g: 0, b: 0, a: 0.2 },
  };
  const campos = { x: 'offsetX', y: 'offsetY', desenfoque: 'radius', extension: 'spread', color: 'color' };
  for (const [parte, campo] of Object.entries(campos)) {
    if (e[parte] && typeof e[parte] === 'object') ef = figma.variables.setBoundVariableForEffect(ef, campo, variable(e[parte].v));
  }
  s.effects = [ef];
  s.description = e.d || '';
  hecho.efecto.push(s.name + '=' + s.id);
}

/* Relleno: degradados de izquierda a derecha con las paradas enlazadas a la Paleta. */
for (const g of D.degradados) {
  let s = rellenos.find((x) => x.name === g.n);
  if (!s) { s = figma.createPaintStyle(); s.name = g.n; }
  const paradas = g.paradas.map((p, i) => {
    const v = variable('Paleta:' + p);
    const c = primero(v);
    return { position: g.paradas.length === 1 ? 0 : i / (g.paradas.length - 1), color: { r: c.r, g: c.g, b: c.b, a: 1 }, boundVariables: { color: figma.variables.createVariableAlias(v) } };
  });
  s.paints = [{ type: 'GRADIENT_LINEAR', gradientTransform: [[1, 0, 0], [0, 1, 0]], gradientStops: paradas }];
  s.description = g.d || '';
  hecho.relleno.push(s.name + '=' + s.id);
}
return hecho;
`;

const incrustar = (plantilla, datos) => plantilla.replace('__DATOS__', JSON.stringify(datos));
const pasos = [
  ['1-paleta.js', { coleccion: 'Paleta', modos: ['Valor'], variables: paleta }],
  ['2-acento.js', { coleccion: 'Acento', modos: ACENTOS, variables: acento }],
  ['3-tema.js', { coleccion: 'Tema', modos: Object.values(TEMAS), variables: tema }],
  ['4-tipo.js', { coleccion: 'Tipo', modos: ['Valor'], variables: tipo }],
  ['5-forma.js', { coleccion: 'Forma', modos: ['Valor'], variables: forma }],
];
for (const [archivo, datos] of pasos) escribir(`figma/scripts/${archivo}`, `/* Generado por herramientas/figma.js desde tokens.json · versión ${R.version}. No se edita. */\n${incrustar(PLANTILLA_VARIABLES, datos).trim()}\n`);
escribir('figma/scripts/6-estilos.js', `/* Generado por herramientas/figma.js desde tokens.json · versión ${R.version}. No se edita. */\n${incrustar(PLANTILLA_ESTILOS, { texto: estilosTexto, sombras: estilosSombra, degradados }).trim()}\n`);

/* ── Iconos ───────────────────────────────────────────────────────── */
/* Cada icono de iconos/iconos.json pasa a un componente Icono/<clave>, de
   24 × 24 y trazo 1.8 redondeado, con el trazo enlazado a texto/texto: en
   código el icono toma currentColor, y en Figma la instancia cambia el token. */
const PLANTILLA_ICONOS = `
const D = __DATOS__;
const pagina = figma.root.children.find((p) => p.name === 'Iconos');
await figma.setCurrentPageAsync(pagina);
const colecciones = await figma.variables.getLocalVariableCollectionsAsync();
const nombreCol = Object.fromEntries(colecciones.map((c) => [c.id, c.name]));
const todas = await figma.variables.getLocalVariablesAsync();
const V = (k) => { const v = todas.find((x) => nombreCol[x.variableCollectionId] + ':' + x.name === k); if (!v) throw new Error('Falta ' + k); return v; };
const pinta = (k) => [figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', V(k))];
const radio = (n, k) => ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius'].forEach((p) => n.setBoundVariable(p, V(k)));
const estilos = await figma.getLocalTextStylesAsync();
await figma.loadFontAsync({ family: 'Cascadia Code', style: 'Regular' });
const rejilla = pagina.findOne((n) => n.type === 'FRAME' && n.name === 'Rejilla de iconos');
if (!rejilla) throw new Error('Falta el marco «Rejilla de iconos»: se crea antes con la documentación de la página.');
const existentes = new Set(pagina.findAllWithCriteria({ types: ['COMPONENT'] }).map((c) => c.name));
const hechos = [];
for (const [clave, nombre, trazo] of D) {
  if (existentes.has('Icono/' + clave)) continue;
  const svg = figma.createNodeFromSvg('<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">' + trazo + '</svg>');
  const comp = figma.createComponentFromNode(svg);
  comp.name = 'Icono/' + clave;
  comp.fills = [];
  comp.clipsContent = false;
  comp.description = nombre + '. En código: <svg class="cl-ico" width="20" height="20" aria-hidden="true"><use href="#cl-' + clave + '"/></svg>';
  // Una sola capa con el mismo nombre en todos: así, al intercambiar el icono
  // de una instancia, Figma conserva el color que se le puso encima.
  const trazoUnico = figma.flatten([...comp.children], comp);
  trazoUnico.name = 'Trazo';
  trazoUnico.strokes = pinta('Tema:texto/texto'); trazoUnico.strokeWeight = 1.8; trazoUnico.strokeCap = 'ROUND'; trazoUnico.strokeJoin = 'ROUND'; trazoUnico.fills = [];
  trazoUnico.constraints = { horizontal: 'SCALE', vertical: 'SCALE' };
  const celda = figma.createAutoLayout('VERTICAL', { name: clave, itemSpacing: 10, primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: 'CENTER', paddingTop: 18, paddingBottom: 14 });
  rejilla.appendChild(celda);
  celda.resize(116, 88); celda.primaryAxisSizingMode = 'FIXED'; celda.counterAxisSizingMode = 'FIXED';
  celda.fills = pinta('Tema:superficie/superficie'); celda.strokes = pinta('Tema:linea/superficie-linea'); celda.strokeWeight = 1;
  radio(celda, 'Forma:radio/medio');
  celda.appendChild(comp);
  const t = figma.createText();
  await t.setTextStyleIdAsync(estilos.find((s) => s.name === 'Código/Código').id);
  t.characters = clave; t.fills = pinta('Tema:texto/texto-3');
  celda.appendChild(t);
  hechos.push(comp.name + '=' + comp.id);
}
return { hechos: hechos.length, ids: hechos };
`;
const iconos = Object.entries(leer('iconos/iconos.json')).map(([clave, i]) => [clave, i.nombre, i.trazo]);
const mitad = Math.ceil(iconos.length / 2);
escribir('figma/scripts/7-iconos-a.js', `/* Generado por herramientas/figma.js desde iconos/iconos.json. No se edita. */\n${incrustar(PLANTILLA_ICONOS, iconos.slice(0, mitad)).trim()}\n`);
escribir('figma/scripts/7-iconos-b.js', `/* Generado por herramientas/figma.js desde iconos/iconos.json. No se edita. */\n${incrustar(PLANTILLA_ICONOS, iconos.slice(mitad)).trim()}\n`);

const total = paleta.length + acento.length + tema.length + tipo.length + forma.length;
console.log(`figma/scripts: Paleta ${paleta.length} · Acento ${acento.length} · Tema ${tema.length} · Tipo ${tipo.length} · Forma ${forma.length} = ${total} variables`);
console.log(`estilos: ${estilosTexto.length} de texto · ${estilosSombra.length} de efecto · ${degradados.length} degradados`);
for (const [archivo] of pasos) console.log(`  ${archivo} ${fs.statSync(path.join(RAIZ, 'figma/scripts', archivo)).size} bytes`);
