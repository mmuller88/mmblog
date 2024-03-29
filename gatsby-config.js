module.exports = {
  siteMetadata: {
    title: `Martin Mueller's Blog `,
    description: `My first blog`,
    siteUrl: 'https://martinmueller.dev',
    author: `@mmuller88`,
  },
  plugins: [
    {
    resolve: `gatsby-transformer-remark`,
    options: {
      plugins: [
        {
          resolve: `gatsby-remark-images`,
          options: {
            // It's important to specify the maxWidth (in pixels) of
            // the content container as this plugin uses this as the
            // base for generating different widths of each image.
            maxWidth: 800,
            linkImagesToOriginal: false,
          },
        },
      ],
    },
    },
    // {
    //   resolve: `gatsby-plugin-disqus`,
    //   options: {
    //     shortname: `MartinMuellerDev`
    //   }
    // },
    'gatsby-plugin-postcss',
    // {
    //   resolve: `gatsby-plugin-gdpr-cookies`,
    //   options: {
    //     googleAnalytics: {
    //       trackingId: 'UA-170834724-1',
    //       // Setting this parameter is optional
    //       // anonymize: true
    //     },
    //     // facebookPixel: {
    //     //   pixelId: 'YOUR_FACEBOOK_PIXEL_ID'
    //     // },
    //     // Defines the environments where the tracking should be available  - default is ["production"]
    //     environments: ['production', 'development']
    //   },
    // },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        // replace "UA-XXXXXXXXX-X" with your own Tracking ID
        trackingId: "UA-170834724-1",
      },
    },
    {
      resolve: 'gatsby-plugin-feed',
        options: {
          query: `
            {
              site {
                siteMetadata {
                  title
                  description
                  siteUrl
                  site_url: siteUrl
                }
              }
            }
          `,
          feeds: [
            {
              serialize: ({ query: { site, allMarkdownRemark } }) => {
                return allMarkdownRemark.edges.filter(edge => edge.node.frontmatter.tags.includes("eng") && !edge.node.frontmatter.tags.includes("nofeed")).map(edge => {
                  return Object.assign({}, edge.node.frontmatter, {
                    description: edge.node.excerpt,
                    date: edge.node.frontmatter.date,
                    url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                    guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                    categories: edge.node.frontmatter.tags,
                    enclosure: edge.node.frontmatter.image && {
                      url: site.siteMetadata.siteUrl + edge.node.frontmatter.image.publicURL,
                    },
                    custom_elements: [
                      { "content:encoded": edge.node.html },
                      {
                        featuredImage:  edge.node.frontmatter.image ?
                          site.siteMetadata.siteUrl +
                          edge.node.frontmatter.image.publicURL : undefined
                      },
                    ],
                  })
                })
              },
              query: `
                {
                  allMarkdownRemark(
                    sort: { order: DESC, fields: [frontmatter___date] }
                  ) {
                    edges {
                      node {
                        excerpt
                        html
                        fields { slug }
                        frontmatter {
                          title
                          date
                          tags
                          image {
                            publicURL
                          }
                        }
                      }
                    }
                  }
                }
              `,
              output: "/rss.xml",
              title: "Martin Mueller's Blog",
            },
            {
              serialize: ({ query: { site, allMarkdownRemark } }) => {
                return allMarkdownRemark.edges.filter(edge => edge.node.frontmatter.tags.includes("de") && !edge.node.frontmatter.tags.includes("nofeed")).map(edge => {
                  return Object.assign({}, edge.node.frontmatter, {
                    description: edge.node.excerpt,
                    date: edge.node.frontmatter.date,
                    url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                    guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                    categories: edge.node.frontmatter.tags,
                    enclosure: edge.node.frontmatter.image && {
                      url: site.siteMetadata.siteUrl + edge.node.frontmatter.image.publicURL,
                    },
                    custom_elements: [
                      { "content:encoded": edge.node.html },
                      {
                        featuredImage:  edge.node.frontmatter.image ?
                          site.siteMetadata.siteUrl +
                          edge.node.frontmatter.image.publicURL : undefined
                      },
                    ],
                  })
                })
              },
              query: `
                {
                  allMarkdownRemark(
                    sort: { order: DESC, fields: [frontmatter___date] }
                  ) {
                    edges {
                      node {
                        excerpt
                        html
                        fields { slug }
                        frontmatter {
                          title
                          date
                          tags
                          image {
                            publicURL
                          }
                        }
                      }
                    }
                  }
                }
              `,
              output: "/rss-ger.xml",
              title: "Martin Mueller's Blog Ger",
            },
          ]
        },
    },
    'gatsby-plugin-react-helmet',
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    // {
    //   resolve: `gatsby-remark-images`,
    //   options: {
    //     // It's important to specify the maxWidth (in pixels) of
    //     // the content container as this plugin uses this as the
    //     // base for generating different widths of each image.
    //     maxWidth: 1200,
    //     linkImagesToOriginal: true,
    //     sizeByPixelDensity: true,
    //     showCaptions: true,
    //   },
    // },
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'gatsby-starter-default',
        short_name: 'starter',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'src/images/avatarIcon.jpeg', // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-catch-links`,
    'gatsby-plugin-offline',
    
    // {
    //   resolve: "gatsby-transformer-remark",
      // options: { // should be wrapped in options
      //   plugins: [
      //     {
      //       resolve: "gatsby-remark-images",
      //       options: {
      //         maxWidth: 5000,
      //         withWebp: true,
      //         showCaptions: true,
      //         quality: 100,
      //       },
      //     },
      //     "gatsby-remark-emoji",
      //   ],
      // }
    // },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/_data/comments`,
        name: 'comments',
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/content`,
      }
    },
    `gatsby-plugin-mdx`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/content`,
      },
    },
    {
      resolve: `gatsby-plugin-page-creator`,
      options: {
        path: `${__dirname}/content`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages`,
      },
    },
    
  ],
}
