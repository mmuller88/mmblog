import React from 'react';
import tw, { GlobalStyles } from 'twin.macro';
import { Global } from '@emotion/react';

import Header from './header';
import Footer from './footer';
import Background from './background';
import { stylesBase } from './styles-base';

const Content = tw.div`flex-grow`;

const Layout = ({ children, ...rest }) => (
  <div {...rest}>
    <GlobalStyles />
    <Global styles={stylesBase} />
    <Background className="global-wrapper">
      <Header />
      <Content>{children}</Content>
      <Footer />
    </Background>
  </div>
);

export default Layout;
