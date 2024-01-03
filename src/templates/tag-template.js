import React from "react"
import {     graphql } from "gatsby"
import Layout from "../components/layout"
import "../pages/post.css"
import {PreviewPost} from "../pages/index"

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
     return <PreviewPost node={node} i={i} />
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
