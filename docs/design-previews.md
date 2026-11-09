# Selected design: A

Proposal A is the public site at `/`. Start the app with `rtk vp dev` and open the displayed address. The gallery has twelve works: the eight existing photographs and four recorded-view projects. The artist, booking process and contact options remain on one page with English public-facing copy.

| Route                                                | Current behavior                                     |
| ---------------------------------------------------- | ---------------------------------------------------- |
| `/`                                                  | Public site A, indexable, without the design catalog |
| `/#portfolio`                                        | Full gallery                                         |
| `/#about`                                            | Artist and philosophy                                |
| `/#process`                                          | Booking process and policies                         |
| `/#contact`                                          | Contact options                                      |
| `/designs/ink-study`                                 | Redirects to `/#portfolio`, preserving the query     |
| `/__ui?view=ink-study`                               | Development-only ink animation study, noindex        |
| `/designs`, `/designs/a`, `/designs/b`, `/designs/c` | Home page for the selected site                      |
| `/designs/c/portfolio`                               | `/#portfolio`                                        |
| `/designs/c/about`                                   | `/#about`                                            |
| `/designs/c/contact`                                 | `/#contact`                                          |

Local route compatibility replaces the URL through the History API and preserves query parameters. Section paths retain their existing hash, as in `/designs/c/about?source=shared#booking` becoming `/?source=shared#booking`; the retired ink-study path always targets `/#portfolio`. Unknown routes show a page with a link back to the home page and are marked noindex. The design catalog and B/C do not load in the public app; their source and Stitch references are retained.

## Implementation and interactions

