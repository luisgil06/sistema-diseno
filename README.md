# Sistema de diseño CodeLibri

El estilo del Aula CodeLibri, sacado a un sistema propio para el resto del
ecosistema: el sitio principal, la Guía SAT, los Bloques HTML y el lector
EPUB. Tokens, componentes y el armazón con barra lateral, en una sola hoja
CSS y un guion sin dependencias.

La documentación viva está en [`docs/index.html`](docs/index.html) y hay
una página de producto de muestra en [`docs/ejemplo.html`](docs/ejemplo.html).

## Qué hay aquí

```
tokens/tokens.json        la fuente: paleta, temas, acentos, tipografía, espacio…
src/                      las hojas y el guion, por partes
  base.css                reinicio, tipografía, foco, barras de desplazamiento
  componentes/*.css       botones, campos, interruptor, etiquetas, tarjetas,
                          avisos, ventanas, navegación, datos
  armazon.css             barra lateral, barra superior, contenido, pie, cajón
  js/codelibri.js         tema, foco, cajón, menús, ventanas, carruseles, pestañas
  js/cabeza.js            lo que va en línea en el <head>
  react/                  <Icono> para los productos en React
iconos/iconos.json        los iconos: nombre y trazo
herramientas/
  compilar.js             genera dist/ y mide el contraste
  contraste.js            144 parejas de texto y fondo; falla si alguna baja de 4.5:1
  documento-unico.js      la documentación empaquetada en un solo HTML
  llevar.js               copia una versión dentro de un producto
  figma.js                los guiones que sincronizan la biblioteca de Figma
dist/                     lo que usa un producto (se genera; no se edita)
CHANGELOG.md              qué trajo cada versión
docs/                     la documentación, hecha con el propio sistema
```

## Compilar

```
node herramientas/compilar.js
```

Sin instalar nada. Deja en `dist/` la hoja (`codelibri.css`), el guion
(`codelibri.js`), la cabecera (`codelibri-cabeza.js`), el sprite de iconos
(`iconos.svg` e `iconos.json`), las fuentes y los tokens resueltos
(`tokens.json`), que son los que se llevan a Figma. Al final mide el
contraste y se detiene si algo no llega.

Los valores se cambian en `tokens/tokens.json`; las formas, en `src/`.
Nunca en `dist/`.

## La documentación en un solo archivo

Abierta con doble clic, `docs/index.html` sale sin Inter: Chrome no carga
fuentes desde `file://`. Para verla así o para mandarla, se empaqueta
entera —hoja, fuentes, imágenes, iconos y guiones— en un solo HTML:

```
node herramientas/documento-unico.js              → docs/unico/documentacion.html
node herramientas/documento-unico.js ejemplo.html → docs/unico/ejemplo.html
```

Con `--fragmento` sale sin `<html>`, `<head>` ni `<body>`, para un sitio
que pone el esqueleto por su cuenta; así se publicó en claude.ai.

## Versiones

El número de versión está en `tokens/tokens.json` y cada una lleva su
etiqueta en git (`v0.2.0`). Qué significa cada número y qué trajo cada
versión: [`CHANGELOG.md`](CHANGELOG.md).

Para sacar una versión:

1. Cambiar `version` en `tokens/tokens.json` y anotarla en el `CHANGELOG.md`.
2. `node herramientas/compilar.js` (se detiene si algún contraste no llega).
3. Si cambiaron tokens o iconos, sincronizar Figma (ver más abajo).
4. Commit y etiqueta: `git tag v0.2.0`. Al subir, que viajen también las
   etiquetas: sin ellas ningún producto puede pedir esa versión.

## Llevarlo a un producto

**Cada producto usa una versión fija del sistema.** Una versión nueva no cambia
ningún producto hasta que ese producto la pide. Hay dos caminos, según el
producto.

### Con npm: los productos en React (EPUB Reader, Guía SAT, Bloques)

El repositorio es público y el paquete se instala desde GitHub, fijado a una
etiqueta:

```
npm install github:luisgil06/sistema-diseno#v0.3.0
```

Queda en `package.json` como `"@codelibri/sistema": "github:luisgil06/sistema-diseno#v0.3.0"`
y el `package-lock.json` anota el commit exacto. Hostinger lo descarga al
compilar, sin credenciales. Para actualizar, se cambia la etiqueta, se vuelve a
correr `npm install` y se hace commit en el producto.

```js
import '@codelibri/sistema/codelibri.css';        // tokens, componentes, Inter
import { tema, paleta, variable } from '@codelibri/sistema';
import { iconos } from '@codelibri/sistema/iconos'; // nombre y trazo de cada icono
import { Icono } from '@codelibri/sistema/react';    // <Icono nombre="buscar" />
```

La hoja referencia sus fuentes con rutas relativas, así que Vite las empaqueta
solas y siguen saliendo del propio dominio del producto. `tokens` trae los
mismos valores que la hoja, ya resueltos, para los productos que pintan con
estilos en línea.

### Con una copia: lo que no usa npm (el Aula, el tema de WordPress)

```
node herramientas/llevar.js "<carpeta del producto>" --carpeta sistema
```

Compila, vacía la carpeta de destino (por omisión `src/sistema`, y solo si es
del sistema) y copia `dist/` con un `SISTEMA.json` al lado: versión, etiqueta,
commit y la huella de cada archivo. Después, en el producto, se hace commit como
cualquier otro cambio.

