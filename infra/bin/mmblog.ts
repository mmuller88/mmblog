#!/usr/bin/env node
import { App, Validations } from "aws-cdk-lib"
import { AwsSolutionsChecks } from "cdk-nag"
import { MmblogStack } from "../lib/mmblog-stack"

const app = new App()
new MmblogStack(app, "MmblogStack", {
  env: { account: "981237193288", region: "us-east-1" },
  description: "martinmueller.dev static site + API",
})
Validations.of(app).addPlugins(
  new AwsSolutionsChecks(app, {
    verbose: true,
    writeSuppressionsToCloudFormation: true,
  })
)
