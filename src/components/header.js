import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import twitterLogo from "../images/icons/twitter.svg"
import inLogo from "../images/icons/in.svg"
import ghLogo from "../images/icons/gh.svg"
import threadsIcon from "../images/threads.png"
import ThemeToggle from "./ThemeToggle"

const navLinks = [
  { to: "/one-man-agency", label: "One-Man Agency" },
  { to: "/tags/eyf/", label: "Podcast" },
  { to: "/resume", label: "Resume" },
]

const socialLinks = [
  {
    href: "https://github.com/mmuller88",
    title: "GitHub",
    src: ghLogo,
    alt: "github",
  },
  {
    href: "https://www.linkedin.com/in/martinmueller88/",
    title: "LinkedIn",
    src: inLogo,
    alt: "LinkedIn",
  },
  {
    href: "https://www.threads.net/@martinmuellerdev",
    title: "Threads",
    src: threadsIcon,
    alt: "Threads",
  },
  {
    href: "https://www.twitter.com/MartinMueller_",
    title: "Twitter",
    src: twitterLogo,
    alt: "Twitter",
  },
]

const linkClass = "whitespace-nowrap hover:underline"

const Header = ({ siteTitle }) => (
  <header className="site-header mb-[1.45rem]">
    <div
      className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-[1.45rem] sm:px-6"
    >
      <h1 className="m-0 shrink-0 text-lg font-bold leading-tight sm:text-2xl">
        <Link to="/" className={linkClass}>
          {siteTitle}
        </Link>
      </h1>

      <nav
        className="order-3 flex w-full flex-wrap items-center justify-start gap-x-2 gap-y-1 text-base sm:order-2 sm:w-auto sm:flex-1 sm:justify-center lg:text-lg"
        aria-label="Main navigation"
      >
        {navLinks.map((item, index) => (
          <React.Fragment key={item.to}>
            <span className="site-header__divider select-none" aria-hidden="true">
              ||
            </span>
            <Link to={item.to} className={linkClass}>
              {item.label}
            </Link>
          </React.Fragment>
        ))}
      </nav>

      <div className="order-2 flex shrink-0 items-center gap-1 sm:order-3">
        {socialLinks.map((item) => (
          <a
            key={item.href}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            title={item.title}
            className="flex h-5 w-5 items-center justify-center"
          >
            <img
              src={item.src}
              width="20"
              height="20"
              alt={item.alt}
              className="mb-0 block h-5 w-5 rounded-full"
            />
          </a>
        ))}
        <ThemeToggle />
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
