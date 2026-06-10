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
    useNodesState,
    type Edge,
    type Node,
    type NodeProps,
    type EdgeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'

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
    [key: string]: unknown
}

// scattered constellation — home as the central hub, the rest spread around it
// so it reads as an ambient map rather than a tidy org chart.
const RAW_NODES: { id: string; x: number; y: number; data: GNodeData }[] = [
    // apps
    { id: 'home', x: 240, y: 230, data: { label: 'hovanhoa', sub: 'home · blog', kind: 'app', Icon: Globe, href: 'https://hovanhoa.net', hub: true, live: true } },
    { id: 'insight', x: 150, y: 30, data: { label: 'insight', sub: 'dashboards', kind: 'app', Icon: Chart, href: 'https://insight.hovanhoa.net', live: true } },
    { id: 'status', x: 470, y: 140, data: { label: 'status', sub: 'uptime watcher', kind: 'app', Icon: Pulse, href: 'https://status.hovanhoa.net', live: true } },
    { id: 'gallery', x: 40, y: 170, data: { label: 'gallery', sub: 'photos', kind: 'app', Icon: Image, href: 'https://gallery.hovanhoa.net', live: true } },
    { id: 'music', x: 150, y: 450, data: { label: 'music', sub: 'now playing', kind: 'app', Icon: Note, href: 'https://music.hovanhoa.net', live: true } },
    { id: 'info', x: 360, y: 350, data: { label: 'info', sub: 'contact card', kind: 'app', Icon: Card, href: 'https://info.hovanhoa.net', live: true } },
    // external services
    { id: 'wakatime', x: 380, y: 30, data: { label: 'wakatime', sub: 'coding stats', kind: 'service', Icon: Clock } },
    { id: 'github', x: 560, y: 250, data: { label: 'github', sub: 'actions / repos', kind: 'service', Icon: GitHub } },
    { id: 'cloudinary', x: 30, y: 350, data: { label: 'cloudinary', sub: 'image cdn', kind: 'service', Icon: Box } },
    { id: 'spotify', x: 330, y: 500, data: { label: 'spotify', sub: 'listening api', kind: 'service', Icon: Note2 } },
    // platform (used by everything)
    { id: 'vercel', x: 470, y: 360, data: { label: 'vercel', sub: 'hosting · ci', kind: 'platform', Icon: Vercel } },
    { id: 'cloudflare', x: 560, y: 440, data: { label: 'cloudflare', sub: 'dns · analytics', kind: 'platform', Icon: Cloud } },
]

const APPS = ['home', 'insight', 'status', 'gallery', 'music', 'info']

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

function NodeCardImpl({ data }: NodeProps) {
    const d = data as GNodeData
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
            className={`group relative flex items-center rounded-full border transition-all duration-200 ${
                compact ? 'gap-1.5 px-2 py-1' : 'gap-2.5 rounded-2xl px-3 py-2 shadow-sm'
            }`}
            style={{
                background: d.hub ? 'var(--rd-orange-bg)' : 'var(--rd-surface)',
                borderColor: d.hub ? 'var(--rd-orange)' : 'var(--rd-border-2)',
                borderWidth: d.hub ? 1.5 : 1,
                opacity: d.dim ? 0.28 : 1,
                transform: d.dim ? 'scale(0.94)' : 'scale(1)',
                boxShadow: compact
                    ? '0 1px 2px rgba(0,0,0,0.04)'
                    : undefined,
            }}
        >
            {/* hidden handles — floating edges anchor to the box, not these */}
            <Handle type="source" position={Position.Top} className="!h-0 !w-0 !min-w-0 !border-0 !bg-transparent" isConnectable={false} />
            <Handle type="target" position={Position.Top} className="!h-0 !w-0 !min-w-0 !border-0 !bg-transparent" isConnectable={false} />

            <span
                className={`flex shrink-0 items-center justify-center rounded-full ${
                    compact ? 'h-5 w-5' : 'h-7 w-7 rounded-lg'
                }`}
                style={{
                    background: d.kind === 'platform' ? 'var(--rd-surface-2)' : 'var(--rd-orange-bg)',
                    color: accent,
                }}
            >
                <Icon className={compact ? 'h-3 w-3' : 'h-4 w-4'} />
            </span>

            {compact ? (
                <span className="flex items-center gap-1 pr-0.5 font-[family-name:var(--font-mono)] text-[11px] font-semibold text-[var(--rd-text)]">
                    {d.label}
                    {d.live && (
                        <span className="inline-block h-1 w-1 rounded-full bg-[var(--rd-ok)] motion-safe:animate-pulse" />
                    )}
                </span>
            ) : (
                <span className="flex flex-col leading-tight">
                    <span className="flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[13px] font-semibold text-[var(--rd-text)]">
                        {d.label}
                        {d.live && (
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--rd-ok)] motion-safe:animate-pulse" />
                        )}
                    </span>
                    <span className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--rd-text-3)]">
                        {d.sub}
                    </span>
                </span>
            )}
        </div>
    )
}
const NodeCard = memo(NodeCardImpl)

const nodeTypes = { card: NodeCard }
const edgeTypes = { floating: FloatingEdge }

/* ------------------------------------------------------------------- graph */

function Graph({ compact }: { compact: boolean }) {
    const adjacency = useMemo(() => {
        const m = new Map<string, Set<string>>()
        RAW_NODES.forEach((n) => m.set(n.id, new Set()))
        RAW_EDGES.forEach((e) => {
            m.get(e.s)!.add(e.t)
            m.get(e.t)!.add(e.s)
        })
        return m
    }, [])

    const initialNodes: Node[] = useMemo(
        () =>
            RAW_NODES.map((n) => ({
                id: n.id,
                type: 'card',
                position: { x: n.x, y: n.y },
                data: { ...n.data, compact },
            })),
        [compact]
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

    const onNodeClick = useCallback((_: unknown, node: Node) => {
        const href = (node.data as GNodeData).href
        if (href) window.open(href, '_blank', 'noopener,noreferrer')
    }, [])

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodeMouseEnter={(_, n) => focus(n.id)}
            onNodeMouseLeave={() => focus(null)}
            onNodeClick={onNodeClick}
            fitView
            fitViewOptions={{ padding: compact ? 0.06 : 0.18 }}
            minZoom={0.3}
            maxZoom={1.6}
            zoomOnScroll={false}
            zoomOnDoubleClick={false}
            panOnScroll={false}
            preventScrolling={false}
            panOnDrag={!compact}
            proOptions={{ hideAttribution: true }}
            nodesConnectable={false}
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
    const [theme, setTheme] = useState<'light' | 'dark'>('light')
    useEffect(() => {
        const read = () =>
            setTheme(
                document.documentElement.classList.contains('dark')
                    ? 'dark'
                    : 'light'
            )
        read()
        const obs = new MutationObserver(read)
        obs.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        })
        return () => obs.disconnect()
    }, [])

    if (compact) {
        // ambient hero variant — no card, no chrome; the constellation blends
        // into the page and reveals its wiring on hover.
        return (
            <div
                className="relative h-[clamp(360px,52vh,520px)] w-full select-none"
                data-theme={theme}
            >
                <ReactFlowProvider>
                    <Graph compact />
                </ReactFlowProvider>
            </div>
        )
    }

    return (
        <div className="overflow-hidden rounded-[var(--rd-r-lg)] border border-[var(--rd-border)] bg-[var(--rd-bg-sub)]">
            <div
                className="relative h-[clamp(420px,68vh,640px)] w-full"
                data-theme={theme}
            >
                <ReactFlowProvider>
                    <Graph compact={false} />
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
