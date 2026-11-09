import { expect, test, type Page } from '@playwright/test'

async function visitPortfolio (page: Page) {
  await page.goto('/#portfolio')
  return page.locator('#portfolio')
}

async function expectNoOverflow (page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1)
}

test('portfolio starts with four pieces and expands and collapses the rest', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const portfolio = await visitPortfolio(page)
  const gallery = portfolio.getByRole('region', { name: 'Selected tattoo projects' })

  await expect(gallery).toBeVisible()
  await expect(portfolio.getByRole('button', { name: /^(Enlarge piece|Explore recorded views for piece)/ })).toHaveCount(4)
  await expect(portfolio.getByText('4 of 12 original works')).toBeVisible()
  await portfolio.getByRole('button', { name: 'View more projects' }).click()
  await expect(portfolio.getByRole('button', { name: /^(Enlarge piece|Explore recorded views for piece)/ })).toHaveCount(12)
  await expect(portfolio.getByText('12 of 12 original works')).toBeVisible()
  await portfolio.getByRole('button', { name: 'Show fewer projects' }).click()
  await expect(portfolio.getByRole('button', { name: /^(Enlarge piece|Explore recorded views for piece)/ })).toHaveCount(4)
})

test('portfolio arrows and arrow keys move through the selected pieces', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const portfolio = await visitPortfolio(page)
  const gallery = portfolio.getByRole('region', { name: 'Selected tattoo projects' })
  const previous = gallery.getByRole('button', { name: 'Previous slide' })
  const next = gallery.getByRole('button', { name: 'Next slide' })

  await expect(previous).toBeDisabled()
  await next.click()
  await expect(previous).toBeEnabled()
  await previous.click()
  await expect(previous).toBeDisabled()
  await next.focus()
  await next.press('ArrowRight')
  await expect(previous).toBeEnabled()
  await previous.press('ArrowLeft')
  await expect(previous).toBeDisabled()
})

test('lightbox navigates all twelve pieces and restores focus to each opener', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const portfolio = await visitPortfolio(page)
  const first = portfolio.getByRole('button', { name: /^Enlarge piece 1:/ })
  const sourceImage = first.locator('img')
  const originalWidth = await sourceImage.getAttribute('width') ?? ''
  const originalHeight = await sourceImage.getAttribute('height') ?? ''

  expect(originalWidth).not.toBe('')
  expect(originalHeight).not.toBe('')

  await first.click()
  const dialog = page.getByRole('dialog', { name: 'Original tattoo work' })
  const lightboxImage = dialog.getByRole('img')
  await expect(lightboxImage).toHaveCSS('object-fit', 'contain')
  await expect(lightboxImage).toHaveAttribute('width', originalWidth)
  await expect(lightboxImage).toHaveAttribute('height', originalHeight)
  await expect(dialog.getByText('1 / 12', { exact: true })).toBeVisible()
  await page.keyboard.press('ArrowRight')
  await expect(dialog.getByText('2 / 12', { exact: true })).toBeVisible()
  for (let piece = 3; piece <= 12; piece += 1) {
    await dialog.getByRole('button', { name: 'Next', exact: true }).click()
  }
  await expect(dialog.getByText('12 / 12', { exact: true })).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Next', exact: true })).toBeDisabled()
  await page.keyboard.press('Escape')
  await expect(first).toBeFocused()

  await portfolio.getByRole('button', { name: 'View more projects' }).click()
  const eighth = portfolio.getByRole('button', { name: /^Enlarge piece 8:/ })
  await eighth.click()
  await expect(dialog.getByText('10 / 12', { exact: true })).toBeVisible()
  await dialog.getByRole('button', { name: 'Previous', exact: true }).click()
  await expect(dialog.getByText('9 / 12', { exact: true })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(eighth).toBeFocused()
})

