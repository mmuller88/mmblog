import React from 'react';
import tw from 'twin.macro';
import { IconWithLink } from './social';
import {
  TwitterIcon, FacebookIcon,
} from './icons';

const Share = ({ pathname, url, title }) => {
  const twitter = `https://twitter.com/intent/tweet?url=${url
        + pathname}&text=${title} by @MartinMueller_`;

  const fb = `https://www.facebook.com/sharer/sharer.php?u=${url
        + pathname}`;

  return (
    <div>
      <h3 tw="text-center text-primary pb-2">Share</h3>
      <div tw="flex justify-center">
        <IconWithLink href={twitter} aria-label="Twitter" target="_blank" rel="noopener" alt="Twitter"><TwitterIcon /></IconWithLink>
        <IconWithLink href={fb} aria-label="Facebook" target="_blank" rel="noopener" alt="Facebook"><FacebookIcon /></IconWithLink>
      </div>
    </div>
  );
};

export default Share;
