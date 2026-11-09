# Ink studies with recorded views

The public Design A portfolio includes twelve works: eight existing photographs and four recorded-view projects. Gorilla, Owl and the four video projects offer an optional drawing animation. The separate animation study remains available in the development catalog at `/__ui?view=ink-study`; `/designs/ink-study` redirects to `/#portfolio` while preserving its query string.

## Recorded source material

The four source reels came from the links supplied by the user. Instagram's downloadable copies are 720 x 1280; these are compressed copies, not camera originals.

The prepared WebP files are local, so the experience does not depend on Instagram, cookies, embeds or a third-party player at runtime. No frames or viewpoints are generated.

| Reel        | Clip in seconds | Reference | Subject                     |
| ----------- | --------------- | --------- | --------------------------- |
| DURo4dTjc6g | 0.25-5.00       | 2.625     | Color sleeve                |
| DQHuFwWDmzR | 0.25-7.55       | 3.900     | Portrait and trident detail |
| CugRUrrrDlc | 7.50-10.50      | 9.000     | Ghostface forearm           |
| DfL3ikluRzc | 5.00-9.00       | 7.000     | Flowers and column          |

The intervals avoid the reels' later cuts, close-ups, alternate lighting and end cards. The portrait is an upper-arm detail of a larger sleeve; views retain the camera's framing. The result covers only the recorded perspective changes, not a measured angle range or a 360-degree scan.

## Runtime contract

`TattooDrawReveal` accepts an optional `sequence` containing ordered responsive frames and a `referenceIndex`. The base image and the reference must share their source, responsive candidates and dimensions. Invalid sequences leave the photograph available.

Drawing still takes 12 seconds at 1x. Its speed control, machine, shadows and color passes remain shared with the gorilla/owl studies. Video studies finish on the unmodified reference and hide the SVG layers before enabling recorded views. The original gorilla/owl studies retain their localized black enhancement.

- Mouse movement selects views horizontally after drawing; entering alone does not change a view, and leaving preserves it.
- Touch and pen drag horizontally. Vertical scrolling and pinch zoom remain available.
- The Viewing angle slider supports arrows, Home and End, and announces View X of N.
- Replay restores the reference and keeps drawing speed. Show original finishes the drawing and restores the reference.
- In the development study, Enlarge image opens the displayed frame as a static original. In the public portfolio, the original photo stays inside the artwork dialog. Escape returns focus to the opener.
- Reduced motion skips drawing and passive hover. Deliberate slider and drag selection remain available.

Each visible study prepares at most two images concurrently and retains up to eight decoded cache entries. Frames are decoded before display; the prior photograph stays visible while a requested view loads. Cancelled drag/hover requests cannot later replace it. Leaving the viewport releases preparation work and cached references; returning preserves the selected view. A loading failure falls back to the reference with an accessible message. The browser controls its own underlying image/HTTP cache.

The development study remains noindex/nofollow. Public recorded-view projects use the portfolio page and its existing metadata. No backend, contact change, frame tracking, per-view ink enhancement or artificial 3D rendering was added.

## Validation

Pure tests cover sequence validation and indexing. Browser fixtures are explicitly synthetic test material; they are served only by the development server and are not imported by the production application.

Playwright covers completion, pointer/touch/keyboard selection, replay, original, speed, loading failure, cancelled deferred frames, reduced motion, resize and dialog focus. Review actual artwork separately at 320, 390, 768 and 1440 pixels.

```powershell
rtk vp run check-all
rtk vp test
rtk vp run build
rtk vp run test:e2e
```
