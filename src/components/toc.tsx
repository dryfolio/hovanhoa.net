import { type TableOfContent } from '@/lib/types'
import Link from 'next/link'
import React from 'react'

export default function TableOfContent({ items }: { items: TableOfContent[] }) {
    return (
        <div className="text-sm leading-7 text-slate-500 prose">
            {items.map((item) => {
                if (item.level === 1) {
                    return (
                        <div
                            className="content-block transition-all duration-200 pl-2 hover:border-l-2"
                            key={item.id}
                            style={{ paddingBottom: 3 }}
                        >
                            <div className="feed-border"></div>
                            <div className="feed-dot"></div>
                            <Link
                                className="font-[family-name:var(--font-mono)] text-xs text-[var(--rd-text-3)] no-underline transition-colors duration-200 hover:text-[var(--rd-accent-ink)]"
                                href={`#heading-${item.slug}`}
                            >
                                {item.title}
                            </Link>
                        </div>
                    )
                }
            })}
        </div>
    )
}
