import formatDate from '@/lib/format-date'
import { TagPill } from '@/components/redesign/tag-pill'
import { BLOG_URL } from '@/constants'
import { type PostExcerpt } from '@/lib/types'

export function PostRow({ post }: { post: PostExcerpt }) {
    const primaryTag = post.tags[0]

    return (
        <article className="group relative border-b border-[var(--rd-line)] px-5 py-4 last:border-b-0">
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
            <h4 className="mt-1.5 text-[0.95rem] font-medium tracking-tight text-[var(--rd-text)] transition-colors group-hover:text-[var(--rd-orange-ink)]">
                <a
                    href={`${BLOG_URL}/${post.slug}`}
                    data-card-link=""
                    className="after:absolute after:inset-0 after:content-['']"
                >
                    {post.title}
                </a>
            </h4>
            <p className="mt-1 line-clamp-2 text-[0.8rem] leading-snug text-[var(--rd-text-2)]">
                {post.brief}
            </p>
        </article>
    )
}
