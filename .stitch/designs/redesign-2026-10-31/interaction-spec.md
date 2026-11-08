# Interaction specification for the three VicentArt proposals

These are design requirements for later implementation. The generated screens and any downloaded HTML are visual proposals; this document does not claim working routes, contact links, keyboard behavior, accessibility conformance or booking functionality.

## Content and asset rules

Retain /logo.svg, portfolio1.webp through portfolio8.webp and about_me_working.webp from the source site/imported screens. The eight portfolio assets keep their source order and must remain recognizable without crop damage. The artist image is "Vicent working on a tattoo." Never replace unavailable source assets with stock images or generated tattoos; record a missing-asset issue. Review alt descriptions against the actual photographs before implementation; the current "Portfolio image N" labels are only source identifiers and should not be treated as final descriptive alt text.

Keep public copy in English. Preserve the source street address and four visible contact values. Existing claims in the artist biography and philosophy come from the source; do not expand them. The designs do not introduce testimonials, prices, awards, studio hours, availability, account features or online payment.

## Navigation map

| Experience | Navigation destinations | Primary contact destination |
| --- | --- | --- |
| A: Artwork Gallery | Home #home; Portfolio #portfolio; About #about; Process #process; Contact #contact | #contact |
| B: The Artist and His Work | Home #home; About #about; Portfolio #portfolio; Process #process; Contact #contact | #contact |
| C: Explore and Contact | Home /; Portfolio /portfolio; About /about; Contact /contact | /contact |
| C process detail | /about#process | /contact |

A and B are alternative single-page designs, not routes that coexist in a live app. C is an alternative four-page design. A future implementation selects a proposal before adding routes; it must not ship all three as competing public sites.

The existing logo goes to the start of the chosen proposal. Use semantic navigation links instead of ARIA tabs. Indicate the current route with aria-current="page" for C; a single-page active section may use aria-current="location". Include a skip link to main content. Anchor targets need enough scroll offset to stay below a persistent header. If anchor navigation deliberately moves focus, focus the destination heading without adding it to normal tab order; do not move focus merely because the observer detects scrolling. Browser back/forward must retain meaningful navigation. At reduced-motion preference, jump or use instant state changes rather than animated scrolling.

## Mobile menu

Default state: compact header with logo, a clearly named Menu button and a reachable contact entry. Do not squeeze the desktop navigation into the narrow viewport.

Open state: a modal navigation panel containing the full navigation list and an explicit "Close menu" button. Keep the selected item identifiable. The panel is scrollable when viewport height is limited. The menu control uses aria-expanded and aria-controls; the panel has an accessible "Navigation" name. Use a real button, not a hidden checkbox label.

Opening stores the trigger, moves focus into the panel, makes background content inert and prevents background scroll. Tab and Shift+Tab stay within the open panel. Escape and Close dismiss it and return focus to Menu. Activating a destination closes the panel, restores normal page scrolling and then navigates/focuses the destination; do not return focus to the menu trigger after navigation. Backdrop dismissal may supplement the explicit button. Nothing depends on swiping, hover or animated motion. Keep controls at least 44 by 44 CSS pixels and prevent the menu from covering a focusable element left outside the modal focus sequence.

## Portfolio and full-image viewer

Default gallery: all eight original pieces, manual exploration, no autoplay and no unnecessary filters, search or pagination for this small collection. Use image-native ratios or a contain presentation that preserves the tattoo. The gallery order is 1–8 even if desktop spans vary. Mobile uses a single column when multiple columns obscure tattoo detail. At 680–768 CSS pixels, choose two columns only when each image remains useful to inspect; preserve content order.

Each thumbnail is a button with an accessible name such as "View tattoo 1 in full" until reviewed descriptive names are available. Do not nest the button in a competing link. A separate visual enlargement affordance may appear, but must not be hover-only.

Open state: a modal viewer containing the full original image, a position label "1 of 8", explicit "Previous piece", "Next piece" and "Close image" controls. Fit the entire image in the available viewport; do not force a crop or hide controls outside the screen. Desktop can place controls beside the image; mobile places them in reachable dedicated rows rather than over the tattoo. A photo can be inspected without advancing to another piece. Pinch/zoom, if later added, must leave close and navigation usable.

Opening stores the activating thumbnail and moves focus to Close. Background is inert and scroll-locked. Tab stays inside. Escape and Close dismiss and restore focus to the exact activating thumbnail and the gallery's prior scroll position. ArrowLeft/ArrowRight are shortcuts while the viewer is open; visible previous/next buttons remain available. Navigation stops at the first/last image with the corresponding button disabled rather than silently wrapping. Announce the changed image/position politely to assistive technology, without repeating long descriptions unnecessarily. Swipe is supplemental only and never intercepts page scrolling outside the viewer.

