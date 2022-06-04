import React from 'react';
import tw, { GlobalStyles } from 'twin.macro';
import { Global } from '@emotion/react';
import CookieConsent from 'react-cookie-consent';

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
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      enableDeclineButton="true"
      declineButtonText="Decline"
      cookieName="gatsby-gdpr-google-analytics"
    >
      This website stores cookies on your computer.
      These cookies are used to collect information
      about how you interact with this website and allow us to remember you.
      We use this information in order to improve and customize your browsing
      experience and for analytics and metrics about our visitors on this website.
      If you decline, your information won’t be tracked when you visit this website.
      A single cookie will be used in your browser to remember your preference not to be tracked.
    </CookieConsent>
  </div>
);

export default Layout;
