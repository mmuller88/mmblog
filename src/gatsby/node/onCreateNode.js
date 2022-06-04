const { createFilePath } = require('gatsby-source-filesystem');

module.exports = ({
  node, actions, getNode, createNodeId, createContentDigest,
}) => {
  function generateSlug(...arguments_) {
    return `/${arguments_.join('/')}`.replace(/\/\/+/g, '/');
  }
  const fm = '---'; // frontmatter
  const end = '<!--excerpt-->'; // excerpt separator
  const prune = 253; // default prune length

  if (node.internal.type === 'Mdx') {
    const filePath = createFilePath({ node, getNode });
    let { content } = node.internal;
    let fmStart = content.indexOf(fm);
    let fmEnd = content.indexOf(fm, fmStart + 1) + fm.length;
    let excerptEnd = content.indexOf(end);
    let ellipsis = excerptEnd === -1 ? '...' : '';
    excerptEnd = excerptEnd === -1
      ? Math.min(content.length, fmEnd + prune)
      : excerptEnd;
    let excerpt = content.substring(fmEnd, excerptEnd) + ellipsis;
    excerpt = excerpt.trim();
    const fieldData = {
      slug: node.frontmatter.slug || generateSlug('/', filePath),
      title: node.frontmatter.title,
      subtitle: node.frontmatter.subtitle,
      description: node.frontmatter.description,
      date: node.frontmatter.date,
      show: node.frontmatter.show,
      image: node.frontmatter.image,
      images: node.frontmatter.images,
      featured: node.frontmatter.featured,
      gerUrl: node.frontmatter.gerUrl,
      engUrl: node.frontmatter.engUrl,
    };
    actions.createNode({
      ...node,
      ...fieldData,
      id: createNodeId(`${node.id} >>> SitePost`),
      parent: node.id,
      children: [],
      tableOfContents: node.tableOfContents,
      excerpt,
      internal: {
        type: 'SitePost',
        content: JSON.stringify(fieldData),
        contentDigest: createContentDigest(node.internal.contentDigest),
      },
    });
  }
};
