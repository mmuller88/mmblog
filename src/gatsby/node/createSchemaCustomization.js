module.exports = ({ actions }) => {
  const { createTypes, createFieldExtension } = actions;

  const mdxResolverPassthrough = (fieldName) => async (source, args, context, info) => {
    const type = info.schema.getType('Mdx');
    const mdxNode = context.nodeModel.getNodeById({
      id: source.parent,
    });
    const resolver = type.getFields()[fieldName].resolve;
    const result = await resolver(mdxNode, args, context, {
      fieldName,
    });
    return result;
  };

  createFieldExtension({
    name: 'mdxpassthrough',
    args: {
      fieldName: 'String!',
    },
    extend({ fieldName }) {
      return {
        resolve: mdxResolverPassthrough(fieldName),
      };
    },
  });

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "Mdx" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
      footerText: String
      contactLabel: String
      formCallbackUrl: String
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
      instagram: String
      facebook: String
      linkedin: String
      youtube: String
      behance: String
    }

    type SitePost implements Node {
      title: String
      subtitle: String
      description: String
      featured: Boolean
      date: Date @dateformat
      engUrl: String
      slug: String
      show: String
      excerpt(pruneLength: Int = 255): String
      tableOfContents: JSON! @mdxpassthrough(fieldName: "tableOfContents")
      body: String! @mdxpassthrough(fieldName: "body")
      html: String! @mdxpassthrough(fieldName: "html")
    }
  `);
};
