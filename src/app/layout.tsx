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
        <html
            lang="en"
            className={`scroll-smooth ${GeistSans.variable} ${GeistMono.variable}`}
        >
            <body className={GeistSans.className}>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme:dark)').matches;if(d)document.documentElement.classList.add('dark')}catch(e){}})()`,
                    }}
                />
                {children}
                <ScrollToTop />
            </body>
            <Analytics />
        </html>
    )
}
