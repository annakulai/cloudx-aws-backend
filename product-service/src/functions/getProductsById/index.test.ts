import { getProductByIdHandler } from './handler';
import { productService } from '@libs/dynamodb-connector';

jest.mock('@libs/lambda');
jest.mock('@libs/dynamodb-connector');
jest.mock('@service/loggerService', () => {
  return {
    default: {
      logRequest: jest.fn(),
      logError: jest.fn(),
    },
  };
});

const event = {
  pathParameters: {
    productId: 1,
  },
};

describe('getProductList handler', () => {
  it('should return success response', async () => {
    (productService.getProductById as jest.Mock).mockResolvedValue({
      id: 1,
      title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
      price: 109.95,
      description:
        'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday',
      count: 120,
    });

    const response = await getProductByIdHandler(event);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      id: 1,
      title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
      price: 109.95,
      description:
        'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday',
      count: 120,
    });
  });

  it('should return error response', async () => {
    (productService.getProductById as jest.Mock).mockRejectedValue(Error);

    const response = await getProductByIdHandler(event);

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).message).toEqual(
      'Something went wrong...'
    );
  });
});