test('recorded views load only when opened, keep the photo in one dialog, and drawing remains optional', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  let footageRequests = 0
  let drawingRequests = 0
  page.on('request', request => {
    if (request.url().includes('/videos/tattoos/ghostface-') && request.url().endsWith('.mp4')) footageRequests++
    if (request.url().endsWith('/videos/tattoos/ghostface-drawing.json')) drawingRequests++
  })
  await page.goto('/#portfolio')
  const portfolio = page.locator('#portfolio')
  const ghostface = portfolio.getByRole('button', { name: /^Explore recorded views for piece 9:/ })
  await expect(ghostface).toBeVisible()
  expect(footageRequests).toBe(0)
  expect(drawingRequests).toBe(0)

  await page.route('**/videos/tattoos/ghostface-drawing.json', async route => {
    await route.abort()
  })
  await ghostface.click()
  const dialog = page.getByRole('dialog', { name: 'Original tattoo work' })
  const study = dialog.locator('[data-ink-study]')
  await expect(study).toHaveAttribute('data-drawing-state', 'idle')
  const frame = study.locator('[data-video-state]')
  await expect(frame).toHaveAttribute('data-video-state', 'ready', { timeout: 20_000 })
  expect(footageRequests).toBeGreaterThan(0)
  expect(drawingRequests).toBe(0)
  await expect(dialog.getByText('2 / 12', { exact: true })).toBeVisible()

  const angle = study.getByRole('slider', { name: 'Viewing angle' })
  await angle.focus()
  await angle.press('ArrowRight')
  await expect(dialog.getByText('2 / 12', { exact: true })).toBeVisible()

  await dialog.getByRole('button', { name: 'Original photo' }).click()
  await expect(page.getByRole('dialog')).toHaveCount(1)
  await expect(dialog.getByRole('img')).toBeVisible()
  await dialog.getByRole('button', { name: 'Explore recorded views' }).click()
  await expect(study.locator('[data-video-state]')).toHaveAttribute('data-video-state', 'ready', { timeout: 20_000 })

  const playDrawing = dialog.getByRole('button', { name: 'Play drawing' })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(playDrawing).toBeDisabled()
  expect(drawingRequests).toBe(0)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(playDrawing).toBeEnabled()
  await playDrawing.click()
  await expect(study).toHaveAttribute('data-drawing-state', 'unavailable')
  await expect(study.locator('[data-video-state]')).toHaveAttribute('data-video-state', 'ready')
  expect(drawingRequests).toBe(1)
  await expect(dialog.getByRole('button', { name: 'Retry drawing' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(ghostface).toBeFocused()
})

test('gorilla drawing starts from its portfolio dialog only after the visitor requests it', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  let drawingModuleRequests = 0
  page.on('request', request => {
    if (request.url().includes('/src/designs/InkDrawingExperience.tsx')) drawingModuleRequests++
  })
  await page.goto('/#portfolio')
  const gorilla = page.getByRole('button', { name: /^Enlarge piece 1:/ })
  await gorilla.click()
  const dialog = page.getByRole('dialog', { name: 'Original tattoo work' })
  expect(drawingModuleRequests).toBe(0)
  const playDrawing = dialog.getByRole('button', { name: 'Play drawing' })
  await expect(playDrawing).toBeDisabled()
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(playDrawing).toBeEnabled()
  await playDrawing.click()
  const drawing = dialog.locator('[data-ink-study]')
  await expect(drawing).toHaveAttribute('data-ink-state', 'playing')
  await expect(dialog.getByRole('slider', { name: 'Drawing speed' })).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Skip drawing' })).toBeVisible()
  expect(drawingModuleRequests).toBeGreaterThan(0)
  await dialog.getByRole('button', { name: 'Skip drawing' }).click()
  await expect(drawing).toHaveAttribute('data-ink-state', 'complete')
  await expect(dialog.getByRole('button', { name: 'Show original' })).toBeVisible()
})

test('recorded dialog fits a phone, short landscape, and desktop viewport', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/#portfolio')
  const ghostface = page.getByRole('button', { name: /^Explore recorded views for piece 9:/ })
  await ghostface.click()
  const dialog = page.getByRole('dialog', { name: 'Original tattoo work' })
  const study = dialog.locator('[data-ink-study]')
  await expect(study.locator('[data-video-state]')).toHaveAttribute('data-video-state', 'ready', { timeout: 20_000 })

  for (const viewport of [{ width: 390, height: 844 }, { width: 568, height: 320 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport)
    await expect(dialog.getByRole('button', { name: 'Close dialog' })).toBeVisible()
    await expect(dialog.getByRole('button', { name: 'Original photo' })).toBeVisible()
    await expect(dialog.getByRole('button', { name: 'Next' })).toBeVisible()
    const bounds = await dialog.boundingBox()
    if (!bounds) throw new Error('Recorded-view dialog is not measurable')
    expect(bounds.x).toBeGreaterThanOrEqual(0)
    expect(bounds.y).toBeGreaterThanOrEqual(0)
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(viewport.width)
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(viewport.height)
    await expectNoOverflow(page)
  }
})

test('closing a video dialog aborts a pending drawing request', async ({ page }) => {
  const intercepted = Promise.withResolvers<undefined>()
  const pending = Promise.withResolvers<undefined>()
  let drawingAborted = false
  await page.addInitScript(() => {
    const originalFetch = window.fetch
    window.fetch = async (input, init) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
      if (url.includes('ghostface-drawing.json')) {
        init?.signal?.addEventListener('abort', () => {
          (window as Window & { drawingAborted?: boolean }).drawingAborted = true
        }, { once: true })
      }
      return await originalFetch(input, init)
    }
  })
  await page.route('**/videos/tattoos/ghostface-drawing.json', async route => {
    intercepted.resolve(undefined)
    await pending.promise
    await route.continue()
  })
  try {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/#portfolio')
    const ghostface = page.getByRole('button', { name: /^Explore recorded views for piece 9:/ })
    await ghostface.click()
    const dialog = page.getByRole('dialog', { name: 'Original tattoo work' })
    await dialog.getByRole('button', { name: 'Play drawing' }).click()
    await intercepted.promise
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    drawingAborted = await page.evaluate(() => (window as Window & { drawingAborted?: boolean }).drawingAborted === true)
    expect(drawingAborted).toBe(true)
    await expect(ghostface).toBeFocused()
  } finally {
    pending.resolve(undefined)
  }
})

