import formatDate from '@/lib/format-date'
import truncate from '@/lib/truncate'
import { type PostExcerpt, type Tag } from '@/lib/types'

export default function PostTile({ post }: { post: PostExcerpt }) {
    return (
        <article className="group relative border-l border-slate-200 pb-10 pl-8 md:pl-10">
            {/* timeline dot sitting on the left rail */}
            <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-slate-300 bg-white transition-colors group-hover:border-[var(--rd-orange)]" />
            <div className="mb-2 flex flex-wrap items-center gap-x-2 font-[family-name:var(--font-mono)] text-xs text-[var(--rd-text-3)]">
                <span>{formatDate(post.publishedAt)}</span>
                {post.tags.map((tag: Tag) => (
                    <span key={tag.name}>· {tag.name}</span>
                ))}
            </div>
            <h2 className="mb-2 inline-flex items-center gap-2 text-xl font-bold tracking-tight text-[var(--rd-text)] transition-colors group-hover:text-[var(--rd-orange-ink)] sm:text-2xl">
                {post.title}
                <span className="translate-x-0 text-[var(--rd-orange)] opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100">
                    →
                </span>
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-[var(--rd-text-2)]">
                {truncate(post.brief, 160)}
            </p>
        </article>
    )
}
