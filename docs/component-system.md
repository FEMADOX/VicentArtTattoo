# Shared component system

The shared CSS source is src/global.css; components.json points shadcn there. Components live in src/components/ui/, use Radix behavior, and import cn from @/lib/utils. Call sites use variants for appearance and className for layout. DaisyUI and react-icons were removed; lucide-react supplies the consistent icon set. The shadcn CLI is a development dependency.

## Foundations

background, foreground, body, surface, card, popover, muted-foreground, border, input, ring, and link are semantic color utilities. border is decorative; input is the stronger interactive boundary. The dark palette is on :root, and html.dark plus color-scheme: dark keep browser controls and portals coherent.

Use font-display, font-body, and font-mono. Local WOFF2 files include their OFL licenses and SHA-256 provenance in src/assets/fonts/README.md. Only regular normal Latin fonts ship. Legacy font aliases temporarily resolve to the new families. The fixed type ramp is 12, 14, 16, 18, 20, 24 and 30px; display headings can use the documented fluid scale.

--design-bg, --design-surface, --design-border, --design-muted, and --design-header-height preserve the design-version interface. Durations are --duration-fast (150ms), --duration-overlay (240ms), and --duration-image (500ms), with --ease-out. The entire corner scale is zero; use rounded-full explicitly for controls.

## Components and composition

- Button: existing variants and sizes, asChild, native button props/ref. data-preview-state pins catalog examples without overriding real states. Disabled uses native disabled.
- Dialog: standard Trigger, Close, Content, Header, Footer, Title, Description, Portal and Overlay exports. Content supports showCloseButton; provide an accessible close action when false. Every dialog needs a Title and a Description, visibly or with sr-only.
- Sheet: standard Root, Trigger, Close, Content, Header, Footer, Title and Description exports. Content supports side and showCloseButton. Use for mobile navigation, with a Title and Description.
- Accordion: Root, Item, Trigger and Content. Pass a unique value per Item; preserve the Root single or multiple type contract.
- Slider: controlled value/onValueChange arrays or defaultValue; aria-label, aria-labelledby, aria-describedby, and aria-valuetext reach the actual thumb. Supply a meaningful label and value text for opacity.
- Carousel: existing Embla API, orientation, plugins and exports. Arrow controls are 44px. The calling section owns autoplay decisions.

Portal overlays use layers 80/81, above page navigation. Both entering and exiting animations last 240ms; global reduced-motion rules suppress nonessential movement. Dialog content scrolls within a mobile dynamic viewport. These are shared component responsibilities, not caller-specific patches.

## Development catalog

Run the development server and open /__ui. The nine choices are Components, Design A, Design B, Design C / Home, Design C / Portfolio, Design C / About, Design C / Contact, Legacy App, and Ink study. Only development loads this module; production keeps the public Design A entry. The catalog sets noindex/nofollow and retains view selection in the URL.

The Components choice contains real primary/outline Button specimens in normal, hover, focus, pressed and disabled states, all Button sizes, live Dialog and Sheet examples, Accordion, and enabled/disabled Sliders. The retained views exercise the complete compositions and carousel. Pinned states are inspectable examples; enabled controls still react to pointer and keyboard input.

## Verification record — 2026-11-02

The main task completed the following checks; counts describe separate runs and must not be added together as unique cases.

| Check                                   | Result and scope                                                                                                                                    |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit suite                              | 40 tests passed.                                                                                                                                    |
| Full end-to-end suite                   | 42 tests passed in the earlier integrated build/browser run.                                                                                        |
| Subsequent catalog/state regression run | 34 tests passed.                                                                                                                                    |
| Subsequent C / About regression run     | 5 tests passed.                                                                                                                                     |
| Final check-all                         | Passed: formatting checked 22 files, quality checked 54 files, TypeScript passed, and Tailwind scanned all 49 source TS/TSX files with zero issues. |
| Final production build                  | Passed both build steps; emitted CSS was 69.26KB and all three local WOFF2 files were present.                                                      |
| Independent visual finish review        | Ship, with no findings in the eight required desktop/mobile captures.                                                                               |

The visual review is scoped to the supplied captures in .impeccable/review/final; the retained-view captures are in .impeccable/review/catalog. This is not a claim of exhaustive browser, device, or WCAG certification. A separate actual-Chrome production-route smoke check is tracked by the main task.

The design detector ran once. Its font advisories were addressed through the shared fixed type ramp, but it was not rescanned; no zero-advisory detector result is claimed. The user-pinned direction and code-led compositions were preserved. No new raster assets were generated, and the existing artwork is unchanged.

The implementation adds no backend or new user claims. Local fonts cover normal Latin weight 400; add an explicitly licensed subset or weight only if future content requires it.

### Final production smoke

Chrome checked the final production build: the public homepage renders Design A and loads all three local fonts without failed resources; `/__ui` and `/__ui/` render the noindex not-found page, with no catalog; the ink study retains noindex and completes immediately with reduced motion while disabling speed/replay. No browser errors occurred. Evidence is local at `.impeccable/review/production-smoke.json`; QA servers were stopped without touching the user's development server. Firefox and WebKit were not tested.
