'use client'

/**
 * EcosystemFigure — the hovanhoa.net family as a little isometric bench model.
 *
 * A base plate carries the visitor, Cloudflare, a Vercel slab with the eight
 * sites on it, and the APIs the sites pull from. One orange ball walks a real
 * request route (you → cloudflare → vercel → site → api) through four steps;
 * "Simulate outage" takes the site down and lets status.hovanhoa.net flag it.
 *
 * Everything is plain SVG drawn from one isometric projection, so it scales
 * with the card and follows the --rd-* tokens in both themes.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/* ------------------------------------------------------------ projection */

const S = 18 // px per plane unit
const CX = 0.866 * S
const CY = 0.5 * S
const OX = 300
const OY = 70

type P3 = [number, number, number]
const iso = ([x, y, z]: P3): [number, number] => [
    OX + (x - y) * CX,
    OY + (x + y) * CY - z * S,
]
const pts = (ps: P3[]) =>
    ps
        .map((p) =>
            iso(p)
                .map((v) => v.toFixed(1))
                .join(',')
        )
        .join(' ')
const pathD = (ps: P3[]) =>
    ps
        .map(
            (p, i) =>
                `${i ? 'L' : 'M'}${iso(p)
                    .map((v) => v.toFixed(1))
                    .join(' ')}`
        )
        .join('')

/* ----------------------------------------------------------------- model */

type Site = {
    id: string
    label: string
    href: string
    x: number
    y: number
    api?: string
    lane?: P3[] // pipe from the site to its api
}

const ROW_BACK = 2.6
const ROW_FRONT = 8.5
const COL = [11, 14.2, 17.4, 20.6]
const BOX = 1.8
const BUS_Y = 6.6
const PZ = 0.85 // pipe height on the slab

const c = (i: number) => COL[i] + BOX / 2

const SITES: Site[] = [
    {
        id: 'home',
        label: 'hovanhoa.net',
        href: 'https://hovanhoa.net',
        x: COL[0],
        y: ROW_BACK,
    },
    {
        id: 'blog',
        label: 'blog',
        href: 'https://blog.hovanhoa.net',
        x: COL[1],
        y: ROW_BACK,
    },
    {
        id: 'insight',
        label: 'insight',
        href: 'https://insight.hovanhoa.net',
        x: COL[2],
        y: ROW_BACK,
        api: 'wakatime',
        lane: [
            [c(2), ROW_BACK, PZ],
            [c(2), 1.0, PZ],
            [27, 1.0, PZ],
        ],
    },
    {
        id: 'gallery',
        label: 'gallery',
        href: 'https://gallery.hovanhoa.net',
        x: COL[3],
        y: ROW_BACK,
        api: 'cloudinary',
        lane: [
            [c(3), ROW_BACK, PZ],
            [c(3), 1.8, PZ],
            [24.0, 1.8, PZ],
            [24.0, 4.2, PZ],
            [27, 4.2, PZ],
        ],
    },
    {
        id: 'info',
        label: 'info',
        href: 'https://info.hovanhoa.net',
        x: COL[0],
        y: ROW_FRONT,
    },
    {
        id: 'music',
        label: 'music',
        href: 'https://music.hovanhoa.net',
        x: COL[1],
        y: ROW_FRONT,
        api: 'spotify',
        lane: [
            [c(1), ROW_FRONT + BOX, PZ],
            [c(1), 12.2, PZ],
            [25.2, 12.2, PZ],
            [25.2, 13.2, PZ],
            [27, 13.2, PZ],
        ],
    },
    {
        id: 'book',
        label: 'book',
        href: 'https://book.hovanhoa.net',
        x: COL[2],
        y: ROW_FRONT,
        api: 'openlibrary',
        lane: [
            [c(2), ROW_FRONT + BOX, PZ],
            [c(2), 11.6, PZ],
            [24.6, 11.6, PZ],
            [24.6, 10.4, PZ],
            [27, 10.4, PZ],
        ],
    },
    {
        id: 'status',
        label: 'status',
        href: 'https://status.hovanhoa.net',
        x: COL[3],
        y: ROW_FRONT,
        api: 'github',
        lane: [
            [c(3), ROW_FRONT + BOX, PZ],
            [c(3), 11.0, PZ],
            [24.0, 11.0, PZ],
            [24.0, 7.4, PZ],
            [27, 7.4, PZ],
        ],
    },
]

