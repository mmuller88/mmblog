/* eslint-disable react/no-array-index-key */
import React from 'react';

import { getImage, GatsbyImage } from 'gatsby-plugin-image';
import tw from 'twin.macro';

import EmblaCarousel from './carousel/embla-carousel';
import Container from './container';
import ReadMore from './readmore-button';

export const ProjectContainer = tw.div`
  flex flex-col text-primary font-sans pt-16 md:pt-32
`;

export const ProjectTitle = tw.h2`
  text-3xl md:text-4xl font-bold md:pb-4
`;

export const ProjectText = tw(Container)`
  flex pb-8 mt-8 text-left
`;

export const ProjectTextContainer = tw.div`
  flex flex-col md:flex-row w-full
`;

export const ProjectSubtitle = tw.div`
  flex-1 text-xl font-semibold pb-2 md:pb-0
`;

export const ProjectDescription = tw.div`
  flex-1 flex flex-col font-light text-base md:px-8 h-full
`;

const ProjectSection = ({
  title, subtitle, description, images, link, linkText = 'view more',
}) => (
  <ProjectContainer>
    <Container>
      <ProjectTitle>{title}</ProjectTitle>
    </Container>
    <div tw="py-8">
      <EmblaCarousel>
        {images.map((img, i) => <GatsbyImage image={getImage(img)} key={i} alt={`${title} slide ${i}`} />)}
      </EmblaCarousel>
    </div>
    <ProjectText>
      <ProjectTextContainer>
        <ProjectSubtitle>
          <h3>
            {subtitle}
          </h3>
        </ProjectSubtitle>
        <ProjectDescription>
          {description}
          {' '}
          <ReadMore to={link}>
            {linkText}
          </ReadMore>
        </ProjectDescription>
      </ProjectTextContainer>
    </ProjectText>
  </ProjectContainer>
);

export default ProjectSection;
