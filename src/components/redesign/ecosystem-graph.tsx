'use client'

/**
 * EcosystemGraph — interactive map of the hovanhoa.net family.
 *
 * Apps (the *.hovanhoa.net sites) and the services they depend on, drawn as a
 * live force-of-habit constellation. Edges are typed (host / data / monitor /
 * link) and colour-coded; hovering any node lifts its connections and dims the
 * rest so the graph reads cleanly instead of turning into spaghetti.
 *
 * Floating edges anchor to node borders (not fixed handles) so the layout stays
 * organic however the nodes are dragged. Theme follows the site's --rd-* tokens,
 * so it flips with the global dark-mode toggle for free.
 */

import {
    Background,
    BackgroundVariant,
    Controls,
    Handle,
    MarkerType,
    Position,
    ReactFlow,
    ReactFlowProvider,
    getBezierPath,
    useEdgesState,
    useInternalNode,
    useNodesInitialized,
    useNodesState,
    useReactFlow,
    useStore,
    useStoreApi,
    type Edge,
    type Node,
    type NodeProps,
    type EdgeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'

/* ------------------------------------------------------------------ icons */

type IconProps = { className?: string }

const Globe = (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18" />
    </svg>
)
const Chart = (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}>
        <path d="M4 19V5M4 19h16M8 16v-4M12 16V8M16 16v-6M20 16v-2" />
    </svg>
)
const Image = (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="8.5" cy="9" r="1.6" />
        <path d="m4 17 5-5 4 4 3-3 4 4" />
    </svg>
)
const Note = (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}>
        <path d="M9 18V6l10-2v12" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="16" cy="16" r="3" />
    </svg>
)
const Pulse = (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
        <path d="M2 12h4l3 8 4-16 3 8h6" />
    </svg>
)
const Card = (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18M7 15h4" strokeLinecap="round" />
    </svg>
)
const Vercel = (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
        <path d="M12 3 22 20H2L12 3Z" />
    </svg>
)
const Cloud = (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" {...p}>
        <path d="M6.5 19a4.5 4.5 0 0 1-.5-8.97A6 6 0 0 1 17.7 9.2 3.9 3.9 0 0 1 18 19H6.5Z" />
    </svg>
)
const GitHub = (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
        <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85l-.01 2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
)
const Clock = (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
    </svg>
)
const Note2 = (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3.2" />
    </svg>
)
const Box = (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" {...p}>
        <path d="m12 2 8 4.5v9L12 20l-8-4.5v-9L12 2Z" />
        <path d="M12 11 4 6.5M12 11l8-4.5M12 11v9" />
    </svg>
)
const Doc = (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
        <path d="M14 3v5h5M9 13h6M9 17h6" />
    </svg>
)
const Book = (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" {...p}>
        <path d="M4 5.5C4 4.7 4.7 4 5.5 4H11a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H4V5.5Z" />
        <path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H13a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5H20V5.5Z" />
    </svg>
)
const Library = (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
        <path d="M3 21h18M4 21V10l8-6 8 6v11M9 21v-7h6v7" />
    </svg>
)

/* ----------------------------------------------------------------- model */

// edge "kinds" — drive colour + animation + legend.
type Kind = 'host' | 'data' | 'monitor' | 'link'

const KIND_COLOR: Record<Kind, string> = {
    host: 'var(--rd-border-2)',
    data: 'var(--rd-orange)',
    monitor: 'var(--rd-ok)',
    link: 'var(--rd-text-4)',
}

type NodeKind = 'app' | 'platform' | 'service'

type GNodeData = {
    label: string
    sub: string
    kind: NodeKind
    Icon: (p: IconProps) => JSX.Element
    href?: string
    hub?: boolean
    live?: boolean
    dim?: boolean
    onTrace?: (id: string | null) => void
    [key: string]: unknown
}

