#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import "source-map-support/register";
import { GridsimStack } from "../lib/gridsim-stack";

const app = new cdk.App();
new GridsimStack(app, "GridsimStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
