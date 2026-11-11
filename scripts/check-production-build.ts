/// <reference types="node" />
import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import assert from 'node:assert/strict'

const assets = resolve('dist/assets')
const files = readdirSync(assets).filter(name => name.endsWith('.js'))
assert.ok(files.length, 'Production JavaScript is missing')
const source = files.map(name => readFileSync(resolve(assets, name), 'utf8')).join('\n')
for (const marker of ['data-ui-catalog', 'Shared components', 'View artist profile & philosophy', 'Play slideshow']) {
  assert.ok(!source.includes(marker), marker + ' must stay out of production JavaScript')
}
