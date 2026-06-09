import { DESCRIPTION, NAME, ROLE } from '@/constants'
import { Eyebrow } from '@/components/redesign/eyebrow'

export default function Hero() {
    return (
        <div>
            <Eyebrow>hovanhoa · blog</Eyebrow>
            <h1 className="mt-3 text-[clamp(1.9rem,4vw,3rem)] font-semibold tracking-[-0.04em] text-[var(--rd-text)]">
                {NAME}
            </h1>
            <p className="mt-1 font-[family-name:var(--font-mono)] text-sm text-[var(--rd-text-3)]">
                {ROLE}
            </p>
            <p className="rd-lead mt-4">{DESCRIPTION}</p>
        </div>
    )
}
