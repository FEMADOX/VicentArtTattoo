# VicentArt: tres propuestas de rediseño

Las **12 pantallas finales** están en el [proyecto privado de Stitch](https://stitch.withgoogle.com/projects/14587093072929101256). Sus títulos terminan en **Original assets**. La web React sigue pendiente de la elección del diseño.

Se mantienen el logo, las ocho fotografías de tatuajes, la fotografía del artista y el contenido comercial de origen en inglés. Los 21 elementos que ya existían en el lienzo, el sistema de diseño y los cuatro registros locales de la referencia anterior permanecen intactos.

## Comparativa y recomendación

| Propuesta | Experiencia | Ventaja principal | Límite |
| --- | --- | --- | --- |
| A: Galería de obra | Una página: obra protagonista, ocho piezas, artista, proceso y contacto | El trabajo es la primera impresión y el contacto tiene un recorrido directo | Es una página larga en móvil al mostrar las ocho fotografías completas |
| B: El artista y su trabajo | Una página con artista y pieza terminada juntos, biografía y galería | Explica quién está detrás del trabajo desde el comienzo | La presentación personal compite con la galería y añade lectura |
| C: Explorar y consultar | Inicio, Portfolio, About y Contact separados | El portfolio tiene un espacio propio y las tareas se separan con claridad | Requiere navegar entre páginas; Contact dedica más lectura a preparar la consulta |

**Recomiendo A como punto de partida**: prioriza la obra y conserva una ruta sencilla desde la primera impresión hasta la elección de contacto. B encaja si se quiere dar más protagonismo a la relación con Vicent. C encaja si se prefiere un portfolio independiente y se van a mantener cuatro páginas.

Esta es una recomendación de diseño basada en la revisión de las propuestas, sin datos de conversión de visitantes.

## Pantallas y archivos

Las capturas son de página completa. Los HTML estáticos incorporan estilos, fuentes e imágenes y funcionan sin conexión. Los archivos .prototype.html conservan el comportamiento generado y pueden necesitar recursos de estilo externos; no constituyen una implementación aprobada.

| Pantalla | Tamaño de captura | Archivos locales | ID final en Stitch |
| --- | --- | --- | --- |
| A / Home / Desktop | 1440 × 6215 | [PNG](exports/a-home-desktop.png) · [HTML](exports/a-home-desktop.html) · [Prototype](exports/a-home-desktop.prototype.html) | 16992451358060678693 |
| A / Home / Mobile | 390 × 8880 | [PNG](exports/a-home-mobile.png) · [HTML](exports/a-home-mobile.html) · [Prototype](exports/a-home-mobile.prototype.html) | 11652374572401789034 |
| B / Home / Desktop | 1440 × 8385 | [PNG](exports/b-home-desktop.png) · [HTML](exports/b-home-desktop.html) · [Prototype](exports/b-home-desktop.prototype.html) | 17213536861456421420 |
| B / Home / Mobile | 390 × 6129 | [PNG](exports/b-home-mobile.png) · [HTML](exports/b-home-mobile.html) · [Prototype](exports/b-home-mobile.prototype.html) | 3456769378707669241 |
| C / Home / Desktop | 1440 × 3920 | [PNG](exports/c-home-desktop.png) · [HTML](exports/c-home-desktop.html) · [Prototype](exports/c-home-desktop.prototype.html) | 9684331225790825676 |
| C / Home / Mobile | 390 × 3771 | [PNG](exports/c-home-mobile.png) · [HTML](exports/c-home-mobile.html) · [Prototype](exports/c-home-mobile.prototype.html) | 8913682602357850420 |
| C / Portfolio / Desktop | 1440 × 2184 | [PNG](exports/c-portfolio-desktop.png) · [HTML](exports/c-portfolio-desktop.html) · [Prototype](exports/c-portfolio-desktop.prototype.html) | 15866896281994293542 |
| C / Portfolio / Mobile | 390 × 5364 | [PNG](exports/c-portfolio-mobile.png) · [HTML](exports/c-portfolio-mobile.html) · [Prototype](exports/c-portfolio-mobile.prototype.html) | 6028925605545297506 |
| C / About / Desktop | 1440 × 4438 | [PNG](exports/c-about-desktop.png) · [HTML](exports/c-about-desktop.html) · [Prototype](exports/c-about-desktop.prototype.html) | 11559291833931608345 |
| C / About / Mobile | 390 × 4720 | [PNG](exports/c-about-mobile.png) · [HTML](exports/c-about-mobile.html) · [Prototype](exports/c-about-mobile.prototype.html) | 16235453574135222053 |
| C / Contact / Desktop | 1440 × 2330 | [PNG](exports/c-contact-desktop.png) · [HTML](exports/c-contact-desktop.html) · [Prototype](exports/c-contact-desktop.prototype.html) | 17137940145884781717 |
| C / Contact / Mobile | 390 × 3752 | [PNG](exports/c-contact-mobile.png) · [HTML](exports/c-contact-mobile.html) · [Prototype](exports/c-contact-mobile.prototype.html) | 2694064510612480498 |

Las exportaciones grandes y la evidencia de navegador están ignoradas por Git en exports/ y review/. Permanecen en este equipo y sus HTML/PNG finales están guardados también en Stitch. En otro clon pueden recuperarse mediante los recursos de [manifest.json](manifest.json) usando el MCP autenticado.

## Revisión realizada

- 12 diseños finales con el sistema oscuro existente, sin modificarlo.
- 122 posiciones de imagen comprobadas contra los bytes de los diez archivos originales, contando repeticiones de logo, hero y visor.
- HTML estático sin solicitudes externas, imágenes rotas ni errores de página.
- Comprobaciones de disposición a 320, 390, 768 y 1440 píxeles según el tipo de pantalla.
- Correcciones de desbordamiento en tablet/móvil, CTA móvil, etiquetas técnicas y contenido comercial inventado.
- 24 archivos descargados de Stitch mediante MCP y verificados con SHA-256 contra los HTML/PNG finales.
- Los 21 elementos originales del lienzo, el sistema de diseño, los hashes de la referencia local y la visibilidad privada conservados.

La importación utiliza DOCUMENT como entrada HTML, siguiendo el [uploader del SDK oficial de Stitch](https://github.com/google-labs-code/stitch-sdk/blob/main/packages/sdk/src/upload-handler.ts). Stitch devuelve las pantallas vinculadas como DESIGN. Se conservan los borradores originales y sus respuestas en la caché local; los recursos finales están identificados en el manifiesto.

## Para la implementación posterior

[interaction-spec.md](interaction-spec.md) define menú abierto, visor manual, preguntas desplegables, elección de canal y navegación. [prompts/](prompts/) conserva los doce prompts; [asset-manifest.json](asset-manifest.json) registra los originales; [stitch-feedback.json](stitch-feedback.json) conserva las descripciones y sugerencias originales de Stitch.

Las descripciones automáticas no son pruebas: algunas incluían afirmaciones o marcadores que se retiraron. Prevalecen las exportaciones revisadas y la especificación de interacción.

No se ha implementado el rediseño en React. Quedan para esa fase la comprobación completa de teclado y foco, estados interactivos, contraste, ampliación de texto, pruebas en otros navegadores y verificación de los destinos externos. No se activaron canales de contacto ni se simularon reservas o pagos.
