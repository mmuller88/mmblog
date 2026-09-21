import { errMsg } from "../adapter"
import { getSecrets } from "./secrets"
import { sendEmail } from "./ses"

const sendWebhookAlert = async (message: string): Promise<void> => {
  const secrets = await getSecrets()
  const url =
    secrets.CONVERSION_HEALTH_ALERT_URL ||
    process.env.CONVERSION_HEALTH_ALERT_URL
  if (!url) return

  const isSlack = url.includes("hooks.slack.com")
  const body = isSlack ? JSON.stringify({ text: message }) : message

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

export const sendAlert = async (message: string): Promise<void> => {
  const to = process.env.ALERT_EMAIL
  if (to) {
    await sendEmail({
      to,
      subject: "mmblog: conversion-health failed",
      message,
    })
  }
  await sendWebhookAlert(message)
}

export const sendAlertSafe = async (message: string): Promise<void> => {
  try {
    await sendAlert(message)
  } catch (err) {
    console.error("conversion-health alert failed:", errMsg(err))
  }
}
