import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: '/products',
        cors: true,
        bodyType: 'ProductBody',
        responseData: {
          200: {
            description: 'OK',
          },
          400: {
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
