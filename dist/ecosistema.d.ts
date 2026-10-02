/* Sistema de diseño CodeLibri 0.10.2 · generado por herramientas/compilar.js; no se edita.
   La fuente es ecosistema/ecosistema.json. */
import type { NombreIcono } from './iconos';
export type IdProducto = "codelibri" | "aula" | "guia-sat" | "bloques-html" | "epub-reader";
export interface Producto {
  readonly id: IdProducto;
  readonly nombre: string;
  readonly nota: string;
  /** Vacía mientras el producto no está publicado: entonces no se enseña. */
  readonly url: string;
  readonly icono: NombreIcono;
  /** La clase de la rampa categórica que le da su color: cl-cat-1 a cl-cat-10. */
  readonly tono: string;
  /** Ese color ya resuelto, para quien no carga la hoja (el Aula, WordPress): el
      dibujo va en este color y el fondo del recuadro en él mismo al 10%. */
  readonly colores: { readonly claro: string; readonly oscuro: string };
}
export declare const ecosistema: readonly Producto[];
export declare function ecosistemaDesde(actual?: IdProducto | string): Producto[];
export default ecosistema;