const APIS: { id: string; label: string; y: number }[] = [
    { id: 'wakatime', label: 'WakaTime', y: 0 },
    { id: 'cloudinary', label: 'Cloudinary', y: 3.2 },
    { id: 'github', label: 'GitHub', y: 6.4 },
    { id: 'openlibrary', label: 'Open Library', y: 9.4 },
    { id: 'spotify', label: 'Spotify', y: 12.2 },
]

// sites the demo request cycles through on each replay
const TOURS = ['music', 'insight', 'gallery', 'book', 'status']

const INGRESS: P3[] = [
    [3, BUS_Y, 0.45],
    [5, BUS_Y, 0.45],
]
const TO_SLAB: P3[] = [
    [8, BUS_Y, 0.45],
    [9.6, BUS_Y, PZ],
]
const stubOf = (s: Site): P3[] => {
    const cx = s.x + BOX / 2
    const edge = s.y === ROW_BACK ? ROW_BACK + BOX : ROW_FRONT
    return [
        [9.6, BUS_Y, PZ],
        [cx, BUS_Y, PZ],
        [cx, edge, PZ],
    ]
}

/* ------------------------------------------------------------- primitives */

const LINE = 'color-mix(in oklab, var(--rd-text) 38%, transparent)'
const FACE_L = 'var(--rd-surface-2)'
const FACE_R = 'color-mix(in oklab, var(--rd-surface-2), var(--rd-text) 7%)'

function Prism({
    x,
    y,
    w,
    d,
    h,
    z = 0,
    top = 'var(--rd-surface)',
    grill = false,
}: {
    x: number
    y: number
    w: number
    d: number
    h: number
    z?: number
    top?: string
    grill?: boolean
}) {
    const x1 = x + w
    const y1 = y + d
    const z1 = z + h
    return (
        <g strokeWidth={0.8} strokeLinejoin="round" style={{ stroke: LINE }}>
            <polygon
                points={pts([
                    [x, y1, z],
                    [x1, y1, z],
                    [x1, y1, z1],
                    [x, y1, z1],
                ])}
                style={{ fill: FACE_L }}
            />
            <polygon
                points={pts([
                    [x1, y, z],
                    [x1, y1, z],
                    [x1, y1, z1],
                    [x1, y, z1],
                ])}
                style={{ fill: FACE_R }}
            />
            <polygon
                points={pts([
                    [x, y, z1],
                    [x1, y, z1],
                    [x1, y1, z1],
                    [x, y1, z1],
                ])}
                style={{ fill: top }}
            />
            {grill &&
                [0.25, 0.4, 0.55].map((f) => (
                    <polyline
                        key={f}
                        points={pts([
                            [x1, y + d * 0.2, z + h * f],
                            [x1, y + d * 0.8, z + h * f],
                        ])}
                        fill="none"
                    />
                ))}
            {grill && (
                <polygon
                    points={pts([
                        [x1, y + d * 0.2, z + h * 0.68],
                        [x1, y + d * 0.8, z + h * 0.68],
                        [x1, y + d * 0.8, z + h * 0.86],
                        [x1, y + d * 0.2, z + h * 0.86],
                    ])}
                    fill="none"
                />
            )}
        </g>
    )
}

// a little round lamp sitting on a top face
function Lamp({ at, r = 0.34, color }: { at: P3; r?: number; color: string }) {
    const [sx, sy] = iso(at)
    const rx = r * S * 1.22
    const ry = r * S * 0.71
    const hgt = 0.28 * S
    return (
        <g strokeWidth={0.8} style={{ stroke: LINE }}>
            <path
                d={`M${sx - rx} ${sy} v${-hgt} A${rx} ${ry} 0 0 0 ${sx + rx} ${sy - hgt} v${hgt} A${rx} ${ry} 0 0 1 ${sx - rx} ${sy} Z`}
                style={{ fill: color, filter: 'brightness(0.82)' }}
            />
            <ellipse
                cx={sx}
                cy={sy - hgt}
                rx={rx}
                ry={ry}
                style={{ fill: color }}
            />
        </g>
    )
}

