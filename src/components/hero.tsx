import {
    DESCRIPTION,
    NAME,
    ROLE,
    GITHUB_URL,
    TWITTER_URL,
    LINKEDIN_URL,
} from '@/constants'
import { Eyebrow } from '@/components/redesign/eyebrow'

const SOCIAL_LINKS = [
    { label: 'github', href: GITHUB_URL },
    { label: 'twitter', href: TWITTER_URL },
    { label: 'linkedin', href: LINKEDIN_URL },
]

export default function Hero() {
    return (
        <div>
            <Eyebrow>hovanhoa · blog</Eyebrow>
            <h1 className="mt-3 text-[clamp(2.1rem,4.6vw,3.4rem)] font-semibold tracking-[-0.04em] text-[var(--rd-text)]">
                {NAME}
            </h1>
            <p className="mt-1 font-[family-name:var(--font-mono)] text-sm text-[var(--rd-text-3)]">
                {ROLE}
            </p>
            <p className="rd-lead mt-4">{DESCRIPTION}</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-3 font-[family-name:var(--font-mono)] text-sm text-[var(--rd-text-2)]">
                {SOCIAL_LINKS.map((s, i) => (
                    <span key={s.label} className="inline-flex items-center gap-x-3">
                        {i > 0 && <span aria-hidden>·</span>}
                        <a
                            href={s.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors hover:text-[var(--rd-orange-ink)]"
                        >
                            {s.label}
                        </a>
                    </span>
                ))}
            </div>
        </div>
    )
}
