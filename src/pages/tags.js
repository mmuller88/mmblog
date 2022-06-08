import React from 'react';
import { Link, graphql } from 'gatsby';
import 'twin.macro';

import { Title } from '../components/title';
import Layout from '../components/layout';
import SEO from '../components/seo';
import Container from '../components/container';

function TagsPage(props) {
  const data = props.data.allSitePost.group;

  return (
    <Layout>
      <SEO title="Tags" />
      <Container>
        <Title>All tags</Title>
        {data.map((tag) => (
          <Link
            tw="text-primary text-2xl"
            to={`/tags/${tag.fieldValue}`}
            key={tag.fieldValue}
          >
            {tag.fieldValue}
            {' '}
            {`(${tag.totalCount})`}
            ,
            {' '}
          </Link>
        ))}
      </Container>
    </Layout>
  );
}

export default TagsPage;

export const tagPageQuery = graphql`
{
  allSitePost(
   filter: { tags: { eq: "eng" } }
   limit: 2000
  ) {
   group(field: tags) {
    fieldValue
    totalCount
   }
  }
 }
`;
