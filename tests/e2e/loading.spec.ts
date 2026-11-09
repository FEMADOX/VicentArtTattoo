/// <reference lib="es2024.promise" />
import { expect, test, type Page } from '@playwright/test'

async function holdModule (page: Page, pathname: string) {
  const pending = Promise.withResolvers<undefined>()
  const intercepted = Promise.withResolvers<undefined>()
  await page.route(url => url.pathname === pathname, async route => {
    intercepted.resolve(undefined)
    await pending.promise
    await route.continue()
  })
  return { intercepted: intercepted.promise, release: () => pending.resolve(undefined) }
}

test('catalog shell and component content have skeletons for their own pending modules', async ({ page }) => {
  const catalog = await holdModule(page, '/src/dev/UiCatalog.tsx')
  const components = await holdModule(page, '/src/dev/ComponentShowcase.tsx')
  try {
    await page.goto('/__ui', { waitUntil: 'domcontentloaded' })
    await catalog.intercepted
    const skeleton = page.locator('[data-loading-skeleton="components"]')
    await expect(skeleton).toBeVisible()
    await expect(skeleton).toHaveAttribute('aria-busy', 'true')
    await expect(skeleton.locator('[data-slot="skeleton"]').first()).toBeVisible()
    catalog.release()
    await components.intercepted
    await expect(page.getByLabel('Preview', { exact: true })).toBeVisible()
    await expect(skeleton).toBeVisible()
    components.release()
    await expect(page.getByRole('heading', { name: 'Shared components', exact: true })).toBeVisible({ timeout: 15_000 })
    await expect(skeleton).toHaveCount(0)
  } finally {
    catalog.release()
    components.release()
  }
})

test('catalog stays usable while a view loads and scrolls to its hash after loading', async ({ page }) => {
  const view = await holdModule(page, '/src/designs/MultiPageDesign.tsx')
  try {
    await page.goto('/__ui?view=c-about#process', { waitUntil: 'domcontentloaded' })
    await view.intercepted
    const skeleton = page.locator('[data-loading-skeleton="c-about"]')
    await expect(skeleton).toBeVisible()
    const preview = page.getByLabel('Preview', { exact: true })
    await expect(preview).toBeEnabled()
    await preview.selectOption('a')
    await expect(skeleton).toHaveCount(0)
    await expect(page.locator('[data-catalog-preview="a"]')).toBeVisible()
    await page.goBack()
    await expect(skeleton).toBeVisible()
    view.release()
    await expect(page.getByRole('heading', { name: 'Meet the artist', exact: true })).toBeAttached({ timeout: 15_000 })
    await expect(skeleton).toHaveCount(0)
    await expect(page.locator('#process')).toBeInViewport()
    await expect(page).toHaveURL(/\?view=c-about#process$/)
  } finally {
    view.release()
  }
})

test('development ink study skeleton fits mobile and respects reduced motion until content is ready', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const study = await holdModule(page, '/src/designs/InkStudyPage.tsx')
  try {
    await page.goto('/__ui?view=ink-study', { waitUntil: 'domcontentloaded' })
    await study.intercepted
    const skeleton = page.locator('[data-loading-skeleton="ink-study"]')
    await expect(skeleton).toBeVisible()
    await expect(skeleton).toHaveAttribute('aria-busy', 'true')
    await expect(skeleton.locator('[data-slot="skeleton"]').first()).toHaveCSS('animation-name', 'none')
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1)
    study.release()
    await expect(page.getByRole('heading', { name: 'Ink animation study', exact: true })).toBeVisible()
    await expect(skeleton).toHaveCount(0)
  } finally {
    study.release()
  }
})