// scattered constellation — home as the central hub, the rest spread around it
// so it reads as an ambient map rather than a tidy org chart.
const RAW_NODES: { id: string; x: number; y: number; data: GNodeData }[] = [
    // apps
    { id: 'home', x: 240, y: 230, data: { label: 'hovanhoa', sub: 'profile & writing', kind: 'app', Icon: Globe, href: 'https://hovanhoa.net', hub: true, live: true } },
    { id: 'blog', x: 290, y: 80, data: { label: 'blog', sub: 'notes & posts', kind: 'app', Icon: Doc, href: 'https://blog.hovanhoa.net', live: true } },
    { id: 'insight', x: 150, y: 30, data: { label: 'insight', sub: 'dashboards', kind: 'app', Icon: Chart, href: 'https://insight.hovanhoa.net', live: true } },
    { id: 'status', x: 470, y: 140, data: { label: 'status', sub: 'uptime watcher', kind: 'app', Icon: Pulse, href: 'https://status.hovanhoa.net', live: true } },
    { id: 'gallery', x: 40, y: 170, data: { label: 'gallery', sub: 'photos', kind: 'app', Icon: Image, href: 'https://gallery.hovanhoa.net', live: true } },
    { id: 'music', x: 150, y: 450, data: { label: 'music', sub: 'now playing', kind: 'app', Icon: Note, href: 'https://music.hovanhoa.net', live: true } },
    { id: 'info', x: 360, y: 350, data: { label: 'info', sub: 'contact card', kind: 'app', Icon: Card, href: 'https://info.hovanhoa.net', live: true } },
    { id: 'book', x: 620, y: 30, data: { label: 'book', sub: 'bookshelf', kind: 'app', Icon: Book, href: 'https://book.hovanhoa.net', live: true } },
    // external services
    { id: 'wakatime', x: 380, y: 30, data: { label: 'wakatime', sub: 'coding stats', kind: 'service', Icon: Clock } },
    { id: 'github', x: 560, y: 250, data: { label: 'github', sub: 'actions / repos', kind: 'service', Icon: GitHub } },
    { id: 'cloudinary', x: 30, y: 350, data: { label: 'cloudinary', sub: 'image cdn', kind: 'service', Icon: Box } },
    { id: 'spotify', x: 330, y: 500, data: { label: 'spotify', sub: 'listening api', kind: 'service', Icon: Note2 } },
    { id: 'openlibrary', x: 680, y: 150, data: { label: 'openlibrary', sub: 'book covers', kind: 'service', Icon: Library } },
    // platform (used by everything)
    { id: 'vercel', x: 470, y: 360, data: { label: 'vercel', sub: 'hosting · ci', kind: 'platform', Icon: Vercel } },
    { id: 'cloudflare', x: 560, y: 440, data: { label: 'cloudflare', sub: 'dns · analytics', kind: 'platform', Icon: Cloud } },
]

const APPS = ['home', 'blog', 'insight', 'status', 'gallery', 'music', 'info', 'book']

const RAW_EDGES: { s: string; t: string; kind: Kind; dir?: boolean }[] = [
    // every app is hosted on vercel + fronted by cloudflare
    ...APPS.flatMap((a) => [
        { s: a, t: 'vercel', kind: 'host' as Kind },
        { s: a, t: 'cloudflare', kind: 'host' as Kind },
    ]),
    // status watches every other app (and the health check from home)
    ...APPS.filter((a) => a !== 'status').map((a) => ({
        s: 'status',
        t: a,
        kind: 'monitor' as Kind,
        dir: true,
    })),
    // external data pulls
    { s: 'insight', t: 'wakatime', kind: 'data', dir: true },
    { s: 'insight', t: 'cloudflare', kind: 'data', dir: true },
    { s: 'gallery', t: 'cloudinary', kind: 'data', dir: true },
    { s: 'music', t: 'spotify', kind: 'data', dir: true },
    { s: 'book', t: 'openlibrary', kind: 'data', dir: true },
    { s: 'status', t: 'github', kind: 'data', dir: true },
    // home cross-links to every app (the nav)
    ...APPS.filter((a) => a !== 'home').map((a) => ({
        s: 'home',
        t: a,
        kind: 'link' as Kind,
    })),
]

/* ------------------------------------------------------ floating geometry */

// intersection of the line (node-center → target-center) with the node's box.
function intersect(node: any, other: any) {
    const { width: w, height: h } = node.measured
    const a = node.internals.positionAbsolute
    const b = other.internals.positionAbsolute
    const hw = w / 2
    const hh = h / 2
    const cx = a.x + hw
    const cy = a.y + hh
    const ox = b.x + other.measured.width / 2
    const oy = b.y + other.measured.height / 2
    const dx = (ox - cx) / (2 * hw) - (oy - cy) / (2 * hh)
    const dy = (ox - cx) / (2 * hw) + (oy - cy) / (2 * hh)
    const k = 1 / (Math.abs(dx) + Math.abs(dy) || 1)
    const sx = k * dx
    const sy = k * dy
    return { x: hw * (sx + sy) + cx, y: hh * (-sx + sy) + cy }
}

