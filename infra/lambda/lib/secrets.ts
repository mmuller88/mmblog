import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager"

export type AppSecrets = {
  OPENAI_ADS_CAPI_KEY?: string
  CALENDLY_WEBHOOK_SIGNING_KEY?: string
  CONVERSION_HEALTH_ALERT_URL?: string
  WAITLIST_ADMIN_KEY?: string
}

const client = new SecretsManagerClient({})
let cache: AppSecrets | undefined

export const getSecrets = async (): Promise<AppSecrets> => {
  if (cache) return cache
  const arn = process.env.SECRETS_ARN
  if (!arn) throw new Error("SECRETS_ARN not set")

  const out = await client.send(new GetSecretValueCommand({ SecretId: arn }))
  const raw = out.SecretString ?? ""
  try {
    cache = JSON.parse(raw) as AppSecrets
  } catch (err) {
    throw new Error(`Secrets Manager value is not valid JSON: ${String(err)}`)
  }
  return cache
}
