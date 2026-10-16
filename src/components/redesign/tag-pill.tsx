import { BLOG_URL } from '@/constants'

type TagColor =
    | 'blue'
    | 'teal'
    | 'indigo'
    | 'amber'
    | 'orange'
    | 'violet'
    | 'green'
    | 'pink'

const CATEGORY_VARS: Record<TagColor, { bg: string; fg: string }> = {
    blue: { bg: 'var(--rd-label-blue)', fg: 'var(--rd-label-blue-fg)' },
    teal: { bg: 'var(--rd-label-teal)', fg: 'var(--rd-label-teal-fg)' },
    indigo: { bg: 'var(--rd-label-indigo)', fg: 'var(--rd-label-indigo-fg)' },
    amber: { bg: 'var(--rd-label-amber)', fg: 'var(--rd-label-amber-fg)' },
    orange: { bg: 'var(--rd-label-orange)', fg: 'var(--rd-label-orange-fg)' },
    violet: { bg: 'var(--rd-label-violet)', fg: 'var(--rd-label-violet-fg)' },
    green: { bg: 'var(--rd-label-green)', fg: 'var(--rd-label-green-fg)' },
    pink: { bg: 'var(--rd-label-pink)', fg: 'var(--rd-label-pink-fg)' },
}

export function TagPill({
    name,
    category = 'blue',
}: {
    name: string
    category?: TagColor
}) {
    const { bg, fg } = CATEGORY_VARS[category] ?? CATEGORY_VARS.blue

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
