import cdk = require("@aws-cdk/core");
import s3 = require("@aws-cdk/aws-s3");
import s3deploy = require("@aws-cdk/aws-s3-deployment");
import lambda = require("@aws-cdk/aws-lambda");
import iam = require("@aws-cdk/aws-iam");
import route53 = require("@aws-cdk/aws-route53");
import route53Targets = require("@aws-cdk/aws-route53-targets");
import events = require("@aws-cdk/aws-events");
import eventsTargets = require("@aws-cdk/aws-events-targets");
import { DnsValidatedCertificate } from "@aws-cdk/aws-certificatemanager";
import { CloudFrontWebDistribution } from "@aws-cdk/aws-cloudfront";

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const websiteBucket = new s3.Bucket(this, "WebsiteBucket", {
      websiteIndexDocument: "index.html",
      publicReadAccess: true
    });

    new s3deploy.BucketDeployment(this, "DeployWebsite", {
      source: s3deploy.Source.asset("../build"),
      destinationBucket: websiteBucket
    });

    const fn = new lambda.Function(this, "copyStatsForIsThisGuyGood", {
      runtime: lambda.Runtime.PYTHON_3_6,
      handler: "lambda_function.lambda_handler",
      code: lambda.Code.asset("./lambdas/copyStatsForIsThisGuyGood"),
      environment: {
        source_bucket: "pagedumps",
        source_key: "mlb/teams/pitchers.json",
        destination_bucket: websiteBucket.bucketName
      }
    });

    const fnTarget = new eventsTargets.LambdaFunction(fn);

    const schedule = events.Schedule.cron({
      day: "*",
      hour: "12",
      minute: "5",
      month: "2-10",
      year: "2019"
    });

    const rule = new events.Rule(this, "ruleCopyStatsForIsThisGuyGood", {
      enabled: true,
      schedule: schedule,
      targets: [fnTarget],
      ruleName: "ruleCopyStatsForIsThisGuyGood"
    });

    let sourceBucketPolicyStatement = new iam.PolicyStatement();
    sourceBucketPolicyStatement.addResources(
      "arn:aws:s3:::pagedumps/mlb/teams/pitchers.json"
    );
    sourceBucketPolicyStatement.addActions("s3:getObject");

    let destinationBucketPolicyStatement = new iam.PolicyStatement();
    destinationBucketPolicyStatement.addResources(
      websiteBucket.bucketArn + "/*"
    );
    destinationBucketPolicyStatement.addActions("s3:putObject");

    fn.addToRolePolicy(sourceBucketPolicyStatement);
    fn.addToRolePolicy(destinationBucketPolicyStatement);

    const hostedzone = new route53.PublicHostedZone(this, "HostedZone", {
      zoneName: "isthisguygood.gq"
    });

    const nameServers = hostedzone.hostedZoneNameServers || [];
    new cdk.CfnOutput(this, "NameServers", {
      description: "NameServers",
      value: cdk.Fn.join(", ", nameServers)
    });

    // I had to set up the hosted zone first
    // Then register the domain (thru freenom)
    // Then come back and put in the certificate stuff

    const certificate = new DnsValidatedCertificate(this, "TestCertificate", {
      domainName: "isthisguygood.gq",
      hostedZone: hostedzone
    });

    const distribution = new CloudFrontWebDistribution(this, "MyDistribution", {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: websiteBucket
          },
          behaviors: [{ isDefaultBehavior: true }]
        }
      ],
      aliasConfiguration: {
        acmCertRef: certificate.certificateArn,
        names: ["isthisguygood.gq"]
      }
    });

    const cloudFrontTarget = new route53Targets.CloudFrontTarget(distribution);

    const arecord = new route53.ARecord(this, "ARecord", {
      target: route53.RecordTarget.fromAlias(cloudFrontTarget),
      zone: hostedzone
    });
  }
}
