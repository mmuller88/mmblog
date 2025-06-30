import React from 'react';
import { Helmet } from 'react-helmet'

function Metatags(props) {
    const {
        title,
        description,
        thumbnail,
        url,
        pathname = '',
        keywords = [],
        author = 'Martin Mueller',
        publishedDate,
        modifiedDate,
        tags = [],
        readingTime,
        isArticle = false
    } = props;

    // Ensure tags is always an array to prevent iteration errors
    const safeTags = Array.isArray(tags) ? tags : [];
    const safeKeywords = Array.isArray(keywords) ? keywords : [];

    const canonicalUrl = url + pathname;
    const keywordString = safeKeywords.length > 0 ? safeKeywords.join(', ') : safeTags.join(', ');
    
    // JSON-LD structured data for articles
    const articleStructuredData = isArticle ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "description": description,
        "author": {
            "@type": "Person",
            "name": author,
            "url": url,
            "sameAs": [
                "https://twitter.com/MartinMueller_",
                "https://github.com/mmuller88",
                "https://www.linkedin.com/in/martin-mueller-dev/"
            ]
        },
        "publisher": {
            "@type": "Organization",
            "name": "Martin Mueller's Blog",
            "url": url,
            "logo": {
                "@type": "ImageObject",
                "url": `${url}/avatarIcon.jpeg`
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": canonicalUrl
        },
        "url": canonicalUrl,
        "datePublished": publishedDate,
        "dateModified": modifiedDate || publishedDate,
        "keywords": keywordString,
        ...(thumbnail && {
            "image": {
                "@type": "ImageObject",
                "url": thumbnail,
                "width": 1200,
                "height": 630
            }
        }),
        ...(readingTime && {
            "timeRequired": `PT${readingTime}M`
        })
    } : null;

    // Organization structured data
    const organizationStructuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Martin Mueller",
        "url": url,
        "logo": `${url}/avatarIcon.jpeg`,
        "sameAs": [
            "https://twitter.com/MartinMueller_",
            "https://github.com/mmuller88",
            "https://www.linkedin.com/in/martin-mueller-dev/"
        ]
    };

    return (
        <Helmet
            title={title}
            link={[
                { rel: 'canonical', href: canonicalUrl },
                { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
                { rel: 'preconnect', href: 'https://www.google-analytics.com' },
                { rel: 'dns-prefetch', href: 'https://api.ab.martinmueller.dev' }
            ]}
            meta={[
                { name: 'title', content: title },
                { name: 'description', content: description },
                ...(keywordString ? [{ name: 'keywords', content: keywordString }] : []),
                { name: 'author', content: author },
                { name: 'robots', content: 'index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large' },
                { name: 'googlebot', content: 'index, follow' },
                { name: 'bingbot', content: 'index, follow' },
                { name: 'language', content: 'English' },
                { name: 'revisit-after', content: '7 days' },
                { name: 'distribution', content: 'global' },
                { name: 'rating', content: 'general' },
                
                // Open Graph
                { property: 'og:type', content: isArticle ? 'article' : 'website' },
                { property: 'og:site_name', content: 'Martin Mueller\'s Blog' },
                { property: 'og:title', content: title },
                { property: 'og:description', content: description },
                { property: 'og:url', content: canonicalUrl },
                { property: 'og:locale', content: 'en_US' },
                ...(thumbnail ? [
                    { property: 'og:image', content: thumbnail },
                    { property: 'og:image:secure_url', content: thumbnail },
                    { property: 'og:image:width', content: '1200' },
                    { property: 'og:image:height', content: '630' },
                    { property: 'og:image:alt', content: title }
                ] : []),
                ...(isArticle && publishedDate ? [
                    { property: 'article:published_time', content: publishedDate },
                    { property: 'article:author', content: author },
                    { property: 'article:section', content: 'Technology' }
                ] : []),
                ...(isArticle && modifiedDate ? [
                    { property: 'article:modified_time', content: modifiedDate }
                ] : []),
                ...(isArticle && safeTags.length > 0 ? 
                    safeTags.map(tag => ({ property: 'article:tag', content: tag })) : []
                ),

                // Twitter Card
                { name: 'twitter:card', content: 'summary_large_image' },
                { name: 'twitter:site', content: '@MartinMueller_' },
                { name: 'twitter:creator', content: '@MartinMueller_' },
                { name: 'twitter:title', content: title },
                { name: 'twitter:description', content: description },
                ...(thumbnail ? [
                    { name: 'twitter:image', content: thumbnail },
                    { name: 'twitter:image:alt', content: title }
                ] : []),

                // Additional meta tags for better SEO
                { name: 'theme-color', content: '#663399' },
                { name: 'msapplication-TileColor', content: '#663399' },
                { name: 'application-name', content: 'Martin Mueller\'s Blog' },
                { name: 'apple-mobile-web-app-title', content: 'Martin Mueller\'s Blog' },
                { name: 'apple-mobile-web-app-capable', content: 'yes' },
                { name: 'mobile-web-app-capable', content: 'yes' }
            ]}
        >
            <html lang="en" />
            {/* JSON-LD Structured Data */}
            {articleStructuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(articleStructuredData)}
                </script>
            )}
            <script type="application/ld+json">
                {JSON.stringify(organizationStructuredData)}
            </script>
        </Helmet>
    )
}

export default Metatags;