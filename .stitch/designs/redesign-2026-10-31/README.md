# VicentArt: Three Redesign Proposals

The **12 final screens** are in the [private Stitch project](https://stitch.withgoogle.com/projects/14587093072929101256). Their titles end with **Original assets**. The React site is still awaiting a design selection.

The logo, eight tattoo photographs, artist photo and original English commercial copy are retained. The 21 pre-existing canvas elements, design system and four local records from the earlier reference remain intact.

## Comparison and recommendation

| Proposal | Experience | Main advantage | Limitation |
| --- | --- | --- | --- |
| A: Artwork Gallery | One page: featured artwork, eight pieces, artist, process and contact | The work makes the first impression and leads directly to contact | The page is long on mobile when all eight photos are shown in full |
| B: The Artist and His Work | One page with the artist and a finished piece together, biography and gallery | Introduces the person behind the work from the start | The personal introduction competes with the gallery and adds reading |
| C: Explore and Contact | Separate Home, Portfolio, About and Contact pages | Gives the portfolio its own space and separates tasks clearly | Requires moving between pages; Contact takes more reading to prepare an inquiry |

**I recommend A as the starting point**: it prioritizes the artwork and keeps a simple path from the first impression to choosing a contact channel. B fits if Vicent's story should take a larger role. C fits if a standalone portfolio and four separate pages are preferred.

This design recommendation is based on reviewing the proposals; no visitor conversion data is available.

## Screens and files

The screenshots show full pages. Static HTML files include their styles, fonts and images and work offline. The `.prototype.html` files retain generated behavior and may need external style resources; they are not an approved implementation.

| Screen | Screenshot size | Local files | Final Stitch ID |
| --- | --- | --- | --- |
| A / Home / Desktop | 1440 × 6215 | [PNG](exports/a-home-desktop.png) · [HTML](exports/a-home-desktop.html) · [Prototype](exports/a-home-desktop.prototype.html) | 16992451358060678693 |
| A / Home / Mobile | 390 × 8880 | [PNG](exports/a-home-mobile.png) · [HTML](exports/a-home-mobile.html) · [Prototype](exports/a-home-mobile.prototype.html) | 11652374572401789034 |
| B / Home / Desktop | 1440 × 8385 | [PNG](exports/b-home-desktop.png) · [HTML](exports/b-home-desktop.html) · [Prototype](exports/b-home-desktop.prototype.html) | 17213536861456421420 |
| B / Home / Mobile | 390 × 6129 | [PNG](exports/b-home-mobile.png) · [HTML](exports/b-home-mobile.html) · [Prototype](exports/b-home-mobile.prototype.html) | 3456769378707669241 |
| C / Home / Desktop | 1440 × 3920 | [PNG](exports/c-home-desktop.png) · [HTML](exports/c-home-desktop.html) · [Prototype](exports/c-home-desktop.prototype.html) | 9684331225790825676 |
| C / Home / Mobile | 390 × 3771 | [PNG](exports/c-home-mobile.png) · [HTML](exports/c-home-mobile.html) · [Prototype](exports/c-home-mobile.prototype.html) | 8913682602357850420 |
| C / Portfolio / Desktop | 1440 × 2184 | [PNG](exports/c-portfolio-desktop.png) · [HTML](exports/c-portfolio-desktop.html) · [Prototype](exports/c-portfolio-desktop.prototype.html) | 15866896281994293542 |
| C / Portfolio / Mobile | 390 × 5364 | [PNG](exports/c-portfolio-mobile.png) · [HTML](exports/c-portfolio-mobile.html) · [Prototype](exports/c-portfolio-mobile.prototype.html) | 6028925605545297506 |
| C / About / Desktop | 1440 × 4438 | [PNG](exports/c-about-desktop.png) · [HTML](exports/c-about-desktop.html) · [Prototype](exports/c-about-desktop.prototype.html) | 11559291833931608345 |
| C / About / Mobile | 390 × 4720 | [PNG](exports/c-about-mobile.png) · [HTML](exports/c-about-mobile.html) · [Prototype](exports/c-about-mobile.prototype.html) | 16235453574135222053 |
| C / Contact / Desktop | 1440 × 2330 | [PNG](exports/c-contact-desktop.png) · [HTML](exports/c-contact-desktop.html) · [Prototype](exports/c-contact-desktop.prototype.html) | 17137940145884781717 |
| C / Contact / Mobile | 390 × 3752 | [PNG](exports/c-contact-mobile.png) · [HTML](exports/c-contact-mobile.html) · [Prototype](exports/c-contact-mobile.prototype.html) | 2694064510612480498 |

Large exports and browser evidence under `exports/` and `review/` are ignored by Git. They remain on this machine, and their final HTML/PNG files are also stored in Stitch. In another clone, they can be retrieved from the resources in [manifest.json](manifest.json) using the authenticated MCP.

## Review completed

- 12 final designs using the existing dark system without changing it.
- 122 image placements checked against the bytes of the ten source files, including repeated logo, hero and viewer images.
- Static HTML with no external requests, broken images or page errors.
- Layout checked at 320, 390, 768 and 1440 pixels, according to screen type.
- Fixed tablet/mobile overflow, mobile CTA, technical labels and invented commercial copy.
- 24 files downloaded from Stitch through MCP and verified with SHA-256 against the final HTML/PNG files.
- Preserved the 21 original canvas elements, design system, local reference hashes and private visibility.

The import uses DOCUMENT as its HTML input, following the [official Stitch SDK uploader](https://github.com/google-labs-code/stitch-sdk/blob/main/packages/sdk/src/upload-handler.ts). Stitch returns linked screens as DESIGN. Original drafts and their responses remain in the local cache; the manifest identifies the final resources.

## For later implementation

[interaction-spec.md](interaction-spec.md) defines the open menu, manual image viewer, expandable questions, channel selection and navigation. [prompts/](prompts/) contains the 12 prompts; [asset-manifest.json](asset-manifest.json) records the source assets; [stitch-feedback.json](stitch-feedback.json) retains Stitch's original descriptions and suggestions.

Automated descriptions are not evidence: some contained claims or placeholders that were removed. The reviewed exports and interaction specification take precedence.

The redesign has not been implemented in React. That phase still needs full keyboard and focus checks, interactive states, contrast, text enlargement, testing in other browsers and verification of external destinations. No contact channels were activated, and no bookings or payments were simulated.
