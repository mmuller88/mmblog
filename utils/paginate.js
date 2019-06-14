const _ = require(`lodash`)

const paginationPath = (path, page, totalPages) => {
  if (page === 0) {
    return '/'
  } else if (page < 0 || page >= totalPages - 2) {
    return ''
  } else {
    return `${path}/${page + 1}`
  }
}

module.exports = (createPage, componentPath, basePath, totalItems, perPage = 3) => {
  debugger
  const totalPages = Math.ceil(totalItems / perPage)
  _.times(totalPages - 2, (index) => {
    createPage({
      // Calculate the path for this page like `/blog`, `/blog/2`
      path: paginationPath(basePath, index, totalPages),
      // Set the component as normal
      component: componentPath,
      // Pass the following context to the component
      context: {
        // Skip this number of posts from the beginning
        skip: index * perPage,
        // How many posts to show on this paginated page
        limit: perPage,
        // How many paginated totalPages there are in total
        totalPages,
        // The path to the previous paginated page (or an empty string)
        prevPath: paginationPath(basePath, index - 1, totalPages),
        // The path to the next paginated page (or an empty string)
        nextPath: paginationPath(basePath, index + 1, totalPages),
      }
    })
  })
}
