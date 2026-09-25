const React = require("react")
const { Writable } = require("stream")
const { renderToPipeableStream } = require("react-dom/server")
const { HelmetProvider } = require("react-helmet-async")
const { resetSsrHead, getSsrHead } = require("./src/utils/ssrHead")

const HOISTED = /^(title|link|meta|script|style|base|noscript)$/i

exports.wrapRootElement = ({ element }) => {
 resetSsrHead()
 return React.createElement(HelmetProvider, null, element)
}

const renderToHtml = (element) =>
 new Promise((resolve, reject) => {
  let settled = false
  const done = (err, html) => {
   if (settled) return
   settled = true
   if (err) reject(err)
   else resolve(html)
  }
  const { pipe } = renderToPipeableStream(element, {
   onAllReady() {
    const chunks = []
    const writable = new Writable({
     write(chunk, _enc, cb) {
      chunks.push(chunk)
      cb()
     },
    })
    writable.on("finish", () =>
     done(null, Buffer.concat(chunks).toString("utf8"))
    )
    writable.on("error", done)
    pipe(writable)
   },
   onError(error) {
    done(error)
   },
  })
 })

const parseAttrs = (raw) => {
 const attrs = {}
 const re = /([^\s=]+)(?:=(?:"([^"]*)"|'([^']*)'|(\S+)))?/g
 let match = re.exec(raw)
 while (match) {
  const key = match[1]
  if (key !== "/") {
   attrs[key] = match[2] ?? match[3] ?? match[4] ?? ""
  }
  match = re.exec(raw)
 }
 return attrs
}

const takeTag = (html) => {
 const open = html.match(/^<([a-zA-Z0-9]+)(\s[^>]*)?>/)
 if (!open || !HOISTED.test(open[1])) return null
 const name = open[1].toLowerCase()
 const attrs = parseAttrs(open[2] || "")
 const selfClosing =
  /\/>\s*$/.test(open[0]) || ["link", "meta", "base"].includes(name)
 if (selfClosing) {
  return { name, attrs, children: "", rest: html.slice(open[0].length) }
 }
 const close = `</${name}>`
 const end = html.toLowerCase().indexOf(close, open[0].length)
 if (end === -1) return null
 return {
  name,
  attrs,
  children: html.slice(open[0].length, end),
  rest: html.slice(end + close.length),
 }
}

const splitHoisted = (html) => {
 const tags = []
 let rest = html.replace(/^\s+/, "")
 let tag = takeTag(rest)
 while (tag) {
  tags.push(tag)
  rest = tag.rest.replace(/^\s+/, "")
  tag = takeTag(rest)
 }
 return { tags, body: rest }
}

const toElement = (tag, index) => {
 const { children, ...attrs } = { ...tag.attrs }
 const props = { key: `hoisted-${index}`, ...attrs }
 if (tag.children) props.dangerouslySetInnerHTML = { __html: tag.children }
 return React.createElement(tag.name, props)
}

exports.replaceRenderer = async ({
 bodyComponent,
 replaceBodyHTMLString,
 setHeadComponents,
 setHtmlAttributes,
}) => {
 let html
 try {
  html = await renderToHtml(bodyComponent)
 } catch (error) {
  if (error && error.name === "RedirectRequest") {
   replaceBodyHTMLString("")
   return
  }
  throw error
 }
 const { tags, body } = splitHoisted(html)
 replaceBodyHTMLString(body)
 if (tags.length) setHeadComponents(tags.map(toElement))
 setHtmlAttributes({ lang: getSsrHead().lang })
}
