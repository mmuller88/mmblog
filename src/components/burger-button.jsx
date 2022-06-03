import React from 'react';
import tw, { styled } from 'twin.macro';

export const BurgerLine = styled.div`
  ${tw`w-8 border-b-4 border-solid border-current text-primary duration-700 transition-all`}
  ${({ collapsed }) => (collapsed ? tw`m-0 rotate-90 first:translate-x-4 last:-translate-x-3.5 first:translate-y-1 last:-translate-y-1` : tw`rotate-0 my-2`)}; 
`;

export const BurgerButton = ({ handleClick, collapsed }) => (
  <div tw="inline-block z-10">
    <button
      tw="cursor-pointer h-16 focus:outline-none "
      onClick={handleClick}
      type="button"
      aria-label={collapsed ? 'Hide menu' : 'Show menu'}
    >
      <BurgerLine collapsed={collapsed} />
      <BurgerLine collapsed={collapsed} />
      <BurgerLine collapsed={collapsed} />
    </button>
  </div>
);
