/// <reference types="node" />
import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from '@playwright/test'

test('production JavaScript excludes the local catalog, Design C and legacy App', () => {
  const assets = resolve('dist/assets')
  const source = readdirSync(assets).filter(name => name.endsWith('.js')).map(name => readFileSync(resolve(assets, name), 'utf8')).join('\n')
  for (const marker of ['data-ui-catalog', 'Shared components', 'View artist profile & philosophy', 'Play slideshow']) {
    expect(source.includes(marker), marker + ' must stay out of production JavaScript').toBe(false)
  }
})
