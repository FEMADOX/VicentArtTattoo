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
  await expect(portfolio.getByRole('button', { name: /^Enlarge piece/ })).toHaveCount(4)
  await portfolio.getByRole('button', { name: 'View more projects' }).click()
  await expect(portfolio.getByRole('button', { name: /^Enlarge piece/ })).toHaveCount(8)
  await portfolio.getByRole('button', { name: 'Show fewer projects' }).click()
  await expect(portfolio.getByRole('button', { name: /^Enlarge piece/ })).toHaveCount(4)
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

test('lightbox supports keyboard navigation, traps focus and restores each opener', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const portfolio = await visitPortfolio(page)
  const first = portfolio.getByRole('button', { name: /^Enlarge piece 1:/ })
  const sourceImage = first.locator('img')
  const originalWidth = await sourceImage.getAttribute('width') ?? ''
  const originalHeight = await sourceImage.getAttribute('height') ?? ''

  expect(originalWidth).not.toBe('')
  expect(originalHeight).not.toBe('')

  await first.focus()
  await first.press('Enter')
  const dialog = page.getByRole('dialog', { name: 'Original tattoo work' })
  const lightboxImage = dialog.getByRole('img')
  await expect(lightboxImage).toHaveCSS('object-fit', 'contain')
  await expect(lightboxImage).toHaveAttribute('width', originalWidth)
  await expect(lightboxImage).toHaveAttribute('height', originalHeight)
  await expect(dialog.getByText('1 / 8', { exact: true })).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Previous', exact: true })).toBeDisabled()
  const firstSource = await lightboxImage.getAttribute('src')
  for (let index = 0; index < 10; index += 1) {
    await page.keyboard.press('Tab')
    expect(await dialog.evaluate(element => element.contains(document.activeElement))).toBe(true)
  }
  await page.keyboard.press('ArrowRight')
  await expect(dialog.getByText('2 / 8', { exact: true })).toBeVisible()
  await expect(lightboxImage).not.toHaveAttribute('src', firstSource ?? '')
  await expect(dialog.locator('[aria-live="polite"]')).toContainText('Piece 2:')
  await page.keyboard.press('ArrowLeft')
  await expect(lightboxImage).toHaveAttribute('src', firstSource ?? '')
  await page.keyboard.press('ArrowRight')
  for (let piece = 3; piece <= 8; piece += 1) {
    await dialog.getByRole('button', { name: 'Next', exact: true }).click()
  }
  await expect(dialog.getByText('8 / 8', { exact: true })).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Next', exact: true })).toBeDisabled()
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(first).toBeFocused()

  await portfolio.getByRole('button', { name: 'View more projects' }).click()
  const eighth = portfolio.getByRole('button', { name: /^Enlarge piece 8:/ })
  await eighth.click()
  await expect(dialog.getByText('8 / 8', { exact: true })).toBeVisible()
  await dialog.getByRole('button', { name: 'Previous', exact: true }).click()
  await expect(dialog.getByText('7 / 8', { exact: true })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(eighth).toBeFocused()
})

test('desktop scroll drives the gallery to its end and back without losing focused controls', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  const portfolio = await visitPortfolio(page)
  const rail = portfolio.locator('[data-scroll-gallery]')
  const gallery = portfolio.getByRole('region', { name: 'Selected tattoo projects' })
  const first = gallery.getByRole('button', { name: /^Enlarge piece 1:/ })
  const last = gallery.getByRole('button', { name: /^Enlarge piece 4:/ })
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
  const artworks = portfolio.getByRole('button', { name: /^Enlarge piece/ })

  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await expect(artworks).toHaveCount(8)
    const measurements = await artworks.evaluateAll(buttons => buttons.map(button => {
      const image = button.querySelector('img')
      const imageRect = image?.getBoundingClientRect()
      return {
        ratio: imageRect ? imageRect.width / imageRect.height : 0,
        objectFit: image ? getComputedStyle(image).objectFit : '',
        captionHeight: button.lastElementChild?.getBoundingClientRect().height ?? 0
      }
    }))
    expect(measurements).toHaveLength(8)
    for (const measurement of measurements) {
      expect(measurement.ratio).toBeCloseTo(0.75, 2)
      expect(measurement.objectFit).toBe('contain')
    }
    for (const group of [measurements.slice(0, 4), measurements.slice(4)]) {
      const heights = group.map(measurement => measurement.captionHeight)
      expect(heights[0]).toBeGreaterThanOrEqual(80)
      expect(new Set(heights).size).toBe(1)
    }
    await expectNoOverflow(page)
  }
})