C Home previews navigate to /portfolio. From that gallery, selecting a photograph opens the full-image viewer. No additional query-string or public routing interface is required for these design proposals.

## Biography, philosophy and booking disclosures

A/B display the biography without requiring expansion. "My philosophy" can use a single disclosure. C About displays the biography and complete philosophy; the philosophy may be disclosed on mobile, with a clear control.

Booking questions use independent disclosures: "What should I include?", "When will I see the design?", "How does the deposit work?" and "Can I change my appointment?". A/B may use the equivalent headings specified in their prompts. More than one answer may stay open. Use actual buttons with aria-expanded and aria-controls, or native details/summary; Enter and Space activate the header. Focus remains on the header after toggling. Do not trap focus, navigate the page or collapse unrelated content. Keep an answer readable without timed dismissal.

The following booking facts must remain correct:
- Mostly by appointment.
- Enquiry checklist: short description, size and placement, suitable days or dates, budget.
- Each piece is designed before the appointment and shown on the appointment date. No promise of prior approval or delivery.
- Deposit required and credited to the total; confirmation follows receipt, not the act of contacting.
- Cash App, Zelle, Apple Pay, Venmo and cash at the shop are information only; there are no payment buttons.
- Deposits are non-refundable; changing the appointment day requires a second deposit.

Disclosure defaults must not hide the essential deposit/confirmation and rescheduling warning from the channel-selection area. In A/B repeat the concise summary immediately before external channel choices. In C show it on Contact as well as full detail on About. A first-viewport contact CTA may scroll/navigate to this area; it must not skip straight to an external service.

## Channel choice and location

All primary contact CTAs use exactly "Contact the artist". A/B go to #contact; C goes to /contact. The resulting area presents four distinct, clearly named choices:

| Label | Visible source value |
| --- | --- |
| Message on Instagram | @vicentart |
| Message on Facebook | vicentartattoo |
| Send an email | vicentartattoo@gmail.com |
| Message on WhatsApp | 813-696-1137 |

Display the account/number as well as the service name. Use an accessible text label when an icon is present. Contact choice is not a submitted request, confirmed booking or payment. Do not display a success state merely for clicking an external link. No response-time or current-availability claims.

Before implementation verify the actual social profiles, the phone's country code and intended WhatsApp destination with authoritative project/user evidence. Preserve the visible source number while unresolved; do not silently assume a new URL or number. Email may use the exact source mailbox once implementation begins. If a contact channel is unavailable, do not fabricate a destination or publish a dead action; flag it for resolution. Design exports may contain illustrative links and must not be treated as validated destinations.

Keep "9117 Little Rd, New Port Richey, FL 34654" readable as a plain address. Do not invent a business name, map destination, hours or parking details. The footer retains section/route navigation, a path to contact and "© 2025 Vicentart. All rights reserved."

## Responsive and accessibility acceptance checks for implementation

Validate at 320, 390, 680, 768 and 1440 CSS pixels, landscape mobile and with enlarged text. The twelve final design screens cover 390 and 1440 pixels. Their default static layouts were also browser-checked at 320 and 768 pixels. The future React implementation still needs the complete checks below, including 680 pixels, landscape and enlarged text.

- No horizontal page overflow, truncated navigation, clipped policy copy or inaccessible image controls.
- All eight real images and the artist photo appear where required; no modified tattoos, stock replacements or invented captions.
- Logical headings, DOM reading order and tab sequence survive layout changes.
- Keyboard-only use reaches menu, gallery viewer, disclosures and contact choice; overlays restore focus and scroll.
- Focus remains visible and unobscured; controls meet 44-by-44 touch targets; text/controls meet WCAG 2.2 AA contrast after tokens are applied.
- Menu/viewer states remain operable under reduced motion and at 200% text size.
- At least one complete booking-information path is visible before external contact; no design promises advance approval or instant confirmation.
- External destinations are verified separately before implementation; screen exports alone provide no proof of working links or accessibility.

## Deliverable boundary

The twelve default screens are a-home desktop/mobile, b-home desktop/mobile and C Home/Portfolio/About/Contact desktop/mobile. This document defines the additional menu-open, image-open, disclosure-open and contact-choice states for later implementation and possible targeted Stitch edits; those state descriptions are not extra generated screens or tested behaviors. Compare proposals by image prominence, identity clarity, contact discoverability and reading effort before implementing one in React.
