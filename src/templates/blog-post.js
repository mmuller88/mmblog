import React, { useRef, useEffect, useState, useCallback } from "react"
import Layout from "../components/layout"
import Img from "gatsby-image"
import { graphql } from "gatsby"
import PrevNext from "../components/prevnext"
import MetaTags from "../components/Metatags"
import Share from "../components/share"
import Breadcrumb from "../components/Breadcrumb"
import { calculateReadingTime, extractKeywords, generateBreadcrumbs } from "../utils/seo"
// import ContactForm from "../components/contactform"
import KoFi from "../components/KoFi"
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

  const getContentElements = useCallback(() => {
    if (!contentRef.current) return []
    return Array.from(
      contentRef.current.querySelectorAll(":scope > p, :scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > ul, :scope > ol, :scope > blockquote, :scope > pre")
    )
  }, [contentRef])

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

    const onEnded = () => {
      activeIdx.current = -1
      getContentElements().forEach((el) => el.classList.remove("audio-active"))
    }

    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("ended", onEnded)
    audio.addEventListener("pause", onEnded)
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate)
      audio.removeEventListener("ended", onEnded)
      audio.removeEventListener("pause", onEnded)
    }
  }, [audioRef, timing, getContentElements])

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
 } = props.data.markdownRemark.frontmatter
 const audioUrl = audio?.publicURL
 const timingUrl = audioTiming?.publicURL
 const audioRef = useRef(null)
 const contentRef = useRef(null)
 const { prev, next } = props.pageContext
 
 
 // Enhanced SEO data
 const content = props.data.markdownRemark.html;
 const excerpt = props.data.markdownRemark.excerpt;
 const readingTime = calculateReadingTime(content);
 const keywords = extractKeywords(content, tags, title);
 
 // Format dates for structured data (ISO format)
 const publishedDate = new Date(date).toISOString();
 const isValidDate = date && date !== "1970-01-01";
 
 // Generate breadcrumbs (posts are on homepage, no separate /blog page)
 const breadcrumbs = generateBreadcrumbs(props.location.pathname, title, []);
 
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
    
    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
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
       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="6.18" cy="17.82" r="2.18"/>
        <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z"/>
       </svg>
       RSS
      </a>
    </div>

    {audioUrl ? (
     <div className="mb-6 w-full max-w-2xl">
      <p className="text-sm font-medium text-gray-700 mb-2">Listen to this post</p>
      <audio
       ref={audioRef}
       controls
       className="w-full h-10 rounded-lg border border-brand/40 bg-gray-50 accent-brand"
       preload="metadata"
       src={audioUrl}
      />
     </div>
    ) : null}

    <div
     className="flex justify-center items-center"
    >
     {image && image.childImageSharp && (
      <Img
       fluid={image.childImageSharp.fluid}
       alt={title}
       style={{ 
        maxWidth: "50%",
        height: "auto",
        objectFit: "contain",
       }}
      />
     )}
    </div>
    {audioUrl && timingUrl ? (
     <AudioTracker audioRef={audioRef} timingUrl={timingUrl} contentRef={contentRef} />
    ) : null}
    <div ref={contentRef} dangerouslySetInnerHTML={{ __html: content }} />
    <HeadingAnchorCopy contentRef={contentRef} contentKey={content} />
    {/* <div>
     <p>
      <KoFi color="#29abe0" id="T6T1BR59W" label="Buy me a Ko-fi" />
     </p>
    </div> */}
    {/* {showContact !== "no" ? <ContactForm /> : null} */}
    <div className="mb-4">
     <span className="text-gray-600">Tagged in: </span>
     {tags.map((tag, i) => (
      <React.Fragment key={i}>
       <a 
        href={`/tags/${tag}`}
        style={{ 
         textDecoration: 'none',
         backgroundColor: '#f3f4f6',
         padding: '2px 8px',
         borderRadius: '4px',
         color: '#374151',
         fontSize: '0.875rem',
         marginRight: '8px',
        }}
       >
        {tag}
       </a>
      </React.Fragment>
     ))}
     <span className="text-gray-400"> | </span>
     <a 
      href={tags.includes("de") ? "/rss-ger.xml" : "/rss.xml"} 
      className="inline-flex items-center gap-1 text-orange-500 hover:text-orange-600"
      style={{ textDecoration: 'none' }}
      title="RSS Feed"
     >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
       <circle cx="6.18" cy="17.82" r="2.18"/>
       <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z"/>
      </svg>
      RSS
     </a>
    </div>
    <Share title={title} url={url} pathname={props.location.pathname} />
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
      fluid(maxWidth: 786) {
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
   }
  }
  site {
   siteMetadata {
    siteUrl
   }
  }
 }
`