// a tube: dark outline, light body, thin highlight
function Pipe({
    ps,
    active,
    tone = 'var(--rd-orange)',
}: {
    ps: P3[]
    active?: boolean
    tone?: string
}) {
    const d = pathD(ps)
    return (
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d={d} strokeWidth={7} style={{ stroke: LINE }} />
            <path
                d={d}
                strokeWidth={5.4}
                style={{ stroke: 'var(--rd-surface)' }}
            />
            <path
                d={d}
                strokeWidth={active ? 1.8 : 1}
                style={{
                    stroke: active ? tone : 'var(--rd-border-2)',
                    transition: 'stroke .3s',
                }}
            />
        </g>
    )
}

// round joint (and a support post when it floats over the plate)
function Joint({ at, post }: { at: P3; post?: boolean }) {
    const [sx, sy] = iso(at)
    const rx = 0.32 * S * 1.22
    const ry = 0.32 * S * 0.71
    const [, gy] = iso([at[0], at[1], 0])
    return (
        <g strokeWidth={0.8} style={{ stroke: LINE }}>
            {post && (
                <rect
                    x={sx - 2}
                    y={sy}
                    width={4}
                    height={gy - sy}
                    style={{ fill: FACE_R }}
                />
            )}
            <path
                d={`M${sx - rx} ${sy + 3} v-5 A${rx} ${ry} 0 0 1 ${sx + rx} ${sy - 2} v5 A${rx} ${ry} 0 0 1 ${sx - rx} ${sy + 3} Z`}
                style={{ fill: FACE_L }}
            />
            <ellipse
                cx={sx}
                cy={sy - 2}
                rx={rx}
                ry={ry}
                style={{ fill: 'var(--rd-surface)' }}
            />
        </g>
    )
}

/* ----------------------------------------------------------------- figure */

type Step = 0 | 1 | 2 | 3 | 4 // 0 = idle before the first step

