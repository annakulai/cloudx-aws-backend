import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const region = 'us-east-1';

export const ddbClient = new DynamoDBClient({
  region,
});
