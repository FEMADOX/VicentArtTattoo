---
name: Vicentart Tattoo Artist
colors:
  page-background: "#000000"
  page-text: "#ffffff"
  navigation-surface-dark: "#1d232a"
  muted-copy: "#99a1af"
  soft-hover: "#d1d5dc"
  primitive-surface: "#ffffff"
  primitive-foreground: "#0a0a0a"
  primitive-primary: "#171717"
  primitive-primary-text: "#fafafa"
  primitive-secondary: "#f5f5f5"
  primitive-muted-copy: "#737373"
  primitive-border: "#e5e5e5"
  primitive-focus-ring: "#a1a1a1"
  primitive-destructive: "#e7000b"
typography:
  display:
    fontFamily: Cinzel
    fontSize: 48px
    fontWeight: "700"
    lineHeight: 48px
  section-heading:
    fontFamily: Cinzel
    fontSize: 36px
    fontWeight: "700"
    lineHeight: 40px
  navigation:
    fontFamily: Roboto
    fontSize: 20px
    fontWeight: "400"
    lineHeight: 28px
  body:
    fontFamily: system sans
rounded:
  base: 10px
  sm: 6px
  md: 8px
  lg: 10px
  xl: 14px
  portfolio-image: 16px
  full: 9999px
spacing:
  unit: 4px
  page-edge-mobile: 20px
  section-stack: 40px
  section-padding-vertical: 40px
  hero-top: 100px
  hero-max-width: 800px
  text-max-width: 512px
---

# Design System: Vicentart Tattoo Artist

## 1. Visual Theme & Atmosphere

The current page is a dark, high-contrast tattoo portfolio. A fixed tattoo-art background sits behind a black page layer, while white type and large centered headings keep the artist profile and booking details legible. Cinzel supplies the classical display voice; Roboto makes the navigation and small status text feel direct. The overall composition is image-led and sparse in its chrome: the page has one fixed navigation bar, open text sections, one image carousel, and one accordion rather than a collection of boxed cards.

Treat the color and spacing below as a transcription of the current source. The imagery itself supplies colors that are not represented by CSS tokens. Do not replace the artwork, invent a brand mark, add new accent colors, or turn the existing sections into new card layouts when generating a faithful baseline screen.

## 2. Color Palette & Roles

### Primary Foundation

The app shell and the page body explicitly use black (`bg-black`, `#000000`) in `src/App.tsx` and `index.html`. The main content wrapper uses white text (`text-white` in `src/App.tsx`). Portfolio and About panels also set `bg-black` in `src/components/PortfolioSection.tsx` and `src/components/AboutSection.tsx`. The image backdrop is `Background.webp`, fixed, centered, and contained (`src/App.tsx`); its colors come from the image asset rather than a declared token.

The navigation bar and mobile dropdown use DaisyUI's semantic `bg-base-100` surface and `shadow-sm` (`src/components/NavigationBar.tsx`, `src/components/MobileNavbar.tsx`). In the current captures, this surface resolves to dark blue-gray `#1d232a`, with computed color `oklch(0.2533 0.016 252.42)`. `src/App.css` enables DaisyUI but does not override `base-100`; preserve the semantic surface and the captured dark value.

### Accent & Interactive

The visible accent treatment stays neutral. Body copy uses Tailwind v4 `text-gray-400` (`#99a1af`); the GitHub hover state uses `hover:text-gray-300` (`#d1d5dc`) in `src/components/NavigationBar.tsx` and `src/components/Footer.tsx`. Portfolio images lower to 70% opacity on hover with a 200 ms opacity transition (`src/components/PortfolioCard.tsx`). No colored CTA is rendered on the page.

### Typography & Text Hierarchy

The source also defines shadcn-style semantic CSS tokens in `src/App.css`. Their source values and rounded sRGB equivalents are: background/card/popover `oklch(1 0 0)` / `#ffffff`; foreground/card-foreground/popover-foreground `oklch(0.145 0 0)` / `#0a0a0a`; primary `oklch(0.205 0 0)` / `#171717` with primary foreground `oklch(0.985 0 0)` / `#fafafa`; secondary, muted, and accent `oklch(0.97 0 0)` / `#f5f5f5`; muted foreground `oklch(0.556 0 0)` / `#737373`; border and input `oklch(0.922 0 0)` / `#e5e5e5`; ring `oklch(0.708 0 0)` / `#a1a1a1`; destructive `oklch(0.577 0.245 27.325)` / `#e7000b`. Hex values here are rounded sRGB conversions of the exact source OKLCH values.

These semantic tokens support the local UI primitive, while the rendered site mostly relies on the explicit black/white classes and DaisyUI theme classes described above. The same stylesheet contains a `.dark` token set, but the page source does not add a `.dark` class. Treat it as available stylesheet scaffolding, not as evidence of a theme toggle. Chart and sidebar tokens are generic theme defaults and are not used by this page.

