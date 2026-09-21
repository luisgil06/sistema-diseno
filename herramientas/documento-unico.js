#!/usr/bin/env node
/*
 * Empaqueta una página de docs/ en un solo HTML: hoja, fuentes, imágenes,
 * iconos y guiones dentro. Sirve para abrirla con doble clic (Chrome no
 * carga fuentes desde file:// por separado) y para compartirla.
 *
 *   node herramientas/documento-unico.js [pagina] [salida] [--fragmento] [--enlace archivo=url …]
 *
 *   pagina       index.html (por omisión) o ejemplo.html
 *   salida       por omisión docs/unico/documentacion.html o docs/unico/ejemplo.html
 *   --fragmento  sin <!DOCTYPE>, <html>, <head> ni <body>: para un sitio
 *                que pone el esqueleto por su cuenta. El sistema cuelga
 *                entonces de un <div class="cl">.
 *   --titulo     otro título para la pestaña
 *   --enlace     cambia un enlace relativo por otra dirección, p. ej.
 *                --enlace ejemplo.html=https://…
 */
'use strict';
const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const fragmento = args.includes('--fragmento');
const enlaces = {};
let tituloPedido = '';
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--enlace') { const [a, b] = args[i + 1].split(/=(.*)/s); enlaces[a] = b; }
  if (args[i] === '--titulo') tituloPedido = args[i + 1];
}
const sueltos = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--enlace' && args[i - 1] !== '--titulo');
const pagina = sueltos[0] || 'index.html';
const salida = sueltos[1] || path.join('docs', 'unico', pagina === 'index.html' ? 'documentacion.html' : pagina);

const leer = (r) => fs.readFileSync(path.join(RAIZ, r), 'utf8');
const datos = (r, tipo) => 'data:' + tipo + ';base64,' + fs.readFileSync(path.join(RAIZ, r)).toString('base64');
const TIPOS = { '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml' };

/* La hoja, con las fuentes dentro. */
let css = leer('dist/codelibri.css').replace(/url\("fuentes\/([^"]+)"\)/g, (_, f) => 'url("' + datos('dist/fuentes/' + f, 'font/woff2') + '")');
if (pagina === 'index.html') css += '\n' + leer('docs/docs.css');
const html = leer('docs/' + pagina);
const estiloPropio = (html.match(/<style>([\s\S]*?)<\/style>/) || [, ''])[1];
css += '\n' + estiloPropio;
/* Lo que exige vivir dentro de otro esqueleto: el fondo del <body> propio
   y las barras fijas por debajo de la muesca de un teléfono. */
css += '\nbody{margin:0;background:#fafbfc}html[data-theme="dark"] body{background:#141416}'
  + '@media (prefers-color-scheme:dark){html:not([data-theme="light"]) body{background:#141416}}'
  + '.cl .cl-superior,.cl .cl-lat{top:env(safe-area-inset-top,0px)}\n';

/* Los atributos de <html> de la página: se conservan en el documento
   completo; en el fragmento pasan al <div class="cl"> (acento) o los pone
   el guion (clave). */
const atributosHtml = (html.match(/<html([^>]*)>/) || [, ''])[1];
const acento = (atributosHtml.match(/data-acento="([^"]+)"/) || [, ''])[1];
const clave = (atributosHtml.match(/data-cl-clave="([^"]+)"/) || [, 'cl'])[1];
const titulo = tituloPedido || (html.match(/<title>([\s\S]*?)<\/title>/) || [, 'Sistema de diseño CodeLibri'])[1];

/* El cuerpo, sin los guiones externos, con imágenes y enlaces resueltos. */
let cuerpo = html.match(/<body[^>]*>([\s\S]*)<\/body>/)[1]
  .replace(/<script src="[^"]*"><\/script>\s*/g, '')
  .replace(/src="img\/([^"]+)"/g, (_, f) => 'src="' + datos('docs/img/' + f, TIPOS[path.extname(f)]) + '"');
for (const [a, b] of Object.entries(enlaces)) cuerpo = cuerpo.split('href="' + a + '"').join('href="' + b + '"');

/* El sprite en la propia página, así <use href="#cl-…"> no depende de nada. */
const sprite = leer('dist/iconos.svg').replace('<svg ', '<svg aria-hidden="true" style="display:none" ');

/* El tema: el que se eligió aquí; si no, el que marque el sitio que la
   aloja; si no, el del sistema operativo. */
const cabeza = '(function(r){try{r.setAttribute("data-cl-clave","' + clave + '");var q=new URLSearchParams(location.search),'
  + 'g=localStorage.getItem("' + clave + '-tema"),t=q.get("tema")||g,l=localStorage.getItem("' + clave + '-lat"),'
  + 'a=q.get("acento")||localStorage.getItem("' + clave + '-acento");'
  + 'if(t)r.setAttribute("data-theme",t);else if(!r.getAttribute("data-theme")&&window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches)r.setAttribute("data-theme","dark");'
  + (pagina === 'index.html' ? 'if(a)r.setAttribute("data-acento",a);' : '')
  + 'if(l==="plegada")r.classList.add("cl-lat-plegada")}catch(e){}})(document.documentElement);';

const guiones = (pagina === 'index.html' ? [leer('docs/tokens.js'), leer('docs/docs.js')] : []).concat(leer('dist/codelibri.js'))
  .map((g) => '<script>' + g.replace(/<\/script/gi, '<\\/script') + '</script>').join('\n');

const envoltura = fragmento
  ? '<title>' + titulo + '</title>\n<style>' + css + '</style>\n<script>' + cabeza + '</script>\n'
    + '<div class="cl"' + (acento ? ' data-acento="' + acento + '"' : '') + '>\n' + sprite + cuerpo + '</div>\n' + guiones + '\n'
  : '<!DOCTYPE html>\n<html' + atributosHtml.replace(/\s*data-cl-iconos="[^"]*"/, '') + '>\n<head>\n<meta charset="UTF-8">\n'
    + '<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>' + titulo + '</title>\n'
    + '<script>' + cabeza + '</script>\n<style>' + css + '</style>\n</head>\n<body class="cl">\n' + sprite + cuerpo + guiones + '\n</body>\n</html>\n';

const destino = path.isAbsolute(salida) ? salida : path.join(RAIZ, salida);
fs.mkdirSync(path.dirname(destino), { recursive: true });
fs.writeFileSync(destino, envoltura);
console.log(path.relative(RAIZ, destino) + '  ' + (fs.statSync(destino).size / 1024).toFixed(0) + ' KB' + (fragmento ? '  (fragmento)' : ''));
