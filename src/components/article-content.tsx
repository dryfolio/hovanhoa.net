'use client'

import React, { useEffect } from 'react'
import Prism from 'prismjs'
import 'prismjs/themes/prism-okaidia.css' // Using a better theme
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-markdown'
import 'prismjs/plugins/line-numbers/prism-line-numbers.js'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'

interface ArticleContentProps {
    content: string
}

export default function ArticleContent({ content }: ArticleContentProps) {
    useEffect(() => {
        Prism.highlightAll()
    }, [content])

    return (
        <article
            className="prose dark:prose-invert max-w-none prose-headings:tracking-tight prose-h1:text-xl sm:prose-h1:text-3xl prose-h2:text-lg sm:prose-h2:text-2xl prose-h3:text-base sm:prose-h3:text-xl prose-a:font-medium prose-a:text-[var(--rd-accent-ink)] prose-pre:bg-transparent prose-pre:p-0"
            dangerouslySetInnerHTML={{
                __html: content,
            }}
        ></article>
    )
}
