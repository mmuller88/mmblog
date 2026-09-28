export type ScorecardKeyword = {
  tag: string
  keyword: string
  path: string
}

// vibe coding has no URL until the P1 post exists.
export const SCORECARD: ScorecardKeyword[] = [
  { tag: "p0", keyword: "chatgpt ads", path: "/chatgpt-ads-learnings-de/" },
  { tag: "p0", keyword: "chatgpt werbung", path: "/chatgpt-ads-learnings-de/" },
  {
    tag: "p0",
    keyword: "chatgpt ads agentur",
    path: "/one-man-agency-de/gpt/",
  },
  {
    tag: "p0",
    keyword: "openclaw sicherheit",
    path: "/openclaw-sicherheit-de/",
  },
  {
    tag: "p1",
    keyword: "mcp server",
    path: "/sistrix-mcp-hallocasa-seo-de/",
  },
  { tag: "p1", keyword: "geo optimierung", path: "/one-man-agency-de/seo-geo/" },
  { tag: "p1", keyword: "ki sichtbarkeit", path: "/one-man-agency-de/seo-geo/" },
  {
    tag: "p2",
    keyword: "aws lambda cloudformation",
    path: "/aws-deploy-cfn-with-lambda/",
  },
  { tag: "p2", keyword: "aws cdk", path: "/opennext-cdk-de/" },
  { tag: "p2", keyword: "opennext", path: "/opennext-cdk-de/" },
  { tag: "—", keyword: "martin mueller", path: "/" },
]
