import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import MetaTags from "../components/Metatags"
import "../pages/post.css"
import {PreviewPost} from "../pages/index"

function Tags(props) {
 const { tag } = props.pageContext
 const siteUrl = props.data.site.siteMetadata.siteUrl
 let posts = props.data.allMarkdownRemark.edges
 if (tag !== "de") {
  posts = posts.filter(({ node }) => node.frontmatter.tags.includes("eng"))
 }
 
 const tagTitle = tag.charAt(0).toUpperCase() + tag.slice(1)
 const postCount = posts.length

 return (
  <Layout>
   <MetaTags
    title={`${tagTitle} - Martin Mueller's Blog`}
    description={`Browse ${postCount} articles about ${tag} on Martin Mueller's technology blog. Expert insights on AWS, cloud architecture, and software engineering.`}
    url={siteUrl}
    pathname={`/tags/${tag}`}
    isArticle={false}
   />
   <div className="header">
    <h1>{`Available posts in ${tag}`}</h1>
   </div>
   <div>
    {posts.map(({ node }, i) => {
     // Transform the image object to a string URL for PreviewPost component
     const processedNode = {
      ...node,
      frontmatter: {
       ...node.frontmatter,
       image: node.frontmatter.image 
        ? (node.frontmatter.image.childImageSharp?.resize?.src || node.frontmatter.image.publicURL || node.frontmatter.image)
        : null
      }
     }
     return <PreviewPost node={processedNode} i={i} />
    })}
   </div>
  </Layout>
 )
}

export default Tags

export const query = graphql`
 query TagsQuery($tag: String!) {
  site {
   siteMetadata {
    siteUrl
   }
  }
  allMarkdownRemark(
   limit: 2000
   sort: { fields: [frontmatter___date], order: DESC }
   filter: { frontmatter: { tags: { in: [$tag] } } }
  ) {
   edges {
    node {
     frontmatter {
      date(formatString: "Do MMMM YYYY")
      title
      image {
       childImageSharp {
        resize(width: 1000, height: 420) {
         src
        }
       }
       publicURL
      }
      show
      tags
     }
     fields {
      slug
     }
     excerpt(pruneLength: 250)
    }
   }
  }
 }
`
