import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../../components/layout';
import SEO from '../../components/seo';
import BlogListTemplate from '../display/blog-list-template';

const BlogListByTag = ({ data, pageContext }) => (
  <Layout>
    <SEO title={pageContext.tag} />
    <BlogListTemplate
      posts={data.allSitePost.nodes}
      subtitle={data.site.siteMetadata.blogDescription}
      blogPathPrefix={data.site.siteMetadata.blogPathPrefix}
      pageContext={pageContext}
    />
  </Layout>
);

export default BlogListByTag;

export const blogListQuery = graphql`query ($skip: Int!, $limit: Int!, $tag: [String]) {
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
      tags: { in: $tag }
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
      tags
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
