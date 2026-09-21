import React, { useState } from "react"
import { measureLeadCreated } from "../utils/oaiq"

const AgencyContactForm = ({ labels }) => {
 const [state, setState] = useState({})
 const [submitted, setSubmitted] = useState(false)

 const handleChange = (e) => {
  setState((prev) => ({ ...prev, [e.target.name]: e.target.value }))
 }

 const handleSubmit = (e) => {
  e.preventDefault()
  const form = e.target
  const url = window?.location?.href ?? ""

  fetch("/api/forms", {
   method: "POST",
   headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
   },
   body: new URLSearchParams({
    "form-name": form.getAttribute("name"),
    ...state,
    url,
   }).toString(),
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
   <p className="hidden">
    <label>
     Don’t fill this out: <input name="bot-field" onChange={handleChange} />
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
     onChange={handleChange}
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
     onChange={handleChange}
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
     onChange={handleChange}
     className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100"
    />
   </div>
   <button
    type="submit"
    className="w-full rounded-lg bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-dark"
   >
    {labels.submit}
   </button>
  </form>
 )
}

export default AgencyContactForm
