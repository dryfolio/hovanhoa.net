import Hero from '@/components/hero'
import { BlogBento } from '@/components/blog-bento'
import { type PostExcerpt } from '@/lib/types'
import { FamilyShowcase } from '@/components/family-showcase'
import { SectionHead } from '@/components/section-head'
import EcosystemGraph from '@/components/redesign/ecosystem-graph-lazy'

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
    STATUS_URL,
} from '@/constants'

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
    try {
        const res = await fetch(`${BLOG_URL}/api/feed.json?limit=5`, {
            next: { revalidate: 3600 },
        })
        const data: { posts: PostExcerpt[] } = await res.json()
        feedPosts = data.posts ?? []
    } catch {
        // ignore — the blog section quietly disappears
    }

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
                <BlogBento posts={feedPosts} />
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