- `src/Entry.tsx` mounts the selected site and imports `global.css`, which provides Tailwind, fonts and theme tokens.
- `src/designs/DesignApp.tsx` composes the public navigation, A and footer. The ink study is loaded only by the development catalog; unknown public routes receive noindex metadata.
- `SinglePageDesign.tsx` contains composition A; `content.ts` reuses the existing biography and philosophy and centralizes photographs and contact details.
- `components.tsx` contains the gallery, shared dialog, booking process and contact options. The public gallery preserves the eight photo IDs and adds four recordings; only an opened recording loads its video, and drawing data loads after the visitor chooses Play drawing.
- Motion provides staggered entrances, image reveals, scroll effects, cursor and press responses, reading progress and dialog transitions. Reduced-motion preference is respected on load and when changed while the page is open.
- The image viewer preserves full images, manual button and arrow-key navigation, Escape to close, and focus restoration. During its exit animation, the modal remains active until the native dialog closes.
- The mobile menu uses a native dialog, and booking questions use `details/summary`. The skip-to-content link and visible focus are retained.
- Deposit policies appear before the contact options. Links reuse the project's account names, email and phone number. Social account ownership still needs confirmation before publication.
- `vercel.json` configures permanent redirects from the four legacy base paths to the home page. The study and legacy section paths use the SPA rewrite; `Entry.tsx` sends the retired study path to `/#portfolio` and preserves its query. See [Vercel project configuration](https://vercel.com/docs/project-configuration/vercel-json#redirects). This configuration does not deploy the site.

## Styling and tests

All retained designs in `src/designs/`, including B/C and the development study, use Tailwind v4 utilities. `styles.ts` groups shared primitives; individual compositions keep their class constants beside the component. `designs.css` and the five CSS Modules were removed. `global.css` is the Tailwind entry point and contains the project tokens. Motion values and SVG geometry are still calculated at runtime.

Vitest tests live under `tests/designs/`. Vitest discovery is limited to `tests/`, and TypeScript includes that directory. `rtk vp run lint:tailwind` checks all of `src/`; `rtk vp run lint:tailwind:fix` applies automatic fixes. `check-all` includes this check. Editor class extraction covers the `styles` and `designStyles` constants as well as `className` and `cn`.

The transitive parser used by `tailwind-lint` 0.16.0 is aligned with its v3 dependencies through a version-scoped override for `@tailwindcss/language-service` in `pnpm-workspace.yaml`; `pnpm peers check` verifies that no peer conflicts remain.

## Tailwind migration validation

The final `tailwind-lint` 0.16.0 review reported zero errors and zero warnings across 46 files, with none omitted. `check-all` and the production build passed. At that point, the suite ran 40 cases across two files under `tests/designs/`; CI requires the suite to be present.

Chrome checked 28 combinations: A, the study, B and C's four retained pages at 320, 390, 768 and 1440 pixels. B/C ran in a local preview without changing public routes. There were no broken images, horizontal overflow or runtime errors. Checks covered the sticky header, menu, viewer, arrow keys and Escape, focus restoration, disclosures, anchors, drawing speed, replay, original image, resizing and live reduced-motion changes. All 884 geometry and typography comparisons for A and the study matched the previous reference. Data, paths and behavior helpers were preserved. Firefox and Safari were not checked.

## Public recorded views and the development ink study

The public gallery includes Ghostface, Portrait, Flowers and Color sleeve as separate recorded-view projects alongside the eight existing photographs. Each opens in the shared artwork dialog on its finished photo. The selected video loads on demand; visitors can choose Play drawing for any of those four projects, Gorilla or Owl. Drawing data loads only after that action. Speed and Skip drawing appear during playback, and recorded projects return to the frontal view when drawing finishes. A drawing-data failure leaves the video available with a retry action. The original photo stays in the same dialog.

`/designs/ink-study` redirects to `/#portfolio`, preserving its query string. The development demo remains at `/__ui?view=ink-study` and is noindex. It retains the detailed drawing and recorded-view controls without becoming a public route. Viewer behavior and footage limitations are documented in [tattoo-videos.md](tattoo-videos.md).

### Drawing behavior in the development demo

At normal speed (1×), the sequence lasts 12 seconds: contours draw from 0–3 s; the same machine adds shading and detail over a black-and-white photo from 3–8 s; a second pass adds color from 8–11 s; and the complete original photo appears from 11–12 s. SVG masks reveal each pass within the artwork: the needle follows the endpoint that uncovers each area and hides between strokes. Contours fade during shading. Source photos remain unchanged; the final view applies a subtle black enhancement inside the tattoo region. The paths and timing are approximate and do not represent the real tattooing process. Simulating bare skin before the ink appears is outside this prototype.

Black enhancement uses an SVG layer clipped to each piece's region and favors neutral dark tones over warm skin and color reflections. It follows the shading and color passes, then remains in the final view. “Show original” ends the animation and removes the enhancement for comparison; Replay restores it. The viewer always opens the original photo. The region is approximate, and color filtering is not a precise skin-and-ink segmentation.

Each photo has a “Drawing speed” control from 0.25× to 2×. It can be changed before, during or after playback. Changing it preserves the current drawing position and synchronizes contours, machine, shading and color. Replay uses the selected speed, and the displayed duration updates accordingly. The control supports keyboard input and is disabled when reduced motion is enabled or effect preparation fails.

In the development demo, playback starts once per photo after it loads and at least 25% of its frame is visible. Each photo can be opened in the existing viewer; its animation can be replayed even while it is running, or the original can be shown immediately. Reduced motion, whether enabled at load or changed live, stops the effect and shows the original; turning it off does not start playback again. If path preparation fails, the static photo remains visible. The demo uses two columns on desktop and one column at widths up to 720 pixels. In the public portfolio, drawing is always initiated by the visitor.

## Validation of selected design A

`check-all` and the build passed, along with the 50 existing and migration tests. A Chrome production-build review checked the home page at 320, 390, 768 and 1440 pixels; all seven legacy routes and two query/hash cases; the absence of the comparison catalog and noindex on the home page; undistorted photos; keyboard use of the menu and viewer with focus restoration; reduced motion; the retained study and its return navigation; and noindex on unknown pages. There were no runtime errors. Vercel redirects were configured and test-checked without deploying; local URL transitions were checked in the browser.

## Validation

```powershell

rtk vp run check-all

rtk vp test

rtk vp run build

```

Route tests cover the home page, the ink-study redirect, seven legacy routes and their trailing slashes, query parameters and hashes, unknown routes, and consistency with hosting configuration. The development catalog remains noindex and is not included in production.

An earlier validation after the A/C refinements passed `check-all`, the build and all nine route tests. Chrome covered 24 route-and-size combinations (320, 390, 768 and 1440 pixels), including B as a reference and C's four pages. Checks included original aspect ratios, compact spacing, keyboard order, resizing, viewer and menu exit animations, Escape and focus restoration, keyboard-operated questions, hash links, the start and completion of the actual drawing animation, and reduced motion both on load and when changed while the page was open. There were no runtime errors or ResizeObserver loops. Firefox and Safari were not tested.

For the photo study, `check-all`, `test` and `build` passed with 50 tests. Chrome covered both photos at 320, 390, 768 and 1440 pixels; all three stages and the final state; needle position; image proportions and layer alignment while resizing; replay during playback; cancellation; reduced motion at load and live; keyboard input; the viewer and focus restoration. Empty or zero-length paths, slow loads canceled before completion, and loads finishing off-screen were also checked. Rasterized masks confirmed that shading and color advance with the needle and cover the target region at the end of each pass. The catalog, direct load, reload and trailing slash worked. There were no runtime errors. Firefox and Safari were not tested.

The enhancement review compared every pixel in both photos: none outside the mask changed. Ink samples darkened while interior skin, the red iris and blue reflection stayed unchanged. The original comparison, Replay, reduced motion at load and live, the viewer, focus restoration, fallback and four viewport widths were checked in Chrome.

Visual references and original exports remain in [the Stitch proposals](../.stitch/designs/redesign-2026-10-31/README.md).

## Ink angle studies

The earlier frame sequences remain in the [ink angle study](ink-angle-study.md). The four prepared video studies are documented in [tattoo videos](tattoo-videos.md).

## Component system migration

All retained versions share the VicentArt dark theme and shadcn/Radix primitives. The development-only `/__ui` catalog contains A, B, C's four pages, the legacy App, the ink study and component states. Legacy section redirects keep their target hashes; `/designs/ink-study` redirects to the public portfolio. The latest local checks, run November 6, 2026, passed: `check-all`, the production build, 64 Vitest tests and all 92 Playwright tests. Earlier Chrome review confirmed local fonts, no production catalog and reduced-motion behavior for the ink study; the supplied desktop/mobile captures were marked ready in an independent visual review. See [the component standard](component-system.md).
