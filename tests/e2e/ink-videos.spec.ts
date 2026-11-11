/// <reference lib="es2024.promise" />
import { expect, test, type Locator, type Page } from '@playwright/test'

test.setTimeout(60_000)

const studies = ['Ghostface', 'Portrait', 'Flowers', 'Color sleeve'] as const
const widths = [320, 1440] as const

async function openStudy (page: Page, reducedMotion = false) {
  await page.emulateMedia({ reducedMotion: reducedMotion ? 'reduce' : 'no-preference' })
  await page.goto('/designs/ink-study')
  const panel = page.getByRole('tabpanel', { name: 'Ghostface', exact: true })
  await panel.scrollIntoViewIfNeeded()
  await panel.locator('[data-ink-state]').scrollIntoViewIfNeeded()
  await expect(panel).toBeVisible()
  return panel
}

function videoPattern (id: string) {
  return '**/videos/tattoos/' + id + '-*.mp4'
}

function videoFrame (panel: Locator) {
  return panel.locator('[data-video-state]')
}

function viewingAngle (panel: Locator) {
  return panel.getByRole('slider', { name: 'Viewing angle', exact: true })
}

async function expectVideoReady (panel: Locator) {
  const frame = videoFrame(panel)
  await frame.scrollIntoViewIfNeeded()
  await expect(frame).toHaveAttribute('data-video-state', 'ready', { timeout: 20_000 })
  await expect(frame.locator('video[data-tattoo-video]')).toHaveJSProperty('paused', true)
  return frame
}

async function readVideoTime (frame: Locator) {
  return Number(await frame.getAttribute('data-video-time'))
}

async function readVideoDuration (frame: Locator) {
  return await frame.locator('video[data-tattoo-video]').evaluate(element => {
    if (!(element instanceof HTMLVideoElement)) throw new Error('Tattoo video element is missing')
    return element.duration
  })
}

async function expectVideoTime (frame: Locator, expected: number) {
  await expect.poll(async () => Math.abs(await readVideoTime(frame) - expected), { timeout: 20_000 }).toBeLessThanOrEqual(2 / 30)
}

test('drawing finishes at the front, then replay preserves speed and resets exploration', async ({ page }) => {
  const panel = await openStudy(page)
  await expect(panel.locator('[data-drawing-state]')).toHaveAttribute('data-drawing-state', 'playing')
  const speed = panel.getByRole('slider', { name: 'Drawing speed', exact: true })
  await speed.focus()
  await page.keyboard.press('End')
  await expect(speed).toHaveAttribute('aria-valuenow', '2')
  await expect(panel.locator('[data-drawing-state]')).toHaveAttribute('data-drawing-state', 'complete', { timeout: 10_000 })

  const frame = await expectVideoReady(panel)
  const angle = viewingAngle(panel)
  await expect(angle).toHaveAttribute('aria-valuenow', '0')
  await expect(frame).toHaveAttribute('data-video-position', '0')
  const frontTime = await readVideoTime(frame)

  await angle.focus()
  await page.keyboard.press('End')
  await expect(frame).toHaveAttribute('data-video-position', '100')
  await expect.poll(async () => await readVideoTime(frame)).toBeGreaterThan(frontTime)
  await panel.getByRole('button', { name: 'Replay animation', exact: true }).click()
  await expect(panel.locator('[data-drawing-state]')).toHaveAttribute('data-drawing-state', 'playing')
  await expect(speed).toHaveAttribute('aria-valuenow', '2')
  await expect(angle).toHaveAttribute('aria-valuenow', '0')
  await expect(frame).toHaveAttribute('data-video-position', '0')
  await panel.getByRole('button', { name: 'Skip drawing', exact: true }).click()
})