test('desktop scroll drives the gallery to its end and back without losing focused controls', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  const portfolio = await visitPortfolio(page)
  const rail = portfolio.locator('[data-scroll-gallery]')
  const gallery = portfolio.getByRole('region', { name: 'Selected tattoo projects' })
  const first = gallery.getByRole('button', { name: /^Enlarge piece 1:/ })
  const last = gallery.getByRole('button', { name: /^Enlarge piece 7:/ })
  const next = gallery.getByRole('button', { name: 'Next slide' })

  await expect(rail).toHaveAttribute('data-scroll-gallery', 'linked')
  const start = await rail.evaluate(element => element.getBoundingClientRect().top + window.scrollY)
  await page.evaluate(position => window.scrollTo(0, position), start)
  await expect(first).toBeInViewport({ ratio: 0.5 })

  for (const control of [first, next]) {
    await control.focus()
    await page.evaluate(() => window.scrollBy(0, 16))
    await expect(control).toBeFocused()
    await expect(control).toBeInViewport()
  }
  await next.evaluate(element => element.blur())

  const end = await rail.evaluate(element => element.getBoundingClientRect().bottom + window.scrollY - window.innerHeight)
  await page.evaluate(position => window.scrollTo(0, position), end)
  await expect(last).toBeInViewport({ ratio: 0.5 })
  await expect(first).not.toBeInViewport()
  await last.focus()
  for (let step = 0; step < 24; step += 1) {
    await page.evaluate(() => window.scrollBy(0, -16))
    await expect(last).toBeFocused()
    await expect(last).toBeInViewport({ ratio: 0.5 })
  }
  await last.evaluate(element => element.blur())
  await page.evaluate(position => window.scrollTo(0, position), end)
  await expect(last).toBeInViewport({ ratio: 0.5 })

  await page.evaluate(position => window.scrollTo(0, position), start)
  await expect(first).toBeInViewport({ ratio: 0.5 })
  await expect(last).not.toBeInViewport()

  await page.setViewportSize({ width: 1023, height: 900 })
  await expect(rail).toHaveAttribute('data-scroll-gallery', 'manual')
  await next.click()
  await expect(gallery.getByRole('button', { name: 'Previous slide' })).toBeEnabled()
  await next.evaluate(element => element.blur())
  await page.setViewportSize({ width: 1440, height: 900 })
  await expect(rail).toHaveAttribute('data-scroll-gallery', 'linked')
  await expect(first).toBeInViewport({ ratio: 0.5 })
})

test('reduced motion keeps the desktop gallery manual at load and when changed live', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const portfolio = await visitPortfolio(page)
  const rail = portfolio.locator('[data-scroll-gallery]')

  await expect(rail).toHaveAttribute('data-scroll-gallery', 'manual')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(rail).toHaveAttribute('data-scroll-gallery', 'linked')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(rail).toHaveAttribute('data-scroll-gallery', 'manual')
})

test('portfolio images stay contained without horizontal overflow at responsive widths', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const portfolio = await visitPortfolio(page)
  await portfolio.getByRole('button', { name: 'View more projects' }).click()
  const artworks = portfolio.getByRole('button', { name: /^(Enlarge piece|Explore recorded views for piece)/ })

  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await expect(artworks).toHaveCount(12)
    const measurements = await artworks.evaluateAll(buttons => buttons.map(button => {
      const image = button.querySelector('img')
      const imageRect = image?.getBoundingClientRect()
      return {
        ratio: imageRect ? imageRect.width / imageRect.height : 0,
        objectFit: image ? getComputedStyle(image).objectFit : '',
        captionHeight: button.lastElementChild?.getBoundingClientRect().height ?? 0
      }
    }))
    expect(measurements).toHaveLength(12)
    for (const measurement of measurements) {
      expect(measurement.ratio).toBeCloseTo(0.75, 2)
      expect(measurement.objectFit).toBe('contain')
    }
    for (const group of [measurements.slice(0, 4), measurements.slice(4, 8), measurements.slice(8)]) {
      const heights = group.map(measurement => measurement.captionHeight)
      expect(heights[0]).toBeGreaterThanOrEqual(80)
      expect(new Set(heights).size).toBe(1)
    }
    await expectNoOverflow(page)
  }
})
