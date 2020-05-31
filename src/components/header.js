import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import twitterLogo from "../images/icons/twitter.svg"
// import avatarIcon from "../images/avatarIcon.jpeg"
import inLogo from "../images/icons/in.svg"
import ghLogo from "../images/icons/gh.svg"

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
      <h1 class="row" style={{ margin: 0, marginLeft: 0, display: `inline-block`,
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
        <Link
            to="/resume"
            style={{
              color: `white`,
              textDecoration: `none`,
              // paddingLeft: "7cm"
            }}
          >
          || Resume |
          </Link>
          <Link
            to="/projects"
            style={{
              color: `white`,
              textDecoration: `none`,
              // paddingLeft: "7cm"
            }}
          >
          | Projects
          </Link>
          <div style={{color: "white", marginLeft:'0.5rem', float:`right`, borderRadius: "25px"}}>
        {/* <a href='https://martinmueller.dev/resume' target="_blank" rel='noopener'>Resume</a> */}
        <a href='https://github.com/mmuller88' target="_blank" rel='noopener' style={{color: 'white', marginRight:'0.3rem', display:'inline-block'}}><img src={ghLogo} textDecoration='none' width='20px' height='20px' alt="github" style={{borderRadius: "25px"}}/></a>
        <a href='https://www.twitter.com/MartinMueller_' target="_blank" rel='noopener' style={{color: 'white', marginRight:'0.3rem', display:'inline-block'}}><img  src={twitterLogo} width='20px' height='20px' alt="twitter" style={{borderRadius: "25px"}}/></a> 
        <a href='https://www.linkedin.com/in/martinmueller88/' target="_blank" rel='noopener' style={{color: 'white', display:'inline-block'}}><img  src={inLogo} width='20px' height='20px' alt="avatarIcon" style={{borderRadius: "25px"}}/></a>
        </div>
      </h1>
      
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
