import { expect, test, type Page } from '@playwright/test'

async function visitPortfolio (page: Page) {
  await page.goto('/#portfolio')
  return page.locator('#portfolio')
}

async function expectNoOverflow (page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1)
}

test('portfolio separates four recorded-view tattoos from all eight photographs', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const portfolio = await visitPortfolio(page)
  const movement = portfolio.locator('section[aria-labelledby="life-movement-heading"]')
  const still = portfolio.locator('section[aria-labelledby="still-tattoos-heading"]')

  await expect(movement).toBeVisible()
  await expect(still).toBeVisible()
  await expect(movement.locator('[data-gallery-work]')).toHaveCount(4)
  await expect(still.locator('[data-gallery-work]')).toHaveCount(8)
  expect(await movement.locator('[data-gallery-work]').evaluateAll(elements => elements.map(element => element.getAttribute('data-gallery-work')))).toEqual(['9', '10', '11', '12'])
  expect(await still.locator('[data-gallery-work]').evaluateAll(elements => elements.map(element => element.getAttribute('data-gallery-work')))).toEqual(['1', '2', '3', '4', '5', '6', '7', '8'])
})

test('sunflower drawing loads and starts when the photo enters view', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  const portfolio = await visitPortfolio(page)
  const work = portfolio.locator('[data-gallery-work="2"]')
  await work.scrollIntoViewIfNeeded()
  const drawing = work.locator('[data-ink-study]')
  await expect(drawing).toBeVisible()
  await expect(drawing).toHaveAttribute('data-ink-state', 'playing')
  await expect(drawing).toHaveAttribute('data-ink-phase', 'outline')
  await expect(drawing.locator('[data-ink-layer="shading"]')).toBeVisible()
})

test('lightbox navigates all twelve pieces, traps focus and restores each opener', async ({ page }) => {
  test.setTimeout(60_000)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const portfolio = await visitPortfolio(page)
  const firstWork = portfolio.locator('[data-gallery-work="1"]')
  await firstWork.scrollIntoViewIfNeeded()
  const first = firstWork.getByRole('button', { name: /^View original:/ })
  const sourceImage = firstWork.locator('img').first()
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
  await expect(dialog.getByText('5 / 12', { exact: true })).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Previous', exact: true })).toBeEnabled()
  const firstSource = await lightboxImage.getAttribute('src')
  for (let index = 0; index < 10; index += 1) {
    await page.keyboard.press('Tab')
    expect(await dialog.evaluate(element => element.contains(document.activeElement))).toBe(true)
  }
  await page.keyboard.press('ArrowRight')
  await expect(dialog.getByText('6 / 12', { exact: true })).toBeVisible()
  await expect(lightboxImage).not.toHaveAttribute('src', firstSource ?? '')
  await page.keyboard.press('ArrowLeft')
  await expect(lightboxImage).toHaveAttribute('src', firstSource ?? '')
  for (let piece = 0; piece < 5; piece += 1) await page.keyboard.press('ArrowLeft')
  await expect(dialog.getByText('1 / 12', { exact: true })).toBeVisible()
  await expect(dialog.locator('[aria-live="polite"]')).toContainText('Piece 9: Ghostface')
  await page.keyboard.press('ArrowRight')
  for (let piece = 2; piece <= 12; piece += 1) {
    await dialog.getByRole('button', { name: 'Next', exact: true }).click()
  }
  await expect(dialog.getByText('12 / 12', { exact: true })).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Next', exact: true })).toBeDisabled()
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(first).toBeFocused()

  const eighthWork = portfolio.locator('[data-gallery-work="8"]')
  await eighthWork.scrollIntoViewIfNeeded()
  const eighth = eighthWork.getByRole('button', { name: /^View original:/ })
  await eighth.click()
  await expect(dialog.getByText('12 / 12', { exact: true })).toBeVisible()
  await dialog.getByRole('button', { name: 'Previous', exact: true }).click()
  await expect(dialog.getByText('11 / 12', { exact: true })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(eighth).toBeFocused()
})

test('portfolio uses two movement columns and three photo columns on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const portfolio = await visitPortfolio(page)
  const movementGrid = portfolio.locator('section[aria-labelledby="life-movement-heading"] > div')
  const stillGrid = portfolio.locator('section[aria-labelledby="still-tattoos-heading"] > div')

  await expect.poll(async () => await movementGrid.evaluate(element => getComputedStyle(element).gridTemplateColumns.split(' ').length)).toBe(2)
  await expect.poll(async () => await stillGrid.evaluate(element => getComputedStyle(element).gridTemplateColumns.split(' ').length)).toBe(3)
})

test('portfolio grids collapse to one column on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const portfolio = await visitPortfolio(page)
  const movementGrid = portfolio.locator('section[aria-labelledby="life-movement-heading"] > div')
  const stillGrid = portfolio.locator('section[aria-labelledby="still-tattoos-heading"] > div')

  await page.setViewportSize({ width: 390, height: 844 })
  await expect.poll(async () => await movementGrid.evaluate(element => getComputedStyle(element).gridTemplateColumns.split(' ').length)).toBe(1)
  await expect.poll(async () => await stillGrid.evaluate(element => getComputedStyle(element).gridTemplateColumns.split(' ').length)).toBe(1)
})

test('portfolio images stay contained without horizontal overflow at responsive widths', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const portfolio = await visitPortfolio(page)
  const stillWorks = portfolio.locator('section[aria-labelledby="still-tattoos-heading"] [data-gallery-work]')

  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await expect(stillWorks).toHaveCount(8)
    const measurements = await stillWorks.evaluateAll(cards => cards.map(card => {
      const image = card.querySelector('img')
      const imageRect = image?.getBoundingClientRect()
      return {
        ratio: imageRect ? imageRect.width / imageRect.height : 0,
        objectFit: image ? getComputedStyle(image).objectFit : ''
      }
    }))
    expect(measurements).toHaveLength(8)
    for (const measurement of measurements) {
      expect(measurement.ratio).toBeCloseTo(0.75, 2)
      expect(measurement.objectFit).toBe('contain')
    }
    await expectNoOverflow(page)
  }
})
