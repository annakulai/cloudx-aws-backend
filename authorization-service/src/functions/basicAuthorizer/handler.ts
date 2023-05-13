import { APIGatewayAuthorizerResult } from 'aws-lambda';
import { Effect } from 'src/types';

const generatePolicy = (
  principalId: string,
  resource: string,
  effect = Effect.Allow
): APIGatewayAuthorizerResult => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
};

const basicAuthorizer = async (event, _, cb) => {
  console.log(event);

  try {
    if (event['type'] !== 'TOKEN') {
      cb('Unauthorized');
    }

    const authorizationToken = event.authorizationToken;

    const encodedCreds = authorizationToken.split(' ')[1];
    const buff = Buffer.from(encodedCreds, 'base64');
    const plainCreds = buff.toString('utf-8').split(':');
    const [username, password] = plainCreds;

    const storedUserPassword = process.env[username];

    const effect =
      !storedUserPassword || storedUserPassword !== password
        ? Effect.Deny
        : Effect.Allow;

    const policy = generatePolicy(encodedCreds, event.methodArn, effect);

    cb(null, policy);
  } catch (error) {
    console.log(error);

    cb(`Unauthorized: ${error.message}`);
  }
};

export const main = basicAuthorizer;
