/// <reference lib="es2024.promise" />
import { expect, test, type Locator, type Page } from '@playwright/test'

test.setTimeout(60_000)

const widths = [320, 1440] as const

async function openStudy (page: Page, reducedMotion = false) {
  await page.emulateMedia({ reducedMotion: reducedMotion ? 'reduce' : 'no-preference' })
  await page.goto('/#portfolio')
  await page.getByRole('button', { name: /^Enlarge piece 1:/ }).click()
  const panel = page.getByRole('dialog', { name: 'Original tattoo work' })
  await panel.getByRole('button', { name: 'Next', exact: true }).click()
  await expect(panel).toBeVisible()
  if (!reducedMotion) {
    await panel.getByRole('button', { name: 'Play drawing', exact: true }).click()
    await panel.locator('[data-ink-state], [data-drawing-state="unavailable"]').waitFor()
    await videoFrame(panel).evaluate(element => element.scrollIntoView({ block: 'start' }))
  }
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

async function visibleFrameBounds (frame: Locator) {
  await frame.evaluate(element => element.scrollIntoView({ block: 'start' }))
  return await frame.evaluate(element => {
    const bounds = element.getBoundingClientRect()
    let top = Math.max(0, bounds.top)
    let bottom = Math.min(window.innerHeight, bounds.bottom)
    for (let parent = element.parentElement; parent; parent = parent.parentElement) {
      if (!/(auto|scroll|hidden)/.test(getComputedStyle(parent).overflowY)) continue
      const clip = parent.getBoundingClientRect()
      top = Math.max(top, clip.top)
      bottom = Math.min(bottom, clip.bottom)
    }
    return { x: bounds.x, y: top, width: bounds.width, height: bottom - top }
  })
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

test('drawing starts when less than a quarter of its frame fits in the dialog', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 520 })
  const panel = await openStudy(page)
  const ratio = await videoFrame(panel).evaluate(async element => {
    const { promise, resolve } = Promise.withResolvers<number>()
    const observer = new IntersectionObserver(entries => {
      observer.disconnect()
      resolve(entries[0]?.intersectionRatio ?? 0)
    })
    observer.observe(element)
    return await promise
  })
  expect(ratio).toBeGreaterThan(0)
  expect(ratio).toBeLessThan(0.25)
  await expect(panel.locator('[data-drawing-state]')).toHaveAttribute('data-drawing-state', 'playing')
})

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
  await panel.getByRole('button', { name: 'Animation', exact: true }).click()
  await expect(panel.locator('[data-drawing-state]')).toHaveAttribute('data-drawing-state', 'playing')
  await expect(speed).toHaveAttribute('aria-valuenow', '2')
  await expect(angle).toHaveAttribute('aria-valuenow', '0')
  await expect(frame).toHaveAttribute('data-video-position', '0')
  await panel.getByRole('button', { name: 'Skip drawing', exact: true }).click()
})

test('mouse drag explores both directions while cursor movement leaves the angle unchanged', async ({ page }) => {
  const panel = await openStudy(page)
  await panel.getByRole('button', { name: 'Skip drawing', exact: true }).click()
  const frame = await expectVideoReady(panel)
  const angle = viewingAngle(panel)
  await expect(angle).toHaveAttribute('aria-valuemin', '-100')
  await expect(angle).toHaveAttribute('aria-valuemax', '100')
  await expect(frame).toHaveAttribute('data-video-position', '0')
  const frontTime = await readVideoTime(frame)
  let box = await visibleFrameBounds(frame)
  expect(box.height).toBeGreaterThan(0)

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.move(box.x + box.width * 0.9, box.y + box.height / 2, { steps: 4 })
  await expect(frame).toHaveAttribute('data-video-position', '0')
  await page.mouse.down({ button: 'right' })
  await page.mouse.move(box.x + box.width * 0.1, box.y + box.height / 2, { steps: 4 })
  await page.mouse.up({ button: 'right' })
  await expect(frame).toHaveAttribute('data-video-position', '0')
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width * 0.9, box.y + box.height / 2, { steps: 4 })
  await page.mouse.up()
  await expect.poll(async () => Number(await frame.getAttribute('data-video-position'))).toBeGreaterThan(0)
  await expect.poll(async () => await readVideoTime(frame)).toBeGreaterThan(frontTime)
  const rightPosition = await frame.getAttribute('data-video-position')
  await page.mouse.move(box.x + box.width * 0.1, box.y + box.height / 2, { steps: 4 })
  await expect(frame).toHaveAttribute('data-video-position', rightPosition ?? '')

  await panel.getByRole('button', { name: 'Reset view', exact: true }).click()
  box = await visibleFrameBounds(frame)
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width * 0.1, box.y + box.height / 2, { steps: 4 })
  await page.mouse.up()
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

test('original photo toggles within the gallery and Escape restores focus', async ({ page }) => {
  const panel = await openStudy(page, true)
  const poster = await videoFrame(panel).locator('img').first().getAttribute('src')
  await panel.getByRole('button', { name: 'Original photo', exact: true }).click()
  await expect(page.getByRole('dialog')).toHaveCount(1)
  await expect(panel.getByRole('img')).toBeVisible()
  await expect(panel.getByRole('img')).toHaveAttribute('src', poster ?? '')
  await expect(videoFrame(panel)).toHaveCount(0)
  await panel.getByRole('button', { name: 'Explore recorded views', exact: true }).click()
  await expectVideoReady(panel)
  await page.keyboard.press('Escape')
  await expect(panel).toHaveCount(0)
  await expect(page.getByRole('button', { name: /^Enlarge piece 1:/ })).toBeFocused()
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
  let retryRequested = false
  await page.route(videoPattern('ghostface'), async route => {
    if (!retryRequested) {
      await route.abort('failed')
    } else await route.continue()
  })
  const panel = await openStudy(page, true)
  const frame = videoFrame(panel)
  await frame.scrollIntoViewIfNeeded()
  await expect(frame).toHaveAttribute('data-video-state', 'error', { timeout: 20_000 })
  await expect(frame.locator('img').first()).toBeVisible()
  retryRequested = true
  await panel.getByRole('button', { name: /retry/i }).click()
  await expectVideoReady(panel)
})

