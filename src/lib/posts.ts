import 'server-only'

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Marked, type Tokens } from 'marked'
import GithubSlugger from 'github-slugger'

import type { Post, PostExcerpt, TableOfContent, Tag } from './types'

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts')

type Frontmatter = {
    title: string
    brief?: string
    publishedAt: string
    updatedAt?: string
    tags?: string[]
    coverImage?: string
}

type ParsedPost = {
    slug: string
    data: Frontmatter
    body: string
}

function listMarkdownFiles(): string[] {
    if (!fs.existsSync(POSTS_DIR)) return []
    return fs
        .readdirSync(POSTS_DIR)
        .filter((name) => name.endsWith('.md') || name.endsWith('.mdx'))
}

function readPostFile(slug: string): ParsedPost | null {
    const candidates = [
        path.join(POSTS_DIR, `${slug}.md`),
        path.join(POSTS_DIR, `${slug}.mdx`),
    ]
    const filePath = candidates.find((p) => fs.existsSync(p))
    if (!filePath) return null

    const raw = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(raw)

    return {
        slug,
        data: data as Frontmatter,
        body: content,
    }
}

function toTags(tags?: string[]): Tag[] {
    return (tags ?? []).map((name) => ({ name }))
}

function toExcerpt(post: ParsedPost): PostExcerpt {
    const { slug, data } = post
    return {
        id: slug,
        slug,
        title: data.title,
        brief: buildBrief(post),
        url: `/${slug}`,
        tags: toTags(data.tags),
        publishedAt: data.publishedAt,
        updatedAt: data.updatedAt,
        coverImage: { url: data.coverImage ?? '' },
    }
}

function compareByDateDesc(a: ParsedPost, b: ParsedPost): number {
    return (
        new Date(b.data.publishedAt).getTime() -
        new Date(a.data.publishedAt).getTime()
    )
}

function readAllPosts(): ParsedPost[] {
    return listMarkdownFiles()
        .map((file) => readPostFile(file.replace(/\.(md|mdx)$/, '')))
        .filter((p): p is ParsedPost => p !== null)
        .sort(compareByDateDesc)
}

function extractTableOfContents(body: string): TableOfContent[] {
    const slugger = new GithubSlugger()
    const tokens = new Marked().lexer(body)
    const items: TableOfContent[] = []

    for (const token of tokens) {
        if (token.type === 'heading') {
            const heading = token as Tokens.Heading
            const id = slugger.slug(heading.text)
            items.push({
                id,
                slug: id,
                level: heading.depth,
                title: heading.text,
                parentId: '',
            })
        }
    }

    return items
}

function renderMarkdown(body: string): string {
    const slugger = new GithubSlugger()
    const md = new Marked({
        gfm: true,
        breaks: false,
    })

    type HeadingThis = { parser: { parseInline: (tokens: Tokens.Heading['tokens']) => string } }

    md.use({
        renderer: {
            heading(this: HeadingThis, token: Tokens.Heading) {
                const inline = this.parser.parseInline(token.tokens)
                const id = slugger.slug(token.text)
                return `<h${token.depth} id="heading-${id}">${inline}</h${token.depth}>\n`
            },
        },
    })

    return md.parse(body, { async: false }) as string
}

function calculateReadTimeInMinutes(body: string): number {
    const words = body.trim().split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.ceil(words / 200))
}

function buildBrief(post: ParsedPost): string {
    if (post.data.brief) return post.data.brief
    const stripped = post.body
        .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/[#>*_`~\-]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
    return stripped.slice(0, 240)
}

export const Posts = {
    getAllSlugs(): string[] {
        return readAllPosts().map((p) => p.slug)
    },

    getArticles({
        pageSize = 20,
        page = 1,
    }: {
        pageSize?: number
        page?: number
    } = {}): PostExcerpt[] {
        const all = readAllPosts()
        const start = (page - 1) * pageSize
        return all.slice(start, start + pageSize).map(toExcerpt)
    },

    getAllSummaries(): PostExcerpt[] {
        return readAllPosts().map(toExcerpt)
    },

    getArticleBySlug(slug: string): Post | null {
        const parsed = readPostFile(slug)
        if (!parsed) return null

        const html = renderMarkdown(parsed.body)
        return {
            title: parsed.data.title,
            brief: buildBrief(parsed),
            content: { html },
            tags: toTags(parsed.data.tags),
            publishedAt: parsed.data.publishedAt,
            coverImage: { url: parsed.data.coverImage ?? '' },
            readTimeInMinutes: calculateReadTimeInMinutes(parsed.body),
            features: {
                tableOfContents: {
                    items: extractTableOfContents(parsed.body),
                },
            },
        }
    },
}
