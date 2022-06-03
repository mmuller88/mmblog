import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import tw, { styled } from 'twin.macro';
import axios from 'axios';
import { useStaticQuery, graphql } from 'gatsby';

import { FullscreenBackground } from './background';

export const CloseButton = styled.div`
  ${tw`absolute z-20 top-12 right-6 w-8 h-8 opacity-50 
  hover:opacity-100 hover:cursor-pointer before:bg-quaternary after:bg-quaternary`}
  &:before, &:after {
    position: absolute;
    left: 15px;
    content: ' ';
    height: 33px;
    width: 2px;
  }
  &:before {
    transform: rotate(45deg);
  }
  &:after {
    transform: rotate(-45deg);
  }
`;

export const StyledForm = tw.form`flex flex-col w-5/6 md:w-1/3 mx-auto`;

export const FormInput = tw.input`
  border-2 border-secondary rounded-xl py-4 px-5 bg-transparent
  text-xl font-thin outline-none`;

export const FormLabel = tw.label`text-secondary font-thin text-sm pb-1 mt-8`;

export const FormText = tw.textarea`
  border-2 text-secondary border-current rounded-xl py-4 px-5 
  text-xl font-thin outline-none mb-8 bg-transparent`;

export const SubmitButton = tw.input`
  px-6 py-4 mx-auto bg-transparent border-2 
  border-secondary text-secondary rounded-xl hover:opacity-50 duration-300 
  hover:cursor-pointer outline-none`;

export const SuccessMessage = tw.div`text-green-400 font-sans pt-4 text-center`;

export const ErrorMessage = tw.div`text-red-600 font-sans pt-4 text-center`;

const ContactForm = ({ closeCallback }) => {
  const {
    register, handleSubmit, formState: { errors },
  } = useForm();
  const [showErrorMessage, toggleErrorMessage] = useState(false);
  const [showSuccessMessage, toggleSuccessMessage] = useState(false);
  const data = useStaticQuery(graphql`
    query contactFormQuery {
      site {
        siteMetadata {
          formCallbackUrl
        }
      }
    }
  `);
  const FormCallbackUrl = data.site.siteMetadata.formCallbackUrl || null;
  const onSubmit = (formData) => {
    if (!FormCallbackUrl) {
      console.log('please setup formCallBack url in your gatsby-config');
      toggleSuccessMessage(true);
      return;
    }
    axios.post(FormCallbackUrl, formData)
      .then((response) => {
        if (response.status === 200) {
          toggleErrorMessage(false);
          toggleSuccessMessage(true);
          return;
        }
        toggleErrorMessage(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <FullscreenBackground
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <FormLabel htmlFor="name">Your name</FormLabel>
        <FormInput name="name" placeholder="Name" {...register('name', { required: true })} />
        {errors.name && <span tw="text-red-600">Name is required</span>}
        <FormLabel htmlFor="email">Your email</FormLabel>
        <FormInput name="email" type="email" placeholder="Email" {...register('email', { required: true })} />
        {errors.email && <span tw="text-red-600">Email is required</span>}
        <FormLabel htmlFor="message">Your message</FormLabel>
        <FormText name="message" placeholder="Hi!" {...register('message')} />
        {showSuccessMessage && (<SuccessMessage>Thanks for reaching out!</SuccessMessage>)}
        {showSuccessMessage ? (<SubmitButton type="button" onClick={closeCallback} value="Close form" />) : (<SubmitButton type="submit" />)}
        {showErrorMessage && (<ErrorMessage>Something went wrong. Try again</ErrorMessage>)}
      </StyledForm>
      <CloseButton onClick={closeCallback} />
    </FullscreenBackground>
  );
};

export default ContactForm;
