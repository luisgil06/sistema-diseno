/* Sistema de diseño CodeLibri 0.9.0 · generado por herramientas/compilar.js; no se edita.
   La fuente es ecosistema/ecosistema.json. */
import type { NombreIcono } from './iconos';
export type IdProducto = "aula" | "epub-reader" | "bloques-html" | "guia-sat" | "codelibri";
export interface Producto {
  readonly id: IdProducto;
  readonly nombre: string;
  readonly nota: string;
  /** Vacía mientras el producto no está publicado: entonces no se enseña. */
  readonly url: string;
  readonly icono: NombreIcono;
  /** La clase de la rampa categórica que le da su color: cl-cat-1 a cl-cat-10. */
  readonly tono: string;
}
export declare const ecosistema: readonly Producto[];
export declare function ecosistemaDesde(actual?: IdProducto | string): Producto[];
export default ecosistema;
