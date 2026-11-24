import { expect, test, type Locator, type Page } from '@playwright/test'

const widths = [320, 768, 1440] as const

async function expectNoOverflow (page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1)
}

async function expectFocusTrap (page: Page, dialog: Locator) {
  for (let index = 0; index < 10; index += 1) {
    await page.keyboard.press('Tab')
    expect(await dialog.evaluate(element => element.contains(document.activeElement))).toBe(true)
  }
}

for (const width of widths) {
  test('public website retains layout and image proportions at ' + width + 'px', async ({ page }, testInfo) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await expect(page.locator('#main-content')).toBeVisible()
    await expect(page.locator('[data-loading-skeleton]')).toHaveCount(0, { timeout: 15_000 })
    await page.evaluate(async () => {
      const images = Array.from(document.images)
      await Promise.all(images.map(async image => {
        image.loading = 'eager'
        await image.decode()
      }))
    })
    await expectNoOverflow(page)
    const distorted = await page.evaluate(() => Array.from(document.images).filter(image => {
      const { width: renderedWidth, height: renderedHeight } = image.getBoundingClientRect()
      if (!renderedWidth || !renderedHeight) return false
      const fit = getComputedStyle(image).objectFit
      if (fit === 'cover' || fit === 'contain') return false
      const naturalRatio = image.naturalWidth / image.naturalHeight
      return Math.abs(renderedWidth / renderedHeight / naturalRatio - 1) > 0.025
    }).map(image => image.alt || image.src))
    expect(distorted, 'visible images must retain their natural ratio or use explicit cropping').toEqual([])
    expect(errors).toEqual([])
    await page.screenshot({ path: testInfo.outputPath('public-' + width + '.png'), fullPage: true })
  })
}

test('homepage mobile menu traps focus and returns it on Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const trigger = page.getByRole('button', { name: 'Menu', exact: true })
  await trigger.focus()
  await trigger.press('Enter')
  const dialog = page.getByRole('dialog', { name: 'Menu', exact: true })
  await expect(dialog).toBeVisible()
  await expectFocusTrap(page, dialog)
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(trigger).toBeFocused()
})

test('booking questions expand and collapse with the keyboard', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const question = page.getByRole('button', { name: 'How does the deposit work?' })
  await question.focus()
  await question.press('Enter')
  await expect(question).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByText('A deposit is required to confirm your appointment and is applied to the total price of your tattoo.', { exact: true })).toBeVisible()
  await question.press('Enter')
  await expect(question).toHaveAttribute('aria-expanded', 'false')
})

test('the removed ink study route shows the noindex not-found page', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page).toHaveTitle(/vicentart/i)
  await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0)
  await page.goto('/designs/ink-study/?ref=e2e#about')
  await expect(page).toHaveURL('http://127.0.0.1:5174/designs/ink-study/?ref=e2e#about')
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
  await expect(page).toHaveTitle('Page not found | VicentArt')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow')
})

for (const [path, hash] of [['/designs', ''], ['/designs/a/', ''], ['/designs/c/contact/', '#contact']]) {
  test('public routes redirect ' + path + ' with its query and section', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(path + '?ref=e2e')
    await expect(page).toHaveURL('http://127.0.0.1:5174/?ref=e2e' + hash)
    await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
}
