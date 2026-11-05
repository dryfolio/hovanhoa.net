import { FeaturedPostCard } from '@/components/featured-post-card'
import { PostRow } from '@/components/post-row'
import { type PostExcerpt } from '@/lib/types'

export function BlogBento({ posts }: { posts: PostExcerpt[] }) {
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
