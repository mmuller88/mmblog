const path = require('path')
const { createFilePath, createFileNode } = require(`gatsby-source-filesystem`)
const _ = require('lodash');

// Add schema customization to handle image fields in frontmatter
exports.createSchemaCustomization = ({ actions }) => {
    const { createTypes } = actions
    
    const typeDefs = `
        type MarkdownRemark implements Node {
            frontmatter: MarkdownRemarkFrontmatter
        }
        
        type MarkdownRemarkFrontmatter {
            title: String
            date: Date @dateformat
            tags: [String]
            image: File @fileByRelativePath
            engUrl: String
            gerUrl: String
            showContact: String
            show: String
            pruneLength: Int
            tldr: String
            faq: [MarkdownRemarkFrontmatterFaq]
        }
        
        type MarkdownRemarkFrontmatterFaq {
            q: String
            a: String
        }
    `
    
    createTypes(typeDefs)
}

exports.createPages = ({ actions, graphql }) => {
    const { createPage } = actions

    return new Promise((resolve, reject) => {
        resolve(
            graphql(`
        {
          posts: allMarkdownRemark(
            filter: { fileAbsolutePath: {regex : "\/content/"} }
            sort: { order: DESC, fields: [frontmatter___date] }
            limit: 1000
          ) {
            edges {
              node {
                fields {
                  slug
                }
                frontmatter {
                  title
                  tags
                }
              }
            }
          }
        }
      `).then(result => {
                    if (result.errors) {
                        console.log(result.errors)
                        return reject(result.errors)
                    }

   const posts = result.data.posts.edges;
   const blogTemplate = path.resolve('./src/templates/blog-post.js');
   const tagsTemplate = path.resolve('./src/templates/tag-template.js');

                    //All tags
                    let allTags = []
        // Iterate through each post, putting all found tags into `allTags array`
             _.each(posts, edge => {
            if (_.get(edge, 'node.frontmatter.tags')) {
                 allTags = allTags.concat(edge.node.frontmatter.tags)
             }
          })
            // Eliminate duplicate tags
            allTags = _.uniq(allTags)

            allTags.forEach((tag, index) => {
                createPage({
                 path: `tags/${_.kebabCase(tag)}/`,
                component: tagsTemplate,
                context: {
                    tag,
                    }
                })
                })

            posts.forEach(({ node }, index) => {
                createPage({
                path: node.fields.slug,
                component: blogTemplate,
                context: {
                slug: node.fields.slug,
                prev: index === 0 ? null : posts[index - 1],
                next: index === result.length - 1 ? null : posts[index + 1],
                 },
               })
             })
            return
        })
        )
    })
}

exports.onCreateNode = ({ node, getNode, actions }) => {
    const { createNodeField } = actions
    if (node.internal.type === `MarkdownRemark`) {
        const slug = createFilePath({ node, getNode, basePath: `pages` })
        createNodeField({
            node,
            name: `slug`,
            value: slug,
        })
    }
}