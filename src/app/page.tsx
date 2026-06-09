import Hero from '@/components/hero'
import Navbar from '@/components/nav'
import PostTile from '@/components/post-tile'
import { type PostExcerpt } from '@/lib/types'
import Link from 'next/link'
import { Footer } from '@/components/footer'
import { Eyebrow } from '@/components/redesign/eyebrow'
import { OrbitArt } from '@/components/redesign/orbit-art'
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

                    {/* quiet stats */}
                    <div className="mt-8 font-[family-name:var(--font-mono)] text-xs text-[var(--rd-text-3)]">
                        {totalPosts} posts · 5 apps · based in vietnam
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
