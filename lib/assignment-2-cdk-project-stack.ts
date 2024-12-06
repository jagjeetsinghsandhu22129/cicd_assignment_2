import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class Assignment2CdkProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 Bucket
    const myBucket = new s3.Bucket(this, 'MyBucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Only for development purposes
    });

    // Lambda Function
    const myLambda = new lambda.Function(this, 'MyLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = async () => {
          return { statusCode: 200, body: "Hello from Lambda!" };
        }
      `),
      environment: {
        BUCKET_NAME: myBucket.bucketName, // Pass bucket name to Lambda environment
      },
    });

    // Grant the Lambda function permissions to interact with the S3 bucket
    myBucket.grantReadWrite(myLambda);

    // DynamoDB Table
    const myTable = new dynamodb.Table(this, 'MyTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      tableName: 'MyTable',
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Only for development purposes
    });

    // Grant the Lambda function permissions to read/write from the DynamoDB table
    myTable.grantReadWriteData(myLambda);
  }
}
