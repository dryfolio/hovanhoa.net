import Image from 'next/image'
import formatDate from '@/lib/format-date'
import { TagPill } from '@/components/redesign/tag-pill'
import { BLOG_URL } from '@/constants'
import { type PostExcerpt } from '@/lib/types'

export function FeaturedPostCard({ post }: { post: PostExcerpt }) {
    const primaryTag = post.tags[0]

    return (
        <article className="rd-card group relative overflow-hidden">
            {post.coverImage.url && (
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--rd-surface-2)]">
                    <Image
                        src={post.coverImage.url}
                        alt=""
                        fill
                        className="object-cover"
                    />
                </div>
            )}
            <div className="flex flex-col gap-3 p-7 sm:p-8">
                <div className="flex flex-wrap items-center gap-2">
                    {primaryTag && (
                        <TagPill
                            name={primaryTag.name}
                            category={primaryTag.category}
                        />
                    )}
                    <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--rd-text-3)]">
                        {formatDate(post.publishedAt)} · {post.readTimeInMinutes}{' '}
                        min read
                    </span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-[var(--rd-text)] transition-colors group-hover:text-[var(--rd-orange-ink)] sm:text-[1.75rem]">
                    <a
                        href={`${BLOG_URL}/${post.slug}`}
                        data-card-link=""
                        className="after:absolute after:inset-0 after:content-['']"
                    >
                        {post.title}
                    </a>
                </h3>
                <p className="line-clamp-3 text-[0.95rem] leading-relaxed text-[var(--rd-text-2)]">
                    {post.brief}
                </p>
            </div>
        </article>
    )
}
