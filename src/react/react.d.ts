/* Sistema de diseño CodeLibri __VERSION__ · componentes para React. */
import type { MouseEventHandler, ReactElement, ReactNode, SVGProps } from 'react';
import type { NombreIcono } from './iconos.js';
import type { IdProducto, Idioma } from './ecosistema.js';

export interface PropsIcono extends Omit<SVGProps<SVGSVGElement>, 'children' | 'dangerouslySetInnerHTML'> {
  /** El nombre del icono en el sistema: "buscar", "marcador", "subir"… */
  nombre: NombreIcono;
  /** Ancho y alto en píxeles. Por omisión, 20. */
  tam?: number | string;
  /** Si el icono tiene que anunciarse, lo que dirá el lector de pantalla. */
  titulo?: string;
}

/** Un icono del sistema: <Icono nombre="buscar" />. */
export declare function Icono(props: PropsIcono): ReactElement | null;

export interface PropsMenuEcosistema {
  /** El producto que lleva el menú: no se enseña a sí mismo. */
  actual: IdProducto | string;
  /** El idioma de los textos y de las notas. Por omisión, "es". */
  idioma?: Idioma | string;
  /** El texto del botón. Por omisión, «Ecosistema» o «Ecosystem». */
  rotulo?: string;
  /** El rótulo de arriba del menú. Por omisión, «Ecosistema CodeLibri». */
  titulo?: string;
  /** El botón en su tamaño chico (cl-boton-chico). Por omisión, sí. */
  chico?: boolean;
  /** Abre el menú hacia la derecha, para un botón pegado al borde izquierdo. */
  izquierda?: boolean;
  /** Una clase más para el ancla (cl-menu-ancla). */
  className?: string;
  /** Una clase para el texto del botón: para esconderlo a la vista en el teléfono. */
  rotuloClassName?: string;
}

/** El botón «Ecosistema» con su menú de productos de CodeLibri. */
export declare function MenuEcosistema(props: PropsMenuEcosistema): ReactElement | null;

export interface EnlacePie {
  texto: ReactNode;
  icono?: NombreIcono;
  /** Con dirección es un enlace; sin ella, un botón con su onClick. */
  href?: string;
  /** Abre la dirección en otra pestaña y lo avisa al lector de pantalla. */
  externo?: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
}

export interface ColumnaPie {
  titulo: ReactNode;
  enlaces: EnlacePie[];
}

export interface PropsPieSitio {
  /** El producto que lleva el pie: no sale en la columna del ecosistema. */
  actual: IdProducto | string;
  /** El idioma de los textos y de las notas. Por omisión, "es". */
  idioma?: Idioma | string;
  /** La primera columna: logo, frase y, si va, su botón. */
  marca?: ReactNode;
  /** Las columnas propias del producto, antes de la del ecosistema. */
  columnas?: ColumnaPie[];
  /** Lo que va en la franja de abajo. Por omisión, «© año CodeLibri». */
  franja?: ReactNode;
  /** La columna del ecosistema. Por omisión, sí. */
  ecosistema?: boolean;
  /** El rótulo de esa columna. Por omisión, «Ecosistema CodeLibri». */
  tituloEcosistema?: ReactNode;
  className?: string;
}

/** El pie de sitio (cl-pie-sitio), con la columna del ecosistema. */
export declare function PieSitio(props: PropsPieSitio): ReactElement;

export default Icono;
