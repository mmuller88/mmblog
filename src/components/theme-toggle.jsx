import React, { useContext } from 'react';
import tw, { styled } from 'twin.macro';

import { useTheme } from './theme-context';

const ToggleButton = styled.button`
  ${tw`w-6 h-6 focus:outline-none fill-current flex justify-center`}
  ${({ isDark }) => (isDark ? tw`text-indigo-500` : tw`text-slate-800`)}; 
`;

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  function isDark() {
    return theme === 'dark';
  }
  return (
    <div tw="flex flex-col items-center p-10">
      <ToggleButton
        type="button"
        onClick={() => setTheme(isDark() ? 'light' : 'dark')}
        isDark={theme === 'dark'}
      >
        <LightBulb />
      </ToggleButton>
    </div>
  );
};

const LightBulb = () => (
  <svg width="17" height="22" viewBox="0 0 17 22" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M5.5 21C5.5 20.7239 5.8134 20.5 6.2 20.5H11.8C12.1866 20.5 12.5 20.7239 12.5 21C12.5 21.2761 12.1866 21.5 11.8 21.5H6.2C5.8134 21.5 5.5 21.2761 5.5 21Z" />
    <path d="M17 8.00033C17 4.10033 13.3431 0.900329 8.88613 1.00033C4.65776 1.10033 1.22935 4.10033 1.00079 7.70033C0.886513 10.2003 2.37216 12.5003 4.54348 13.8003C5.22916 14.2003 5.572 14.8003 5.572 15.5003V18.0003H12.4288V15.5003C12.4288 14.8003 12.7717 14.2003 13.4573 13.8003C15.6287 12.5003 17 10.4003 17 8.00033Z" />
  </svg>

);
