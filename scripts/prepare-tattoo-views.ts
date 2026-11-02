import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import { lstat, mkdir, mkdtemp, readFile, rename, rm, stat, unlink, writeFile } from 'node:fs/promises'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs, promisify } from 'node:util'

const execFileAsync = promisify(execFile)
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const maxWidth = { small: 480, large: 960 }
const maxBytes = { small: 2_000_000, large: 5_000_000 }

export interface PrepareTattooViewsOptions {
  input: string
  id: string
  source: string
  start: number
  end: number
  count: number
  quality: number
  referenceIndex?: number
  output: string
}

export interface PreparedViewManifest {
  id: string
  source: string
  interval: { start: number, end: number }
  width: number
  height: number
  referenceIndex: number
  frames: Array<{ small: string, large: string, timestamp: number, width: number, height: number }>
  bytes: { small: number, large: number }
}

interface VideoMetadata {
  duration: number
  width: number
  height: number
  sampleAspectRatio: number
  rotation: number
}

export const HELP = [
  'Usage:',
  '  vpx scripts/prepare-tattoo-views.ts --input <video> --id <reelID> --source <reelURL> --start <seconds> --end <seconds> [options]',
  '',
  'Required: --input, --id, --source, --start, --end',
  '  --input <video>         Local video file',
  '  --id <reelID>            Safe folder identifier (letters, numbers, _ or -)',
  '  --source <reelURL>      Public HTTP(S) source URL for the manifest',
  '  --start <seconds>       Start of the clip, from 0',
  '  --end <seconds>         End of the clip, within video duration',
  '',
  'Options:',
  '  --count <2..32>         Maximum uniformly sampled frames (default: 32)',
  '  --reference-index <n>   Reference index after duplicate removal',
  '  --quality <1..100>      WebP quality (default: 80)',
  '  --output <folder>       New folder (default: src/assets/ink-views/<id>)',
  '  --help                  Show help without requiring FFmpeg',
  '',
  'FFmpeg and FFprobe must be on PATH or set FFMPEG_PATH and FFPROBE_PATH.',
  'Renditions cap width at 480/960 px and never upscale.',
  'Output has manifest.json and small/large WebP folders.',
  'The small and large sets are limited to 2,000,000 and 5,000,000 bytes.',
  'If a limit is exceeded, retry with a lower --count or --quality'
].join('\n')

export function parseArguments (args: readonly string[], cwd = process.cwd()): PrepareTattooViewsOptions | { help: true } {
  if (args.includes('--help')) return { help: true }
  const { values, tokens } = parseArgs({
    args: [...args],
    options: {
      input: { type: 'string' },
      id: { type: 'string' },
      source: { type: 'string' },
      start: { type: 'string' },
      end: { type: 'string' },
      count: { type: 'string' },
      'reference-index': { type: 'string' },
      quality: { type: 'string' },
      output: { type: 'string' }
    },
    tokens: true
  })
  rejectDuplicateOptions(tokens.filter(token => token.kind === 'option').map(token => token.name))
  const id = requiredArgument(values.id, '--id')
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(id)) {
    throw new Error('--id must start with a letter or number and use only letters, numbers, _ or - (max 64)')
  }
  const start = finiteNumber(requiredArgument(values.start, '--start'), '--start')
  const end = finiteNumber(requiredArgument(values.end, '--end'), '--end')
  validateInterval(start, end)
  const referenceIndex = optionalReferenceIndex(values['reference-index'])
  return {
    input: resolve(cwd, requiredArgument(values.input, '--input')),
    id,
    source: sourceURL(requiredArgument(values.source, '--source')),
    start,
    end,
    count: boundedInteger(values.count ?? '32', '--count', 2, 32),
    quality: boundedInteger(values.quality ?? '80', '--quality', 1, 100),
    ...(referenceIndex === undefined ? {} : { referenceIndex }),
    output: values.output === undefined
      ? resolve(projectRoot, 'src', 'assets', 'ink-views', id)
      : resolve(cwd, values.output)
  }
}