export function EcosystemFigure() {
    const [tour, setTour] = useState(0)
    const [step, setStep] = useState<Step>(0)
    const [outage, setOutage] = useState(false)
    const [still, setStill] = useState(false)
    const ballRef = useRef<SVGCircleElement>(null)
    const routeRef = useRef<SVGPathElement>(null)
    const runRef = useRef(0)

    const site = SITES.find((s) => s.id === TOURS[tour % TOURS.length])!
    const api = APIS.find((a) => a.id === site.api)

    // the whole route as one polyline, plus where each step ends along it
    const route = useMemo(() => {
        const legs: P3[][] = [
            INGRESS,
            TO_SLAB,
            stubOf(site),
            outage ? [] : (site.lane ?? []),
        ]
        return legs
    }, [site, outage])
    const routeD = useMemo(() => pathD(route.flat()), [route])

    const STEPS = [
        `You open ${site.id === 'home' ? 'hovanhoa.net' : `${site.id}.hovanhoa.net`}`,
        'Cloudflare resolves the domain to Vercel',
        outage ? 'The site is down and answers 503' : 'Vercel serves the site',
        outage
            ? 'status.hovanhoa.net flags it as down'
            : `The site pulls live data from ${api?.label}`,
    ]

    useEffect(() => {
        setStill(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    }, [])

    const play = useCallback(() => {
        const run = ++runRef.current
        const path = routeRef.current
        const ball = ballRef.current
        if (!path || !ball) return
        // cumulative lengths at the end of each leg
        const ends: number[] = []
        let acc = 0
        const tmp = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path'
        )
        let prev: P3 | null = null
        for (const leg of route) {
            for (const p of leg) {
                if (prev) {
                    tmp.setAttribute('d', pathD([prev, p]))
                    acc += tmp.getTotalLength()
                }
                prev = p
            }
            ends.push(acc)
        }
        const total = path.getTotalLength()
        if (still) {
            const pt = path.getPointAtLength(total)
            ball.setAttribute('cx', `${pt.x}`)
            ball.setAttribute('cy', `${pt.y}`)
            setStep(4)
            return
        }
        const speed = 0.11 // px per ms
        const pause = 450
        let leg = 0
        let from = 0
        let t0 = performance.now()
        setStep(1)
        const tick = (now: number) => {
            if (run !== runRef.current) return
            const to = ends[leg]
            const dur = Math.max(1, (to - from) / speed)
            const k = Math.min(1, (now - t0) / dur)
            const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2
            const pt = path.getPointAtLength(from + (to - from) * e)
            ball.setAttribute('cx', `${pt.x}`)
            ball.setAttribute('cy', `${pt.y - 1}`)
            if (k < 1) return requestAnimationFrame(tick)
            if (leg < ends.length - 1) {
                setTimeout(() => {
                    if (run !== runRef.current) return
                    from = to
                    leg++
                    t0 = performance.now()
                    setStep((leg + 1) as Step)
                    requestAnimationFrame(tick)
                }, pause)
            }
        }
        requestAnimationFrame(tick)
    }, [route, still])

    // start when the figure scrolls into view, and again on every change
    const figRef = useRef<HTMLDivElement>(null)
    const [seen, setSeen] = useState(false)
    useEffect(() => {
        const el = figRef.current
        if (!el) return
        const io = new IntersectionObserver(
            ([e]) => e.isIntersecting && setSeen(true),
            { threshold: 0.35 }
        )
        io.observe(el)
        return () => io.disconnect()
    }, [])
    useEffect(() => {
        if (seen) play()
        return () => {
            runRef.current++
        }
    }, [seen, play])

    const hostOf = (s: Site) =>
        s.id === 'home' ? 'hovanhoa.net' : `${s.id}.hovanhoa.net`
    const lit = (n: number) => step >= n
    const down = outage && step >= 3

    // painter's order: things further back (smaller x + y) first
    const boxes = [
        ...SITES.map((s) => ({
            key: s.id,
            depth: s.x + s.y,
            kind: 'site' as const,
            s,
        })),
        ...APIS.map((a) => ({
            key: a.id,
            depth: 27 + a.y,
            kind: 'api' as const,
            a,
        })),
    ].sort((p, q) => p.depth - q.depth)

    const statusSite = SITES.find((s) => s.id === 'status')!

    return (
        <div
            ref={figRef}
            className="overflow-hidden rounded-[var(--rd-r-lg)] border border-[var(--rd-border)] bg-[var(--rd-surface)]"
        >
            <div className="flex items-center justify-between gap-4 px-4 pt-3 font-[family-name:var(--font-mono)] text-[11px] text-[var(--rd-text-3)]">
                <span>Fig. 1</span>
                <span className="truncate">GET {hostOf(site)}</span>
            </div>

            <div className="overflow-x-auto">
                <svg
                    viewBox="40 36 775 470"
                    role="img"
                    aria-label={`Isometric model of the hovanhoa.net family: a request goes from you through Cloudflare and Vercel to ${hostOf(site)}${api ? ` and on to ${api.label}` : ''}.`}
                    className="block h-auto w-full min-w-[560px]"
                >
                    {/* base plate + vercel slab */}
                    <Prism x={-0.5} y={-1} w={31} d={16.4} h={0.5} z={-0.5} />
                    <polyline
                        points={pts([
                            [0.5, 15.2, 0],
                            [29.5, 15.2, 0],
                        ])}
                        strokeDasharray="1 5"
                        style={{ stroke: LINE }}
                    />
                    <Prism
                        x={9.6}
                        y={0.2}
                        w={13.4}
                        d={12.7}
                        h={0.5}
                        top="var(--rd-bg-sub)"
                    />

                    {/* pipes */}
                    <Pipe ps={INGRESS} active={lit(1)} />
                    <Pipe ps={TO_SLAB} active={lit(2)} />
                    <Pipe
                        ps={[
                            [9.6, BUS_Y, PZ],
                            [c(3), BUS_Y, PZ],
                        ]}
                        active={lit(3)}
                    />
                    {SITES.map((s) => (
                        <Pipe
                            key={`stub-${s.id}`}
                            ps={stubOf(s).slice(1)}
                            active={lit(3) && s.id === site.id}
                            tone={down ? 'var(--rd-down)' : undefined}
                        />
                    ))}
                    {SITES.filter((s) => s.lane).map((s) => (
                        <Pipe
                            key={`lane-${s.id}`}
                            ps={s.lane!}
                            active={lit(4) && !outage && s.id === site.id}
                        />
                    ))}
                    {SITES.filter((s) => s.lane).flatMap((s) =>
                        s
                            .lane!.slice(1, -1)
                            .map((p, i) => (
                                <Joint
                                    key={`j-${s.id}-${i}`}
                                    at={p}
                                    post={p[0] > 23}
                                />
                            ))
                    )}
                    <Joint at={[9.6, BUS_Y, PZ]} />

                    {/* status watching the downed site */}
                    {down && step >= 4 && (
                        <path
                            d={pathD([
                                [
                                    statusSite.x + BOX / 2,
                                    statusSite.y + BOX / 2,
                                    1.9,
                                ],
                                [site.x + BOX / 2, site.y + BOX / 2, 1.9],
                            ])}
                            fill="none"
                            strokeWidth={1.4}
                            strokeDasharray="4 3"
                            style={{ stroke: 'var(--rd-down)' }}
                        />
                    )}

                    {/* visitor + cloudflare */}
                    <Prism x={1} y={BUS_Y - 1} w={2} d={2} h={1.3} />
                    <Lamp at={[2, BUS_Y, 1.3]} color="var(--rd-orange)" />
                    <Label at={iso([1, BUS_Y + 1, 0])} dx={-8} anchor="end">
                        you
                    </Label>
                    <Prism x={5} y={BUS_Y - 1.5} w={3} d={3} h={1.6} grill />
                    <Label at={iso([5, BUS_Y - 1.5, 1.6])} dy={-8} bold>
                        cloudflare
                    </Label>

                    {boxes.map((b) =>
                        b.kind === 'site' ? (
                            <SiteBox
                                key={b.key}
                                s={b.s}
                                target={b.s.id === site.id}
                                lit={lit(3)}
                                down={down && b.s.id === site.id}
                                alarm={b.s.id === 'status' && down && step >= 4}
                            />
                        ) : (
                            <ApiBox
                                key={b.key}
                                a={b.a}
                                active={
                                    lit(4) && !outage && b.a.id === site.api
                                }
                            />
                        )
                    )}

                    {/* labels last, so no box covers them */}
                    <Label at={iso([9.6, 12.9, 0])} dx={6} dy={18} bold>
                        vercel
                    </Label>
                    {SITES.map((s) => {
                        const target = s.id === site.id
                        const isDown = down && target
                        return (
                            <Label
                                key={`l-${s.id}`}
                                at={iso([s.x + BOX / 2, s.y + BOX / 2, 1.4])}
                                dy={-17}
                                anchor="middle"
                                bold={target}
                                tone={isDown ? 'var(--rd-down)' : undefined}
                            >
                                {s.label}
                                {isDown ? ' 503' : ''}
                            </Label>
                        )
                    })}
                    {APIS.map((a) => {
                        const active = lit(4) && !outage && a.id === site.api
                        return (
                            <g key={`l-${a.id}`}>
                                <Label
                                    at={iso([29.2, a.y, 2.4])}
                                    dx={8}
                                    dy={10}
                                    bold={active}
                                >
                                    {a.label}
                                </Label>
                                {active && (
                                    <Label
                                        at={iso([29.2, a.y, 2.4])}
                                        dx={8}
                                        dy={24}
                                        tone="var(--rd-orange)"
                                    >
                                        200
                                    </Label>
                                )}
                            </g>
                        )
                    })}

                    {/* the request */}
                    <path ref={routeRef} d={routeD} fill="none" stroke="none" />
                    <circle
                        ref={ballRef}
                        r={5}
                        cx={iso(INGRESS[0])[0]}
                        cy={iso(INGRESS[0])[1]}
                        strokeWidth={0.8}
                        style={{
                            fill:
                                down && step >= 3
                                    ? 'var(--rd-down)'
                                    : 'var(--rd-orange)',
                            stroke: LINE,
                        }}
                    />
                </svg>
            </div>

            <ol className="grid grid-cols-1 gap-x-6 gap-y-2 border-t border-[var(--rd-border)] px-4 py-3 text-[13px] sm:grid-cols-2 lg:grid-cols-4">
                {STEPS.map((t, i) => (
                    <li
                        key={i}
                        className="flex gap-2"
                        style={{
                            color:
                                step === i + 1
                                    ? 'var(--rd-text)'
                                    : 'var(--rd-text-3)',
                            transition: 'color .25s',
                        }}
                    >
                        <span
                            className="font-[family-name:var(--font-mono)] tabular-nums"
                            style={{
                                color:
                                    step === i + 1
                                        ? outage && i >= 2
                                            ? 'var(--rd-down)'
                                            : 'var(--rd-orange)'
                                        : undefined,
                            }}
                        >
                            {i + 1}
                        </span>
                        {t}
                    </li>
                ))}
            </ol>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[var(--rd-border)] px-4 py-2.5 text-[12px] text-[var(--rd-text-2)]">
                <button
                    type="button"
                    onClick={() => setTour((t) => t + 1)}
                    className="rounded-full border border-[var(--rd-border-2)] px-3 py-1 hover:border-[var(--rd-text-3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--rd-orange)]"
                >
                    Replay
                </button>
                <label className="flex cursor-pointer items-center gap-2">
                    <input
                        id="eco-outage"
                        type="checkbox"
                        checked={outage}
                        onChange={(e) => setOutage(e.target.checked)}
                        className="h-3.5 w-3.5 accent-[var(--rd-orange)]"
                    />
                    Simulate outage
                </label>
                <span className="ml-auto hidden font-[family-name:var(--font-mono)] text-[11px] text-[var(--rd-text-3)] md:inline">
                    you → cloudflare → vercel → {site.id}
                    {!outage && api ? ` → ${api.id}` : ''}
                </span>
            </div>
        </div>
    )
}

