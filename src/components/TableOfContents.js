import React, { useEffect, useMemo, useState } from "react"

function TableOfContents({ headings, tags }) {
  const items = useMemo(
    () =>
      (headings || []).filter(
        (h) => h.id && (h.depth === 2 || h.depth === 3)
      ),
    [headings]
  )
  const [activeId, setActiveId] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(items.length <= 8)

  useEffect(() => {
    if (items.length < 2) return undefined

    const elements = items
      .map((h) => document.getElementById(h.id))
      .filter(Boolean)
    if (!elements.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [items])

  if (items.length < 2) return null

  const label = tags?.includes("de") ? "Inhalt" : "Contents"

  const onClick = (e, id) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: "smooth", block: "start" })
    const { pathname, search } = window.location
    window.history.replaceState(null, "", `${pathname}${search}#${id}`)
    setActiveId(id)
  }

  const renderList = () => (
    <ul className="m-0 list-none space-y-1.5 p-0">
      {items.map((h) => (
        <li key={h.id} className={h.depth === 3 ? "pl-4" : ""}>
          <a
            href={`#${h.id}`}
            onClick={(e) => onClick(e, h.id)}
            className={`block text-sm no-underline hover:text-brand ${
              activeId === h.id
                ? "font-medium text-brand"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {h.value}
          </a>
        </li>
      ))}
    </ul>
  )

  return (
    <nav
      aria-label={label}
      className="mb-8 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/50"
    >
      <div className="hidden md:block">
        <p className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
          {label}
        </p>
        {renderList()}
      </div>
      <details
        className="md:hidden"
        open={mobileOpen}
        onToggle={(e) => setMobileOpen(e.currentTarget.open)}
      >
        <summary className="cursor-pointer text-sm font-semibold text-gray-900 dark:text-gray-100">
          {label}
        </summary>
        <div className="mt-2">{renderList()}</div>
      </details>
    </nav>
  )
}

export default TableOfContents
