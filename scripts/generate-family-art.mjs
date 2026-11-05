// Generates the dithered art backdrops behind each site preview in the home
// page's "The family" showcase. Pixels are drawn on a canvas inside headless
// Chrome (no npm deps), so the art is reproducible from the palettes below.
//
//   node scripts/generate-family-art.mjs
//
// Output: public/family/<name>-art.webp (1600×1000), except blog

import { spawn } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CHROME =
    process.env.CHROME ||
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const OUT = join(import.meta.dirname, '..', 'public', 'family')

// light → dark ramps; each site gets its own seed so the shapes differ.
// blog-art.webp isn't generated: it's the thundering-herd post's cover.
const ART = {
    insight: {
        seed: 11,
        ramp: ['#e3eefa', '#9fc4e6', '#5b8fc4', '#2f5f8f', '#142844'],
    },
    gallery: {
        seed: 7,
        ramp: ['#fae3ec', '#eaa6c0', '#c8668e', '#7a3556', '#331425'],
    },
    music: {
        seed: 19,
        ramp: ['#ebe5fb', '#bba9ef', '#8a6fdb', '#5a43a8', '#221846'],
    },
    book: {
        seed: 5,
        ramp: ['#e6f2e1', '#a9d3ab', '#68a77a', '#3e7a55', '#163222'],
    },
    status: {
        seed: 13,
        ramp: ['#e8efec', '#b5ccc5', '#7f9ea0', '#4f6b70', '#1d2a2e'],
    },
}

