import React, { useState, useEffect } from 'react';
import tw from 'twin.macro';
import { Link, useStaticQuery, graphql } from 'gatsby';
import { AnimatePresence } from 'framer-motion';
import { AnchorLink } from 'gatsby-plugin-anchor-links';

import Container from './container';
import { Menu } from './menu';
import ContactForm from './contact-form';
import { ThemeToggle } from './theme-toggle';

export const LogoLink = tw(Link)`font-bold text-2xl md:text-4xl lg:text-5xl no-underline text-primary
  flex items-center`;

export const MenuLink = tw(AnchorLink)`font-bold capitalize text-2xl md:text-3xl no-underline 
  px-4 h-full flex items-center text-primary hover:opacity-50 duration-300 
  justify-center mb-6 lg:mb-0
`;

export const ContactButton = tw.button`
  font-bold text-indigo-500 text-3xl hover:opacity-50 duration-300 cursor-pointer 
  outline-none justify-center md:ml-4 lg:ml-8 mx-auto
`;

const Header = () => {
  const [showContactForm, toggleForm] = useState(false);
  const data = useStaticQuery(graphql`
    query headerQuery {
      site {
        siteMetadata {
          title
          menu {
            name
            url
          }
          contactLabel
        }
      }
    }
  `);

  useEffect(() => {
    function onKeyup(e) {
      if (e.key === 'Escape') {
        toggleForm(false);
      }
    }
    window.addEventListener('keyup', onKeyup);
    return () => window.removeEventListener('keyup', onKeyup);
  }, []);
  const { title, menu, contactLabel } = data.site.siteMetadata;
  return (
    <Container>
      <div tw="py-6 md:py-8">
        <div tw="w-full flex justify-between">
          <LogoLink to="/">{title}</LogoLink>
          <Menu>
            <nav tw="flex flex-col md:flex-row">
              {menu.length > 0 && menu.map((link) => (
                <MenuLink
                  key={link.name}
                  to={link.url}
                  gatsbyLinkProps={{ activeStyle: { opacity: 0.5 } }}
                >
                  {link.name}
                </MenuLink>
              ))}
              <ContactButton type="button" key="contact-button" onClick={() => toggleForm(!showContactForm)}>
                {contactLabel || 'Hire me'}
              </ContactButton>
              <ThemeToggle />
            </nav>
          </Menu>
        </div>
        <AnimatePresence transition={{ duration: 0.5 }}>
          {showContactForm && (
            <ContactForm closeCallback={() => toggleForm(false)} />
          )}
        </AnimatePresence>
      </div>
    </Container>
  );
};

export default Header;
