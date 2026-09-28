# Cambios

Cada versión lleva su etiqueta en git (`v0.2.0`) y el número dice qué puede
romper:

- **Corrección** (`0.2.1`): arregla sin cambiar nada de lo que usa un producto.
- **Crecimiento** (`0.3.0`): añade tokens, componentes o iconos; lo que había
  sigue igual.
- **Cambio de contrato** (`1.0.0`): renombra o quita un token o una clase, o
  cambia cómo se arma un componente. Un nombre que cambia sigue funcionando
  durante una versión de crecimiento antes de desaparecer.

Un producto no cambia al publicarse una versión: cambia cuando pide la nueva,
con `npm install` o con `herramientas/llevar.js`.

## 0.7.0 · 27 de septiembre de 2026

Crecimiento: lo que pidió el panel de administración de la Guía SAT.

- **Dos iconos** (70 en total): **editar**, el lápiz, y **chispas**, para
  generar con IA. Cualquier panel los necesita y el sistema no los tenía: el de
  la guía los resolvía con ✏️ y ⚡.
- **La vista actual en una navegación de botones**: un `.cl-boton` con
  `aria-current` toma el acento suave, como un filtro encendido. Es lo que hace
  falta cuando el menú de una aplicación son botones y no pestañas; el lector
  de pantalla anuncia cuál es la actual, cosa que un fondo puesto a mano no
  hace.
- Figma: los dos iconos, como componentes de una capa.

## 0.6.0 · 27 de septiembre de 2026

Corrección de fondo en la rampa categórica: el color apagado se estaba usando
para todo.

- **Paso vivo**, `--cl-cat-N-vivo`, y **`--cl-cat-N-sobre`** para lo que se
  escribe encima. No cambian con el tema. El paso de arriba es el que exige el
  texto: para llegar a 4.5:1 en el tema claro tiene que ser oscuro, y oscuro es
  apagado. Un punto, una raya de avance o una ficha rellena no son texto y
  piden el color de verdad.
- **El vivo nunca va en texto, ni grande.** El menta da 1.5:1 sobre blanco y el
  ámbar 1.65:1: ni con el 3:1 que admite el texto grande llegan. Para texto,
  siempre `--cl-cat-N`; el vivo solo donde no hay que leer, o con
  `--cl-cat-N-sobre` encima.
- Las clases `cl-cat-N` separan las dos cosas: `--cl-f-texto` sigue siendo el
  paso legible y `--cl-f-solido` pasa a ser el vivo. Los filetes suben del 30
  al 35% del vivo.
- **Corrección:** la cuenta de un filtro encendido pintaba su texto con
  `--cl-superficie`, blanco en el tema claro, sobre un sólido que podía ser
  ámbar o menta. Ahora usa `--cl-f-sobre`, y las familias también lo declaran.
- `contraste.js` mide las diez parejas nuevas: 224 en total.

## 0.5.0 · 22 de septiembre de 2026

Crecimiento: lo que hacía falta para que un producto entero sea del sistema.

- **Filtros** (`.cl-filtros`, `.cl-filtro`, `.cl-filtro-cuenta`): una fila de
  categorías que encienden y apagan lo que se ve. No son pestañas —se pueden
  apagar todas y ninguna manda sobre un panel—, así que van con
  `aria-pressed`. Con `cl-filtros-tira` la fila se desliza en vez de bajar de
  renglón.
- **Las diez clases de la rampa**, `cl-cat-1` a `cl-cat-10`, con la misma
  forma que `cl-f-primary`: rellenan `--cl-f-solido`, `-texto`, `-fondo` y
  `-linea`. Así una etiqueta, un recuadro de icono o un filtro toman el color
  de su categoría sin que el componente sepa que existe la rampa.
- **Tres iconos** (68 en total): chat, calculadora y balanza. Salieron de la
  cabecera de la Guía SAT.
- Figma al día: los tres iconos y el conjunto Filtro, con sus dos variantes.

## 0.4.0 · 22 de septiembre de 2026

Crecimiento: color para lo que no tiene jerarquía.

