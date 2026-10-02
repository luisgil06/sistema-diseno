/* Sistema de diseño CodeLibri 0.11.0 · componentes para React.
   Se importa como '@codelibri/sistema/react'. React no viene con el sistema:
   lo pone el producto (es una dependencia «peer»). */
import { createElement, useEffect, useId, useRef, useState } from 'react';
import { iconos } from './iconos.js';
import { ecosistemaDesde } from './ecosistema.js';

const h = createElement;

/* Los textos fijos de los componentes, en los idiomas que el sistema conoce.
   Un idioma que no está aquí cae al español. */
const TEXTOS = {
  es: { boton: 'Ecosistema', titulo: 'Ecosistema CodeLibri', fuera: '(se abre en otra pestaña)' },
  en: { boton: 'Ecosystem', titulo: 'CodeLibri ecosystem', fuera: '(opens in a new tab)' },
};
const textos = (idioma) => TEXTOS[idioma] || TEXTOS.es;

/* Un id para enlazar un botón o un rótulo con lo que controla. El de React
   lleva signos que no valen en todos los selectores: se dejan solo letras y
   cifras. */
const usarId = (prefijo) => prefijo + useId().replace(/[^a-zA-Z0-9]/g, '');

/* El aviso de que un enlace abre otra pestaña: solo para el lector de
   pantalla, porque a la vista ya lo dice el gesto. */
const avisoFuera = (t) => h('span', { className: 'cl-solo-lector' }, ' ' + t.fuera);

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

/**
 * El botón «Ecosistema» de una barra superior, con su menú: los demás
 * productos de CodeLibri, cada uno con su recuadro de color y su nota.
 *
 * <MenuEcosistema actual="epub-reader" idioma="en" />
 *
 * «actual» es el id del producto que lo lleva, que no se enseña a sí mismo.
 * El menú se cierra con Escape (y el foco vuelve al botón), al pulsar fuera
 * o al elegir. Se ancla a la derecha; «izquierda» lo abre hacia el otro
 * lado. «rotuloClassName» va en el texto del botón: con él un producto lo
 * esconde a la vista en el teléfono y deja solo el icono, sin que el botón
 * pierda su nombre. Si no hay productos que enseñar, no pinta nada.
 */
export function MenuEcosistema({ actual, idioma = 'es', rotulo, titulo, chico = true, izquierda = false, className, rotuloClassName }) {
  const t = textos(idioma);
  const [abierto, setAbierto] = useState(false);
  const ancla = useRef(null);
  const boton = useRef(null);
  const id = usarId('cl-menu-ecosistema-');

  useEffect(() => {
    if (!abierto) return undefined;
    const fuera = (e) => { if (ancla.current && !ancla.current.contains(e.target)) setAbierto(false); };
    const tecla = (e) => {
      if (e.key !== 'Escape') return;
      setAbierto(false);
      if (boton.current) boton.current.focus();
    };
    document.addEventListener('pointerdown', fuera);
    document.addEventListener('keydown', tecla);
    return () => {
      document.removeEventListener('pointerdown', fuera);
      document.removeEventListener('keydown', tecla);
    };
  }, [abierto]);

  const productos = ecosistemaDesde(actual, idioma);
  if (productos.length === 0) return null;

  return h('div', { className: 'cl-menu-ancla' + (className ? ' ' + className : ''), ref: ancla },
    h('button', {
      ref: boton,
      type: 'button',
      className: 'cl-boton' + (chico ? ' cl-boton-chico' : ''),
      'aria-expanded': abierto,
      'aria-controls': id,
      onClick: () => setAbierto((a) => !a),
    },
      h(Icono, { nombre: 'cuadricula', tam: 16 }),
      h('span', { className: rotuloClassName }, rotulo || t.boton),
      h(Icono, { nombre: 'abajo', tam: 14 })),
    h('div', { className: 'cl-menu' + (izquierda ? ' cl-menu-izquierda' : ''), id, hidden: !abierto },
      h('p', { className: 'cl-rotulo' }, titulo || t.titulo),
      productos.map((p) => h('a', {
        key: p.id, href: p.url, target: '_blank', rel: 'noopener noreferrer', onClick: () => setAbierto(false),
      },
        h('span', { className: 'cl-cuadro ' + p.tono }, h(Icono, { nombre: p.icono, tam: 18 })),
        h('span', null, h('b', null, p.nombre), h('small', null, p.nota), avisoFuera(t))))));
}

/**
 * El pie de sitio (cl-pie-sitio): la marca, las columnas del producto, la
 * del ecosistema y, debajo, la franja cl-pie.
 *
 * <PieSitio
 *   actual="epub-reader" idioma="es"
 *   marca={<>…logo, frase y botón…</>}
 *   columnas={[{ titulo: 'El lector', enlaces: [
 *     { texto: 'Abrir un EPUB', icono: 'subir', onClick: abrir },
 *     { texto: 'Novedades', icono: 'historia', href: '#novedades' },
 *   ] }]}
 *   franja={<span>© 2026 CodeLibri</span>}
 * />
 *
 * Un enlace con «href» es un <a> («externo» lo abre en otra pestaña); sin
 * «href», un <button> con su «onClick», para lo que abre una ventana del
 * propio producto. La columna del ecosistema sale sola, sin el producto
 * «actual»; ecosistema={false} la quita. Sin «franja», la franja dice
 * «© año CodeLibri».
 */
export function PieSitio({ actual, idioma = 'es', marca, columnas = [], franja, ecosistema = true, tituloEcosistema, className }) {
  const t = textos(idioma);
  const base = usarId('cl-pie-');
  const productos = ecosistema ? ecosistemaDesde(actual, idioma) : [];

  const enlace = (e, i) => {
    const icono = e.icono ? h(Icono, { nombre: e.icono, tam: 16 }) : null;
    const nodo = e.href
      ? h('a', { href: e.href, onClick: e.onClick, ...(e.externo ? { target: '_blank', rel: 'noopener noreferrer' } : {}) },
        icono, e.texto, e.externo ? avisoFuera(t) : null)
      : h('button', { type: 'button', onClick: e.onClick }, icono, e.texto);
    return h('li', { key: i }, nodo);
  };

  return h('footer', { className: 'cl-pie-sitio' + (className ? ' ' + className : '') },
    h('div', { className: 'cl-pie-sitio-cuerpo' },
      marca ? h('div', { className: 'cl-pie-sitio-marca' }, marca) : null,
      columnas.map((c, i) => h('nav', { key: i, className: 'cl-pie-sitio-columna', 'aria-labelledby': base + '-' + i },
        h('p', { className: 'cl-rotulo', id: base + '-' + i }, c.titulo),
        h('ul', null, c.enlaces.map(enlace)))),
      productos.length > 0
        ? h('nav', { className: 'cl-pie-sitio-columna', 'aria-labelledby': base + '-eco' },
          h('p', { className: 'cl-rotulo', id: base + '-eco' }, tituloEcosistema || t.titulo),
          h('ul', null, productos.map((p) => h('li', { key: p.id },
            h('a', { href: p.url, target: '_blank', rel: 'noopener noreferrer' },
              h('span', { className: 'cl-cuadro ' + p.tono }, h(Icono, { nombre: p.icono, tam: 15 })),
              h('span', null, p.nombre, h('small', null, p.nota), avisoFuera(t)))))))
        : null),
    h('div', { className: 'cl-pie' },
      franja !== undefined ? franja : h('span', null, '© ' + new Date().getFullYear() + ' CodeLibri')));
}

export default Icono;
