import React, { useState } from "react"
import { measureLeadCreated } from "../utils/oaiq"

const AgencyContactForm = ({ labels, page = "" }) => {
 const [submitted, setSubmitted] = useState(false)

 const handleSubmit = (e) => {
  e.preventDefault()
  const form = e.target
  const data = new FormData(form)
  data.set("url", window?.location?.href ?? "")
  data.set("page", window?.location?.pathname || page)
  const utmSource = new URLSearchParams(window?.location?.search || "").get(
   "utm_source"
  )
  if (utmSource) data.set("utm_source", utmSource)
  else data.delete("utm_source")

  fetch("/api/forms", {
   method: "POST",
   headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
   },
   body: new URLSearchParams(data).toString(),
  })
   .then(() => {
    measureLeadCreated()
    setSubmitted(true)
   })
   .catch((err) => console.error("form submit error:", err))
 }

 if (submitted) {
  return (
   <p className="rounded-lg bg-green-50 p-4 text-center text-green-800 dark:bg-green-900/30 dark:text-green-200">
    {labels.success}
   </p>
  )
 }

 return (
  <form
   name="agency-contact"
   method="post"
   action="/api/forms"
   onSubmit={handleSubmit}
   className="space-y-4"
  >
   <input type="hidden" name="form-name" value="agency-contact" />
   <input type="hidden" name="redirect" value="/thx/" />
   <input type="hidden" name="page" value={page} />
   <input type="hidden" name="utm_source" value="" />
   <p className="hidden">
    <label>
     Don’t fill this out: <input name="bot-field" />
    </label>
   </p>
   <div>
    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
     {labels.name}
    </label>
    <input
     type="text"
     name="name"
     required
     className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100"
    />
   </div>
   <div>
    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
     {labels.email}
    </label>
    <input
     type="email"
     name="email"
     required
     className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100"
    />
   </div>
   <div>
    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
     {labels.message}
    </label>
    <textarea
     name="message"
     rows={5}
     required
     className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100"
    />
   </div>
   <button
    type="submit"
    className="w-full rounded-lg bg-brand-solid px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-solidHover"
   >
    {labels.submit}
   </button>
  </form>
 )
}

export default AgencyContactForm
