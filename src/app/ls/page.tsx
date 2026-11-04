import LsDirectory, {
    type LsEntry,
    type LsGroup,
} from '@/components/ls-directory'
import { Metadata } from 'next'
import {
    BASE_URL,
    NAME,
    GALLERY_URL,
    GITHUB,
    INFO_URL,
    INSIGHT_URL,
    LINKEDIN,
    MUSIC_URL,
    STATUS_URL,
    TWITTER,
} from '@/constants'

export const metadata: Metadata = {
    title: 'ls — directory',
    description: `Every link and corner of the ${NAME} ecosystem in one place.`,
    alternates: { canonical: `${BASE_URL}/ls` },
}

function buildGroups(): LsGroup[] {
    const apps: LsEntry[] = [
        { name: '/', desc: 'home — profile & writing', href: BASE_URL },
        {
            name: 'insight',
            desc: 'coding activity',
            href: INSIGHT_URL,
            external: true,
        },
        {
            name: 'gallery',
            desc: 'photography',
            href: GALLERY_URL,
            external: true,
        },
        {
            name: 'music',
            desc: "what's on repeat",
            href: MUSIC_URL,
            external: true,
        },
        {
            name: 'status',
            desc: 'service uptime',
            href: STATUS_URL,
            external: true,
        },
        { name: 'info', desc: 'links & bio', href: INFO_URL, external: true },
    ]

    const connect: LsEntry[] = [
        {
            name: 'github',
            desc: `@${GITHUB}`,
            href: `https://github.com/${GITHUB}`,
            external: true,
        },
        {
            name: 'twitter',
            desc: `@${TWITTER}`,
            href: `https://twitter.com/${TWITTER}`,
            external: true,
        },
        {
            name: 'linkedin',
            desc: `in/${LINKEDIN}`,
            href: `https://linkedin.com/in/${LINKEDIN}`,
            external: true,
        },
    ]

    const meta: LsEntry[] = [
        {
            name: 'llms.txt',
            desc: 'llm-readable site map',
            href: `${BASE_URL}/llms.txt`,
        },
        {
            name: 'sitemap',
            desc: 'xml sitemap',
            href: `${BASE_URL}/sitemap.xml`,
        },
    ]

    return [
        { title: 'apps', items: apps },
        { title: 'connect', items: connect },
        { title: 'meta', items: meta },
    ]
}

export default function LsPage() {
    const groups = buildGroups()
    const total = groups.reduce((n, g) => n + g.items.length, 0)

    return (
        <main className="relative min-h-screen">
            <div className="mx-auto w-full max-w-[var(--rd-maxw)] px-[var(--rd-pad)] pb-24 pt-12 sm:pt-[clamp(3.5rem,8vw,6rem)]">
                {/* hero */}
                <div className="flex items-baseline gap-3">
                    <h1 className="m-0 font-[family-name:var(--font-display)] text-[clamp(2.1rem,4.5vw,3.4rem)] font-normal leading-[1.08] tracking-[-0.03em] text-[var(--rd-text)]">
                        ls
                    </h1>
                    <span className="font-[family-name:var(--font-mono)] text-base text-[var(--rd-text-3)]">
                        {total}
                    </span>
                </div>
                <p className="rd-lead mt-4">
                    Every link and corner of the {NAME} ecosystem — apps,
                    writing, and where to find me.
                </p>

                <div className="mt-10">
                    <LsDirectory groups={groups} total={total} />
                </div>
            </div>
        </main>
    )
}
