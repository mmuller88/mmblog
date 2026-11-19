/** Spoken lines. `caption` is burned in; `say` is what the voice reads. */

export const VOICE = 'en-US-Chirp3-HD-Charon'

export const SAMPLE_VOICES = ['en-US-Neural2-D', 'en-US-Chirp3-HD-Charon', 'en-US-Chirp3-HD-Orus'] as const

export const LINES = [
  {
    id: 'hook',
    caption: 'Need AWS infrastructure your team can actually run? Meet Martin, a senior AWS CDK and DevOps engineer.',
    say: 'Need AWS infrastructure your team can actually run? Meet Martin, a senior AWS C D K and DevOps engineer.',
  },
  {
    id: 'stack',
    caption: 'He builds serverless and container platforms with CDK, TypeScript, Lambda, DynamoDB, ECS and Terraform, plus the CI/CD pipelines that ship them.',
    say: 'He builds serverless and container platforms with C D K, TypeScript, Lambda, DynamoDB, E C S and Terraform, plus the C I C D pipelines that ship them.',
  },
  {
    id: 'hallocasa',
    caption: 'He built HalloCasa, an international real-estate platform on Fargate, deployed through a multi-account CDK pipeline.',
    say: 'He built HalloCasa, an international real-estate platform on Fargate, deployed through a multi-account C D K pipeline.',
  },
  {
    id: 'aisecure',
    caption: 'His product AI Secure runs AI agents on Amazon Bedrock AgentCore to audit apps against ISO 27001, SOC 2 and NIST.',
    say: 'His product AI Secure runs AI agents on Amazon Bedrock Agent Core to audit apps against I S O twenty seven thousand one, SOC two, and NIST.',
  },
  {
    id: 'proof',
    caption: 'Over four thousand hours on Upwork. AWS Certified Solutions Architect Professional. AWS Community Builder since 2022.',
    say: 'Over four thousand hours on Upwork. AWS Certified Solutions Architect Professional. AWS Community Builder since twenty twenty-two.',
  },
  {
    id: 'handover',
    caption: 'Every engagement ends with a handover your engineers can run: pipelines, least-privilege IAM and written notes.',
    say: 'Every engagement ends with a handover your engineers can run: pipelines, least-privilege I A M, and written notes.',
  },
  {
    id: 'end',
    caption: 'Invite Martin to your job, or message him right here on Upwork.',
    say: 'Invite Martin to your job, or message him right here on Upwork.',
  },
] as const

export type LineId = (typeof LINES)[number]['id']
