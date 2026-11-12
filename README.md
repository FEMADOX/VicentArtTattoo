# VicentArt Tattoo

A single-page portfolio website presenting VicentArt's work and contact information. The site's interface and public-facing copy are in English.

## Technology

- React 19 and TypeScript
- Vite+ as the development and build toolchain
- Tailwind CSS v4 with shared shadcn/Radix UI components
- Embla Carousel for the gallery

This is a static frontend application. It has no backend and requires no environment variables to run.

## Development

The project pins Node.js `26.13.0` in `.node-version` and pnpm `12.16.1` in `packageManager`.

The commands below require the [Vite+ CLI](https://viteplus.dev/guide/) and RTK on `PATH`. VS Code extension recommendations and quality/build tasks are in `.vscode/`.

```powershell
vp install
vp dev
```

Vite prints the local address in the terminal when the server starts.

## Commands

```powershell
vpr check
vpr tsc
vpr check-all
vpr lint:tailwind
vpr lint:tailwind:fix
vpr test
vpr test:watch
vpr build
vp preview
```

Use `vpr <script>` to run project-defined scripts. In particular, `vpr build` runs the TypeScript build before the Vite build; `vp build` runs only the built-in build command. Vitest discovers `*.test.ts`, `*.test.tsx`, `*.spec.ts` and `*.spec.tsx` files under `tests/`; TypeScript checks that directory too. `check-all` runs formatting, lint, type checks and `tailwind-lint`.

Designs in `src/designs/` use Tailwind v4 utilities and reusable class constants, without dedicated stylesheets or CSS Modules. `src/global.css` contains the Tailwind entry point, local fonts and shared dark theme. `DESIGN.md` and [the component system](docs/component-system.md) document the shadcn/Radix standard; DaisyUI has been removed. `lint:tailwind:fix` canonicalizes utility classes; conflicts without an automatic fix are reviewed manually. Editor settings include the `styles` and `designStyles` constants in class extraction.

## Formatting

Style is configured in `vite.config.ts` and run through Vite+. [Stylistic](https://eslint.style/) runs as an Oxlint plugin for JavaScript and TypeScript; [Oxfmt](https://viteplus.dev/guide/fmt) formats CSS, JSON and the other enabled file types.

```powershell
vpr format
vpr format:check
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
codegraph init
codegraph status
codegraph explore "App PortfolioCarousel useCarousel"
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

Proposal A is the public site at `/`, with a responsive gallery, booking process, contact options and Motion animations. Its portfolio contains the eight existing photographs and four recorded-view projects. The comparison catalog and proposals B/C are no longer public; their legacy links go to the home page or the matching section. The ink animation study remains development-only at `/__ui?view=ink-study`; `/designs/ink-study` redirects to `/#portfolio`.

See [routes, interactions and validation](docs/design-previews.md). Run `vp dev` to view the site locally.

## Project map

```text
index.html                 Page metadata and HTML entry point
public/logo.svg            Logo
src/main.tsx               React mount
src/Entry.tsx              Public entry point and route compatibility
src/designs/DesignApp.tsx   Public site, navigation and legacy-route handling
src/designs/styles.ts       Shared Tailwind visual primitives
src/App.tsx                Migrated legacy version, available in the local catalog
src/components/            Navigation, page sections and components
src/components/ui/         Shared shadcn/Radix primitives and carousel
src/hooks/                 Navigation and carousel state
src/common/                Navigation data, accordion copy and types
src/assets/images/         WebP images and their exports
src/lib/                   CSS class utilities
src/global.css             Tailwind v4, local fonts and semantic tokens
src/dev/                   Development-only catalog at /__ui
tests/designs/             Vitest route and ink animation tests
tests/e2e/                 Playwright interaction and responsive tests
```

Page copy lives mainly in `src/components/` and `src/common/`. Keep it in English unless a language change is explicitly requested.

## Component system

Open `/__ui` with `vp dev` to review the shared primitives, their states and the retained views. The catalog and modules for C and the legacy App are excluded from the public build; legacy paths still redirect to the home page. Variant B shares A's composition module, though its public route remains retired.

`vpr check-all` checks formatting, lint, types and Tailwind classes across TS/TSX files. `vpr build` also checks that development-only code stays out of the generated JavaScript. `vpr test:e2e` builds the app and runs Playwright; Windows uses installed Chrome, while Linux requires `vpx playwright install --with-deps chromium`.
