<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Running Scripts

Run TypeScript and JavaScript files with `vpx <file>`, for example `vpx ./scripts/seed.ts --dry-run`. It handles enums, decorators, JSX, and tsconfig `paths`, so do not add `tsx` or `ts-node` to run scripts. `vpx --watch <file>` reruns the file when a file it uses changes, in place of `tsx watch`. `vp node <file>` runs plain Node.js.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

## Repository-specific working guide

### Commands and toolchain

- Prefix every shell command with `rtk`. On native Windows, do not use `rtk ls`; use `rtk rg --files`, `rtk find`, or `rtk proxy powershell -NoProfile -Command "..."` for a raw PowerShell command.
- Check `package.json` before choosing a command. Use `rtk vp run <script>` for project scripts; `rtk vp <command>` invokes a Vite+ built-in. Use `rtk vp install` to install dependencies and `rtk vp dev` to start the app.
- The project pins Node.js `26.13.0` in `.node-version` and pnpm `12.16.1` in `packageManager`.
- `rtk vp run check` runs the project check with warnings denied; `rtk vp run tsc` invokes the TypeScript build check; `rtk vp run check-all` runs both plus `rtk vp run lint:tailwind`. `rtk vp run test` and `rtk vp run test:watch` invoke Vitest. Tests belong in root `tests/`: Vitest covers `tests/designs/`, while Playwright covers `tests/e2e/` separately. `rtk vp run test:e2e` builds before starting the browser suite.
- Use `rtk vp run build` for the full project build: the `build` script runs the TypeScript build before Vite+. Calling `rtk vp build` alone skips the script's TypeScript build step.

### Project map and conventions

- This is a static React + TypeScript single-page site. There is no backend, API, or required environment variable.
- `src/main.tsx` mounts `Entry.tsx`; the public site is Design A through `src/designs/DesignApp.tsx`. The retained `App.tsx`, B and C are available only in the development catalog at `/__ui`.
- `src/components/ui/` contains shared shadcn/Radix controls and the Embla carousel. `src/hooks/` contains navigation and carousel state; `src/common/` contains static content, navigation data, and types; `src/assets/images/` contains the WebP artwork.
- `src/global.css` owns Tailwind v4, the global fixed dark theme, local fonts and semantic tokens. Use `DESIGN.md` and `docs/component-system.md` as the visual/component standard. DaisyUI has been removed; use shared primitives instead of introducing another control implementation.
- Design components under `src/designs/` use Tailwind v4 utilities, with shared class primitives in `styles.ts`; keep Motion values and SVG geometry dynamic. Tailwind lint explicitly scans every source TS/TSX file; do not replace that glob with autodiscovery, which may only inspect the CSS entry. Run `rtk vp run lint:tailwind:fix` for canonical classes and finish with `rtk vp run lint:tailwind` to verify zero diagnostics. Keep flat class maps detectable by the editor class extraction settings.
- Page copy is in English. Keep it in English unless a language change is explicitly requested.
- JavaScript and TypeScript style uses the `standardTsStyle` Stylistic rules in `vite.config.ts`, executed through Oxlint. This includes `function name ()`. Oxfmt excludes JS/TS and owns other formats. Keep these owners separate; preserve their shared formatting exclusions. Use `rtk vp run format` (format plus safe lint fixes) and `rtk vp run format:check` to cover both. VS Code saves JS/TS through `source.fixAll.oxc`. Stylistic does not automatically reflow JS/TS to the editor's 80-column guide.
- Oxlint applies one fix pass. Overlapping fixes may need another `rtk vp run format`; always finish with `rtk vp run format:check` rather than assuming all fixes were applied. Do not suppress remaining diagnostics to make a hook pass.
- The project uses CodeGraph for source exploration and dependency relationships; follow the workflow below.
- Treat bundled/generated skill material under `.agents/skills/` as read-only reference. Do not generate, copy, or modify those skills as part of project work.

### CodeGraph

- The local index lives in `.codegraph/` and is ignored by Git. Shared exclusions are in `codegraph.json`; application source under `src/components/ui/`, `src/lib/`, and `src/assets/images/` remains indexed.
- When the index exists, call the CodeGraph MCP `codegraph_explore` before searching or reading code to understand symbols, call paths, or a planned edit. Pass the absolute project root as `projectPath` and name the relevant files or symbols. Treat returned source as already read.
- CLI fallback: `rtk codegraph explore "App PortfolioCarousel useCarousel"`. The active MCP watches source and exclusion changes; `rtk codegraph sync` provides manual synchronization and `rtk codegraph status` reports pending changes. A full `rtk codegraph index` rebuild requires releasing any active MCP writer first; never delete a live writer's lock.
- If `.codegraph/` is missing, use normal repository tools until the local index is initialized. The README documents setup for a fresh clone.

### Change and review boundaries

- Inspect `rtk git status --short` before editing. Preserve existing dirty changes, keep the patch scoped to the requested work, and do not run whole-repository format or fix commands unless their effects are intended.
- Report only validation commands actually run and their actual results. Distinguish static source inspection from build, test, and browser verification. An empty test suite is not a passing test suite.
- For tooling-only tasks, keep unrelated UX changes separately scoped.

### Delegation

- Delegate when two or more independent workstreams materially benefit from parallel execution. Keep requirements, decisions, coordination, and the final result with the primary agent.
- Use the smallest useful team and prefer `repo_explorer`, `reviewer`, `test_runner`, and `docs_researcher` when they fit. Give each agent a bounded task; partition file ownership for edits and require preservation of others' changes.
- Subagents must not spawn more agents unless their parent explicitly requests it.
- Default spawned agents to available `gpt-6-luna` with `max` reasoning. For complex or high-impact analysis, debugging, architecture, or reviews, use `gpt-6.1-sol` with `medium` or higher reasoning. Preserve explicit specialist settings and report material exceptions or model fallbacks. Do not spawn merely to reroute a trivial task.
