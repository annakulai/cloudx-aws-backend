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
};

export const successResponse = (
  response,
  statusCode: number = 200
): Response => ({
  statusCode,
  headers: {
    ...defaultHeaders,
  },
  body: JSON.stringify(response),
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
  headers: {
    ...defaultHeaders,
  },
  body: JSON.stringify({
    message: message || 'Something went wrong...',
  }),
});
