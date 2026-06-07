/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */
require("./src/styles/global.css")

// PrismJS syntax highlighting theme
require("prismjs/themes/prism-tomorrow.css")
require("./src/styles/inline-code.css")
require("./src/styles/tool-icons.css")

// Load PrismJS core first
require("prismjs")

// Additional PrismJS language support (loaded after core)
require("prismjs/components/prism-typescript")
require("prismjs/components/prism-jsx")
require("prismjs/components/prism-tsx")
require("prismjs/components/prism-bash")
require("prismjs/components/prism-yaml")
require("prismjs/components/prism-json")
require("prismjs/components/prism-docker")
require("prismjs/components/prism-python")

// You can delete this file if you're not using it
require('gatsby-remark-vscode/styles.css');
