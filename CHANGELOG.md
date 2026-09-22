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
