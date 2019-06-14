/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { StaticQuery, graphql } from "gatsby"

import Header from "./header"
import "./layout.css"

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <>
        <Header siteTitle={data.site.siteMetadata.title} />
        <div
          style={{
            margin: `0 auto`,
            maxWidth: 960,
            padding: `0px 1.0875rem 1.45rem`,
            paddingTop: 0,
          }}
        >
          <main>{children}</main>
          <footer>
            © {new Date().getFullYear()} Martin Mueller Built with
            {` `}
            <a href="https://www.gatsbyjs.org">Gatsby</a>
            <div id="amzn-assoc-ad-5831d393-b227-4ce9-b453-2f59df9559cc"></div><script async src="//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=5831d393-b227-4ce9-b453-2f59df9559cc"></script>
          </footer>
          <div id="amzn-assoc-ad-5831d393-b227-4ce9-b453-2f59df9559cc"></div><script async src="//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=5831d393-b227-4ce9-b453-2f59df9559cc"></script>
        </div>
        <div id="amzn-assoc-ad-5831d393-b227-4ce9-b453-2f59df9559cc"></div><script async src="//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=5831d393-b227-4ce9-b453-2f59df9559cc"></script>
      </>
    )}
    
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
