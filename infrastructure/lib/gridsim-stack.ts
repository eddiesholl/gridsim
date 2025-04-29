import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53Targets from "aws-cdk-lib/aws-route53-targets";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import * as path from "path";

export class GridsimStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Get the hosted zone for eddit.io
    const hostedZone = route53.HostedZone.fromLookup(this, "HostedZone", {
      domainName: "eddit.io",
    });

    // Create Lambda function for the API
    const apiHandler = new lambda.DockerImageFunction(this, "ApiHandler", {
      code: lambda.DockerImageCode.fromImageAsset(
        path.join(__dirname, "../../backend"),
        {
          cmd: [
            "python3",
            "-m",
            "awslambdaric",
            "gridsim_backend.app.main.handler",
          ],
        }
      ),
      environment: {
        STAGE: "prod",
      },
      memorySize: 1024, // Adjust based on your needs
      timeout: cdk.Duration.seconds(30), // Adjust based on your needs
      ephemeralStorageSize: cdk.Size.mebibytes(1024), // Adjust if needed
      // reservedConcurrentExecutions: 20, // Limit concurrent executions
    });

    // Create API Gateway
    const api = new apigateway.RestApi(this, "GridsimApi", {
      restApiName: "GridSim API",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
      },
      domainName: {
        domainName: "api.gridsim.eddit.io",
        certificate: new acm.Certificate(this, "ApiCertificate", {
          domainName: "api.gridsim.eddit.io",
          validation: acm.CertificateValidation.fromDns(hostedZone),
        }),
      },
    });

    // Create DNS record for the API
    new route53.ARecord(this, "ApiAliasRecord", {
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(
        new route53Targets.ApiGateway(api)
      ),
      recordName: "api.gridsim",
    });

    // Add Lambda integration to API Gateway
    const integration = new apigateway.LambdaIntegration(apiHandler);

    // Add routes for all FastAPI endpoints
    const apiResource = api.root.addResource("api");

    // Health check endpoint
    apiResource.addResource("health").addMethod("GET", integration);

    // Primitive endpoint
    apiResource.addResource("primitive").addMethod("GET", integration);

    // Add a proxy resource to handle all other routes
    const proxyResource = apiResource.addProxy({
      defaultIntegration: integration,
      anyMethod: true,
    });

    // Create S3 bucket for frontend
    const frontendBucket = new s3.Bucket(this, "FrontendBucket", {
      bucketName: "gridsim-frontend-bucket",
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      publicReadAccess: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
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

    // Upload frontend assets to S3
    new s3deploy.BucketDeployment(this, "FrontendDeployment", {
      sources: [
        s3deploy.Source.asset(path.join(__dirname, "../../frontend/dist")),
      ],
      destinationBucket: frontendBucket,
      distribution, // Invalidate CloudFront cache after deployment
      distributionPaths: ["/*"],
    });

    // Output the CloudFront URL
    new cdk.CfnOutput(this, "FrontendUrl", {
      value: `https://${distribution.distributionDomainName}`,
      description: "URL of the deployed frontend application",
      exportName: `${this.stackName}-FrontendUrl`,
    });

    // Output the API URL
    new cdk.CfnOutput(this, "ApiUrl", {
      value: api.url,
      description: "API URL",
    });
  }
}
