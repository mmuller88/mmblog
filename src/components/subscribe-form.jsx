import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import tw, { styled } from 'twin.macro';
import axios from 'axios';
import { useStaticQuery, graphql } from 'gatsby';
import Container from './container';

export const SubscriptionForm = ({ actionTitle = 'Get in touch', headingLabel = 'Let’s be in touch! Enter your e-mail here', successMessage = 'thank you for subscribing' }) => {
  const { register, handleSubmit } = useForm();
  const [displayForm, toggleDisplayForm] = useState(true);

  const data = useStaticQuery(graphql`
  query subscriptionFormQuery {
    site {
      siteMetadata {
        subscriptionCallbackUrl
      }
    }
  }
`);
  const SubscriptionCallbackUrl = data.site.siteMetadata.subscriptionCallbackUrl;
  const onSubmit = (v) => {
    if (!SubscriptionCallbackUrl) {
      console.info('please setup subscriptionCallbackUrl url in your gatsby-config');
      return;
    }
    axios.post(SubscriptionCallbackUrl, v)
      .then((response) => {
        if (response.status === 200) {
          toggleDisplayForm(false);
          SubscriptionCallbackUrl(v);
          return;
        }
        console.error('error occured');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div tw="mb-16 md:mb-72 px-6">
      <Container tw="bg-secondary font-sans flex flex-col justify-center shadow-2xl rounded-md">
        <div>
          <p tw="flex text-primary font-bold justify-center text-xl pt-7 pb-5 md:text-5xl md:pl-6 md:pt-32 md:pb-16">
            {headingLabel}
          </p>
        </div>
        {displayForm ? (
          <form
            tw="flex flex-col pt-5 pb-14 justify-center md:flex-row md:pb-32"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              tw="w-full h-16 bg-tertiary text-center md:text-left md:w-1/2 md:pl-12 md:h-24 md:text-4xl  rounded-md focus:outline-none"
              placeholder="Enter your e-mail"
              type="email"
              {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
            />
            <div tw="pt-1.5 text-tertiary md:pl-2 md:pt-0">
              <button type="submit" tw="flex items-center justify-center leading-7 rounded-md text-tertiary bg-indigo-500 text-white w-full h-16 text-xl md:w-80 md:h-24 md:py-2 md:px-8 md:text-4xl">
                {actionTitle}
              </button>
            </div>
          </form>
        ) : successMessage}
      </Container>
    </div>
  );
};
