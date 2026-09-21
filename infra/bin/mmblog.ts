#!/usr/bin/env node
import { App, Aspects } from "aws-cdk-lib"
import { AwsSolutionsChecks } from "cdk-nag"
import { MmblogStack } from "../lib/mmblog-stack"

const app = new App()
new MmblogStack(app, "MmblogStack", {
  env: { account: "981237193288", region: "us-east-1" },
  description: "martinmueller.dev static site + API",
})
Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }))
