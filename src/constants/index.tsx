import Link from 'next/link'

const NAME = 'hovanhoa'
const BASE_URL = 'https://hovanhoa.net'
const STATUS_URL = 'https://status.hovanhoa.net'
const TWITTER = '_hovanhoa_'
const LINKEDIN = 'hovanhoa'
const GITHUB = 'hovanhoa'
const IMAGE = '/avatar.png'
const INSIGHT_URL = 'https://insight.hovanhoa.net'
const GALLERY_URL = 'https://gallery.hovanhoa.net'
const OG_IMAGE_BG = '/og-bg.jpg'
const HOST = 'hovanhoa.hashnode.dev'
const HASHNODE_API = 'https://gql.hashnode.com'
const ROLE = 'Software Engineer'

const DESCRIPTION = (
    <>
        Hey there! 👋 I&apos;m Hòa. <br/>
        <br/> Software Engineer with 3+ years of experience. I am confident in
        my knowledge of software development concepts, industry best practices,
        and modern software technologies.
        <br/>
        <br/>
        Tech stacks:{' '}
        <Link href={'https://go.dev/'} target="_blank" className="text-sky-600">
            Golang
        </Link>{' '}
        <Link
            href={'https://www.python.org/'}
            target="_blank"
            className="text-sky-600"
        >
            Python
        </Link>{' '}
        <Link
            href={'https://www.postgresql.org/'}
            target="_blank"
            className="text-sky-600"
        >
            PostgreSQL
        </Link>{' '}
        <Link
            href={'https://www.mongodb.com/'}
            target="_blank"
            className="text-sky-600"
        >
            MongoDB
        </Link>{' '}
        <Link
            href={'https://aws.amazon.com/'}
            target="_blank"
            className="text-sky-600"
        >
            AWS
        </Link>{' '}
        <Link
            href={'https://cloud.google.com/'}
            target="_blank"
            className="text-sky-600"
        >
            GCP
        </Link>
        <br/> <br/>
        Check out {' '}
        <Link href={'https://contact.hovanhoa.net'} target="_blank" className="text-sky-600">
            here
        </Link>
        {' '}to connect with me!
    </>
)

export {
    NAME,
    TWITTER,
    LINKEDIN,
    GITHUB,
    IMAGE,
    DESCRIPTION,
    HOST,
    INSIGHT_URL,
    GALLERY_URL,
    HASHNODE_API,
    OG_IMAGE_BG,
    BASE_URL,
    STATUS_URL,
    ROLE,
}
