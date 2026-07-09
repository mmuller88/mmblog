/**
 * Extract TTS/audio-sync blocks from markdown in the same order as
 * gatsby-transformer-remark (GFM on): p, h*, ul/ol, table, blockquote, pre.
 * Skips thematic breaks (---) — rendered as <hr>, not highlighted.
 */

const remark = require("remark")
const remarkParse = require("remark-parse")
const remarkGfm = require("remark-gfm")

function nodeText(node) {
  if (node.type === "text") return node.value
  if (node.type === "inlineCode") return node.value
  if (!node.children) return ""
  return node.children.map(nodeText).join("")
}

function blockText(node) {
  switch (node.type) {
    case "paragraph":
    case "heading":
    case "blockquote":
      return nodeText(node).trim()
    case "list":
      return node.children
        .map((li) => nodeText(li).trim())
        .filter(Boolean)
        .join(" ")
    case "table":
      return node.children
        .flatMap((row) => row.children.map((cell) => nodeText(cell).trim()))
        .filter(Boolean)
        .join(". ")
    case "code":
      return node.value.trim()
    default:
      return ""
  }
}

function extractAudioBlocks(markdownBody) {
  const tree = remark().use(remarkParse).use(remarkGfm).parse(markdownBody)
  const blocks = []

  for (const node of tree.children) {
    if (node.type === "thematicBreak") continue
    const text = blockText(node)
    if (text) blocks.push(text)
  }

  return blocks
}

module.exports = { extractAudioBlocks }
