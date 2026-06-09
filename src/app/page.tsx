import Hero from '@/components/hero'
import Navbar from '@/components/nav'
import PostTile from '@/components/post-tile'
import { type PostExcerpt } from '@/lib/types'
import Link from 'next/link'
import { Footer } from '@/components/footer'
import { Eyebrow } from '@/components/redesign/eyebrow'
import { OrbitArt } from '@/components/redesign/orbit-art'
import { Sparkline } from '@/components/redesign/sparkline'
import { formatNumber, computeTrend } from '@/lib/utils'

const WAKA_CODING =
    'https://wakatime.com/share/@hovanhoa/0d76f73e-d398-4c07-9bc6-781f52986fd8.json'
import { unstable_noStore as noStore } from 'next/cache'
import { Posts } from '@/lib/posts'
import { Metadata } from 'next'
import {
    BASE_URL,
    NAME,
    FULL_NAME,
    ROLE,
    IMAGE,
    TWITTER,
    GITHUB,
    LINKEDIN,
    INSIGHT_URL,
    INFO_URL,
} from '@/constants'

export const metadata: Metadata = {
    title: NAME,
    description: `${FULL_NAME} - ${ROLE}. Personal website and blog of ${FULL_NAME}.`,
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
        description: `${FULL_NAME} - ${ROLE}. Personal website and blog of ${FULL_NAME}.`,
        url: BASE_URL,
        siteName: NAME,
        images: [
            {
                url: IMAGE,
                width: 800,
                height: 600,
                alt: FULL_NAME,
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: NAME,
        description: `${FULL_NAME} - ${ROLE}.`,
        creator: '@_hovanhoa_',
        images: [IMAGE],
    },
    alternates: {
        canonical: BASE_URL,
    },
}

export default async function Home() {
    noStore()
    const postsArr: PostExcerpt[] = Posts.getArticles({
        page: 1,
        pageSize: 20,
    })
    const totalPosts = Posts.getAllSlugs().length

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

    const tiles: {
        k: string
        v: string
        sub: string
        dot?: boolean
        spark?: number[]
        trend?: string
    }[] = [
        coding
            ? {
                  k: 'coding',
                  v: `${formatNumber(coding.hours)}h`,
                  sub: `${formatNumber(coding.avg)}h avg / active day`,
                  spark: coding.spark,
                  trend: coding.trend,
              }
            : { k: 'coding', v: '3+', sub: 'years shipping' },
        { k: 'writing', v: String(totalPosts), sub: 'blog posts' },
        { k: 'backend', v: 'go·py', sub: 'services at scale' },
        heartbeat
            ? {
                  k: 'heartbeat',
                  v: `${heartbeat.up}/${heartbeat.total}`,
                  sub: 'services live',
                  dot: true,
              }
            : { k: 'shipping', v: '5', sub: 'live apps' },
    ]

    return (
        <main className="min-h-screen relative">
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
            {/* sticky header */}
            <header className="sticky top-0 z-50 border-b border-[var(--rd-border-2)] bg-[var(--rd-bg-sub)] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                <div className="mx-auto w-full max-w-[var(--rd-maxw)] px-[var(--rd-pad)] py-3">
                    <Navbar />
                </div>
            </header>
            {/* hero — fills the first screen; blog lives below the fold */}
            <div className="flex min-h-screen flex-col border-b border-[var(--rd-border)]">
                <div className="mx-auto w-full max-w-[var(--rd-maxw)] px-[var(--rd-pad)] pb-16 pt-12">
                    <div className="grid items-center gap-10 lg:grid-cols-2">
                        <div>
                            <Hero />

                            {/* action links */}
                            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 font-[family-name:var(--font-mono)] text-sm">
                                <a
                                    href="#blog"
                                    className="inline-flex items-center gap-1.5 font-medium text-[var(--rd-accent-ink)] transition-opacity hover:opacity-80"
                                >
                                    read the blog <span aria-hidden>↓</span>
                                </a>
                                <a
                                    href={`https://github.com/${GITHUB}`}
                                    className="text-[var(--rd-text-3)] transition-colors hover:text-[var(--rd-accent-ink)]"
                                >
                                    github
                                </a>
                                <a
                                    href={INSIGHT_URL}
                                    className="text-[var(--rd-text-3)] transition-colors hover:text-[var(--rd-accent-ink)]"
                                >
                                    insight
                                </a>
                                <a
                                    href={INFO_URL}
                                    className="text-[var(--rd-text-3)] transition-colors hover:text-[var(--rd-accent-ink)]"
                                >
                                    connect
                                </a>
                            </div>
                        </div>
                        <OrbitArt />
                    </div>

                    {/* quiet line */}
                    <div className="mt-8 font-[family-name:var(--font-mono)] text-xs text-[var(--rd-text-3)]">
                        based in vietnam · open to interesting problems
                    </div>

                    {/* themed tiles */}
                    <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--rd-r)] border border-[var(--rd-border)] bg-[var(--rd-border)] sm:grid-cols-4">
                        {tiles.map((t) => {
                            const up = t.trend?.startsWith('+')
                            return (
                                <div
                                    key={t.k}
                                    className="flex min-h-[150px] flex-col bg-[var(--rd-surface)] p-4"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="rd-eyebrow text-[10px]">
                                            {t.k}
                                        </span>
                                        {t.trend && (
                                            <span
                                                className={`font-[family-name:var(--font-mono)] text-[10.5px] ${
                                                    up
                                                        ? 'text-[var(--rd-ok)]'
                                                        : 'text-[var(--rd-text-3)]'
                                                }`}
                                            >
                                                {t.trend}
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-2 flex items-center gap-2 text-[1.5rem] font-semibold lowercase leading-none tracking-[-0.03em] text-[var(--rd-text)]">
                                        {t.dot && (
                                            <span className="inline-block h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-[var(--rd-ok)] motion-reduce:animate-none" />
                                        )}
                                        {t.v}
                                    </div>
                                    {t.spark && (
                                        <div className="mt-3">
                                            <Sparkline data={t.spark} h={26} />
                                        </div>
                                    )}
                                    <div className="mt-auto pt-3 font-[family-name:var(--font-mono)] text-[10.5px] text-[var(--rd-text-3)]">
                                        {t.sub}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            {/* body */}
            <div className="mx-auto max-w-[var(--rd-maxw)] px-[var(--rd-pad)] pt-16">
                <div id="blog" className="mb-12 scroll-mt-8">
                    <Eyebrow>blog</Eyebrow>
                    <h2 className="rd-h-sec mt-3 text-[var(--rd-text)]">
                        latest writing
                    </h2>
                    <p className="rd-lead mt-3">
                        notes on software engineering, distributed systems, and
                        lessons from building things — with the occasional life
                        update in between.
                    </p>
                </div>
                <section className="relative">
                    {postsArr?.map((post: PostExcerpt) => (
                        <Link
                            href={`/${post.slug}`}
                            prefetch={false}
                            key={post.id}
                        >
                            <PostTile post={post} />
                        </Link>
                    ))}
                </section>
            </div>
            <Footer />
        </main>
    )
}
