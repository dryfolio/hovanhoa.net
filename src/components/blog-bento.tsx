import { FeaturedPostCard } from '@/components/featured-post-card'
import { PostRow } from '@/components/post-row'
import { type PostExcerpt } from '@/lib/types'

export function BlogBento({ posts }: { posts: PostExcerpt[] }) {
    const [featured, ...rest] = posts
    if (!featured) return null

    return (
        <div className="grid gap-6 min-[900px]:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)]">
            <FeaturedPostCard post={featured} />
            {rest.length > 0 && (
                <div className="rd-card flex min-w-0 flex-col">
                    {rest.map((post) => (
                        <PostRow key={post.id} post={post} />
                    ))}
                </div>
            )}
        </div>
    )
}
