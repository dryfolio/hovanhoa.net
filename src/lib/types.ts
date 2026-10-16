export type PostExcerpt = {
    id: string
    title: string
    brief: string
    url: string
    tags: Tag[]
    publishedAt: string
    updatedAt?: string
    coverImage: {
        url: string
    }
    slug: string
    readTimeInMinutes: number
}

export type Tag = {
    name: string
    category?:
        | 'blue'
        | 'teal'
        | 'indigo'
        | 'amber'
        | 'orange'
        | 'violet'
        | 'green'
        | 'pink'
}
