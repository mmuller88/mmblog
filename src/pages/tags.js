import React from 'react';
import { 
  //Link, 
  graphql } from "gatsby"
import Layout from '../components/layout';
import './post.css';

function TagsPage(props) {

    const data = props.data.allMarkdownRemark.group

    return (
        <Layout>
            <div className="href">
                <h1>All tags</h1>
                {
                    data.map(tag => (
                        <a href={`/tags/${tag.fieldValue}`}>{tag.fieldValue} {`(${tag.totalCount})`}, </a>
                        // <Link to={`tags/${tag.fieldValue}`} >
                        //     {tag.fieldValue} {`(${tag.totalCount})`}
                        // </Link>
                    ))
                }
            </div>
        </Layout>
    )

}

export default TagsPage;


export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      filter: { frontmatter: { tags: { eq: "eng" } } }
      limit: 2000) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }

`