function sideOf(node: any, p: { x: number; y: number }): Position {
    const a = node.internals.positionAbsolute
    const px = Math.round(p.x - a.x)
    const py = Math.round(p.y - a.y)
    if (px <= 1) return Position.Left
    if (px >= Math.round(node.measured.width) - 1) return Position.Right
    if (py <= 1) return Position.Top
    return Position.Bottom
}

/* ------------------------------------------------------------ floating edge */

function FloatingEdgeImpl({ id, source, target, markerEnd, data }: EdgeProps) {
    const s = useInternalNode(source)
    const t = useInternalNode(target)
    if (!s?.measured?.width || !t?.measured?.width) return null

    const sp = intersect(s, t)
    const tp = intersect(t, s)
    const [path] = getBezierPath({
        sourceX: sp.x,
        sourceY: sp.y,
        targetX: tp.x,
        targetY: tp.y,
        sourcePosition: sideOf(s, sp),
        targetPosition: sideOf(t, tp),
        curvature: 0.25,
    })

    const kind = (data?.kind as Kind) ?? 'link'
    const active = data?.active as boolean | undefined
    const faded = data?.faded as boolean | undefined
    const flowing = kind === 'data' || kind === 'monitor'

    return (
        <path
            id={id}
            d={path}
            fill="none"
            markerEnd={active ? markerEnd : undefined}
            stroke={KIND_COLOR[kind]}
            strokeWidth={active ? 2.2 : 1.3}
            strokeDasharray={kind === 'host' ? '5 5' : kind === 'link' ? '1 6' : '7 6'}
            strokeLinecap="round"
            className={flowing && active ? 'eg-flow' : undefined}
            style={{
                opacity: faded ? 0.06 : active ? 0.95 : flowing ? 0.4 : 0.28,
                transition: 'opacity .2s, stroke-width .2s',
            }}
        />
    )
}
const FloatingEdge = memo(FloatingEdgeImpl)

/* --------------------------------------------------------------- node card */

const NODE_CELL = 2 // css px per dot inside a node

// The node's own body, drawn as pixels: a dotted rim, an ember glow that
// dithers out from behind the icon, and a clean core so the label stays
// legible. Redraws on resize and theme change only.
function NodeDither({
    kind,
    hub,
    radius,
}: {
    kind: NodeKind
    hub?: boolean
    radius: number
}) {
    const ref = useRef<HTMLCanvasElement>(null)
    const dark = useDarkClass()

    useEffect(() => {
        const canvas = ref.current
        const ctx = canvas?.getContext('2d')
        const box = canvas?.parentElement
        if (!canvas || !ctx || !box) return

        const draw = () => {
            const css = getComputedStyle(canvas)
            const surface = tokenRgb(ctx, css, '--rd-surface', dark ? '#141414' : '#ffffff')
            const ember = tokenRgb(ctx, css, '--rd-orange', '#d8602f')
            const grey = tokenRgb(ctx, css, '--rd-text-3', '#8a8a8a')
            const ink = kind === 'platform' ? grey : ember
            const rim = mixRgb(surface, ink, hub ? 0.95 : 0.5)
            const glow = mixRgb(surface, ink, hub ? 0.4 : dark ? 0.32 : 0.24)
            const core = hub ? mixRgb(surface, ember, dark ? 0.12 : 0.08) : surface

            const w = Math.max(1, Math.round(box.offsetWidth / NODE_CELL))
            const h = Math.max(1, Math.round(box.offsetHeight / NODE_CELL))
            canvas.width = w
            canvas.height = h
            const img = ctx.createImageData(w, h)
            const data = img.data
            const r = Math.min(h / 2, radius / NODE_CELL)
            const rimW = hub ? 1.6 : 1

            for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    // signed distance to the rounded rect, in cells
                    const qx = Math.abs(x + 0.5 - w / 2) - (w / 2 - r)
                    const qy = Math.abs(y + 0.5 - h / 2) - (h / 2 - r)
                    const sd =
                        Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) +
                        Math.min(Math.max(qx, qy), 0) -
                        r
                    if (sd > 0) continue // outside: leave transparent
                    const th = BAYER[(y & 3) * 4 + (x & 3)]
                    let c = core
                    if (sd > -rimW) {
                        c = rim
                    } else {
                        // glow from the icon side, plus a soft inner edge
                        const fromIcon = 1 - (x / w) * (hub ? 1.4 : 2.6)
                        const edge = Math.max(0, 1 + sd / 3)
                        const t = Math.max(fromIcon, 0) * 0.85 + edge * 0.45
                        if (t > th) c = glow
                    }
                    const i = (y * w + x) * 4
                    data[i] = c[0]
                    data[i + 1] = c[1]
                    data[i + 2] = c[2]
                    data[i + 3] = 255
                }
            }
            ctx.putImageData(img, 0, 0)
        }

        draw()
        const ro = new ResizeObserver(draw)
        ro.observe(box)
        return () => ro.disconnect()
    }, [dark, kind, hub, radius])

    return (
        <canvas
            ref={ref}
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 h-full w-full [image-rendering:pixelated]"
        />
    )
}

