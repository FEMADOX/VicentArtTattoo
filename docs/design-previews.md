# Diseño seleccionado: A

La propuesta A es la web principal en `/`. Inicia la aplicación con `rtk vp dev` y abre esa dirección. La galería, el artista, el proceso y los contactos siguen en una sola página con sus fotografías originales y textos comerciales en inglés.

| Ruta                                                 | Comportamiento actual                                 |
| ---------------------------------------------------- | ----------------------------------------------------- |
| `/`                                                  | Web principal A, indexable y sin barra de comparación |
| `/#portfolio`                                        | Galería completa                                      |
| `/#about`                                            | Artista y filosofía                                   |
| `/#process`                                          | Proceso y condiciones de reserva                      |
| `/#contact`                                          | Canales de contacto                                   |
| `/designs/ink-study`                                 | Estudio aislado de animación de tinta, con noindex    |
| `/designs`, `/designs/a`, `/designs/b`, `/designs/c` | Inicio de la web seleccionada                         |
| `/designs/c/portfolio`                               | `/#portfolio`                                         |
| `/designs/c/about`                                   | `/#about`                                             |
| `/designs/c/contact`                                 | `/#contact`                                           |

La compatibilidad local sustituye la URL mediante History API, conserva los parámetros de consulta y da prioridad al fragmento existente, por ejemplo `/designs/c/about?source=shared#booking` pasa a `/?source=shared#booking`. Las rutas desconocidas muestran una página para volver al inicio, con noindex. El comparador y B/C no se cargan en la aplicación; se conservan sus fuentes y las referencias de Stitch.

## Implementación e interacciones

