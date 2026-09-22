import React, { useState } from "react"

const CourseWaitlistForm = ({ courseSlug, locale, labels, thankYouPath }) => {
 const [name, setName] = useState("")
 const [email, setEmail] = useState("")
 const [honeypot, setHoneypot] = useState("")
 const [status, setStatus] = useState("idle")
 const [errorMessage, setErrorMessage] = useState("")

 const handleSubmit = async (e) => {
  e.preventDefault()
  if (honeypot) return

  setStatus("submitting")
  setErrorMessage("")

  try {
   const res = await fetch("/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
     courseSlug,
     name: name.trim(),
     email: email.trim().toLowerCase(),
     locale,
     source: window.location.pathname,
     botField: honeypot,
    }),
   })

   if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
   }

   const data = await res.json().catch(() => ({}))
   setStatus("success")

   const base =
    thankYouPath ||
    (locale === "de"
     ? "/courses-de/waitlist-thank-you/"
     : "/courses/waitlist-thank-you/")
   const params = new URLSearchParams({ course: courseSlug })
   if (data.confirmed) params.set("confirmed", "1")
   window.location.assign(`${base}?${params.toString()}`)
  } catch {
   setStatus("error")
   setErrorMessage(labels.error)
  }
 }

 if (status === "success") {
  return (
   <p className="rounded-lg bg-green-50 p-4 text-center text-green-800 dark:bg-green-900/30 dark:text-green-200">
    {labels.success}
   </p>
  )
 }

 return (
  <form onSubmit={handleSubmit} className="space-y-4">
   <p className="hidden">
    <label>
     {labels.honeypot}
     <input
      type="text"
      name="bot-field"
      value={honeypot}
      onChange={(e) => setHoneypot(e.target.value)}
      tabIndex={-1}
      autoComplete="off"
     />
    </label>
   </p>
   <div>
    <label
     htmlFor="course-waitlist-name"
     className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
     {labels.name}
    </label>
    <input
     id="course-waitlist-name"
     type="text"
     name="name"
     value={name}
     onChange={(e) => setName(e.target.value)}
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
     value={email}
     onChange={(e) => setEmail(e.target.value)}
     className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100"
    />
   </div>
   {status === "error" && errorMessage ? (
    <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-200">
     {errorMessage}
    </p>
   ) : null}
   <button
    type="submit"
    disabled={status === "submitting"}
    className="w-full rounded-lg bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
   >
    {status === "submitting" ? labels.submitting : labels.submit}
   </button>
   <p className="text-center text-sm text-gray-600 dark:text-gray-400">
    {labels.privacy}{" "}
    <a href="/datenschutz/" className="text-brand hover:underline">
     Datenschutz
    </a>
   </p>
  </form>
 )
}

export default CourseWaitlistForm