function rejectDuplicateOptions (names: string[]): void {
  const seen = new Set<string>()
  for (const name of names) {
    if (seen.has(name)) throw new Error('Option may only be used once: --' + name)
    seen.add(name)
  }
}

function requiredArgument (value: string | undefined, option: string): string {
  if (value === undefined) throw new Error('Missing required option: ' + option)
  return value
}

function sourceURL (value: string): string {
  const source = URL.parse(value)
  if (!source) throw new Error('--source must be a valid HTTP(S) URL')
  if (!['http:', 'https:'].includes(source.protocol) || source.username || source.password) {
    throw new Error('--source must be a public HTTP(S) URL without embedded credentials')
  }
  return source.href
}

function validateInterval (start: number, end: number): void {
  if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || start >= end) {
    throw new Error('Clip times must satisfy 0 <= --start < --end')
  }
}

function boundedInteger (value: string | number, option: string, minimum: number, maximum: number): number {
  const result = finiteNumber(String(value), option)
  if (!Number.isInteger(result) || result < minimum || result > maximum) {
    throw new Error(option + ' must be an integer between ' + minimum + ' and ' + maximum)
  }
  return result
}

function optionalReferenceIndex (value: string | undefined): number | undefined {
  if (value === undefined) return undefined
  const result = finiteNumber(value, '--reference-index')
  if (!Number.isInteger(result) || result < 0) throw new Error('--reference-index must be a non-negative integer')
  return result
}

function finiteNumber (value: string, option: string): number {
  const result = Number(value)
  if (!Number.isFinite(result)) throw new Error(option + ' must be a finite number')
  return result
}

export function getUniformSampleTimestamps (start: number, end: number, count: number): number[] {
  if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || start >= end) {
    throw new Error('Sample times must satisfy 0 <= start < end')
  }
  if (!Number.isInteger(count) || count < 2 || count > 32) throw new Error('Sample count must be an integer between 2 and 32')
  return Array.from({ length: count }, (_, i) => start + (end - start) * i / count)
}

function validGeometry (width: number, height: number, aspect: number): boolean {
  return Number.isInteger(width) && width > 0 && Number.isInteger(height) && height > 0 &&
    Number.isFinite(aspect) && aspect > 0
}

export function getRenditionDimensions (
  width: number,
  height: number,
  maximumWidth: number,
  { sampleAspectRatio = 1, rotation = 0 }: { sampleAspectRatio?: number, rotation?: number } = {}
): { width: number, height: number } {
  if (!validGeometry(width, height, sampleAspectRatio) || !Number.isFinite(maximumWidth) || maximumWidth < 1) {
    throw new Error('Video geometry and maximum rendition width must be valid')
  }
  const turn = ((rotation % 360) + 360) % 360
  if (![0, 90, 180, 270].includes(turn)) throw new Error('Only right-angle rotation metadata is supported')
  const swapped = turn === 90 || turn === 270
  const [displayWidth, displayHeight] = swapped
    ? [height, width * sampleAspectRatio]
    : [width * sampleAspectRatio, height]
  const scale = Math.min(1, maximumWidth / displayWidth)
  return {
    width: Math.min(maximumWidth, Math.max(1, Math.round(displayWidth * scale))),
    height: Math.max(1, Math.round(displayHeight * scale))
  }
}

function isRecord (value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function missingPath (error: unknown): boolean {
  return isRecord(error) && error.code === 'ENOENT'
}

function errorDetail (error: unknown): string {
  if (!isRecord(error) || typeof error.stderr !== 'string') return ''
  return error.stderr.trim().split(/\r?\n/).slice(-3).join(' ')
}

async function runCommand (executable: string, args: string[], name: string): Promise<{ stdout: string, stderr: string }> {
  try {
    return await execFileAsync(executable, args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, windowsHide: true })
  } catch (error) {
    if (missingPath(error)) throw new Error(name + ' was not found. Add it to PATH or set its environment variable.', { cause: error })
    const detail = errorDetail(error)
    throw new Error(name + ' failed' + (detail ? ': ' + detail : ''), { cause: error })
  }
}

