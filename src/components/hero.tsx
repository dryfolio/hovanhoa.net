import {
    DESCRIPTION,
    NAME,
    ROLE,
    GITHUB_URL,
    TWITTER_URL,
    LINKEDIN_URL,
} from '@/constants'
import { Eyebrow } from '@/components/redesign/eyebrow'
import { SocialIcon } from '@/components/redesign/social-icons'

const SOCIAL_LINKS = [
    { kind: 'github' as const, href: GITHUB_URL },
    { kind: 'twitter' as const, href: TWITTER_URL },
    { kind: 'linkedin' as const, href: LINKEDIN_URL },
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
            <div className="mt-5 flex items-center gap-4">
                {SOCIAL_LINKS.map((s) => (
                    <SocialIcon key={s.kind} kind={s.kind} href={s.href} />
                ))}
            </div>
        </div>
    )
}
