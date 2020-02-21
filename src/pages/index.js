import React from 'react'
import { Link, graphql } from 'gatsby'
import './post.css';
import Layout from '../components/layout'

const IndexPage = (props) => {
  const postList = props.data.posts;
  const data = props.data.tags.group;
  return (
    <Layout>
      <div className="tags">
          {/* <h1>Language</h1> */}
          {
              data.filter((tag) => (tag.fieldValue === "eng" || tag.fieldValue === "de")).map(tag => (
                  <a href={`tags/${tag.fieldValue}`}>{tag.fieldValue} {`(${tag.totalCount})`}</a>
                  // <Link to={`tags/${tag.fieldValue}`} >
                  //     {tag.fieldValue} {`(${tag.totalCount})`}
                  // </Link>
              ))
          }
      </div>
      <div>
        {postList.edges.map(({ node }, i) => (
          <Link to={node.fields.slug} key={i} className="link" >
            <div className="post-list">
              <h1>{node.frontmatter.title}</h1>
              <span>{node.frontmatter.date}</span>
              <p>{node.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  )
}

export default IndexPage;

export const pageQuery = graphql`
  query {
    posts: allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { fileAbsolutePath: {regex : "\/content/"}, frontmatter: { show: { ne: "no" }} }
      ) {
      edges {
        node {
          fields{
            slug
          }
          excerpt(pruneLength: 250)
          frontmatter {
            date(formatString: "Do MMMM YYYY")
            title
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
