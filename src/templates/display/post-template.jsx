import React from 'react';
import { getImage, GatsbyImage } from 'gatsby-plugin-image';
import { Link } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import tw, { styled } from 'twin.macro';
// eslint-disable-next-line import/no-unresolved
import { useLocation } from '@reach/router';

import Container from '../../components/container';
import { SubscriptionForm } from '../../components/subscribe-form';
import { Pagination } from '../../components/pagination';
import Share from '../../components/share';
import KoFi from '../../components/KoFi';

export const PostTitle = tw.h1`flex justify-start font-sans text-3xl md:text-4xl lg:text-8xl font-bold pb-12 text-primary`;

export const StyledArticle = styled.article`
  ${tw`font-sans max-w-full py-36`}
  p, a, li, strong {
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
  code.language-text {
    ${tw`bg-secondary text-primary`}
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

export const PostImageContainer = tw.div`flex overflow-hidden`;

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

const PostTemplate = ({
  post, previous, next, url,
}) => {
  const postTitle = post.title;
  const { pathname } = useLocation();
  const {
    engUrl, gerUrl, image, body, tags,
  } = post;
  return (
    <Container>
      <header tw="pt-16 xl:pt-32">
        <PostTitle itemProp="headline">{postTitle}</PostTitle>
      </header>
      <PostImageContainer>
        {image && (
          <PostImage
            image={getImage(image.childImageSharp.gatsbyImageData)}
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
          <MDXRenderer>{body}</MDXRenderer>
        </StyledArticle>
      </PostContainer>
      <div tw="p-8">
        <KoFi color="#29abe0" id="T6T1BR59W" label="Buy me a Ko-fi" />
      </div>
      {engUrl && (
        <div tw="pl-8 pb-4">
          <Link to={engUrl} tw="text-primary text-xl">Translate To English</Link>
          <br />
        </div>
      )}
      {gerUrl && (
        <div tw="pl-8 pb-4">
          <Link to={gerUrl} tw="text-primary text-xl">Translate To German</Link>
          <br />
        </div>
      )}
      <SubscriptionForm />
      {tags && tags.length > 0 && (
        <div tw="pl-8 text-primary">
          <p tw="text-2xl">Tagged in </p>
          {tags.map((tag) => (
            <a href={`/tags/${tag}`} key={tag} tw="mr-2 text-xl underline">
              {tag}
            </a>
          ))}
        </div>
      )}
      <Share title={postTitle} url={url} pathname={pathname} />
      <Pagination
        previousPagePath={previous ? previous.slug : null}
        nextPagePath={next ? next.slug : null}
      />
    </Container>
  );
};

export default PostTemplate;
