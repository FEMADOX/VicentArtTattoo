/// <reference types="node" />
import { spawnSync } from 'node:child_process'
import { mkdtemp, readdir, readFile, rm, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, dirname, join, resolve } from 'node:path'
import { describe, expect, it } from 'vite-plus/test'
import {
  getRenditionDimensions,
  getUniformSampleTimestamps,
  parseArguments,
  prepareTattooViews
} from '../../scripts/prepare-tattoo-views'
import type { PrepareTattooViewsOptions } from '../../scripts/prepare-tattoo-views'

const required = [
  '--input', 'clip.mp4',
  '--id', 'reel_01',
  '--source', 'https://www.instagram.com/reel/example/',
  '--start', '0.5',
  '--end', '3.5'
]

function parse (extra: string[] = []) {
  const args = [...required]
  for (let i = 0; i < extra.length; i += 2) {
    const option = extra[i]
    const value = extra[i + 1]
    const index = args.indexOf(option)
    if (index === -1) args.push(option, value)
    else args[index + 1] = value
  }
  const parsed = parseArguments(args, 'C:\\work')
  if ('help' in parsed) throw new Error('Expected required options')
  return parsed
}

function available (executable: string): boolean {
  return spawnSync(executable, ['-version'], { encoding: 'utf8', windowsHide: true }).status === 0
}

async function cleanTestTemp (temp: string): Promise<void> {
  const checked = resolve(temp)
  if (dirname(checked) !== resolve(tmpdir()) || !basename(checked).startsWith('tattoo-view-test-')) {
    throw new Error('Refusing to clean a folder outside the owned test temporary directory')
  }
  await rm(checked, { recursive: true, force: true })
}

const ffmpeg = process.env.FFMPEG_PATH?.trim() || 'ffmpeg'
const ffprobe = process.env.FFPROBE_PATH?.trim() || 'ffprobe'
const mediaToolsAvailable = available(ffmpeg) && available(ffprobe)

describe('tattoo view preparation arguments', () => {
  it('shows help without requiring any other argument', () => {
    expect(parseArguments(['--help', '--unknown'])).toEqual({ help: true })
  })

  it('defaults to 32 frames and WebP quality 80', () => {
    const options = parse()
    expect(options).toMatchObject({ count: 32, quality: 80, start: 0.5, end: 3.5 })
    expect(options.output.endsWith(join('src', 'assets', 'ink-views', 'reel_01'))).toBe(true)
  })

  it('accepts explicit count, quality, output, and a not-yet-deduplicated reference index', () => {
    expect(parse([
      '--count', '8',
      '--quality', '68',
      '--reference-index', '7',
      '--output', 'generated/reel'
    ])).toMatchObject({
      count: 8,
      quality: 68,
      referenceIndex: 7,
      output: join('C:\\work', 'generated', 'reel')
    })
  })

  it('rejects missing, duplicate, and unknown options', () => {
    expect(() => parseArguments([])).toThrow(/Missing required option/)
    expect(() => parseArguments([...required, '--count', '4', '--count', '8'])).toThrow(/only be used once/)
    expect(() => parse([...required, '--mystery', 'x'])).toThrow(/Unknown option/)
  })

  it.each([
    { extra: ['--id', '../bad'], message: /--id/ },
    { extra: ['--source', 'file:///private/clip.mp4'], message: /HTTP\(S\)/ },
    { extra: ['--source', 'https://user:pass@example.com/reel'], message: /credentials/ },
    { extra: ['--start', 'NaN'], message: /finite number/ },
    { extra: ['--start', '-1'], message: /--start/ },
    { extra: ['--start', '3.5'], message: /0 <= --start/ },
    { extra: ['--end', 'Infinity'], message: /finite number/ },
    { extra: ['--count', '1'], message: /count must/ },
    { extra: ['--count', '33'], message: /count must/ },
    { extra: ['--count', '2.5'], message: /count must/ },
    { extra: ['--quality', '101'], message: /quality must/ },
    { extra: ['--reference-index', '-1'], message: /reference-index/ }
  ])('rejects invalid arguments $extra', ({ extra, message }) => {
    expect(() => parse(extra)).toThrow(message)
  })
})

