/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'hovanhoa.net',
            },
        ],
    },
    // Posts moved to blog.hovanhoa.net — keep old links working.
    async redirects() {
        const slugs = [
            '2025-rewind',
            'building-a-url-shortener-service-using-golang',
            'building-an-ai-agent-in-go',
            'cap-theorem-in-distributed-systems',
            'go-concurrency-goroutines-channels',
            'jenkins-cicd-on-aws-ec2',
            'live-reload-in-go-with-air',
            'load-testing-k6-search-optimization',
            'looking-back-at-2024',
            'thundering-herd-in-distributed-systems',
            'why-i-chose-twitter-snowflake-id',
        ]
        return slugs.map((slug) => ({
            source: `/${slug}`,
            destination: `https://blog.hovanhoa.net/${slug}`,
            permanent: true,
        }))
    },
}

module.exports = nextConfig
