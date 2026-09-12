// Netlify Forms notification → office+netlify@martinmueller.dev (set in UI)
const FORM_NAME = "conversion-health-alert"
const SITE_URL = process.env.URL || "https://martinmueller.dev"

const sendEmailViaNetlifyForm = async (subject, message) => {
 const body = new URLSearchParams({
  "form-name": FORM_NAME,
  subject,
  message,
  "bot-field": "",
 })

 const res = await fetch(SITE_URL, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: body.toString(),
 })

 if (!res.ok) {
  const text = await res.text()
  throw new Error(`netlify form alert ${res.status}: ${text.slice(0, 200)}`)
 }
}

const sendWebhookAlert = async (message) => {
 const url = process.env.CONVERSION_HEALTH_ALERT_URL
 if (!url) return

 const isSlack = url.includes("hooks.slack.com")
 const body = isSlack
  ? JSON.stringify({ text: message })
  : message

 const res = await fetch(url, {
  method: "POST",
  headers: isSlack
   ? { "Content-Type": "application/json" }
   : { "Content-Type": "text/plain; charset=utf-8" },
  body,
 })

 if (!res.ok) {
  const text = await res.text()
  throw new Error(`alert webhook ${res.status}: ${text}`)
 }
}

export const sendAlert = async (message) => {
 const subject = "mmblog: conversion-health failed"
 await sendEmailViaNetlifyForm(subject, message)
 await sendWebhookAlert(message)
}
