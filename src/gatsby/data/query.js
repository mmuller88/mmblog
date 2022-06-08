module.exports.data = {
  posts: `
  {
      allSitePost(
        sort: { fields: [date], order: ASC }
        limit: 1000
      ) {
        nodes {
          id
          slug
          title
          show
        }
      }
      tags: allSitePost(limit: 2000) {
        group(field: frontmatter___tags) {
          fieldValue
        }
      }
    }`,
};
