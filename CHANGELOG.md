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

## 0.11.0 · 2 de octubre de 2026

Crecimiento: el menú del ecosistema y el pie de sitio, hechos para React, y
la lista del ecosistema en inglés. Lo pide el EPUB Reader, que es bilingüe.

- **`MenuEcosistema`** en `@codelibri/sistema/react`: el botón «Ecosistema»
  con su menú (`cl-menu-ancla` + `cl-menu`). Se cierra con Escape (el foco
  vuelve al botón), al pulsar fuera o al elegir. `rotuloClassName` deja
  esconder el texto en el teléfono sin que el botón pierda su nombre.
- **`PieSitio`**: el pie de sitio (`cl-pie-sitio`) con la marca, las columnas
  del producto, la del ecosistema al final y la franja. Un enlace sin `href`
  es un botón con su `onClick`, para abrir una ventana del propio producto.
- Los enlaces que abren otra pestaña lo avisan al lector de pantalla.
- **La lista del ecosistema trae la nota en inglés** (`idiomas.en.nota`), y
  `ecosistemaDesde(actual, idioma)` la devuelve ya puesta. Compilar la exige en
  todos los productos. Los dos componentes aceptan `idioma="en"`.
- **En el pie de sitio, un `<button>` de columna se ve igual que un enlace.**

La Guía SAT sigue con su propio pie y su propio menú, que hacen lo mismo:
puede pasarse a estos cuando convenga.

## 0.10.2 · 2 de octubre de 2026

Corrección de contraste: el sistema ya se mide también sobre el lienzo, no
solo sobre la superficie blanca, y lo que fallaba ahí se corrige sin cambiar
nombres.

- **`contraste.js` mide cada tinte translúcido encima de la superficie y
  encima del lienzo**: campo, fila al pasar por encima, `acento-suave`, el fondo
  de cada estado y de cada familia, y el acento sobre las manchas que decoran el
  lienzo. Pasa de 224 a 346 parejas.
- **`texto-3` en claro es `#6e6e72`**, un punto más oscuro que `text.300`
  (`#747478`), que sobre el lienzo daba 4.49:1 y dentro de un campo 4.38:1. Ahora
  se puede usar sobre el lienzo; ya no hace falta cambiarlo por `texto-2`.
- **`acento-suave` baja al 9% en claro y al 12% en oscuro** (era 10% y 16%). Con
  el acento encima daba 4.43:1 sobre las manchas del lienzo y 4.36:1 en oscuro
  dentro de una fila al pasar por encima. La diferencia apenas se ve.
- En Figma, las mismas tres variables: `texto/texto-3` (Claro) y
  `a/suave-claro` y `a/suave-oscuro` de la colección Acento.

La pareja más justa queda en 4.51:1 (`cat-2` sobre su propio 10% sobre el lienzo).

## 0.10.1 · 2 de octubre de 2026

Corrección: el enlace del Aula en la lista del ecosistema apuntaba a
`https://learn.codelibri.com.mx`, que no existe, desde la 0.9.0. Ahora va a
`https://aula.codelibri.com.mx`. Ningún otro cambio.

## 0.10.0 · 2 de octubre de 2026

Crecimiento: el ecosistema se ve igual en todos los productos.

- **CodeLibri va primero** y con el violeta de la rampa (`cl-cat-8`), como
  pidió Luis. El Aula pasa al púrpura (`cl-cat-9`): de la misma familia,
  pero distinto, para no repetir color en la lista. El orden de la lista es
  el de la barra del Aula: CodeLibri, Aula, Guía SAT, Bloques HTML y EPUB
  Reader.
- **Cada producto trae sus `colores`** —claro y oscuro, ya resueltos de su
  tono—, para que un producto que no carga la hoja (el Aula, WordPress) lo
  pinte igual: el dibujo en ese color y el fondo del recuadro en él mismo al
  10%. Antes el Aula pintaba todos en violeta.
