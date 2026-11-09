# Vicent Art Tattoo

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Portfolio visitors who want to explore Vicent's tattoo work, learn about the artist, and contact the artist through the existing channels.

## Product Purpose

Vicent Art Tattoo is a portfolio for a tattoo artist in New Port Richey, Florida. It presents the artist's work and information, then helps interested visitors make contact through the established channels. Success means visitors can review the work and reach the artist.

## Positioning

The public portfolio pairs finished tattoo photography with recorded views of selected works and optional drawing reveals. Visitors can explore a piece's process without animation being required to see the finished tattoo.

## Operating Context

Visitors use the portfolio in a browser on desktop or mobile. Each artwork opens on its finished front photograph. Visitors deliberately choose recorded views or a drawing animation when available.

## Capabilities and Constraints

- The public collection has twelve works: the eight existing photographic works plus Ghostface, Portrait, Flowers, and Color sleeve.
- Four works include recorded views. Six supported works offer an optional drawing reveal, loaded only when the visitor chooses to play it.
- All works use the shared viewer with previous, next, and close controls. The original photograph remains available if optional media fails.
- Only the opened work's video is loaded. A drawing failure does not block its recorded views; a video failure preserves the photo and retry action.
- The public legacy route `/designs/ink-study`, with or without a trailing slash, redirects to `/#portfolio` while preserving query parameters. The ink-study demo remains in the development catalog at `/__ui?view=ink-study`.
- The site has no backend, appointment booking service, payment flow, account system, or required environment variable. Do not invent availability, prices, credentials, reviews, guarantees, booking confirmations, or new contact channels.

## Brand Commitments

- Public page copy is in English.
- Preserve the Vicent Art Tattoo name, original logo, photography, artwork, and existing contact destinations.
- Existing assets are the source of truth for the artist's work and identity.

## Evidence on Hand

The project contains eight existing tattoo photographs, four recorded-view videos, and drawing data for the supported works. Use these assets as the portfolio evidence; do not fabricate artwork or testimonials.

## Product Principles

- Show the completed tattoo before any optional motion.
- Keep recorded views and drawing reveals deliberate and optional.
- Preserve the original photograph when optional media fails.
- Keep the existing contact journey and make no unsupported service claims.
- Keep keyboard, touch, and reduced-motion access usable.

## Accessibility & Inclusion

Viewer controls support keyboard and touch interaction, closing returns focus to the opener, and reduced motion disables nonessential and passive motion. Visitors can still choose a view deliberately.
