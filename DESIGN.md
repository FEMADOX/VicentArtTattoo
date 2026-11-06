---
name: Vicent Art Tattoo
description: A dark editorial gallery that lets the tattoo artwork lead.
colors:
  canvas: "#000000"
  foreground: "#ffffff"
  body: "#cccccc"
  muted: "#999999"
  surface: "#0d0d0d"
  card: "#141414"
  popover: "#1f1f1f"
  border: "#262626"
  control-border: "#808080"
  link: "#c3d9f3"
  destructive: "#ffb4ab"
typography:
  display:
    fontFamily: "Saira Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(2rem, 5vw, 4rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "0.05em"
  body:
    fontFamily: "EB Garamond, Garamond, Georgia, serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  small:
    fontSize: "0.875rem"
  base:
    fontSize: "1rem"
  lead:
    fontSize: "1.25rem"
  title:
    fontSize: "1.5rem"
  title-large:
    fontSize: "1.875rem"
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.14em"
rounded:
  none: "0px"
  pill: "9999px"
spacing:
  unit: "4px"
  compact: "8px"
  content: "16px"
  group: "24px"
  gutter: "40px"
  band: "64px"
  section: "120px"
components:
  button-primary:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    height: "44px"
    padding: "12px 24px"
  photo:
    rounded: "{rounded.none}"
  dialog:
    backgroundColor: "{colors.popover}"
    textColor: "{colors.body}"
    rounded: "{rounded.none}"
---

# Design System: Vicent Art Tattoo

## Overview

**Creative North Star: "The artwork takes the room"**

An editorial gallery on a black canvas frames Vicent's original tattoo photography. The interface recedes: generous space, crisp rectangular imagery, and quiet outlined controls keep attention on the work. The original logo and contact channels carry the artist's identity.

The approved direction adapts the supplied monochrome editorial reference to this portfolio. It does not carry automotive names, proprietary typefaces, vehicle content, or reference-site claims into the product. The page's Experience mode and contact journey are recorded in the surface brief.

**Key Characteristics:**

- Original artwork and photography lead.
- Black surfaces with white headings and readable gray body copy.
- Three regular-weight type roles, self-hosted.
- Rectangular imagery and pill controls.
- Flat surfaces, restrained borders, and purposeful motion.

## Colors

Black is the canvas; imagery supplies the color. White identifies primary content, body gray supports reading, and muted gray supports captions. Tonal surfaces separate cards and portal content without shadows.

**The Quiet Border Rule.** The hairline border is decorative separation. Interactive boundaries use the stronger control-border token or white; do not rely on the decorative hairline to identify a control.

Inline links use the pale blue link token and an underline. The destructive token is a reserved semantic color for a destructive or invalid control; it is not a brand accent. Text and placeholders must meet 4.5:1 contrast, and interactive outlines must meet 3:1 against adjacent surfaces.

## Typography

Display uses self-hosted **Saira Condensed**, body uses self-hosted **EB Garamond**, and controls and captions use self-hosted **JetBrains Mono**. All three ship at regular weight (400) with normal style and font-display swap. Licenses and exact download provenance live in src/assets/fonts/README.md.

Headlines are uppercase with generous tracking and balanced wrapping. Body text stays in sentence case with a comfortable reading measure, about 65â€“75 characters where layout allows. Labels remain concise and uppercase.

The fixed size ramp is 12, 14, 16, 18, 20, 24 and 30px, represented by the Tailwind text-xs through text-3xl steps. Responsive display headings use the documented fluid scale; avoid one-off fixed sizes between these steps.

**The Three Roles Rule.** Use family, scale, spacing, and case for hierarchy. Do not simulate bold or italic weights that are not shipped.

## Layout

Use a four-pixel rhythm, generous separation between editorial bands, and tighter grouping within a control or caption. Standard content can center within roughly 1280px; imagery may bleed to the viewport. Section spacing can grow toward 120px on wide screens and compress on small screens without crowding content.

Small screens stack content and retain the same artwork, contact path, and keyboard access. Long labels must wrap or have room; they must not cause horizontal page overflow. The component showcase is a reference surface and may use denser rows than the public portfolio.

## Elevation & Depth

Surfaces are flat, without decorative shadows. Depth comes from photography, black-to-dark tonal separation, and opaque portal surfaces. Dialog and Sheet overlays sit above the site header and dim the artwork behind them. Portal content inherits the global dark theme.

## Shapes

Artwork and content surfaces use square corners. The radius scale is explicitly zero at every size so no negative corner calculation can occur. Buttons are pills; icon controls and slider thumbs are circular. Preserve the original aspect ratio and focal point when showing artwork; enlarged photographs use containment rather than a destructive crop.

## Components

**Button.** Preserve the existing default, outline, secondary, ghost, destructive, and link variants and the asChild API. The primary action is a transparent white outlined pill. Controls have a minimum 44px hit area, a visible white focus outline, and distinct hover, pressed, and disabled states. The catalog pins normal, hover, focus, pressed and disabled examples for the primary and outline variants with data-preview-state and native disabled; every enabled specimen also responds to real interaction. Other variants remain supported by the shared API.

**Dialog and Sheet.** Compose the standard Title and Description exports with controlled or uncontrolled Radix state. Escape, focus trapping, and focus return belong to the primitive. Photo dialogs can suppress the standard close control only when an accessible alternative is supplied. Dialog width allows artwork; mobile content scrolls within the dynamic viewport. Sheet navigation remains reachable without hiding content behind a close button.

**Accordion.** Keep Radix single and multiple modes, accessible headings, and keyboard interaction. Triggers remain at least 44px tall. Content is readable serif text and dividers remain quiet.

**Slider.** The actual thumb receives its accessible name, description, and value text. A 44px hit area surrounds its visible circular mark. Controlled values remain arrays as required by Radix. Label opacity controls in terms of the visual effect, with meaningful percentage value text.

**Development catalog.** The development-only /__ui reference exposes Components plus eight retained views. Its live specimens cover Button states and sizes, Dialog, Sheet, Accordion and Slider; retained views exercise the portfolio and carousel compositions. It preserves the public Design A route and adds no public design picker.

**Carousel.** Retain Embla behavior and existing exports. Previous and next controls have at least 44px hit areas. Autoplay behavior is owned by the calling portfolio component; this primitive does not add another autoplay state.

State transitions use 150ms; overlay and accordion transitions use 240ms; image changes can use 500ms. Both opening and closing states are covered. Reduced motion removes nonessential movement. The established ink visual is an artwork-specific exception; it must not spread into decorative interface effects.

## Do's and Don'ts

### Do

- Do preserve the original artwork, logo, contact channels, and truthful English content.
- Do let photography carry color and visual emphasis.
- Do keep all three typography roles at regular weight.
- Do use visible focus, adequate contrast, and 44px control targets.
- Do preserve every retained design version and the public contact journey.
- Do honor reduced motion and preserve usable content when animation is disabled.

### Don't

- Don't add invented booking, availability, prices, reviews, or credentials.
- Don't introduce automotive content or proprietary reference-site assets.
- Don't round artwork or add card shadows, gradients, or decorative glows.
- Don't use a faint decorative divider as the only visible control boundary.
- Don't add a second autoplay controller or replace accessible primitives with custom lookalikes.
