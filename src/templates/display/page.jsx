import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import { Link } from 'gatsby';
import 'twin.macro';

import Container from '../../components/container';
import Layout from '../../components/layout';
import SEO from '../../components/seo';
import { Button } from '../../components/button';
import {
  PostTitle, PostContainer, StyledArticle,
} from './post-template';

const components = {
  Link,
  Button,
};

const PageTemplate = ({
  pageContext, children,
}) => {
  const { title, description } = pageContext.frontmatter;
  return (
    <Layout>
      <SEO
        title={title}
        description={description || null}
      />
      <Container>
        <header tw="md:pt-14 lg:pt-28">
          <PostTitle itemProp="headline">{title}</PostTitle>
        </header>
        <PostContainer>
          <StyledArticle
            className="prose prose-slate md:prose-2xl"
            tw="pt-0!"
            itemScope
            itemType="http://schema.org/Article"
          >
            <MDXProvider components={components}>
              {children}
            </MDXProvider>
          </StyledArticle>
        </PostContainer>
      </Container>
    </Layout>
  );
};

export default PageTemplate;
