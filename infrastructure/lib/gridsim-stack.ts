import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import * as path from "path";

export class GridsimStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create Lambda function for the API
    const apiHandler = new lambda.Function(this, "ApiHandler", {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: "app.main.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "../../backend")),
      environment: {
        STAGE: "prod",
      },
    });

    // Create API Gateway
    const api = new apigateway.RestApi(this, "GridsimApi", {
      restApiName: "GridSim API",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
      },
    });

    // Add Lambda integration to API Gateway
    const integration = new apigateway.LambdaIntegration(apiHandler);
    api.root.addMethod("GET", integration);
    api.root
      .addResource("api")
      .addResource("health")
      .addMethod("GET", integration);

    // Create S3 bucket for frontend
    const frontendBucket = new s3.Bucket(this, "FrontendBucket", {
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Create CloudFront distribution
    const distribution = new cloudfront.Distribution(
      this,
      "FrontendDistribution",
      {
        defaultBehavior: {
          origin: new origins.S3Origin(frontendBucket),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        defaultRootObject: "index.html",
        errorResponses: [
          {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
          },
        ],
      }
    );

    // Output the CloudFront URL
    new cdk.CfnOutput(this, "FrontendUrl", {
      value: distribution.distributionDomainName,
      description: "Frontend URL",
    });

    // Output the API URL
    new cdk.CfnOutput(this, "ApiUrl", {
      value: api.url,
      description: "API URL",
    });
  }
}
