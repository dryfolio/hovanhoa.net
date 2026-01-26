import Hero from '@/components/hero'
import Navbar from '@/components/nav'
import PostTile from '@/components/post-tile'
import { type PostExcerpt } from '@/lib/types'
import Link from 'next/link'
import { Footer } from '@/components/footer'
import { unstable_noStore as noStore } from 'next/cache'
import { HashNode } from '@/lib/hashnode'
import { Metadata } from 'next'
import { BASE_URL, NAME, FULL_NAME, ROLE, IMAGE, TWITTER, GITHUB, LINKEDIN } from '@/constants'

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
    const posts = await HashNode.getArticles({
        page: 1,
        pageSize: 20,
    })

    const postsArr = posts?.data?.publication?.postsViaPage?.nodes

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
            <div className="py-8 md:py-12 pb-0 px-4 sm:px-6 lg:pl-52 mb-8 md:mb-0">
                <Navbar />
            </div>
            <Hero />
            <section className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 overflow-hidden mb-30">
                {postsArr?.map((post: PostExcerpt) => (
                    <Link
                        href={`/${post.slug}`}
                        prefetch={false}
                        key={post.id}
                    >
                        <PostTile key={post.id} post={post} />
                    </Link>
                ))}
            </section>
            <div className="py-8 md:py-12 pb-0 px-4 sm:px-6 lg:pl-52 mb-8 md:mb-0">
                <Footer />
            </div>
        </main>
    )
}
