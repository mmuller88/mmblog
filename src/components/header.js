import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import twitterLogo from "../images/icons/twitter.svg"
// import avatarIcon from "../images/avatarIcon.jpeg"
import inLogo from "../images/icons/in.svg"
import ghLogo from "../images/icons/gh.svg"
import threadsIcon from "../images/threads.png"
import ThemeToggle from "./ThemeToggle"

const Header = ({ siteTitle }) => (
 <header
  style={{
   background: `#00aced`,
   marginBottom: `1.45rem`,
  }}
 >
  <div
   className="navigation"
   style={{
    margin: `0 auto`,
    maxWidth: 960,
    padding: `1.45rem 1.0875rem`,
   }}
  >
   <div className="float-right mr-[0.3rem] flex items-center gap-[0.3rem] text-white">
     <a
      href="https://github.com/mmuller88"
      target="_blank"
      rel="noopener noreferrer"
      title="GitHub"
      className="flex h-5 w-5 items-center justify-center"
     >
      <img
       src={ghLogo}
       width="20"
       height="20"
       alt="github"
       className="mb-0 block h-5 w-5 rounded-full"
      />
     </a>
     <a
      href="https://www.linkedin.com/in/martinmueller88/"
      target="_blank"
      rel="noopener noreferrer"
      title="LinkedIn"
      className="flex h-5 w-5 items-center justify-center"
     >
      <img
       src={inLogo}
       width="20"
       height="20"
       alt="LinkedIn"
       className="mb-0 block h-5 w-5 rounded-full"
      />
     </a>
     <a
      href="https://www.threads.net/@martinmuellerdev"
      target="_blank"
      rel="noopener noreferrer"
      title="Threads"
      className="flex h-5 w-5 items-center justify-center"
     >
      <img
       src={threadsIcon}
       width="20"
       height="20"
       alt="Threads"
       className="mb-0 block h-5 w-5 rounded-full"
      />
     </a>
     <a
      href="https://www.twitter.com/MartinMueller_"
      target="_blank"
      rel="noopener noreferrer"
      title="Twitter"
      className="flex h-5 w-5 items-center justify-center"
     >
      <img
       src={twitterLogo}
       width="20"
       height="20"
       alt="Twitter"
       className="mb-0 block h-5 w-5 rounded-full"
      />
     </a>
     <ThemeToggle />
   </div>
   <div>
    <h1
     className="row m-0 inline-block"
     style={{
      marginLeft: 0,
      alignItems: `center`,
     }}
    >
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
      to="/agency"
      style={{
       color: `white`,
       textDecoration: `none`,
      }}
     >
      {" "}|| Agency |
     </Link>
     <Link
      to="/tags/eyf/"
      style={{
       color: `white`,
       textDecoration: `none`,
      }}
     >
      | Podcast |
     </Link>
     <Link
      to="/resume"
      style={{
       color: `white`,
       textDecoration: `none`,
      }}
     >
      | Resume
     </Link>
    </h1>
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
