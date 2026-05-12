# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Run ESLint
npm run format       # Format TS and Markdown with Prettier
npm run format-check # Check formatting without modifying
```

## Architecture

**Next.js 14 personal portfolio/blog** using the App Router, TypeScript, and Tailwind CSS. Blog content is authored as local Markdown files and rendered at build time.

### Data Flow

All blog content lives in `content/posts/<slug>.md` and is parsed by `src/lib/posts.ts`. Frontmatter is parsed with `gray-matter` and the body is converted to HTML with `marked`. The `Posts` module exposes `getArticles`, `getArticleBySlug`, `getAllSlugs`, and `getAllSummaries` for page components. Post images live under `public/posts/<slug>/`.

### Key Directories

- `content/posts/` — Source-of-truth Markdown files for blog posts. Each `.md` has frontmatter (`title`, `brief`, `publishedAt`, `tags`, `coverImage`).
- `public/posts/<slug>/` — Static assets (images) referenced by a post's markdown.
- `src/app/` — Next.js App Router pages. Dynamic blog post routes are at `src/app/[post]/page.tsx` and use `generateStaticParams` to prerender every post. API routes include `/api/og` for dynamic Open Graph image generation.
- `src/components/` — React components. `article-content.tsx` renders the post HTML.
- `src/lib/` — `posts.ts` (Markdown loader), shared types, and Cloudflare analytics client.
- `src/constants/index.tsx` — Central config for site metadata and social links. **Start here when customizing the site identity.**

### Styling

Tailwind CSS with the `@tailwindcss/typography` plugin for rendered blog content. Prismjs handles client-side syntax highlighting via `article-content.tsx`. Prettier uses 4-space indentation and single quotes (see `.prettierrc.json`).

### Adding a Post

1. Create `content/posts/<slug>.md` with frontmatter (`title`, `brief`, `publishedAt`, `tags`, `coverImage`).
2. Drop any referenced images into `public/posts/<slug>/` and link them from the markdown as `/posts/<slug>/<file>`.
3. The home page, dynamic route, sitemap, and `generateStaticParams` will pick the post up automatically.

### Environment Variables

Defined in `.env` — Cloudflare API credentials used by the analytics client. Blog content no longer depends on remote APIs.
