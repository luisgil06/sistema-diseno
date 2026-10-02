/* Sistema de diseño CodeLibri 0.9.0 · generado por herramientas/compilar.js; no se edita.
   La fuente es ecosistema/ecosistema.json. */
export const ecosistema = [
  {
    "id": "aula",
    "nombre": "Aula",
    "nota": "Presentaciones y material de clase de diseño",
    "url": "https://learn.codelibri.com.mx",
    "icono": "birrete",
    "tono": "cl-cat-8"
  },
  {
    "id": "epub-reader",
    "nombre": "EPUB Reader",
    "nota": "El lector de libros digitales",
    "url": "https://epub-reader.codelibri.com.mx",
    "icono": "libro",
    "tono": "cl-cat-6"
  },
  {
    "id": "bloques-html",
    "nombre": "Bloques HTML",
    "nota": "Componentes listos para copiar y adaptar",
    "url": "https://bloques-html.codelibri.com.mx",
    "icono": "bloques",
    "tono": "cl-cat-4"
  },
  {
    "id": "guia-sat",
    "nombre": "Guía SAT",
    "nota": "Trámites del SAT paso a paso, con IA",
    "url": "https://guia-sat.codelibri.com.mx",
    "icono": "recibo",
    "tono": "cl-cat-2"
  },
  {
    "id": "codelibri",
    "nombre": "CodeLibri",
    "nota": "El estudio: servicios, tienda y contacto",
    "url": "https://codelibri.com.mx",
    "icono": "tienda",
    "tono": "cl-cat-10"
  }
];
/** Los productos que enseña «actual»: los demás, y solo los que tienen dirección. */
export function ecosistemaDesde(actual) { return ecosistema.filter((p) => p.id !== actual && p.url); }
export default ecosistema;
