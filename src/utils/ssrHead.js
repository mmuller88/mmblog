/** Per-render SSR bag. gatsby-ssr resets it in wrapRootElement. */
let current = { lang: "en" }

const resetSsrHead = () => {
 current = { lang: "en" }
 return current
}

const getSsrHead = () => current

const setSsrLang = (lang) => {
 current.lang = lang || "en"
}

module.exports = { resetSsrHead, getSsrHead, setSsrLang }
module.exports.default = module.exports
