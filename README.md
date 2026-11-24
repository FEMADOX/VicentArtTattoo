# VicentArt Tattoo

A single-page portfolio website presenting VicentArt's work and contact information. The site's interface and public-facing copy are in English.

## Technology

- React 19 and TypeScript
- Vite+ as the development and build toolchain
- Tailwind CSS v4 with shared shadcn/Radix UI components
- Embla Carousel for the gallery
- Motion for section transitions, drawing playback and recorded-view interactions

This is a static frontend application. It has no backend and requires no environment variables to run.

## Development

The project pins Node.js `26.13.0` in `.node-version` and pnpm `12.16.1` in `packageManager`.

The commands below require the [Vite+ CLI](https://viteplus.dev/guide/) and RTK on `PATH`. VS Code extension recommendations and quality/build tasks are in `.vscode/`.

```powershell
rtk vp install
rtk vp dev
```

Vite prints the local address in the terminal when the server starts.

## Commands

```powershell
rtk vpr check
rtk vpr tsc
rtk vpr check-all
rtk vpr lint:tailwind
rtk vpr lint:tailwind:fix
rtk vpr test
rtk vpr test:watch
rtk vpr test:e2e
rtk vpr build
rtk vp preview
```

Prefix shell commands with `rtk`. Use `rtk vpr <name>` to run scripts from `package.json` or tasks from `vite.config.ts`; `rtk vp <name>` invokes a Vite+ built-in. The `build` task runs the TypeScript build, Vite build and production-output checks; `rtk vp build` alone skips the other steps. `check-all` runs formatting, lint, type checks and `tailwind-lint`.

Vitest discovers `*.test.ts`, `*.test.tsx`, `*.spec.ts` and `*.spec.tsx` files under `tests/unit/` and `tests/integration/`. Playwright recursively discovers browser tests under `tests/e2e/`, and its task builds the app first. TypeScript checks both `src/` and `tests/`.

Sections in `src/sections/` and the portfolio feature in `src/features/portfolio/` use Tailwind v4 utilities and reusable class constants, without dedicated stylesheets or CSS Modules. `src/global.css` contains the Tailwind entry point, local fonts and shared dark theme. `DESIGN.md` and [the component system](docs/component-system.md) document the shadcn/Radix standard; DaisyUI has been removed. `lint:tailwind:fix` canonicalizes utility classes; conflicts without an automatic fix are reviewed manually. Editor settings include the `styles`, `portfolioStyles` and `siteStyles` constants in class extraction.

## Formatting

Style is configured in `vite.config.ts` and run through Vite+. [Stylistic](https://eslint.style/) runs as an Oxlint plugin for JavaScript and TypeScript; [Oxfmt](https://viteplus.dev/guide/fmt) formats CSS, JSON and the other enabled file types.

```powershell
rtk vpr format
rtk vpr format:check
```

The `standardTsStyle` profile follows a [StandardJS](https://standardjs.com/rules.html)-inspired style: two spaces, single quotes, no semicolons or optional trailing commas, spaces inside object braces, optional parentheses for arrow parameters, and a final newline. It also requires `function name ()`, anonymous functions, and a space before method parentheses. TypeScript keeps its type annotations; JSX uses double quotes.

Oxfmt excludes JS/TS because its printer would remove that space. Each file has a single style owner. In VS Code, saving JS/TS runs `source.fixAll.oxc`; Oxc formatting remains enabled for other file types. `format` runs `vp check --fix`, applying formatting and safe lint fixes; `format:check` validates both without writing. Hooks and CI use the same profile.

Stylistic enforces style rules but does not automatically wrap every line at 80 columns like Oxfmt. The editor keeps that guide, and Oxfmt applies it to the formats it owns. This profile is not equivalent to running `ts-standard`; Oxlint and TypeScript still enforce quality and type rules.

Oxlint applies one fix pass. Overlapping fixes may leave fixable issues and return an error; run `vpr format` again, then check with `vpr format:check`. This [limitation on successive fixes](https://github.com/oxc-project/oxc/issues/16118) can also affect editor actions. Hooks and CI reject remaining issues.

`lineEnding: auto` uses CRLF on Windows and LF on other systems; Git normalizes text, and CI configures checkout line endings by operating system. Hooks use LF.

Biome exclusions are shared through `formatIgnorePatterns`, including `src/components/ui`, `src/lib` and `public`. They apply to Oxfmt and the Oxlint style override; quality rules keep their previous scope. HTML remains excluded: full-document HTML formatting is opt-in in Biome and is not enabled in `biome.json`. Project artifact and tooling exclusions are preserved as well.

`biome.json` is retained as a reference. Its lint rules and `organizeImports` action belong to Biome's analyzer and are not formatter options. Oxfmt still respects `.gitignore`, even though Biome sets `vcs.useIgnoreFile: false`. The two engines may format some expressions differently despite sharing preferences.

## CodeGraph

The project configures [CodeGraph](https://github.com/colbymchenry/codegraph) in `codegraph.json`. Its local SQLite index is stored in `.codegraph/`, which Git ignores. The global CLI and MCP are used without adding site dependencies.

To create the index in a fresh clone and query the code:

```powershell
rtk codegraph init
rtk codegraph status
rtk codegraph explore "SiteApp ArtworkGallery useTattooViews"
```

The active MCP updates the index when source code or exclusions change. You can also sync manually with `codegraph sync` and check pending changes with `codegraph status`. For MCP queries, pass the absolute project root as `projectPath` to `codegraph_explore`.

Before rebuilding with `codegraph index`, close the MCP client currently writing to the index. CodeGraph supports one writer; keep its lock while it is active.

Skills and tool artifacts are excluded. The app's UI components, utilities and image exports remain indexed; CodeGraph excludes dependencies and build outputs by default.

## Agent guides

AGENTS.md centralizes the working instructions, validation commands and CodeGraph workflow. The 12 shared skills are kept as read-only references in `.agents/skills/`, with their sources and hashes recorded in `skills-lock.json`.

Links in `.claude/skills/` point to the same references. GitHub Copilot and the JetBrains assistant use regular Markdown instruction files that refer to `AGENTS.md`, which also works in Windows clones without link support. New Windows clones need Git and system support to preserve symbolic links; the canonical references remain in `AGENTS.md` and `.agents/skills/`.

## Stitch designs

The [documented Stitch integration](.stitch/README.md) preserves nine responsive website views, their menu and accordion states, and the design system extracted from the code. The manifest records hashes for the 19 uploaded files, and metadata lists the verified remote assets.

HTML, PNG and temporary responses stay in `.stitch/.cache/`, outside Git. The documented design and import records use LF to preserve their hashes. Review the differences in Stitch's native export before using it as a redesign baseline.

## Selected design

The public site at `/` has a responsive gallery, booking process, contact options and Motion animations. Its portfolio contains the eight existing photographs and four recorded-view projects, with optional drawing animation integrated into the artwork viewer. The removed `/designs/ink-study` URL renders the noindex not-found page.

See [routes, interactions and validation](docs/design-previews.md). Run `rtk vp dev` to view the site locally.

## Project map

```text
index.html                 Page metadata and HTML entry point
public/logo.svg            Logo
src/main.tsx               React mount
src/Entry.tsx              Public entry point and route compatibility
src/app/                   Site composition, layout and route handling
src/sections/              Public page sections
src/features/portfolio/    Gallery, artwork viewer, data and interaction state
  data/                    Artwork collection, drawing data and video studies
  viewer/                  Drawing animation and recorded-view components
    hooks/                 Drag, drawing playback and image/video view state
  utils/                   Drawing, timeline and recorded-view calculations
  styles.ts                Shared gallery and artwork-dialog class constants
src/components/ui/         Shared shadcn/Radix primitives and carousel
src/content/site.ts        Shared artist and contact content
src/motion/                Shared motion behavior and feature loading
src/styles/site.ts         Shared site class constants
src/assets/images/         WebP images and their exports
src/lib/                   CSS class utilities
src/global.css             Tailwind v4, local fonts and semantic tokens
tests/unit/app/             Route-resolution unit tests
tests/unit/portfolio/       Pure drawing, view and timeline tests
tests/integration/app/      Hosting route configuration checks
tests/integration/portfolio/ Portfolio collection and public media checks
tests/e2e/app/              Public site and navigation flows
tests/e2e/portfolio/        Gallery, viewer and media interactions
tests/fixtures/ink-views/   Vite-served viewer fixture and synthetic images
```

Shared artist and contact content lives in `src/content/site.ts`; portfolio data lives with its feature. Keep public copy in English unless a language change is explicitly requested.

## Module exports

A source module with exactly one exported symbol uses `export default`; its consumers use a default import. Modules exposing multiple symbols keep named exports, including shared UI primitives and modules that expose both values and types. Import types with `import type` when they are only used for type checking.

For example, [portfolio styles](src/features/portfolio/styles.ts) exports one class map:

```typescript
const portfolioStyles = {
  // Shared gallery and artwork-dialog classes.
};

export default portfolioStyles;
```

Its consumers import it directly:

```typescript
import portfolioStyles from "./styles";
```

## Component system

Shared primitives power the public site's navigation, artwork viewer, gallery and booking/contact flows. The site has one public design; former comparison views and the development catalog are not part of the app.

`rtk vpr check-all` checks formatting, lint, types and Tailwind classes across TS/TSX files. `rtk vpr test:e2e` builds the app and runs Playwright; Windows uses installed Chrome, while Linux requires `rtk vpx playwright install --with-deps chromium`.
