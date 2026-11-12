# Recorded tattoo views

The public portfolio has twelve independent works: the eight existing photographs and four projects that use the original Instagram recordings for recorded-view exploration. The separate animation study remains in the development catalog at `/__ui?view=ink-study`; `/designs/ink-study` redirects to `/#portfolio` and preserves its query string.

Cards and the dialog start on the finished poster; only the opened project's paused video loads. Visitors can opt in to the drawing animation. Its data is fetched after Play drawing, speed and Skip drawing appear during playback, and it returns to the frontal view when complete. The original photo stays in the same dialog. A drawing failure leaves recorded views available with a retry action. The public portfolio remains indexable, while the development catalog stays `noindex, nofollow`.

## Prepared recordings

| Piece        | Reel        | Montage | Front | Joins | 480 px / 720 px bytes |
| ------------ | ----------- | ------: | ----: | ----- | --------------------: |
| Ghostface    | CugRUrrrDlc |     9 s | 4.5 s | 6.5 s | 1,998,431 / 3,644,996 |
| Portrait     | DQHuFwWDmzR |   7.2 s | 4.3 s | 5.3 s | 2,263,646 / 3,868,424 |
| Flowers      | DfL3ikluRzc |   3.9 s | 1.1 s | 2.6 s | 1,356,298 / 2,389,067 |
| Color sleeve | DURo4dTjc6g |   1.9 s |   1 s | None  |     564,190 / 945,913 |

The public manifest is [public/videos/tattoos/manifest.json](../public/videos/tattoos/manifest.json). It records source hashes, source intervals, temporal reversal, final reference frame, transfer sizes and coverage limits. A bundled copy under `src/assets/` is checked against the public manifest by a test. The generated copy is excluded from manual formatting. Originals stay outside this checkout, public assets and Git.

All outputs use H.264, 30 fps, YUV420p, no audio, a six-frame closed GOP, no B-frames and MP4 faststart. Variants are 720 x 1280 and 480 x 854; uniform scaling and letterboxing preserve the artwork. All files meet the 3 MiB / 8 MiB targets. Footage backgrounds, orientation and color are retained. Temporal reversal never mirrors an image.

The montages prioritize additional observed surface. Ghostface joins another camera height and arm tilt. Portrait uses two wide shots of the same upper-arm piece, avoiding the later closeup's scale jump; its unrelated lower-arm tattoo is excluded. Flowers records a shallow forearm roll and retains the original watermark. Source scene-boundary flashes were trimmed from Portrait and Flowers. Color sleeve has only a narrow useful sweep: later zooms repeat the same surface, so they are excluded. These are recorded views, not a calibrated orbit or a guarantee of 180 degrees.

## Browser interaction and lifecycle

`TattooDrawReveal` accepts optional video configuration; calls without it retain the photograph study behavior. It retains the existing 12-second clock, machine, phases and 0.25x-2x speed. Video studies use the neutral sketch background and disable the photograph studies' additional black treatment.

Viewing position runs from -100 to 100. Zero maps to the explicitly chosen reference, not the temporal midpoint; each half maps independently to the first or last decodable frame. Accessible values describe front/left/right and percentage of the recorded range, never degrees.

The native video stays paused. Visibility gates its source assignment. Pointer work is grouped with animation frames; one seek runs at a time and only the latest pending destination is retained. Cancellable polling also detects completed paused seeks when media events or video-frame callbacks are unavailable. Mouse entry anchors the current view without jumping; leaving keeps it. Touch drag waits for horizontal intent and permits vertical scrolling and browser pinch zoom. Slider and Reset view use the same mapping.

The montage contains hard joins identified in `cuts`. When a seek crosses one, a canvas snapshot keeps the last valid view visible while the destination decodes, then fades out over 240 ms. That fade completes even when input stops; a paused cursor does not leave a permanent blended tattoo. Wide jumps seek directly to their destination. The native video, poster and snapshot share the same frame proportions.

Reduced motion disables drawing and passive mouse following, and removes cut fades. Deliberate Slider and drag input remain. Slow or failed media leaves a photograph and retry action. Changing works disposes media, queued seeks, callbacks and transition timers. In the public portfolio, Original photo stays in the same dialog and can return to recorded views; closing restores focus to the card. The development study retains its standalone original-photo viewer.

## Validation

Vitest covers manifest boundaries, front/extreme mapping, invalid input and the existing drawing clock. Playwright covers the full interaction, cancellation, failures, reduced motion, keyboard/touch controls and the four responsive widths. Run:

```powershell
rtk vpr check-all
rtk vp test
rtk vpr build
rtk vpr test:e2e
```

Revalidated after removing the 3D implementation on 2026-11-06: `check-all` passed with zero Tailwind diagnostics; Vitest passed 64 tests in six files; the production build passed; and the complete Chromium suite passed all 92 tests.

The visual review on 2026-11-03 covered 48 decoded-view captures: four pieces at 320, 390, 768 and 1440 px, each at the left, frontal and right positions. Completed controls were also inspected at 390 and 1440 px. The browser regressions include cut-fade completion after input stops, latest-position seeking, and the fallback without media-completion events or video-frame callbacks. Multi-step media cases have a 60-second total budget; decoded-frame assertions still wait at most 20 seconds. Vite excludes generated Playwright reports and traces from file watching.

Physical phones, Safari and Firefox were not checked. Smooth transitions soften a change of take; they cannot recover unrecorded anatomy or eliminate all differences in camera distance and lighting.
