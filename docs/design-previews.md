# Public site and historical design previews

The public site at `/` is a single page. Start the app with `rtk vp dev` and open the displayed address. The gallery has twelve works: the eight existing photographs and four recorded-view projects. The artist, booking process and contact options remain on one page with English public-facing copy.

| Route                                                | Current behavior                            |
| ---------------------------------------------------- | ------------------------------------------- |
| `/`                                                  | Public portfolio, indexable                 |
| `/#portfolio`                                        | Full gallery                                |
| `/#about`                                            | Artist and philosophy                       |
| `/#process`                                          | Booking process and policies                |
| `/#contact`                                          | Contact options                             |
| `/designs/ink-study`                                 | Removed; renders the noindex not-found page |
| `/designs`, `/designs/a`, `/designs/b`, `/designs/c` | Home page                                   |
| `/designs/c/portfolio`                               | `/#portfolio`                               |
| `/designs/c/about`                                   | `/#about`                                   |
| `/designs/c/contact`                                 | `/#contact`                                 |

Local route compatibility replaces the URL through the History API and preserves query parameters. Section paths retain their existing hash, as in `/designs/c/about?source=shared#booking` becoming `/?source=shared#booking`. Unknown routes show a page with a link back to the home page and are marked noindex. The former comparison designs, `/__ui` catalog and `/designs/ink-study` route are removed; legacy design URLs are compatibility redirects only.

## Implementation and interactions