- `src/Entry.tsx` monta la web seleccionada y mantiene la importación de `App.css`, que aporta Tailwind, fuentes y tokens.
- `src/designs/DesignApp.tsx` compone la navegación, A y el pie. El estudio se carga bajo demanda; solo el estudio y la página desconocida reciben noindex y títulos de uso interno.
- `SinglePageDesign.tsx` conserva la composición A; `content.ts` reutiliza la biografía y filosofía existentes y centraliza fotografías y contactos.
- `components.tsx` conserva galería, diálogo, proceso y contactos. La cuadrícula compacta mantiene la proporción original de cada fotografía y el orden del DOM y del teclado, con tres, dos o una columna.
- Se mantienen las entradas escalonadas, revelados de fotografías, efectos al hacer scroll, respuestas al cursor y pulsación, progreso de lectura y transiciones de los diálogos con Motion. La preferencia de movimiento reducido funciona tanto al cargar como al cambiarla con la página abierta.
- El visor conserva las imágenes completas, navegación manual con botones y flechas, Escape y retorno del foco. Durante la salida animada se mantiene el bloqueo modal hasta el cierre nativo.
- El menú móvil es un diálogo nativo y las preguntas utilizan details/summary. Se conserva el enlace para saltar al contenido y el foco visible.
- Las condiciones de depósito aparecen antes de los canales. Los enlaces reutilizan los usuarios, correo y teléfono del proyecto. Su titularidad social sigue pendiente de confirmación antes de publicar.
- `vercel.json` configura redirecciones permanentes de las cuatro rutas base antiguas al inicio. El estudio y las rutas antiguas de secciones se sirven mediante la reescritura existente; estas últimas se normalizan en la entrada para conservar sus fragmentos. Véase la [configuración de Vercel](https://vercel.com/docs/project-configuration/vercel-json#redirects). Esta configuración no despliega el sitio.

## Estilos y pruebas

Todos los diseños conservados en `src/designs/`, incluidos B/C y el estudio, usan utilidades Tailwind v4. `styles.ts` reúne las primitivas compartidas; las composiciones particulares mantienen sus constantes de clases junto al componente. Se eliminaron `designs.css` y los cinco CSS Modules. La hoja `App.css` sigue siendo la entrada de Tailwind y de los tokens del proyecto. Los valores animados de Motion y la geometría SVG continúan calculándose en ejecución.

Los tests se encuentran en `tests/designs/`. La configuración de Vitest limita el descubrimiento a `tests/` y TypeScript incluye ese directorio. `rtk vp run lint:tailwind` revisa todo `src/`, y `rtk vp run lint:tailwind:fix` aplica las correcciones automáticas. `check-all` incluye esa revisión. La extracción del editor cubre las constantes `styles` y `designStyles` además de `className` y `cn`.

El parser transitivo de `tailwind-lint` 0.16.0 se alinea con sus dependencias v3 mediante una sustitución limitada a la versión 0.16.0 de `@tailwindcss/language-service` en `pnpm-workspace.yaml`; `pnpm peers check` verifica que no queden incompatibilidades.

## Validación de la migración a Tailwind

La revisión final de `tailwind-lint` 0.16.0 terminó con 0 errores y 0 avisos en 46 archivos, sin archivos omitidos. `check-all` y el build de producción terminaron correctamente. La suite actual ejecuta 40 casos desde dos archivos en `tests/designs/`; CI requiere que exista la suite.

Chrome comprobó 28 combinaciones: A, el estudio, B y las cuatro páginas conservadas de C, a 320, 390, 768 y 1440 píxeles. B/C se montaron en un visor local de prueba sin cambiar las rutas públicas. No aparecieron imágenes rotas, desbordamiento horizontal ni errores de ejecución. Se verificaron header sticky, menú, visor, flechas y Escape, retorno del foco, preguntas, anclas, velocidad de dibujo, repetición, original, redimensionamiento y cambio de movimiento reducido en directo. Las 884 comparaciones de geometría y tipografía de A y del estudio coincidieron con la referencia previa. Los datos, trazados y helpers de comportamiento se conservaron. Firefox y Safari no se comprobaron.

## Estudio de animación de tinta

`/designs/ink-study` reutiliza las fotografías originales del gorila y del ojo de búho, sin recortarlas. La navegación y el pie enlazan a la web principal y a sus secciones. El estudio no forma parte de la navegación comercial. La página y sus trazados se cargan bajo demanda, con título propio y `noindex, nofollow`.

A velocidad normal (1×), la secuencia dura 12 segundos: de 0 a 3 s se dibujan los contornos; de 3 a 8 s la misma máquina rellena las sombras y detalles con la fotografía en blanco y negro; de 8 a 11 s realiza una segunda pasada para completar el color; de 11 a 12 s aparece la fotografía original completa. Las imágenes de las pasadas se revelan mediante máscaras SVG alrededor de la obra: la aguja sigue el extremo del trazo que descubre cada zona y se oculta al saltar al siguiente. Los contornos desaparecen progresivamente durante el sombreado. Los archivos de fotografía se conservan intactos; la vista final aplica un refuerzo suave de negros dentro de la región del tatuaje. Los límites y recorridos son aproximados y no representan el proceso real de tatuar. Simular piel inicialmente sin tinta queda fuera de este prototipo.

El refuerzo de negros usa una capa SVG limitada por la región de cada pieza y favorece los tonos oscuros neutros frente a piel cálida y reflejos de color. Durante la animación acompaña las pasadas de sombras y color; al terminar se mantiene en la vista final. «Show original» termina la animación y retira el refuerzo para comparar; Replay vuelve a activarlo. El visor abre siempre la fotografía original. La región es aproximada y el criterio de color no sustituye una segmentación exacta de piel y tinta.

Cada fotografía tiene un control «Drawing speed» de 0,25× a 2×, ajustable antes de empezar, durante la reproducción o después de terminar. Cambiarlo conserva el punto actual del dibujo y sincroniza contornos, máquina, sombras y color. Replay utiliza la velocidad seleccionada y la duración indicada se actualiza con ella. El control es accesible con el teclado y se deshabilita si hay movimiento reducido o falla la preparación del efecto.

La reproducción automática empieza una sola vez por fotografía, después de cargarla y cuando al menos el 25 % del marco está visible. Cada fotografía permite abrir el visor existente, repetir la animación incluso durante su reproducción o mostrar el original directamente. El movimiento reducido inicial o activado en directo detiene el efecto y muestra el original; desactivarlo no inicia otra reproducción. Si falla la preparación de los trazos, queda la fotografía estática. El estudio presenta dos columnas en escritorio y una hasta 720 píxeles.

## Validación de la selección de A

check-all y build terminaron correctamente y pasaron los 50 tests existentes y de migración. La revisión del build de producción en Chrome comprobó la página principal a 320, 390, 768 y 1440 píxeles, las siete rutas antiguas y dos casos con parámetros y fragmentos, ausencia del comparador y de noindex en el inicio, fotografías sin deformación, menú y visor por teclado con retorno del foco, movimiento reducido, estudio conservado y su navegación de vuelta, y páginas desconocidas con noindex. No hubo errores de ejecución. Las redirecciones de Vercel quedaron configuradas y comprobadas por tests, sin desplegar; los saltos locales de URL se comprobaron en navegador.

## Validación

```powershell

rtk vp run check-all

rtk vp test

rtk vp run build

```

Los tests de rutas cubren la página principal, el estudio aislado, las siete rutas antiguas y sus barras finales, parámetros y fragmentos, rutas desconocidas y coherencia con la configuración de alojamiento.

Como validación anterior, tras la mejora de A y C, check-all y build terminaron correctamente y los nueve tests de rutas pasaron. La revisión en Chrome cubrió 24 combinaciones de ruta y tamaño (320, 390, 768 y 1440 píxeles), incluidos B como referencia y las cuatro páginas de C. Se comprobaron proporciones originales, separaciones compactas, orden del teclado, ajuste al redimensionar, visor y menú con cierre animado, Escape y retorno del foco, preguntas por teclado, enlaces con fragmentos, inicio y fin de la animación real, y movimiento reducido tanto inicial como al cambiar la preferencia con la página abierta. No hubo errores de ejecución ni bucles de ResizeObserver. Firefox y Safari no se probaron.

Para el estudio, `check-all`, `test` y `build` terminaron correctamente: 50 tests de la suite. Chrome cubrió ambas fotografías a 320, 390, 768 y 1440 píxeles, las tres etapas y el final, la posición de la aguja, proporciones y capas al redimensionar, repetición durante la reproducción, cancelación, movimiento reducido inicial y en directo, teclado, visor y retorno del foco. También se comprobaron trazos vacíos o sin longitud, carga lenta con cancelación antes de terminar y carga que termina fuera de pantalla. Se comprobó mediante las máscaras rasterizadas que el relleno de sombras y color avanza por donde pasa la aguja y cubre la región al terminar cada pasada. El comparador, la carga directa, la recarga y la barra final funcionan. No hubo errores de ejecución. Firefox y Safari no se probaron.

La revisión del refuerzo comparó todos los píxeles de ambas fotografías: ninguno fuera de la máscara cambió. Las muestras de tinta se oscurecieron y las muestras interiores de piel, iris rojo y reflejo azul permanecieron iguales. Se comprobaron la comparación con el original, Replay, movimiento reducido inicial y en directo, visor y retorno del foco, fallback y cuatro anchos de pantalla. Esta revisión se realizó en Chrome.

Las referencias visuales y exportaciones originales siguen en [las propuestas de Stitch](../.stitch/designs/redesign-2026-10-31/README.md).

## Component-system migration

All retained versions now share the VicentArt dark theme and shadcn/Radix primitives. Use the development-only `/__ui` catalog to compare A, B, C's four pages, the legacy App, the ink study and component states. Public redirects remain unchanged. Current validation:40 Vitest tests,42 full Playwright tests,34 subsequent layout/state checks and5 focused C About/navigation checks passed. Final check-all (49 Tailwind source files) and build passed. A Chrome production smoke confirmed local fonts, no public catalog and reduced-motion ink behavior. Independent visual review disposition:ship for the supplied desktop/mobile captures. See [the component standard](component-system.md).

## Recorded views after drawing

The ink study also supports four locally prepared video sequences. See [preparation, source intervals and interaction details](ink-angle-study.md). The original gorilla/owl studies remain available, and portfolio galleries keep their current behavior.
