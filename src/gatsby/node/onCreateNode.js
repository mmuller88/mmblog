const { createFilePath } = require('gatsby-source-filesystem');

module.exports = ({
  node, actions, getNode, createNodeId, createContentDigest,
}) => {
  function generateSlug(...arguments_) {
    return `/${arguments_.join('/')}`.replace(/\/\/+/g, '/');
  }

  if (node.internal.type === 'Mdx') {
    const filePath = createFilePath({ node, getNode });
    const fieldData = {
      slug: node.frontmatter.slug || generateSlug('/', filePath),
      title: node.frontmatter.title,
      subtitle: node.frontmatter.subtitle,
      description: node.frontmatter.description,
      date: node.frontmatter.date,
      posttype: node.frontmatter.posttype,
      image: node.frontmatter.image,
      images: node.frontmatter.images,
      featured: node.frontmatter.featured,
    };
    actions.createNode({
      ...fieldData,
      id: createNodeId(`${node.id} >>> SitePost`),
      parent: node.id,
      children: [],
      tableOfContents: node.tableOfContents,
      internal: {
        type: 'SitePost',
        content: JSON.stringify(fieldData),
        contentDigest: createContentDigest(node.internal.contentDigest),
      },
    });
  }
};
