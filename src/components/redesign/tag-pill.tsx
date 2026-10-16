import { BLOG_URL } from '@/constants'

type TagCategory = 'engineering' | 'ai' | 'life'

const CATEGORY_VARS: Record<TagCategory, { bg: string; fg: string }> = {
    engineering: { bg: 'var(--rd-label-slate)', fg: 'var(--rd-label-slate-fg)' },
    ai: { bg: 'var(--rd-label-pine)', fg: 'var(--rd-label-pine-fg)' },
    life: { bg: 'var(--rd-label-plum)', fg: 'var(--rd-label-plum-fg)' },
}

export function TagPill({
    name,
    category = 'engineering',
}: {
    name: string
    category?: TagCategory
}) {
    const { bg, fg } = CATEGORY_VARS[category]

    return (
        <a
            href={`${BLOG_URL}/?tag=${encodeURIComponent(name)}`}
            className="relative z-10 inline-flex items-center rounded-full px-2 py-0.5 text-[0.68rem] font-medium tracking-[0.04em]"
            style={{ background: bg, color: fg }}
        >
            {name}
        </a>
    )
}