- `src/Entry.tsx` mounts the public site and imports `global.css`, which provides Tailwind, fonts and theme tokens.
- `src/app/` composes the public navigation, page and footer and handles compatibility routes.
- `src/sections/` contains the public page sections; `src/features/portfolio/` owns artwork interactions, data and viewer state. Shared artist/contact content, motion behavior and site-wide classes live in `src/content/`, `src/motion/` and `src/styles/`.
- `src/components/ui/` contains the shared shadcn/Radix controls and Embla carousel. Only an opened recording loads its video, and drawing data loads after the visitor chooses Play drawing.
- Motion provides staggered entrances, image reveals, scroll effects, cursor and press responses, reading progress and dialog transitions. Reduced-motion preference is respected on load and when changed while the page is open.
- The image viewer preserves full images, manual button and arrow-key navigation, Escape to close, and focus restoration. During its exit animation, the modal remains active until the native dialog closes.
- The mobile menu uses a native dialog, and booking questions use `details/summary`. The skip-to-content link and visible focus are retained.
- Deposit policies appear before the contact options. Links reuse the project's account names, email and phone number. Social account ownership still needs confirmation before publication.
- `vercel.json` configures permanent redirects from the four legacy base paths to the home page. The study and legacy section paths use the SPA rewrite; `Entry.tsx` renders the removed study path as a noindex not-found page. See [Vercel project configuration](https://vercel.com/docs/project-configuration/vercel-json#redirects). This configuration does not deploy the site.

## Styling and tests

Public sections in `src/sections/` and portfolio components in `src/features/portfolio/` use Tailwind v4 utilities. Site-wide and portfolio visual primitives live in `src/styles/site.ts` and `src/features/portfolio/styles.ts`. `designs.css` and the five CSS Modules were removed. `global.css` is the Tailwind entry point and contains the project tokens. Motion values and SVG geometry are still calculated at runtime.

Vitest covers pure logic in `tests/unit/` and checks integrations with bundled portfolio data and hosting configuration in `tests/integration/`. Playwright recursively discovers `tests/e2e/app/` and `tests/e2e/portfolio/`. The Vite-served image fixture remains in `tests/fixtures/ink-views/` because its URL is referenced by browser specs. TypeScript includes all of `tests/`. `rtk vpr lint:tailwind` checks all of `src/`; `rtk vpr lint:tailwind:fix` applies automatic fixes. `check-all` includes this check. Editor class extraction covers the `styles`, `portfolioStyles` and `siteStyles` constants as well as `className` and `cn`.

The transitive parser used by `tailwind-lint` 0.16.0 is aligned with its v3 dependencies through a version-scoped override for `@tailwindcss/language-service` in `pnpm-workspace.yaml`; `pnpm peers check` verifies that no peer conflicts remain.

## Historical Tailwind migration validation

These results describe the earlier migration and comparison-design review, before the current cleanup. They are not validation of the current checkout. The final `tailwind-lint` 0.16.0 review reported zero errors and zero warnings across 46 files, with none omitted. `check-all` and the production build passed. At that point, the suite ran 40 cases across two files under `tests/designs/`; CI required the suite to be present.

Chrome checked 28 combinations: A, the study, B and C's four retained pages at 320, 390, 768 and 1440 pixels. B/C ran in a local preview without changing public routes. There were no broken images, horizontal overflow or runtime errors. Checks covered the sticky header, menu, viewer, arrow keys and Escape, focus restoration, disclosures, anchors, drawing speed, replay, original image, resizing and live reduced-motion changes. All 884 geometry and typography comparisons for A and the study matched the previous reference. Data, paths and behavior helpers were preserved. Firefox and Safari were not checked.

## Public drawing and recorded views

The public gallery includes Ghostface, Portrait, Flowers and Color sleeve as separate recorded-view projects alongside the eight existing photographs. Each opens in the shared artwork dialog on its finished photo. The selected video loads on demand; visitors can choose Play drawing for any of those four projects, Gorilla or Owl. Drawing data loads only after that action. Speed and Skip drawing appear during playback, and recorded projects return to the frontal view when drawing finishes. A drawing-data failure leaves the video available with a retry action. The original photo stays in the same dialog.

Drawing and recorded-view controls are integrated into the public portfolio's artwork viewer. `/designs/ink-study` is removed and renders the noindex not-found page. Viewer behavior and footage limitations are documented in [tattoo-videos.md](tattoo-videos.md).

### Drawing behavior in the public portfolio

At normal speed (1×), the sequence lasts 12 seconds: contours draw from 0–3 s; the same machine adds shading and detail over a black-and-white photo from 3–8 s; a second pass adds color from 8–11 s; and the complete original photo appears from 11–12 s. SVG masks reveal each pass within the artwork: the needle follows the endpoint that uncovers each area and hides between strokes. Contours fade during shading. Source photos remain unchanged; the final view applies a subtle black enhancement inside the tattoo region. The paths and timing are approximate and do not represent the real tattooing process. Simulating bare skin before the ink appears is outside this prototype.

Black enhancement uses an SVG layer clipped to each piece's region and favors neutral dark tones over warm skin and color reflections. It follows the shading and color passes, then remains in the final view. “Show original” ends the animation and removes the enhancement for comparison; Replay restores it. The viewer always opens the original photo. The region is approximate, and color filtering is not a precise skin-and-ink segmentation.

Each photo has a “Drawing speed” control from 0.25× to 2×. It can be changed before, during or after playback. Changing it preserves the current drawing position and synchronizes contours, machine, shading and color. Replay uses the selected speed, and the displayed duration updates accordingly. The control supports keyboard input and is disabled when reduced motion is enabled or effect preparation fails.

The visitor starts playback from the artwork viewer. The animation can be replayed or the original shown immediately. Reduced motion, whether enabled at load or changed live, stops the effect and shows the original; turning it off does not start playback again. If path preparation fails, the static photo remains visible.

## Historical validation of the selected design

These results apply to an earlier revision and do not verify the current checkout. `check-all` and the build passed, along with the 50 then-existing and migration tests. A Chrome production-build review checked the home page at 320, 390, 768 and 1440 pixels; all seven legacy routes and two query/hash cases; the absence of the comparison catalog and noindex on the home page; undistorted photos; keyboard use of the menu and viewer with focus restoration; reduced motion; the retained study and its return navigation; and noindex on unknown pages. There were no runtime errors. Vercel redirects were configured and test-checked without deploying; local URL transitions were checked in the browser.

## Validation commands and historical records

```powershell

rtk vpr check-all

rtk vp test

rtk vpr build

```

### Historical route coverage

At the time of that run, route tests covered the home page, the ink-study redirect, seven legacy routes and their trailing slashes, query parameters and hashes, unknown routes, and consistency with hosting configuration. The development catalog was noindex and excluded from production in that revision.

An earlier validation after the A/C refinements passed `check-all`, the build and all nine route tests. Chrome covered 24 route-and-size combinations (320, 390, 768 and 1440 pixels), including B as a reference and C's four pages. Checks included original aspect ratios, compact spacing, keyboard order, resizing, viewer and menu exit animations, Escape and focus restoration, keyboard-operated questions, hash links, the start and completion of the actual drawing animation, and reduced motion both on load and when changed while the page was open. There were no runtime errors or ResizeObserver loops. Firefox and Safari were not tested.

For the earlier photo study, `check-all`, `test` and `build` passed with 50 tests. Chrome covered both photos at 320, 390, 768 and 1440 pixels; all three stages and the final state; needle position; image proportions and layer alignment while resizing; replay during playback; cancellation; reduced motion at load and live; keyboard input; the viewer and focus restoration. Empty or zero-length paths, slow loads canceled before completion, and loads finishing off-screen were also checked. Rasterized masks confirmed that shading and color advance with the needle and cover the target region at the end of each pass. The catalog, direct load, reload and trailing slash worked. There were no runtime errors. Firefox and Safari were not tested.

The enhancement review compared every pixel in both photos: none outside the mask changed. Ink samples darkened while interior skin, the red iris and blue reflection stayed unchanged. The original comparison, Replay, reduced motion at load and live, the viewer, focus restoration, fallback and four viewport widths were checked in Chrome.

Visual references and original exports remain in [the Stitch proposals](../.stitch/designs/redesign-2026-10-31/README.md).

## Ink angle studies

The earlier frame sequences remain in the [ink angle study](ink-angle-study.md). The four prepared video studies are documented in [tattoo videos](tattoo-videos.md).

## Historical component-system migration validation

The migration used the VicentArt dark theme and shadcn/Radix primitives. At that revision the `/__ui` catalog contained A, B, C's four pages, the legacy App, the ink study and component states. Legacy section redirects kept their target hashes; `/designs/ink-study` redirected to the public portfolio. The latest local checks recorded there, on November 6, 2026, passed: `check-all`, the production build, 64 Vitest tests and all 92 Playwright tests. Earlier Chrome review confirmed local fonts, no production catalog and reduced-motion behavior for the ink study; the supplied desktop/mobile captures were marked ready in an independent visual review. These are historical results, not current validation. See [the component standard](component-system.md).
