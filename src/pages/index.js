import React from "react"
import { Link, graphql } from "gatsby"
import "./post.css"
import Layout from "../components/layout"

export const PreviewPost = (props) => {
 //   if (!props.node) return null
 const { image } = props.node.frontmatter
 const imageSrc = image?.childImageSharp?.resize?.src || image
 return (
  <Link to={props.node.fields.slug} key={props.i} className="link">
   <div className="post-list">
    <h1>{props.node.frontmatter.title}</h1>
    <div className="post"
    //  style={{
    //   display: "flex",
    //   flexDirection: "column",
    //   alignItems: "center",
    //   gap: "26px",
      
    //  }}
    >
     {imageSrc && (
      <div
       className="flex justify-center items-center"
       style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
       }}
      >
       {" "}
       <img
        src={imageSrc}
        alt={props.node.frontmatter.title}
        style={{
         width: "100%",
         height: "auto",
         alignContent: "center",
         justifySelf: "center",
        }}
       />
      </div>
     )}
     <div>
      <span>{props.node.frontmatter.date}</span>
      <p>{props.node.excerpt}</p>
     </div>
    </div>
   </div>
  </Link>
 )
}

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
     return <PreviewPost node={node} i={i} />
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
      image {
       childImageSharp {
        resize(width: 1000, height: 420) {
         src
        }
       }
      }
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
