import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import "../pages/post.css"

function Tags(props) {
 const { tag } = props.pageContext
 let posts = props.data.allMarkdownRemark.edges
 if (tag !== "de") {
  posts = posts.filter(({ node }) => node.frontmatter.tags.includes("eng"))
 }

 return (
  <Layout>
   <div className="header">
    <h1>{`Available posts in ${tag}`}</h1>
   </div>
   <div>
    {posts.map(({ node }, i) => {
     const { imagePreviewUrl } = node.frontmatter
     return (
      <Link to={node.fields.slug} key={i} className="link">
       <div className="post-list">
        <h1>{node.frontmatter.title}</h1>
        <div style={{ display: "flex", alignItems: "center" }}>
         {imagePreviewUrl && (
          <div
           style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
           }}
          >
           {" "}
           <img
            src={imagePreviewUrl}
            alt="Title"
            style={{
             width: "50%",
             height: "auto",
             alignContent: "center",
             justifySelf: "center",
            }}
           />
          </div>
         )}
         <div>
          <span>{node.frontmatter.date}</span>
          <p>{node.excerpt}</p>
         </div>
        </div>
       </div>
      </Link>
     )
    })}
   </div>
  </Layout>
 )
}

export default Tags

export const query = graphql`
 query TagsQuery($tag: String!) {
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
      imagePreviewUrl
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