describe('tattoo frame sampling and dimensions', () => {
  it('uses evenly spaced sample timestamps inside the half-open interval', () => {
    const times = getUniformSampleTimestamps(2, 6, 4)
    expect(times).toEqual([2, 3, 4, 5])
    expect(times.at(-1)).toBeLessThan(6)
    expect(times.slice(1).map((time, index) => time - times[index])).toEqual([1, 1, 1])
  })

  it.each([
    [Number.NaN, 1, 4],
    [1, Number.POSITIVE_INFINITY, 4],
    [-1, 2, 4],
    [3, 2, 4],
    [0, 1, 1],
    [0, 1, 33]
  ])('rejects invalid sample bounds or counts', (start, end, count) => {
    expect(() => getUniformSampleTimestamps(start, end, count)).toThrow()
  })

  it('keeps aspect ratio and never enlarges a small source', () => {
    const small = getRenditionDimensions(1920, 1080, 480)
    const large = getRenditionDimensions(1920, 1080, 960)
    const lowResolution = getRenditionDimensions(320, 200, 960)
    const portraitSmall = getRenditionDimensions(720, 1280, 480)
    const portraitLarge = getRenditionDimensions(720, 1280, 960)
    expect(small).toEqual({ width: 480, height: 270 })
    expect(large).toEqual({ width: 960, height: 540 })
    expect(small.width / small.height).toBeCloseTo(large.width / large.height)
    expect(lowResolution).toEqual({ width: 320, height: 200 })
    expect(portraitSmall).toEqual({ width: 480, height: 853 })
    expect(portraitLarge).toEqual({ width: 720, height: 1280 })
    expect(portraitSmall.width / portraitSmall.height).toBeCloseTo(720 / 1280, 3)
  })

  it('accounts for display aspect ratio and autorotation metadata', () => {
    expect(getRenditionDimensions(640, 480, 960, { sampleAspectRatio: 1.5 })).toEqual({ width: 960, height: 480 })
    expect(getRenditionDimensions(1080, 1920, 960, { rotation: 90 })).toEqual({ width: 960, height: 540 })
    expect(() => getRenditionDimensions(640, 480, 960, { rotation: 45 })).toThrow(/right-angle/)
  })
})

describe.skipIf(!mediaToolsAvailable)('FFmpeg tattoo view export', () => {
  it('writes deduplicated WebP renditions and a path-private manifest', async context => {
    const temp = await mkdtemp(join(tmpdir(), 'tattoo-view-test-'))
    try {
      const input = join(temp, 'fixture.mkv')
      const output = join(temp, 'views')
      const fixture = spawnSync(ffmpeg, [
        '-hide_banner',
        '-loglevel',
        'error',
        '-f',
        'lavfi',
        '-i',
        'testsrc2=size=640x360:rate=8:duration=2',
        '-c:v',
        'ffv1',
        '-y',
        input
      ], { encoding: 'utf8', windowsHide: true })
      if (fixture.status !== 0) context.skip('This FFmpeg build cannot encode the synthetic test fixture')

      const options: PrepareTattooViewsOptions = {
        input,
        id: 'synthetic-reel',
        source: 'https://www.instagram.com/reel/synthetic/',
        start: 0.25,
        end: 1.75,
        count: 8,
        quality: 80,
        output
      }
      const manifest = await prepareTattooViews(options)
      const serialized = await readFile(join(output, 'manifest.json'), 'utf8')
      expect(JSON.parse(serialized)).toEqual(manifest)
      expect(serialized).not.toContain(input)
      expect(manifest.frames.length).toBeGreaterThanOrEqual(2)
      expect(manifest.frames.length).toBeLessThanOrEqual(options.count)
      expect(manifest.referenceIndex).toBe(Math.floor(manifest.frames.length / 2))
      expect(manifest.bytes.small).toBeLessThanOrEqual(2_000_000)
      expect(manifest.bytes.large).toBeLessThanOrEqual(5_000_000)

      const expectedTimes = getUniformSampleTimestamps(options.start, options.end, options.count)
      for (const frame of manifest.frames) {
        expect(expectedTimes).toContain(frame.timestamp)
        expect(await stat(join(output, frame.small))).toBeDefined()
        expect(await stat(join(output, frame.large))).toBeDefined()
        expect(frame.width).toBe(manifest.width)
        expect(frame.height).toBe(manifest.height)
      }

      const smallProbe = spawnSync(ffprobe, [
        '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height',
        '-of', 'json', join(output, manifest.frames[0].small)
      ], { encoding: 'utf8', windowsHide: true })
      const largeProbe = spawnSync(ffprobe, [
        '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height',
        '-of', 'json', join(output, manifest.frames[0].large)
      ], { encoding: 'utf8', windowsHide: true })
      expect(smallProbe.status).toBe(0)
      expect(largeProbe.status).toBe(0)
      const smallDimensions: unknown = JSON.parse(smallProbe.stdout)
      const largeDimensions: unknown = JSON.parse(largeProbe.stdout)
      expect(smallDimensions).toMatchObject({ streams: [{ width: 480, height: 270 }] })
      expect(largeDimensions).toMatchObject({ streams: [{ width: 640, height: 360 }] })

      await expect(prepareTattooViews(options)).rejects.toThrow(/already exists/)
      expect(await readFile(join(output, 'manifest.json'), 'utf8')).toBe(serialized)
      const rejectedOutput = join(temp, 'invalid-reference')
      await expect(prepareTattooViews({ ...options, output: rejectedOutput, referenceIndex: 32 }))
        .rejects.toThrow(/reference-index/)
      await expect(stat(rejectedOutput)).rejects.toMatchObject({ code: 'ENOENT' })
      expect((await readdir(temp)).filter(name => name.startsWith('.prepare-ink-views-'))).toEqual([])
    } finally {
      await cleanTestTemp(temp)
    }
  }, 15_000)
})
