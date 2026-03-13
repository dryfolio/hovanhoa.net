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

**Next.js 14 personal portfolio/blog** using the App Router, TypeScript, Tailwind CSS, and Apollo Client to fetch blog posts from Hashnode's Headless CMS via GraphQL.

### Data Flow

All blog content comes from Hashnode's GraphQL API. The Apollo Client in `src/lib/apollo-client.ts` is configured with the API URL and auth key. GraphQL query definitions live in `src/lib/queries.ts`, and `src/lib/hashnode.ts` exposes the API functions (`getArticles`, `getArticleBySlug`, etc.) used by page components.

### Key Directories

- `src/app/` — Next.js App Router pages. Dynamic blog post routes are at `src/app/[post]/page.tsx`. API routes include `/api/og` for dynamic Open Graph image generation.
- `src/components/` — React components. `article-content.tsx` renders Hashnode HTML content.
- `src/lib/` — API client, GraphQL queries, and TypeScript types.
- `src/constants/index.tsx` — Central config for site metadata, social links, and Hashnode host. **Start here when customizing the site identity.**

### Styling

Tailwind CSS with the `@tailwindcss/typography` plugin for rendered blog content. Prettier uses 4-space indentation and single quotes (see `.prettierrc.json`).

### Environment Variables

Defined in `.env` — Hashnode API URL/key/host and Cloudflare API credentials. The Hashnode host (`NEXT_PUBLIC_HASHNODE_HOST`) determines which publication's posts are fetched.
