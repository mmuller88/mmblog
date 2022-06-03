import React from 'react';
import tw from 'twin.macro';
import { useStaticQuery, graphql } from 'gatsby';
import {
  InstagramIcon, TwitterIcon, FacebookIcon, LinkedInIcon, GitHubIcon, YouTubeIcon, BehanceIcon,
} from './icons';

export const IconWithLink = tw.a`mr-8 md:mr-10 last:mr-0 lg:mr-4 fill-current text-primary md:last:mr-0 hover:opacity-50 duration-300 hover:cursor-pointer`;

const SocialIcons = () => {
  const data = useStaticQuery(graphql`
    query menuQuery {
      site {
        siteMetadata {
          social {
            twitter
            instagram
            behance
            facebook
            github
            linkedin
            youtube
          }
        }
      }
    }
    `);
  const {
    twitter,
    instagram,
    behance,
    facebook,
    github,
    linkedin,
    youtube,
  } = data.site.siteMetadata.social;
  return (
    <>
      {twitter && (<IconWithLink href={`https://twitter.com/${twitter}`} aria-label="Twitter" target="_blank" rel="noopener" alt="Twitter"><TwitterIcon /></IconWithLink>)}
      {instagram && (<IconWithLink href={`https://instagram.com/${instagram}`} aria-label="Instagram" target="_blank" rel="noopener" alt="Instagram"><InstagramIcon /></IconWithLink>)}
      {behance && (<IconWithLink href={`https://behance.net/${behance}`} aria-label="Behance" target="_blank" rel="noopener" alt="Behance"><BehanceIcon /></IconWithLink>)}
      {facebook && (<IconWithLink href={`https://facebook.com/${facebook}`} aria-label="Facebook" target="_blank" rel="noopener" alt="Facebook"><FacebookIcon /></IconWithLink>)}
      {github && (<IconWithLink href={`https://github.com/${github}`} aria-label="GitHub" target="_blank" rel="noopener" alt="GitHub"><GitHubIcon /></IconWithLink>)}
      {linkedin && (<IconWithLink href={`https://linkedin.com/in/${linkedin}`} aria-label="LinkedIn" target="_blank" rel="noopener" alt="LinkedIn"><LinkedInIcon /></IconWithLink>)}
      {youtube && (<IconWithLink href={`https://youtube.com/channel/${youtube}`} aria-label="YouTube" target="_blank" rel="noopener" alt="YouTube"><YouTubeIcon /></IconWithLink>)}
    </>
  );
};

export default SocialIcons;
