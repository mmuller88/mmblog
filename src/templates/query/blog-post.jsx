import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../../components/layout';
import SEO from '../../components/seo';
import PostTemplate from '../display/post-template';

const BlogPostTemplate = ({ data }) => {
  const {
    image, title, description, excerpt,
  } = data.post;
  const thumbnail = image
  && image.childImageSharp.gatsbyImageData.images.fallback.src;
  return (
    <Layout>
      <SEO
        title={title}
        image={thumbnail}
        description={description || excerpt}
      />
      <PostTemplate
        post={data.post}
        previous={data.previous}
        next={data.next}
        url={data.site.siteMetadata.siteUrl}
      />
    </Layout>
  );
};

export default BlogPostTemplate;

export const blogQuery = graphql`query BlogPostBySlug($previousPostId: String, $nextPostId: String, $slug: String!) {
  site {
    siteMetadata {
      title
      siteUrl
    }
  }
  post: sitePost(slug: {eq: $slug}) {
    id
    excerpt(pruneLength: 160)
    tableOfContents
    body
    title
    date(formatString: "MMMM DD, YYYY")
    description
    engUrl
    gerUrl
    tags
    image {
      childImageSharp {
        gatsbyImageData(quality: 97, layout: FULL_WIDTH)
      }
    }
  }
  previous: sitePost(id: {eq: $previousPostId}) {
    title
    slug
  }
  next: sitePost(id: {eq: $nextPostId}) {
    title
    slug
  }
}
`;
