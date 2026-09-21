/* Generado por herramientas/figma.js desde tokens.json · versión 0.1.0. No se edita. */
const D = {"texto":[{"n":"Titular/Display","tam":"display","peso":"extra","lh":1.05,"tr":-0.035,"d":".cl-display"},{"n":"Titular/Título","tam":"titulo","peso":"extra","lh":1.15,"tr":-0.03,"d":"h1, .cl-titulo"},{"n":"Titular/Encabezado","tam":"encabezado","peso":"extra","lh":1.15,"tr":-0.03,"d":".cl-encabezado"},{"n":"Titular/Sección","tam":"seccion","peso":"negrita","lh":1.25,"tr":-0.02,"d":"h2, .cl-titulo-seccion"},{"n":"Titular/Subsección","tam":"subseccion","peso":"negrita","lh":1.3,"tr":-0.01,"d":"h3, .cl-titulo-sub"},{"n":"Titular/Tarjeta","tam":"tarjeta","peso":"negrita","lh":1.35,"tr":-0.01,"d":".cl-tarjeta-titulo"},{"n":"Titular/Menor","tam":"ui","peso":"negrita","lh":1.35,"tr":0,"d":"h4, .cl-titulo-menor"},{"n":"Texto/Entrada","tam":"subseccion","peso":"normal","lh":1.65,"tr":0,"d":".cl-entrada"},{"n":"Texto/Cuerpo","tam":"cuerpo","peso":"normal","lh":1.55,"tr":0,"d":"El texto de lectura: .cl"},{"n":"Texto/Interfaz","tam":"ui","peso":"normal","lh":1.55,"tr":0,"d":"Controles y texto de interfaz"},{"n":"Texto/Interfaz fuerte","tam":"ui","peso":"semi","lh":1.35,"tr":0,"d":"Títulos de menú, de índice y de la tarjeta de la barra lateral"},{"n":"Texto/Chico","tam":"chico","peso":"normal","lh":1.55,"tr":0,"d":".cl-nota y resúmenes de tarjeta"},{"n":"Texto/Nota","tam":"nota","peso":"normal","lh":1.45,"tr":0,"d":"Metadatos, pies, ayudas"},{"n":"Texto/Nota media","tam":"nota","peso":"medio","lh":1.35,"tr":0,"d":"Migas, rótulo de campo, control segmentado"},{"n":"Texto/Mini","tam":"mini","peso":"normal","lh":1.35,"tr":0,"d":".cl-mini"},{"n":"Texto/Micro","tam":"micro","peso":"normal","lh":1.45,"tr":0,"d":"La ayuda bajo un campo"},{"n":"Rótulo/Rótulo","tam":"rotulo","peso":"negrita","lh":1.2,"tr":0.1,"mayus":true,"d":".cl-rotulo: grupos, cabeceras de tabla"},{"n":"Rótulo/Etiqueta","tam":"etiqueta","peso":"negrita","lh":1.2,"tr":0.1,"mayus":true,"d":".cl-etiqueta"},{"n":"Rótulo/Insignia","tam":"etiqueta","peso":"negrita","lh":1.2,"tr":0.08,"mayus":true,"d":".cl-insignia"},{"n":"Control/Botón","tam":"ui","peso":"semi","lh":1,"tr":0,"d":".cl-boton"},{"n":"Control/Botón chico","tam":"nota","peso":"semi","lh":1,"tr":0,"d":".cl-boton-chico"},{"n":"Control/Botón grande","tam":"cuerpo","peso":"semi","lh":1,"tr":0,"d":".cl-boton-grande"},{"n":"Cifra/Dato clave","tam":30,"peso":"extra","lh":1.1,"tr":-0.03,"d":".cl-dato-clave b"},{"n":"Código/Código","fam":"fuente-mono","tam":"mini","peso":"normal","lh":1.55,"tr":0,"d":".cl-mono, .cl-codigo"}],"sombras":[{"n":"Sombra/1 · reposo","d":"La de reposo: controles y tarjetas. var(--cl-sombra-1)","x":0,"y":1,"desenfoque":2,"extension":0,"color":{"v":"Tema:sombra/sombra-1-color"}},{"n":"Sombra/2 · al apuntar","d":"Tarjeta al pasar por encima. var(--cl-sombra-2)","x":0,"y":{"v":"Tema:sombra/sombra-2-y"},"desenfoque":{"v":"Tema:sombra/sombra-2-desenfoque"},"extension":{"v":"Tema:sombra/sombra-2-extension"},"color":{"v":"Tema:sombra/sombra-2-color"}},{"n":"Sombra/3 · flotante","d":"Menús, ventanas y avisos flotantes. var(--cl-sombra-3)","x":0,"y":18,"desenfoque":40,"extension":-14,"color":{"v":"Tema:sombra/sombra-3-color"}},{"n":"Sombra/Marca","d":"Botones con degradado. var(--cl-sombra-marca)","x":0,"y":4,"desenfoque":14,"extension":0,"color":"rgba(108,85,246,.39)"},{"n":"Sombra/Marca · al apuntar","d":"var(--cl-sombra-marca-2)","x":0,"y":6,"desenfoque":20,"extension":0,"color":"rgba(108,85,246,.5)"},{"n":"Foco/Campo","d":"El anillo de foco de campos y controles: 0 0 0 3px var(--cl-foco).","x":0,"y":0,"desenfoque":0,"extension":3,"color":{"v":"Tema:acento/foco"}}],"degradados":[{"n":"Degradado/Marca","d":"El nombre de la marca en un titular. var(--cl-grad-marca)","paradas":["secondary/500","primary/500","secondary2/500"]},{"n":"Degradado/Explorar","d":"El botón principal. var(--cl-grad-explorar)","paradas":["primary/500","secondary/500"]},{"n":"Degradado/Apoyo","d":"Apoyar, donar: la invitación. var(--cl-grad-apoyo)","paradas":["primary/500","secondary2/500"]}]};
const color = (s) => {
  if (s[0] === '#') { const h = s.slice(1); return { r: parseInt(h.slice(0, 2), 16) / 255, g: parseInt(h.slice(2, 4), 16) / 255, b: parseInt(h.slice(4, 6), 16) / 255, a: 1 }; }
  const p = s.match(/[\d.]+/g).map(Number);
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