function Label({
    at,
    dx = 0,
    dy = 0,
    anchor = 'start',
    bold,
    tone,
    children,
}: {
    at: [number, number]
    dx?: number
    dy?: number
    anchor?: 'start' | 'middle' | 'end'
    bold?: boolean
    tone?: string
    children: React.ReactNode
}) {
    // a halo in the surface colour keeps text legible over lines and boxes
    return (
        <text
            x={at[0] + dx}
            y={at[1] + dy}
            textAnchor={anchor}
            strokeWidth={3.5}
            strokeLinejoin="round"
            paintOrder="stroke"
            className={`pointer-events-none font-[family-name:var(--font-mono)] text-[11px] ${bold ? 'font-semibold' : ''}`}
            style={{
                fill: tone ?? (bold ? 'var(--rd-text)' : 'var(--rd-text-2)'),
                stroke: 'var(--rd-surface)',
            }}
        >
            {children}
        </text>
    )
}

function SiteBox({
    s,
    target,
    lit,
    down,
    alarm,
}: {
    s: Site
    target: boolean
    lit: boolean
    down: boolean
    alarm: boolean
}) {
    const lamp = down
        ? 'var(--rd-down)'
        : alarm
          ? 'var(--rd-down)'
          : target && lit
            ? 'var(--rd-orange)'
            : 'var(--rd-ok)'
    return (
        <a
            href={s.href}
            aria-label={
                s.label === 'hovanhoa.net'
                    ? 'hovanhoa.net'
                    : `${s.label}.hovanhoa.net`
            }
            className="focus-visible:outline-none [&:focus-visible_text]:underline"
        >
            <Prism x={s.x} y={s.y} w={BOX} d={BOX} h={1.4} />
            <Lamp
                at={[s.x + BOX / 2, s.y + BOX / 2, 1.4]}
                r={0.26}
                color={lamp}
            />
        </a>
    )
}

function ApiBox({ a, active }: { a: (typeof APIS)[number]; active: boolean }) {
    return (
        <g>
            <Prism x={27} y={a.y} w={2.2} d={2} h={2.4} grill />
            <Lamp
                at={[28.1, a.y + 1, 2.4]}
                r={0.3}
                color={active ? 'var(--rd-orange)' : 'var(--rd-border-2)'}
            />
        </g>
    )
}

export default EcosystemFigure
