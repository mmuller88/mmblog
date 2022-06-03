import React from 'react';
import { graphql } from 'gatsby';

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
import { SubscriptionForm } from '../components/subscribe-form';

const Index = ({ data }) => {
  const posts = data.blog?.nodes;
  return (
    <Layout>
      <SEO title="All posts" />
      <Hero>
        <MainTitle>
          Hi! My name is Martin Mueller.
          <p>
            I’m a
            <span tw="text-indigo-500"> Full Stack developer</span>
          </p>
          located in Germany.
        </MainTitle>
        <Subtitle>
          I like to have a broad collection of skills.
          From developing the backend and frontend applications written in Java, JavaScript,
          or any other language, to developing a cost-optimized cloud infrastructure solution.
          An enthusiastic agile player with strong communication skills.
          Looking for taking on new challenges and learning new technologies.
        </Subtitle>
      </Hero>
      <BlogSection>
        <div tw="flex justify-between items-center">
          <Title>
            Blog
          </Title>
          <button type="button">
            <TitleButtonIcon />
          </button>
        </div>
        <BlogListing>
          {posts.length > 0
            && posts.map((post) => {
              const {
                image, title, description, slug, date,
              } = post;
              return (
                <BlogCard
                  key={slug}
                  title={title}
                  date={date}
                  description={description}
                  image={image.childImageSharp.gatsbyImageData}
                  link={slug}
                />
              );
            })}
        </BlogListing>
      </BlogSection>
      <SubscriptionForm />
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
      sort: { fields: [date], order: ASC }
      limit: 2
    ) {
      nodes {
        excerpt
        slug
        date(formatString: "DD.MM.YYYY")
        title
        description
        image {
          childImageSharp {
            gatsbyImageData(
              width: 746
              quality: 97
              layout: CONSTRAINED
              aspectRatio: 1.87
            )
          }
        }
      }
    }
  }
`;
