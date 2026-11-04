import Hero from '@/components/hero'
import { BlogBento } from '@/components/blog-bento'
import { type PostExcerpt } from '@/lib/types'
import { FamilyShowcase } from '@/components/family-showcase'
import { SectionHead, sectionLink } from '@/components/section-head'
import EcosystemGraph from '@/components/redesign/ecosystem-graph-lazy'
import { Sparkline } from '@/components/redesign/sparkline'
import { formatNumber, computeTrend } from '@/lib/utils'

import { Metadata } from 'next'
import {
    BASE_URL,
    BLOG_URL,
    NAME,
    FULL_NAME,
    ROLE,
    IMAGE,
    TWITTER,
    GITHUB,
    LINKEDIN,
    INSIGHT_URL,
    STATUS_URL,
} from '@/constants'

const WAKA_CODING =
    'https://wakatime.com/share/@hovanhoa/0d76f73e-d398-4c07-9bc6-781f52986fd8.json'

const SECTION =
    'mx-auto max-w-[var(--rd-maxw)] px-[var(--rd-pad)] py-[clamp(48px,6vw,80px)]'

const OG_IMAGE = `${BASE_URL}/api/og?title=${encodeURIComponent(NAME)}`

export const metadata: Metadata = {
    title: NAME,
    description: `${FULL_NAME} — software engineer writing about backend systems, microservices, and AI agents.`,
    keywords: [
        FULL_NAME,
        'Hồ Văn Hòa',
        NAME,
        'hovanhoa',
        ROLE,
        'Software Engineer',
        'Developer',
        'Blog',
        'Tech Blog',
        'Vietnam Developer',
    ],
    authors: [{ name: FULL_NAME }],
    openGraph: {
        title: NAME,
        description: `${FULL_NAME} — software engineer writing about backend systems, microservices, and AI agents.`,
        url: BASE_URL,
        siteName: NAME,
        images: [
            {
                url: OG_IMAGE,
                width: 800,
                height: 418,
                alt: FULL_NAME,
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: NAME,
        description: `${FULL_NAME} — software engineer writing about backend systems, microservices, and AI agents.`,
        creator: '@_hovanhoa_',
        images: [OG_IMAGE],
    },
    alternates: {
        canonical: BASE_URL,
    },
}

export default async function Home() {
    // latest posts — pulled from blog.hovanhoa.net's own feed, same pattern
    // as the WakaTime/status fetches below
    let feedPosts: PostExcerpt[] = []
    let totalPosts: number | null = null
    try {
        const res = await fetch(`${BLOG_URL}/api/feed.json?limit=5`, {
            next: { revalidate: 3600 },
        })
        const data: { total: number; posts: PostExcerpt[] } = await res.json()
        feedPosts = data.posts ?? []
        totalPosts = data.total ?? null
    } catch {
        // ignore — bento quietly disappears, stat tile falls back below
    }

    // coding hours — pulled live from WakaTime (real chart, the "insight" metric)
    let coding: {
        hours: number
        spark: number[]
        trend: string
        avg: number
    } | null = null
    try {
        const res = await fetch(WAKA_CODING, { next: { revalidate: 86400 } })
        const data: { grand_total: { total_seconds: number } }[] =
            (await res.json())?.data ?? []
        const spark = data.map(
            (x) => (x.grand_total?.total_seconds ?? 0) / 3600
        )
        const hours = spark.reduce((a, b) => a + b, 0)
        const active = spark.filter((h) => h > 0).length
        if (hours > 0)
            coding = {
                hours,
                spark,
                trend: computeTrend(spark),
                avg: active ? hours / active : 0,
            }
    } catch {
        // ignore — falls back to a static tile
    }

    // heartbeat — how many monitored services are currently up (status page logs)
    let heartbeat: { up: number; total: number } | null = null
    try {
        const RAW =
            'https://raw.githubusercontent.com/dryfolio/status.hovanhoa.net/main/public'
        const cfg = await (
            await fetch(`${RAW}/urls.cfg`, { next: { revalidate: 3600 } })
        ).text()
        const keys = cfg
            .split('\n')
            .map((l) => l.split('=')[0].trim())
            .filter(Boolean)
        const ups = await Promise.all(
            keys.map(async (key) => {
                try {
                    const txt = await (
                        await fetch(`${RAW}/status/${key}_report.log`, {
                            next: { revalidate: 3600 },
                        })
                    ).text()
                    const lines = txt.trim().split('\n').filter(Boolean)
                    return /,\s*success/i.test(lines[lines.length - 1] || '')
                } catch {
                    return false
                }
            })
        )
        if (keys.length)
            heartbeat = { up: ups.filter(Boolean).length, total: keys.length }
    } catch {
        // ignore
    }

    // live numbers from around the family — each row degrades to a static
    // fallback when its source is unreachable
    const glance: {
        k: string
        v: string
        sub: string
        href?: string
        dot?: boolean
        spark?: number[]
        trend?: string
    }[] = [
        {
            k: 'writing',
            v: totalPosts !== null ? String(totalPosts) : '—',
            sub: 'blog posts',
            href: BLOG_URL,
        },
        coding
            ? {
                  k: 'coding',
                  v: `${formatNumber(coding.hours)}h`,
                  sub: `${formatNumber(coding.avg)}h / active day`,
                  href: INSIGHT_URL,
                  spark: coding.spark,
                  trend: coding.trend,
              }
            : {
                  k: 'coding',
                  v: '4+',
                  sub: 'years shipping',
                  href: INSIGHT_URL,
              },
        heartbeat
            ? {
                  k: 'heartbeat',
                  v: `${heartbeat.up}/${heartbeat.total}`,
                  sub: 'services live',
                  href: STATUS_URL,
                  dot: true,
              }
            : { k: 'shipping', v: '7', sub: 'live sites', href: STATUS_URL },
        { k: 'backend', v: 'go · py', sub: 'services at scale' },
    ]

    const glanceCard = (
        <div className="overflow-hidden rounded-[var(--rd-r-lg)] border border-[var(--rd-border)] bg-[var(--rd-surface)]">
            <div className="flex items-center justify-between border-b border-[var(--rd-line)] px-[1.15rem] py-2.5 text-[0.7rem] font-medium uppercase tracking-[0.08em] text-[var(--rd-text-3)]">
                <span>At a glance</span>
                <a
                    href={INSIGHT_URL}
                    className={`${sectionLink} normal-case tracking-normal`}
                >
                    insight →
                </a>
            </div>
            <ul className="m-0 list-none p-0">
                {glance.map((g) => {
                    const up = g.trend?.startsWith('+')
                    const row = (
                        <>
                            <span className="w-20 shrink-0 font-[family-name:var(--font-mono)] text-[0.72rem] text-[var(--rd-text-3)]">
                                {g.k}
                            </span>
                            <span className="flex min-w-0 flex-1 items-center gap-2">
                                {g.dot && (
                                    <span className="inline-block h-2 w-2 shrink-0 animate-pulse rounded-full bg-[var(--rd-ok)] motion-reduce:animate-none" />
                                )}
                                <span className="text-[0.95rem] font-medium tracking-[-0.02em] text-[var(--rd-text)]">
                                    {g.v}
                                </span>
                                <span className="truncate text-[0.8rem] text-[var(--rd-text-2)]">
                                    {g.sub}
                                </span>
                            </span>
                            {g.spark && (
                                <span className="hidden w-16 shrink-0 sm:block">
                                    <Sparkline
                                        data={g.spark}
                                        h={18}
                                        stroke="var(--rd-orange)"
                                    />
                                </span>
                            )}
                            {g.trend && (
                                <span
                                    className={`shrink-0 font-[family-name:var(--font-mono)] text-[0.68rem] ${
                                        up
                                            ? 'text-[var(--rd-orange-ink)]'
                                            : 'text-[var(--rd-text-3)]'
                                    }`}
                                >
                                    {g.trend}
                                </span>
                            )}
                        </>
                    )
                    const rowClass =
                        'flex items-center gap-3 border-b border-[var(--rd-line)] px-[1.15rem] py-2.5'
                    return (
                        <li key={g.k} className="[&:last-child>*]:border-b-0">
                            {g.href ? (
                                <a
                                    href={g.href}
                                    className={`${rowClass} transition-colors hover:bg-[var(--rd-surface-2)]`}
                                >
                                    {row}
                                </a>
                            ) : (
                                <div className={rowClass}>{row}</div>
                            )}
                        </li>
                    )
                })}
            </ul>
        </div>
    )

    return (
        <main className="relative min-h-screen bg-[var(--rd-bg)] text-[var(--rd-text)]">
            <script
                type="application/ld+json"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Person',
                        name: FULL_NAME,
                        alternateName: NAME,
                        url: BASE_URL,
                        jobTitle: ROLE,
                        image: `${BASE_URL}${IMAGE}`,
                        sameAs: [
                            `https://twitter.com/${TWITTER}`,
                            `https://github.com/${GITHUB}`,
                            `https://linkedin.com/in/${LINKEDIN}`,
                        ],
                    }),
                }}
            />
            <Hero />

            <section className="mx-auto max-w-[var(--rd-maxw)] px-[var(--rd-pad)] pb-[clamp(48px,6vw,80px)] pt-[clamp(1rem,3vw,2rem)]">
                <FamilyShowcase />
            </section>

            <section id="blog" className={`${SECTION} scroll-mt-20`}>
                <SectionHead
                    title="From the blog"
                    links={[{ label: 'blog.hovanhoa.net', href: BLOG_URL }]}
                />
                <BlogBento posts={feedPosts} aside={glanceCard} />
            </section>

            <section className={SECTION}>
                <SectionHead
                    title="How it fits together"
                    links={[{ label: 'status.hovanhoa.net', href: STATUS_URL }]}
                >
                    <p className="m-0 mt-2 max-w-[58ch] text-[0.95rem] leading-[1.6] text-[var(--rd-text-2)]">
                        The sites in the family and the services they run on.
                    </p>
                </SectionHead>
                <div className="overflow-hidden rounded-[var(--rd-r-lg)] border border-[var(--rd-border)] bg-[var(--rd-surface)] p-2">
                    <EcosystemGraph compact />
                </div>
            </section>
        </main>
    )
}