- Documentación y Figma: el pie de sitio con el orden y los tonos nuevos.

## 0.9.1 · 2 de octubre de 2026

Corrección en las herramientas; lo que usa un producto no cambia.

- **`llevar.js --solo`**: lleva únicamente los archivos de `dist/` que se le
  pidan, separados por comas, y `SISTEMA.json` lo anota. Lo pidió el Aula, que
  tiene su propia hoja y solo necesita `ecosistema.json`. Un archivo que no
  existe en `dist/` detiene la copia y dice cuáles hay.

## 0.9.0 · 2 de octubre de 2026

Crecimiento: lo que pidió la Guía SAT para tener el mismo pie, el mismo menú
del ecosistema y el mismo cajón en todas sus páginas. Propuesto en la guía y
aprobado por Luis.

- **`@codelibri/sistema/ecosistema`**: la lista de los productos de CodeLibri
  —nombre, nota, dirección, icono y su tono de la rampa—, una sola para todos.
  `ecosistemaDesde('guia-sat')` devuelve los demás, y solo los que tienen
  dirección. La fuente es `ecosistema/ecosistema.json`; la compilación se
  niega si un icono no existe, si un tono no es de la rampa o si una
  dirección no es https. También va como `ecosistema.json`.
- **Pie de sitio** (`.cl-pie-sitio`): el pie de un sitio que se recorre, no de
  una aplicación. La marca con su frase y su botón, columnas de enlaces con
  rótulo y el ecosistema con el recuadro de la rampa de cada producto; debajo,
  la franja `cl-pie`, que gana `.cl-pie-aparte` para llevar algo a la derecha.
  El ancho, con `--cl-pie-ancho`.
- **Cajón de sitio** (`.cl-lat-cajon`): la barra lateral como cajón a
  cualquier ancho, para un sitio que navega con su barra superior y solo la
  necesita cuando esa barra no cabe. El cierre va en la marca con
  `.cl-lat-cerrar`.
- **Un producto en la barra lateral**: un enlace de `cl-grupo` admite su
  recuadro de color y una nota en `<small>`. Antes el recuadro se estiraba,
  porque la regla de los rótulos alcanzaba a todo `span`.
- **La flecha del botón de un menú gira** al abrirlo.
- **Corrección en el guion:** el cajón se cerraba al pasar de 901 px, un ancho
  fijo que solo vale para el armazón. Ahora se cierra cuando deja de verse el
  botón que lo abre.
- Documentación: el pie de sitio con su ejemplo, el cajón de sitio y el módulo
  del ecosistema.
- Figma: el componente «Pie de sitio» en la página Armazón.

## 0.8.1 · 2 de octubre de 2026

Corrección: los botones de la casa cuando son de icono o están apagados.

- **El principal y el de apoyo de icono llevaban el dibujo gris.**
  `.cl-boton-icono`, con la misma especificidad y más abajo en la hoja, les
  ponía `--cl-texto-2` encima del degradado. Ahora el dibujo va en blanco,
  como su texto. Lo vio Luis en el botón flotante del chat de la Guía SAT.
- **Los degradados apagados se quedaban en pastel.** Al 40% el violeta y la
  menta casi desaparecían y el blanco encima no se distinguía. El principal y
  el de apoyo se apagan ahora al 75%, sin sombra; el resto sigue al 40%.
- Documentación: el principal de icono, reposando y apagado.
- Figma: el apagado del principal y del de apoyo al 75%, y el principal y el
  de apoyo en el conjunto «Botón icono».

## 0.8.0 · 1 de octubre de 2026

Crecimiento: un icono.

- **Accesibilidad** (71 iconos): la figura con los brazos abiertos dentro de un
  círculo, que es el símbolo de las opciones de accesibilidad. No es la silla de
  ruedas, que habla solo de movilidad. Lo pidió el panel de accesibilidad de la
  Guía SAT, que usaba ♿.
- Figma: el icono, como componente de una capa.

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
