import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: '/products/{productId}',
        cors: true,
        responseData: {
          200: {
            bodyType: 'Product',
          },
          404: {
            bodyType: 'ErrorResponse',
          },
          500: {
            bodyType: 'ErrorResponse',
          },
        },
      },
    },
  ],
};
