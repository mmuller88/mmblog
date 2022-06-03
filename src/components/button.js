/* eslint-disable react/react-in-jsx-scope */
import tw from 'twin.macro';
import { Link } from 'gatsby';

const buttonStyle = `text-primary font-sans inline-block
font-bold md:text-3xl no-underline!`;

export const ButtonIconArrow = () => (
  <svg width="14" height="23" viewBox="0 0 14 23" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M0.473135 22.5607C-0.157712 21.9749 -0.157712 21.0251 0.473135 20.4393L10.1001 11.5L0.473137 2.56066C-0.15771 1.97487 -0.15771 1.02513 0.473137 0.43934C1.10398 -0.146447 2.12679 -0.146447 2.75764 0.43934L13.5269 10.4393C13.8298 10.7206 14 11.1022 14 11.5C14 11.8978 13.8298 12.2794 13.5269 12.5607L2.75763 22.5607C2.12679 23.1464 1.10398 23.1464 0.473135 22.5607Z" />
  </svg>
);

export const Button = tw(Link)`
  ${buttonStyle}
`;

export const ActionButton = tw.button`
  ${buttonStyle}
`;