Se niega si el sistema tiene cambios sin commit o si el commit actual no lleva
la etiqueta de la versión. Para probar antes de etiquetar, `--borrador`, y
`SISTEMA.json` lo deja escrito.

**No se carga desde un CDN** aunque el repositorio sea público: sería una
petición a un tercero en cada visita, justo lo que se evita sirviendo Inter
desde el propio sitio.

## Usarlo en una página sin compilador

1. Copiar `dist/` al servidor del producto (por ejemplo, a `/sistema/`).
2. En el `<head>`, el contenido de `codelibri-cabeza.js` **en línea** y
   después la hoja. La cabecera pone el tema y el pliegue de la barra antes
   de pintar; sin ella, quien usa el modo oscuro ve un destello claro.
3. `class="cl"` en el `<body>`, el guion al final.
4. El acento del producto en `<html>`: `data-acento="primary"` (violeta, por
   omisión), `"secondary"` (menta) o `"secondary2"` (rosa).
5. Los iconos: `data-cl-iconos="/sistema/iconos.svg"` en `<html>` y cada uno
   como `<svg class="cl-ico" width="20" height="20" aria-hidden="true"><use href="#cl-buscar"/></svg>`.

```html
<html lang="es" data-acento="secondary2" data-cl-iconos="/sistema/iconos.svg">
<head>
  <script>/* contenido de codelibri-cabeza.js */</script>
  <link rel="stylesheet" href="/sistema/codelibri.css">
</head>
<body class="cl">
  …
  <script src="/sistema/codelibri.js"></script>
</body>
</html>
```

## Convenciones

- **Prefijo `cl-`** en clases y `--cl-` en variables: no chocan con
  WordPress ni con BeTheme y Elementor.
- **Todo cuelga de `.cl`**, como el Aula colgaba de `body.app`. Fuera de esa
  zona la hoja no toca nada salvo las barras de desplazamiento de la página.
- **Tema** con `data-theme="dark"` en `<html>` (o en una zona); **acento**
  con `data-acento` en `<html>` (todo el producto) o en una zona (la tarjeta
  de otro producto). **Familias sueltas** con `cl-f-primary`,
  `cl-f-secondary`, `cl-f-secondary2`.
- **El guion se engancha por atributos** `data-cl-*`: no hace falta escribir
  JavaScript en cada página. La lista está al principio de
  `src/js/codelibri.js`.
- Los componentes solo usan tokens de uso (`--cl-texto`, `--cl-superficie`,
  `--cl-acento`…), nunca la paleta directa: así cambian solos con el tema y
  el acento.

## Decisiones que no se tocan sin preguntar

- **Degradados en sus pasos 500**, con texto blanco: 1.49:1 en el extremo
  menta y 3.25:1 en el rosa. Decisión de Luis del 15 de septiembre de 2026,
  tomada con las cifras delante. `contraste.js` no los mide a propósito.
- **Base común y acento propio**: tipografía, grises, formas y degradados
  son iguales en todo el ecosistema; cada producto elige su acento.
- **El código manda**: la biblioteca de Figma se arma a partir de
  `dist/tokens.json`, no al revés.

## La biblioteca de Figma

Vive en el archivo `VJnzekSGdZmIlyN2482cN8` («Design System» de CodeLibri) y
se arma desde el código:

- **Variables:** cinco colecciones.
  - Paleta: 91 pasos.
  - Acento: primary, secondary y secondary2.
  - Tema: Claro y Oscuro, con los 52 tokens de uso y las partes de sombra que cambian con el tema.
  - Tipo.
  - Forma.
- **Nombres CSS:** cada variable lleva el suyo (`var(--cl-…)`) para el modo desarrollador.
- **Estilos:** 24 de texto, 6 de efecto y los 3 degradados.
- **Componentes:** una página por familia, con documentación y variantes.
- **Armazón:** una página de ejemplo en pantalla ancha, en teléfono y con el cajón abierto.

Para sincronizar después de cambiar `tokens/tokens.json` o `iconos/iconos.json`:

```
node herramientas/compilar.js
node herramientas/figma.js
```

`figma.js` deja en `figma/scripts/` un guion por paso:
- `1-paleta.js` a `5-forma.js`: las variables.
- `6-estilos.js`: los estilos.
- `7-iconos-a.js` y `7-iconos-b.js`: los iconos.

Se ejecutan en ese orden dentro del archivo. Cada guion busca por nombre y actualiza lo que ya existe, sin duplicar. `figma/estado.json` guarda los identificadores de páginas, colecciones y componentes, y las pocas diferencias que no se pueden reproducir igual.

**Los iconos tienen una sola capa, «Trazo».** Así, al cambiar el icono de una
instancia, Figma conserva el color que le pone el componente que lo lleva.

## Lo que sigue

- El rediseño de `codelibri.com.mx`, que será WordPress con BeTheme y
  Elementor: el sistema necesitará una salida para Elementor (colores y
  tipografías globales).
- Los productos, uno por uno: EPUB Reader, Guía SAT y Bloques.

## Licencia

El código, las hojas, los tokens, los iconos y la documentación se publican con
la **licencia MIT**. **La marca queda fuera**: el nombre CodeLibri, su logotipo
y las imágenes de muestra de `docs/img` no se pueden usar sin permiso. Inter se
distribuye con la SIL Open Font License 1.1 (`fuentes/OFL.txt`). Detalle en
[`LICENSE`](LICENSE).
