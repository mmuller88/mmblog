import React from "react"
import { Link, graphql } from "gatsby"
import "./post.css"
import Layout from "../components/layout"

const IndexPage = (props) => {
 const postList = props.data.posts
 //const data = props.data.tags.group;
 return (
  <Layout>
   <div className="href">
    <a href={`tags/de`}>de</a>, <a href={`tags/eng`}>eng</a>,{" "}
    <a href={`tags`}>tags</a>, <a href={`rss.xml`}>rss</a>,{" "}
    <a href={`rss-ger.xml`}>rss-ger</a>
    {/* {
              data.filter((tag) => (tag.fieldValue === "eng" || tag.fieldValue === "de")).map(tag => (
                  
                  // <a href={`tags/${tag.fieldValue}`}>{tag.fieldValue} {`(${tag.totalCount})`}</a>
                  // <Link to={`tags/${tag.fieldValue}`} >
                  //     {tag.fieldValue} {`(${tag.totalCount})`}
                  // </Link>
              ))
          } */}
   </div>
   {/* <iframe width="560" height="315" src="https://www.youtube.com/embed/4JYaGylXEMc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> */}
   <div>
    {postList.edges.map(({ node }, i) => {
     const { imageUrl } = node.frontmatter
     return (
      <Link to={node.fields.slug} key={i} className="link">
       <div className="post-list">
        <h1>{node.frontmatter.title}</h1>
        <div style={{ display: "flex", alignItems: "center" }}>
         {imageUrl && (
          <div
           style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
           }}
          >
           {" "}
           <img
            src={`${imageUrl}?date=${new Date().getTime()}`}
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

export default IndexPage

export const pageQuery = graphql`
 query {
  posts: allMarkdownRemark(
   sort: { order: DESC, fields: [frontmatter___date] }
   filter: {
    fileAbsolutePath: { regex: "/content/" }
    frontmatter: { show: { ne: "no" } }
   }
  ) {
   edges {
    node {
     fields {
      slug
     }
     excerpt(pruneLength: 250)
     frontmatter {
      date(formatString: "Do MMMM YYYY")
      title
      imageUrl
      show
     }
    }
   }
  }
  tags: allMarkdownRemark(limit: 2000) {
   group(field: frontmatter___tags) {
    fieldValue
    totalCount
   }
  }
 }
`