// App nodes carry a real link so keyboard and screen-reader users can reach
// them; "nodrag" keeps React Flow's node-drag from swallowing the click.
function LabelWrap({
    href,
    ariaLabel,
    className,
    onFocus,
    onBlur,
    children,
}: {
    href?: string
    ariaLabel: string
    className: string
    onFocus?: () => void
    onBlur?: () => void
    children: React.ReactNode
}) {
    if (!href) return <span className={className}>{children}</span>
    return (
        <a
            href={href}
            aria-label={ariaLabel}
            onFocus={onFocus}
            onBlur={onBlur}
            className={`nodrag ${className} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--rd-orange)]`}
        >
            {children}
        </a>
    )
}

function NodeCardImpl({ id, data }: NodeProps) {
    const d = data as GNodeData
    const trace = d.onTrace
    const { Icon } = d
    const compact = !!d.compact
    const accent =
        d.kind === 'platform'
            ? 'var(--rd-text-2)'
            : d.kind === 'service'
              ? 'var(--rd-orange)'
              : 'var(--rd-orange-ink)'

    return (
        <div
            className={`group relative isolate flex items-center transition-all duration-200 ${
                compact ? 'gap-1.5 px-2.5 py-1.5' : 'gap-2.5 px-3.5 py-2.5'
            }`}
            style={{
                opacity: d.dim ? 0.28 : 1,
                transform: d.dim ? 'scale(0.94)' : 'scale(1)',
            }}
        >
            <NodeDither kind={d.kind} hub={d.hub} radius={compact ? 999 : 16} />
            {/* hidden handles — floating edges anchor to the box, not these */}
            <Handle type="source" position={Position.Top} className="!h-0 !w-0 !min-w-0 !border-0 !bg-transparent" isConnectable={false} />
            <Handle type="target" position={Position.Top} className="!h-0 !w-0 !min-w-0 !border-0 !bg-transparent" isConnectable={false} />

            <span
                className={`flex shrink-0 items-center justify-center ${
                    compact ? 'h-5 w-4' : 'h-7 w-6'
                }`}
                style={{ color: accent }}
            >
                <Icon className={compact ? 'h-3 w-3' : 'h-4 w-4'} />
            </span>

            {compact ? (
                <LabelWrap
                    href={d.href}
                    ariaLabel={`${d.label} — ${d.sub}`}
                    onFocus={() => trace?.(id)}
                    onBlur={() => trace?.(null)}
                    className="flex items-center gap-1 rounded pr-0.5 font-[family-name:var(--font-mono)] text-[11px] font-semibold text-[var(--rd-text)]"
                >
                    {d.label}
                    {d.live && (
                        <span
                            aria-hidden
                            className="inline-block h-1 w-1 bg-[var(--rd-ok)] motion-safe:animate-pulse"
                        />
                    )}
                </LabelWrap>
            ) : (
                <LabelWrap
                    href={d.href}
                    ariaLabel={`${d.label} — ${d.sub}`}
                    onFocus={() => trace?.(id)}
                    onBlur={() => trace?.(null)}
                    className="flex flex-col rounded leading-tight"
                >
                    <span className="flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[13px] font-semibold text-[var(--rd-text)]">
                        {d.label}
                        {d.live && (
                            <span
                                aria-hidden
                                className="inline-block h-1.5 w-1.5 bg-[var(--rd-ok)] motion-safe:animate-pulse"
                            />
                        )}
                    </span>
                    <span className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--rd-text-3)]">
                        {d.sub}
                    </span>
                </LabelWrap>
            )}
        </div>
    )
}
const NodeCard = memo(NodeCardImpl)

