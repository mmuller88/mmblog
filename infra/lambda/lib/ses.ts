import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2"

const client = new SESv2Client({})

export const sendEmail = async (opts: {
  to: string
  subject: string
  message: string
}): Promise<void> => {
  const from = process.env.FROM_EMAIL
  if (!from) throw new Error("FROM_EMAIL not set")

  await client.send(
    new SendEmailCommand({
      FromEmailAddress: from,
      Destination: { ToAddresses: [opts.to] },
      Content: {
        Simple: {
          Subject: { Data: opts.subject, Charset: "UTF-8" },
          Body: { Text: { Data: opts.message, Charset: "UTF-8" } },
        },
      },
    })
  )
}
