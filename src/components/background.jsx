import tw, { styled } from 'twin.macro';
import { motion } from 'framer-motion';

export const FullscreenBackground = styled(motion.div)`
  ${tw`fixed z-10 top-0 left-0 w-full h-full
  pt-32 bg-primary`}
  max-width: 1920px;
`;

const Background = tw.div`min-h-screen flex flex-col bg-primary transition-all duration-200`;

export default Background;
