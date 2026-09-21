#!/usr/bin/env tsx
import conversionHealth from "./conversion-health"

async function main(): Promise<void> {
  const res = await conversionHealth()
  const text = await res.text()
  console.log(`HTTP ${res.status}`)
  console.log(text)
  if (!res.ok) process.exit(1)
}

void main()