async function preflight (ffmpeg: string, ffprobe: string): Promise<void> {
  await runCommand(ffmpeg, ['-version'], 'FFmpeg')
  await runCommand(ffprobe, ['-version'], 'FFprobe')
  const output = await runCommand(ffmpeg, ['-hide_banner', '-encoders'], 'FFmpeg')
  if (!/\blibwebp\b/.test(output.stdout + output.stderr)) {
    throw new Error('FFmpeg does not include the libwebp encoder required for WebP output')
  }
}

function parseMetadata (text: string): Record<string, unknown> {
  try {
    const document: unknown = JSON.parse(text)
    if (!isRecord(document)) throw new Error('Expected metadata object')
    return document
  } catch (error) {
    throw new Error('FFprobe returned invalid video metadata', { cause: error })
  }
}

function isVideoStream (item: unknown): item is Record<string, unknown> {
  return isRecord(item) && item.codec_type === 'video' &&
    !(isRecord(item.disposition) && item.disposition.attached_pic === 1)
}

function positiveDimension (value: unknown): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 1) {
    throw new Error('Video has invalid dimensions')
  }
  return value
}

function metadataNumber (value: unknown): number {
  return typeof value === 'string' || typeof value === 'number' ? Number(value) : Number.NaN
}

function videoDuration (stream: Record<string, unknown>, format: unknown): number {
  const streamDuration = metadataNumber(stream.duration)
  const formatDuration = isRecord(format) ? metadataNumber(format.duration) : Number.NaN
  const duration = Number.isFinite(streamDuration) && streamDuration > 0 ? streamDuration : formatDuration
  if (!Number.isFinite(duration) || duration <= 0) throw new Error('FFprobe could not determine a finite video duration')
  return duration
}

function sampleAspectRatio (value: unknown): number {
  if (value === undefined || value === '' || value === 'N/A') return 1
  if (typeof value !== 'string') throw new Error('Video has an invalid sample aspect ratio')
  const [numerator, denominator] = value.split(':').map(Number)
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || numerator <= 0 || denominator <= 0) {
    throw new Error('Video has an invalid sample aspect ratio')
  }
  return numerator / denominator
}

function videoRotation (stream: Record<string, unknown>): number {
  const sideData: unknown[] = Array.isArray(stream.side_data_list) ? stream.side_data_list : []
  const sideRotation = sideData.find((item): item is Record<string, unknown> => isRecord(item) && item.rotation !== undefined)
  const tagRotation = isRecord(stream.tags) ? stream.tags.rotate : undefined
  const rotation = metadataNumber(sideRotation?.rotation ?? tagRotation ?? 0)
  if (!Number.isFinite(rotation)) throw new Error('Video has invalid rotation metadata')
  return rotation
}

async function probeVideo (ffprobe: string, input: string): Promise<VideoMetadata> {
  const { stdout } = await runCommand(ffprobe, [
    '-v', 'error', '-show_streams', '-show_format', '-of', 'json', input
  ], 'FFprobe')
  const document = parseMetadata(stdout)
  const streams: unknown[] = Array.isArray(document.streams) ? document.streams : []
  const stream = streams.find(isVideoStream)
  if (!stream) throw new Error('Input does not contain a video stream')
  return {
    duration: videoDuration(stream, document.format),
    width: positiveDimension(stream.width),
    height: positiveDimension(stream.height),
    sampleAspectRatio: sampleAspectRatio(stream.sample_aspect_ratio),
    rotation: videoRotation(stream)
  }
}

async function assertOutputIsNew (output: string): Promise<void> {
  try {
    await lstat(output)
  } catch (error) {
    if (missingPath(error)) return
    throw error
  }
  throw new Error('Output folder already exists; choose a new folder: ' + output)
}

async function ensureInputFile (input: string): Promise<void> {
  try {
    if (!(await stat(input)).isFile()) throw new Error('Input path is not a file: ' + input)
  } catch (error) {
    if (missingPath(error)) throw new Error('Input video does not exist: ' + input, { cause: error })
    throw error
  }
}

