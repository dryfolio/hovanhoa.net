import { MetadataRoute } from 'next'
import {
    BASE_URL,
    BLOG_URL,
    INSIGHT_URL,
    GALLERY_URL,
    STATUS_URL,
    INFO_URL,
    MUSIC_URL,
} from '@/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = BASE_URL

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'always',
            priority: 1.0,
        },
        {
            url: BLOG_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
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
        {
            url: MUSIC_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
    ]
}
