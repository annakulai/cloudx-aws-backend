import { ErrorResponse } from 'src/types';

interface Response {
  statusCode: number;
  body: string;
  headers: {
    [key in string]: string;
  };
}

const defaultHeaders = {
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

export const successResponse = (
  response,
  statusCode: number = 200
): Response => ({
  statusCode,
  // @ts-ignore
  headers: {
    ...defaultHeaders,
  },
  body: JSON.stringify(response?.url),
});

export const errorNonFoundResponse = (message: string) => ({
  statusCode: 404,
  headers: {
    ...defaultHeaders,
  },
  body: JSON.stringify({
    message: message || 'Non found item',
  }),
});

export const errorResponse = ({
  message,
  statusCode = 500,
}: ErrorResponse): Response => ({
  statusCode,
  //@ts-ignore
  headers: {
    ...defaultHeaders,
  },
  body: JSON.stringify({
    message: message || 'Something went wrong...',
  }),
});