const nodeTypes = { card: NodeCard }
const edgeTypes = { floating: FloatingEdge }

/* ----------------------------------------------------------- dither field */

// resolve a CSS colour token to [r, g, b] using the canvas colour parser
function tokenRgb(
    ctx: CanvasRenderingContext2D,
    css: CSSStyleDeclaration,
    token: string,
    fallback: string
) {
    ctx.fillStyle = fallback
    ctx.fillStyle = css.getPropertyValue(token).trim() || fallback
    const h = ctx.fillStyle
    return h.startsWith('#')
        ? [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
        : (h.match(/\d+/g) ?? ['0', '0', '0']).slice(0, 3).map(Number)
}

const mixRgb = (a: number[], b: number[], t: number) =>
    a.map((v, i) => Math.round(v + (b[i] - v) * t))

// the site toggles dark mode with a class on <html>
function useDarkClass() {
    const [dark, setDark] = useState(false)
    useEffect(() => {
        const read = () =>
            setDark(document.documentElement.classList.contains('dark'))
        read()
        const obs = new MutationObserver(read)
        obs.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        })
        return () => obs.disconnect()
    }, [])
    return dark
}

// 4×4 Bayer thresholds, 0..1
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(
    (v) => (v + 0.5) / 16
)
const CELL = 4 // css px per dither dot
const NODE_GLOW: Record<NodeKind, { r: number; w: number }> = {
    app: { r: 70, w: 0.72 },
    service: { r: 52, w: 0.5 },
    platform: { r: 60, w: 0.42 },
}

// Ordered-dither "heat" behind the graph: each node radiates a soft ember
// field, the hub hottest, with a slow drifting current across the pane. Drawn
// one cell per dot on a small canvas and scaled up pixelated, like the family
// art. Reads node positions straight from the React Flow store each frame, so
// it follows panning, dragging and hover without re-rendering React.
function DitherField({ theme }: { theme: 'light' | 'dark' }) {
    const ref = useRef<HTMLCanvasElement>(null)
    const store = useStoreApi()

    useEffect(() => {
        const canvas = ref.current
        const ctx = canvas?.getContext('2d')
        if (!canvas || !ctx) return

        const css = getComputedStyle(canvas)
        const base = tokenRgb(ctx, css, '--rd-surface', theme === 'dark' ? '#141414' : '#ffffff')
        const ember = tokenRgb(ctx, css, '--rd-orange', '#d8602f')
        const mix = (t: number) => mixRgb(base, ember, t)
        const ramp = theme === 'dark' ? [mix(0.16), mix(0.34), mix(0.6)] : [mix(0.1), mix(0.24), mix(0.46)]
        const levels = ramp.length

        let img: ImageData | null = null
        let raf = 0
        let last = 0
        let visible = true
        const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        const draw = (t: number) => {
            const { width, height, transform, nodeLookup } = store.getState()
            if (!width || !height) return
            const w = Math.ceil(width / CELL)
            const h = Math.ceil(height / CELL)
            if (canvas.width !== w || canvas.height !== h || !img) {
                canvas.width = w
                canvas.height = h
                img = ctx.createImageData(w, h)
            }
            const [tx, ty, zoom] = transform

            const glows: { x: number; y: number; r2: number; w: number }[] = []
            let anyDim = false
            nodeLookup.forEach((n) => anyDim ||= !!(n.data as GNodeData).dim)
            nodeLookup.forEach((n) => {
                const d = n.data as GNodeData
                if (!n.measured?.width) return
                const p = n.internals.positionAbsolute
                const g = NODE_GLOW[d.kind]
                const r = (d.hub ? 120 : g.r) * zoom
                let wt = d.hub ? 1 : g.w
                if (anyDim) wt *= d.dim ? 0.2 : 1.35
                glows.push({
                    x: ((p.x + n.measured.width / 2) * zoom + tx) / CELL,
                    y: ((p.y + (n.measured.height ?? 0) / 2) * zoom + ty) / CELL,
                    r2: 2 * (r / CELL) ** 2,
                    w: wt,
                })
            })

            const data = img.data
            const ph = t * 0.00035
            for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    // glows blend like light (1 − Π(1 − g)) so overlaps
                    // brighten without flattening into one solid blob
                    let dark = 1
                    for (const g of glows) {
                        const dx = x - g.x
                        const dy = y - g.y
                        const d2 = dx * dx + dy * dy
                        if (d2 < g.r2 * 4)
                            dark *= 1 - Math.min(1, g.w * Math.exp(-d2 / g.r2))
                    }
                    // slow current: two crossing sine bands, faint everywhere
                    const v =
                        0.62 * (1 - dark) +
                        0.1 *
                            (1 +
                                Math.sin(x * 0.06 + y * 0.027 + ph) *
                                    Math.sin(y * 0.08 - x * 0.016 - ph * 0.7))
                    const lvl = Math.min(
                        levels,
                        Math.floor(v * levels + BAYER[(y & 3) * 4 + (x & 3)] - 0.35)
                    )
                    const i = (y * w + x) * 4
                    if (lvl <= 0) {
                        data[i + 3] = 0
                    } else {
                        const c = ramp[lvl - 1]
                        data[i] = c[0]
                        data[i + 1] = c[1]
                        data[i + 2] = c[2]
                        data[i + 3] = 255
                    }
                }
            }
            ctx.putImageData(img, 0, 0)
        }

        // ~12fps is plenty for a slow drift and keeps phones cool
        const loop = (t: number) => {
            raf = requestAnimationFrame(loop)
            if (!visible || document.hidden || t - last < 80) return
            last = t
            draw(t)
        }
        const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
        io.observe(canvas)

        let unsub = () => {}
        if (still) {
            draw(0)
            unsub = store.subscribe(() => {
                cancelAnimationFrame(raf)
                raf = requestAnimationFrame(() => draw(0))
            })
        } else {
            raf = requestAnimationFrame(loop)
        }
        return () => {
            cancelAnimationFrame(raf)
            unsub()
            io.disconnect()
        }
    }, [store, theme])

    return (
        <canvas
            ref={ref}
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full [image-rendering:pixelated]"
        />
    )
}