test('cursor exploration starts at the front, follows both directions, and keeps the last view on exit', async ({ page }) => {
  const panel = await openStudy(page)
  await panel.getByRole('button', { name: 'Skip drawing', exact: true }).click()
  const frame = await expectVideoReady(panel)
  const angle = viewingAngle(panel)
  await expect(angle).toHaveAttribute('aria-valuemin', '-100')
  await expect(angle).toHaveAttribute('aria-valuemax', '100')
  await expect(frame).toHaveAttribute('data-video-position', '0')
  const frontTime = await readVideoTime(frame)
  const box = await frame.boundingBox()
  expect(box).not.toBeNull()
  if (!box) return

  await page.mouse.move(0, 0)
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await expect(frame).toHaveAttribute('data-video-position', '0')
  await page.mouse.move(box.x + box.width * 0.9, box.y + box.height / 2, { steps: 4 })
  await expect.poll(async () => Number(await frame.getAttribute('data-video-position'))).toBeGreaterThan(0)
  await expect.poll(async () => await readVideoTime(frame)).toBeGreaterThan(frontTime)
  const rightPosition = await frame.getAttribute('data-video-position')
  await page.mouse.move(0, 0)
  await expect(frame).toHaveAttribute('data-video-position', rightPosition ?? '')

  await panel.getByRole('button', { name: 'Reset view', exact: true }).click()
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.move(box.x + box.width * 0.1, box.y + box.height / 2, { steps: 4 })
  await expect.poll(async () => Number(await frame.getAttribute('data-video-position'))).toBeLessThan(0)
  await expect.poll(async () => await readVideoTime(frame), { timeout: 20_000 }).toBeLessThan(frontTime)

  await angle.focus()
  await page.keyboard.press('Home')
  await expect(frame).toHaveAttribute('data-video-position', '-100')
  await page.keyboard.press('End')
  await expect(frame).toHaveAttribute('data-video-position', '100')
  await page.keyboard.press('Home')
  await expect(frame).toHaveAttribute('data-video-position', '-100')
  await expectVideoTime(frame, 0)
  await panel.getByRole('button', { name: 'Reset view', exact: true }).click()
  await expect(angle).toHaveAttribute('aria-valuenow', '0')
})

test('original photo opens separately and Escape restores focus', async ({ page }) => {
  const panel = await openStudy(page, true)
  const original = panel.getByRole('button', { name: 'Original photo', exact: true })
  await original.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('img')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(original).toBeFocused()
})

test('a slow selected video keeps the poster visible until its media is ready', async ({ page }) => {
  const pending = Promise.withResolvers<undefined>()
  const intercepted = Promise.withResolvers<undefined>()
  await page.route(videoPattern('ghostface'), async route => {
    intercepted.resolve(undefined)
    await pending.promise
    await route.continue()
  })
  try {
    const panel = await openStudy(page, true)
    const frame = videoFrame(panel)
    await frame.scrollIntoViewIfNeeded()
    await expect(frame).toHaveAttribute('data-video-state', 'loading')
    await expect(frame.locator('img').first()).toBeVisible()
    await intercepted.promise
    pending.resolve(undefined)
    await expectVideoReady(panel)
  } finally {
    pending.resolve(undefined)
  }
})

test('a failed video keeps a still image and can be retried', async ({ page }) => {
  let failed = false
  await page.route(videoPattern('ghostface'), async route => {
    if (!failed) {
      failed = true
      await route.abort('failed')
    } else await route.continue()
  })
  const panel = await openStudy(page, true)
  const frame = videoFrame(panel)
  await frame.scrollIntoViewIfNeeded()
  await expect(frame).toHaveAttribute('data-video-state', 'error', { timeout: 20_000 })
  await expect(frame.locator('img').first()).toBeVisible()
  await panel.getByRole('button', { name: /retry/i }).click()
  await expectVideoReady(panel)
})

