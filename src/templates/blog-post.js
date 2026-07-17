import React, { useRef, useEffect, useState, useCallback } from "react"
import Layout from "../components/layout"
import Img from "gatsby-image"
import { graphql } from "gatsby"
import PrevNext from "../components/prevnext"
import MetaTags from "../components/Metatags"
import Share from "../components/share"
import Breadcrumb from "../components/Breadcrumb"
import LikeButton from "../components/LikeButton"
import Comments from "../components/Comments"
import {
 calculateReadingTime,
 extractKeywords,
 generateBreadcrumbs,
} from "../utils/seo"
// import ContactForm from "../components/contactform"
import KoFi from "../components/KoFi"
import TableOfContents from "../components/TableOfContents"
import "../styles/heading-anchors.css"

function HeadingAnchorCopy({ contentRef, contentKey }) {
 const [toast, setToast] = useState(null)

 useEffect(() => {
  const root = contentRef.current
  if (!root) return undefined

  let toastTimer
  const anchors = root.querySelectorAll("a.heading-anchor")
  const onClick = (e) => {
   e.preventDefault()
   const a = e.currentTarget
   const heading = a.closest("h2, h3, h4")
   const id = heading && heading.id
   if (!id) return
   heading.scrollIntoView({ behavior: "smooth", block: "start" })
   const url = `${window.location.origin}${window.location.pathname}#${id}`
   navigator.clipboard.writeText(url).then(() => {
    const { pathname, search } = window.location
    window.history.replaceState(null, "", `${pathname}${search}#${id}`)
    setToast("Copied!")
    if (toastTimer) window.clearTimeout(toastTimer)
    toastTimer = window.setTimeout(() => setToast(null), 1500)
   })
  }

  anchors.forEach((a) => {
   a.setAttribute("aria-label", "Copy link to this section")
   a.addEventListener("click", onClick)
  })
  return () => {
   if (toastTimer) window.clearTimeout(toastTimer)
   anchors.forEach((a) => a.removeEventListener("click", onClick))
  }
 }, [contentRef, contentKey])

 return toast ? (
  <div
   className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-md bg-gray-900 px-3 py-2 text-sm text-white shadow-lg"
   role="status"
  >
   {toast}
  </div>
 ) : null
}

function ExternalLinks({ contentRef, contentKey, siteUrl }) {
 useEffect(() => {
  const root = contentRef.current
  if (!root) return undefined

  root.querySelectorAll("a:not(.heading-anchor)").forEach((a) => {
   const href = a.getAttribute("href")
   if (!href || href.startsWith("#")) return

   let openBlank = false
   try {
    const url = new URL(href, siteUrl)
    const siteHost = new URL(siteUrl).hostname
    const path = url.pathname.replace(/\/$/, "") || "/"
    const isResume = path === "/resume" || path === "/resume-de"
    if (url.hostname !== siteHost) openBlank = true
    else if (isResume) openBlank = true
    else return
   } catch {
    return
   }

   if (!openBlank) return
   a.setAttribute("target", "_blank")
   a.setAttribute("rel", "noopener noreferrer")
  })
 }, [contentRef, contentKey, siteUrl])

 return null
}

/** Match scripts/audio-blocks.js order; skip image-only <p>. */
function getAudioContentElements(root) {
 if (!root) return []
 return Array.from(
  root.querySelectorAll(
   ":scope > p, :scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > ul, :scope > ol, :scope > table, :scope > blockquote, :scope > pre"
  )
 ).filter((el) => {
  if (el.tagName !== "P") return true
  const clone = el.cloneNode(true)
  clone
   .querySelectorAll(
    "img, picture, noscript, .gatsby-resp-image-wrapper, .gatsby-resp-image-link"
   )
   .forEach((n) => n.remove())
  return Boolean(clone.textContent.replace(/\s+/g, " ").trim())
 })
}

function timingForBlock(timing, blockIdx) {
 if (!timing || blockIdx < 0) return null
 const entry = timing.find((row) => row.p === blockIdx)
 return entry ? entry.t : null
}

function AudioTracker({ audioRef, timingUrl, contentRef }) {
 const [timing, setTiming] = useState(null)
 const activeIdx = useRef(-1)

 useEffect(() => {
  if (!timingUrl) return
  fetch(timingUrl)
   .then((r) => r.json())
   .then(setTiming)
   .catch(() => {})
 }, [timingUrl])

 const getContentElements = useCallback(
  () => getAudioContentElements(contentRef.current),
  [contentRef]
 )

 useEffect(() => {
  const audio = audioRef.current
  if (!audio || !timing) return

  const onTimeUpdate = () => {
   const t = audio.currentTime
   let idx = -1
   for (let i = timing.length - 1; i >= 0; i--) {
    if (t >= timing[i].t) {
     idx = timing[i].p
     break
    }
   }

   if (idx === activeIdx.current) return
   activeIdx.current = idx

   const els = getContentElements()
   els.forEach((el, i) => {
    if (i === idx) {
     el.classList.add("audio-active")
     el.scrollIntoView({ behavior: "smooth", block: "center" })
    } else {
     el.classList.remove("audio-active")
    }
   })
  }

  const clearActive = () => {
   activeIdx.current = -1
   getContentElements().forEach((el) => el.classList.remove("audio-active"))
  }

  audio.addEventListener("timeupdate", onTimeUpdate)
  audio.addEventListener("ended", clearActive)
  return () => {
   audio.removeEventListener("timeupdate", onTimeUpdate)
   audio.removeEventListener("ended", clearActive)
  }
 }, [audioRef, timing, getContentElements])

 return null
}