/* ------------------------------------------------------------------- graph */

function Graph({
    compact,
    vertical,
    theme,
}: {
    compact: boolean
    vertical: boolean
    theme: 'light' | 'dark'
}) {
    const adjacency = useMemo(() => {
        const m = new Map<string, Set<string>>()
        RAW_NODES.forEach((n) => m.set(n.id, new Set()))
        RAW_EDGES.forEach((e) => {
            m.get(e.s)!.add(e.t)
            m.get(e.t)!.add(e.s)
        })
        return m
    }, [])

    // keyboard focus on a node link triggers the same trace highlight as hover;
    // routed through a ref so node data stays referentially stable.
    const focusRef = useRef<(id: string | null) => void>(() => {})

    const initialNodes: Node[] = useMemo(
        () =>
            RAW_NODES.map((n) => ({
                id: n.id,
                type: 'card',
                // narrow screens get the same map turned on its side, so it
                // fills a tall frame instead of shrinking to fit a wide one
                position: vertical ? { x: n.y, y: n.x } : { x: n.x, y: n.y },
                data: {
                    ...n.data,
                    compact,
                    onTrace: (id: string | null) => focusRef.current(id),
                },
            })),
        [compact, vertical]
    )

    const initialEdges: Edge[] = useMemo(
        () =>
            RAW_EDGES.map((e, i) => ({
                id: `e${i}`,
                source: e.s,
                target: e.t,
                type: 'floating',
                data: { kind: e.kind },
                markerEnd: e.dir
                    ? {
                          type: MarkerType.ArrowClosed,
                          width: 16,
                          height: 16,
                          color: KIND_COLOR[e.kind],
                      }
                    : undefined,
            })),
        []
    )

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
    useEffect(() => setNodes(initialNodes), [initialNodes, setNodes])

    // refit whenever the pane is resized or the layout flips, not just once
    // on mount — otherwise a late-measured container leaves the map clipped
    const { fitView } = useReactFlow()
    const paneW = useStore((st) => st.width)
    const paneH = useStore((st) => st.height)
    const measured = useNodesInitialized()
    const padding = compact ? 0.06 : 0.18
    useEffect(() => {
        if (measured && paneW && paneH) fitView({ padding })
    }, [measured, paneW, paneH, vertical, padding, fitView])

    const focus = useCallback(
        (id: string | null) => {
            const nb = id ? adjacency.get(id) : null
            setNodes((ns) =>
                ns.map((n) => ({
                    ...n,
                    data: {
                        ...n.data,
                        dim: id ? n.id !== id && !nb!.has(n.id) : false,
                    },
                }))
            )
            setEdges((es) =>
                es.map((e) => {
                    const on = id ? e.source === id || e.target === id : false
                    return {
                        ...e,
                        data: {
                            ...e.data,
                            active: on,
                            faded: id ? !on : false,
                        },
                    }
                })
            )
        },
        [adjacency, setNodes, setEdges]
    )
    focusRef.current = focus

    return (
        <>
        <DitherField theme={theme} />
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodeMouseEnter={(_, n) => focus(n.id)}
            onNodeMouseLeave={() => focus(null)}
            fitView
            fitViewOptions={{ padding }}
            minZoom={0.15}
            maxZoom={1.6}
            zoomOnScroll={false}
            zoomOnDoubleClick={false}
            panOnScroll={false}
            preventScrolling={false}
            panOnDrag={!compact}
            nodesDraggable={!compact}
            nodesFocusable={false}
            edgesFocusable={false}
            elementsSelectable={false}
            proOptions={{ hideAttribution: true }}
            nodesConnectable={false}
            style={{ background: 'transparent' }}
            className={compact ? '' : 'cursor-grab active:cursor-grabbing'}
        >
            {!compact && (
                <>
                    <Background
                        variant={BackgroundVariant.Dots}
                        gap={26}
                        size={1}
                        color="var(--rd-border-2)"
                    />
                    <Controls showInteractive={false} className="!shadow-none" />
                </>
            )}
        </ReactFlow>
        </>
    )
}

