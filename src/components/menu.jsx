import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AnchorLink } from 'gatsby-plugin-anchor-links';
import tw, { styled } from 'twin.macro';

import { BurgerButton } from './burger-button';
import { FullscreenBackground } from './background';
import useWindowSize from '../../utils/use-window-size';

export const MobileMenu = tw.div`w-full h-full flex flex-col w-2/3 sm:w-1/3 mx-auto`;

export const MenuLink = styled(AnchorLink)`${tw`font-normal text-primary md:text-primary text-3xl xl:text-5xl no-underline 
  sm:px-4 last:pr-0 h-full flex items-center hover:opacity-50 duration-300 
  justify-start sm:justify-center mb-6 md:mb-0 font-sans`}
 
`;

export const Navigation = tw.nav`flex flex-col md:flex-row`;

export const Menu = ({ children }) => {
  const size = useWindowSize();
  const [showMobileMenu, toggleMobileMenu] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  const showDesktopMenu = size.width > 768;
  const menuToggle = () => {
    toggleMobileMenu(!showMobileMenu);
  };

  if (!showDesktopMenu && hasMounted) {
    return (
      <>
        <AnimatePresence transition={{ duration: 0.5 }}>
          {showMobileMenu && (
          <FullscreenBackground
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MobileMenu onClick={() => toggleMobileMenu(false)}>{children}</MobileMenu>
          </FullscreenBackground>
          )}
        </AnimatePresence>
        <BurgerButton key="mobile-menu" handleClick={menuToggle} collapsed={showMobileMenu} />
      </>
    );
  }
  return children;
};

export default Menu;
