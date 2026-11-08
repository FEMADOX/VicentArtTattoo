# Recorded tattoo views

The active `/designs/ink-study` and its development catalog view use the four original Instagram recordings. Gorilla and owl photograph studies remain below the video tabs.

Each selected piece draws once per visit, then hands off to a paused video at its chosen frontal frame. Replay returns to that frame and keeps drawing speed. Reopening a previously started tab shows the finished piece at the front. Page copy remains English and the study remains `noindex, nofollow`.

## Prepared recordings

| Piece        | Reel        | Montage | Front | Joins | 480 px / 720 px bytes |
| ------------ | ----------- | ------: | ----: | ----- | --------------------: |
| Ghostface    | CugRUrrrDlc |     9 s | 4.5 s | 6.5 s | 1,998,431 / 3,644,996 |
| Portrait     | DQHuFwWDmzR |   7.2 s | 4.3 s | 5.3 s | 2,263,646 / 3,868,424 |
| Flowers      | DfL3ikluRzc |   3.9 s | 1.1 s | 2.6 s | 1,356,298 / 2,389,067 |
| Color sleeve | DURo4dTjc6g |   1.9 s |   1 s | None  |     564,190 / 945,913 |

The public manifest is [public/videos/tattoos/manifest.json](../public/videos/tattoos/manifest.json). It records source hashes, source intervals, temporal reversal, final reference frame, transfer sizes and coverage limits. Preparation with the default output also updates a generated copy under `src/assets/` for bundling; a test checks that the copies agree. The generated copy is excluded from manual formatting. Originals stay outside this checkout, public assets and Git.

All outputs use H.264, 30 fps, YUV420p, no audio, a six-frame closed GOP, no B-frames and MP4 faststart. Variants are 720 x 1280 and 480 x 854; uniform scaling and letterboxing preserve the artwork. All files meet the 3 MiB / 8 MiB targets. Footage backgrounds, orientation and color are retained. Temporal reversal never mirrors an image.

The montages prioritize additional observed surface. Ghostface joins another camera height and arm tilt. Portrait uses two wide shots of the same upper-arm piece, avoiding the later closeup's scale jump; its unrelated lower-arm tattoo is excluded. Flowers records a shallow forearm roll and retains the original watermark. Source scene-boundary flashes were trimmed from Portrait and Flowers. Color sleeve has only a narrow useful sweep: later zooms repeat the same surface, so they are excluded. These are recorded views, not a calibrated orbit or a guarantee of 180 degrees.

## Rebuilding or adding a piece

The existing FFmpeg and FFprobe executables are preparation tools only. No browser dependency was added. Source files must be named `<reel-id>.mp4`, with the reviewed 720 x 1280 dimensions.

```powershell
rtk vp run prepare:tattoo-videos -- --source-dir "C:/path/to/originals" --ffmpeg "C:/path/to/ffmpeg.exe" --ffprobe "C:/path/to/ffprobe.exe"
```

Use `FFMPEG` and `FFPROBE` when configured, or put the executables on PATH. `--output-dir` defaults to `public/videos/tattoos`. The command replaces prepared outputs, never original recordings. Its timing/region self-check does not process media:

```powershell
rtk vp run prepare:tattoo-videos -- --self-check
```

1. Review the full original. Select sections of the same tattoo that expose new lateral surface; exclude blur, obscuring glare, unrelated tattoos, repeated zooms and end cards.
2. Add an entry to [scripts/tattoo-video/edits.json](../scripts/tattoo-video/edits.json). Record source intervals, whether each plays in reverse, a frontal reference in montage time and an English coverage limitation. Intervals must align to 30 fps.
3. Define the tattoo region in the final 720 x 1280 reference coordinates. Inspect its alignment after encoding and revise it if needed. Preserve original pixels; do not synthesize missing skin or perspectives.
4. Run preparation. It trims, reverses and concatenates sections; generates both resolutions; extracts the poster from the final encoded 720 px reference frame; and derives connected edge contours inside the selected region. Longer contours draw first; clipped alternating fill strokes reveal shading and color. The sketch is an interpretation, not the real tattooing order.
5. Review the first, frontal and last views plus both sides of every join. Regenerate after changing intervals or the reference. Drawing masks prepared for a different source frame must not be reused.

## Browser interaction and lifecycle

`TattooDrawReveal` accepts optional video configuration; calls without it retain the photograph study behavior. It retains the existing 12-second clock, machine, phases and 0.25x-2x speed. Video studies use the neutral sketch background and disable the photograph studies' additional black treatment.

Viewing position runs from -100 to 100. Zero maps to the explicitly chosen reference, not the temporal midpoint; each half maps independently to the first or last decodable frame. Accessible values describe front/left/right and percentage of the recorded range, never degrees.

The native video stays paused. Visibility gates its source assignment. Pointer work is grouped with animation frames; one seek runs at a time and only the latest pending destination is retained. Cancellable polling also detects completed paused seeks when media events or video-frame callbacks are unavailable. Mouse entry anchors the current view without jumping; leaving keeps it. Touch drag waits for horizontal intent and permits vertical scrolling and browser pinch zoom. Slider and Reset view use the same mapping.

The montage contains hard joins identified in `cuts`. When a seek crosses one, a canvas snapshot keeps the last valid view visible while the destination decodes, then fades out over 240 ms. That fade completes even when input stops; a paused cursor does not leave a permanent blended tattoo. Wide jumps seek directly to their destination. The native video, poster and snapshot share the same frame proportions.

Reduced motion skips drawing and passive mouse following, and removes cut fades. Deliberate Slider and drag input remain. Slow or failed media leaves a photograph and retry action. Changing tabs disposes media, queued seeks, callbacks and transition timers. Original photo uses the shared dialog and returns focus to its button.

## Validation

Vitest covers preparation timing, manifest boundaries, front/extreme mapping, invalid input and the existing drawing clock. Playwright covers the full interaction, cancellation, failures, reduced motion, keyboard/touch controls and the four responsive widths. Run:

```powershell
rtk vp run check-all
rtk vp test
rtk vp run build
rtk vp run test:e2e
```

Revalidated after removing the 3D implementation on 2026-11-06: `check-all` passed with zero Tailwind diagnostics; Vitest passed 64 tests in six files; the production build passed; and the complete Chromium suite passed all 92 tests. The preparation self-check and FFprobe verification of all eight MP4s had passed on 2026-11-03.

The visual review on 2026-11-03 covered 48 decoded-view captures: four pieces at 320, 390, 768 and 1440 px, each at the left, frontal and right positions. Completed controls were also inspected at 390 and 1440 px. The browser regressions include cut-fade completion after input stops, latest-position seeking, and the fallback without media-completion events or video-frame callbacks. Multi-step media cases have a 60-second total budget; decoded-frame assertions still wait at most 20 seconds. Vite excludes generated Playwright reports and traces from file watching.

Physical phones, Safari and Firefox were not checked. Smooth transitions soften a change of take; they cannot recover unrecorded anatomy or eliminate all differences in camera distance and lighting.
