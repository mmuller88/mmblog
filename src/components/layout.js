/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { StaticQuery, graphql } from "gatsby"
import CookieConsent from 'react-cookie-consent';

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
            <a href="https://www.gatsbyjs.org">Gatsby</a> and Netlify
            {` `}
            <a href="https://www.netlify.com"></a>
          </footer>
        </div>
        <CookieConsent
          location="bottom"
          buttonText="Accept"
          enableDeclineButton="true"
          declineButtonText="Decline"
          cookieName="gatsby-gdpr-google-analytics">
          This website stores cookies on your computer. These cookies are used to collect information about how you interact with this website and allow us to remember you.
          We use this information in order to improve and customize your browsing experience and for analytics and metrics about our visitors on this website.
          If you decline, your information won’t be tracked when you visit this website. A single cookie will be used in your browser to remember your preference not to be tracked.
        </CookieConsent>
      </>
    )}
    
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
