#!/usr/bin/env node
// Manual run of the daily conversion health probe (same checks as scheduled function).
import { fileURLToPath } from "node:url"
import path from "node:path"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const handlerPath = path.join(root, "netlify/functions/conversion-health.mjs")

const { default: handler } = await import(handlerPath)
const res = await handler()
const text = await res.text()

console.log(`HTTP ${res.status}`)
console.log(text)

if (!res.ok) process.exit(1)
