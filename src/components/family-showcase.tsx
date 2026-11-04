'use client'

import { type CSSProperties, useEffect, useState } from 'react'
import {
    RiBookOpenLine,
    RiBookShelfLine,
    RiImageLine,
    RiMusic2Line,
    RiPulseLine,
    RiServerLine,
    type RemixiconComponentType,
} from '@remixicon/react'
import {
    BASE_URL,
    BLOG_URL,
    BOOK_URL,
    GALLERY_URL,
    INSIGHT_URL,
    MUSIC_URL,
    STATUS_URL,
} from '@/constants'
import { sectionLink } from '@/components/section-head'

const STEP_MS = 5200

type FamilyApp = {
    name: string
    tag: string
    desc: string
    href: string
    tone: string
    icon: RemixiconComponentType
}

// Every site in the *.hovanhoa.net family — the closest thing to
// "selected work" this home page has. Tones stay muted on purpose.
const FAMILY: FamilyApp[] = [
    {
        name: 'blog',
        tag: 'Writing',
        desc: 'Notes on software engineering, distributed systems, and lessons from building things.',
        href: BLOG_URL,
        tone: '#b8734a',
        icon: RiBookOpenLine,
    },
    {
        name: 'insight',
        tag: 'Data',
        desc: 'Coding activity pulled live from WakaTime — hours, languages, and trends.',
        href: INSIGHT_URL,
        tone: '#4a6d92',
        icon: RiPulseLine,
    },
    {
        name: 'gallery',
        tag: 'Photos',
        desc: 'Photography — the things worth stopping for.',
        href: GALLERY_URL,
        tone: '#7a4560',
        icon: RiImageLine,
    },
    {
        name: 'music',
        tag: 'Audio',
        desc: "What's on repeat right now.",
        href: MUSIC_URL,
        tone: '#6b5ca5',
        icon: RiMusic2Line,
    },
    {
        name: 'book',
        tag: 'Reading',
        desc: 'The reading list — finished, in progress, and next up.',
        href: BOOK_URL,
        tone: '#2f6a4c',
        icon: RiBookShelfLine,
    },
    {
        name: 'status',
        tag: 'Infra',
        desc: 'Uptime for every service in the family, checked around the clock.',
        href: STATUS_URL,
        tone: '#5c6b73',
        icon: RiServerLine,
    },
]