/* --------------------------------------------------------------- exported */

const LEGEND: { kind: Kind; label: string }[] = [
    { kind: 'host', label: 'hosted on' },
    { kind: 'data', label: 'pulls data' },
    { kind: 'monitor', label: 'monitors' },
    { kind: 'link', label: 'links to' },
]

export function EcosystemGraph({ compact = false }: { compact?: boolean }) {
    const theme = useDarkClass() ? 'dark' : 'light'
    const [vertical, setVertical] = useState(false)
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 640px)')
        const read = () => setVertical(mq.matches)
        read()
        mq.addEventListener('change', read)
        return () => mq.removeEventListener('change', read)
    }, [])

    if (compact) {
        // ambient hero variant — no card, no chrome; the constellation blends
        // into the page and reveals its wiring on hover.
        return (
            <div
                role="group"
                aria-label="map of the hovanhoa.net apps and the services they run on"
                className={`relative w-full select-none ${
                    vertical
                        ? 'h-[clamp(440px,125vw,600px)]'
                        : 'h-[clamp(360px,52vh,520px)]'
                }`}
                data-theme={theme}
            >
                <ReactFlowProvider>
                    <Graph compact vertical={vertical} theme={theme} />
                </ReactFlowProvider>
            </div>
        )
    }

    return (
        <div
            role="group"
            aria-label="map of the hovanhoa.net apps and the services they run on"
            className="overflow-hidden rounded-[var(--rd-r-lg)] border border-[var(--rd-border)] bg-[var(--rd-bg-sub)]"
        >
            <div
                className={`relative w-full ${
                    vertical
                        ? 'h-[clamp(480px,135vw,640px)]'
                        : 'h-[clamp(420px,68vh,640px)]'
                }`}
                data-theme={theme}
            >
                <ReactFlowProvider>
                    <Graph compact={false} vertical={vertical} theme={theme} />
                </ReactFlowProvider>

                {/* legend */}
                <div className="pointer-events-none absolute bottom-3 left-3 z-10 flex flex-wrap gap-x-3.5 gap-y-1.5 rounded-xl border border-[var(--rd-border)] bg-[var(--rd-surface)]/90 px-3 py-2 backdrop-blur">
                    {LEGEND.map((l) => (
                        <span
                            key={l.kind}
                            className="flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[10.5px] text-[var(--rd-text-3)]"
                        >
                            <span
                                className="inline-block h-[2px] w-4 rounded-full"
                                style={{ background: KIND_COLOR[l.kind] }}
                            />
                            {l.label}
                        </span>
                    ))}
                </div>

                {/* hint */}
                <div className="pointer-events-none absolute right-3 top-3 z-10 font-[family-name:var(--font-mono)] text-[10.5px] text-[var(--rd-text-4)]">
                    hover to trace · drag to move · click to open
                </div>
            </div>
        </div>
    )
}

export default EcosystemGraph
