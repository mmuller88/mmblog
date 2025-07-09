module.exports = {
  siteMetadata: {
    title: `Martin Mueller's Blog`,
    description: `Technology blog featuring AWS, CDK, serverless, and cloud architecture insights by Martin Mueller - AWS Solutions Architect and software engineer.`,
    siteUrl: 'https://martinmueller.dev',
    author: `Martin Mueller`,
    social: {
      twitter: `@MartinMueller_`,
      github: `mmuller88`,
      linkedin: `martin-mueller-dev`
    },
    keywords: [
      'AWS', 'Cloud Computing', 'Serverless', 'CDK', 'Infrastructure as Code', 
      'Software Engineering', 'DevOps', 'Technology Blog', 'Martin Mueller'
    ],
    language: 'en',
    locale: 'en_US'
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
            loading: 'lazy',
            quality: 90,
            withWebp: true,
            tracedSVG: true
          },
        },
        {
          resolve: `gatsby-remark-prismjs`,
          options: {
            // Class prefix for <pre> tags containing syntax highlighting;
            // defaults to 'language-' (e.g. <pre class="language-js">).
            classPrefix: "language-",
            // This is used to allow setting a language for inline code
            // (i.e. single backticks) by creating a separator.
            inlineCodeMarker: null,
            // This lets you set up language aliases.  For example,
            // setting this to '{ sh: "bash" }' will let you use
            // the language "sh" which will highlight using the
            // bash highlighter.
            aliases: {},
            // This toggles the display of line numbers globally alongside the code.
            showLineNumbers: false,
            // If setting this to true, the parser won't handle and highlight inline
            // code used in markdown i.e. single backtick code like `this`.
            noInlineHighlight: false,
            // This adds a new language definition to Prism or extend an existing
            // language definition. More details on this option can be found
            // under the header "Add new language definition or extend an existing
            // language definition" below.
            languageExtensions: [
              {
                language: "superscript",
                extend: "javascript",
                definition: {
                  superscript_types: /(SuperType)/,
                },
                insertBefore: {
                  function: {
                    superscript_keywords: /(superif|superelse)/,
                  },
                },
              },
            ],
            // Customize the prompt used in shell output
            // Values below are default
            prompt: {
              user: "root",
              host: "localhost",
              global: false,
            },
            // By default the HTML entities <>&" are escaped.
            // Add additional HTML escapes by providing a mapping
            // of HTML entities and their escape value IE: { '}': '&#123;' }
            escapeEntities: {},
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
        head: false,
        anonymize: true,
        respectDNT: true,
        defer: true
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
              description: "Latest posts from Martin Mueller's technology blog"
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
              description: "Neueste Beiträge aus Martin Muellers Technologie-Blog"
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
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        output: `/sitemap.xml`,
        exclude: [`/dev-404-page`, `/404`, `/404.html`, `/offline-plugin-app-shell-fallback`],
        query: `
          {
            allSitePage {
              nodes {
                path
              }
            }
            allMarkdownRemark {
              nodes {
                fields {
                  slug
                }
                frontmatter {
                  date
                }
              }
            }
          }
        `,
        resolveSiteUrl: () => 'https://martinmueller.dev',
        serialize: ({ path, frontmatter }) => {
          return {
            url: path,
            changefreq: path === '/' ? 'weekly' : 'monthly',
            priority: path === '/' ? 1.0 : 0.8,
            lastmod: frontmatter?.date
          }
        }
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'Martin Mueller\'s Blog',
        short_name: 'MM Blog',
        description: 'Technology blog featuring AWS, CDK, serverless, and cloud architecture insights',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'src/images/avatarIcon.jpeg', // This path is relative to the root of the site.
        cache_busting_mode: 'query',
        include_favicon: true,
        legacy: true,
        theme_color_in_head: true
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
