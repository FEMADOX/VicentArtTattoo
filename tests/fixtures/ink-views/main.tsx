import { createRoot } from 'react-dom/client'
import TattooDrawReveal from '../../../src/designs/TattooDrawReveal'
import { DesignMotion } from '../../../src/designs/DesignMotion'
import '../../../src/global.css'

const sources = [
  '/tests/fixtures/ink-views/view-1.svg',
  '/tests/fixtures/ink-views/view-2.svg',
  '/tests/fixtures/ink-views/view-3.svg',
  '/tests/fixtures/ink-views/view-4.svg'
]
const mode = new URLSearchParams(window.location.search).get('case')
const frames = mode === '12frames'
  ? Array.from({ length: 12 }, (_, index) => index === 1
      ? sources[1]
      : sources[index % sources.length] + '?angle=' + index)
  : [...sources]

if (mode === 'missingframe') frames[3] = '/tests/fixtures/ink-views/missing.svg'

const image = { src: sources[1], alt: 'Synthetic multi-angle test photograph', width: 512, height: 768 }
const sequence = {
  referenceIndex: mode === 'invalidref' ? 4 : 1,
  frames: frames.map(src => ({ src, width: 512, height: 768 }))
}
const paths = [
  'M 148 198 C 213 142 299 142 364 198',
  'M 148 570 C 216 626 296 626 364 570'
]
const fill = {
  region: 'M 158 230 C 210 180 302 180 354 230 L 336 538 C 280 584 232 584 176 538 Z',
  paths: ['M 175 284 H 337', 'M 168 356 H 344', 'M 165 428 H 347', 'M 174 500 H 338'],
  strokeWidth: 28
}

const root = document.getElementById('root')
if (!root) throw new Error('Fixture root is missing')

createRoot(root).render(
  <DesignMotion enabled>
    <main style={{ maxWidth: 512, margin: '0 auto', padding: 16 }}>
      <h1 style={{ margin: '0 0 16px', fontSize: 32, lineHeight: 1.2 }}>Ink views fixture</h1>
      <TattooDrawReveal image={image} sequence={sequence} paths={paths} fill={fill} />
    </main>
  </DesignMotion>
)
