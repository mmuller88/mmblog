import React from 'react';
import tw from 'twin.macro';
import { Link } from 'gatsby';

import { RightArrowIcon } from './icons';

export const StyledLink = tw(Link)`
  text-primary no-underline font-semibold flex pt-4
  items-center self-end hover:opacity-50 duration-300
`;

const ReadMore = ({ children, arrowDisabled, to }) => (
  <StyledLink to={to}>
    {children}
    {!arrowDisabled && <RightArrowIcon />}
  </StyledLink>
);

export default ReadMore;