function HeadingAudioPlay({ audioRef, timingUrl, contentRef, contentKey }) {
 const [timing, setTiming] = useState(null)

 useEffect(() => {
  if (!timingUrl) return
  fetch(timingUrl)
   .then((r) => r.json())
   .then(setTiming)
   .catch(() => {})
 }, [timingUrl])

 useEffect(() => {
  const root = contentRef.current
  const audio = audioRef.current
  if (!root || !audio || !timing) return undefined

  const els = getAudioContentElements(root)
  const buttons = []

  els.forEach((el, blockIdx) => {
   if (!/^H[2-4]$/.test(el.tagName)) return
   const t = timingForBlock(timing, blockIdx)
   if (t == null) return

   // Use <a> like heading-anchor so both share the same inline box model
   const btn = document.createElement("a")
   btn.href = "#"
   btn.className = "heading-audio-play"
   btn.setAttribute("role", "button")
   btn.setAttribute("aria-label", "Play audio from this section")
   btn.title = "Play from here"
   btn.innerHTML = `<svg aria-hidden="true" height="20" width="20" viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5v11l9-5.5-9-5.5z"/></svg>`

   const onClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    audio.currentTime = t
    audio.play().catch(() => {})
   }
   btn.addEventListener("click", onClick)

   const anchor = el.querySelector("a.heading-anchor")
   if (anchor && anchor.nextSibling) {
    el.insertBefore(btn, anchor.nextSibling)
   } else if (anchor) {
    anchor.after(btn)
   } else {
    el.prepend(btn)
   }
   buttons.push({ btn, onClick })
  })

  return () => {
   buttons.forEach(({ btn, onClick }) => {
    btn.removeEventListener("click", onClick)
    btn.remove()
   })
  }
 }, [audioRef, contentRef, contentKey, timing])

 return null
}

