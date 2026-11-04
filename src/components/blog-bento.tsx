import type { ReactNode } from 'react'
import { FeaturedPostCard } from '@/components/featured-post-card'
import { PostRow } from '@/components/post-row'
import { type PostExcerpt } from '@/lib/types'

export function BlogBento({
    posts,
    aside,
}: {
    posts: PostExcerpt[]
    aside?: ReactNode
}) {
    const [featured, ...rest] = posts
    if (!featured) return aside ? <div>{aside}</div> : null

    // desktop: featured + aside stack on the left, post rows fill the right;
    // mobile keeps source order (featured, rows, aside)
    return (
        <div className="grid items-start gap-x-8 gap-y-4 min-[900px]:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)]">
            <div className="min-w-0 min-[900px]:col-start-1 min-[900px]:row-start-1">
                <FeaturedPostCard post={featured} />
            </div>
            {rest.length > 0 && (
                <div className="min-w-0 overflow-hidden rounded-[var(--rd-r-lg)] border border-[var(--rd-border)] bg-[var(--rd-surface)] min-[900px]:col-start-2 min-[900px]:row-span-2 min-[900px]:row-start-1">
                    {rest.slice(0, 4).map((post) => (
                        <PostRow key={post.id} post={post} />
                    ))}
                </div>
            )}
            {aside && (
                <div className="min-w-0 min-[900px]:col-start-1 min-[900px]:row-start-2">
                    {aside}
                </div>
            )}
        </div>
    )
}
