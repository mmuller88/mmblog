import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda"

const GET_HEAD = new Set(["GET", "HEAD"])

export type HttpFn = (req: Request) => Promise<Response>

export const wrapHttp =
  (fn: HttpFn) =>
  async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    const method = event.requestContext?.http?.method ?? "GET"
    const rawPath = event.rawPath ?? "/"
    const qs = event.rawQueryString ? `?${event.rawQueryString}` : ""
    const url = `https://${event.requestContext?.domainName ?? "lambda"}${rawPath}${qs}`

    const headers = new Headers()
    for (const [key, value] of Object.entries(event.headers ?? {})) {
      if (value) headers.set(key, value)
    }

    let body: string | Buffer | undefined
    if (!GET_HEAD.has(method) && event.body) {
      body = event.isBase64Encoded
        ? Buffer.from(event.body, "base64")
        : event.body
    }

    const req = new Request(url, { method, headers, body })
    const res = await fn(req)
    const resHeaders: Record<string, string> = {}
    res.headers.forEach((value, key) => {
      resHeaders[key] = value
    })

    return {
      statusCode: res.status,
      headers: resHeaders,
      body: await res.text(),
    }
  }

export const wrapScheduled =
  (fn: () => Promise<Response>) => async (): Promise<unknown> => {
    const res = await fn()
    const text = await res.text()
    if (!res.ok) {
      throw new Error(text || `health ${res.status}`)
    }
    return JSON.parse(text) as unknown
  }

export const errMsg = (err: unknown): string =>
  err instanceof Error ? err.message : String(err)
