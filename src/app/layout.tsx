import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { BASE_URL, NAME, FULL_NAME } from '@/constants'
import { Analytics } from '@vercel/analytics/react'
import ScrollToTop from '@/components/scroll-to-top'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),
    title: {
        default: NAME,
        template: `${NAME} | %s`,
    },
    description: `${FULL_NAME} - Software Engineer. Personal website and blog of ${FULL_NAME}.`,
    keywords: [
        FULL_NAME,
        'Hồ Văn Hòa',
        NAME,
        'hovanhoa',
        'Software Engineer',
        'Developer',
        'Blog',
        'Tech Blog',
        'Vietnam Developer',
    ],
    authors: [{ name: FULL_NAME }],
    openGraph: {
        title: NAME,
        description: `${FULL_NAME} - Software Engineer. Personal website and blog of ${FULL_NAME}.`,
        url: BASE_URL,
        siteName: NAME,
        locale: 'en_US',
        type: 'website',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    twitter: {
        title: NAME,
        card: 'summary_large_image',
        description: `${FULL_NAME} - Software Engineer.`,
    },
    alternates: {
        canonical: BASE_URL,
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={inter.className}>
                {children}
                <ScrollToTop />
            </body>
            <Analytics />
        </html>
    )
}
