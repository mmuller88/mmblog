import React from 'react';
import { ThemeProvider } from './src/components/theme-context';
// Highlighting for code blocks
import 'prismjs/themes/prism-okaidia.css';
// font
import '@fontsource/raleway/400.css';
import '@fontsource/raleway/700.css';
// Style order issue workaround
import '@tailwindcss/typography/dist/typography.min.css';
// import 'gatsby-remark-vscode/styles.css';

export const wrapRootElement = ({ element }) => (
  <ThemeProvider>{element}</ThemeProvider>
);