### Functional States

The active desktop section is shown with DaisyUI's `tab-active` treatment; the tab strip uses `tabs-border` (`src/components/NavigationBar.tsx`, `src/hooks/useNavigation.ts`). On mobile, the hamburger changes to a close icon while the menu is open; selecting a link or clicking outside closes the menu (`src/components/MobileNavbar.tsx`). The accordion can show the initially open "Me" panel, the "My Philosophy" panel, or both panels closed (`src/hooks/useAccordion.ts`, `src/components/AboutAccordion.tsx`). The carousel advances automatically every 2 seconds and updates its "Slide N of M" label, where M is Embla's responsive `scrollSnapList().length`: captures show 6 on desktop and 8 on mobile. The asset list still contains eight images (`src/components/PortfolioCarousel.tsx`, `src/hooks/useCarousel.ts`).

The local `Button` primitive defines primary, destructive, outline, secondary, ghost, and link variants with a visible focus ring (`src/components/ui/button.tsx`), but no Button instance is mounted in the current page. Do not introduce those colors or button shapes into a faithful screen unless a button is present in the target state.

## 3. Typography Rules

### Hierarchy & Weights

`Cinzel` is loaded as a serif family and used for the brand label, hero title, and section and accordion headings (`src/App.css`, `src/components/NavigationBar.tsx`, `src/components/HomeSection.tsx`, `src/components/PortfolioSection.tsx`, `src/components/AboutSection.tsx`, `src/components/AboutAccordion.tsx`). The hero title is `text-5xl font-bold` (48 px, 700); section and accordion titles are `text-4xl font-bold` or `font-semibold` (36 px). The hero subtitle is sourced as `text-md`; retain that class-level baseline because it is not otherwise assigned a project-specific size.

`Roboto` is used for uppercase desktop navigation and the carousel count (`src/components/NavigationBar.tsx`, `src/components/PortfolioCarousel.tsx`). Navigation is `text-xl` (20 px), regular weight, with no custom tracking. The count is `text-lg` (18 px). Body copy inherits the system sans stack; About copy is gray and responsive (`text-lg`, then `sm:text-sm`, `md:text-lg`, and `xl:text-xl`). Captures confirm that Cinzel and Roboto load. `index.html` separately requests static 400/700 Google Font files while `src/App.css` requests broader variable ranges (Cinzel 400–900; Roboto 100–900); preserve the exact family names rather than substituting a similar serif or sans family.

### Spacing Principles

Tailwind's default spacing unit is 4 px (`node_modules/tailwindcss/theme.css`). The page uses that scale in broad, regular steps: 20 px horizontal section padding (`px-5`), 40 px vertical section padding and section spacing (`py-10`, `my-10`), a 100 px hero top offset (`mt-25`), 32 px accordion copy gaps (`gap-8`), and 20 px grid and flex gaps (`gap-5`). The hero is capped at 800 px (`max-w-200`); general copy uses `max-w-lg` (512 px), and About copy uses `max-w-150` (600 px).

## 4. Component Stylings

### Buttons

No buttons are rendered in the current page. The local shadcn-style primitive defaults to a compact 36 px `rounded-md` button with 16 px horizontal and 8 px vertical padding, plus primary, destructive, outline, secondary, ghost, and link variants (`src/components/ui/button.tsx`). Keep that as a source primitive only; the current visible interactions are links, checkboxes, tabs, and carousel gestures.

### Cards & Domain-Specific Containers

There are no separate content cards. The portfolio is a horizontal image carousel with eight WebP images. Each item occupies half the carousel width below the `sm` breakpoint and one quarter at `sm` and above; the image itself is 320 × 320 px, cropped with `object-cover`, rounded to 16 px, and fades on hover (`src/components/PortfolioCard.tsx`). The status line below it is centered Roboto text. Its displayed total is the current Embla snap count, not the number of source images: captures show six desktop snaps and eight mobile snaps.

The About section pairs a rounded-xl work-in-progress photo with copy and the accordion. It is a single-column grid until `md`, then two columns (`src/components/AboutSection.tsx`). The accordion uses DaisyUI's joined vertical collapse styling, large Cinzel titles, and open/closed content regions (`src/components/AboutAccordion.tsx`). Its initial state opens “Me.”

### Navigation

The navigation is fixed to the top edge, uses a base-100 DaisyUI surface with a subtle shadow, and has no horizontal padding of its own (`src/App.css`, `src/components/NavigationBar.tsx`). At `md` (768 px) and wider, it shows a horizontal, bordered tab list with uppercase 20 px Roboto labels and the VicentArt name. Below `md`, those tabs are replaced by a hamburger/close control at the left, a dropdown menu, the same brand name, and a GitHub icon at the right (`src/components/MobileNavbar.tsx`). The mobile menu uses a base-100 surface, subtle shadow, 20 px labels, and full available width. The selected tab follows clicks, the URL hash, and the section visible during scrolling (`src/hooks/useNavigation.ts`).

