# Ink studies with recorded views

The public experiment is at `/designs/ink-study`; the development catalog shows the same page at `/__ui?view=ink-study`. The public portfolio and retained A/C galleries keep their own behavior.

## Source media and preparation

The four source reels were downloaded directly from the links supplied by the user. Instagram's downloadable copies are 720 x 1280; these are compressed copies, not camera originals. The MP4s, source metadata, tools and contact sheets stay in ignored `.local-media/` and `.local-tools/`. Neither directory is published or committed.

The prepared WebP files are local, so the experience does not depend on Instagram, cookies, embeds or a third-party player at runtime. No frames or viewpoints are generated.

| Reel        | Clip in seconds | Reference | Subject                     |
| ----------- | --------------- | --------- | --------------------------- |
| DURo4dTjc6g | 0.25-5.00       | 2.625     | Color sleeve                |
| DQHuFwWDmzR | 0.25-7.55       | 3.900     | Portrait and trident detail |
| CugRUrrrDlc | 7.50-10.50      | 9.000     | Ghostface forearm           |
| DfL3ikluRzc | 5.00-9.00       | 7.000     | Flowers and column          |

The Vite watcher excludes local source media, test reports and preparation staging folders. This permits atomic publication while the development server is running on Windows.

The intervals avoid the reels' later cuts, close-ups, alternate lighting and end cards. The portrait is an upper-arm detail of a larger sleeve; views retain the camera's framing. The result covers only the recorded perspective changes, not a measured angle range or a 360-degree scan.

Install FFmpeg and FFprobe on PATH, or set `FFMPEG_PATH` and `FFPROBE_PATH` to their executable paths for the preparation process. These tools are not browser or npm dependencies.

```powershell
rtk vpx scripts/prepare-tattoo-views.ts --help
rtk vpx scripts/prepare-tattoo-views.ts --input .local-media/DURo4dTjc6g.mp4 --id DURo4dTjc6g --source https://www.instagram.com/vicentart/reel/DURo4dTjc6g/ --start 0.25 --end 5
```

The package script `prepare:ink-views` runs the same CLI. Its defaults are 32 samples and WebP quality 80. It validates input times, source metadata, encoders and a new destination before processing. It never overwrites an existing study.

The small variant is at most 480 pixels wide and the large variant at most 960 pixels wide, with no upscaling. All frames in a variant have the same dimensions; integer rounding may change the scaled aspect by less than one pixel. Exact duplicates are removed. Each output contains `manifest.json`, `small/` and `large/`, with relative frame names, timestamps, provenance, reference index and byte totals. The size limits are 2,000,000 and 5,000,000 bytes respectively. Reduce `--count` or `--quality` and use a new output directory if a set exceeds its limit.

## Authoring a piece

Inspect a contact sheet before choosing the interval. Keep the tattoo visible and avoid focus changes, abrupt zooms and edits. Review the extracted first, middle and last views as well as the intermediate frames.

After preparation, create `drawing.json` beside the manifest:

```json
{
  "title": "Descriptive study title",
  "alt": "An accurate description of the photographed tattoo.",
  "paths": ["SVG path in the reference image coordinates"],
  "fill": {
    "region": "SVG path around the tattoo",
    "paths": ["Ordered SVG paths covering the tattoo"],
    "strokeWidth": 70
  }
}
```

Replace every illustrative path string with real SVG geometry. Trace the exact reference image from `manifest.frames[manifest.referenceIndex]`, using the manifest's large dimensions as the SVG coordinate space. Prepare main contours before details and clip the shading/color strokes to the photographed tattoo. The current outlines are selected interpretations, not an automatic vectorization or a simulation of tattooing.

Only studies with both a manifest and a drawing file enter the page. The Vite asset mapping resolves local WebP URLs at build time; image bytes load when the piece becomes visible. To regenerate, preserve or move the existing output first and choose a new destination; never replace source footage.

## Runtime contract

`TattooDrawReveal` accepts an optional `sequence` containing ordered responsive frames and a `referenceIndex`. The base image and the reference must share their source, responsive candidates and dimensions. Invalid sequences leave the photograph available.

Drawing still takes 12 seconds at 1x. Its speed control, machine, shadows and color passes remain shared with the gorilla/owl studies. Video studies finish on the unmodified reference and hide the SVG layers before enabling recorded views. The original gorilla/owl studies retain their localized black enhancement.

- Mouse movement selects views horizontally after drawing; entering alone does not change a view, and leaving preserves it.
- Touch and pen drag horizontally. Vertical scrolling and pinch zoom remain available.
- The Viewing angle slider supports arrows, Home and End, and announces View X of N.
- Replay restores the reference and keeps drawing speed. Show original finishes the drawing and restores the reference.
- Enlarge image opens the displayed frame as a static original. Escape returns focus to its button.
- Reduced motion skips drawing and passive hover. Deliberate slider and drag selection remain available.

Each visible study prepares at most two images concurrently and retains up to eight decoded cache entries. Frames are decoded before display; the prior photograph stays visible while a requested view loads. Cancelled drag/hover requests cannot later replace it. Leaving the viewport releases preparation work and cached references; returning preserves the selected view. A loading failure falls back to the reference with an accessible message. The browser controls its own underlying image/HTTP cache.

The experiment keeps its existing title and noindex/nofollow metadata. No backend, contact change, frame tracking, per-view ink enhancement or artificial 3D rendering was added.

## Validation

Pure tests cover sequence validation/indexing and preparation input/dimensions/sampling. A tiny synthetic video exercises FFmpeg when the binaries are available. Browser fixtures are explicitly synthetic test material; they are served only by the development server and are not imported by the production application.

Playwright covers completion, pointer/touch/keyboard selection, replay, original, speed, loading failure, cancelled deferred frames, reduced motion, resize and dialog focus. Review actual artwork separately at 320, 390, 768 and 1440 pixels.

```powershell
rtk vpr check-all
rtk vp test
rtk vpr build
rtk vpr test:e2e
```
