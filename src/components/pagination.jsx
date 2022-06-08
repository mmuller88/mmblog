import React from 'react';
import { Link } from 'gatsby';
import tw, { styled } from 'twin.macro';

import { Button, ButtonIconArrow } from './button';

export const PaginationContainer = styled.div(({ hasChildren }) => [
  tw`flex flex-row justify-end w-full font-sans items-end pt-6 md:pt-14`,
  hasChildren && tw`md:pt-20`,
]);

const NavButton = tw(Button)`
  text-center text-primary fill-current md:text-3xl text-lg
`;

export const PageNumber = styled(Link)(({ isActive }) => [
  tw`md:text-3xl text-lg text-primary px-2 md:px-3 font-bold `,
  isActive && tw`text-xl md:text-4xl`,
]);

export const NumberPagination = ({ numberOfPages, currentPage, pathPrefix = '' }) => {
  if (!numberOfPages || numberOfPages <= 1) {
    return null;
  }
  const pagesNumArr = Array.from(Array(numberOfPages + 1).keys()).slice(1);
  const pagesNumArrHead = pagesNumArr.length > 3 && pagesNumArr.slice(0, 3);
  const pagesNumArrTail = pagesNumArr.length > 7 && pagesNumArr.slice(-3);
  if (!pagesNumArrHead || !pagesNumArrTail) {
    return (
      <div tw="flex items-end">
        {pagesNumArr.map((x) => (
          <PageNumber
            key={x}
            to={x === 1 ? pathPrefix : `${pathPrefix}/${x}`}
            isActive={x === currentPage}
          >
            {x}
          </PageNumber>
        ))}
      </div>
    );
  }
  return (
    <div tw="flex items-end">
      {pagesNumArrHead.map((x) => (
        <PageNumber
          key={x}
          to={x === 1 ? pathPrefix : `${pathPrefix}/${x}`}
          isActive={x === currentPage}
        >
          {x}
        </PageNumber>
      ))}
      <div tw="md:text-3xl text-lg text-primary px-2 font-bold">
        ...
      </div>
      {pagesNumArrTail.map((x) => (
        <PageNumber
          key={x}
          to={x === 1 ? pathPrefix : `${pathPrefix}/${x}`}
          isActive={x === currentPage}
        >
          {x}
        </PageNumber>
      ))}
    </div>
  );
};

export const Pagination = ({
  previousPagePath, nextPagePath, children = null, ...props
}) => (
  <PaginationContainer hasChildren={children} {...props}>
    {previousPagePath && (
      <div tw="pr-6 flex items-end">
        <NavButton to={`${previousPagePath}`} rel="prev" label="previous" tw="justify-end flex items-center">
          <div tw="rotate-180 pl-4"><ButtonIconArrow /></div>
          Previous
        </NavButton>
      </div>
    )}
    {children && (
      <div tw="px-0 md:px-8 flex items-end">{children}</div>
    )}
    {nextPagePath && (
      <div tw="pl-4 md:pl-6 flex items-end">
        <NavButton to={`${nextPagePath}`} rel="next" label="next" tw="flex w-16 md:w-24 justify-end items-center">
          Next
          <div tw="pl-4">
            <ButtonIconArrow />
          </div>
        </NavButton>
      </div>
    )}
  </PaginationContainer>
);
