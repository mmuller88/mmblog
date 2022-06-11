import React from 'react';
import { graphql, Link } from 'gatsby';
import 'twin.macro';

import Layout from '../components/layout';
import SEO from '../components/seo';
import Hero from '../components/hero';
import {
  Title,
  MainTitle,
  Subtitle,
} from '../components/title';
import {
  BlogListing,
  BlogSection,
} from '../templates/display/blog-list-template';
import BlogCard from '../components/blog-card';
import TitleButtonIcon from '../components/title-button';

const Index = ({ data }) => {
  const posts = data.blog?.nodes;
  return (
    <Layout>
      <SEO title="Martin Mueller Blog" />
      <BlogSection>
        <Link to="/blog" tw="flex justify-between items-center">
          <Title>
            Blog
          </Title>
          <button type="button" tw="text-primary fill-current">
            <TitleButtonIcon />
          </button>
        </Link>
        <BlogListing>
          {posts.length > 0
            && posts.map((post) => {
              const {
                title, excerpt, description, slug, date,
              } = post;
              return (
                <BlogCard
                  key={slug}
                  title={title}
                  date={date}
                  description={description || excerpt}
                  link={slug}
                />
              );
            })}
        </BlogListing>
      </BlogSection>
      <div tw="flex justify-center text-2xl text-primary pb-8 font-semibold underline">
        <Link to="/tags/de">de</Link>
        ,
        {' '}
        <Link to="/tags/eng">eng</Link>
        ,
        {' '}
        <Link to="/tags">tags</Link>
        ,
        {' '}
        <Link to="/rss.xml">rss</Link>
        ,
        {' '}
        <Link to="/rss-ger.xml">rss-ger</Link>
      </div>
    </Layout>
  );
};

export default Index;

export const mainPageQuery = graphql`
  {
    site {
      siteMetadata {
        title
        author {
          name
        }
      }
    }
    blog: allSitePost(
      sort: { fields: [date], order: DESC }
      limit: 2
      filter: {
        show: { ne: "no" } 
      }
    ) {
      nodes {
        excerpt(pruneLength: 253)
        slug
        date(formatString: "DD.MM.YYYY")
        title
        show
        description
      }
    }
  }
`;
