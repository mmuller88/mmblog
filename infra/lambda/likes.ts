import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb"
import { wrapHttp } from "./adapter"

const doc = DynamoDBDocumentClient.from(new DynamoDBClient({}))

const slugKey = (slug: string): string =>
  slug.replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9_-]/gi, "_") || "root"

export const likes = async (req: Request): Promise<Response> => {
  const url = new URL(req.url)
  const slug = url.searchParams.get("slug")
  if (!slug) return new Response("missing slug", { status: 400 })

  const TableName = process.env.LIKES_TABLE
  if (!TableName) return new Response("server not configured", { status: 500 })

  const key = slugKey(slug)

  if (req.method === "POST") {
    const out = await doc.send(
      new UpdateCommand({
        TableName,
        Key: { slug: key },
        UpdateExpression: "ADD #c :one",
        ExpressionAttributeNames: { "#c": "count" },
        ExpressionAttributeValues: { ":one": 1 },
        ReturnValues: "UPDATED_NEW",
      })
    )
    return Response.json({ slug, count: Number(out.Attributes?.count ?? 0) })
  }

  if (req.method !== "GET") {
    return new Response("method not allowed", { status: 405 })
  }

  const out = await doc.send(new GetCommand({ TableName, Key: { slug: key } }))
  return Response.json({ slug, count: Number(out.Item?.count ?? 0) })
}

export const handler = wrapHttp(likes)
