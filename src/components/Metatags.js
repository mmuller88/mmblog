import React from "react"
import { Helmet } from "react-helmet-async"
import ssrHead from "../utils/ssrHead"

function Metatags(props) {
 const {
  title,
  description,
  thumbnail,
  url,
  pathname = "",
  keywords = [],
  author = "Martin Mueller",
  publishedDate,
  modifiedDate,
  tags = [],
  readingTime,
  isArticle = false,
  engUrl,
  gerUrl,
  tldr,
  faq = [],
  locale = "en_US",
  language: htmlLanguage = "en",
  imageAlt,
  imageWidth = 1200,
  imageHeight = 630,
  extraJsonLd = null,
  noindex = false,
 } = props

 // Ensure tags is always an array to prevent iteration errors
 const safeTags = Array.isArray(tags) ? tags : []
 const safeKeywords = Array.isArray(keywords) ? keywords : []
 const safeFaq = Array.isArray(faq) ? faq : []

 const canonicalUrl = url + pathname
 const keywordString =
  safeKeywords.length > 0 ? safeKeywords.join(", ") : safeTags.join(", ")

 // Determine language from tags (overridden by htmlLanguage prop on static pages)
 const language = htmlLanguage || (safeTags.includes("de") ? "de" : "en")
 const metaLanguage = language === "de" ? "German" : "English"
 const ogImageAlt = imageAlt || title

 // Map tags to expertise areas (filter out language tags and common non-expertise tags)
 const expertiseTags = safeTags.filter(
  (tag) => !["de", "eng", "nofeed", "2026"].includes(tag.toLowerCase())
 )
 const knowsAbout = [
  "AWS",
  "Cloud Computing",
  "Serverless",
  "CDK",
  "Infrastructure as Code",
  "Software Engineering",
  "DevOps",
  ...expertiseTags,
 ]

 // JSON-LD structured data for articles
 const articleStructuredData = isArticle
  ? {
     "@context": "https://schema.org",
     "@type": "BlogPosting",
     headline: title,
     description: description,
     ...(tldr || description
      ? {
         abstract: tldr || description,
        }
      : {}),
     author: {
      "@type": "Person",
      name: author,
      url: url,
      jobTitle: "AWS Solutions Architect & Software Engineer",
      knowsAbout: knowsAbout,
      sameAs: [
       "https://twitter.com/MartinMueller_",
       "https://github.com/mmuller88",
       "https://www.linkedin.com/in/martin-mueller-dev/",
      ],
     },
     publisher: {
      "@type": "Organization",
      name: "Martin Mueller's Blog",
      url: url,
      logo: {
       "@type": "ImageObject",
       url: `${url}/avatarIcon.jpeg`,
      },
     },
     mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
     },
     url: canonicalUrl,
     datePublished: publishedDate,
     dateModified: modifiedDate || publishedDate,
     keywords: keywordString,
     inLanguage: language,
     isAccessibleForFree: true,
     speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", "article p:first-of-type"],
     },
     ...(thumbnail && {
      image: {
       "@type": "ImageObject",
       url: thumbnail,
       width: imageWidth,
       height: imageHeight,
      },
     }),
     ...(readingTime && {
      timeRequired: `PT${readingTime}M`,
     }),
    }
  : null

 // FAQ structured data
 const faqStructuredData =
  safeFaq.length > 0
   ? {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: safeFaq.map((item) => ({
       "@type": "Question",
       name: item.q,
       acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
       },
      })),
     }
   : null

 // Organization structured data
 const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Martin Mueller",
  url: url,
  logo: `${url}/avatarIcon.jpeg`,
  sameAs: [
   "https://twitter.com/MartinMueller_",
   "https://github.com/mmuller88",
   "https://www.linkedin.com/in/martin-mueller-dev/",
  ],
 }

 const toAbsolute = (href) => {
  if (!href) return ""
  if (/^https?:\/\//i.test(href)) return href
  const path = href.startsWith("/") ? href : `/${href}`
  return `${url}${path}`
 }

 const pageLang = language === "de" ? "de" : "en"
 const enHref = engUrl
  ? toAbsolute(engUrl)
  : pageLang === "en"
    ? canonicalUrl
    : ""
 const deHref = gerUrl
  ? toAbsolute(gerUrl)
  : pageLang === "de"
    ? canonicalUrl
    : ""

 const hreflangLinks = []
 if (enHref) {
  hreflangLinks.push({ rel: "alternate", hreflang: "en", href: enHref })
 }
 if (deHref) {
  hreflangLinks.push({ rel: "alternate", hreflang: "de", href: deHref })
 }
 if (enHref && deHref) {
  hreflangLinks.push({
   rel: "alternate",
   hreflang: "x-default",
   href: enHref,
  })
 }

 ssrHead.setSsrLang(language)

 const robotsContent = noindex
  ? "noindex, follow"
  : "index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large"

 return (
  <Helmet
   title={title}
   link={[
    { rel: "canonical", href: canonicalUrl },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "dns-prefetch", href: "https://api.ab.martinmueller.dev" },
    ...hreflangLinks,
   ]}
   meta={[
    { name: "title", content: title },
    { name: "description", content: description },
    ...(keywordString ? [{ name: "keywords", content: keywordString }] : []),
    { name: "author", content: author },
    { name: "robots", content: robotsContent },
    { name: "googlebot", content: robotsContent },
    { name: "bingbot", content: robotsContent },
    { name: "language", content: metaLanguage },
    { name: "revisit-after", content: "7 days" },
    { name: "distribution", content: "global" },
    { name: "rating", content: "general" },

    // Open Graph
    { property: "og:type", content: isArticle ? "article" : "website" },
    { property: "og:site_name", content: "Martin Mueller's Blog" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: canonicalUrl },
    { property: "og:locale", content: locale },
    ...(thumbnail
     ? [
        { property: "og:image", content: thumbnail },
        { property: "og:image:secure_url", content: thumbnail },
        { property: "og:image:width", content: String(imageWidth) },
        { property: "og:image:height", content: String(imageHeight) },
        { property: "og:image:alt", content: ogImageAlt },
       ]
     : []),
    ...(isArticle && publishedDate
     ? [
        { property: "article:published_time", content: publishedDate },
        { property: "article:author", content: author },
        { property: "article:section", content: "Technology" },
       ]
     : []),
    ...(isArticle && modifiedDate
     ? [{ property: "article:modified_time", content: modifiedDate }]
     : []),
    ...(isArticle && safeTags.length > 0
     ? safeTags.map((tag) => ({ property: "article:tag", content: tag }))
     : []),

    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: "@MartinMueller_" },
    { name: "twitter:creator", content: "@MartinMueller_" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    ...(thumbnail
     ? [
        { name: "twitter:image", content: thumbnail },
        { name: "twitter:image:alt", content: ogImageAlt },
       ]
     : []),

    // Additional meta tags for better SEO
    { name: "theme-color", content: "#663399" },
    { name: "msapplication-TileColor", content: "#663399" },
    { name: "application-name", content: "Martin Mueller's Blog" },
    { name: "apple-mobile-web-app-title", content: "Martin Mueller's Blog" },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    { name: "mobile-web-app-capable", content: "yes" },
   ]}
  >
   <html lang={language} />
   {/* JSON-LD Structured Data */}
   {articleStructuredData && (
    <script type="application/ld+json">
     {JSON.stringify(articleStructuredData)}
    </script>
   )}
   {faqStructuredData && (
    <script type="application/ld+json">
     {JSON.stringify(faqStructuredData)}
    </script>
   )}
   <script type="application/ld+json">
    {JSON.stringify(organizationStructuredData)}
   </script>
   {extraJsonLd && (
    <script type="application/ld+json">{JSON.stringify(extraJsonLd)}</script>
   )}
  </Helmet>
 )
}

export default Metatags