// runs inside the page — keep it self-contained
function paint({ ramp, seed, w, h }) {
    const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16))
    const cols = ramp.map(hex)
    const lerp = (a, b, t) => a + (b - a) * t
    const rnd = (() => {
        let s = seed * 9301 + 49297
        return () => (s = (s * 9301 + 49297) % 233280) / 233280
    })()
    // a few soft "currents" — summed sines give flowing, organic bands
    const waves = Array.from({ length: 5 }, () => ({
        fx: lerp(0.6, 2.4, rnd()),
        fy: lerp(0.6, 2.4, rnd()),
        ph: rnd() * Math.PI * 2,
        amp: lerp(0.5, 1, rnd()),
    }))
    const blob = { x: lerp(0.55, 0.8, rnd()), y: lerp(0.2, 0.45, rnd()) }
    const sum = (u, v, list) => {
        let f = 0
        let n = 0
        for (const k of list) {
            f +=
                k.amp * Math.sin(u * k.fx * Math.PI + v * k.fy * Math.PI + k.ph)
            n += k.amp
        }
        return (f / n) * 0.5 + 0.5
    }
    const clamp = (x) => Math.min(1, Math.max(0, x))
    // colour: flowing bands, a diagonal drift and one bright bloom,
    // contrast-stretched so the whole ramp gets used
    const field = (u, v) => {
        const d = Math.hypot((u - blob.x) * 1.3, v - blob.y)
        const raw =
            0.62 * sum(u, v, waves) +
            0.38 * (u * 0.35 + v * 0.65) -
            0.55 * Math.max(0, 0.45 - d)
        return clamp((raw - 0.18) / 0.62)
    }
    // where to pixelate: grows toward the rim, broken up by its own noise
    const grit = Array.from({ length: 4 }, () => ({
        fx: lerp(1.5, 4, rnd()),
        fy: lerp(1.5, 4, rnd()),
        ph: rnd() * Math.PI * 2,
        amp: lerp(0.5, 1, rnd()),
    }))
    const rough = (u, v) => {
        const rim = Math.hypot((u - 0.5) * 1.25, (v - 0.5) * 1.6) * 1.35
        return clamp(rim * 0.75 + (sum(u, v, grit) - 0.5) * 0.7)
    }
    const bayer = [
        [0, 32, 8, 40, 2, 34, 10, 42],
        [48, 16, 56, 24, 50, 18, 58, 26],
        [12, 44, 4, 36, 14, 46, 6, 38],
        [60, 28, 52, 20, 62, 30, 54, 22],
        [3, 35, 11, 43, 1, 33, 9, 41],
        [51, 19, 59, 27, 49, 17, 57, 25],
        [15, 47, 7, 39, 13, 45, 5, 37],
        [63, 31, 55, 23, 61, 29, 53, 21],
    ].map((r) => r.map((x) => (x + 0.5) / 64))

    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    const img = ctx.createImageData(w, h)
    const steps = cols.length - 1
    // block sizes nest inside a 12px grid so neighbouring cells never
    // half-overlap; each 12px cell picks its own coarseness
    const CELL = 12
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const cx = Math.floor(x / CELL)
            const cy = Math.floor(y / CELL)
            const r = rough(((cx + 0.5) * CELL) / w, ((cy + 0.5) * CELL) / h)
            const block = r > 0.78 ? 12 : r > 0.62 ? 6 : r > 0.46 ? 3 : 1
            const bx = Math.floor(x / block)
            const by = Math.floor(y / block)
            const t =
                field(((bx + 0.5) * block) / w, ((by + 0.5) * block) / h) *
                steps
            const i0 = Math.min(steps - 1, Math.floor(t))
            const frac = t - i0
            let c
            if (block === 1) {
                // smooth core with a touch of film grain
                const g = (rnd() - 0.5) * 9
                c = cols[i0].map((a, k) => lerp(a, cols[i0 + 1][k], frac) + g)
            } else {
                // ordered dither between the two nearest ramp stops
                c = frac > bayer[by & 7][bx & 7] ? cols[i0 + 1] : cols[i0]
            }
            const p = (y * w + x) * 4
            img.data[p] = c[0]
            img.data[p + 1] = c[1]
            img.data[p + 2] = c[2]
            img.data[p + 3] = 255
        }
    }
    ctx.putImageData(img, 0, 0)
    return canvas.toDataURL('image/webp', 0.86)
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const port = 9400 + Math.floor(Math.random() * 400)
const profile = join(tmpdir(), `family-art-${port}`)
const proc = spawn(
    CHROME,
    [
        '--headless=new',
        '--disable-gpu',
        `--remote-debugging-port=${port}`,
        `--user-data-dir=${profile}`,
        'about:blank',
    ],
    { stdio: 'ignore' }
)
try {
    let targets
    for (let i = 0; i < 40 && !targets; i++) {
        try {
            targets = await (
                await fetch(`http://127.0.0.1:${port}/json`)
            ).json()
        } catch {
            await sleep(250)
        }
    }
    const ws = new WebSocket(
        targets.find((t) => t.type === 'page').webSocketDebuggerUrl
    )
    await new Promise((r) => (ws.onopen = r))
    let id = 0
    const pending = new Map()
    ws.onmessage = (m) => {
        const d = JSON.parse(m.data)
        if (d.id && pending.has(d.id)) {
            pending.get(d.id)(d)
            pending.delete(d.id)
        }
    }
    const evaluate = (expression) =>
        new Promise((resolve, reject) => {
            const i = ++id
            pending.set(i, (d) =>
                d.result?.exceptionDetails || d.error
                    ? reject(
                          new Error(
                              JSON.stringify(
                                  d.result?.exceptionDetails ?? d.error
                              )
                          )
                      )
                    : resolve(d.result.result.value)
            )
            ws.send(
                JSON.stringify({
                    id: i,
                    method: 'Runtime.evaluate',
                    params: { expression, returnByValue: true },
                })
            )
        })

    mkdirSync(OUT, { recursive: true })
    for (const [name, opts] of Object.entries(ART)) {
        const args = JSON.stringify({ ...opts, w: 1600, h: 1000 })
        const url = await evaluate(`(${paint.toString()})(${args})`)
        const file = join(OUT, `${name}-art.webp`)
        writeFileSync(file, Buffer.from(url.split(',')[1], 'base64'))
        console.log(`✓ ${name}`)
    }
    ws.close()
} finally {
    const exited = new Promise((r) => proc.once('exit', r))
    proc.kill()
    await exited
    rmSync(profile, { recursive: true, force: true, maxRetries: 5 })
}
