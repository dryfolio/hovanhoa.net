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
type FooterSection = { title: string; links: FooterLink[] }

const SECTIONS: FooterSection[] = [
    {
        title: 'apps',
        links: [
            { label: 'home', href: BASE_URL },
            { label: 'insight', href: INSIGHT_URL },
            { label: 'gallery', href: GALLERY_URL },
            { label: 'music', href: MUSIC_URL },
            { label: 'status', href: STATUS_URL },
        ],
    },
    {
        title: 'elsewhere',
        links: [
            { label: 'github', href: `https://github.com/${GITHUB}` },
            { label: 'twitter', href: `https://twitter.com/${TWITTER}` },
            { label: 'linkedin', href: `https://linkedin.com/in/${LINKEDIN}` },
        ],
    },
    {
        title: 'more',
        links: [
            { label: 'connect', href: INFO_URL },
            { label: 'llms.txt', href: `${BASE_URL}/llms.txt` },
        ],
    },
]

const linkClass =
    'font-[family-name:var(--font-mono)] text-sm text-[var(--rd-text-2)] transition-colors duration-200 hover:text-[var(--rd-orange-ink)]'

function Section({ title, links }: FooterSection) {
    return (
        <div>
            <h3 className="font-[family-name:var(--font-mono)] text-[11.5px] font-medium uppercase tracking-[0.14em] text-[var(--rd-orange-ink)]">
                {title}
            </h3>
            <ul className="mt-4 space-y-2.5">
                {links.map((l) => (
                    <li key={l.label}>
                        <a href={l.href} className={linkClass}>
                            {l.label}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export function Footer() {
    return (
        <footer
            className="mt-28 border-t border-[var(--rd-border)]"
            style={{
                background:
                    'radial-gradient(100% 140% at 0% 0%, var(--rd-orange-bg), transparent 55%), var(--rd-surface-2)',
            }}
        >
            <div className="mx-auto max-w-[var(--rd-maxw)] px-[var(--rd-pad)] py-16 sm:py-20">
                <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
                    {/* wordmark + blurb */}
                    <div>
                        <Link
                            href={BASE_URL}
                            className="block text-2xl font-bold tracking-tight text-[var(--rd-text)] sm:text-3xl"
                        >
                            hovanhoa
                            <span className="text-[var(--rd-orange)]">
                                .net
                            </span>
                        </Link>
                        <p className="rd-lead mt-4">
                            software engineer — building, writing, and shipping.
                            one small corner of the internet, a few sites deep.
                        </p>
                    </div>

                    {/* sectioned links */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
                        {SECTIONS.map((s) => (
                            <Section key={s.title} {...s} />
                        ))}
                    </div>
                </div>

                {/* bottom row */}
                <div className="mt-14 flex flex-col gap-3 border-t border-[var(--rd-border)] pt-6 font-[family-name:var(--font-mono)] text-xs text-[var(--rd-text-3)] sm:flex-row sm:items-center sm:justify-between">
                    <p>© 2026 hovanhoa</p>
                    <p>
                        crafted &amp; maintained by{' '}
                        <a href={BASE_URL} className="text-[var(--rd-orange-ink)]">
                            hovanhoa
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
