import Navbar from '@/components/nav'
import { BASE_URL, NAME, FULL_NAME } from '@/constants'
import formatDate from '@/lib/format-date'
import { type Tag, type Post } from '@/lib/types'
import React from 'react'
import { Footer } from '@/components/footer'
import NotFound from '@/app/not-found'
import { Posts } from '@/lib/posts'
import ArticleContent from '@/components/article-content'
import { Metadata } from 'next'

export function generateStaticParams() {
    return Posts.getAllSlugs().map((slug) => ({ post: slug }))
}

export async function generateMetadata({
    params,
}: {
    params: { post: string }
}): Promise<Metadata> {
    const post = Posts.getArticleBySlug(params.post)

    if (!post) {
        return {
            title: 'Not Found',
            description: 'The page you are looking for does not exist.',
        }
    }

    const ogImage =
        post?.coverImage?.url ||
        `${BASE_URL}/api/og?title=${encodeURIComponent(`${NAME} | ${post.title.toLowerCase()}`)}`

    return {
        title: {
            absolute: `${NAME} | ${post.title.toLowerCase()}`,
        },
        description: post.brief,
        keywords: [
            FULL_NAME,
            'Hồ Văn Hòa',
            NAME,
            'hovanhoa',
            post.title,
            ...(post.tags?.map((tag: { name: string }) => tag.name) || []),
        ],
        authors: [{ name: FULL_NAME }],
        openGraph: {
            title: `${NAME} | ${post.title.toLowerCase()}`,
            description: post.brief,
            url: `${BASE_URL}/${params.post}`,
            siteName: NAME,
            images: [
                {
                    url: ogImage,
                    width: 800,
                    height: 418,
                    alt: post.title,
                },
            ],
            locale: 'en_US',
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${NAME} | ${post.title.toLowerCase()}`,
            description: post.brief,
            creator: '@_hovanhoa_',
            images: [ogImage],
        },
        alternates: {
            canonical: `${BASE_URL}/${params.post}`,
        },
    }
}

export default async function Page({ params }: { params: { post: string } }) {
    const postSlug = params.post
    const post: Post | null = Posts.getArticleBySlug(postSlug)

    if (!post) {
        return <NotFound />
    }

    return (
        <>
            <main className="min-h-screen relative">
                <script
                    type="application/ld+json"
                    suppressHydrationWarning
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'BlogPosting',
                            headline: post.title,
                            datePublished: post.publishedAt,
                            dateModified: post.publishedAt,
                            description: post.brief,
                            image: post?.coverImage?.url,
                            url: `${BASE_URL}/${postSlug}`,
                            author: {
                                '@type': 'Person',
                                name: FULL_NAME,
                                alternateName: NAME,
                            },
                        }),
                    }}
                />
                <header className="sticky top-0 z-50 border-b border-[var(--rd-border-2)] bg-[var(--rd-bg-sub)] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                    <div className="mx-auto w-full max-w-[var(--rd-maxw)] px-[var(--rd-pad)] py-3">
                        <Navbar />
                    </div>
                </header>
                <section className="relative mx-auto max-w-[var(--rd-maxw)] px-[var(--rd-pad)] pt-12">
                    <div className="max-w-3xl">
                        <h1 className="text-2xl font-bold tracking-tight text-[var(--rd-text)] sm:text-4xl">
                            {post.title}
                        </h1>
                        <div className="mb-8 mt-3 flex flex-wrap items-center gap-x-2 font-[family-name:var(--font-mono)] text-xs text-[var(--rd-text-3)]">
                            <span>{formatDate(post.publishedAt)}</span>
                            <span>· {post.readTimeInMinutes} min read</span>
                            {post.tags.map((tag: Tag) => (
                                <span key={tag.name}>· {tag.name}</span>
                            ))}
                        </div>
                        <ArticleContent content={post.content.html} />
                    </div>
                </section>
                <Footer />
            </main>
        </>
    )
}