function framePath (root: string, size: 'small' | 'large', index: number): string {
  return join(root, size, 'frame-' + String(index).padStart(3, '0') + '.webp')
}

async function extractFrames (ffmpeg: string, options: PrepareTattooViewsOptions, metadata: VideoMetadata, temp: string): Promise<void> {
  const small = getRenditionDimensions(metadata.width, metadata.height, maxWidth.small, metadata)
  const large = getRenditionDimensions(metadata.width, metadata.height, maxWidth.large, metadata)
  await Promise.all([mkdir(join(temp, 'small')), mkdir(join(temp, 'large'))])
  const rate = (options.count / (options.end - options.start)).toString()
  const filters = '[0:v:0]fps=fps=' + rate + ':round=near:start_time=0,split=2[sIn][lIn];' +
    '[sIn]scale=' + small.width + ':' + small.height + ':flags=lanczos,setsar=1[small];' +
    '[lIn]scale=' + large.width + ':' + large.height + ':flags=lanczos,setsar=1[large]'
  const input = [
    '-hide_banner', '-loglevel', 'error', '-n', '-ss', String(options.start),
    '-t', String(options.end - options.start), '-autorotate', '-i', options.input,
    '-filter_complex', filters
  ]
  const encoder = [
    '-an', '-frames:v', String(options.count), '-c:v', 'libwebp',
    '-quality', String(options.quality), '-compression_level', '4', '-map_metadata', '-1', '-f', 'image2'
  ]
  await runCommand(ffmpeg, [
    ...input, '-map', '[small]', ...encoder, join(temp, 'small', 'frame-%03d.webp'),
    '-map', '[large]', ...encoder, join(temp, 'large', 'frame-%03d.webp')
  ], 'FFmpeg')
}

async function exists (path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch (error) {
    if (missingPath(error)) return false
    throw error
  }
}

async function collectFrames (options: PrepareTattooViewsOptions, temp: string, dimensions: { width: number, height: number }):
Promise<{ frames: PreparedViewManifest['frames'], bytes: { small: number, large: number } }> {
  const times = getUniformSampleTimestamps(options.start, options.end, options.count)
  const frames: PreparedViewManifest['frames'] = []
  const seen = new Set<string>()
  const bytes = { small: 0, large: 0 }

  for (let i = 0; i < options.count; i += 1) {
    const small = framePath(temp, 'small', i + 1)
    const large = framePath(temp, 'large', i + 1)
    const [smallExists, largeExists] = await Promise.all([exists(small), exists(large)])
    if (!smallExists && !largeExists) break
    if (!smallExists || !largeExists) throw new Error('FFmpeg produced an incomplete WebP frame pair')
    const [smallData, largeData] = await Promise.all([readFile(small), readFile(large)])
    const digest = createHash('sha256').update(smallData).update('\0').update(largeData).digest('hex')
    if (seen.has(digest)) {
      await Promise.all([unlink(small), unlink(large)])
      continue
    }
    seen.add(digest)
    bytes.small += smallData.byteLength
    bytes.large += largeData.byteLength
    frames.push({
      small: 'small/' + basename(small),
      large: 'large/' + basename(large),
      timestamp: times[i],
      width: dimensions.width,
      height: dimensions.height
    })
  }

  if (frames.length < 2) throw new Error('Fewer than two distinct frames remain; choose a longer interval or a higher source frame rate')
  if (bytes.small > maxBytes.small || bytes.large > maxBytes.large) {
    throw new Error(
      'WebP size budget exceeded (small ' + (bytes.small / 1_000_000).toFixed(2) +
      ' MB / 2 MB, large ' + (bytes.large / 1_000_000).toFixed(2) +
      ' MB / 5 MB); retry with a lower --count or --quality'
    )
  }
  return { frames, bytes }
}