- **Rampa categórica**, `--cl-cat-1` a `--cl-cat-10`: diez colores en orden de
  tono para categorías, series de una gráfica o etiquetas de un filtro. Siete
  son los de la casa, en el mismo paso que ya usan los avisos y las familias;
  tres —naranja, cian y púrpura— rellenan los huecos del círculo. Cambian con
  el tema.
- `contraste.js` mide los veinte valores sobre la superficie, sobre el lienzo y
  **sobre su propio color al 10%**, que es como se pinta una ficha de filtro.
  Ese tercer fondo es el exigente: obligó a bajar el ámbar al paso 900.
- Salió de la Guía SAT, que tiene nueve categorías y las pintaba con nueve
  colores sueltos, fuera de la paleta. La presentación de las heurísticas de
  Nielsen tiene la misma necesidad.

## 0.3.0 · 22 de septiembre de 2026

Crecimiento: lo que pedían los productos, y el código y Figma a la par.

- **Diez iconos nuevos** (65 en total): subir, letra, menos, una página,
  restablecer, marcador, marcador guardado, lista, paleta y borrar. Salieron
  de lo que usa el EPUB Reader y el sistema no tenía.
- **Pestañas** (`.cl-pestanas`, `.cl-pestana`, `.cl-pestanas-llenas`): paneles
  que comparten el mismo sitio, con el marcado de ARIA. Con
  `data-cl-pestanas`, el guion cambia el panel y mueve el foco con las flechas.
- **`@codelibri/sistema/react`**, con `<Icono nombre="…" />`. React es una
  dependencia opcional: la pone el producto.
- **Tres tokens de tema** que cierran los desvíos entre el código y Figma:
  `etiqueta-fondo`, `separador` y `raya`. El área de texto usa el
  interlineado normal (1.55), como su estilo en Figma. Solo quedan dos
  diferencias, y las dos son límites de Figma: los tamaños con `clamp()` y el
  estado «al apuntar» del botón.
- **Corrección:** en modo oscuro, una etiqueta rellena (`.cl-etiqueta-llena`)
  perdía su fondo, porque la regla del oscuro pesaba más.
- **Figma, al día:** las tres variables, los diez iconos, los componentes
  Pestaña y Pestañas, y la etiqueta, las migas y la raya enlazadas a sus
  variables nuevas.

## 0.2.0 · 22 de septiembre de 2026

Crecimiento: el sistema sale hacia los productos.

- **Paquete de npm `@codelibri/sistema`**, instalable desde GitHub con una
  etiqueta: `npm install github:luisgil06/sistema-diseno#v0.2.0`. Exporta la
  hoja, los tokens, los iconos, las fuentes y el logotipo. `compilar.js`
  mantiene su versión igual a la de `tokens.json`.
- **Repositorio público con licencia MIT y la marca reservada**, y la licencia
  de Inter (`fuentes/OFL.txt`), que viaja con las fuentes.
- **`herramientas/llevar.js`**: copia una versión dentro de un producto, con
  `SISTEMA.json` al lado (versión, etiqueta, commit y huella de cada archivo).
  Se niega si el sistema tiene cambios sin commit o si la versión no tiene su
  etiqueta, salvo con `--borrador`.
- **Tokens para JavaScript**: `dist/tokens.js` y `dist/tokens.d.ts`, con los
  mismos valores resueltos que `tokens.json`, y `variable("acento")` para
  escribir `var(--cl-acento)`. Para los productos que pintan con estilos en
  línea.
- **Iconos para JavaScript**: `dist/iconos.js` y `dist/iconos.d.ts`, con el
  nombre y el trazo de cada uno, para dibujarlos sin el sprite.
- **Corrección · los iframes en modo oscuro**: heredaban `color-scheme: dark`
  y Chrome les pintaba un fondo blanco opaco cuando su contenido no declara
  esquema. Ahora se quedan en `normal`. Salió con el piloto en el EPUB Reader.

## 0.1.0 · 21 de septiembre de 2026

La primera: fundamentos, componentes y armazón sacados del estilo del Aula,
la documentación viva y la biblioteca de Figma.
