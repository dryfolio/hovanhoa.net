import Link from 'next/link'
import React from 'react'

export default function NotFound() {
    return (
        <div className="grid h-screen place-content-center bg-[var(--rd-bg)] px-4 text-center gap-5">
            <div>
                <h1 className="text-7xl font-black text-[var(--rd-text)]">404</h1>
            </div>
            <Link href="/" className="text-[var(--rd-orange-ink)]">
                <button>Go Back Home</button>
            </Link>
        </div>
    )
}
