/* Sistema de diseño CodeLibri 0.12.0 · generado por herramientas/compilar.js; no se edita.
   La fuente es ecosistema/ecosistema.json. */
export const ecosistema = [
  {
    "id": "codelibri",
    "nombre": "CodeLibri",
    "nota": "El estudio: servicios, tienda y contacto",
    "url": "https://codelibri.com.mx",
    "icono": "tienda",
    "tono": "cl-cat-8",
    "idiomas": {
      "en": {
        "nota": "The studio: services, shop and contact"
      }
    },
    "colores": {
      "claro": "#624de0",
      "oscuro": "#9d8df9"
    }
  },
  {
    "id": "aula",
    "nombre": "Aula",
    "nota": "Presentaciones y material de clase de diseño",
    "url": "https://aula.codelibri.com.mx",
    "icono": "birrete",
    "tono": "cl-cat-9",
    "idiomas": {
      "en": {
        "nota": "Design presentations and course materials"
      }
    },
    "colores": {
      "claro": "#9f2fb0",
      "oscuro": "#db7bea"
    }
  },
  {
    "id": "guia-sat",
    "nombre": "Guía SAT",
    "nota": "Trámites del SAT paso a paso, con IA",
    "url": "https://guia-sat.codelibri.com.mx",
    "icono": "recibo",
    "tono": "cl-cat-2",
    "idiomas": {
      "en": {
        "nota": "Mexican tax (SAT) procedures step by step, with AI"
      }
    },
    "colores": {
      "claro": "#a35714",
      "oscuro": "#f3a968"
    }
  },
  {
    "id": "bloques-html",
    "nombre": "Bloques HTML",
    "nota": "Componentes listos para copiar y adaptar",
    "url": "https://bloques-html.codelibri.com.mx",
    "icono": "bloques",
    "tono": "cl-cat-4",
    "idiomas": {
      "en": {
        "nota": "Ready-made components to copy and adapt"
      }
    },
    "colores": {
      "claro": "#157a4a",
      "oscuro": "#6ee8af"
    }
  },
  {
    "id": "epub-reader",
    "nombre": "EPUB Reader",
    "nota": "El lector de libros digitales",
    "url": "https://epub-reader.codelibri.com.mx",
    "icono": "libro",
    "tono": "cl-cat-6",
    "idiomas": {
      "en": {
        "nota": "The digital book reader"
      }
    },
    "colores": {
      "claro": "#097295",
      "oscuro": "#66d1f5"
    }
  }
];
/** Los productos que enseña «actual»: los demás, y solo los que tienen dirección.
    Con «idioma» ("en"), el nombre y la nota salen en ese idioma si los tiene. */
export function ecosistemaDesde(actual, idioma) {
  return ecosistema.filter((p) => p.id !== actual && p.url).map((p) => {
    const t = idioma && p.idiomas && p.idiomas[idioma];
    return t ? { ...p, nombre: t.nombre || p.nombre, nota: t.nota || p.nota } : p;
  });
}
export default ecosistema;
