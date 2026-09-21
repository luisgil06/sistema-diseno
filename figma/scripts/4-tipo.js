/* Generado por herramientas/figma.js desde tokens.json · versión 0.1.0. No se edita. */
const D = {"coleccion":"Tipo","modos":["Valor"],"variables":[{"n":"fuente/fuente","t":"STRING","v":["Inter"],"s":["FONT_FAMILY"],"w":"var(--cl-fuente)"},{"n":"fuente/fuente-mono","t":"STRING","v":["Cascadia Code"],"s":["FONT_FAMILY"],"w":"var(--cl-fuente-mono)"},{"n":"tamano/display","t":"FLOAT","v":[54],"s":["FONT_SIZE"],"w":"var(--cl-t-display)","d":"El titular de una portada. En código: clamp(38px, 4.2vw, 54px); aquí, el tamaño mayor."},{"n":"tamano/titulo","t":"FLOAT","v":[32],"s":["FONT_SIZE"],"w":"var(--cl-t-titulo)","d":"El título de una página interior. En código: clamp(24px, 2.4vw, 32px); aquí, el tamaño mayor."},{"n":"tamano/encabezado","t":"FLOAT","v":[26],"s":["FONT_SIZE"],"w":"var(--cl-t-encabezado)","d":"El título de una ficha o de una caja."},{"n":"tamano/seccion","t":"FLOAT","v":[20],"s":["FONT_SIZE"],"w":"var(--cl-t-seccion)","d":"El título de una sección o de una ventana."},{"n":"tamano/subseccion","t":"FLOAT","v":[17],"s":["FONT_SIZE"],"w":"var(--cl-t-subseccion)","d":"Subtítulos y la entrada de una portada."},{"n":"tamano/tarjeta","t":"FLOAT","v":[16.5],"s":["FONT_SIZE"],"w":"var(--cl-t-tarjeta)","d":"El título dentro de una tarjeta."},{"n":"tamano/cuerpo","t":"FLOAT","v":[15],"s":["FONT_SIZE"],"w":"var(--cl-t-cuerpo)","d":"Texto de lectura."},{"n":"tamano/ui","t":"FLOAT","v":[14],"s":["FONT_SIZE"],"w":"var(--cl-t-ui)","d":"Controles, navegación, texto de interfaz."},{"n":"tamano/chico","t":"FLOAT","v":[13.5],"s":["FONT_SIZE"],"w":"var(--cl-t-chico)","d":"Resúmenes de tarjeta y notas."},{"n":"tamano/nota","t":"FLOAT","v":[13],"s":["FONT_SIZE"],"w":"var(--cl-t-nota)","d":"Metadatos, pies, ayudas."},{"n":"tamano/mini","t":"FLOAT","v":[12.5],"s":["FONT_SIZE"],"w":"var(--cl-t-mini)","d":"Aclaraciones bajo un campo, código."},{"n":"tamano/micro","t":"FLOAT","v":[12],"s":["FONT_SIZE"],"w":"var(--cl-t-micro)","d":""},{"n":"tamano/rotulo","t":"FLOAT","v":[11],"s":["FONT_SIZE"],"w":"var(--cl-t-rotulo)","d":"Rótulos de grupo en mayúsculas."},{"n":"tamano/etiqueta","t":"FLOAT","v":[10],"s":["FONT_SIZE"],"w":"var(--cl-t-etiqueta)","d":"Etiquetas e insignias en mayúsculas."},{"n":"peso/normal","t":"STRING","v":["Regular"],"s":["FONT_STYLE"],"w":"var(--cl-peso-normal)","d":"400"},{"n":"peso/medio","t":"STRING","v":["Medium"],"s":["FONT_STYLE"],"w":"var(--cl-peso-medio)","d":"500"},{"n":"peso/semi","t":"STRING","v":["Semi Bold"],"s":["FONT_STYLE"],"w":"var(--cl-peso-semi)","d":"600"},{"n":"peso/negrita","t":"STRING","v":["Bold"],"s":["FONT_STYLE"],"w":"var(--cl-peso-negrita)","d":"700"},{"n":"peso/extra","t":"STRING","v":["Extra Bold"],"s":["FONT_STYLE"],"w":"var(--cl-peso-extra)","d":"800"}]};
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