test('switching studies cancels the previous media and each drawing stays complete on return', async ({ page }) => {
  const pending = Promise.withResolvers<undefined>()
  const intercepted = Promise.withResolvers<undefined>()
  await page.route(videoPattern('ghostface'), async route => {
    intercepted.resolve(undefined)
    await pending.promise
    await route.continue()
  })
  try {
    const first = await openStudy(page)
    await expect(videoFrame(first)).toHaveAttribute('data-video-state', 'loading')
    await intercepted.promise
    await first.getByRole('button', { name: 'Skip drawing', exact: true }).click()

    for (const name of studies.slice(1)) {
      await page.getByRole('tab', { name, exact: true }).click()
      const panel = page.getByRole('tabpanel', { name, exact: true })
      await panel.scrollIntoViewIfNeeded()
      await panel.locator('[data-ink-state]').scrollIntoViewIfNeeded()
      await expect(panel.locator('[data-drawing-state]')).toHaveAttribute('data-drawing-state', 'playing')
      await panel.getByRole('button', { name: 'Skip drawing', exact: true }).click()
      await expectVideoReady(panel)
      await expect(page.locator('[data-video-state]:visible')).toHaveCount(1)
    }

    pending.resolve(undefined)
    for (const name of studies) {
      await page.getByRole('tab', { name, exact: true }).click()
      const panel = page.getByRole('tabpanel', { name, exact: true })
      await expect(panel.locator('[data-drawing-state]')).toHaveAttribute('data-drawing-state', 'complete')
      await expectVideoReady(panel)
      await expect(page.locator('[data-video-state]:visible')).toHaveCount(1)
    }
  } finally {
    pending.resolve(undefined)
  }
})

test('reduced motion disables passive tracking while deliberate slider selection remains available', async ({ page }) => {
  const panel = await openStudy(page, true)
  const frame = await expectVideoReady(panel)
  const angle = viewingAngle(panel)
  const box = await frame.boundingBox()
  expect(box).not.toBeNull()
  if (!box) return
  await page.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2)
  await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2, { steps: 5 })
  await expect(frame).toHaveAttribute('data-video-position', '0')
  await angle.focus()
  await page.keyboard.press('End')
  await expect(frame).toHaveAttribute('data-video-position', '100')

  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.mouse.move(box.x + box.width * 0.3, box.y + box.height / 2, { steps: 5 })
  await expect(frame).toHaveAttribute('data-video-position', '100')
  await panel.getByRole('button', { name: 'Reset view', exact: true }).click()
  await expect(angle).toHaveAttribute('aria-valuenow', '0')
})

test('touch drag explores horizontally while vertical gestures can still scroll the page', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  const session = await page.context().newCDPSession(page)
  await session.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 })
  try {
    const panel = await openStudy(page, true)
    const frame = await expectVideoReady(panel)
    await expect(frame).toHaveCSS('touch-action', 'pan-y pinch-zoom')
    const box = await frame.boundingBox()
    expect(box).not.toBeNull()
    if (!box) return
    const middle = box.y + box.height / 2
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: box.x + box.width * 0.5, y: middle, id: 1 }] })
    for (let step = 1; step <= 6; step += 1) {
      await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: box.x + box.width * (0.5 + step / 12), y: middle, id: 1 }] })
    }
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    await expect.poll(async () => Number(await frame.getAttribute('data-video-position'))).toBeGreaterThan(0)

    const scrollBefore = await page.evaluate(() => window.scrollY)
    const x = box.x + box.width / 2
    const startY = box.y + box.height * 0.8
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: startY, id: 2 }] })
    for (let step = 1; step <= 6; step += 1) {
      await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: startY - box.height * 0.5 * step / 6, id: 2 }] })
    }
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    await expect.poll(async () => await page.evaluate(() => window.scrollY)).toBeGreaterThan(scrollBefore + 30)
  } finally {
    await session.detach()
  }
})

