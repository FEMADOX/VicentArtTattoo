import { expect, test, type Locator, type Page } from '@playwright/test'

const fixturePath = '/tests/fixtures/ink-views/index.html'
const referenceSource = '/tests/fixtures/ink-views/view-2.svg'

async function openStudy (page: Page, mode?: string) {
  await page.goto(fixturePath + (mode ? '?case=' + mode : ''))
  return page.locator('[data-ink-study]')
}

async function waitForViews (study: Locator) {
  await expect(study.getByRole('slider', { name: 'Viewing angle' })).toBeEnabled()
}

async function expectDrawingComplete (study: Locator) {
  await expect(study).toHaveAttribute('data-ink-state', 'complete')
}

async function openWarmTwelveAngleStudy (page: Page) {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const study = await openStudy(page, '12frames')
  await expectDrawingComplete(study)
  await waitForViews(study)

  const angle = study.getByRole('slider', { name: 'Viewing angle' })
  await angle.focus()
  await angle.press('Home')
  await expect(study).toHaveAttribute('data-ink-views', '0')
  await angle.press('End')
  await expect(study).toHaveAttribute('data-ink-views', '11')
  for (let index = 10; index >= 4; index--) {
    await angle.press('ArrowLeft')
    await expect(study).toHaveAttribute('data-ink-views', String(index))
  }
  await angle.press('End')
  await expect(study).toHaveAttribute('data-ink-views', '11')
  return study
}

async function delaySecondIndexTwoRequest (page: Page) {
  let requests = 0
  await page.route(url => url.pathname.endsWith('/view-3.svg') && url.searchParams.get('angle') === '2', async route => {
    requests++
    if (requests === 2) {
      await page.waitForFunction(() => document.documentElement.dataset.inkTestReleaseImage === 'true')
    }
    await route.continue()
  })
  return {
    requests: () => requests,
    releaseResponse: async () => await page.evaluate(() => {
      document.documentElement.dataset.inkTestReleaseImage = 'true'
    })
  }
}

async function observePointerCancellation (frame: Locator) {
  await frame.evaluate(element => {
    element.setAttribute('data-test-pointer-cancel-count', '0')
    element.setAttribute('data-test-lost-capture-count', '0')
    element.addEventListener('pointercancel', () => {
      element.setAttribute('data-test-pointer-cancel-count', String(Number(element.getAttribute('data-test-pointer-cancel-count')) + 1))
    })
    element.addEventListener('lostpointercapture', () => {
      element.setAttribute('data-test-lost-capture-count', String(Number(element.getAttribute('data-test-lost-capture-count')) + 1))
    })
  })
}

async function startTouchDragToIndexTwo (page: Page, study: Locator) {
  const frame = study.locator('img').first().locator('..')
  const bounds = await frame.boundingBox()
  if (!bounds) throw new Error('The test image frame has no layout box.')
  const session = await page.context().newCDPSession(page)
  await session.send('Network.enable')
  await session.send('Network.setCacheDisabled', { cacheDisabled: true })
  await session.send('Network.clearBrowserCache')
  const touch = (x: number, y: number) => ({ id: 1, x, y, radiusX: 1, radiusY: 1, force: 1 })
  const centerY = bounds.y + bounds.height * 0.5
  const selectedAngleX = bounds.x + bounds.width * 11.5 / 12
  const requestedAngleX = bounds.x + bounds.width * 2.5 / 12

  await observePointerCancellation(frame)
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [touch(selectedAngleX, centerY)]
  })
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [touch(requestedAngleX, centerY)]
  })
  return { frame, image: study.locator('img').first(), session }
}

test('draws automatically at speed 2 and enables angles after all images decode', async ({ page }) => {
  test.setTimeout(20000)
  await page.setViewportSize({ width: 768, height: 120 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })

  const study = await openStudy(page)
  const speed = study.getByRole('slider', { name: 'Drawing speed' })
  const angle = study.getByRole('slider', { name: 'Viewing angle' })

  await expect(study).toHaveAttribute('data-ink-state', 'waiting')
  await expect(angle).toBeDisabled()
  await speed.focus()
  await speed.press('End')
  await expect(speed).toHaveAttribute('aria-valuenow', '2')

  await page.setViewportSize({ width: 768, height: 900 })
  await expect(study).toHaveAttribute('data-ink-state', 'playing', { timeout: 5000 })
  await expect(study).toHaveAttribute('data-ink-views', '1')
  await expect(study).toHaveAttribute('data-ink-state', 'complete', { timeout: 15000 })
  await waitForViews(study)
  await expect(angle).toHaveAttribute('aria-valuetext', 'View 2 of 4')
})

