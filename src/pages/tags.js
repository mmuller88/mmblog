import React from 'react';
import { 
  //Link, 
  graphql } from "gatsby"
import Layout from '../components/layout';
import MetaTags from '../components/Metatags';
import './post.css';

function TagsPage(props) {

    const data = props.data.allMarkdownRemark.group
    const siteUrl = props.data.site.siteMetadata.siteUrl

    return (
        <Layout>
            <MetaTags
                title="All Tags - Martin Mueller's Blog"
                description="Browse all topics and categories on Martin Mueller's technology blog. Find articles about AWS, CDK, serverless, cloud architecture, and more."
                url={siteUrl}
                pathname="/tags"
                isArticle={false}
            />
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
    site {
      siteMetadata {
        siteUrl
      }
    }
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