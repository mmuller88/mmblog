import React, { useEffect, useState } from "react"

function SunIcon() {
 return (
  <svg
   xmlns="http://www.w3.org/2000/svg"
   viewBox="0 0 24 24"
   fill="none"
   stroke="currentColor"
   strokeWidth="2"
   strokeLinecap="round"
   strokeLinejoin="round"
   aria-hidden="true"
   className="block h-5 w-5"
  >
   <circle cx="12" cy="12" r="5" />
   <line x1="12" y1="1" x2="12" y2="3" />
   <line x1="12" y1="21" x2="12" y2="23" />
   <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
   <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
   <line x1="1" y1="12" x2="3" y2="12" />
   <line x1="21" y1="12" x2="23" y2="12" />
   <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
   <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
 )
}

function MoonIcon() {
 return (
  <svg
   xmlns="http://www.w3.org/2000/svg"
   viewBox="0 0 24 24"
   fill="none"
   stroke="currentColor"
   strokeWidth="2"
   strokeLinecap="round"
   strokeLinejoin="round"
   aria-hidden="true"
   className="block h-5 w-5"
  >
   <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
 )
}

export default function ThemeToggle() {
 const [isDark, setIsDark] = useState(null)

 useEffect(() => {
  setIsDark(document.documentElement.classList.contains("dark"))
 }, [])

 const toggle = () => {
  const next = !document.documentElement.classList.contains("dark")
  document.documentElement.classList.toggle("dark", next)
  localStorage.setItem("theme", next ? "dark" : "light")
  setIsDark(next)
 }

 if (isDark === null) {
  return (
   <button
    type="button"
    title="Toggle dark mode"
    className="flex h-5 w-5 shrink-0 items-center justify-center border-0 bg-transparent p-0 m-0 leading-none text-white opacity-0"
    aria-hidden="true"
    tabIndex={-1}
   />
  )
 }

 return (
  <button
   type="button"
   onClick={toggle}
   title={isDark ? "Switch to light mode" : "Switch to dark mode"}
   className="flex h-5 w-5 shrink-0 items-center justify-center border-0 bg-transparent p-0 m-0 leading-none text-white hover:opacity-80 transition-opacity"
   aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
  >
   {isDark ? <SunIcon /> : <MoonIcon />}
  </button>
 )
}
