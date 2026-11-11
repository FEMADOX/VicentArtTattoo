import { expect, test, type Locator } from '@playwright/test'

const viewports = [
  { width: 568, height: 320 },
  { width: 320, height: 568 },
  { width: 1440, height: 900 }
] as const

async function bounds (locator: Locator) {
  return await locator.evaluate(element => {
    const { x, y, width, height } = element.getBoundingClientRect()
    return { x, y, width, height }
  })
}

async function measure (locators: Locator[]) {
  return await Promise.all(locators.map(bounds))
}

async function expectCaptionVisible (caption: Locator) {
  await expect(caption).toBeVisible()
  expect(await caption.evaluate(element => element.scrollHeight <= element.clientHeight + 1)).toBe(true)
}

for (const viewport of viewports) {
  test('gallery viewer keeps its shell within the viewport while navigating at ' + viewport.width + 'x' + viewport.height, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    const first = page.getByRole('button', { name: /^Enlarge piece 1:/ })
    const dialog = page.getByRole('dialog', { name: 'Original tattoo work' })
    const image = dialog.getByRole('img')
    const caption = dialog.locator('[aria-live="polite"]')
    const previous = dialog.getByRole('button', { name: 'Previous', exact: true })
    const next = dialog.getByRole('button', { name: 'Next', exact: true })

    await page.setViewportSize(viewport)
    await page.goto('/')
    await first.click()
    await expect(dialog).toBeVisible()
    await page.evaluate(async () => {
      await document.fonts.ready
    })
    await expect(dialog).toHaveCSS('opacity', '1')
    await expect(image).toHaveCSS('object-fit', 'contain')
    await expect(previous).toBeDisabled()

    // Cover every piece once; other viewports only need a layout transition.
    const pieceCount = viewport.width === 320 ? 12 : 2
    let reference: unknown = undefined
    for (let piece = 1; piece <= pieceCount; piece += 1) {
      if (piece > 1) await next.click()
      const counter = dialog.getByText(piece + ' / 12', { exact: true })
      await expect(counter).toBeVisible()
      await expectCaptionVisible(caption)
      if (piece === 12) await expect(next).toBeDisabled()

      const [shell, artwork] = await measure([dialog, image])
      expect(artwork.height).toBeGreaterThanOrEqual(150)
      expect(shell.x).toBeGreaterThanOrEqual(0)
      expect(shell.y).toBeGreaterThanOrEqual(0)
      expect(shell.x + shell.width).toBeLessThanOrEqual(viewport.width + 1)
      expect(shell.y + shell.height).toBeLessThanOrEqual(viewport.height + 1)
      if (reference === undefined) reference = shell
      else expect(shell).toEqual(reference)
    }

    await page.keyboard.press('Escape')
    await expect(dialog).not.toBeVisible()
    await expect(first).toBeFocused()
  })
}

test('InkStudy opens the shared viewer shell with full image dimensions and restores focus', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const galleryTrigger = page.getByRole('button', { name: /^Enlarge piece 1:/ })
  await galleryTrigger.click()

  const galleryDialog = page.getByRole('dialog', { name: 'Original tattoo work' })
  await expect(galleryDialog).toBeVisible()
  await page.evaluate(async () => {
    await document.fonts.ready
  })
  await expect(galleryDialog).toHaveCSS('opacity', '1')
  const galleryWidth = await galleryDialog.evaluate(element => element.getBoundingClientRect().width)
  await page.keyboard.press('Escape')
  await expect(galleryTrigger).toBeFocused()

  await page.goto('/__ui?view=ink-study')
  const study = page.getByRole('region', { name: 'Gorilla and mountain', exact: true }).locator('[data-ink-study]')
  const originalTrigger = study.getByRole('button', { name: /^View original:/ })
  const sourceImage = study.locator('img').first()
  const width = await sourceImage.getAttribute('width')
  const height = await sourceImage.getAttribute('height')
  expect(width).not.toBeNull()
  expect(height).not.toBeNull()
  await originalTrigger.click()

  const dialog = page.getByRole('dialog', { name: 'Original photograph' })
  await expect(dialog).toBeVisible()
  await page.evaluate(async () => {
    await document.fonts.ready
  })
  await expect(dialog).toHaveCSS('opacity', '1')
  const image = dialog.getByRole('img')
  const caption = dialog.locator('[aria-live="polite"]')
  await expect(dialog.getByRole('button', { name: 'Close image' })).toBeVisible()
  await expect(image).toHaveCSS('object-fit', 'contain')
  await expect(image).toHaveAttribute('width', width ?? '')
  await expect(image).toHaveAttribute('height', height ?? '')
  await expectCaptionVisible(caption)
  expect(await dialog.evaluate(element => element.getBoundingClientRect().width)).toBe(galleryWidth)

  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(originalTrigger).toBeFocused()
})
