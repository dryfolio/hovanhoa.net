'use client'

import { useMemo, useState } from 'react'

export type LsEntry = {
    name: string // the short path / key, shown in mono
    desc?: string // human description
    href: string
    external?: boolean
}

export type LsGroup = { title: string; items: LsEntry[] }

function displayHref(href: string) {
    return href.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

function SearchIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    )
}

function ListIcon() {
    return (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
    )
}

function GridIcon() {
    return (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
    )
}

function Chevron() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[var(--rd-text-4)] transition-colors group-hover:text-[var(--rd-orange-ink)]"
        >
            <path d="m9 18 6-6-6-6" />
        </svg>
    )
}

function ext(e: LsEntry) {
    return e.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
}

function Row({ e }: { e: LsEntry }) {
    return (
        <a
            href={e.href}
            {...ext(e)}
            className="group flex items-center gap-4 border-b border-[var(--rd-line)] px-2 py-3.5 transition-colors hover:bg-[var(--rd-surface-2)]"
        >
            <span className="w-28 shrink-0 truncate font-[family-name:var(--font-mono)] text-[13.5px] font-medium text-[var(--rd-text)] sm:w-40">
                {e.name}
            </span>
            <span className="hidden flex-1 truncate text-[13.5px] text-[var(--rd-text-2)] sm:block">
                {e.desc || '—'}
            </span>
            <span className="ml-auto hidden truncate font-[family-name:var(--font-mono)] text-[12.5px] text-[var(--rd-text-3)] md:block md:max-w-[34ch]">
                {displayHref(e.href)}
            </span>
            <Chevron />
        </a>
    )
}

function Card({ e }: { e: LsEntry }) {
    return (
        <a
            href={e.href}
            {...ext(e)}
            className="group flex flex-col rounded-[var(--rd-r)] border border-[var(--rd-border)] bg-[var(--rd-surface)] p-4 transition-colors hover:border-[var(--rd-border-2)] hover:bg-[var(--rd-surface-2)]"
        >
            <span className="flex items-center justify-between gap-2 font-[family-name:var(--font-mono)] text-[13.5px] font-medium text-[var(--rd-text)] group-hover:text-[var(--rd-orange-ink)]">
                <span className="truncate">{e.name}</span>
                <Chevron />
            </span>
            <span className="mt-1.5 line-clamp-2 text-[13px] text-[var(--rd-text-2)]">
                {e.desc || '—'}
            </span>
            <span className="mt-3 truncate font-[family-name:var(--font-mono)] text-[11.5px] text-[var(--rd-text-3)]">
                {displayHref(e.href)}
            </span>
        </a>
    )
}

export default function LsDirectory({
    groups,
    total,
}: {
    groups: LsGroup[]
    total: number
}) {
    const [query, setQuery] = useState('')
    const [view, setView] = useState<'list' | 'grid'>('list')

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return groups
        return groups
            .map((g) => ({
                ...g,
                items: g.items.filter((e) =>
                    `${e.name} ${e.desc ?? ''} ${e.href}`
                        .toLowerCase()
                        .includes(q)
                ),
            }))
            .filter((g) => g.items.length > 0)
    }, [groups, query])

    const shown = filtered.reduce((n, g) => n + g.items.length, 0)
    const q = query.trim()

    return (
        <div>
            {/* controls */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--rd-text-3)]">
                        <SearchIcon />
                    </span>
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="search the directory…"
                        aria-label="Search the directory"
                        className="w-full rounded-[var(--rd-r)] border border-[var(--rd-border)] bg-[var(--rd-surface)] py-2.5 pl-11 pr-4 font-[family-name:var(--font-mono)] text-[14px] text-[var(--rd-text)] placeholder:text-[var(--rd-text-3)] transition-colors focus:border-[var(--rd-orange)] focus:outline-none focus:ring-2 focus:ring-[var(--rd-orange-bg)]"
                    />
                </div>
                <div
                    role="group"
                    aria-label="View mode"
                    className="flex shrink-0 rounded-[var(--rd-r)] border border-[var(--rd-border)] bg-[var(--rd-surface)] p-1"
                >
                    {(['list', 'grid'] as const).map((v) => (
                        <button
                            key={v}
                            type="button"
                            onClick={() => setView(v)}
                            aria-label={`${v} view`}
                            aria-pressed={view === v}
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-[var(--rd-r-sm)] transition-colors ${
                                view === v
                                    ? 'bg-[var(--rd-surface-2)] text-[var(--rd-text)]'
                                    : 'text-[var(--rd-text-3)] hover:text-[var(--rd-text)]'
                            }`}
                        >
                            {v === 'list' ? <ListIcon /> : <GridIcon />}
                        </button>
                    ))}
                </div>
            </div>

            {/* count line */}
            <p className="mt-5 font-[family-name:var(--font-mono)] text-[12.5px] text-[var(--rd-text-3)]">
                {q
                    ? `${shown} of ${total} ${total === 1 ? 'link' : 'links'} match “${q}”`
                    : `showing all ${total} links`}
            </p>

            {/* groups */}
            <div className="mt-6 space-y-10">
                {filtered.map((g) => (
                    <section key={g.title}>
                        <h2 className="rd-eyebrow mb-1 flex items-center gap-2 text-[11px]">
                            {g.title}
                            <span className="text-[var(--rd-text-4)]">
                                {g.items.length}
                            </span>
                        </h2>
                        {view === 'list' ? (
                            <div className="border-t border-[var(--rd-line)]">
                                {g.items.map((e) => (
                                    <Row key={e.name + e.href} e={e} />
                                ))}
                            </div>
                        ) : (
                            <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
                                {g.items.map((e) => (
                                    <Card key={e.name + e.href} e={e} />
                                ))}
                            </div>
                        )}
                    </section>
                ))}

                {shown === 0 && (
                    <p className="font-[family-name:var(--font-mono)] text-sm text-[var(--rd-text-3)]">
                        nothing matches{' '}
                        <span className="text-[var(--rd-orange-ink)]">
                            “{q}”
                        </span>
                        .
                    </p>
                )}
            </div>
        </div>
    )
}
