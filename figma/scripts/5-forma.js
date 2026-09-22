/* Generado por herramientas/figma.js desde tokens.json · versión 0.3.0. No se edita. */
const D = {"coleccion":"Forma","modos":["Valor"],"variables":[{"n":"espacio/1","t":"FLOAT","v":[4],"s":["GAP"],"w":"var(--cl-e-1)"},{"n":"espacio/2","t":"FLOAT","v":[8],"s":["GAP"],"w":"var(--cl-e-2)"},{"n":"espacio/3","t":"FLOAT","v":[12],"s":["GAP"],"w":"var(--cl-e-3)"},{"n":"espacio/4","t":"FLOAT","v":[16],"s":["GAP"],"w":"var(--cl-e-4)"},{"n":"espacio/5","t":"FLOAT","v":[20],"s":["GAP"],"w":"var(--cl-e-5)"},{"n":"espacio/6","t":"FLOAT","v":[24],"s":["GAP"],"w":"var(--cl-e-6)"},{"n":"espacio/7","t":"FLOAT","v":[32],"s":["GAP"],"w":"var(--cl-e-7)"},{"n":"espacio/8","t":"FLOAT","v":[40],"s":["GAP"],"w":"var(--cl-e-8)"},{"n":"espacio/9","t":"FLOAT","v":[52],"s":["GAP"],"w":"var(--cl-e-9)"},{"n":"espacio/10","t":"FLOAT","v":[64],"s":["GAP"],"w":"var(--cl-e-10)"},{"n":"radio/chico","t":"FLOAT","v":[6],"s":["CORNER_RADIUS"],"w":"var(--cl-r-chico)"},{"n":"radio/control","t":"FLOAT","v":[8],"s":["CORNER_RADIUS"],"w":"var(--cl-r-control)"},{"n":"radio/medio","t":"FLOAT","v":[12],"s":["CORNER_RADIUS"],"w":"var(--cl-r-medio)"},{"n":"radio/grande","t":"FLOAT","v":[16],"s":["CORNER_RADIUS"],"w":"var(--cl-r-grande)"},{"n":"radio/pildora","t":"FLOAT","v":[999],"s":["CORNER_RADIUS"],"w":"var(--cl-r-pildora)"},{"n":"armazon/lateral","t":"FLOAT","v":[290],"s":["WIDTH_HEIGHT"],"w":"var(--cl-lateral)","d":""},{"n":"armazon/lateral-plegada","t":"FLOAT","v":[76],"s":["WIDTH_HEIGHT"],"w":"var(--cl-lateral-plegada)","d":""},{"n":"armazon/alto-superior","t":"FLOAT","v":[72],"s":["WIDTH_HEIGHT"],"w":"var(--cl-alto-superior)","d":""},{"n":"armazon/alto-superior-estrecho","t":"FLOAT","v":[60],"s":["WIDTH_HEIGHT"],"w":"var(--cl-alto-superior-estrecho)","d":""}]};
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
