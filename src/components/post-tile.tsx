import Link from 'next/link'
import formatDate from '@/lib/format-date'
import truncate from '@/lib/truncate'
import { type PostExcerpt, type Tag } from '@/lib/types'

// The title link's ::after is stretched over the whole tile, so hovering the
// tile body (but NOT the tags, which sit above it) counts as hovering the link.
// Title / dot / arrow key their highlight off that link via group-has, so
// hovering a tag only highlights the tag.
export default function PostTile({
    post,
    activeTags = [],
}: {
    post: PostExcerpt
    activeTags?: string[]
}) {
    const activeLower = new Set(activeTags.map((t) => t.toLowerCase()))

    // clicking a tag toggles it in/out of the active selection
    const toggleHref = (name: string) => {
        const isActive = activeLower.has(name.toLowerCase())
        const next = isActive
            ? activeTags.filter((t) => t.toLowerCase() !== name.toLowerCase())
            : [...activeTags, name]
        return next.length
            ? `/?tag=${next.map(encodeURIComponent).join(',')}#blog`
            : '/#blog'
    }

    return (
        <article className="group relative border-l border-slate-200 pb-10 pl-8 md:pl-10">
            {/* timeline dot sitting on the left rail */}
            <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-slate-300 bg-white transition-colors group-has-[[data-card-link]:hover]:border-[var(--rd-orange)]" />
            <div className="mb-2 flex flex-wrap items-center gap-x-2 font-[family-name:var(--font-mono)] text-xs text-[var(--rd-text-3)]">
                <span>{formatDate(post.publishedAt)}</span>
                {post.tags.map((tag: Tag) => {
                    const isActive = activeLower.has(tag.name.toLowerCase())
                    return (
                        <Link
                            key={tag.name}
                            href={toggleHref(tag.name)}
                            className={`relative z-10 transition-colors ${
                                isActive
                                    ? 'font-medium text-[var(--rd-orange-ink)]'
                                    : 'hover:text-[var(--rd-orange-ink)]'
                            }`}
                        >
                            · {tag.name}
                        </Link>
                    )
                })}
            </div>
            <h2 className="mb-2 inline-flex items-center gap-2 text-xl font-bold tracking-tight text-[var(--rd-text)] transition-colors group-has-[[data-card-link]:hover]:text-[var(--rd-orange-ink)] sm:text-2xl">
                <Link
                    href={`/${post.slug}`}
                    prefetch={false}
                    data-card-link=""
                    className="after:absolute after:inset-0 after:content-['']"
                >
                    {post.title}
                </Link>
                <span className="translate-x-0 text-[var(--rd-orange)] opacity-0 transition-all group-has-[[data-card-link]:hover]:translate-x-1 group-has-[[data-card-link]:hover]:opacity-100">
                    →
                </span>
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-[var(--rd-text-2)]">
                {truncate(post.brief, 160)}
            </p>
        </article>
    )
}
