import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        authorizer: {
          arn: 'arn:aws:lambda:us-east-1:080108551761:function:authorization-service-dev-basicAuthorizer',
          type: 'token',
          identitySource: 'method.request.header.Authorization',
          resultTtlInSeconds: 0,
        },
        request: {
          parameters: {
            querystrings: {
              name: true,
            },
          },
        },
      },
    },
  ],
};
