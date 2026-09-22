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
import OaiqPixel from "./OaiqPixel"
import "./layout.css"

const Layout = ({ children, fullWidth = false }) => (
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
  render={(data) => (
   <>
    <OaiqPixel />
    <Header siteTitle={data.site.siteMetadata.title} />
    {fullWidth ? (
     <>
      <main>{children}</main>
      <footer className="mx-auto max-w-[960px] px-[1.0875rem] pb-[1.45rem]">
       © {new Date().getFullYear()} Martin Mueller (
       <a href={"https://martinmueller.dev/impressum"}>Impressum</a>) Built with
       {` `}
       <a href="https://www.gatsbyjs.org">Gatsby</a> and
       {` `}
       <a href="https://aws.amazon.com">AWS</a>
      </footer>
     </>
    ) : (
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
       © {new Date().getFullYear()} Martin Mueller (
       <a href={"https://martinmueller.dev/impressum"}>Impressum</a>) Built with
       {` `}
       <a href="https://www.gatsbyjs.org">Gatsby</a> and
       {` `}
       <a href="https://aws.amazon.com">AWS</a>
      </footer>
     </div>
    )}
   </>
  )}
 />
)

Layout.propTypes = {
 children: PropTypes.node.isRequired,
 fullWidth: PropTypes.bool,
}

export default Layout
