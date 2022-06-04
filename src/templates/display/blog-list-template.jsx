import React from 'react';
import tw from 'twin.macro';

import { MainTitle, Subtitle } from '../../components/title';
import BlogCard from '../../components/blog-card';
import Container from '../../components/container';
import { Pagination, NumberPagination } from '../../components/pagination';

export const BlogListing = tw.div`
  grid md:grid-cols-2 lg:grid-cols-2 md:gap-x-9 md:gap-y-12 md:pt-12 lg:gap-x-11 lg:gap-y-14 lg:pt-16
`;

export const BlogSection = tw(Container)`
  flex flex-col font-sans pb-7 md:pb-20 lg:pb-28 md:pt-14 lg:pt-28
`;

const BlogListTemplate = ({
  posts, title = 'Blog', subtitle = null, pageContext, categoryPathPrefix, blogPathPrefix,
}) => (
  <BlogSection>
    <div>
      <MainTitle tw="capitalize">{pageContext.tag || title}</MainTitle>
      {subtitle && (
      <Subtitle tw="max-w-6xl md:pr-1.5 lg:pr-2.5">{subtitle}</Subtitle>
      )}
    </div>
    {!posts && (
      <Subtitle>
        No blog posts found. Add mdx posts to "content/blog" (or the
        directory you specified for the "gatsby-source-filesystem" plugin in
        gatsby-config.js).
      </Subtitle>
    )}
    <BlogListing>
      {posts.length > 0 && posts.map((post) => {
        const {
          title: postTitle, description, excerpt, image, slug, date,
        } = post;
        return (
          <BlogCard
            key={slug}
            link={slug}
            date={date}
            title={postTitle}
            description={description || excerpt}
            image={image?.childImageSharp.gatsbyImageData}
          />
        );
      })}
    </BlogListing>
    <Pagination
      previousPagePath={pageContext.previousPagePath}
      nextPagePath={pageContext.nextPagePath}
    >
      <NumberPagination
        numberOfPages={pageContext.numberOfPages}
        currentPage={pageContext.humanPageNumber}
        pathPrefix={categoryPathPrefix || blogPathPrefix}
      />
    </Pagination>
  </BlogSection>
);

export default BlogListTemplate;
