import React from "react"
import { Link, graphql } from "gatsby"
import "./post.css"
import Layout from "../components/layout"
import MetaTags from "../components/Metatags"

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
 const siteUrl = props.data.site.siteMetadata.siteUrl
 const siteTitle = props.data.site.siteMetadata.title
 const siteDescription = props.data.site.siteMetadata.description
 
 return (
  <Layout>
   <MetaTags
    title={siteTitle}
    description={siteDescription}
    url={siteUrl}
    pathname="/"
    isArticle={false}
   />
   <div className="href">
    <a href={`tags/de`}>de</a>, <a href={`tags/eng`}>eng</a>,{" "}
    <a href={`tags`}>tags</a>, <a href={`rss.xml`} className="inline-flex items-center gap-1">
     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="6.18" cy="17.82" r="2.18"/>
      <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z"/>
     </svg>
     rss
    </a>,{" "}
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
  site {
   siteMetadata {
    siteUrl
    title
    description
   }
  }
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
