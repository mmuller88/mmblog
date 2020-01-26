import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import twitterLogo from "../images/icons/twitter.svg"
import avatarIcon from "../images/avatarIcon.jpeg"

const Header = ({ siteTitle }) => (
  <header
    style={{
      background: `#00aced`,
      marginBottom: `1.45rem`,
    }}
  >
    <div className='navigation'
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `1.45rem 1.0875rem`,
      }}
    >
      <h1 class="row" style={{ margin: 0, marginLeft: 20, display: `inline-block`,
    alignItems: `center`}}>
        <Link
          to="/"
          style={{
            color: `white`,
            textDecoration: `none`,
          }}
        >
          {siteTitle}
        </Link>
      </h1>
      <div style={{float:`right`, borderRadius: "25px"}}>
        <a href='https://www.twitter.com/MartinMueller_' target="_blank" rel='noopener'><img  src={twitterLogo} width='40' height='40' alt="twitter" style={{borderRadius: "25px"}}/> </a>
        <a href='https://www.h-o.dev' target="_blank" rel='noopener'><img  src={avatarIcon} width='40' height='40' alt="avatarIcon" style={{borderRadius: "25px"}}/> </a>
      </div>
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
