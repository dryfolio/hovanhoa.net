import Image from 'next/image'
import {
    FULL_NAME,
    GITHUB,
    GITHUB_URL,
    LINKEDIN,
    LINKEDIN_URL,
    ROLE,
    TWITTER,
    TWITTER_URL,
} from '@/constants'
import {
    GithubIcon,
    LinkedinIcon,
    TwitterIcon,
} from '@/components/redesign/social-icons'

const SOCIAL_LINKS = [
    { Icon: GithubIcon, href: GITHUB_URL, handle: GITHUB },
    { Icon: TwitterIcon, href: TWITTER_URL, handle: TWITTER },
    { Icon: LinkedinIcon, href: LINKEDIN_URL, handle: LINKEDIN },
]

const socialLink =
    'inline-flex items-center gap-[0.32rem] border-b border-[color-mix(in_srgb,var(--rd-text)_22%,transparent)] text-[0.875rem] tracking-[-0.01em] text-[var(--rd-text)] transition-colors hover:border-[var(--rd-orange)] hover:text-[var(--rd-orange-ink)]'

export default function Hero() {
    return (
        <section className="mx-auto w-full max-w-[var(--rd-maxw)] px-[var(--rd-pad)] pb-[clamp(2.5rem,5vw,4rem)] pt-[clamp(3.5rem,8vw,6.5rem)]">
            <div className="rd-rise grid items-center gap-[clamp(1.25rem,3vw,2.5rem)] max-[480px]:grid-cols-1 min-[481px]:grid-cols-[minmax(0,1fr)_auto] max-[799px]:items-start min-[800px]:gap-[clamp(2rem,5vw,4rem)]">
                <div className="min-w-0 max-w-[46rem]">
                    <h1 className="m-0 flex flex-col gap-3">
                        <span className="rd-display text-[var(--rd-text)] max-[799px]:text-[clamp(1.7rem,8.2vw,2.35rem)]">
                            {ROLE}
                        </span>
                        <span className="text-pretty text-[clamp(1.08rem,1.7vw,1.28rem)] font-medium leading-[1.35] tracking-[-0.02em] text-[var(--rd-text-2)]">
                            Backend systems, microservices, and AI agents.
                        </span>
                    </h1>

                    <p className="m-0 mt-[clamp(1.1rem,2vw,1.5rem)] max-w-[56ch] text-[clamp(0.98rem,1.25vw,1.0625rem)] leading-[1.65] text-[var(--rd-text-2)]">
                        Hey, I&apos;m Hòa — 4+ years building backend systems
                        that stay calm under load. I&apos;d write everything in{' '}
                        <a
                            href="https://github.com/hovanhoa?tab=repositories&q=&type=source&language=go&sort="
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-[var(--rd-text)] underline decoration-[color-mix(in_srgb,var(--rd-orange)_40%,transparent)] underline-offset-2 transition-colors hover:decoration-[var(--rd-orange)]"
                        >
                            Golang
                        </a>{' '}
                        if I could.
                    </p>

                    <nav
                        aria-label="Social"
                        className="mt-[clamp(1.2rem,2.2vw,1.7rem)] flex flex-wrap items-center gap-[0.55rem]"
                    >
                        {SOCIAL_LINKS.map(({ Icon, href, handle }, i) => (
                            <span
                                key={href}
                                className="inline-flex items-center gap-[0.55rem]"
                            >
                                {i > 0 && (
                                    <span
                                        aria-hidden
                                        className="select-none text-[var(--rd-text-4)]"
                                    >
                                        |
                                    </span>
                                )}
                                <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={socialLink}
                                >
                                    <Icon className="h-3.5 w-3.5 shrink-0" />
                                    {handle}
                                </a>
                            </span>
                        ))}
                    </nav>
                </div>

                <Image
                    src="/avatar.png"
                    alt={FULL_NAME}
                    width={480}
                    height={480}
                    priority
                    className="h-[clamp(8.5rem,22vw,15rem)] w-[clamp(8.5rem,22vw,15rem)] justify-self-end rounded-full border border-[var(--rd-border)] bg-[var(--rd-surface)] object-cover max-[799px]:h-[3.75rem] max-[799px]:w-[3.75rem] max-[480px]:order-first max-[480px]:h-[4.25rem] max-[480px]:w-[4.25rem] max-[480px]:justify-self-start"
                />
            </div>
        </section>
    )
}
