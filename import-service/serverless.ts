import { importFileParser, importProductsFile } from '@functions/index';
import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  useDotenv: true,
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    httpApi: {
      cors: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      SQS_URL:
        'https://sqs.us-east-1.amazonaws.com/080108551761/catalogItemsQueue',
      BASIC_AUTH_ARN: '${env:BASIC_AUTH_ARN}',
    },
    region: 'us-east-1',
    profile: '080108551761_Hanna_Kulai',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:ListBucket',
        Resource: 'arn:aws:s3:::import-service-aws-cloudx',
      },
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: 'arn:aws:s3:::import-service-aws-cloudx/*',
      },
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: 'arn:aws:sqs:us-east-1:080108551761:catalogItemsQueue',
      },
    ],
  },
  functions: { importProductsFile, importFileParser },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
