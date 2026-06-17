import React, { useEffect, useRef, useState } from "react"
import Giscus from "@giscus/react"
import { useStaticQuery, graphql } from "gatsby"

function getTheme() {
  if (typeof document === "undefined") return "light"
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

export default function Comments({ pathname, lang = "en" }) {
  const [theme, setTheme] = useState("light")
  const [visible, setVisible] = useState(false)
  const wrapperRef = useRef(null)

  const { site } = useStaticQuery(graphql`
    query GiscusConfig {
      site {
        siteMetadata {
          giscus {
            repo
            repoId
            category
            categoryId
            mapping
          }
        }
      }
    }
  `)

  const giscus = site.siteMetadata.giscus

  useEffect(() => {
    setTheme(getTheme())
    const observer = new MutationObserver(() => setTheme(getTheme()))
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return undefined

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { rootMargin: "200px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={wrapperRef} className="my-10 min-h-[120px]">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Comments
      </h2>
      {visible ? (
        <Giscus
          repo={giscus.repo}
          repoId={giscus.repoId}
          category={giscus.category}
          categoryId={giscus.categoryId}
          mapping={giscus.mapping}
          term={pathname}
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme={theme}
          lang={lang}
          loading="lazy"
        />
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading comments…
        </p>
      )}
    </section>
  )
}
