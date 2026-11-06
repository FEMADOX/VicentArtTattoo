# Portfolio and component reference brief

Mode: Experience for the public portfolio; Read and Operate for the development component reference.

Audience: visitors exploring Vicent's tattoo work and deciding whether to contact the artist in New Port Richey, Florida.

Success: explore original work, find the existing artist information and contact channels, and choose Contact the artist. The development catalog makes the shared visual and interaction contracts inspectable.

Authority: the user approved the pinned black editorial direction and the Saira Condensed / EB Garamond / JetBrains Mono split. This implementation replaces the supplied automotive reference document with a Vicent Art standard; it does not reopen the visual direction. Original logo/artwork/contact destinations and all existing design versions remain.

Constraints: static React and TypeScript, English copy, no new claims or booking backend. Flat square imagery, 44px controls, accessible primitive behavior, and reduced-motion support. The established ink visual is an artwork-specific exception.

Implementation and evidence: shared tokens and primitives are documented in DESIGN.md and docs/component-system.md. The latter records the passing unit, end-to-end, final check-all/build, and bounded visual-review results. A separate actual-Chrome production-route smoke check remains tracked by the main task.

## Direction contract

THESIS: Real tattoo photography leads an editorial portfolio; the interface supports inspection and direct contact.

OWN-WORLD: Black canvas, white and gray text, square photographs, fine borders and outlined pill controls. Saira Condensed display, EB Garamond reading and JetBrains Mono controls share regular weight.

STORY: Identify Vicent, explore original artwork, prepare an idea for contacting the artist and choose an existing contact channel.

FIRST VIEWPORT: The public A composition pairs a complete portrait tattoo on the left with artist identity and Contact the artist on the right. Mobile stacks identity/actions and the complete photograph below the floating header.

FORM: Code-led migration of the user-approved existing compositions and pinned design reference; no generated comp or new concept selection. The tattoo-machine study remains a separate original interaction.

FINISH: Complete. Independent visual review returned ship with no findings across the eight required desktop/mobile captures. DESIGN.md and its sidecar describe the implemented system; docs/component-system.md records verification and its limits. Existing user artwork is unchanged; this migration produces no raster assets. The detector ran once; font advisories were addressed without claiming a clean rescan.

## Final implementation

Design A remains public. The development-only /__ui catalog offers Components plus eight retained views. Shared Radix/shadcn controls replace DaisyUI, icons use lucide-react, and three licensed local WOFF2 families replace remote font requests. Fixed font sizes follow the 12/14/16/18/20/24/30px ramp; fluid display sizing remains part of the approved composition.
