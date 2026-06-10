import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { BASE_URL, NAME, FULL_NAME } from '@/constants'
import { Analytics } from '@vercel/analytics/react'
import ScrollToTop from '@/components/scroll-to-top'

export const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),
    title: {
        default: NAME,
        template: `${NAME} | %s`,
    },
    description: `${FULL_NAME} — software engineer writing about backend systems, microservices, and AI agents.`,
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
        description: `${FULL_NAME} — software engineer writing about backend systems, microservices, and AI agents.`,
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
        description: `${FULL_NAME} — software engineer writing about backend systems, microservices, and AI agents.`,
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
        <html
            lang="en"
            className={`motion-safe:scroll-smooth ${GeistSans.variable} ${GeistMono.variable}`}
        >
            <body className={GeistSans.className}>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(){try{var m=document.cookie.match(/(?:^|; )theme=(dark|light)/);if(m&&m[1]==='dark')document.documentElement.classList.add('dark')}catch(e){}})()`,
                    }}
                />
                {children}
                <ScrollToTop />
            </body>
            <Analytics />
        </html>
    )
}
