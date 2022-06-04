import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../../components/layout';
import SEO from '../../components/seo';
import BlogListTemplate from '../display/blog-list-template';

const BlogList = ({ data, pageContext }) => (
  <Layout>
    <SEO title="All posts" />
    <BlogListTemplate
      posts={data.allSitePost.nodes}
      subtitle={data.site.siteMetadata.blogDescription}
      blogPathPrefix={data.site.siteMetadata.blogPathPrefix}
      pageContext={pageContext}
    />
  </Layout>
);

export default BlogList;

export const blogListQuery = graphql`query ($skip: Int!, $limit: Int!) {
  site {
    siteMetadata {
      title
      blogPathPrefix
    }
  }
  allSitePost(
    sort: {fields: [date], order: DESC}
    limit: $limit
    filter: {
      show: { ne: "no" } 
     }
    skip: $skip
  ) {
    nodes {
      excerpt(pruneLength: 253)
      featured
      slug
      date(formatString: "DD.MM. YYYY")
      title
      show
      description
      image {
        childImageSharp {
          gatsbyImageData(width: 900, quality: 97, layout: CONSTRAINED, aspectRatio: 1.87)
        }
      }
    }
  }
}
`;
