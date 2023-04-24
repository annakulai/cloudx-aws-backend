import * as dotenv from 'dotenv';
import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/getProductsList';
import getProductById from '@functions/getProductsById';
import createProduct from '@functions/createProduct';
import catalogBatchProcess from '@functions/catalogBatchProcess';

dotenv.config();

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: [
    'serverless-auto-swagger',
    'serverless-offline',
    'serverless-esbuild',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PRODUCTS_TABLE_NAME: process.env.PRODUCTS_TABLE_NAME,
      STOCKS_TABLE_NAME: process.env.STOCKS_TABLE_NAME,
      SQS_URL: {
        Ref: 'SQSQueue',
      },
      SNS_ARN: {
        Ref: 'SNSTopic',
      },
      SNS_SUBSCRIPTION_PRIMARY_EMAIL: '${env:SNS_SUBSCRIPTION_PRIMARY_EMAIL}',
      SNS_SUBSCRIPTION_SECONDARY_EMAIL:
        '${env:SNS_SUBSCRIPTION_SECONDARY_EMAIL}',
    },
    stage: 'dev',
    region: 'us-east-1',
    profile: '080108551761_Hanna_Kulai',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem',
        ],
        Resource: '*',
      },
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: { 'Fn::GetAtt': ['SQSQueue', 'Arn'] },
      },
      {
        Effect: 'Allow',
        Action: 'sns:*',
        Resource: {
          Ref: 'SNSTopic',
        },
      },
    ],
  },
  functions: {
    getProductsList,
    getProductById,
    createProduct,
    catalogBatchProcess,
  },
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
    autoswagger: {
      title: 'string',
      apiType: 'http',
      generateSwaggerOnDeploy: true,
      typefiles: ['./src/types/index.ts'],
      basePath: '/dev',
      host: '',
      schemes: ['https'],
    },
  },
  resources: {
    Resources: {
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue',
        },
      },
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'createProductTopic',
        },
      },
      SNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint:
            '${self:provider.environment.SNS_SUBSCRIPTION_PRIMARY_EMAIL}',
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSTopic',
          },
        },
      },
      SNSSubscriptionFilterByLowPrice: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint:
            '${self:provider.environment.SNS_SUBSCRIPTION_SECONDARY_EMAIL}',
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSTopic',
          },
          FilterPolicyScope: 'MessageAttributes',
          FilterPolicy: {
            price: [{ numeric: ['>=', 100] }],
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