function host(href: string) {
    return href.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

function dither(tone: string) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><circle cx="1.2" cy="2" r=".7" fill="${tone}"/><circle cx="5" cy="5.2" r=".55" fill="${tone}" opacity=".7"/><circle cx="4.5" cy="1.2" r=".45" fill="${tone}" opacity=".5"/></svg>`
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

function ArrowUpRight({ size = 15 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
        >
            <path d="M7 17 17 7" />
            <path d="M7 7h10v10" />
        </svg>
    )
}

export function FamilyShowcase() {
    const [active, setActive] = useState(0)
    const [paused, setPaused] = useState(false)
    const [tick, setTick] = useState(0)

    useEffect(() => {
        if (paused) return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
            return
        const id = window.setTimeout(() => {
            setActive((i) => (i + 1) % FAMILY.length)
            setTick((t) => t + 1)
        }, STEP_MS)
        return () => window.clearTimeout(id)
    }, [active, paused, tick])

    const select = (i: number) => {
        setActive(i)
        setTick((t) => t + 1)
    }

    const current = FAMILY[active]
    const CurrentIcon = current.icon

    return (
        <div
            className="grid items-start gap-[clamp(1.25rem,2.5vw,2rem)] max-[899px]:grid-cols-1 min-[900px]:grid-cols-[minmax(0,min(22rem,40%))_minmax(0,1fr)] min-[900px]:gap-[clamp(1.5rem,3vw,2.25rem)]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => {
                setPaused(false)
                setTick((t) => t + 1)
            }}
        >
            {/* numbered list */}
            <div className="flex min-w-0 flex-col">
                <div className="mb-[0.55rem] flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h2 className="rd-h-sec m-0 text-[var(--rd-text)]">
                        The family
                    </h2>
                    <a href={`${BASE_URL}/ls`} className={sectionLink}>
                        Everything
                        <ArrowUpRight size={13} />
                    </a>
                </div>
                <ol className="m-0 flex list-none flex-col p-0">
                    {FAMILY.map((app, i) => {
                        const isActive = i === active
                        const Icon = app.icon
                        return (
                            <li key={app.name}>
                                <div
                                    role="button"
                                    tabIndex={0}
                                    aria-pressed={isActive}
                                    onClick={() => select(i)}
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === 'Enter' ||
                                            e.key === ' '
                                        ) {
                                            e.preventDefault()
                                            select(i)
                                        }
                                    }}
                                    style={
                                        { '--tone': app.tone } as CSSProperties
                                    }
                                    className="grid w-full cursor-pointer grid-cols-[1.15rem_minmax(0,1fr)] gap-x-[0.55rem] gap-y-[0.2rem] rounded-md py-[0.42rem] text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--rd-text)]"
                                >
                                    <span
                                        aria-hidden
                                        className="pt-[0.28rem] font-[family-name:var(--font-mono)] text-[0.68rem] tracking-[0.04em] text-[var(--tone)]"
                                    >
                                        {i + 1}
                                    </span>
                                    <span className="min-w-0">
                                        <span className="flex min-w-0 items-center justify-between gap-3">
                                            <span className="inline-flex min-w-0 items-center gap-[0.4rem] truncate text-[0.9375rem] font-medium tracking-[-0.02em] text-[var(--rd-text)]">
                                                <Icon
                                                    size={16}
                                                    className="shrink-0 text-[var(--tone)]"
                                                />
                                                {host(app.href)}
                                            </span>
                                            <span className="inline-flex shrink-0 items-center gap-[0.45rem]">
                                                <span className="text-[0.7rem] font-medium uppercase tracking-[0.06em] text-[var(--tone)] opacity-70 max-[640px]:hidden">
                                                    {app.tag}
                                                </span>
                                                <a
                                                    href={app.href}
                                                    aria-label={`Open ${app.name}`}
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                    className="inline-flex h-6 w-6 items-center justify-center rounded text-[var(--tone)] hover:bg-[color-mix(in_srgb,var(--tone)_14%,transparent)]"
                                                >
                                                    <ArrowUpRight />
                                                </a>
                                            </span>
                                        </span>
                                        {isActive && (
                                            <>
                                                <span className="mt-[0.18rem] line-clamp-1 text-[0.8rem] leading-[1.4] text-[var(--rd-text-2)]">
                                                    {app.desc}
                                                </span>
                                                <span
                                                    aria-hidden
                                                    className="mt-[0.4rem] block h-px overflow-hidden bg-[var(--rd-border)]"
                                                >
                                                    <span
                                                        key={`rail-${tick}`}
                                                        className="rd-work-rail block h-full bg-[var(--tone)]"
                                                        style={{
                                                            animationDuration: `${STEP_MS}ms`,
                                                            animationPlayState:
                                                                paused
                                                                    ? 'paused'
                                                                    : 'running',
                                                        }}
                                                    />
                                                </span>
                                            </>
                                        )}
                                    </span>
                                </div>
                            </li>
                        )
                    })}
                </ol>
            </div>

            {/* showcase panel */}
            <div className="relative w-full max-[899px]:order-first min-[900px]:sticky min-[900px]:top-[calc(var(--rd-nav-h)+1rem)]">
                <a
                    key={current.name}
                    href={current.href}
                    style={
                        {
                            '--tone': current.tone,
                            '--dither': dither(current.tone),
                        } as CSSProperties
                    }
                    className="rd-rise group relative grid aspect-[16/10] place-items-center overflow-hidden rounded-[var(--rd-r-lg)] bg-[color-mix(in_srgb,var(--tone)_12%,var(--rd-surface))] outline-none focus-visible:ring-2 focus-visible:ring-[var(--rd-text)]"
                >
                    <span
                        aria-hidden
                        className="absolute inset-0 bg-[image:var(--dither)] bg-repeat opacity-40 [mask-image:radial-gradient(circle_at_70%_30%,black,transparent_75%)]"
                    />
                    <span className="relative flex flex-col items-center gap-3 text-center">
                        <span className="flex h-14 w-14 items-center justify-center rounded-[var(--rd-r)] border border-[color-mix(in_srgb,var(--tone)_35%,transparent)] bg-[var(--rd-surface)] text-[var(--tone)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                            <CurrentIcon size={26} />
                        </span>
                        <span className="font-[family-name:var(--font-display)] text-[clamp(2.2rem,6vw,4rem)] leading-none tracking-[-0.035em] text-[var(--rd-text)]">
                            {current.name}
                        </span>
                        <span className="font-[family-name:var(--font-mono)] text-[0.75rem] text-[var(--rd-text-3)]">
                            {host(current.href)}
                        </span>
                    </span>
                </a>
                <div className="flex flex-col items-start gap-[0.45rem] px-[0.1rem] pt-[0.85rem]">
                    <p className="m-0 line-clamp-3 max-w-[38rem] text-[0.8125rem] leading-[1.45] text-[var(--rd-text-2)]">
                        {current.desc}
                    </p>
                    <a
                        href={current.href}
                        className="inline-flex items-center gap-1 border-b border-[color-mix(in_srgb,var(--rd-text)_28%,transparent)] text-[0.8125rem] font-medium text-[var(--rd-text)] hover:border-[var(--rd-text)]"
                    >
                        Visit {current.name}
                        <ArrowUpRight size={13} />
                    </a>
                </div>
            </div>
        </div>
    )
}

export default FamilyShowcase
