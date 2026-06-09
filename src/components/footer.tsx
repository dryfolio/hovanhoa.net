import Link from 'next/link'
import React from 'react'
import {
    BASE_URL,
    INSIGHT_URL,
    GALLERY_URL,
    MUSIC_URL,
    STATUS_URL,
    INFO_URL,
    GITHUB,
    TWITTER,
    LINKEDIN,
} from '@/constants'

type FooterLink = { label: string; href: string }

const PAGES: FooterLink[] = [
    { label: 'home', href: BASE_URL },
    { label: 'insight', href: INSIGHT_URL },
    { label: 'gallery', href: GALLERY_URL },
    { label: 'music', href: MUSIC_URL },
    { label: 'status', href: STATUS_URL },
]

const ELSEWHERE: FooterLink[] = [
    { label: 'github', href: `https://github.com/${GITHUB}` },
    { label: 'twitter', href: `https://twitter.com/${TWITTER}` },
    { label: 'linkedin', href: `https://linkedin.com/in/${LINKEDIN}` },
    { label: 'connect', href: INFO_URL },
    { label: 'llms.txt', href: `${BASE_URL}/llms.txt` },
]

const linkClass =
    'font-[family-name:var(--font-mono)] text-sm text-[var(--rd-text-2)] transition-colors duration-200 hover:text-[var(--rd-accent-ink)]'

function LinkRow({ links }: { links: FooterLink[] }) {
    return (
        <div className="flex flex-wrap gap-x-7 gap-y-3">
            {links.map((l) => (
                <a key={l.label} href={l.href} className={linkClass}>
                    {l.label}
                </a>
            ))}
        </div>
    )
}

export function Footer() {
    return (
        <footer
            className="mt-28 border-t border-[var(--rd-border)]"
            style={{
                background:
                    'radial-gradient(100% 140% at 0% 0%, var(--rd-accent-bg), transparent 55%), var(--rd-surface-2)',
            }}
        >
            <div className="mx-auto max-w-[var(--rd-maxw)] px-[var(--rd-pad)] py-16 sm:py-20">
                {/* wordmark */}
                <Link
                    href={BASE_URL}
                    className="block text-2xl font-bold tracking-tight text-[var(--rd-text)] sm:text-3xl"
                >
                    hovanhoa
                    <span className="text-[var(--rd-accent)]">.net</span>
                </Link>
                <p className="rd-lead mt-4">
                    software engineer — building, writing, and shipping. one
                    small corner of the internet, a few sites deep.
                </p>

                {/* inline link rows */}
                <div className="mt-12 space-y-4">
                    <LinkRow links={PAGES} />
                    <LinkRow links={ELSEWHERE} />
                </div>

                {/* bottom row */}
                <div className="mt-14 flex flex-col gap-3 border-t border-[var(--rd-border)] pt-6 font-[family-name:var(--font-mono)] text-xs text-[var(--rd-text-3)] sm:flex-row sm:items-center sm:justify-between">
                    <p>© 2026 hovanhoa</p>
                    <p>
                        crafted &amp; maintained by{' '}
                        <a
                            href={BASE_URL}
                            className="text-[var(--rd-accent-ink)]"
                        >
                            hovanhoa
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
