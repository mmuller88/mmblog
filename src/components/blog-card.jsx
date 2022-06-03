import React from 'react';
import tw, { styled } from 'twin.macro';
import { Link } from 'gatsby';
import { getImage, GatsbyImage } from 'gatsby-plugin-image';

export const FeaturedPost = tw.div`pt-8`;

export const Card = tw.div`flex w-full no-underline duration-300`;

export const StyledImage = tw(GatsbyImage)`shadow-lg rounded-md`;

export const FeaturedImage = tw(StyledImage)`w-7/12 mr-12`;

export const BlogCardTitle = tw.h3`text-xl lg:text-3xl text-primary font-bold m-0`;

export const BlogCardDescription = tw.p`text-xl md:pr-6 md:text-2xl lg:pr-6 lg:text-3xl text-primary font-normal mb-0`;

const BlogCard = ({
  title, description, link, date, image,
}) => {
  const isPost = title && description && link && date;
  return (
    <Card itemProp="Url" tw="flex flex-col pb-9">
      {image && (
      <StyledImage
        image={getImage(image)}
        alt={title}
      />
      )}
      {isPost
      && (
      <article
        className="post-list-item"
        itemScope
        itemType="http://schema.org/Article"
        tw="py-4"
      >
        <header tw="pb-2.5 md:pb-4 lg:pb-6">
          {date && <p tw="font-sans text-secondary text-lg py-1.5 md:pt-10 md:pb-4 md:text-2xl lg:pt-14 lg:pb-6 lg:text-3xl">{date}</p>}
          <BlogCardTitle><Link to={link}>{title}</Link></BlogCardTitle>
        </header>
        <section>
          <BlogCardDescription
            dangerouslySetInnerHTML={{ __html: description }}
            itemProp="description"
          />
        </section>
      </article>
      )}
    </Card>
  );
};

export default BlogCard;
