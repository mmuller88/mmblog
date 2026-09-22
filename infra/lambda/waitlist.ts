import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { wrapHttp, errMsg } from "./adapter"
import { getSecrets } from "./lib/secrets"
import { sendEmail } from "./lib/ses"
import {
  bearerMatches,
  cleanText,
  confirmMessage,
  confirmUrl,
  courseFor,
  courseSlugs,
  emfLine,
  hashToken,
  isConfirmToken,
  isValidEmail,
  newConfirmToken,
  normalizeLocale,
  pkFor,
  skFor,
  slugFromPk,
  thankYouLocation,
  toCsv,
  welcomeMessage,
  type CsvRow,
  type Locale,
} from "./lib/waitlist"

const doc = DynamoDBDocumentClient.from(new DynamoDBClient({}))

type Stored = {
  pk: string
  sk: string
  email?: string
  name?: string
  locale?: string
  source?: string
  discountPriceEur?: number
  listPriceEur?: number
  confirmed?: boolean
  signedUpAt?: string
  confirmedAt?: string
}

const tableName = (): string | undefined => process.env.WAITLIST_TABLE

const siteUrl = (): string =>
  (process.env.SITE_URL || "https://martinmueller.dev").replace(/\/$/, "")

const isConditional = (err: unknown): boolean =>
  err instanceof Error && err.name === "ConditionalCheckFailedException"

const getItem = async (pk: string, sk: string): Promise<Stored | undefined> => {
  const TableName = tableName()
  if (!TableName) return undefined
  const out = await doc.send(new GetCommand({ TableName, Key: { pk, sk } }))
  return out.Item as Stored | undefined
}

