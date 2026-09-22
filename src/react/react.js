/* Sistema de diseño CodeLibri __VERSION__ · componentes para React.
   Se importa como '@codelibri/sistema/react'. React no viene con el sistema:
   lo pone el producto (es una dependencia «peer»). */
import { createElement } from 'react';
import { iconos } from './iconos.js';

/**
 * Un icono del sistema: <Icono nombre="buscar" />.
 *
 * Toma el color del texto que lo rodea (currentColor) y mide 20 px si no se
 * dice otra cosa. Sin «titulo» es decorativo y el lector de pantalla lo
 * salta; con «titulo» se anuncia, para cuando el icono va solo en un botón
 * que no lleva aria-label. El trazo va también en atributos, así que se ve
 * bien aunque el icono quede fuera de .cl.
 */
export function Icono({ nombre, tam = 20, titulo, className, ...resto }) {
  const icono = iconos[nombre];
  if (!icono) return null;
  const accesible = titulo ? { role: 'img', 'aria-label': titulo } : { 'aria-hidden': true };
  return createElement('svg', {
    viewBox: '0 0 24 24',
    width: tam,
    height: tam,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    focusable: 'false',
    className: 'cl-ico' + (className ? ' ' + className : ''),
    ...accesible,
    ...resto,
    dangerouslySetInnerHTML: { __html: icono.trazo },
  });
}

export default Icono;