function BlogPost(props) {
 const url = props.data.site.siteMetadata.siteUrl
 const thumbnail =
  props.data.markdownRemark.frontmatter.image &&
  props.data.markdownRemark.frontmatter.image.childImageSharp.resize.src
 const {
  title,
  image,
  tags,
  date,
  engUrl,
  gerUrl,
  showContact,
  tldr,
  faq,
  audio,
  audioTiming,
  pdf,
 } = props.data.markdownRemark.frontmatter
 const audioUrl = audio?.publicURL
 const timingUrl = audioTiming?.publicURL
 const headings = props.data.markdownRemark.headings
 const audioRef = useRef(null)
 const contentRef = useRef(null)
 const [audioEngaged, setAudioEngaged] = useState(false)
 const { prev, next } = props.pageContext

 useEffect(() => {
  const audio = audioRef.current
  if (!audio) return undefined
  const onPlay = () => setAudioEngaged(true)
  audio.addEventListener("play", onPlay)
  return () => audio.removeEventListener("play", onPlay)
 }, [audioUrl])

 // Enhanced SEO data
 const content = props.data.markdownRemark.html
 const pdfUrl = pdf?.publicURL
 const pdfName = pdf?.base
 const html =
  pdfUrl && pdfName
   ? content
      .replaceAll(`href="${pdfName}"`, `href="${pdfUrl}"`)
      .replaceAll(`data="${pdfName}"`, `data="${pdfUrl}"`)
   : content
 const excerpt = props.data.markdownRemark.excerpt
 const readingTime = calculateReadingTime(content)
 const keywords = extractKeywords(content, tags, title)

 // Format dates for structured data (ISO format)
 const publishedDate = new Date(date).toISOString()
 const isValidDate = date && date !== "1970-01-01"

 // Generate breadcrumbs (posts are on homepage, no separate /blog page)
 const breadcrumbs = generateBreadcrumbs(props.location.pathname, title, [])

 const germanFormat = new Date(date).toLocaleDateString("de-DE", {
  year: "numeric",
  month: "long",
  day: "numeric",
 })

 const usFormat = new Date(date).toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
 })

 return (
  <Layout>
   <MetaTags
    title={title}
    description={excerpt}
    thumbnail={(thumbnail && url + thumbnail) || image}
    url={url}
    pathname={props.location.pathname}
    keywords={keywords}
    publishedDate={isValidDate ? publishedDate : undefined}
    tags={tags}
    readingTime={readingTime}
    isArticle={true}
    engUrl={engUrl}
    gerUrl={gerUrl}
    tldr={tldr}
    faq={faq}
   />
   <div>
    <Breadcrumb crumbs={breadcrumbs} siteUrl={url} />
    {engUrl ? (
     <div>
      <a href={engUrl}>Translate To English</a>
      <br></br>
     </div>
    ) : null}
    {gerUrl ? (
     <div>
      <a href={gerUrl}>Translate To German</a>
      <br></br>
     </div>
    ) : null}

    <br></br>
    <h1>{title}</h1>

    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
     {isValidDate && (
      <span>{tags.includes("de") ? germanFormat : usFormat}</span>
     )}
     <span>|</span>
     <span>{readingTime} min read</span>
     <span>|</span>
     <span>By Martin Mueller</span>
     <span>|</span>
     <a
      href={tags.includes("de") ? "/rss-ger.xml" : "/rss.xml"}
      className="inline-flex items-center gap-1 text-orange-500 hover:text-orange-600"
      title="RSS Feed"
     >
      <svg
       xmlns="http://www.w3.org/2000/svg"
       width="14"
       height="14"
       viewBox="0 0 24 24"
       fill="currentColor"
      >
       <circle cx="6.18" cy="17.82" r="2.18" />
       <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z" />
      </svg>
      RSS
     </a>
    </div>

    {audioUrl ? (
     <div
      className={
       audioEngaged
        ? "sticky top-0 z-40 -mx-4 mb-6 border-b border-gray-200 bg-white/95 px-4 py-2 backdrop-blur dark:border-gray-700 dark:bg-gray-900/95 sm:mx-0 sm:rounded-lg sm:border sm:px-3"
        : "mb-6 w-full max-w-2xl"
      }
     >
      {!audioEngaged ? (
       <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        Listen to this post
       </p>
      ) : null}
      <audio
       ref={audioRef}
       controls
       className="h-10 w-full max-w-2xl rounded-lg border border-brand/40 bg-gray-50 accent-brand dark:bg-gray-800"
       preload="metadata"
       src={audioUrl}
      />
     </div>
    ) : null}

    <div className="mb-6 w-full max-w-5xl mx-auto">
     {image && image.childImageSharp && (
      <Img
       fluid={image.childImageSharp.fluid}
       alt={title}
       className="h-auto w-full object-contain"
      />
     )}
    </div>
    {audioUrl && timingUrl ? (
     <>
      <AudioTracker
       audioRef={audioRef}
       timingUrl={timingUrl}
       contentRef={contentRef}
      />
      <HeadingAudioPlay
       audioRef={audioRef}
       timingUrl={timingUrl}
       contentRef={contentRef}
       contentKey={html}
      />
     </>
    ) : null}
    <TableOfContents headings={headings} tags={tags} />
    <div
     ref={contentRef}
     className="blog-post-content"
     dangerouslySetInnerHTML={{ __html: html }}
    />
    <HeadingAnchorCopy contentRef={contentRef} contentKey={html} />
    <ExternalLinks
     contentRef={contentRef}
     contentKey={html}
     siteUrl={url}
    />
    {/* <div>
     <p>
      <KoFi color="#29abe0" id="T6T1BR59W" label="Buy me a Ko-fi" />
     </p>
    </div> */}
    {/* {showContact !== "no" ? <ContactForm /> : null} */}
    <div className="mb-4">
     <span className="text-gray-600 dark:text-gray-400">Tagged in: </span>
     {tags.map((tag, i) => (
      <React.Fragment key={i}>
       <a
        href={`/tags/${tag}`}
        className="no-underline bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm mr-2 py-0.5 px-2 rounded"
       >
        {tag}
       </a>
      </React.Fragment>
     ))}
     <span className="text-gray-400 dark:text-gray-500"> | </span>
     <a
      href={tags.includes("de") ? "/rss-ger.xml" : "/rss.xml"}
      className="inline-flex items-center gap-1 text-orange-500 hover:text-orange-600 no-underline"
      title="RSS Feed"
     >
      <svg
       xmlns="http://www.w3.org/2000/svg"
       width="16"
       height="16"
       viewBox="0 0 24 24"
       fill="currentColor"
      >
       <circle cx="6.18" cy="17.82" r="2.18" />
       <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z" />
      </svg>
      RSS
     </a>
    </div>
    <Share title={title} url={url} pathname={props.location.pathname} />
    <LikeButton slug={props.location.pathname} />
    <Comments
     pathname={props.location.pathname}
     lang={tags.includes("de") ? "de" : "en"}
    />
    <PrevNext prev={prev && prev.node} next={next && next.node} />
   </div>
  </Layout>
 )
}

export default BlogPost

export const query = graphql`
 query PostQuery($slug: String!) {
  markdownRemark(fields: { slug: { eq: $slug } }) {
   html
   excerpt
   headings {
    id
    value
    depth
   }
   frontmatter {
    date
    title
    show
    tags
    engUrl
    gerUrl
    showContact
    tldr
    faq {
     q
     a
    }
    image {
     childImageSharp {
      resize(width: 1000, height: 420) {
       src
      }
      fluid(maxWidth: 1200) {
       ...GatsbyImageSharpFluid
      }
     }
    }
    audio {
     publicURL
    }
    audioTiming {
     publicURL
    }
    pdf {
     publicURL
     base
    }
   }
  }
  site {
   siteMetadata {
    siteUrl
   }
  }
 }
`
