'use client'

import { useEffect, useState } from 'react'
import { FeaturedPostCard } from '@/components/featured-post-card'
import { PostRow } from '@/components/post-row'
import { type PostExcerpt } from '@/lib/types'
import { BLOG_URL } from '@/constants'

// Rendered with the feed from build time, then refreshed in the browser from
// blog.hovanhoa.net's static feed (which allows cross-origin reads, see the
// blog's public/_headers), so new posts show up without rebuilding this site.
export function BlogBento({ posts: initial }: { posts: PostExcerpt[] }) {
    const [posts, setPosts] = useState(initial)

    useEffect(() => {
        let cancelled = false
        fetch(`${BLOG_URL}/api/feed.json`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data: { posts?: PostExcerpt[] } | null) => {
                if (!cancelled && data?.posts?.length) setPosts(data.posts)
            })
            .catch(() => {
                // keep showing what we have
            })
        return () => {
            cancelled = true
        }
    }, [])

    const [featured, ...rest] = posts
    if (!featured) return null

    return (
        <div className="grid gap-x-8 gap-y-4 min-[900px]:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)]">
            <FeaturedPostCard post={featured} />
            {rest.length > 0 && (
                <div className="min-w-0 self-start overflow-hidden rounded-[var(--rd-r-lg)] border border-[var(--rd-border)] bg-[var(--rd-surface)]">
                    {rest.slice(0, 4).map((post) => (
                        <PostRow key={post.id} post={post} />
                    ))}
                </div>
            )}
        </div>
    )
}
