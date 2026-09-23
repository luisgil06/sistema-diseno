/* Sistema de diseño CodeLibri 0.5.0 · componentes para React. */
import type { ReactElement, SVGProps } from 'react';
import type { NombreIcono } from './iconos.js';

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
export default Icono;
