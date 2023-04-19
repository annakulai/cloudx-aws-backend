import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import { main } from './handler';

jest.mock('@libs/lambda', () => ({
  middyfy: (params) => params,
}));

describe('importProductsFile function', () => {
  beforeEach(() => {
    AWSMock.setSDKInstance(AWS);

    AWSMock.mock('S3', 'getSignedUrl', () => {
      console.log('S3', 'getSignedUrl', 'mock called');
      //@ts-ignore
      callback(null, jest.fn());
    });
  });

  it('should return successful response', async () => {
    const response = await main(
      {
        queryStringParameters: {
          name: 'product.csv',
        },
      } as any,
      {} as any,
      {} as any
    );

    expect(response.statusCode).toEqual(200);
  });

  it('should return 400 if file is not provided', async () => {
    const response = await main({} as any, {} as any, {} as any);

    expect(response.statusCode).toEqual(400);
  });
});
