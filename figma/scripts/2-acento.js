/* Generado por herramientas/figma.js desde tokens.json · versión 0.4.0. No se edita. */
const D = {"coleccion":"Acento","modos":["primary","secondary","secondary2"],"variables":[{"n":"a/50","t":"COLOR","v":[{"a":"Paleta:primary/50"},{"a":"Paleta:secondary/50"},{"a":"Paleta:secondary2/50"}],"s":[],"w":"var(--cl-a-50)"},{"n":"a/100","t":"COLOR","v":[{"a":"Paleta:primary/100"},{"a":"Paleta:secondary/100"},{"a":"Paleta:secondary2/100"}],"s":[],"w":"var(--cl-a-100)"},{"n":"a/200","t":"COLOR","v":[{"a":"Paleta:primary/200"},{"a":"Paleta:secondary/200"},{"a":"Paleta:secondary2/200"}],"s":[],"w":"var(--cl-a-200)"},{"n":"a/300","t":"COLOR","v":[{"a":"Paleta:primary/300"},{"a":"Paleta:secondary/300"},{"a":"Paleta:secondary2/300"}],"s":[],"w":"var(--cl-a-300)"},{"n":"a/400","t":"COLOR","v":[{"a":"Paleta:primary/400"},{"a":"Paleta:secondary/400"},{"a":"Paleta:secondary2/400"}],"s":[],"w":"var(--cl-a-400)"},{"n":"a/500","t":"COLOR","v":[{"a":"Paleta:primary/500"},{"a":"Paleta:secondary/500"},{"a":"Paleta:secondary2/500"}],"s":[],"w":"var(--cl-a-500)"},{"n":"a/600","t":"COLOR","v":[{"a":"Paleta:primary/600"},{"a":"Paleta:secondary/600"},{"a":"Paleta:secondary2/600"}],"s":[],"w":"var(--cl-a-600)"},{"n":"a/700","t":"COLOR","v":[{"a":"Paleta:primary/700"},{"a":"Paleta:secondary/700"},{"a":"Paleta:secondary2/700"}],"s":[],"w":"var(--cl-a-700)"},{"n":"a/800","t":"COLOR","v":[{"a":"Paleta:primary/800"},{"a":"Paleta:secondary/800"},{"a":"Paleta:secondary2/800"}],"s":[],"w":"var(--cl-a-800)"},{"n":"a/900","t":"COLOR","v":[{"a":"Paleta:primary/900"},{"a":"Paleta:secondary/900"},{"a":"Paleta:secondary2/900"}],"s":[],"w":"var(--cl-a-900)"},{"n":"a/texto-claro","t":"COLOR","v":[{"a":"Paleta:primary/600"},{"a":"Paleta:secondary/900"},{"a":"Paleta:secondary2/700"}],"s":[],"w":"var(--cl-a-texto-claro)","d":"El paso de texto del acento en el tema claro."},{"n":"a/texto-oscuro","t":"COLOR","v":[{"a":"Paleta:primary/300"},{"a":"Paleta:secondary/400"},{"a":"Paleta:secondary2/300"}],"s":[],"w":"var(--cl-a-texto-oscuro)","d":"El paso de texto del acento en el tema oscuro."},{"n":"a/sobre","t":"COLOR","v":["#ffffff",{"a":"Paleta:text/900"},{"a":"Paleta:text/900"}],"s":[],"w":"var(--cl-a-sobre)","d":"Texto sobre el paso 500 del acento."},{"n":"a/suave-claro","t":"COLOR","v":["rgba(108,85,246,0.1)","rgba(21,238,202,0.1)","rgba(255,68,140,0.1)"],"s":[],"w":"color-mix(in srgb, var(--cl-a-500) 10%, transparent)","d":"Lo que --cl-acento-suave vale en el tema claro."},{"n":"a/suave-oscuro","t":"COLOR","v":["rgba(108,85,246,0.16)","rgba(21,238,202,0.16)","rgba(255,68,140,0.16)"],"s":[],"w":"color-mix(in srgb, var(--cl-a-500) 16%, transparent)","d":"Lo que --cl-acento-suave vale en el tema oscuro."},{"n":"a/linea-claro","t":"COLOR","v":["rgba(108,85,246,0.22)","rgba(21,238,202,0.22)","rgba(255,68,140,0.22)"],"s":[],"w":"color-mix(in srgb, var(--cl-a-500) 22%, transparent)","d":"Lo que --cl-acento-linea vale en el tema claro."},{"n":"a/linea-oscuro","t":"COLOR","v":["rgba(108,85,246,0.32)","rgba(21,238,202,0.32)","rgba(255,68,140,0.32)"],"s":[],"w":"color-mix(in srgb, var(--cl-a-500) 32%, transparent)","d":"Lo que --cl-acento-linea vale en el tema oscuro."},{"n":"a/foco-claro","t":"COLOR","v":["rgba(108,85,246,0.3)","rgba(21,238,202,0.3)","rgba(255,68,140,0.3)"],"s":[],"w":"color-mix(in srgb, var(--cl-a-500) 30%, transparent)","d":"Lo que --cl-foco vale en el tema claro."},{"n":"a/foco-oscuro","t":"COLOR","v":["rgba(137,119,248,0.45)","rgba(68,241,213,0.45)","rgba(255,105,163,0.45)"],"s":[],"w":"color-mix(in srgb, var(--cl-a-400) 45%, transparent)","d":"Lo que --cl-foco vale en el tema oscuro."}]};
const color = (s) => {
  if (s === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
  if (s[0] === '#') { const h = s.slice(1); return { r: parseInt(h.slice(0, 2), 16) / 255, g: parseInt(h.slice(2, 4), 16) / 255, b: parseInt(h.slice(4, 6), 16) / 255, a: 1 }; }
  const p = s.match(/[\d.]+/g).map(Number);
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
