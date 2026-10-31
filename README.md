# VicentArt Tattoo

Portafolio web de una sola página para presentar el trabajo y la información de contacto de Vicentart. La interfaz y el contenido visible del sitio están en inglés.

## Tecnologías

- React 19 y TypeScript
- Vite+ como toolchain de desarrollo y build
- Tailwind CSS v4 con DaisyUI y componentes UI locales inspirados en shadcn/ui
- Embla Carousel para la galería

Es una aplicación estática de frontend. No contiene backend ni requiere variables de entorno para ejecutarse.

## Desarrollo

Requisitos fijados por el proyecto: Node.js `26.13.0` en `.node-version` y pnpm `12.16.1` en `packageManager`.

Los comandos siguientes requieren [Vite+ CLI](https://viteplus.dev/guide/) y RTK disponibles en el `PATH`. VS Code incluye recomendaciones de extensiones y tareas de calidad y build en `.vscode/`.

```powershell
rtk vp install
rtk vp dev
```

Vite muestra la dirección local en la terminal al iniciar el servidor.

## Comandos

```powershell
rtk vp run check
rtk vp run type-check
rtk vp run check-all
rtk vp run test
rtk vp run test:watch
rtk vp test --passWithNoTests
rtk vp run build
rtk vp preview
```

Usa `rtk vp run <script>` para ejecutar scripts definidos por el proyecto. En particular, `rtk vp run build` ejecuta primero la compilación TypeScript y después el build de Vite; `rtk vp build` ejecuta solo el comando integrado de build. El repositorio aún no tiene archivos de pruebas. En CI se pasa explícitamente `--passWithNoTests` al test runner para aceptar la suite vacía mientras siga así.

## Formato

El estilo se configura en `vite.config.ts` y se aplica a través de Vite+. [Stylistic](https://eslint.style/) se ejecuta como plugin de Oxlint para JavaScript y TypeScript; [Oxfmt](https://viteplus.dev/guide/fmt) formatea CSS, JSON y los demás formatos habilitados.

```powershell
rtk vp run format
rtk vp run format:check
```

El perfil `standardTsStyle` aplica un estilo inspirado en [StandardJS](https://standardjs.com/rules.html): dos espacios, comillas simples, sin punto y coma ni comas finales opcionales, espacios dentro de objetos, paréntesis opcionales en flechas y salto de línea final. Exige también `function nombre ()`, funciones anónimas y métodos con espacio antes del paréntesis. TypeScript conserva sus anotaciones de tipos; JSX utiliza comillas dobles.

Oxfmt excluye JS/TS porque su impresión eliminaría ese espacio. Cada archivo tiene un único responsable de estilo. En VS Code, guardar JS/TS aplica `source.fixAll.oxc`; para los demás formatos sigue activo el formateo de Oxc. `format` ejecuta `vp check --fix`, que aplica el formato y las correcciones seguras del linter; `format:check` valida ambos sin escribir. Los hooks y CI utilizan el mismo perfil.

Stylistic corrige las reglas de estilo, pero no redistribuye automáticamente todas las líneas a 80 columnas como Oxfmt. El editor conserva esa guía y Oxfmt la aplica a sus formatos. El perfil no equivale a ejecutar `ts-standard`; las reglas de calidad y tipos siguen en Oxlint y TypeScript.

Oxlint aplica una pasada de correcciones. Si varias se solapan, puede dejar problemas corregibles y devolver un error; vuelve a ejecutar `rtk vp run format` y comprueba después con `rtk vp run format:check`. Esta [limitación de correcciones sucesivas](https://github.com/oxc-project/oxc/issues/16118) también puede afectar las acciones del editor. Los hooks y CI rechazan los problemas restantes.

`lineEnding: auto` se reproduce con CRLF en Windows y LF en los demás sistemas; Git normaliza el texto y CI configura el checkout según el sistema. Los hooks mantienen LF.

Las exclusiones de Biome se comparten mediante `formatIgnorePatterns`, incluidas `src/components/ui`, `src/lib` y `public`. Se usan en Oxfmt y en el override de estilo de Oxlint; las reglas de calidad mantienen su alcance anterior. HTML permanece excluido: el formato de documentos HTML completos es opt-in en Biome y no está activado en `biome.json`. Se conservan además las exclusiones de artefactos y herramientas del proyecto.

`biome.json` se conserva como referencia. Sus reglas de lint y la acción `organizeImports` pertenecen al analizador de Biome y no se trasladan como opciones del formatter. Oxfmt sigue respetando `.gitignore`, aunque Biome tenga `vcs.useIgnoreFile: false`. Los dos motores pueden distribuir algunas expresiones de forma distinta aun compartiendo preferencias.

## CodeGraph

El proyecto tiene configuración de [CodeGraph](https://github.com/colbymchenry/codegraph) en `codegraph.json`. El índice local SQLite se guarda en `.codegraph/`, excluido de Git. Se utiliza el CLI y MCP globales, sin añadir dependencias al sitio.

Para crear el índice en un nuevo clon y consultar el código:

```powershell
rtk codegraph init
rtk codegraph status
rtk codegraph explore "App PortfolioCarousel useCarousel"
```

El MCP activo actualiza el índice cuando cambian el código o las exclusiones. También puedes sincronizar manualmente con `rtk codegraph sync` y comprobar los cambios pendientes con `rtk codegraph status`. Para consultas mediante MCP, pasa la raíz absoluta del proyecto como `projectPath` a `codegraph_explore`.

Si necesitas una reconstrucción completa con `rtk codegraph index`, cierra primero el consumidor MCP que esté escribiendo en el índice. CodeGraph admite un único escritor; conserva su bloqueo mientras siga activo.

Se excluyen las skills y los artefactos de herramientas. Los componentes UI, utilidades y exportaciones de imágenes de la aplicación permanecen indexados; CodeGraph ya excluye dependencias y builds de forma predeterminada.

## Guías para agentes

AGENTS.md centraliza las instrucciones de trabajo, los comandos de validación y el uso de CodeGraph. Las 12 skills compartidas se conservan como referencias de solo lectura en .agents/skills/, con sus orígenes y hashes registrados en skills-lock.json.

Los enlaces de .claude/skills/ apuntan a esas mismas referencias. GitHub Copilot y el asistente de JetBrains tienen instrucciones que remiten a AGENTS.md mediante archivos Markdown normales, también compatibles con clones de Windows sin soporte de enlaces. En nuevos clones de Windows, los enlaces simbólicos requieren que Git y el sistema permitan conservarlos; las referencias canónicas siguen en AGENTS.md y .agents/skills/.

## Diseño en Stitch

La [integración documentada con Stitch](.stitch/README.md) conserva nueve vistas responsivas de la web, sus estados de menú y acordeón, y el sistema de diseño extraído del código. El manifiesto fija los hashes de los 19 archivos subidos y los metadatos registran los recursos remotos verificados.

Los HTML, PNG y respuestas temporales permanecen en .stitch/.cache/, fuera de Git. El diseño documentado y los registros de importación mantienen LF para conservar sus hashes. Consulta las diferencias de la extracción nativa de Stitch antes de utilizarla como base del rediseño.

## Mapa del proyecto

```text
index.html                 Metadatos de la página y punto de entrada HTML
public/logo.svg            Logo
src/main.tsx               Montaje de React
src/App.tsx                Orden y composición de las secciones
src/components/            Navegación, secciones y componentes de la página
src/components/ui/         Primitivas locales de botón y carrusel
src/hooks/                 Estado de navegación, acordeón y carrusel
src/common/                Datos de navegación, textos del acordeón y tipos
src/assets/images/         Imágenes WebP y sus exportaciones
src/lib/                   Utilidades de clases CSS
src/App.css                Tailwind v4, tokens, DaisyUI y estilos globales
```

Los textos de la página viven principalmente en `src/components/` y `src/common/`. Mantén esos textos en inglés salvo que se solicite explícitamente cambiar el idioma.