test('mouse, slider and enlarged image keep the chosen angle and restore focus', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.mouse.move(0, 0)
  const study = await openStudy(page)
  const image = study.locator('img').first()

  await study.getByRole('button', { name: 'Show original' }).click()
  await expect(study.getByRole('status')).toHaveText('Original photograph')
  await waitForViews(study)
  await expect(study).toHaveAttribute('data-ink-views', '1')
  await expect(image).toHaveAttribute('src', referenceSource)

  const frame = image.locator('..')
  const bounds = await frame.boundingBox()
  if (!bounds) throw new Error('The test image frame has no layout box.')
  await page.mouse.move(bounds.x + bounds.width * 0.375, bounds.y + bounds.height * 0.5)
  await expect(study).toHaveAttribute('data-ink-views', '1')
  await page.mouse.move(bounds.x + bounds.width * 0.875, bounds.y + bounds.height * 0.5)
  await expect(study).toHaveAttribute('data-ink-views', '3')
  await expect(image).toHaveAttribute('src', '/tests/fixtures/ink-views/view-4.svg')

  const angle = study.getByRole('slider', { name: 'Viewing angle' })
  await angle.focus()
  await angle.press('Home')
  await expect(study).toHaveAttribute('data-ink-views', '0')
  await expect(angle).toHaveAttribute('aria-valuetext', 'View 1 of 4')
  await angle.press('End')
  await expect(study).toHaveAttribute('data-ink-views', '3')
  await expect(angle).toHaveAttribute('aria-valuetext', 'View 4 of 4')

  const enlarge = study.getByRole('button', { name: 'Enlarge image' })
  await enlarge.focus()
  await enlarge.click()
  const dialog = page.getByRole('dialog', { name: 'Original photograph' })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('img')).toHaveAttribute('src', '/tests/fixtures/ink-views/view-4.svg')
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(enlarge).toBeFocused()
  await expect(image).toHaveAttribute('src', '/tests/fixtures/ink-views/view-4.svg')
})

test('replay preserves speed and Show original returns to the reference angle', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  const study = await openStudy(page)
  const speed = study.getByRole('slider', { name: 'Drawing speed' })
  const image = study.locator('img').first()

  await speed.focus()
  await speed.press('End')
  await expect(speed).toHaveAttribute('aria-valuenow', '2')
  await study.getByRole('button', { name: 'Show original' }).click()
  await expectDrawingComplete(study)
  await expect(study.getByRole('status')).toHaveText('Original photograph')
  await waitForViews(study)
  await expect(study).toHaveAttribute('data-ink-views', '1')
  await expect(image).toHaveAttribute('src', referenceSource)

  const angle = study.getByRole('slider', { name: 'Viewing angle' })
  await angle.focus()
  await angle.press('End')
  await expect(study).toHaveAttribute('data-ink-views', '3')
  await study.getByRole('button', { name: 'Show original' }).click()
  await expectDrawingComplete(study)
  await expect(study).toHaveAttribute('data-ink-views', '1')
  await expect(image).toHaveAttribute('src', referenceSource)

  await angle.press('End')
  await expect(study).toHaveAttribute('data-ink-views', '3')
  await study.getByRole('button', { name: 'Replay animation' }).click()
  await expect(study).toHaveAttribute('data-ink-state', 'playing')
  await expect(study).toHaveAttribute('data-ink-views', '1')
  await expect(speed).toHaveAttribute('aria-valuenow', '2')
  await study.getByRole('button', { name: 'Show original' }).click()
  await expectDrawingComplete(study)
  await expect(study).toHaveAttribute('data-ink-views', '1')
  await expect(speed).toHaveAttribute('aria-valuenow', '2')
})

test('initial reduced motion skips drawing but keeps manual angle controls', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const study = await openStudy(page)
  const speed = study.getByRole('slider', { name: 'Drawing speed' })
  const angle = study.getByRole('slider', { name: 'Viewing angle' })

  await expectDrawingComplete(study)
  await waitForViews(study)
  await expect(speed).toBeDisabled()
  await expect(angle).toBeEnabled()
  await expect(study).toHaveAttribute('data-ink-views', '1')

  const bounds = await study.locator('img').first().locator('..').boundingBox()
  if (!bounds) throw new Error('The test image frame has no layout box.')
  await page.mouse.move(bounds.x + bounds.width * 0.875, bounds.y + bounds.height * 0.5)
  await expect(study).toHaveAttribute('data-ink-views', '1')

  await angle.focus()
  await angle.press('Home')
  await expect(study).toHaveAttribute('data-ink-views', '0')
  await expect(angle).toHaveAttribute('aria-valuetext', 'View 1 of 4')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expectDrawingComplete(study)
  await expect(angle).toBeEnabled()
})