async function cleanTemp (temp: string, parent: string, prefix: string): Promise<void> {
  const checked = resolve(temp)
  if (dirname(checked) !== resolve(parent) || !basename(checked).startsWith(prefix)) {
    throw new Error('Refusing to clean a temporary folder outside its verified output parent')
  }
  const info = await lstat(checked).catch((error: unknown) => {
    if (missingPath(error)) return undefined
    throw error
  })
  if (!info) return
  if (!info.isDirectory() || info.isSymbolicLink()) throw new Error('Refusing to clean a path that is no longer an owned directory')
  await rm(checked, { recursive: true, force: false })
}

function mediaExecutable (environment: NodeJS.ProcessEnv, name: string, fallback: string): string {
  return environment[name]?.trim() || fallback
}

function validatedReferenceIndex (requested: number | undefined, count: number): number {
  const index = requested ?? Math.floor(count / 2)
  if (!Number.isInteger(index) || index < 0 || index >= count) {
    throw new Error('--reference-index must identify a frame after duplicate removal (0-' + (count - 1) + ')')
  }
  return index
}

export async function prepareTattooViews (
  options: PrepareTattooViewsOptions,
  environment: NodeJS.ProcessEnv = process.env
): Promise<PreparedViewManifest> {
  validateInterval(options.start, options.end)
  boundedInteger(options.count, '--count', 2, 32)
  boundedInteger(options.quality, '--quality', 1, 100)
  await ensureInputFile(options.input)
  await assertOutputIsNew(options.output)

  const ffmpeg = mediaExecutable(environment, 'FFMPEG_PATH', 'ffmpeg')
  const ffprobe = mediaExecutable(environment, 'FFPROBE_PATH', 'ffprobe')
  await preflight(ffmpeg, ffprobe)
  const metadata = await probeVideo(ffprobe, options.input)
  if (options.end > metadata.duration) throw new Error('--end must not exceed the video duration of ' + metadata.duration + ' seconds')

  const dimensions = getRenditionDimensions(
    metadata.width, metadata.height, maxWidth.large, metadata
  )
  const parent = dirname(options.output)
  const prefix = '.prepare-ink-views-' + basename(options.output) + '-'
  await mkdir(parent, { recursive: true })
  const temp = await mkdtemp(join(parent, prefix))
  try {
    await extractFrames(ffmpeg, options, metadata, temp)
    const result = await collectFrames(options, temp, dimensions)
    const referenceIndex = validatedReferenceIndex(options.referenceIndex, result.frames.length)
    const manifest: PreparedViewManifest = {
      id: options.id,
      source: options.source,
      interval: { start: options.start, end: options.end },
      width: dimensions.width,
      height: dimensions.height,
      referenceIndex,
      frames: result.frames,
      bytes: result.bytes
    }
    await writeFile(join(temp, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', {
      encoding: 'utf8',
      flag: 'wx'
    })
    await assertOutputIsNew(options.output)
    await rename(temp, options.output)
    return manifest
  } finally {
    await cleanTemp(temp, parent, prefix)
  }
}

function isDirectExecution (): boolean {
  return resolve(process.argv.at(1) ?? '').toLowerCase() === fileURLToPath(import.meta.url).toLowerCase()
}

export async function main (args: readonly string[] = process.argv.slice(2)): Promise<number> {
  try {
    const options = parseArguments(args)
    if ('help' in options) {
      process.stdout.write(HELP + '\n')
      return 0
    }
    const manifest = await prepareTattooViews(options)
    process.stdout.write('Prepared ' + manifest.frames.length + ' distinct views in ' + options.output + '\n')
    process.stdout.write('Reference index: ' + manifest.referenceIndex + '\n')
    process.stdout.write('Small set: ' + manifest.bytes.small + ' bytes; large set: ' + manifest.bytes.large + ' bytes\n')
    return 0
  } catch (error) {
    process.stderr.write('Error: ' + (error instanceof Error ? error.message : String(error)) + '\n')
    return 1
  }
}

if (isDirectExecution()) {
  void main().then(code => {
    process.exitCode = code
  })
}
