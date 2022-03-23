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
 const { title, image, tags, date, engUrl, gerUrl, showContact } =
  props.data.markdownRemark.frontmatter
 const { prev, next } = props.pageContext
 return (
  <Layout>
   <MetaTags
    title={title}
    description={props.data.markdownRemark.excerpt}
    thumbnail={thumbnail && url + thumbnail}
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
      imgStyle={{ objectFit: "contain" }}
     />
    )}
    <div dangerouslySetInnerHTML={{ __html: props.data.markdownRemark.html }} />
    {gerUrl
     ? "Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:"
     : "I love to work on Content Management Open Source projects. A lot from my stuff you can already use on https://github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:"}
    <a
     href="https://patreon.com/bePatron?u=29010217"
     data-patreon-widget-type="become-patron-button"
    >
     Become a Patreon!
    </a>
    <script
     async
     src="https://c6.patreon.com/becomePatronButton.bundle.js"
    ></script>
    <p>
     <KoFi color="#29abe0" id="T6T1BR59W" label="Buy me a Ko-fi" />
    </p>
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
   }
  }
  site {
   siteMetadata {
    siteUrl
   }
  }
 }
`
