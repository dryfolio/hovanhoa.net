import Link from 'next/link'
import {
    BASE_URL,
    BLOG_URL,
    INSIGHT_URL,
    GALLERY_URL,
    MUSIC_URL,
    STATUS_URL,
    INFO_URL,
    BOOK_URL,
    GITHUB_URL,
    TWITTER_URL,
    LINKEDIN_URL,
} from '@/constants'
import { SocialIcon } from '@/components/redesign/social-icons'

type FooterLink = { label: string; href: string }
type FooterSection = { title: string; links: FooterLink[] }

const SECTIONS: FooterSection[] = [
    {
        title: 'apps',
        links: [
            { label: 'home', href: BASE_URL },
            { label: 'blog', href: BLOG_URL },
            { label: 'insight', href: INSIGHT_URL },
            { label: 'gallery', href: GALLERY_URL },
            { label: 'music', href: MUSIC_URL },
            { label: 'status', href: STATUS_URL },
            { label: 'book', href: BOOK_URL },
        ],
    },
    {
        title: 'elsewhere',
        links: [
            { label: 'github', href: GITHUB_URL },
            { label: 'twitter', href: TWITTER_URL },
            { label: 'linkedin', href: LINKEDIN_URL },
        ],
    },
    {
        title: 'more',
        links: [
            { label: 'connect', href: INFO_URL },
            { label: 'ls', href: `${BASE_URL}/ls` },
            { label: 'llms.txt', href: `${BASE_URL}/llms.txt` },
            { label: 'sitemap', href: `${BASE_URL}/sitemap.xml` },
        ],
    },
]

const linkClass =
    'block py-1 text-sm text-[var(--rd-text-2)] transition-colors duration-150 hover:text-[var(--rd-orange-ink)]'

function Section({ title, links }: FooterSection) {
    return (
        <div>
            <h4 className="mb-[13px] font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--rd-orange-ink)]">
                {title}
            </h4>
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
        <footer className="border-t border-[var(--rd-border)] bg-[var(--rd-bg-sub)]">
            <div className="mx-auto max-w-[var(--rd-maxw)] px-[var(--rd-pad)] pb-10 pt-[54px]">
                <div className="flex flex-wrap justify-between gap-x-16 gap-y-10">
                    <div className="max-w-[300px]">
                        <div className="mb-3 flex items-center gap-3">
                            <SocialIcon
                                kind="github"
                                href={GITHUB_URL}
                                className="h-3.5 w-3.5"
                            />
                            <SocialIcon
                                kind="twitter"
                                href={TWITTER_URL}
                                className="h-3.5 w-3.5"
                            />
                            <SocialIcon
                                kind="linkedin"
                                href={LINKEDIN_URL}
                                className="h-3.5 w-3.5"
                            />
                        </div>
                        <Link
                            href={BASE_URL}
                            className="text-[22px] font-semibold tracking-[-0.03em] text-[var(--rd-text)]"
                        >
                            hovanhoa
                            <span className="text-[var(--rd-orange)]">
                                .net
                            </span>
                        </Link>
                        <p className="mt-2 font-[family-name:var(--font-mono)] text-xs text-[var(--rd-text-3)]">
                            © {new Date().getFullYear()} · built in vietnam
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-14">
                        {SECTIONS.map((s) => (
                            <Section key={s.title} {...s} />
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
