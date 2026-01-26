import { MetadataRoute } from 'next'
import { HashNode } from '@/lib/hashnode'
import { BASE_URL, INSIGHT_URL, GALLERY_URL, STATUS_URL, INFO_URL } from '@/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = BASE_URL

  // Get all posts from HashNode
  let allPosts: any[] = []
  let page = 1
  let hasNextPage = true

  try {
    while (hasNextPage) {
      const response = await HashNode.getArticles({
        pageSize: 20,
        page: page,
      })

      const posts = response?.data?.publication?.postsViaPage?.nodes || []
      allPosts = [...allPosts, ...posts]

      const pageInfo = response?.data?.publication?.postsViaPage?.pageInfo
      hasNextPage = pageInfo?.hasNextPage || false
      page++
    }
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error)
  }

  // Static pages including subdomains
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: INSIGHT_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: GALLERY_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: INFO_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: STATUS_URL,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.8,
    },
  ]

  // Dynamic blog post pages
  const dynamicPages: MetadataRoute.Sitemap = allPosts.map((post) => ({
    url: `${baseUrl}/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.publishedAt),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...dynamicPages]
}