test('a live reduced-motion change stops drawing and still permits manual selection', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  const study = await openStudy(page)
  const speed = study.getByRole('slider', { name: 'Drawing speed' })
  const angle = study.getByRole('slider', { name: 'Viewing angle' })

  await expect(study).toHaveAttribute('data-ink-state', 'playing')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expectDrawingComplete(study)
  await expect(speed).toBeDisabled()
  await waitForViews(study)
  await angle.focus()
  await angle.press('End')
  await expect(study).toHaveAttribute('data-ink-views', '3')

  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expectDrawingComplete(study)
  await expect(angle).toBeEnabled()
})

test('touch drag selects angles and cancellation keeps the last completed selection', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const study = await openStudy(page)
  await expectDrawingComplete(study)
  await waitForViews(study)

  const frame = study.locator('img').first().locator('..')
  await expect(frame).toHaveCSS('touch-action', 'pan-y pinch-zoom')
  const bounds = await frame.boundingBox()
  if (!bounds) throw new Error('The test image frame has no layout box.')
  const session = await page.context().newCDPSession(page)
  const touch = (x: number, y: number) => ({ id: 1, x, y, radiusX: 1, radiusY: 1, force: 1 })

  await session.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [touch(bounds.x + bounds.width * 0.375, bounds.y + bounds.height * 0.5)]
  })
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [touch(bounds.x + bounds.width * 0.875, bounds.y + bounds.height * 0.5)]
  })
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await expect(study).toHaveAttribute('data-ink-views', '3')

  await session.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [touch(bounds.x + bounds.width * 0.875, bounds.y + bounds.height * 0.5)]
  })
  await session.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] })
  await expect(study).toHaveAttribute('data-ink-views', '3')

  await session.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [touch(bounds.x + bounds.width * 0.875, bounds.y + bounds.height * 0.5)]
  })
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [touch(bounds.x + bounds.width * 0.125, bounds.y + bounds.height * 0.5)]
  })
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await expect(study).toHaveAttribute('data-ink-views', '0')
  await session.detach()
})

test('a cancelled touch stays on the last photo when an evicted angle decodes late', async ({ page }) => {
  const delayedFrame = await delaySecondIndexTwoRequest(page)
  let session: Awaited<ReturnType<ReturnType<Page['context']>['newCDPSession']>> | undefined = undefined

  try {
    const study = await openWarmTwelveAngleStudy(page)
    const image = study.locator('img').first()
    await expect(image).toHaveAttribute('src', '/tests/fixtures/ink-views/view-4.svg?angle=11')
    expect(delayedFrame.requests()).toBe(1)

    const requestedFrame = page.waitForRequest(request => request.url().endsWith('/view-3.svg?angle=2'))
    const drag = await startTouchDragToIndexTwo(page, study)
    session = drag.session
    await requestedFrame
    await expect.poll(delayedFrame.requests).toBe(2)
    await expect(study).toHaveAttribute('data-ink-views', '11')
    await expect(image).toHaveAttribute('src', '/tests/fixtures/ink-views/view-4.svg?angle=11')
    await session.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] })
    await expect(drag.frame).toHaveAttribute('data-test-pointer-cancel-count', '1')
    await expect(drag.frame).toHaveAttribute('data-test-lost-capture-count', '1')
    await expect(study).toHaveAttribute('data-ink-views', '11')

    const response = page.waitForResponse(result => result.url().endsWith('/view-3.svg?angle=2'))
    await delayedFrame.releaseResponse()
    await response
    await page.waitForLoadState('networkidle')
    await expect(study).toHaveAttribute('data-ink-views', '11')
    await expect(image).toHaveAttribute('src', '/tests/fixtures/ink-views/view-4.svg?angle=11')
  } finally {
    await delayedFrame.releaseResponse()
  }
})

test('the enlarged photo remains static when a pending angle finishes loading', async ({ page }) => {
  const delayedFrame = await delaySecondIndexTwoRequest(page)
  let session: Awaited<ReturnType<ReturnType<Page['context']>['newCDPSession']>> | undefined = undefined

  try {
    const study = await openWarmTwelveAngleStudy(page)
    const image = study.locator('img').first()
    await expect(image).toHaveAttribute('src', '/tests/fixtures/ink-views/view-4.svg?angle=11')
    expect(delayedFrame.requests()).toBe(1)

    const requestedFrame = page.waitForRequest(request => request.url().endsWith('/view-3.svg?angle=2'))
    const drag = await startTouchDragToIndexTwo(page, study)
    session = drag.session
    await requestedFrame
    await expect.poll(delayedFrame.requests).toBe(2)
    await expect(study).toHaveAttribute('data-ink-views', '11')
    await expect(image).toHaveAttribute('src', '/tests/fixtures/ink-views/view-4.svg?angle=11')
    await session.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] })
    await expect(drag.frame).toHaveAttribute('data-test-pointer-cancel-count', '1')
    await expect(drag.frame).toHaveAttribute('data-test-lost-capture-count', '1')

    const enlarge = study.getByRole('button', { name: 'Enlarge image' })
    await enlarge.click()
    const dialog = page.getByRole('dialog', { name: 'Original photograph' })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('img')).toHaveAttribute('src', '/tests/fixtures/ink-views/view-4.svg?angle=11')

    const response = page.waitForResponse(result => result.url().endsWith('/view-3.svg?angle=2'))
    await delayedFrame.releaseResponse()
    await response
    await page.waitForLoadState('networkidle')
    await expect(dialog.getByRole('img')).toHaveAttribute('src', '/tests/fixtures/ink-views/view-4.svg?angle=11')
    await expect(image).toHaveAttribute('src', '/tests/fixtures/ink-views/view-4.svg?angle=11')
    await expect(study).toHaveAttribute('data-ink-views', '11')
  } finally {
    await delayedFrame.releaseResponse()
  }
})