### Inputs & Forms

There is no booking form or text input. The mobile menu and About accordion use checkbox inputs as their state controls. Keep their rendered appearances with their existing DaisyUI `swap`, `menu`, `join`, and `collapse` patterns; do not add form fields to the current baseline. The current React render emits a `checked`/`defaultChecked` warning for the accordion input; retain this as existing behavior without inferring a source change from the capture.

### Tattoo Portfolio Sections

The hero is centered, beginning 100 px below the top, with a white rounded-full logo badge above the large Cinzel title and a thin bottom divider (`src/components/HomeSection.tsx`). Location, booking process, deposit, and rescheduling copy follows as centered text with a compact booking checklist. Portfolio and About use black full-width panels with 20 px side padding and 40 px vertical padding. Contact is centered, with a plain text list for Instagram, Facebook, email, and WhatsApp. The footer is a small centered copyright line with a GitHub icon (`src/components/ContactSection.tsx`, `src/components/Footer.tsx`).

## 5. Layout Principles

### Grid & Structure

This is a single-page React site with anchored Home, Portfolio, Contact, and About sections in that order (`src/App.tsx`, `src/common/constants.ts`). The page shell spans the viewport width; there is no global max-width container. The hero, its paragraphs, and the About text use local max-widths instead. Global `section` elements have a minimum height of 40vh (`src/App.css`).

### Whitespace Strategy

The page is centered and open, with 40 px vertical separation between major sections and 20 px panel gutters. The fixed navbar occupies the top edge while the hero begins with a 100 px top margin. Background art is fixed and centered, initially contained without repetition; at `md` and wider the source changes its repeat mode to `space` (`src/App.tsx`).

### Alignment & Visual Balance

Most text is center-aligned by the app wrapper. The desktop navigation distributes controls between the left and right edges. The hero keeps the logo, title, and booking details centered; the carousel centers its slide count; About changes to a two-column image-and-copy composition at desktop width. Contact details remain a left-aligned list inside a centered section.

### Responsive Behavior & Touch

The project uses the Tailwind v4 default `sm` (640 px), `md` (768 px), `lg` (1024 px), `xl` (1280 px), and `2xl` (1536 px) breakpoints, confirmed in `node_modules/tailwindcss/theme.css`; this page uses `sm`, `md`, and `xl`. The mobile navigation is replaced by desktop tabs at 768 px. The carousel changes from two visible item widths to four at 640 px. About changes from one column to two at 768 px, and its text changes size at `sm`, `md`, and `xl`. At the captured viewport sizes 1440 × 900, 768 × 1024, 680 × 900, and 390 × 844, document `scrollWidth` equals the viewport width. The prior report of 15 px overflow was not reproduced at these sizes.

## 6. Design System Notes for Stitch Generation

### Language to Use

Use “dark tattoo portfolio,” “fixed photographic art backdrop,” “black canvas,” “centered white typography,” “Cinzel serif display,” “Roboto navigation,” “quiet monochrome controls,” and “open full-width sections.” Keep the palette and section order tied to source. Use the existing logo and tattoo photographs as the visual identity.

### Color References

Use black `#000000` for the page and panel backgrounds and white `#ffffff` for the main text and logo field. Use muted gray `#99a1af` for secondary copy and soft gray `#d1d5dc` for hover text. Use DaisyUI's captured dark `base-100` surface (`#1d232a`, `oklch(0.2533 0.016 252.42)`) for navigation and dropdowns. The remaining semantic primitive colors are listed in the frontmatter and in the source-token notes above.

### Component Prompts

- Recreate the current hero: a centered white circular logo badge, a large Cinzel artist name, a small Roboto artist-role label, and the existing booking information over the fixed black-and-art backdrop.
- Recreate the portfolio section as a full-width black panel with a large Cinzel heading, square-cropped tattoo photographs with rounded corners, automatic horizontal movement, and a centered “Slide N of 8” line.
- Recreate the About section with the existing tattoo-work photograph beside two joined accordion topics on desktop, stacked on smaller screens, using the same black panel and white/gray text.

### Incremental Iteration

Preserve the currently rendered content and source assets. The nine current captures confirm that the logo, eight portfolio images, and artist photo are embedded and load, and show the complete section order. Captures include the mobile menu open; checkbox metrics confirm the Philosophy and collapsed accordion states. Keep the carousel's automatic advance and responsive snap count. The captured `base-100` color and all four viewport widths are confirmed; fixed-nav/anchor scroll behavior remains pending.
