import React, { useState } from "react"
import { navigate } from "gatsby"

const inputClass =
 "w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-slate-600 dark:bg-slate-900 dark:text-gray-100"

const TrainingRequestForm = ({
 trainingSlug,
 trainingTitle,
 locale,
 pageUrl,
 labels,
}) => {
 const [state, setState] = useState({
  "first-name": "",
  "last-name": "",
  email: "",
  company: "",
  format: "",
  "team-size": "",
  message: "",
 })
 const [honeypot, setHoneypot] = useState("")
 const [status, setStatus] = useState("idle")

 const handleChange = (e) => {
  const { name, value } = e.target
  setState((prev) => ({ ...prev, [name]: value }))
 }

 const handleSubmit = async (e) => {
  e.preventDefault()
  if (honeypot) {
   navigate("/thx/")
   return
  }

  setStatus("submitting")

  try {
   const res = await fetch("/api/forms", {
    method: "POST",
    headers: {
     "Content-Type": "application/x-www-form-urlencoded",
     Accept: "application/json",
    },
    body: new URLSearchParams(new FormData(e.target)).toString(),
   })

   if (!res.ok) throw new Error(`HTTP ${res.status}`)
   navigate("/thx/")
  } catch {
   setStatus("error")
  }
 }

 return (
  <form
   name="training-request"
   method="post"
   action="/api/forms"
   onSubmit={handleSubmit}
   className="space-y-4"
  >
   <input type="hidden" name="form-name" value="training-request" />
   <input type="hidden" name="training" value={trainingTitle} />
   <input type="hidden" name="training-slug" value={trainingSlug} />
   <input type="hidden" name="locale" value={locale} />
   <input type="hidden" name="url" value={pageUrl} />
   <input type="hidden" name="redirect" value="/thx/" />
   <p className="hidden">
    <label>
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
   <div className="grid gap-4 sm:grid-cols-2">
    <div>
     <label
      htmlFor="training-first-name"
      className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
     >
      {labels.firstName}
     </label>
     <input
      id="training-first-name"
      type="text"
      name="first-name"
      required
      autoComplete="given-name"
      value={state["first-name"]}
      onChange={handleChange}
      className={inputClass}
     />
    </div>
    <div>
     <label
      htmlFor="training-last-name"
      className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
     >
      {labels.lastName}
     </label>
     <input
      id="training-last-name"
      type="text"
      name="last-name"
      required
      autoComplete="family-name"
      value={state["last-name"]}
      onChange={handleChange}
      className={inputClass}
     />
    </div>
   </div>
   <div>
    <label
     htmlFor="training-email"
     className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
     {labels.email}
    </label>
    <input
     id="training-email"
     type="email"
     name="email"
     required
     autoComplete="email"
     value={state.email}
     onChange={handleChange}
     className={inputClass}
    />
   </div>
   <div>
    <label
     htmlFor="training-company"
     className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
     {labels.company}
    </label>
    <input
     id="training-company"
     type="text"
     name="company"
     autoComplete="organization"
     value={state.company}
     onChange={handleChange}
     className={inputClass}
    />
   </div>
   <fieldset>
    <legend className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
     {labels.format}
    </legend>
    <div className="flex flex-wrap gap-4">
     {[
      ["on-site", labels.formatOnsite],
      ["remote", labels.formatRemote],
     ].map(([value, label]) => (
      <label
       key={value}
       className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300"
      >
       <input
        type="radio"
        name="format"
        value={value}
        required
        checked={state.format === value}
        onChange={handleChange}
       />
       {label}
      </label>
     ))}
    </div>
   </fieldset>
   <div>
    <label
     htmlFor="training-team-size"
     className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
     {labels.teamSize}
    </label>
    <select
     id="training-team-size"
     name="team-size"
     required
     value={state["team-size"]}
     onChange={handleChange}
     className={inputClass}
    >
     <option value="">{labels.teamSizePlaceholder}</option>
     {labels.teamSizes.map((option) => (
      <option key={option.value} value={option.value}>
       {option.label}
      </option>
     ))}
    </select>
   </div>
   <div>
    <label
     htmlFor="training-message"
     className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
     {labels.message}
    </label>
    <textarea
     id="training-message"
     name="message"
     rows={5}
     required
     value={state.message}
     onChange={handleChange}
     className={inputClass}
    />
   </div>
   {status === "error" ? (
    <p className="text-sm text-red-700 dark:text-red-300">{labels.error}</p>
   ) : null}
   <button
    type="submit"
    disabled={status === "submitting"}
    className="w-full rounded-lg bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
   >
    {status === "submitting" ? labels.submitting : labels.submit}
   </button>
   <p className="text-sm text-gray-600 dark:text-gray-400">{labels.privacy}</p>
  </form>
 )
}

export default TrainingRequestForm
