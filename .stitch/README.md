# VicentArtTattoo in Stitch

This folder records the current website baseline for future design work in
[the existing private Stitch project](https://stitch.withgoogle.com/projects/14587093072929101256).
The earlier designs remain in that project as references.

## Integration records

- `DESIGN.md` describes the source-derived design system and observed rendering.
- `integration-manifest.json` lists the exact upload files, hashes, source inputs,
  viewports, and captured states.
- `metadata.json` records the remote project, screens, design system, and current
  integration status. Check its status before treating an import as complete.

## Coverage

The site has one route, `/`, containing Home, Portfolio, Contact, About, navigation,
and the footer. Nine full-page captures cover these views:

| Capture | Viewport | State |
| --- | --- | --- |
| `home-desktop` | 1440 × 900 | Desktop tabs, Me open |
| `home-mobile` | 390 × 844 | Mobile menu closed, Me open |
| `home-small-tablet` | 680 × 900 | Mobile navigation, four portfolio item widths |
| `home-tablet` | 768 × 1024 | Desktop navigation and two-column About |
| `home-mobile-menu` | 390 × 844 | Mobile dropdown open |
| `home-desktop-philosophy` | 1440 × 900 | My Philosophy open |
| `home-mobile-philosophy` | 390 × 844 | My Philosophy open |
| `home-desktop-collapsed` | 1440 × 900 | Both accordion topics closed |
| `home-mobile-collapsed` | 390 × 844 | Both accordion topics closed |

## Capture method and validation

The approved method is the installed `stitch::code-to-design` workflow using its
Puppeteer snapshot script. Puppeteer tooling was installed in a separate temporary
directory; the application dependencies and source were not changed for capture.

Each HTML embeds its images, background artwork, favicon, and fonts, including
fonts referenced by nested CSS imports. Scripts and development overlays are
removed. Checkbox state is serialized and viewport-based CSS lengths are frozen
for the recorded viewport. These exports are static visual references; they do
not reproduce live React handlers or carousel autoplay.

All nine HTML files were opened in Chrome with HTTP requests blocked. Checks
verified zero external requests, loaded Cinzel and Roboto fonts, all ten images,
section sizes, full-page dimensions, and menu/accordion state. The associated PNGs
were rendered from those verified HTML files. Desktop and mobile PNGs were also
visually reviewed.

The live app reports an existing AboutAccordion warning about using `checked`
together with `defaultChecked`. The reference import preserves the current app;
that warning and fixed-navbar anchor behavior can be addressed during later web
improvements.

## Remote verification and native design-system mapping

All 19 approved files were downloaded through Stitch's authenticated
download_file tool. Their SHA-256 hashes match the manifest exactly. All nine
new screen instances and the design document are present, and all 11 earlier
screen instances were preserved.

The native design-system asset is assets/f4d12f1305024789a7246059272b3877
(**Vicentart Tattoo Artist**). Its automatic extraction retains Cinzel headings
and Roboto labels but infers Roboto for body text, Material surfaces/background
of #131313, and global ROUND_EIGHT. The source uses the system sans stack,
a black #000000 page, a 10px base radius, and 14px/16px image radii.

The current MCP update schema accepts preset global font enums and does not
expose the custom global font-family fields returned on read. Correction
attempts returned an invalid argument, so the generated asset is retained with
these differences recorded in metadata.json. The uploaded DESIGN.md and HTML
captures are the exact baseline for future work. The native asset was not
applied to the earlier screens or used to regenerate the captured website.

## Local files and future updates

Generated HTML, PNGs, logs, and raw API responses live under `.stitch/.cache/`.
The existing `.cache` ignore rule keeps these large generated copies out of Git.
Commit the design document and integration records instead; the manifest records
the remote-backed files and their hashes.

Stitch is a snapshot of the recorded source, not an automatic synchronization
service. For another import, repeat the installed code-to-design workflow,
re-check the existing project before adding screens, and update the manifest and
remote metadata after verifying the new upload. Use the recorded current-site
design system for future iterations instead of the older project theme.
