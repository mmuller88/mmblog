import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb"
import { errMsg, wrapScheduled } from "./adapter"
import { sendEmail } from "./lib/ses"
import {
  courseSlugs,
  dailySummaryMessage,
  pkFor,
  slugFromPk,
  type CsvRow,
} from "./lib/waitlist"

const doc = DynamoDBDocumentClient.from(new DynamoDBClient({}))

type Stored = {
  pk: string
  email?: string
  name?: string
  locale?: string
  source?: string
  confirmed?: boolean
  listPriceEur?: number
  discountPriceEur?: number
  signedUpAt?: string
  confirmedAt?: string
}

const toRow = (item: Stored): CsvRow => ({
  course: slugFromPk(item.pk),
  email: item.email ?? "",
  name: item.name ?? "",
  locale: item.locale ?? "",
  source: item.source ?? "",
  confirmed: Boolean(item.confirmed),
  listPriceEur: Number(item.listPriceEur ?? 0),
  earlyBirdPriceEur: Number(item.discountPriceEur ?? 0),
  signedUpAt: item.signedUpAt ?? "",
  confirmedAt: item.confirmedAt ?? "",
})

const listCourse = async (table: string, slug: string): Promise<CsvRow[]> => {
  const items: Stored[] = []
  let startKey: Record<string, unknown> | undefined
  do {
    const out = await doc.send(
      new QueryCommand({
        TableName: table,
        KeyConditionExpression: "pk = :pk AND begins_with(sk, :sk)",
        ExpressionAttributeValues: {
          ":pk": pkFor(slug),
          ":sk": "WAITLIST#",
        },
        ExclusiveStartKey: startKey,
      })
    )
    items.push(...((out.Items ?? []) as Stored[]))
    startKey = out.LastEvaluatedKey
  } while (startKey)
  return items.map(toRow)
}

export const waitlistDigest = async (): Promise<Response> => {
  const table = process.env.WAITLIST_TABLE
  const to = process.env.COURSES_EMAIL
  if (!table || !to) return new Response("server not configured", { status: 500 })

  const rows: CsvRow[] = []
  for (const slug of courseSlugs()) {
    rows.push(...(await listCourse(table, slug)))
  }

  const mail = dailySummaryMessage(rows, new Date())
  try {
    await sendEmail({ to, subject: mail.subject, message: mail.message })
  } catch (err) {
    console.error("waitlist digest ses error:", errMsg(err))
    return new Response("send failed", { status: 502 })
  }

  return Response.json({ ok: true, signups: rows.length })
}

export const handler = wrapScheduled(waitlistDigest)