for (const width of widths) {
  test('video viewer fits at ' + width + 'px and exposes both ends', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    const selected = await openStudy(page, true)
    await selected.scrollIntoViewIfNeeded()
    await selected.locator('[data-ink-state]').scrollIntoViewIfNeeded()
    const frame = await expectVideoReady(selected)
    const angle = viewingAngle(selected)
    const frontTime = await readVideoTime(frame)
    const duration = await readVideoDuration(frame)
    await angle.focus()
    await page.keyboard.press('Home')
    await expect(frame).toHaveAttribute('data-video-position', '-100')
    await expectVideoTime(frame, 0)
    await selected.getByRole('button', { name: 'Reset view', exact: true }).click()
    await expect(frame).toHaveAttribute('data-video-position', '0')
    await expectVideoTime(frame, frontTime)
    await angle.focus()
    await page.keyboard.press('End')
    await expect(frame).toHaveAttribute('data-video-position', '100')
    await expectVideoTime(frame, duration - 1 / 30)
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1)

    for (const control of [...await page.getByRole('tab').all(), ...await selected.locator('button, [role="slider"]').all()]) {
      const bounds = await control.boundingBox()
      expect(bounds).not.toBeNull()
      expect(bounds?.width).toBeGreaterThanOrEqual(44)
      expect(bounds?.height).toBeGreaterThanOrEqual(44)
    }
  })
}

test('paused seeking completes when media completion events are unavailable', async ({ page }) => {
  const panel = await openStudy(page, true)
  const frame = await expectVideoReady(panel)
  const duration = await readVideoDuration(frame)
  await frame.locator('video[data-tattoo-video]').evaluate(element => {
    if (!(element instanceof HTMLVideoElement)) throw new Error('Tattoo video element is missing')
    Object.defineProperty(element, 'requestVideoFrameCallback', { configurable: true, value: undefined })
    for (const event of ['seeked', 'loadeddata']) {
      element.addEventListener(event, completion => completion.stopImmediatePropagation(), { capture: true })
    }
  })
  const angle = viewingAngle(panel)
  await angle.focus()
  await page.keyboard.press('Home')
  await expect(frame).toHaveAttribute('data-video-position', '-100')
  await expectVideoTime(frame, 0)
  await page.keyboard.press('End')
  await expect(frame).toHaveAttribute('data-video-position', '100')
  await expectVideoTime(frame, duration - 1 / 30)
  await expect(frame.locator('video[data-tattoo-video]')).toHaveJSProperty('paused', true)
})

test('crossing a recorded cut finishes its fade after input stops', async ({ page }) => {
  const panel = await openStudy(page)
  await panel.getByRole('button', { name: 'Skip drawing', exact: true }).click()
  const frame = await expectVideoReady(panel)
  const duration = await readVideoDuration(frame)
  const angle = viewingAngle(panel)
  await angle.focus()
  await page.keyboard.press('Home')
  await expectVideoTime(frame, 0)
  await expect(frame).toHaveAttribute('data-video-transition', 'idle')
  await frame.evaluate(element => {
    const observer = new MutationObserver(() => {
      const state = element.getAttribute('data-video-transition')
      if (state) element.setAttribute('data-test-transition-' + state, String(performance.now()))
    })
    observer.observe(element, { attributes: true, attributeFilter: ['data-video-transition'] })
    element.addEventListener('test-stop-transition-observer', () => observer.disconnect(), { once: true })
  })
  await page.keyboard.press('End')
  await expect(frame).toHaveAttribute('data-video-position', '100')
  await expectVideoTime(frame, duration - 1 / 30)
  await expect(frame).toHaveAttribute('data-video-transition', 'idle', { timeout: 10_000 })
  for (const state of ['holding', 'fading', 'idle']) {
    await expect(frame).toHaveAttribute('data-test-transition-' + state, /\d/)
  }
  const holding = Number(await frame.getAttribute('data-test-transition-holding'))
  const fading = Number(await frame.getAttribute('data-test-transition-fading'))
  const idle = Number(await frame.getAttribute('data-test-transition-idle'))
  expect(fading).toBeGreaterThanOrEqual(holding)
  expect(idle - fading).toBeGreaterThanOrEqual(200)
  await expect(frame.locator('[data-video-cut-overlay]')).toHaveCSS('opacity', '0')
  await frame.evaluate(element => element.dispatchEvent(new Event('test-stop-transition-observer')))
})
