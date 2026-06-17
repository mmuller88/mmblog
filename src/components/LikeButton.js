import React, { useEffect, useState } from "react"

function likedKey(slug) {
  return `liked:${slug}`
}

function HeartIcon({ filled }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

export default function LikeButton({ slug }) {
  const [count, setCount] = useState(null)
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    try {
      setLiked(localStorage.getItem(likedKey(slug)) === "1")
    } catch {
      setLiked(false)
    }

    fetch(`/api/likes?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((data) => setCount(data.count))
      .catch(() => setCount(0))
  }, [slug])

  const handleLike = async () => {
    if (liked || loading) return
    setLoading(true)
    setCount((c) => (c ?? 0) + 1)
    setLiked(true)
    try {
      localStorage.setItem(likedKey(slug), "1")
    } catch {
      /* ignore */
    }
    try {
      const res = await fetch(`/api/likes?slug=${encodeURIComponent(slug)}`, {
        method: "POST",
      })
      const data = await res.json()
      setCount(data.count)
    } catch {
      /* keep optimistic count */
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="my-6 flex items-center gap-2">
      <button
        type="button"
        data-testid="like-button"
        onClick={handleLike}
        disabled={liked || loading}
        aria-label={liked ? "Already liked" : "Like this post"}
        className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
          liked
            ? "border-brand bg-brand/10 text-brand cursor-default"
            : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-brand hover:text-brand"
        } disabled:opacity-80`}
      >
        <HeartIcon filled={liked} />
        <span>{count === null ? "…" : count}</span>
      </button>
    </div>
  )
}
