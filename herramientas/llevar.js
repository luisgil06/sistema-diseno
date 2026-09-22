#!/usr/bin/env node
/*
 * Sistema de diseño CodeLibri · llevar una versión a un producto
 *
 *   node herramientas/llevar.js "<carpeta del producto>" [--carpeta src/sistema] [--borrador]
 *
 * Compila y copia dist/ entero dentro del producto, en una carpeta que es
 * solo del sistema, y deja al lado SISTEMA.json con la versión, el commit y
 * la huella de cada archivo. El producto se compila luego con eso dentro:
 * no instala nada ni le pide nada a GitHub. Por eso sirve con Hostinger, que
 * compila en su servidor y no tiene acceso a un repositorio privado.
 *
 * Una versión que se lleva tiene que existir en git: el sistema sin cambios
 * pendientes y con la etiqueta v<versión> en el commit actual. Para probar
 * antes de etiquetar está --borrador, y SISTEMA.json lo dice.
 *
 * La carpeta de destino se vacía y se vuelve a llenar, pero solo si es del
 * sistema (tiene SISTEMA.json) o no existe: nunca pisa una carpeta ajena.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const RAIZ = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const opcion = (nombre, porOmision) => {
  const i = args.indexOf('--' + nombre);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : porOmision;
};
const producto = args.find((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1] === '--carpeta'));
const carpeta = opcion('carpeta', 'src/sistema');
const borrador = args.includes('--borrador');

function falla(msg) { console.error('\n  ✕ ' + msg + '\n'); process.exit(1); }
const git = (...a) => execFileSync('git', a, { cwd: RAIZ, encoding: 'utf8' }).trim();

if (!producto) falla('Falta la carpeta del producto: node herramientas/llevar.js "<carpeta>"');
const base = path.resolve(producto);
if (!fs.existsSync(base) || !fs.statSync(base).isDirectory()) falla('No existe la carpeta del producto: ' + base);
const destino = path.resolve(base, carpeta);
if (!destino.startsWith(base + path.sep)) falla('La carpeta de destino tiene que quedar dentro del producto.');

/* ── el sistema, en git ── */
const version = JSON.parse(fs.readFileSync(path.join(RAIZ, 'tokens/tokens.json'), 'utf8')).version;
const pendientes = git('status', '--porcelain');
const commit = git('rev-parse', '--short', 'HEAD');
let etiqueta = '';
try { etiqueta = git('describe', '--tags', '--exact-match', 'HEAD'); } catch (e) { /* sin etiqueta */ }
if (!borrador) {
  if (pendientes) falla('El sistema tiene cambios sin commit. Una versión que se lleva tiene que existir en git.\n    Para probar sin etiquetar: --borrador');
  if (etiqueta !== 'v' + version) falla('El commit actual no lleva la etiqueta v' + version + (etiqueta ? ' (lleva ' + etiqueta + ')' : '') + '.\n    Para probar sin etiquetar: --borrador');
}

/* ── compilar: si el contraste falla, no se lleva nada ── */
execFileSync(process.execPath, [path.join(__dirname, 'compilar.js')], { cwd: RAIZ, stdio: 'inherit' });

/* ── vaciar el destino, solo si es del sistema ── */
if (fs.existsSync(destino)) {
  const marca = path.join(destino, 'SISTEMA.json');
  if (!fs.existsSync(marca) && fs.readdirSync(destino).length) falla('La carpeta ' + carpeta + ' existe y no es del sistema (no tiene SISTEMA.json). No la toco.');
  fs.rmSync(destino, { recursive: true, force: true });
}

/* ── copiar dist/ ── */
const DIST = path.join(RAIZ, 'dist');
const huellas = {};
(function copiar(dir) {
  for (const f of fs.readdirSync(dir)) {
    const origen = path.join(dir, f);
    const rel = path.relative(DIST, origen).split(path.sep).join('/');
    if (fs.statSync(origen).isDirectory()) { copiar(origen); continue; }
    const dest = path.join(destino, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(origen, dest);
    huellas[rel] = crypto.createHash('sha256').update(fs.readFileSync(origen)).digest('hex').slice(0, 12);
  }
})(DIST);

const ficha = {
  sistema: 'Sistema de diseño CodeLibri',
  version,
  etiqueta: etiqueta || null,
  commit,
  borrador,
  fecha: new Date().toISOString().slice(0, 10),
  aviso: 'Copia generada con herramientas/llevar.js del repositorio sistema-diseno. No se edita: se cambia allí y se vuelve a llevar.',
  archivos: huellas,
};
fs.writeFileSync(path.join(destino, 'SISTEMA.json'), JSON.stringify(ficha, null, 2) + '\n');

console.log('\n  Llevado: Sistema de diseño CodeLibri ' + version + (borrador ? '  (BORRADOR, sin etiqueta)' : '  (' + etiqueta + ')'));
console.log('  Commit : ' + commit + (pendientes ? ' + cambios sin commit' : ''));
console.log('  Destino: ' + destino);
console.log('  Archivos: ' + Object.keys(huellas).length + '\n');
