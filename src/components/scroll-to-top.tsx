'use client'

import { useEffect, useState } from 'react'

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 300)
        }

        toggleVisibility()
        window.addEventListener('scroll', toggleVisibility, { passive: true })

        return () => {
            window.removeEventListener('scroll', toggleVisibility)
        }
    }, [])

    const scrollToTop = () => {
        const reduced = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches
        window.scrollTo({
            top: 0,
            behavior: reduced ? 'auto' : 'smooth',
        })
    }

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 p-3 bg-[var(--rd-surface)] text-[var(--rd-text)] border border-[var(--rd-border)] rounded-full shadow-lg hover:bg-[var(--rd-surface-2)] transition-all duration-300 z-50"
                    aria-label="Scroll to top"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                    </svg>
                </button>
            )}
        </>
    )
}
