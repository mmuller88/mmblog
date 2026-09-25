// CloudFront Functions runtime is JS only (not TypeScript).
async function handler(event) {
 var request = event.request
 var host = (request.headers.host && request.headers.host.value) || ""
 var uri = request.uri
 var qs = queryString(request.querystring)

 if (host === "www.martinmueller.dev") {
  return redirect("https://martinmueller.dev" + uri + qs)
 }

 if (uri === "/agency" || uri === "/agency/") {
  return redirect("https://martinmueller.dev/one-man-agency/")
 }

 var training = trainingRedirect(uri)
 if (training) return redirect("https://martinmueller.dev" + training + qs)

 if (uri === "/sitemap.xml" || uri === "/sitemap.xml/") {
  request.uri = "/sitemap.xml/sitemap-index.xml"
  return request
 }

 if (uri.indexOf("/api/") === 0) {
  return request
 }

 if (uri.endsWith("/")) {
  request.uri = uri + "index.html"
 } else if (uri.indexOf(".") === -1) {
  request.uri = uri + "/index.html"
 }

 return request
}

function queryString(qs) {
 var keys = Object.keys(qs)
 if (!keys.length) return ""
 var parts = []
 for (var i = 0; i < keys.length; i++) {
  var key = keys[i]
  var entry = qs[key]
  var values =
   entry.multiValue && entry.multiValue.length
    ? entry.multiValue.map(function (v) {
       return v.value
      })
    : [entry.value]
  for (var j = 0; j < values.length; j++) {
   parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(values[j]))
  }
 }
 return "?" + parts.join("&")
}

function withSlash(path) {
 if (path.charAt(path.length - 1) === "/") return path
 return path + "/"
}

function trainingRedirect(uri) {
 if (
  uri === "/courses/waitlist-thank-you" ||
  uri === "/courses/waitlist-thank-you/"
 ) {
  return "/trainings/"
 }
 if (
  uri === "/courses-de/waitlist-thank-you" ||
  uri === "/courses-de/waitlist-thank-you/"
 ) {
  return "/trainings-de/"
 }
 if (uri === "/courses" || uri === "/courses/") return "/trainings/"
 if (uri === "/courses-de" || uri === "/courses-de/") return "/trainings-de/"
 if (uri.indexOf("/courses/") === 0 && uri.indexOf(".") === -1) {
  return withSlash("/trainings/" + uri.slice("/courses/".length))
 }
 if (uri.indexOf("/courses-de/") === 0 && uri.indexOf(".") === -1) {
  return withSlash("/trainings-de/" + uri.slice("/courses-de/".length))
 }
 return ""
}

function redirect(location) {
 return {
  statusCode: 301,
  statusDescription: "Moved Permanently",
  headers: {
   location: { value: location },
  },
 }
}
