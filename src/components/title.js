import tw from 'twin.macro';

const HeadingStyle = 'font-bold text-primary text-left my-0 font-sans';

export const MainTitle = tw.h1`
  ${HeadingStyle} text-3xl text-primary md:text-4xl lg:text-8xl
`;

export const Title = tw.h2`
  ${HeadingStyle} pb-7 text-2xl text-primary md:text-3xl lg:text-5xl
`;

export const Subtitle = tw.p`
  font-normal text-primary text-xl my-7 lg:text-3xl text-left md:mt-8 max-w-3xl leading-7
`;
