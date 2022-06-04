import React from 'react';
import tw from 'twin.macro';
import { Link } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';

export const FeaturedPost = tw.div`pt-8`;

export const Card = tw(Link)`flex w-full no-underline duration-300 hover:shadow-lg rounded-md border-current text-primary border-2`;

export const StyledImage = tw(GatsbyImage)`shadow-lg rounded-md`;

export const FeaturedImage = tw(StyledImage)`w-7/12 mr-12`;

export const BlogCardTitle = tw.h3`text-xl lg:text-3xl text-primary font-bold m-0`;

export const BlogCardDescription = tw.p`text-xl md:pr-6 md:text-2xl lg:pr-6 lg:text-3xl text-primary break-all font-normal mb-0`;

const BlogCard = ({
  title, description, link, date,
}) => (
  <Card itemProp="Url" tw="flex flex-col p-9" to={link}>
    <article
      className="post-list-item"
      itemScope
      itemType="http://schema.org/Article"
      tw="py-4"
    >
      <header tw="pb-2.5 md:pb-4 lg:pb-6">
        <BlogCardTitle>{title}</BlogCardTitle>
        {date && <p tw="font-sans text-secondary text-lg md:pt-4 md:pb-4 md:text-2xl lg:text-3xl">{date}</p>}
      </header>
      <section>
        <BlogCardDescription
          dangerouslySetInnerHTML={{ __html: description }}
          itemProp="description"
        />
      </section>
    </article>
  </Card>
);

export default BlogCard;
