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
        }
      }
    }`,
};
