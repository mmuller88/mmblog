module.exports = {
  siteMetadata: {
    title: 'Martin Mueller\'s Blog ',
    description: 'tech blog about aws',
    siteUrl: 'https://martinmueller.dev',
    author: '@mmuller88',
    social: {
      twitter: 'MartinMueller_',
      github: 'mmuller88',
      linkedin: 'martinmueller88',
    },
    menu: [
      {
        name: 'blog',
        url: '/blog',
      },
      {
        name: 'resume',
        url: '/resume',
      },
      {
        name: 'projects',
        url: '/projects',
      },
    ],
    contactLabel: 'Contact me',
    blogPathPrefix: '/blog',
    subscriptionCallbackUrl: 'null',
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-gdpr-cookies',
      options: {
        googleAnalytics: {
          trackingId: 'UA-170834724-1',
        },
        environments: ['production', 'development'],
      },
    },
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-170834724-1',
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
            serialize: ({ query: { site, allSitePost } }) => allSitePost.nodes.filter((node) => node.tags.includes('eng') && !node.tags.includes('nofeed')).map((node) => ({
              ...node,
              description: node.excerpt,
              date: node.date,
              url: site.siteMetadata.siteUrl + node.slug,
              guid: site.siteMetadata.siteUrl + node.slug,
              categories: node.tags,
              enclosure: node.image && {
                url: site.siteMetadata.siteUrl + node.image.publicURL,
              },
              custom_elements: [
                { 'content:encoded': node.html },
                {
                  featuredImage: node.image
                    ? site.siteMetadata.siteUrl
                          + node.image.publicURL : undefined,
                },
              ],
            })),
            query: `
                {
                  allSitePost(
                    sort: { order: DESC, fields: [date] }
                  ) {
                    nodes {
                      excerpt
                      html
                      slug
                      title
                      date
                      tags
                      image {
                        publicURL
                      }
                    }
                  }
                }
              `,
            output: '/rss.xml',
            title: "Martin Mueller's Blog",
          },
          {
            serialize: ({ query: { site, allSitePost } }) => allSitePost.nodes.filter((node) => node.tags.includes('de') && !node.tags.includes('nofeed')).map((node) => ({
              ...node,
              description: node.excerpt,
              date: node.date,
              url: site.siteMetadata.siteUrl + node.slug,
              guid: site.siteMetadata.siteUrl + node.slug,
              categories: node.tags,
              enclosure: node.image && {
                url: site.siteMetadata.siteUrl + node.image.publicURL,
              },
              custom_elements: [
                { 'content:encoded': node.html },
                {
                  featuredImage: node.image
                    ? site.siteMetadata.siteUrl
                          + node.image.publicURL : undefined,
                },
              ],
            })),
            query: `
                {
                  allSitePost(
                    sort: { order: DESC, fields: [date] }
                  ) {
                    nodes {
                      excerpt
                      html
                      slug
                      title
                      date
                      tags
                      image {
                        publicURL
                      }
                    }
                  }
                }
              `,
            output: '/rss-ger.xml',
            title: "Martin Mueller's Blog Ger",
          },
        ],
      },
    },
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-remark-images',
      options: {
        // It's important to specify the maxWidth (in pixels) of
        // the content container as this plugin uses this as the
        // base for generating different widths of each image.
        maxWidth: 800,
        linkImagesToOriginal: true,
        showCaptions: true,
        disableBgImage: true,
      },
    },
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Martin Muellers Blog',
        short_name: 'mmblog',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'src/images/avatarIcon.jpeg', // This path is relative to the root of the site.
      },
    },
    'gatsby-plugin-catch-links',
    'gatsby-plugin-offline',
    {
      resolve: 'gatsby-transformer-remark',
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/_data/comments`,
        name: 'comments',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'blog',
        path: `${__dirname}/content`,
      },
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        extensions: ['.mdx', '.md'],
        defaultLayouts: {
          default: require.resolve('./src/templates/display/page.jsx'),
        },
        gatsbyRemarkPlugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 720,
            },
          },
          {
            resolve: 'gatsby-remark-responsive-iframe',
            options: {
              wrapperStyle: 'margin-bottom: 1.0725rem',
            },
          },
          {
            resolve: 'gatsby-remark-autolink-headers',
            options: {
              icon: false,
            },
          },
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
        ],
      },
    },
    'gatsby-plugin-anchor-links',
    'gatsby-plugin-emotion',
  ],
};
