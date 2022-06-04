import React from 'react';
import { getImage, GatsbyImage } from 'gatsby-plugin-image';
import { Link } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import tw, { styled } from 'twin.macro';

import Container from '../../components/container';
import { SubscriptionForm } from '../../components/subscribe-form';

export const PostTitle = tw.h1`flex justify-start font-sans text-3xl md:text-4xl lg:text-8xl font-bold pb-12 text-primary`;

export const StyledArticle = styled.article`
  ${tw`font-sans max-w-full py-36`}
  p, a, li {
    ${tw`font-sans! text-primary! md:text-3xl!`}
  }
  h1,
  h2,
  h3,
  h4 {
    ${tw`font-sans! text-primary!`}
    > a.anchor {
      ${tw`top-4`}
    }
  }
  blockquote {
    ${tw`border-indigo-500! text-primary!
    xl:text-3xl! font-sans! py-1 pl-6!`}
    p {
      ${tw`my-0!`}
    }
  }
  span.gatsby-resp-image-wrapper {
    ${tw`max-w-full! xl:py-20 md:py-20 shadow-2xl md:rounded-3xl`}
  }
`;

export const PostNavigation = tw.div`
  flex py-8 w-full font-sans
`;

export const PostNavigationButtonContainer = tw(Link)`
  w-full border-solid border border-stone-300 rounded-lg text-center py-6 text-slate-800
  flex flex-col odd:mr-5 even:ml-5 no-underline hover:opacity-50 duration-300
`;

export const PostNavigationDirection = tw.p`
  font-light text-sm text-slate-800
`;

export const PostNavigationTitle = tw.h4`
  text-xl text-slate-800 mt-3
`;

export const PostImageContainer = tw.div`flex shadow-2xl overflow-hidden`;

export const PostImage = tw(GatsbyImage)`
  w-full mx-auto max-w-full rounded-md
`;

export const PostContainer = tw.div`flex w-full justify-between flex-col-reverse md:flex-row`;

export const PostContentsContainer = tw.div`relative pl-8 font-sans`;

export const PostNavigationButton = ({
  children, rel, label, ...props
}) => (
  <PostNavigationButtonContainer {...props}>
    <PostNavigationDirection>
      {rel === 'next' ? `Next ${label}` : `Previous ${label}`}
    </PostNavigationDirection>
    <PostNavigationTitle>{children}</PostNavigationTitle>
  </PostNavigationButtonContainer>
);

const PostTemplate = ({ post }) => {
  const postTitle = post.title;
  return (
    <Container>
      <header tw="pt-16 xl:pt-32">
        <PostTitle itemProp="headline">{postTitle}</PostTitle>
      </header>
      <PostImageContainer>
        {post.image && (
          <PostImage
            image={getImage(post.image.childImageSharp.gatsbyImageData)}
            alt={postTitle}
          />
        )}
      </PostImageContainer>
      <PostContainer>
        <StyledArticle
          className="prose prose-slate md:prose-2xl"
          itemScope
          itemType="http://schema.org/Article"
          tw="max-w-full"
        >
          <MDXRenderer>{post.body}</MDXRenderer>
        </StyledArticle>
      </PostContainer>
      <SubscriptionForm />
    </Container>
  );
};

export default PostTemplate;
