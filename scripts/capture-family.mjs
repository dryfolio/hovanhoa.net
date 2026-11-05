// Captures light + dark previews of every family site for the home page's
// "The family" showcase. Needs a local Google Chrome; no npm deps.
//
//   node scripts/capture-family.mjs            # all sites
//   node scripts/capture-family.mjs blog music # just these
//
// Output: public/family/<name>-<light|dark>.webp (1440×900 viewport, 1x)

import { spawn } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const SITES = ['blog', 'insight', 'gallery', 'music', 'book', 'status']
const CHROME =
    process.env.CHROME ||
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const OUT = join(import.meta.dirname, '..', 'public', 'family')
const W = 1440
const H = 900
const SETTLE_MS = 6000

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function withChrome(fn) {
    const port = 9400 + Math.floor(Math.random() * 400)
    const profile = join(tmpdir(), `family-capture-${port}`)
    const proc = spawn(
        CHROME,
        [
            '--headless=new',
            '--disable-gpu',
            '--hide-scrollbars',
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
        const page = targets.find((t) => t.type === 'page')
        const ws = new WebSocket(page.webSocketDebuggerUrl)
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
        const send = (method, params = {}) =>
            new Promise((resolve, reject) => {
                const i = ++id
                pending.set(i, (d) =>
                    d.error
                        ? reject(new Error(d.error.message))
                        : resolve(d.result)
                )
                ws.send(JSON.stringify({ id: i, method, params }))
            })
        await fn(send)
        ws.close()
    } finally {
        proc.kill()
        rmSync(profile, { recursive: true, force: true })
    }
}

const only = process.argv.slice(2)
const sites = only.length ? SITES.filter((s) => only.includes(s)) : SITES
mkdirSync(OUT, { recursive: true })

await withChrome(async (send) => {
    await send('Page.enable')
    await send('Network.enable')
    await send('Emulation.setDeviceMetricsOverride', {
        width: W,
        height: H,
        deviceScaleFactor: 1,
        mobile: false,
    })
    for (const site of sites) {
        const url = `https://${site}.hovanhoa.net/`
        for (const theme of ['light', 'dark']) {
            // every family site reads this shared cookie before first paint
            await send('Network.setCookie', {
                name: 'theme',
                value: theme,
                domain: '.hovanhoa.net',
                path: '/',
            })
            await send('Emulation.setEmulatedMedia', {
                features: [{ name: 'prefers-color-scheme', value: theme }],
            })
            await send('Page.navigate', { url })
            await sleep(SETTLE_MS)
            const { data } = await send('Page.captureScreenshot', {
                format: 'webp',
                quality: 82,
                clip: { x: 0, y: 0, width: W, height: H, scale: 1 },
            })
            const file = join(OUT, `${site}-${theme}.webp`)
            writeFileSync(file, Buffer.from(data, 'base64'))
            console.log(`✓ ${site} (${theme})`)
        }
    }
})
