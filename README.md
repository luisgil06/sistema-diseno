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
  js/codelibri.js         tema, foco, cajón, menús, ventanas, carruseles
  js/cabeza.js            lo que va en línea en el <head>
iconos/iconos.json        los iconos: nombre y trazo
herramientas/
  compilar.js             genera dist/ y mide el contraste
  contraste.js            144 parejas de texto y fondo; falla si alguna baja de 4.5:1
  documento-unico.js      la documentación empaquetada en un solo HTML
dist/                     lo que usa un producto (se genera; no se edita)
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

## Usarlo en un producto

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

- **Prefijo `cl-`** en clases y `--cl-` en variables: no chocan con un
  WordPress ni con Divi.
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

- El rediseño de `codelibri.com.mx` con el sistema.
- Dos literales de tema sin token en la hoja, que convendría volver tokens:
  - el fondo de la etiqueta vacía en oscuro;
  - el separador de las migas en oscuro.

Inter se distribuye con la SIL Open Font License 1.1.