test('loading a requested angle while other frames decode does not lose it', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.route('**/view-4.svg', async route => {
    await page.waitForFunction(() => document.documentElement.dataset.inkTestReleaseFrame === 'true')
    await route.continue()
  })
  const releaseFrame = async () => await page.evaluate(() => {
    document.documentElement.dataset.inkTestReleaseFrame = 'true'
  })
  const requestedFrame = page.waitForRequest(request => request.url().endsWith('/view-4.svg'))
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))

  try {
    const study = await openStudy(page)
    const image = study.locator('img').first()
    await requestedFrame
    await expect(study.locator('[data-ink-views-status]')).toContainText('Preparing other views')
    await expect(study.getByRole('slider', { name: 'Viewing angle' })).toBeDisabled()

    await study.getByRole('button', { name: 'Show original' }).click()
    await expectDrawingComplete(study)
    const bounds = await image.locator('..').boundingBox()
    if (!bounds) throw new Error('The test image frame has no layout box.')
    await page.mouse.move(bounds.x + bounds.width * 0.875, bounds.y + bounds.height * 0.5)
    await releaseFrame()

    await expect(image).toHaveAttribute('src', '/tests/fixtures/ink-views/view-4.svg')
    await waitForViews(study)
    expect(errors).toEqual([])
  } finally {
    await releaseFrame()
  }
})

test('a missing angle leaves the exact original photograph available', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const study = await openStudy(page, 'missingframe')
  const image = study.locator('img').first()

  await expectDrawingComplete(study)
  await expect(study.locator('[data-ink-views-status]')).toHaveText(
    'Unable to load these views. The original photograph is shown.'
  )
  await expect(image).toHaveAttribute('src', referenceSource)
  await expect(study.getByRole('slider', { name: 'Viewing angle' })).toBeDisabled()
})

test('an invalid reference is reported while preserving the original photograph', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const study = await openStudy(page, 'invalidref')
  const image = study.locator('img').first()

  await expectDrawingComplete(study)
  await expect(study.locator('[data-ink-views-status]')).toHaveText('The original view index is invalid.')
  await expect(image).toHaveAttribute('src', referenceSource)
  await expect(study.getByRole('slider', { name: 'Viewing angle' })).toBeDisabled()
})

test('twelve angles decode and keep Home and End within their bounds', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const study = await openStudy(page, '12frames')
  const angle = study.getByRole('slider', { name: 'Viewing angle' })

  await expectDrawingComplete(study)
  await waitForViews(study)
  await expect(study).toHaveAttribute('data-ink-views', '1')
  await angle.focus()
  await angle.press('Home')
  await expect(study).toHaveAttribute('data-ink-views', '0')
  await expect(angle).toHaveAttribute('aria-valuetext', 'View 1 of 12')
  await angle.press('End')
  await expect(study).toHaveAttribute('data-ink-views', '11')
  await expect(angle).toHaveAttribute('aria-valuetext', 'View 12 of 12')
})

test('synthetic views retain their image ratio without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const study = await openStudy(page)
  await expectDrawingComplete(study)
  await waitForViews(study)
  const image = study.locator('img').first()

  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    const measurements = await image.evaluate(element => {
      if (!(element instanceof HTMLImageElement)) throw new Error('The test image element is not an image.')
      const bounds = element.getBoundingClientRect()
      return {
        naturalWidth: element.naturalWidth,
        naturalHeight: element.naturalHeight,
        renderedWidth: bounds.width,
        renderedHeight: bounds.height,
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth
      }
    })
    expect(measurements.naturalWidth).toBe(512)
    expect(measurements.naturalHeight).toBe(768)
    expect(measurements.renderedWidth).toBeGreaterThan(0)
    expect(Math.abs(measurements.renderedWidth / measurements.renderedHeight / (512 / 768) - 1)).toBeLessThan(0.01)
    expect(measurements.documentWidth - measurements.viewportWidth).toBeLessThanOrEqual(1)
  }
})
