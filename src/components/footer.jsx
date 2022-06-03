import React from 'react';
import tw from 'twin.macro';
import styled from '@emotion/styled';
import { useStaticQuery, graphql } from 'gatsby';

import Container from './container';
import SocialIcons from './social';

export const StyledFooter = tw.div`py-12 font-sans flex`;

export const Logo = tw.div`font-semibold text-3xl lg:text-4xl
no-underline text-gray-100 lg:w-1/3 pl-2 lg:pl-0`;

export const FooterText = styled.div`
  ${tw`font-medium text-lg md:text-2xl lg:text-3xl md:text-right md:pr-2 md:pr-0`}
  flex: 2;
`;

export const Line = styled.div`
  ${tw`text-secondary border-current border-t-2 pb-14 md:pb-28 lg:pb-32 pt-0`}`;
export const Copyright = tw.a`font-medium order-2 lg:order-1 whitespace-nowrap text-center text-lg md:text-2xl lg:text-3xl mb-0 text-primary no-underline`;
export const StyledSocialIcons = tw.div`flex justify-center order-1 lg:order-2 lg:justify-end w-full mb-4 md:mb-0`;

const Footer = () => (
  <StyledFooter>
    <Container>
      <Line />
      <FooterText tw="flex flex-col gap-14 lg:flex-row">
        <Copyright href="https://gatsbytemplates.io/theme/kyoto-gatsby-theme/" target="_blank" rel="noopener">
          © 2022 Gatsby templates theme
        </Copyright>
        <StyledSocialIcons>
          <SocialIcons />
        </StyledSocialIcons>
      </FooterText>
    </Container>
  </StyledFooter>
);

export default Footer;