test('a failed drawing leaves recorded views and angle controls available', async ({ page }) => {
  await page.route('**/videos/tattoos/ghostface-drawing.json', async route => await route.abort('failed'))

  for (const reducedMotion of [false, true]) {
    const panel = await openStudy(page)
    if (reducedMotion) await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect(panel.locator('[data-drawing-state]')).toHaveAttribute('data-drawing-state', 'unavailable')
    await expect(panel.getByRole('status').filter({ hasText: 'Drawing unavailable' })).toBeVisible()
    const frame = await expectVideoReady(panel)
    const angle = viewingAngle(panel)
    await expect(angle).toBeEnabled()
    await angle.focus()
    await page.keyboard.press('End')
    await expect(frame).toHaveAttribute('data-video-position', '100')
    await page.keyboard.press('Escape')
  }
})

test('gallery navigation replaces pending media and opens every recorded piece', async ({ page }) => {
  const pending = Promise.withResolvers<undefined>()
  const intercepted = Promise.withResolvers<undefined>()
  await page.route(videoPattern('ghostface'), async route => {
    intercepted.resolve(undefined)
    await pending.promise
    await route.continue()
  })
  try {
    const panel = await openStudy(page, true)
    await expect(videoFrame(panel)).toHaveAttribute('data-video-state', 'loading')
    await intercepted.promise
    for (let piece = 3; piece <= 12; piece += 1) {
      await panel.getByRole('button', { name: 'Next', exact: true }).click()
      await expect(panel.getByText(piece + ' / 12', { exact: true })).toBeVisible()
      if ([3, 11, 12].includes(piece)) {
        await expectVideoReady(panel)
        await expect(page.locator('[data-video-state]:visible')).toHaveCount(1)
      } else await expect(videoFrame(panel)).toHaveCount(0)
    }
    pending.resolve(undefined)
    for (let piece = 11; piece >= 2; piece -= 1) {
      await panel.getByRole('button', { name: 'Previous', exact: true }).click()
    }
    await expectVideoReady(panel)
    await expect(page.locator('[data-video-state]:visible')).toHaveCount(1)
  } finally {
    pending.resolve(undefined)
  }
})

test('reduced motion keeps deliberate drag and slider selection available', async ({ page }) => {
  const panel = await openStudy(page, true)
  const frame = await expectVideoReady(panel)
  const angle = viewingAngle(panel)
  const box = await visibleFrameBounds(frame)
  expect(box.height).toBeGreaterThan(0)
  await page.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2)
  await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2, { steps: 5 })
  await expect(frame).toHaveAttribute('data-video-position', '0')
  await angle.focus()
  await page.keyboard.press('End')
  await expect(frame).toHaveAttribute('data-video-position', '100')

  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(panel.getByRole('button', { name: 'Play drawing', exact: true })).toBeEnabled()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(panel.getByRole('button', { name: 'Play drawing', exact: true })).toBeDisabled()
  await page.mouse.move(box.x + box.width * 0.3, box.y + box.height / 2, { steps: 5 })
  await expect(frame).toHaveAttribute('data-video-position', '100')
  await panel.getByRole('button', { name: 'Reset view', exact: true }).click()
  await expect(frame).toHaveAttribute('data-video-position', '0')
  await frame.scrollIntoViewIfNeeded()
  const dragBox = await visibleFrameBounds(frame)
  expect(dragBox.height).toBeGreaterThan(0)
  await page.mouse.move(dragBox.x + dragBox.width * 0.5, dragBox.y + dragBox.height / 2)
  await page.mouse.down()
  await page.mouse.move(dragBox.x + dragBox.width * 0.8, dragBox.y + dragBox.height / 2, { steps: 5 })
  await page.mouse.up()
  await expect.poll(async () => Number(await frame.getAttribute('data-video-position'))).toBeGreaterThan(0)
  await angle.focus()
  await page.keyboard.press('Home')
  await expect(frame).toHaveAttribute('data-video-position', '-100')
  await panel.getByRole('button', { name: 'Reset view', exact: true }).click()
  await expect(angle).toHaveAttribute('aria-valuenow', '0')
})

test('touch drag explores horizontally while vertical gestures scroll the viewer', async ({ page }) => {
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

    const scrollContainer = frame.locator('xpath=ancestor::div[contains(@class, "overflow-y-auto")][1]')
    const scrollBefore = await scrollContainer.evaluate(element => element.scrollTop)
    const x = box.x + box.width / 2
    const startY = box.y + box.height * 0.8
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: startY, id: 2 }] })
    for (let step = 1; step <= 6; step += 1) {
      await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: startY - box.height * 0.5 * step / 6, id: 2 }] })
    }
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    await expect.poll(async () => await scrollContainer.evaluate(element => element.scrollTop)).toBeGreaterThan(scrollBefore + 30)
  } finally {
    await session.detach()
  }
})

for (const width of widths) {
  test('video viewer fits at ' + width + 'px and exposes both ends', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    const selected = await openStudy(page, true)
    await selected.scrollIntoViewIfNeeded()
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

    for (const control of await selected.locator('button, [role="slider"]').all()) {
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
