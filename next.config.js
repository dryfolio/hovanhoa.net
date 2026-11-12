/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'hovanhoa.net',
            },
            {
                protocol: 'https',
                hostname: 'blog.hovanhoa.net',
            },
        ],
    },
}

module.exports = nextConfig
