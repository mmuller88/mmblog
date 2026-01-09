import React from "react"
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
 } = props.data.markdownRemark.frontmatter
 const { prev, next } = props.pageContext
 
 // Debug logging
 console.log('Full props data:', props.data);
 console.log('Frontmatter:', props.data.markdownRemark.frontmatter);
 console.log('Image from frontmatter:', props.data.markdownRemark.frontmatter.image);
 console.log('Image variable:', image);
 
 // Enhanced SEO data
 const content = props.data.markdownRemark.html;
 const excerpt = props.data.markdownRemark.excerpt;
 const readingTime = calculateReadingTime(content);
 const keywords = extractKeywords(content, tags, title);
 
 // Format dates for structured data (ISO format)
 const publishedDate = new Date(date).toISOString();
 const isValidDate = date && date !== "1970-01-01";
 
 // Generate breadcrumbs
 const breadcrumbs = generateBreadcrumbs(props.location.pathname, title, [
   { name: 'Blog', path: '/blog' }
 ]);
 
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
   />
   <div>
    {/* <Breadcrumb crumbs={breadcrumbs} siteUrl={url} /> */}
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
    <div dangerouslySetInnerHTML={{ __html: content }} />
    {/* <div>
     <p>
      <KoFi color="#29abe0" id="T6T1BR59W" label="Buy me a Ko-fi" />
     </p>
    </div> */}
    {/* {showContact !== "no" ? <ContactForm /> : null} */}
    <div className="flex flex-wrap items-center gap-2 mb-4">
     <span>Tagged in </span>
     {tags.map((tag, i) => (
      <a href={`/tags/${tag}`} key={i} className="ml-2">
       {tag}
      </a>
     ))}
     <span className="mx-2">|</span>
     <a 
      href={tags.includes("de") ? "/rss-ger.xml" : "/rss.xml"} 
      className="inline-flex items-center gap-1 text-orange-500 hover:text-orange-600"
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
   }
  }
  site {
   siteMetadata {
    siteUrl
   }
  }
 }
`
