import Head from 'next/head'

interface SEOHeadProps {
  title?: string
  metaTitle?: string
  metaDescription?: string
  focusKeyword?: string
  ogImage?: string
  canonicalUrl?: string
  slug?: string
  publishedAt?: Date
  author?: {
    name: string
  }
  tags?: { name: string }[]
  excerpt?: string
}

export function SEOHead({
  title,
  metaTitle,
  metaDescription,
  focusKeyword,
  ogImage,
  canonicalUrl,
  slug,
  publishedAt,
  author,
  tags,
  excerpt
}: SEOHeadProps) {
  // Generate effective values
  const effectiveTitle = metaTitle || title || 'CMS Admin'
  const effectiveDescription = metaDescription || excerpt || 'Content Management System'
  const effectiveOgImage = ogImage || '/images/default-og.jpg'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ejemplo.com'
  const fullUrl = slug ? `${siteUrl}/posts/${slug}` : siteUrl
  const effectiveCanonical = canonicalUrl || fullUrl

  // Generate structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: effectiveTitle,
    description: effectiveDescription,
    image: effectiveOgImage,
    url: fullUrl,
    datePublished: publishedAt?.toISOString(),
    dateModified: publishedAt?.toISOString(),
    author: {
      '@type': 'Person',
      name: author?.name || 'Admin'
    },
    publisher: {
      '@type': 'Organization',
      name: 'CMS Admin',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`
      }
    },
    keywords: tags?.map(tag => tag.name).join(', ')
  }

  return (
    <Head>
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      {/* Basic Meta Tags */}
      <title>{effectiveTitle}</title>
      <meta name="description" content={effectiveDescription} />
      {focusKeyword && <meta name="keywords" content={focusKeyword} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={effectiveCanonical} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={effectiveTitle} />
      <meta property="og:description" content={effectiveDescription} />
      <meta property="og:image" content={effectiveOgImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="CMS Admin" />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={effectiveTitle} />
      <meta name="twitter:description" content={effectiveDescription} />
      <meta name="twitter:image" content={effectiveOgImage} />
      
      {/* Article specific meta tags */}
      {author && <meta name="author" content={author.name} />}
      {publishedAt && (
        <meta property="article:published_time" content={publishedAt.toISOString()} />
      )}
      {tags && tags.length > 0 && (
        <>
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag.name} />
          ))}
        </>
      )}
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      
      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="content-language" content="es" />
    </Head>
  )
}