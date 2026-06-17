import { getStore } from "@netlify/blobs"

export const config = { path: "/api/likes" }

export default async (req) => {
  const url = new URL(req.url)
  const slug = url.searchParams.get("slug")
  if (!slug) return new Response("missing slug", { status: 400 })

  const store = getStore("likes")
  const key =
    slug
      .replace(/^\/+|\/+$/g, "")
      .replace(/[^a-z0-9_-]/gi, "_") || "root"
  let count = Number((await store.get(key)) ?? 0)

  if (req.method === "POST") {
    count += 1
    await store.set(key, String(count))
  }

  return Response.json({ slug, count })
}
