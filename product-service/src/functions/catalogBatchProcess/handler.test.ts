import { mockClient } from 'aws-sdk-client-mock';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

import { catalogBatchProcess } from './handler';
import { productService } from '@libs/dynamodb-connector';

jest.mock('@libs/dynamodb-connector');

const event = {
  Records: [
    {
      body: JSON.stringify({
        title: 'title',
        description: 'description',
        price: '7',
        image: 'image',
        count: '20',
      }),
    },
  ],
} as any;

const snsMock = mockClient(SNSClient);

describe('catalogBatchProcess function', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    snsMock.reset();
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  it('should return success response', async () => {
    snsMock.on(PublishCommand).resolves({
      MessageId: '12345678-1111-2222-3333-111122223333',
    });
    (productService.createProduct as jest.Mock).mockResolvedValue({});
    process.env.SNS_ARN = '';

    const logSpy = jest.spyOn(global.console, 'log');

    await catalogBatchProcess(event);

    expect(logSpy).toHaveBeenCalledWith('SNS subscription created!');
    expect(snsMock.calls()).toHaveLength(1);
  });

  it("should not trigger sns if the product doesn't create", async () => {
    snsMock.on(PublishCommand).rejects('mocked rejection');
    (productService.createProduct as jest.Mock).mockRejectedValue({});
    process.env.SNS_ARN = '';

    await catalogBatchProcess(event);

    expect(snsMock.calls()).not.toHaveLength(1);
  });
});
