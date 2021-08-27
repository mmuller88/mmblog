import React from 'react';
import { Link, graphql } from 'gatsby'
import Layout from '../components/layout';
import '../pages/post.css'

function Tags(props) {
    const posts = props.data.allMarkdownRemark.edges;
    const { tag } = props.pageContext;
    return (
        <Layout>
          <div className="header">
            <h1>{`Available posts in ${tag}`}</h1>
          </div>
            <div>
              {posts.map(({ node }, i) => (
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


export default Tags;


export const query = graphql`

 query TagsQuery($tag: String!) {
allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { eq: [$tag, "eng"] } } }
    ) {
      edges {
        node {
          frontmatter {
            date(formatString: "Do MMMM YYYY")
            title
            show
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