const queryCourse = async (slug: string): Promise<Stored[]> => {
  const TableName = tableName()
  if (!TableName) return []
  const items: Stored[] = []
  let startKey: Record<string, unknown> | undefined
  do {
    const out = await doc.send(
      new QueryCommand({
        TableName,
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
  return items
}

const findByToken = async (hash: string): Promise<Stored | undefined> => {
  const TableName = tableName()
  if (!TableName) return undefined
  const out = await doc.send(
    new QueryCommand({
      TableName,
      IndexName: "confirmToken",
      KeyConditionExpression: "confirmTokenHash = :h",
      ExpressionAttributeValues: { ":h": hash },
      Limit: 1,
    })
  )
  return out.Items?.[0] as Stored | undefined
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

const localeOf = (value: unknown): Locale => normalizeLocale(value)

const signup = async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return new Response("method not allowed", { status: 405 })
  }
  const TableName = tableName()
  if (!TableName) return new Response("server not configured", { status: 500 })

  const raw = await req.text()
  if (raw.length > 8192) return new Response("payload too large", { status: 413 })

  let body: Record<string, unknown>
  try {
    body = JSON.parse(raw) as Record<string, unknown>
  } catch {
    return new Response("invalid json", { status: 400 })
  }

  if (cleanText(body.botField, 200)) return Response.json({ ok: true })

  const courseSlug = cleanText(body.courseSlug, 80)
  const course = courseFor(courseSlug)
  if (!course) return new Response("unknown course", { status: 400 })

  const email = cleanText(body.email, 254).toLowerCase()
  if (!isValidEmail(email)) return new Response("invalid email", { status: 400 })

  const name = cleanText(body.name, 120)
  const locale = localeOf(body.locale)
  const source = cleanText(body.source, 200)
  const pk = pkFor(courseSlug)
  const sk = skFor(email)
  let token = newConfirmToken()
  const signedUpAt = new Date().toISOString()

  try {
    await doc.send(
      new PutCommand({
        TableName,
        Item: {
          pk,
          sk,
          email,
          name,
          locale,
          source,
          discountTier: "early-bird",
          discountPriceEur: course.earlyBirdPriceEur,
          listPriceEur: course.listPriceEur,
          confirmed: false,
          confirmTokenHash: hashToken(token),
          signedUpAt,
        },
        ConditionExpression: "attribute_not_exists(pk)",
      })
    )
  } catch (err) {
    if (!isConditional(err)) {
      console.error("waitlist put error:", errMsg(err))
      return new Response("signup failed", { status: 500 })
    }
    const existing = await getItem(pk, sk)
    if (existing?.confirmed) return Response.json({ ok: true, confirmed: true })

    token = newConfirmToken()
    try {
      await doc.send(
        new UpdateCommand({
          TableName,
          Key: { pk, sk },
          UpdateExpression:
            "SET confirmTokenHash = :h, #name = :name, locale = :locale, #source = :source, discountPriceEur = :early, listPriceEur = :list",
          ConditionExpression:
            "attribute_not_exists(confirmed) OR confirmed = :false",
          ExpressionAttributeNames: { "#name": "name", "#source": "source" },
          ExpressionAttributeValues: {
            ":h": hashToken(token),
            ":name": name,
            ":locale": locale,
            ":source": source,
            ":early": course.earlyBirdPriceEur,
            ":list": course.listPriceEur,
            ":false": false,
          },
        })
      )
    } catch (updateErr) {
      if (!isConditional(updateErr)) {
        console.error("waitlist update error:", errMsg(updateErr))
        return new Response("signup failed", { status: 500 })
      }
      const again = await getItem(pk, sk)
      if (again?.confirmed) return Response.json({ ok: true, confirmed: true })
      return new Response("signup failed", { status: 500 })
    }
  }

  const mail = confirmMessage({
    title: course.title,
    confirmUrl: confirmUrl(siteUrl(), token),
    earlyBirdPriceEur: course.earlyBirdPriceEur,
    listPriceEur: course.listPriceEur,
    locale,
  })

  try {
    await sendEmail({ to: email, subject: mail.subject, message: mail.message })
  } catch (err) {
    console.error("waitlist confirm ses error:", errMsg(err))
    return new Response("send failed", { status: 502 })
  }

  console.log(emfLine("Signup", courseSlug))
  return Response.json({ ok: true, confirmed: false })
}

const confirm = async (req: Request): Promise<Response> => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return new Response("method not allowed", { status: 405 })
  }
  const TableName = tableName()
  if (!TableName) return new Response("server not configured", { status: 500 })

  const token = new URL(req.url).searchParams.get("token") || ""
  if (!isConfirmToken(token)) return new Response("invalid token", { status: 400 })

  const item = await findByToken(hashToken(token))
  if (!item?.email) return new Response("invalid token", { status: 400 })

  const slug = slugFromPk(item.pk)
  const course = courseFor(slug)
  const locale = localeOf(item.locale)
  let freshlyConfirmed = false

  try {
    await doc.send(
      new UpdateCommand({
        TableName,
        Key: { pk: item.pk, sk: item.sk },
        UpdateExpression:
          "SET confirmed = :true, confirmedAt = :now REMOVE confirmTokenHash",
        ConditionExpression: "confirmTokenHash = :h",
        ExpressionAttributeValues: {
          ":true": true,
          ":now": new Date().toISOString(),
          ":h": hashToken(token),
        },
      })
    )
    freshlyConfirmed = true
  } catch (err) {
    if (!isConditional(err)) {
      console.error("waitlist confirm error:", errMsg(err))
      return new Response("confirm failed", { status: 500 })
    }
    const current = await getItem(item.pk, item.sk)
    if (!current?.confirmed) return new Response("invalid token", { status: 400 })
  }

  if (freshlyConfirmed) {
    const mail = welcomeMessage({
      title: course?.title ?? slug,
      earlyBirdPriceEur: Number(item.discountPriceEur ?? course?.earlyBirdPriceEur ?? 0),
      listPriceEur: Number(item.listPriceEur ?? course?.listPriceEur ?? 0),
      locale,
    })
    try {
      await sendEmail({ to: item.email, subject: mail.subject, message: mail.message })
    } catch (err) {
      console.error("waitlist welcome ses error:", errMsg(err))
    }
    console.log(emfLine("Confirm", slug))
  }

  return new Response(null, {
    status: 302,
    headers: { Location: thankYouLocation(siteUrl(), locale, slug) },
  })
}

const admin = async (req: Request): Promise<Response> => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return new Response("method not allowed", { status: 405 })
  }

  const secrets = await getSecrets()
  const key = secrets.WAITLIST_ADMIN_KEY || ""
  if (!key) return new Response("server not configured", { status: 500 })
  if (!bearerMatches(req.headers.get("authorization"), key)) {
    return new Response("unauthorized", { status: 401 })
  }

  const requested = new URL(req.url).searchParams.get("course")
  const slugs = requested ? (courseFor(requested) ? [requested] : null) : courseSlugs()
  if (!slugs) return new Response("unknown course", { status: 400 })

  const rows: CsvRow[] = []
  for (const slug of slugs) {
    const items = await queryCourse(slug)
    rows.push(...items.map(toRow))
  }

  return new Response(toCsv(rows), {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="waitlist.csv"',
    },
  })
}

export const waitlist = async (req: Request): Promise<Response> => {
  const path = new URL(req.url).pathname
  if (path === "/api/admin/waitlist") return admin(req)
  if (path === "/api/waitlist/confirm") return confirm(req)
  if (path === "/api/waitlist") return signup(req)
  return new Response("not found", { status: 404 })
}

export const handler = wrapHttp(waitlist)
