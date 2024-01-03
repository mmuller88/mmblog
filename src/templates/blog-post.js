import React from "react"
import Layout from "../components/layout"
import Img from "gatsby-image"
import { graphql } from "gatsby"
import PrevNext from "../components/prevnext"
import MetaTags from "../components/Metatags"
import Share from "../components/share"
import ContactForm from "../components/contactform"
import KoFi from "../components/KoFi"

function BlogPost(props) {
 const url = props.data.site.siteMetadata.siteUrl
 const thumbnail =
  props.data.markdownRemark.frontmatter.image &&
  props.data.markdownRemark.frontmatter.image.childImageSharp.resize.src
 const {
  title,
  image,
  imageVisitorUrl,
  imagePreviewUrl,
  tags,
  date,
  engUrl,
  gerUrl,
  showContact,
 } = props.data.markdownRemark.frontmatter
 const { prev, next } = props.pageContext
 return (
  <Layout>
   <MetaTags
    title={title}
    description={props.data.markdownRemark.excerpt}
    thumbnail={(thumbnail && url + thumbnail) || imagePreviewUrl}
    url={url}
    pathname={props.location.pathname}
   />
   <div>
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
    <span>{date}</span>
    {image && (
     <Img
      fluid={image.childImageSharp.fluid}
      imgStyle={{ objectFit: "contain", maxWidth: "100%", height: "auto" }}
     />
    )}
    {imageVisitorUrl && (
     <img
      src={imageVisitorUrl}
      alt="Title"
      style={{ maxWidth: "100%", height: "auto" }}
     />
    )}
    <div dangerouslySetInnerHTML={{ __html: props.data.markdownRemark.html }} />
    <div>
     <p>
      <KoFi color="#29abe0" id="T6T1BR59W" label="Buy me a Ko-fi" />
     </p>
    </div>
    {showContact !== "no" ? <ContactForm /> : null}
    <div>
     <span>Tagged in </span>
     {tags.map((tag, i) => (
      <a href={`/tags/${tag}`} key={i} style={{ marginLeft: "10px" }}>
       {tag}
      </a>
     ))}
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
    date(formatString: "Do MMMM YYYY")
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
    imageVisitorUrl
    imagePreviewUrl
   }
  }
  site {
   siteMetadata {
    siteUrl
   }
  }
 }
`
