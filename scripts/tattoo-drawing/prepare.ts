import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

type Point = [number, number]
type TattooPhoto = { id: number, file: string, width: number, height: number, region: Point[] }

function run (binary: string, args: string[]) {
  const result = spawnSync(binary, args, { maxBuffer: 32 * 1024 * 1024, windowsHide: true })
  if (result.error) throw new Error(`${binary} is unavailable: ${result.error.message}`)
  if (result.status !== 0) throw new Error(`${basename(binary)} failed: ${result.stderr.toString().slice(-4000)}`)
  return result.stdout
}

function inRegion (x: number, y: number, polygon: Point[]) {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i]
    const b = polygon[j]
    if (((a[1] > y) !== (b[1] > y)) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside
  }
  return inside
}

function traceContours (available: Uint8Array, width: number, scaleX: number, scaleY: number) {
  const contours: Point[][] = []
  const offsets = [-1, 1, -width, width, -width - 1, -width + 1, width - 1, width + 1]
  for (let seed = 0; seed < available.length; seed++) {
    if (!available[seed]) continue
    let current = seed
    const points: Point[] = []
    while (available[current]) {
      available[current] = 0
      points.push([(current % width) * scaleX, Math.floor(current / width) * scaleY])
      let next: number | undefined = undefined
      for (const offset of offsets) {
        const candidate = current + offset
        if (available[candidate]) {
          next = candidate
          break
        }
      }
      if (next === undefined) break
      current = next
    }
    if (points.length >= 10) contours.push(points)
  }
  contours.sort((a, b) => b.length - a.length)
  const paths = contours.map(points => points
    .map(([x, y], index) => `${index ? 'L' : 'M'}${x} ${y}`)
    .join(' '))
  assert(paths.length >= 6, 'Not enough tattoo contours found in photo')
  return paths
}

function fillLines (polygon: Point[], spacing: number) {
  const fillPaths: string[] = []
  const minY = Math.min(...polygon.map(point => point[1]))
  const maxY = Math.max(...polygon.map(point => point[1]))
  for (let y = minY; y <= maxY; y += spacing) {
    const intersections: number[] = []
    for (let i = 0; i < polygon.length; i++) {
      const a = polygon[i]
      const b = polygon[(i + 1) % polygon.length]
      if ((a[1] <= y && b[1] > y) || (b[1] <= y && a[1] > y)) {
        intersections.push(a[0] + (y - a[1]) * (b[0] - a[0]) / (b[1] - a[1]))
      }
    }
    intersections.sort((a, b) => a - b)
    for (let i = 0; i < intersections.length - 1; i += 2) {
      const left = Math.round(intersections[i])
      const right = Math.round(intersections[i + 1])
      if (right - left > 4) fillPaths.push(fillPaths.length % 2 ? `M${right} ${y} H${left}` : `M${left} ${y} H${right}`)
    }
  }
  return fillPaths
}

function drawing (ffmpeg: string, source: string, photo: TattooPhoto) {
  const scale = 640 / Math.max(photo.width, photo.height)
  const width = Math.round(photo.width * scale)
  const height = Math.round(photo.height * scale)
  const scaleX = photo.width / width
  const scaleY = photo.height / height
  const edges = run(ffmpeg, ['-v', 'error', '-i', source, '-vf', `scale=${width}:${height},edgedetect=low=0.08:high=0.2,format=gray`, '-frames:v', '1', '-f', 'rawvideo', '-'])
  assert.equal(edges.length, width * height, 'Unexpected edge image dimensions')
  const available = new Uint8Array(edges.length)
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const index = y * width + x
      if (edges[index] > 40 && inRegion(x * scaleX, y * scaleY, photo.region)) available[index] = 1
    }
  }
  const region = photo.region.map(([x, y], index) => `${index ? 'L' : 'M'}${x} ${y}`).join(' ') + ' Z'
  const factor = Math.max(photo.width, photo.height) / 1280
  return { paths: traceContours(available, width, scaleX, scaleY), fill: { region, paths: fillLines(photo.region, 24 * factor), strokeWidth: 38 * factor } }
}

const photos: TattooPhoto[] = [
  { id: 2, file: 'portfolio2.webp', width: 1054, height: 2046, region: [[337, 265], [632, 244], [790, 397], [846, 748], [829, 1087], [764, 1427], [698, 1660], [542, 1884], [378, 1830], [278, 1551], [236, 1157], [268, 770]] },
  { id: 3, file: 'portfolio3.webp', width: 1125, height: 1401, region: [[308, 0], [868, 0], [896, 325], [868, 694], [793, 1048], [711, 1310], [559, 1394], [316, 1336], [184, 1018], [178, 674], [210, 294]] },
  { id: 4, file: 'portfolio4.webp', width: 1536, height: 2048, region: [[465, 102], [1098, 98], [1274, 387], [1282, 764], [1202, 1138], [1158, 1518], [1037, 1791], [774, 1916], [511, 1779], [372, 1473], [379, 1028], [346, 576]] },
  { id: 5, file: 'portfolio5.webp', width: 833, height: 1600, region: [[235, 118], [610, 183], [736, 458], [751, 863], [701, 1254], [621, 1515], [363, 1545], [213, 1295], [161, 927], [174, 548]] },
  { id: 6, file: 'portfolio6.webp', width: 953, height: 1600, region: [[306, 14], [606, 112], [656, 428], [623, 679], [661, 1017], [630, 1292], [565, 1512], [342, 1588], [111, 1483], [70, 1160], [151, 864], [126, 554], [197, 241]] },
  { id: 8, file: 'portfolio8.webp', width: 821, height: 1600, region: [[309, 49], [546, 94], [711, 394], [752, 729], [724, 1042], [662, 1329], [511, 1523], [282, 1548], [135, 1351], [86, 1046], [75, 746], [167, 423]] }
]

function main () {
  const args = process.argv.slice(2)
  assert(args.length === 0 || (args.length === 2 && args[0] === '--ffmpeg'), 'Only --ffmpeg is supported')
  const ffmpeg = args.length === 2 ? args[1] : process.env.FFMPEG ?? 'ffmpeg'
  const outputDir = resolve('public/drawings/tattoos')
  mkdirSync(outputDir, { recursive: true })

  for (const photo of photos) {
    const source = resolve('src/assets/images', photo.file)
    assert(existsSync(source), `Missing original ${photo.file}`)
    const result = drawing(ffmpeg, source, photo)
    const target = resolve(outputDir, `portfolio${photo.id}-drawing.json`)
    writeFileSync(target, JSON.stringify(result, null, 2) + '\n')
    process.stdout.write(`Piece ${photo.id}: ${result.paths.length} contours\n`)
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main()
